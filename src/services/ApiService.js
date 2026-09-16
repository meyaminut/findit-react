/**
 * Service: ApiService
 * Centralized REST API service layer for the FindIt backend.
 * Communicates with https://139-190-96-203.sslip.io/findit/api
 * 
 * Provides:
 * - Health check
 * - Authentication (login/register)
 * - Categories CRUD
 * - Reports CRUD (lost & found)
 * - Matches CRUD (verification/handover)
 * 
 * Falls back gracefully to local StorageService when the API is unreachable.
 */

import { apiClient } from './apiClient';

// ──────────────────────────── HEALTH ────────────────────────────
export async function checkHealth() {
  try {
    const data = await apiClient.get('/health');
    return { online: true, data };
  } catch (err) {
    console.warn('[ApiService] Health check failed:', err.message);
    return { online: false, error: err.message };
  }
}

// ──────────────────────────── AUTH ────────────────────────────
export async function login(email, password) {
  const data = await apiClient.post('/login', { email, password });
  if (data?.data?.token) {
    apiClient.setToken(data.data.token);
    // Store user info
    try {
      localStorage.setItem('findit_user', JSON.stringify(data.data.user || data.data));
    } catch {}
  }
  return data;
}

export async function register(name, email, password) {
  const data = await apiClient.post('/register', { name, email, password });
  return data;
}

export function logout() {
  apiClient.clearToken();
  try {
    localStorage.removeItem('findit_user');
  } catch {}
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem('findit_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getToken() {
  try {
    return (
      localStorage.getItem('findit_token') ||
      sessionStorage.getItem('findit_token') ||
      null
    );
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return !!getToken();
}

// ──────────────────────────── CATEGORIES ────────────────────────────
export async function getCategories() {
  try {
    const data = await apiClient.get('/categories');
    return data?.data || data || [];
  } catch (err) {
    console.warn('[ApiService] getCategories failed:', err.message);
    return [];
  }
}

// ──────────────────────────── REPORTS ────────────────────────────
export async function getReports(type = null) {
  try {
    const endpoint = type ? `/reports?type=${type}` : '/reports';
    const data = await apiClient.get(endpoint);
    return data?.data || data || [];
  } catch (err) {
    console.warn('[ApiService] getReports failed:', err.message);
    return [];
  }
}

export async function getFoundReports() {
  return getReports('found');
}

export async function getLostReports() {
  return getReports('lost');
}

export async function getReportById(id) {
  try {
    const data = await apiClient.get(`/reports/${id}`);
    return data?.data || data || null;
  } catch (err) {
    console.warn('[ApiService] getReportById failed:', err.message);
    return null;
  }
}

export async function createReport(reportData) {
  const payload = {
    user_id: reportData.user_id || reportData.userId || 1,
    type: reportData.type || 'found',
    title: reportData.title || reportData.itemName || 'Barang',
    description: reportData.description || '',
    category: reportData.category || 'Lainnya',
    location: reportData.location || reportData.locationFound || reportData.locationLost || '',
    photo_url: reportData.photo_url || reportData.photoUrl || '',
    status: reportData.status || 'pending',
    activity_note: reportData.activity_note || reportData.activityNote || '',
    item_date: reportData.item_date || reportData.itemDate || new Date().toISOString().split('T')[0],
  };
  const data = await apiClient.post('/reports', payload);
  return data?.data || data;
}

export async function updateReport(id, reportData) {
  const data = await apiClient.put(`/reports/${id}`, reportData);
  return data?.data || data;
}

export async function deleteReport(id) {
  const data = await apiClient.delete(`/reports/${id}`);
  return data;
}

// ──────────────────────────── MATCHES ────────────────────────────
export async function getMatches() {
  try {
    const data = await apiClient.get('/matches');
    return data?.data || data || [];
  } catch (err) {
    console.warn('[ApiService] getMatches failed:', err.message);
    return [];
  }
}

export async function createMatch(lostReportId, foundReportId, similarityScore = 0) {
  const payload = {
    lost_report_id: parseInt(lostReportId, 10) || 0,
    found_report_id: parseInt(foundReportId, 10) || 0,
    status: 'pending',
    similarity_score: similarityScore,
  };
  const data = await apiClient.post('/matches', payload);
  return data?.data || data;
}

export async function verifyMatch(matchId, verifiedBy, handoverMethod = '') {
  const payload = {
    status: 'verified',
    verified_by: parseInt(verifiedBy, 10) || 1,
    handover_method: handoverMethod,
  };
  const data = await apiClient.put(`/matches/${matchId}`, payload);
  return data?.data || data;
}

export async function updateMatchStatus(matchId, status, extra = {}) {
  const payload = {
    status,
    ...extra,
  };
  const data = await apiClient.put(`/matches/${matchId}`, payload);
  return data?.data || data;
}

// ──────────────────────────── SYNC HELPER ────────────────────────────
/**
 * Fetches all data from the live API and returns a consolidated object.
 * Used to hydrate or sync the local StorageService.
 */
export async function fetchAllData() {
  const [health, reports, matches, categories] = await Promise.allSettled([
    checkHealth(),
    getReports(),
    getMatches(),
    getCategories(),
  ]);

  return {
    isOnline: health.status === 'fulfilled' && health.value?.online,
    reports: reports.status === 'fulfilled' ? reports.value : [],
    matches: matches.status === 'fulfilled' ? matches.value : [],
    categories: categories.status === 'fulfilled' ? categories.value : [],
  };
}

// ──────────────────────────── MAP API ↔ LOCAL ────────────────────────────
/**
 * Maps an API report object to the local StorageService format
 * so the existing UI components can consume it without changes.
 */
export function mapApiReportToLocal(apiReport) {
  const isLost = apiReport.type === 'lost';
  const dateStr = apiReport.created_at
    ? new Date(apiReport.created_at).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric'
      })
    : '';
  const timeStr = apiReport.created_at
    ? new Date(apiReport.created_at).toLocaleTimeString('id-ID', {
        hour: '2-digit', minute: '2-digit'
      })
    : '';

  if (isLost) {
    // Map to claim ticket format
    return {
      id: `#TK-API-${apiReport.id || apiReport.ID}`,
      _apiId: apiReport.id || apiReport.ID,
      guestName: apiReport.user?.name || 'Tamu',
      roomNumber: apiReport.location || '-',
      roomType: '-',
      phone: '-',
      email: apiReport.user?.email || '-',
      itemName: apiReport.title || 'Barang Hilang',
      category: apiReport.category || 'Lainnya',
      brand: '-',
      color: '-',
      locationLost: apiReport.location || '-',
      secretDetail: apiReport.description || '-',
      priority: 'Reguler',
      match_status: apiReport.status || 'pending',
      status: mapApiStatusToDisplay(apiReport.status, 'ticket'),
      reportedAt: `${dateStr}, ${timeStr} WIB`,
      createdAt: apiReport.created_at || new Date().toISOString(),
      _source: 'api',
    };
  } else {
    // Map to found item format
    return {
      id: `#LF-API-${apiReport.id || apiReport.ID}`,
      _apiId: apiReport.id || apiReport.ID,
      name: apiReport.title || 'Barang Temuan',
      roomNumber: '-',
      category: apiReport.category || 'Lainnya',
      locationFound: apiReport.location || '-',
      storageLocation: 'Brankas Utama FO',
      finderName: apiReport.user?.name || 'Staf',
      foundAt: `${dateStr}, ${timeStr} WIB`,
      match_status: apiReport.status || 'pending',
      status: mapApiStatusToDisplay(apiReport.status, 'item'),
      photoUrl: apiReport.photo_url || '',
      description: apiReport.description || '',
      activityNote: apiReport.activity_note || '',
      createdAt: apiReport.created_at || new Date().toISOString(),
      _source: 'api',
    };
  }
}

/**
 * Maps API status string to the display label used in the UI.
 */
function mapApiStatusToDisplay(apiStatus, type = 'ticket') {
  const statusMap = {
    'pending': type === 'ticket' ? 'Menunggu Verifikasi' : 'Di Brankas FO',
    'diverifikasi': type === 'ticket' ? 'Terverifikasi' : 'Terverifikasi',
    'verified': type === 'ticket' ? 'Terverifikasi' : 'Terverifikasi',
    'approved': type === 'ticket' ? 'Terverifikasi' : 'Diklaim & Diserahkan',
    'completed': type === 'ticket' ? 'Selesai Diserahkan' : 'Diklaim & Diserahkan',
    'rejected': type === 'ticket' ? 'Ditolak' : 'Ditolak',
    'claimed': type === 'ticket' ? 'Selesai Diserahkan' : 'Diklaim & Diserahkan',
  };
  return statusMap[apiStatus] || (type === 'ticket' ? 'Menunggu Verifikasi' : 'Di Brankas FO');
}

/**
 * Maps a local StorageService object back to API format for creating/updating.
 */
export function mapLocalToApiReport(localItem, type = 'found') {
  return {
    type,
    title: localItem.name || localItem.itemName || 'Barang',
    description: localItem.secretDetail || localItem.description || '',
    category: localItem.category || 'Lainnya',
    location: localItem.locationFound || localItem.locationLost || localItem.roomNumber || '',
    photo_url: localItem.photoUrl || '',
    status: 'pending',
    activity_note: localItem.activityNote || '',
    item_date: new Date().toISOString().split('T')[0],
  };
}

// ──────────────────────────── DEFAULT EXPORT ────────────────────────────
const ApiService = {
  checkHealth,
  login,
  register,
  logout,
  getCurrentUser,
  getToken,
  isAuthenticated,
  getCategories,
  getReports,
  getFoundReports,
  getLostReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
  getMatches,
  createMatch,
  verifyMatch,
  updateMatchStatus,
  fetchAllData,
  mapApiReportToLocal,
  mapLocalToApiReport,
};

export default ApiService;
