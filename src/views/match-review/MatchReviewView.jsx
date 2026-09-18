import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  CheckCircle2, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  ArrowRight, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  X, 
Check,
  AlertCircle,
  Package,
  Link2
} from 'lucide-react';
import Sidebar from '../dashboard/components/Sidebar';
import TopNavbar from '../dashboard/components/TopNavbar';
import { StorageService } from '../../services/StorageService';
import ApiService from '../../services/ApiService';
import {
  applyMatchDecision,
  applyMatchDecisionLocal,
  isApiCandidate,
} from '../../services/matchSync';
import { isReportAwaiting, isReportVerified, reportStatusLabel } from '../../services/reportStatus';
import { MatchReviewModel } from '../../models/MatchReviewModel';
import {
  normalizePhone,
  buildWhatsAppUrl,
  buildNotificationMessage,
  notifEventLabel,
  WHATSAPP_EVENTS,
} from '../../services/whatsapp';
import WhatsAppPreviewModal from '../dashboard/components/WhatsAppPreviewModal';
import './MatchReviewView.css';

/**
 * View Component: MatchReviewView (Verifikasi & Pencocokan)
 * Master Data Table layout mirroring the Found Items (Barang Temuan) master inventory.
 * Displays all guest claim tickets, automatically pairs them with Housekeeping found item candidates,
 * and provides an interactive inspection modal for FO verification.
 */

// ──── API→UI mapping helpers (API-first) ────
// Backend melayani file foto di path /uploads relatif terhadap host (nginx
// strip /findit). API base dibaca dari env; potong suffix /api untuk akar host.
const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (/^(https?:)?\/\//i.test(url)) return url;
  const envUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
  const base = envUrl.replace(/\/api\/?/i, '');
  if (!base) return url;
  return `${base}${url.startsWith('/') ? url : `/${url}`}`;
};

const formatReportTimestamp = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  return `${dateStr}, ${timeStr} WIB`;
};

// Konversi satu report live (lost) menjadi ticket UI + kandidat (dari match & found report).
/**
 * Ekstrak nomor WhatsApp tamu dari laporan lost, dari berbagai bentuk field
 * yang mungkin dikirim backend Go (camelCase / snake_case / bersarang user).
 * Diprioritaskan sebagai sumber utama karena banyak laporan tidak punya
 * `user_id` (tamu melapor tanpa login / dibuat petugas via front desk).
 */
const extractReportPhone = (r) => {
  if (!r) return '';
  return (
    r.phone ||
    r.phone_number ||
    r.guest_phone ||
    r.guest_phone_number ||
    r.guestPhone ||
    r.contact_phone ||
    r.phoneNumber ||
    r.wa_number ||
    r.whatsapp ||
    r.user?.phone ||
    r.user?.phone_number ||
    r.user?.guest_phone ||
    r.guest?.phone ||
    r.contact ||
    r.contact_number ||
    r.phone_no ||
    r.phoneOrWa ||
    ''
  );
};

const buildApiTickets = (reports, matches) => {
  const list = Array.isArray(reports) ? reports : [];
  const matchList = Array.isArray(matches) ? matches : [];
  const lostReports = list.filter((r) => String(r.type || '').toLowerCase() === 'lost');
  const foundReports = list.filter((r) => String(r.type || '').toLowerCase() === 'found');
  const foundById = new Map(foundReports.map((f) => [String(f.id ?? f.ID), f]));
  const isActiveMatch = (m) => String(m.status || '').toLowerCase() !== 'rejected';

  return lostReports.map((r) => {
    const reportId = String(r.id ?? r.ID);
    const pairMatch = matchList.find((m) => String(m.lost_report_id) === reportId && isActiveMatch(m)) || null;
    let candidate = null;

    if (pairMatch) {
      const foundId = String(pairMatch.found_report_id ?? '');
      const found = foundById.get(foundId) || null;
      candidate = {
        id: `match-${pairMatch.id ?? pairMatch.ID}`,
        _apiId: pairMatch.id ?? pairMatch.ID,
        _source: 'api',
        lost_report_id: pairMatch.lost_report_id,
        found_report_id: foundId,
        name: found?.title || (foundId ? `Barang Temuan #${foundId}` : 'Barang Temuan'),
        category: found?.category || pairMatch.category || '',
        photoUrl: resolveMediaUrl(found?.photo_url || ''),
        finderName: found?.user?.name || '',
        roomNumber: found?.room_number || '',
        locationFound:
          found?.location || (found?.room_number ? `Kamar ${found.room_number}` : pairMatch.location || ''),
        foundAt: formatReportTimestamp(found?.created_at),
        description: found?.description || '',
        notes: pairMatch.activity_note || '',
        matchStatus: pairMatch.status || 'pending',
      };
    }

    return {
      id: r.report_identifier || `#RPT-${reportId}`,
      reportIdentifier: r.report_identifier || '',
      _apiId: reportId,
      _source: 'api',
      priority: r.priority || 'Reguler',
      guestName: r.user?.name || r.name || r.guest_name || 'Tamu',
      roomNumber: r.room_number || r.roomNumber || '',
      roomType: r.room_type || '',
      itemName: r.title || 'Barang',
      category: r.category || 'Lainnya',
      color: r.color || '',
      locationLost: r.location || (r.room_number ? `Kamar ${r.room_number}` : ''),
      description: r.description || '',
      status: reportStatusLabel(r.status, 'lost'),
      statusRaw: r.status,
      reportedAt: formatReportTimestamp(r.created_at),
      createdAt: r.created_at || new Date().toISOString(),
      _userId: r.user_id ?? r.userId ?? r.user?.id ?? null,
      _userPhone: extractReportPhone(r),
      _candidate: candidate,
    };
  });
};

// Opsi barang temuan yang tersedia untuk dipasangkan manual ke 1 laporan lost.
// Hanya found ber-status 'baru' yang belum terikat match aktif (non-rejected).
// Urut: kecocokan kamar lalu kategori, sebagai saran jujur berbasis data.
const buildFoundPickerOptions = (ticket, reports, matches) => {
  const reportList = Array.isArray(reports) ? reports : [];
  const matchList = Array.isArray(matches) ? matches : [];
  const foundReports = reportList.filter(
    (r) => String(r.type || '').toLowerCase() === 'found'
  );
  const activeMatchFoundIds = new Set(
    matchList
      .filter((m) => String(m.status || '').toLowerCase() !== 'rejected')
      .map((m) => String(m.found_report_id))
      .filter(Boolean)
  );
  const pool = foundReports.filter((f) => {
    const isAvailable =
      String(f.status || '').toLowerCase() === 'baru' &&
      !activeMatchFoundIds.has(String(f.id ?? f.ID));
    return isAvailable;
  });

  const normalize = (s) => (s || '').trim().toLowerCase();
  const ticketRoom = String(ticket?.roomNumber || '').trim();
  const ticketCat = normalize(ticket?.category);

  const suggestionScore = (f) => {
    let score = 0;
    const foundRoom = String(f.room_number || '').trim();
    const foundCat = normalize(f.category);
    if (foundRoom && ticketRoom && foundRoom === ticketRoom) score += 2;
    if (foundCat && ticketCat && foundCat === ticketCat) score += 1;
    return score;
  };

  return pool
    .map((f) => ({
      ...f,
      _suggest: suggestionScore(f),
      _apiId: f.id ?? f.ID,
    }))
    .sort(
      (a, b) =>
        (b._suggest - a._suggest) ||
        String(a.title || '').localeCompare(String(b.title || ''))
    );
};

// Baris satu barang temuan di dalam picker pasangan.
const PickerItem = ({ found, suggested, onPick, loading }) => (
  <div className={`pairing-picker-item ${suggested ? 'is-suggested' : ''}`}>
    <div className="pairing-item-thumb">
      {found.photo_url ? (
        <img src={resolveMediaUrl(found.photo_url)} alt={found.title} className="pairing-item-img" />
      ) : (
        <Package size={18} />
      )}
    </div>
    <div className="pairing-item-info">
      <div className="pairing-item-title-row">
        <span className="pairing-item-title">{found.title || 'Barang'}</span>
        {suggested && <span className="pairing-suggest-badge">Disarankan</span>}
      </div>
      <span className="pairing-item-sub">
        {found.category || ''}
        {found.room_number ? ` • Kamar ${found.room_number}` : ''}
        {found.location ? ` • ${found.location}` : ''}
      </span>
    </div>
    <button
      type="button"
      className="pairing-pick-btn"
      onClick={onPick}
      disabled={loading}
    >
      <Link2 size={13} />
      <span>{loading ? 'Memilih...' : 'Pilih'}</span>
    </button>
  </div>
);

export function MatchReviewView({ 
  activeNav = 'Verifikasi', 
  onNavChange, 
  onLogout 
}) {
  const [tickets, setTickets] = useState(() => StorageService.getTickets());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  // Default filter = antrean berjalan: hanya 'baru'/'dicocokkan'.
  // Laporan bersifat 'dikembalikan'/'diserahkan' (Sudah Diserahkan ke tamu)
  // otomatis TIDAK ikut tampil; bisa dilihat lewat "Semua Status".
  const [selectedStatus, setSelectedStatus] = useState('Menunggu Verifikasi');
  const [inspectingTicket, setInspectingTicket] = useState(null);
  const [toastNotification, setToastNotification] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [apiTickets, setApiTickets] = useState(null);
  const [apiActive, setApiActive] = useState(false);
  const [apiChecked, setApiChecked] = useState(false);
  const [apiReportsRaw, setApiReportsRaw] = useState([]);
  const [apiMatchesRaw, setApiMatchesRaw] = useState([]);
  const [pickerTicket, setPickerTicket] = useState(null);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerLoading, setPickerLoading] = useState(false);
  const [waPreview, setWaPreview] = useState(null);
  const [waPreviewLoading, setWaPreviewLoading] = useState(false);

  const displayTickets = apiActive && Array.isArray(apiTickets) ? apiTickets : tickets;

  // Sync data listener
  const refreshData = () => {
    setTickets(StorageService.getTickets());
  };

  // API-first: tarik laporan lost + match dari backend; fallback StorageService offline.
  const loadApiTickets = useCallback(async () => {
    try {
      try {
        const [health, reports, matches] = await Promise.all([
          ApiService.checkHealth(),
          ApiService.getReports(),
          ApiService.getMatches(),
        ]);
        if (!health.online) {
          setApiActive(false);
          return;
        }
        setApiTickets(buildApiTickets(reports, matches));
        setApiReportsRaw(Array.isArray(reports) ? reports : []);
        setApiMatchesRaw(Array.isArray(matches) ? matches : []);
        setApiActive(true);
      } catch (err) {
        console.warn('[MatchReviewView] API tidak tersedia, pakai data lokal:', err.message);
        setApiActive(false);
      }
    } finally {
      setApiChecked(true);
    }
  }, []);

  useEffect(() => {
    loadApiTickets();
    const handleUpdate = () => refreshData();
    window.addEventListener('findit_tickets_updated', handleUpdate);
    window.addEventListener('findit_items_updated', handleUpdate);
    return () => {
      window.removeEventListener('findit_tickets_updated', handleUpdate);
      window.removeEventListener('findit_items_updated', handleUpdate);
    };
  }, [loadApiTickets]);

  const showToast = (message, type = 'success') => {
    setToastNotification({ message, type });
    setTimeout(() => {
      setToastNotification(null);
    }, 3500);
  };

  // Pre-calculate candidate pairings for tickets
  const ticketPairings = useMemo(() => {
    const pairings = {};
    displayTickets.forEach((t) => {
      if (t._candidate) {
        pairings[t.id] = t._candidate;
        return;
      }
      const candidates = MatchReviewModel.getCandidates(t.id);
      pairings[t.id] = candidates.length > 0 ? candidates[0] : null;
    });
    return pairings;
  }, [displayTickets]);

  // Categories list
  const categoryOptions = useMemo(() => {
    const cats = new Set(displayTickets.map((t) => t.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [displayTickets]);

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return displayTickets.filter((t) => {
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
      const matchesStatus =
        selectedStatus === 'all' ||
        selectedStatus === 'Menunggu Verifikasi'
          ? isReportAwaiting(t.statusRaw)
          : t.status === selectedStatus;
      const q = searchQuery.toLowerCase().trim();
      const bestCandidate = ticketPairings[t.id];
      const matchesSearch =
        !q ||
        (t.id && t.id.toLowerCase().includes(q)) ||
        (t.guestName && t.guestName.toLowerCase().includes(q)) ||
        (t.roomNumber && t.roomNumber.toLowerCase().includes(q)) ||
        (t.itemName && t.itemName.toLowerCase().includes(q)) ||
        (bestCandidate && bestCandidate.name && bestCandidate.name.toLowerCase().includes(q));
      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [displayTickets, selectedCategory, selectedStatus, searchQuery, ticketPairings]);

  // KPI counts
  const totalCount = displayTickets.length;
  const pendingCount = displayTickets.filter((t) => isReportAwaiting(t.statusRaw)).length;
  const verifiedCount = displayTickets.filter(
    (t) => isReportVerified(t.statusRaw) || t.statusRaw === 'dikembalikan'
  ).length;

  // Actions
  const handleDeleteTicket = (ticketId) => {
    if (displayTickets.find((t) => t.id === ticketId)?._source === 'api') {
      showToast('Laporan live dari backend tidak dapat dihapus dari halaman ini.', 'info');
      return;
    }
    if (window.confirm(`Hapus laporan barang ${ticketId}?`)) {
      StorageService.deleteTicket(ticketId);
      showToast(`Laporan barang ${ticketId} berhasil dihapus.`, 'info');
      refreshData();
    }
  };

  // ── API-first decision (helper shared di services/matchSync) ──
  const decideMatch = async (ticket, candidate, nextStatus, extra = {}) => {
    let viaApi = false;
    if (isApiCandidate(candidate)) {
      try {
        viaApi = await applyMatchDecision({
          candidate,
          nextStatus,
          extra,
          matches: apiMatchesRaw,
        });
      } catch (err) {
        console.warn('[MatchReview] API decision gagal, fallback ke StorageService:', err.message);
      }
    }
    if (!viaApi) {
      await applyMatchDecisionLocal({ ticket, candidate, nextStatus, extra });
    }
    // Sinkron cache lokal agar label tetap konsisten (data campur / offline).
    StorageService.updateTicketStatus(
      ticket.id,
      nextStatus === 'approved' ? 'Terverifikasi' : 'Menunggu Verifikasi'
    );
  };

  // ── WhatsApp preview (semi-otomatis via deep link wa.me) ──
  const handleOpenWhatsAppPreview = async (ticket) => {
    if (!ticket) return;
    setWaPreviewLoading(true);
    try {
      // Prioritas: nomor WA langsung dari laporan (`_userPhone`) — paling andal,
      // tersedia walau laporan dibuat petugas/front desk tanpa akun (user_id null).
      let phone = normalizePhone(ticket._userPhone);
      // Fallback: ambil dari akun tamu via `_userId`.
      if (!phone && ticket._userId) {
        const user = await ApiService.getUserById(ticket._userId);
        phone = normalizePhone(user?.phone);
      }
      if (!phone) {
        showToast(`Nomor WhatsApp tamu belum tersedia.`, 'info');
        return;
      }
      const message = buildNotificationMessage({
        event: WHATSAPP_EVENTS.VERIFIED,
        guestName: ticket.guestName,
        itemTitle: ticket.itemName,
        room: ticket.roomNumber,
      });
      setWaPreview({
        eventLabel: notifEventLabel(WHATSAPP_EVENTS.VERIFIED),
        guestName: ticket.guestName,
        phone,
        itemTitle: ticket.itemName,
        room: ticket.roomNumber,
        message,
        url: buildWhatsAppUrl(phone, message),
      });
    } catch (err) {
      console.warn('[MatchReview] gagal menyiapkan notifikasi WhatsApp:', err.message);
      showToast(`Gagal menyiapkan notifikasi WhatsApp: ${err.message}`, 'info');
    } finally {
      setWaPreviewLoading(false);
    }
  };

  const handleCloseWhatsAppPreview = () => setWaPreview(null);

  const handleWhatsAppMessageChange = (text) =>
    setWaPreview((prev) => (prev ? { ...prev, message: text, url: buildWhatsAppUrl(prev.phone, text) } : prev));

  const handleConfirmWhatsAppSend = () => {
    if (!waPreview) return;
    const url = buildWhatsAppUrl(waPreview.phone, waPreview.message);
    if (!url) {
      showToast('Nomor WhatsApp tidak valid.', 'info');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
    showToast(`Membuka WhatsApp untuk ${waPreview.guestName} (${waPreview.phone}).`, 'success');
    setWaPreview(null);
  };

  const handleConfirmVerification = async (ticket, candidate) => {
    if (!candidate) {
      showToast('Belum ada kandidat barang temuan. Gunakan tombol Pasangkan untuk mencari barang temuan.', 'info');
      return;
    }
    // Update UI instan (optimistik) — jaringan diproses di latar belakang.
    applyLocalDecision(ticket, 'approved');
    setInspectingTicket(null);
    setActionLoading(true);
    try {
      const user = ApiService.getCurrentUser();
      await decideMatch(ticket, candidate, 'approved', {
        verified_by: user?.id ?? user?.ID ?? null,
      });
      showToast(`Barang ${ticket.id} berhasil ditandai Terverifikasi!`, 'success');
      void handleOpenWhatsAppPreview(ticket);
    } catch (err) {
      console.warn('[MatchReview] verifikasi gagal:', err.message);
      showToast(`Gagal memverifikasi: ${err.message}`, 'info');
    } finally {
      setActionLoading(false);
      refreshData();
      loadApiTickets();
    }
    // Wa Giải nén: mở preview WhatsApp (deep link wa.me) saat verifikasi sukses —
    // admin tinggal konfirmasi kirim ke tamu tanpa menyalin nomor manual.
    void handleOpenWhatsAppPreview(ticket);
  };

  const handleRejectRelation = async (ticket, candidate) => {
    if (!candidate) {
      showToast('Belum ada kandidat barang temuan untuk dilepas.', 'info');
      return;
    }
    applyLocalDecision(ticket, 'rejected');
    setInspectingTicket(null);
    setActionLoading(true);
    try {
      await decideMatch(ticket, candidate, 'rejected');
      showToast(`Kandidat barang temuan dilepaskan dari barang ${ticket.id}.`, 'info');
    } catch (err) {
      console.warn('[MatchReview] pelepasan pasangan gagal:', err.message);
      showToast(`Gagal melepas pasangan: ${err.message}`, 'info');
    } finally {
      setActionLoading(false);
      refreshData();
      loadApiTickets();
    }
  };

  // Update status tampilan baris tanpa menunggu network (di-reconcile saat reload).
  const applyLocalDecision = (ticket, nextStatus) => {
    const patched = (t) =>
      t.id === ticket.id
        ? {
            ...t,
            status:
              nextStatus === 'approved' ? 'Terverifikasi' : 'Menunggu Verifikasi',
            statusRaw: nextStatus === 'approved' ? 'dikonfirmasi' : 'baru',
            _candidate:
              nextStatus === 'approved'
                ? { ...(t._candidate || {}), matchStatus: 'approved' }
                : null,
          }
        : t;
    setTickets((prev) => (Array.isArray(prev) ? prev.map(patched) : prev));
    setApiTickets((prev) => (Array.isArray(prev) ? prev.map(patched) : prev));
  };

  // Inspecting candidate helper
  const inspectingCandidate = inspectingTicket ? ticketPairings[inspectingTicket.id] : null;

  // ── Create Pairing Manual (picker) ──
  const pickerOptions = useMemo(() => {
    if (!pickerTicket) return [];
    return buildFoundPickerOptions(pickerTicket, apiReportsRaw, apiMatchesRaw);
  }, [pickerTicket, apiReportsRaw, apiMatchesRaw]);

  const filteredPickerOptions = useMemo(() => {
    const q = pickerSearch.toLowerCase().trim();
    if (!q) return pickerOptions;
    return pickerOptions.filter((f) => {
      const title = String(f.title || '').toLowerCase();
      const room = String(f.room_number || '');
      const identifier = String(f.report_identifier || '');
      return title.includes(q) || room.includes(q) || identifier.toLowerCase().includes(q);
    });
  }, [pickerOptions, pickerSearch]);

  const openPicker = (ticket) => {
    setPickerSearch('');
    setPickerTicket(ticket);
  };

  const handleCreatePairing = async (found) => {
    if (!pickerTicket?._apiId || !found?._apiId) {
      showToast('Data laporan tidak lengkap untuk membuat pasangan.', 'info');
      return;
    }
    setPickerLoading(true);
    try {
      const created = await ApiService.createMatch(pickerTicket._apiId, found._apiId, 0);
      const matchId = created?.id ?? created?.ID ?? '';
      // Tampilkan pasangan instan sebelum reload di latar belakang selesai.
      const candidate = {
        id: `match-${matchId}`,
        _apiId: matchId,
        _source: 'api',
        lost_report_id: String(pickerTicket._apiId),
        found_report_id: String(found._apiId),
        name: found.title || found.name || 'Barang Temuan',
        category: found.category || '',
        photoUrl: resolveMediaUrl(found.photo_url || ''),
        roomNumber: found.room_number || '',
        locationFound: found.location || (found.room_number ? `Kamar ${found.room_number}` : ''),
        matchStatus: 'pending',
      };
      const patch = (t) =>
        t.id === pickerTicket.id ? { ...t, _candidate: candidate } : t;
      setApiTickets((prev) => (Array.isArray(prev) ? prev.map(patch) : prev));
      showToast(
        `Pasangan #${matchId} berhasil dibuat dan menunggu verifikasi.`,
        'success'
      );
      setPickerTicket(null);
      refreshData();
      loadApiTickets();
    } catch (err) {
      console.warn('[MatchReview] createMatch gagal:', err.message);
      showToast(`Gagal membuat pasangan: ${err.message}`, 'info');
    } finally {
      setPickerLoading(false);
    }
  };

  return (
    <div className="verification-app-layout">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeNav={activeNav}
        onNavChange={onNavChange}
        onLogout={onLogout}
      />

      {/* 2. Main Viewport Container */}
      <div className="verification-main-viewport">
        <TopNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNavChange={onNavChange}
          onLogout={onLogout}
        />

        <main className="verification-scrollable-content">
          {apiChecked && !apiActive && (
            <div className="offline-api-notice" role="status">
              Backend tidak dapat dihubungi — menampilkan data lokal. Perubahan hanya akan
              tersimpan di perangkat ini (mode offline).
            </div>
          )}
          {/* Header & KPI Summary Cards (Identical Layout to FoundItemsLogView) */}
          <section className="verification-header-section">
            <div className="verification-title-group">
              <div className="verification-icon-box">
                <CheckCircle2 size={24} />
              </div>
              <div className="verification-titles">
                <h1 className="verification-main-title">Verifikasi</h1>
                <span className="verification-subtitle">
                  Tabel master pencocokan klaim tamu hotel dengan inventaris fisik barang temuan housekeeping.
                </span>
              </div>
            </div>

            {/* KPI Cards Group */}
            <div className="verification-kpi-cards-group">
              <div className="verification-kpi-card blue-surface">
                <div className="kpi-icon-square blue">
                  <ShieldCheck size={18} />
                </div>
                <div className="kpi-text-stack">
                  <span className="kpi-micro-label">TOTAL KLAIM TAMU</span>
                  <span className="kpi-value-bold">{totalCount} Barang</span>
                </div>
              </div>

              <div className="verification-kpi-card yellow-surface">
                <div className="kpi-icon-square yellow">
                  <Clock size={18} />
                </div>
                <div className="kpi-text-stack">
                  <span className="kpi-micro-label">MENUNGGU VERIFIKASI</span>
                  <span className="kpi-value-bold">{pendingCount} Barang</span>
                </div>
              </div>

              <div className="verification-kpi-card green-surface">
                <div className="kpi-icon-square green">
                  <Check size={18} />
                </div>
                <div className="kpi-text-stack">
                  <span className="kpi-micro-label">TERVERIFIKASI</span>
                  <span className="kpi-value-bold">{verifiedCount} Barang</span>
                </div>
              </div>
            </div>
          </section>

          {/* Search, Filter & Action Toolbar */}
          <section className="verification-toolbar-card">
            <div className="toolbar-top-row">
              <div className="table-search-input-box">
                <Search size={16} className="search-muted-icon" />
                <input
                  type="text"
                  className="table-search-field"
                  placeholder="Cari no. barang, nama tamu, kamar, barang klaim..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="toolbar-right-buttons">
                <button
                  type="button"
                  className="btn-new-claim-action"
                  onClick={() => onNavChange && onNavChange('Buat Laporan')}
                >
                  <Plus size={15} />
                  <span>+ Buat Laporan</span>
                </button>
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="toolbar-filters-row">
              <div className="filter-select-wrapper">
                <span className="filter-label-icon">
                  <Filter size={10} />
                  KATEGORI BARANG
                </span>
                <select
                  className="filter-native-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">Semua Kategori</option>
                  {categoryOptions.filter((c) => c !== 'all').map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="filter-select-wrapper">
                <span className="filter-label-icon">
                  <CheckCircle2 size={10} />
                  STATUS VERIFIKASI
                </span>
<select
                  className="filter-native-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
<option value="all">Semua Status</option>
                    <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                    <option value="Baru Masuk">Baru Masuk</option>
                    <option value="Dicocokkan">Dicocokkan</option>
                    <option value="Terverifikasi">Terverifikasi</option>
                    <option value="Selesai Handover">Selesai Handover (Diserahkan)</option>
                    <option value="Ditolak">Ditolak</option>
                </select>
              </div>
            </div>
          </section>

          {/* Master Verification Table */}
          {filteredTickets.length === 0 ? (
            <div className="claim-empty-state-card">
              <div className="empty-icon-box">
                <Package size={28} className="empty-ticket-icon" />
              </div>
              <h3 className="empty-title">Belum Ada Barang Klaim untuk Diverifikasi</h3>
              <p className="empty-subtitle">
                Tidak ada barang klaim yang sesuai dengan filter pencarian saat ini. Anda dapat membuat laporan baru atau memuat sampel data.
              </p>
              <div className="empty-actions-row">
                <button
                  type="button"
                  className="btn-create-empty-amber"
                  onClick={() => onNavChange && onNavChange('Buat Laporan')}
                >
                  + Buat Laporan Baru
                </button>
              </div>
            </div>
          ) : (
            <div className="master-verification-table-container">
              <table className="master-verification-table">
                <thead>
                  <tr>
                    <th style={{ width: '130px' }}>NO. BARANG</th>
                    <th>TAMU &amp; NO. KAMAR</th>
                    <th>BARANG DIKLAIM</th>
                    <th>KANDIDAT TEMUAN HK</th>
                    <th style={{ width: '140px' }}>WAKTU LAPOR</th>
                    <th style={{ width: '150px' }}>STATUS</th>
                    <th style={{ width: '170px', textAlign: 'center' }}>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((t) => {
                    const candidate = ticketPairings[t.id];
                    const isPending = !isReportVerified(t.statusRaw) && !(t.statusRaw === 'dikembalikan');
                    return (
                      <tr key={t.id} className="verification-table-row">
                        {/* 1. No Tiket */}
                        <td className="cell-ticket-id">
                          <div className="ticket-id-stack">
                            <span 
                              className="reg-num-link"
                              onClick={() => setInspectingTicket(t)}
                              title="Klik untuk membuka rincian perbandingan"
                            >
                              {t.id}
                            </span>
                            {t.priority === 'VIP' && (
                              <span className="vip-badge-small">VIP</span>
                            )}
                          </div>
                        </td>

                        {/* 2. Tamu & No Kamar */}
                        <td className="cell-guest-info">
                          <div className="guest-info-stack">
                            <span className="guest-name-bold">{t.guestName || 'Tamu Anonim'}</span>
                            <span className="guest-room-sub">
                              Kamar {t.roomNumber || '-'} {t.roomType ? `• ${t.roomType}` : ''}
                            </span>
                          </div>
                        </td>

                        {/* 3. Barang Diklaim */}
                        <td className="cell-item-claimed">
                          <div className="item-claimed-stack">
                            <span className="item-name-bold">{t.itemName || 'Barang Berharga'}</span>
                            <span className="item-category-sub">
                              {t.category || '-'} {t.color ? `• ${t.color}` : ''}
                            </span>
                          </div>
                        </td>

                        {/* 4. Kandidat Temuan HK */}
                        <td className="cell-hk-candidate">
                          {candidate ? (
                            <div className="candidate-cell-flex">
                              {candidate.photoUrl ? (
                                <img
                                  src={candidate.photoUrl}
                                  alt={candidate.name}
                                  className="candidate-mini-thumb"
                                />
                              ) : (
                                <div className="candidate-icon-placeholder">
                                  <Package size={14} />
                                </div>
                              )}
                              <div className="candidate-info-stack">
                                <span className="candidate-title">{candidate.name}</span>
                                <span className="candidate-sub">
                                  <MapPin size={10} /> {candidate.locationFound || '-'}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="no-candidate-hint">Belum ada temuan serupa</span>
                          )}
                        </td>

                        {/* 5. Waktu Lapor */}
                        <td className="cell-report-time">
                          <span className="report-time-text">{t.reportedAt || '-'}</span>
                        </td>

                        {/* 6. Status */}
                        <td className="cell-status">
                          <span className={`status-pill ${isPending ? 'pending' : 'verified'}`}>
                            <span className="status-dot" />
                            {t.status}
                          </span>
                        </td>

                        {/* 7. Aksi */}
                        <td className="cell-actions" style={{ textAlign: 'center' }}>
                          <div className="action-buttons-flex">
                            <button
                              type="button"
                              className={isPending ? 'btn-table-verify' : 'btn-table-details'}
                              onClick={() => setInspectingTicket(t)}
                              title="Buka rincian perbandingan"
                            >
                              <span>{isPending ? 'Verifikasi' : 'Detail'}</span>
                              <ArrowRight size={13} />
                            </button>

                            <button
                              type="button"
                              className="btn-table-link"
                              onClick={() => openPicker(t)}
                              title="Cari & pasangkan barang temuan secara manual"
                            >
                              <Link2 size={13} />
                              <span>Pasangkan</span>
                            </button>

                            <button
                              type="button"
                              className="btn-table-delete"
                              title="Hapus Laporan Barang"
                              onClick={() => handleDeleteTicket(t.id)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="verification-table-footer">
                <span className="footer-count-text">
                  Menampilkan {filteredTickets.length} dari total {displayTickets.length} klaim terdaftar
                </span>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. Interactive Verification & Inspection Modal */}
      {inspectingTicket && (
        <div className="modal-backdrop" onClick={() => setInspectingTicket(null)}>
          <div 
            className="modal-dialog-box verification-modal-box" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-top-bar">
              <div className="modal-title-wrap">
                <ShieldCheck size={22} className="text-blue-600" />
                <div>
                  <h3 className="modal-heading">
                    Pemeriksaan Ciri Khusus: {inspectingTicket.id}
                  </h3>
                  <span className="modal-sub-heading">
                    Perbandingan dua sisi: Laporan Klaim Tamu vs Barang Temuan
                  </span>
                </div>
              </div>
              <button 
                type="button" 
                className="modal-close-icon-btn" 
                onClick={() => setInspectingTicket(null)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: Side-by-Side Comparison */}
            <div className="verification-modal-body">
              {/* Left Side: Guest Claim Confidential */}
              <div className="modal-compare-card guest-side">
                <div className="card-side-tag">1. LAPORAN KLAIM TAMU (CONFIDENTIAL)</div>
                <h4 className="compare-item-title">{inspectingTicket.itemName}</h4>

                <div className="compare-meta-grid">
                  <div className="compare-meta-item">
                    <span className="meta-label">Nama Tamu</span>
                    <span className="meta-value bold">{inspectingTicket.guestName}</span>
                  </div>
                  <div className="compare-meta-item">
                    <span className="meta-label">Nomor Kamar</span>
                    <span className="meta-value">Kamar {inspectingTicket.roomNumber || '-'}</span>
                  </div>
                  <div className="compare-meta-item">
                    <span className="meta-label">Kategori</span>
                    <span className="meta-value">{inspectingTicket.category || '-'}</span>
                  </div>
                  <div className="compare-meta-item">
                    <span className="meta-label">Waktu Lapor</span>
                    <span className="meta-value">{inspectingTicket.reportedAt || '-'}</span>
                  </div>
                </div>

                <div className="confidential-feature-box">
                  <span className="feature-label">Ciri Rahasia / Deskripsi Tambahan Tamu:</span>
                  <p className="feature-text">
                    {inspectingTicket.secretDetail || inspectingTicket.specialFeatures || inspectingTicket.description || 'Tidak ada deskripsi rahasia tertulis.'}
                  </p>
                </div>

                <div className="location-meta-row">
                  <MapPin size={12} />
                  <span>Lokasi Hilang: {inspectingTicket.locationLost || 'Area kamar'}</span>
                </div>
              </div>

              {/* Right Side: HK Found Item Candidate */}
              <div className="modal-compare-card hk-side">
                <div className="card-side-tag green">2. BARANG FISIK TEMUAN HOUSEKEEPING</div>
                {inspectingCandidate ? (
                  <>
                    <div className="hk-candidate-header">
                      {inspectingCandidate.photoUrl ? (
                        <img 
                          src={inspectingCandidate.photoUrl} 
                          alt={inspectingCandidate.name} 
                          className="hk-candidate-img-frame"
                        />
                      ) : (
                        <div className="hk-no-photo-box">
                          <Package size={24} />
                        </div>
                      )}
                      <div>
                        <h4 className="compare-item-title">{inspectingCandidate.name}</h4>
                      </div>
                    </div>

                    <div className="compare-meta-grid">
                      {inspectingCandidate.finderName && (
                        <div className="compare-meta-item">
                          <span className="meta-label">Petugas Penemu</span>
                          <span className="meta-value bold">{inspectingCandidate.finderName}</span>
                        </div>
                      )}
                      <div className="compare-meta-item">
                        <span className="meta-label">Lokasi Ditemukan</span>
                        <span className="meta-value">{inspectingCandidate.locationFound || '-'}</span>
                      </div>
                      <div className="compare-meta-item">
                        <span className="meta-label">Waktu Temu</span>
                        <span className="meta-value">{inspectingCandidate.foundAt || '-'}</span>
                      </div>
                    </div>

                    <div className="confidential-feature-box hk">
                      <span className="feature-label">Deskripsi Fisik Lapangan HK:</span>
                      <p className="feature-text">
                        {inspectingCandidate.description || inspectingCandidate.notes || '-'}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="empty-hk-match-state">
                    <AlertCircle size={28} className="text-amber-500" />
                    <h4>Belum Ada Barang Temuan Serupa</h4>
                    <p>
                      Laporan klaim ini belum dipasangkan dengan barang temuan.
                      Gunakan tombol Pasangkan untuk mencari &amp; memasangkan.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="modal-actions-bar">
              <button 
                type="button" 
                className="btn-cancel-modal" 
                onClick={() => setInspectingTicket(null)}
              >
                Tutup
              </button>

              {!inspectingCandidate && (
                <button
                  type="button"
                  className="btn-link-secondary"
                  onClick={() => {
                    setInspectingTicket(null);
                    openPicker(inspectingTicket);
                  }}
                >
                  <Link2 size={14} />
                  Cari Barang Temuan
                </button>
              )}

              {inspectingCandidate && (
                <button
                  type="button"
                  className="btn-reject-relation"
                  onClick={() => handleRejectRelation(inspectingTicket, inspectingCandidate)}
                  disabled={actionLoading}
                >
                  Lepas Relasi / Tidak Cocok
                </button>
              )}

              <button
                type="button"
                className="btn-confirm-match-gold"
                onClick={() => handleConfirmVerification(inspectingTicket, inspectingCandidate)}
                disabled={actionLoading || !inspectingCandidate}
                title={inspectingCandidate ? undefined : 'Belum ada pasangan — buat dulu lewat tombol Pasangkan'}
              >
                {actionLoading ? 'Memproses...' : 'Tandai Terverifikasi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Picker: Create Pairing Manual */}
      {pickerTicket && (
        <div className="modal-backdrop" onClick={() => setPickerTicket(null)}>
          <div
            className="verification-modal-box pairing-picker-box"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-top-bar">
              <div className="modal-title-wrap">
                <Link2 size={22} className="text-blue-600" />
                <div>
                  <h3 className="modal-heading">
                    Pasangkan Barang Temuan: {pickerTicket.itemName}
                  </h3>
                  <span className="modal-sub-heading">
                    {pickerTicket.id} • {pickerTicket.guestName}{' '}
                    {pickerTicket.roomNumber ? `(Kamar ${pickerTicket.roomNumber})` : ''}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-icon-btn"
                onClick={() => setPickerTicket(null)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="pairing-picker-body">
              <div className="pairing-picker-search">
                <Search size={15} className="pairing-search-icon" />
                <input
                  type="text"
                  className="pairing-search-input"
                  placeholder="Cari barang temuan (nama atau nomor kamar)..."
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                />
              </div>

              {filteredPickerOptions.length === 0 ? (
                <div className="pairing-picker-empty">
                  <Package size={28} className="text-slate-400" />
                  <p>
                    Tidak ada barang temuan tersedia (status bukan 'baru' atau
                    sudah terpasang di match lain).
                  </p>
                </div>
              ) : (
                <>
                  {!pickerSearch && pickerOptions.some((o) => o._suggest > 0) && (
                    <>
                      <div className="pairing-section-label">
                        Disarankan (mirip kategori / kamar)
                      </div>
                      <div className="pairing-picker-list suggest">
                        {pickerOptions
                          .slice()
                          .filter((o) => o._suggest > 0)
                          .map((f) => (
                            <PickerItem
                              key={f._apiId}
                              found={f}
                              suggested
                              onPick={() => handleCreatePairing(f)}
                              loading={pickerLoading}
                            />
                          ))}
                      </div>
                    </>
                  )}

                  <div className="pairing-section-label">
                    Semua barang temuan tersedia ({filteredPickerOptions.length})
                  </div>
                  <div className="pairing-picker-list">
                    {filteredPickerOptions.map((f) => (
                      <PickerItem
                        key={f._apiId}
                        found={f}
                        suggested={f._suggest > 0}
                        onPick={() => handleCreatePairing(f)}
                        loading={pickerLoading}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-actions-bar">
              <button
                type="button"
                className="btn-cancel-modal"
                onClick={() => setPickerTicket(null)}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Pratinjau WhatsApp (deep link wa.me) */}
      <WhatsAppPreviewModal
        preview={waPreview}
        isLoading={waPreviewLoading}
        onClose={handleCloseWhatsAppPreview}
        onMessageChange={handleWhatsAppMessageChange}
        onSend={handleConfirmWhatsAppSend}
      />

      {/* Toast Notification */}
      {toastNotification && (
        <div className={`verification-toast-pill ${toastNotification.type}`}>
          <CheckCircle2 size={16} />
          <span>{toastNotification.message}</span>
        </div>
      )}
    </div>
  );
}

export default MatchReviewView;
