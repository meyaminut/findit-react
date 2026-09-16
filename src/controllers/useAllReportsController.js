import { useState, useEffect, useMemo } from 'react';
import { AllReportsController } from './AllReportsController';
import ApiService from '../services/ApiService';

/**
 * Controller Hook: useAllReportsController
 * Exposes reactive filtering, table sorting, export, and selection to AllReportsView.
 * Now fetches live data from the API and merges with local data.
 */
export function useAllReportsController() {
  const [reports, setReports] = useState(() => AllReportsController.getReports());
  const [metrics, setMetrics] = useState(() => AllReportsController.getMetrics());
  
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'lost' | 'found'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'new' | 'matched' | 'confirmed' | 'returned'
  const [dateRange, setDateRange] = useState('30days');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [selectedReport, setSelectedReport] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ──── Fetch live API data on mount ────
  useEffect(() => {
    let cancelled = false;

    async function loadApiData() {
      setApiLoading(true);
      try {
        const allReports = await ApiService.getReports();
        if (cancelled) return;

        if (Array.isArray(allReports) && allReports.length > 0) {
          const mappedReports = allReports.map((r) => {
            const dateStr = r.created_at
              ? new Date(r.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })
              : '';
            const timeStr = r.created_at
              ? new Date(r.created_at).toLocaleTimeString('id-ID', {
                  hour: '2-digit', minute: '2-digit'
                })
              : '';

            return {
              id: `RPT-${r.id || r.ID}`,
              _apiId: r.id || r.ID,
              title: r.title || 'Barang',
              type: r.type || 'found',
              category: r.category || 'Lainnya',
              reporter: {
                name: r.user?.name || (r.type === 'lost' ? 'Tamu' : 'Staf Hotel'),
                avatar: null,
                role: r.type === 'lost' ? 'Guest' : 'Staff',
              },
              location: r.location || '-',
              timestamp: `${dateStr}, ${timeStr} WIB`,
              status: mapApiToReportStatus(r.status),
              statusLabel: mapApiToReportStatusLabel(r.status),
              statusColor: mapApiToReportStatusColor(r.status),
              description: r.description || '',
              photoUrl: r.photo_url || '',
              activityNote: r.activity_note || '',
              _source: 'api',
            };
          });

          setReports((prev) => {
            const localOnly = prev.filter(r => r._source !== 'api');
            return [...mappedReports, ...localOnly];
          });

          // Update metrics with live counts
          const total = allReports.length;
          const pending = allReports.filter(r => r.status === 'pending').length;
          const verified = allReports.filter(r => r.status === 'verified' || r.status === 'diverifikasi').length;
          const completed = allReports.filter(r => r.status === 'completed' || r.status === 'claimed').length;

          setMetrics({
            totalSubmissions: {
              val: String(total),
              label: 'TOTAL SUBMISSIONS',
              subtitle: 'Dari API live',
              icon: 'folder'
            },
            awaitingVerification: {
              val: String(pending),
              label: 'AWAITING VERIFICATION',
              subtitle: 'Requires desk audit',
              icon: 'hourglass'
            },
            matchedConfirmed: {
              val: String(verified),
              label: 'MATCHED & CONFIRMED',
              subtitle: 'Terkonfirmasi',
              icon: 'handshake'
            },
            resolvedReturned: {
              val: String(completed),
              label: 'RESOLVED & RETURNED',
              subtitle: 'Selesai dikembalikan',
              icon: 'shield'
            }
          });
        }
      } catch (err) {
        console.warn('[AllReports] Failed to fetch API data:', err.message);
      } finally {
        if (!cancelled) setApiLoading(false);
      }
    }

    loadApiData();
    return () => { cancelled = true; };
  }, []);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      // Type
      if (typeFilter !== 'all' && item.type !== typeFilter) {
        return false;
      }

      // Status
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = (item.title || '').toLowerCase().includes(q);
        const matchesId = (item.id || '').toLowerCase().includes(q);
        const matchesReporter = (item.reporter?.name || '').toLowerCase().includes(q);
        const matchesLoc = (item.location || '').toLowerCase().includes(q);
        return matchesTitle || matchesId || matchesReporter || matchesLoc;
      }

      return true;
    });
  }, [reports, typeFilter, statusFilter, searchQuery]);

  const handleExport = () => {
    const res = AllReportsController.exportCsv(filteredReports);
    showToast(res.message, 'success');
  };

  const handleSelectReport = (report) => {
    setSelectedReport(report);
  };

  const handleCloseDetail = () => {
    setSelectedReport(null);
  };

  return {
    metrics,
    reports: filteredReports,
    totalCount: String(reports.length),
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
    selectedReport,
    toastMessage,
    apiLoading,
    handleExport,
    handleSelectReport,
    handleCloseDetail
  };
}

// ──── API status mapping helpers ────
function mapApiToReportStatus(apiStatus) {
  const map = {
    'pending': 'new',
    'diverifikasi': 'confirmed',
    'verified': 'confirmed',
    'approved': 'matched',
    'completed': 'returned',
    'claimed': 'returned',
    'rejected': 'rejected',
  };
  return map[apiStatus] || 'new';
}

function mapApiToReportStatusLabel(apiStatus) {
  const map = {
    'pending': 'Baru Masuk',
    'diverifikasi': 'Terverifikasi',
    'verified': 'Terverifikasi',
    'approved': 'Disetujui',
    'completed': 'Dikembalikan',
    'claimed': 'Diklaim',
    'rejected': 'Ditolak',
  };
  return map[apiStatus] || 'Baru Masuk';
}

function mapApiToReportStatusColor(apiStatus) {
  const map = {
    'pending': '#94a3b8',
    'diverifikasi': '#10b981',
    'verified': '#10b981',
    'approved': '#2563eb',
    'completed': '#059669',
    'claimed': '#059669',
    'rejected': '#ef4444',
  };
  return map[apiStatus] || '#94a3b8';
}

export default useAllReportsController;
