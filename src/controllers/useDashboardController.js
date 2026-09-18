import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { DashboardController } from './DashboardController';
import ApiService from '../services/ApiService';
import {
  applyMatchDecision,
  applyMatchDecisionLocal,
  markMatchHandedOver,
} from '../services/matchSync';
import { MatchReviewModel } from '../models/MatchReviewModel';
import {
  isReportAwaiting,
  isReportVerified,
  isReportResolved,
  reportStatusLabel,
  reportStatusType,
} from '../services/reportStatus';
import {
  normalizePhone,
  buildWhatsAppUrl,
  buildNotificationMessage,
  notifEventLabel,
  WHATSAPP_EVENTS,
} from '../services/whatsapp';

/**
 * Controller Hook: useDashboardController
 * Exposes reactive state and action handlers for the redesigned Grand Melia Admin Dashboard.
 * Now fetches live data from the API on mount and falls back to local data.
 */
export function useDashboardController() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [activeTableFilter, setActiveTableFilter] = useState('all'); // 'all' | 'lost' | 'found'
  const [searchQuery, setSearchQuery] = useState('');
  const [apiOnline, setApiOnline] = useState(false);
  
  // Operational Data
  const [metrics, setMetrics] = useState(() => DashboardController.getMetrics());
  const [tickets, setTickets] = useState(() => DashboardController.getTickets());
  const [activities, setActivities] = useState(() => DashboardController.getActivities());
  const [categories, setCategories] = useState(() => DashboardController.getCategories());

  // Modals & UI States
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isQuickReportOpen, setIsQuickReportOpen] = useState(false);
  const [waPreview, setWaPreview] = useState(null);
  const [waPreviewLoading, setWaPreviewLoading] = useState(false);
  const [toastNotification, setToastNotification] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [apiReloadKey, setApiReloadKey] = useState(0);
  const matchesRef = useRef(null);
  const reportsRef = useRef([]);

  const applyMetrics = useCallback((reports) => {
    setMetrics(buildDashboardMetrics(reports));
  }, []);

  const patchReportStatuses = useCallback(
    (reportIds, status) => {
      const ids = new Set(
        (Array.isArray(reportIds) ? reportIds : [])
          .filter((v) => v != null && v !== '')
          .map((v) => String(v).replace(/\D/g, ''))
      );
      if (ids.size === 0) return;
      const list = reportsRef.current.map((r) =>
        ids.has(String(r.id ?? r.ID).replace(/\D/g, '')) ? { ...r, status } : r
      );
      reportsRef.current = list;
      applyMetrics(list);
    },
    [applyMetrics]
  );

  const showToast = useCallback((message, type = 'success') => {
    setToastNotification({ message, type });
    setTimeout(() => setToastNotification(null), 4000);
  }, []);

  // ──── Fetch live API data on mount & reload ────
  useEffect(() => {
    let cancelled = false;

    async function loadApiData() {
      try {
        // Health dijalankan paralel dengan data agar tidak menambah latensi.
        const [healthResult, allReports, matchesData] = await Promise.all([
          ApiService.checkHealth(),
          ApiService.getReports(),
          ApiService.getMatches(),
        ]);
        if (cancelled) return;
        setApiOnline(Boolean(healthResult?.online));

        if (!healthResult?.online) {
          console.info('[Dashboard] API offline, using local data');
          return;
        }
        if (allReports == null) return;

        matchesRef.current = Array.isArray(matchesData) ? matchesData : [];
        reportsRef.current = Array.isArray(allReports) ? allReports : [];
        applyMetrics(reportsRef.current);

        if (Array.isArray(allReports) && allReports.length > 0) {
          // Index match aktif (non-rejected) per laporan lost, + found report by id.
          const matchList = Array.isArray(matchesData) ? matchesData : [];
          const matchByLost = new Map();
          matchList
            .filter((m) => String(m.status || '').toLowerCase() !== 'rejected')
            .forEach((m) => matchByLost.set(String(m.lost_report_id), m));
          const foundById = new Map(
            allReports
              .filter((r) => r.type === 'found')
              .map((f) => [String(f.id ?? f.ID), f])
          );

          // Transform API reports to dashboard ticket format
          const apiTickets = allReports.map((r) => {
            const isLost = r.type === 'lost';
            const dateStr = r.created_at
              ? new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
              : '';
            const timeStr = r.created_at
              ? new Date(r.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
              : '';

            let candidate = null;
            if (isLost) {
              const pairMatch = matchByLost.get(String(r.id ?? r.ID));
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
                  category: found?.category || '',
                  roomNumber: found?.room_number || '',
                  locationFound: found?.location || '',
                  finderName: found?.user?.name || '',
                  foundAt: found?.created_at
                    ? new Date(found.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                    : '',
                  matchStatus: pairMatch.status || 'pending',
                };
              }
            }

            return {
              id: r.report_identifier || `#RPT-${r.id || r.ID}`,
              _apiId: r.id || r.ID,
              _userId: r.user_id ?? r.userId ?? null,
              ticketNumber: `RPT-${r.id || r.ID}`,
              guestName: r.user?.name || r.guest_name || r.name || (isLost ? 'Tamu' : 'Staf'),
              isVip: false,
              room: (r.room_number || r.roomNumber)
                ? (String(r.room_number || r.roomNumber).toLowerCase().startsWith('kamar')
                    ? (r.room_number || r.roomNumber)
                    : `Kamar ${r.room_number || r.roomNumber}`)
                : '-',
              itemTitle: r.title || 'Barang',
              category: (r.category || 'general').toLowerCase(),
              iconType: isLost ? 'alert-circle' : 'box',
              locationDetail: r.location || r.room_number || '-',
              reportTime: `${dateStr}, ${timeStr} WIB`,
              status: mapApiStatus(r.status, r.type),
              statusType: mapApiStatusType(r.status, r.type),
              priorityTag: null,
              type: r.type,
              description: r.description || '',
              _candidate: candidate,
              _source: 'api',
            };
          });

          setTickets((prev) => {
            // Merge: API data first, then any local-only data
            const localOnly = prev.filter(t => t._source !== 'api');
            return [...apiTickets, ...localOnly];
          });

          // Update category stats from API data
          const catMap = {};
          allReports.forEach(r => {
            const cat = r.category || 'Lainnya';
            catMap[cat] = (catMap[cat] || 0) + 1;
          });
          
          const catColors = ['#2563eb', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#94a3b8'];
          const catEntries = Object.entries(catMap).map(([name, count], i) => ({
            id: `cat-api-${i}`,
            name,
            percent: allReports.length > 0 ? Math.round((count / allReports.length) * 100) : 0,
            items: count,
            color: catColors[i % catColors.length],
            icon: 'box'
          }));

          if (catEntries.length > 0) {
            setCategories(catEntries);
          }

          // Update activities from recent reports
          const recentActivities = allReports.slice(0, 5).map(r => {
            const time = r.created_at
              ? new Date(r.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
              : '';
            return {
              id: `act-${r.id || r.ID}`,
              time: `${time} WIB`,
              text: `${r.type === 'found' ? 'Barang temuan' : 'Laporan kehilangan'}: ${r.title || 'Barang'} (${r.location || '-'})`,
              icon: r.type === 'found' ? 'package' : 'alert-circle',
              type: r.type === 'found' ? 'info' : 'warning',
            };
          });

          if (recentActivities.length > 0) {
            setActivities(recentActivities);
          }
        }

      } catch (err) {
        console.warn('[Dashboard] Failed to load API data:', err.message);
      }
    }

    loadApiData();

    return () => { cancelled = true; };
  }, [apiReloadKey, applyMetrics]);

  const showToastCallback = showToast;

  // Filtered tickets based on tab and search
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Tab filter: Semua / Lost / Found
      if (activeTableFilter === 'lost' && ticket.type !== 'lost') return false;
      if (activeTableFilter === 'found' && ticket.type !== 'found') return false;

      // Search query (nama barang & kamar)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          (ticket.itemTitle || '').toLowerCase().includes(q) ||
          (ticket.room || '').toLowerCase().includes(q) ||
          (ticket.guestName || '').toLowerCase().includes(q) ||
          (ticket.id || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [tickets, activeTableFilter, searchQuery]);

  // Actions
  const handleOpenMatchModal = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleCloseMatchModal = () => {
    setSelectedTicket(null);
  };

  // ──── WhatsApp notification (semi-otomatis via deep link wa.me) ────
  const openWhatsAppPreview = async (ticket, event) => {
    if (!ticket) return;
    if (ticket.type !== 'lost') {
      showToastCallback('Notifikasi WhatsApp hanya untuk laporan tamu (barang hilang).', 'info');
      return;
    }
    if (!ticket._userId) {
      showToastCallback('Data tamu tidak tersedia, notifikasi WhatsApp dilewati.', 'info');
      return;
    }

    setWaPreviewLoading(true);
    try {
      const user = await ApiService.getUserById(ticket._userId);
      const phone = normalizePhone(user?.phone);
      const guestName = user?.name || ticket.guestName;
      if (!phone) {
        showToastCallback(`Nomor WhatsApp ${guestName} belum tersedia.`, 'info');
        return;
      }
      setWaPreview({
        event,
        eventLabel: notifEventLabel(event),
        phone,
        guestName,
        itemTitle: ticket.itemTitle,
        room: ticket.room,
        message: buildNotificationMessage({
          event,
          guestName,
          itemTitle: ticket.itemTitle,
          room: ticket.room,
        }),
      });
    } catch (err) {
      showToastCallback(`Gagal menyiapkan notifikasi WhatsApp: ${err.message}`, 'info');
    } finally {
      setWaPreviewLoading(false);
    }
  };

  const handleCloseWhatsAppPreview = () => setWaPreview(null);

  const handleWhatsAppMessageChange = (text) =>
    setWaPreview((prev) => (prev ? { ...prev, message: text } : prev));

  const handleConfirmWhatsAppSend = () => {
    if (!waPreview) return;
    const url = buildWhatsAppUrl(waPreview.phone, waPreview.message);
    if (!url) {
      showToastCallback('Nomor WhatsApp tidak valid.', 'info');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
    showToastCallback(
      `Membuka WhatsApp untuk ${waPreview.guestName} (${waPreview.phone}).`,
      'success'
    );
    setWaPreview(null);
  };

  const handleConfirmMatch = async (ticketId) => {
    const ticket = tickets.find((t) => t.id === ticketId);
    setActionLoading(true);
    try {
      if (ticket?._candidate) {
        const user = ApiService.getCurrentUser();
        const viaApi = await applyMatchDecision({
          candidate: ticket._candidate,
          nextStatus: 'approved',
          extra: {
            verified_by: user?.id ?? user?.ID ?? null,
          },
          matches: matchesRef.current,
        });
        if (!viaApi) {
          throw new Error('Match tidak ditemukan di backend.');
        }
        setTickets((prev) =>
          prev.map((t) =>
            t.id === ticket.id
              ? {
                  ...t,
                  status: 'Terverifikasi',
                  statusType: 'green',
                  _candidate: { ...(t._candidate || {}), matchStatus: 'approved' },
                }
              : t
          )
        );
        showToastCallback(`Tiket ${ticket.id} berhasil diverifikasi (match disetujui).`, 'success');
        patchReportStatuses([ticket._apiId, ticket._candidate?.found_report_id], 'dikonfirmasi');
        void openWhatsAppPreview(ticket, WHATSAPP_EVENTS.VERIFIED);
      } else if (ticket && !ticket._apiId) {
        // Tiket lokal/offline: pakai kandidat lokal bila memang ada.
        const localCandidates = MatchReviewModel.getCandidates(ticket.id);
        const candidate = localCandidates[0] || null;
        if (!candidate) {
          showToastCallback(
            'Belum ada pasangan untuk laporan ini. Buat pasangan di halaman Match Review terlebih dahulu.',
            'info'
          );
          return;
        }
        await applyMatchDecisionLocal({
          ticket,
          candidate,
          nextStatus: 'approved',
          extra: {},
        });
        setTickets((prev) =>
          prev.map((t) =>
            t.id === ticket.id
              ? {
                  ...t,
                  status: 'Terverifikasi',
                  statusType: 'green',
                  _candidate: { ...(t._candidate || {}), matchStatus: 'approved' },
                }
              : t
          )
        );
        showToastCallback(`Tiket ${ticket.id} terverifikasi (mode lokal).`, 'success');
      } else {
        showToastCallback(
          'Belum ada pasangan untuk laporan ini. Buat pasangan di halaman Match Review terlebih dahulu.',
          'info'
        );
      }
    } catch (err) {
      console.warn('[Dashboard] confirm match gagal:', err.message);
      showToastCallback(`Gagal memverifikasi: ${err.message}`, 'info');
    } finally {
      setActionLoading(false);
      setSelectedTicket(null);
      setApiReloadKey((prev) => prev + 1);
    }
  };

  const handleExportRecap = async () => {
    setActionLoading(true);
    const res = await DashboardController.exportRecapReport();
    setActionLoading(false);
    if (res.success) {
      showToastCallback(res.message, 'success');
    }
  };

  const handleMarkHandedOver = async (ticket) => {
    setActionLoading(true);
    try {
      const viaApi = await markMatchHandedOver({ ticket });
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticket.id ? { ...t, status: 'Diserahkan', statusType: 'blue' } : t
        )
      );
      if (viaApi) {
        patchReportStatuses([ticket._apiId, ticket._candidate?.found_report_id], 'dikembalikan');
      }
      showToastCallback(
        viaApi
          ? `Barang ${ticket.id} berhasil ditandai Diserahkan.`
          : `Barang ${ticket.id} ditandai Diserahkan (mode lokal).`,
        'success'
      );
    } catch (err) {
      console.warn('[Dashboard] tandai diserahkan gagal:', err.message);
      showToastCallback(`Gagal menandai diserahkan: ${err.message}`, 'info');
    } finally {
      setActionLoading(false);
      setApiReloadKey((prev) => prev + 1);
    }
  };

  const handleSaveQuickReport = (result) => {
    // Dipanggil oleh QuickReportModal setelah ReportLostForm sukses submit.
    // Report sudah dibuat via adminReportApi (services/lostReport) — API lost
    // report (online) atau tiket lokal (offline). Cukup tampilkan di daftar.
    setIsQuickReportOpen(false);

    const report = result?.data || {};
    const newTicket = {
      id: report.report_identifier || report.id || `#RPT-${Date.now()}`,
      _apiId: report.id ?? report.ID ?? null,
      ticketNumber: `RPT-${report.id || report.ID || Date.now()}`,
      guestName: report.user?.name || report.guestName || 'Tamu',
      isVip: false,
      room: report.room_number || report.roomNumber || '-',
      itemTitle: report.title || report.itemName || 'Barang',
      category: (report.category || 'general').toLowerCase(),
      iconType: 'alert-circle',
      locationDetail: report.location || report.locationLost || report.room_number || '-',
      reportTime: 'Baru saja',
      status: report.status === 'Menunggu Verifikasi' ? 'Menunggu Verifikasi' : 'Baru Masuk',
      statusType: 'gray',
      priorityTag: null,
      type: report.type || 'lost',
      description: report.description || report.secretDetail || '',
      _source: 'api',
    };

    setTickets((prev) => [newTicket, ...prev.filter((t) => t._source !== 'api')]);
    if (report && (report.id != null || report.ID != null)) {
      reportsRef.current = [report, ...reportsRef.current];
      applyMetrics(reportsRef.current);
    }
    setApiReloadKey((prev) => prev + 1);
    showToastCallback('Laporan kehilangan berhasil dibuat & masuk ke antrean Verifikasi.', 'success');
  };

  return {
    activeNav,
    setActiveNav,
    activeTableFilter,
    setActiveTableFilter,
    searchQuery,
    setSearchQuery,
    metrics,
    tickets: filteredTickets,
    totalTicketCount: tickets.length,
    activities,
    categories,
    selectedTicket,
    isQuickReportOpen,
    setIsQuickReportOpen,
    waPreview,
    waPreviewLoading,
    handleCloseWhatsAppPreview,
    handleWhatsAppMessageChange,
    handleConfirmWhatsAppSend,
    toastNotification,
    actionLoading,
    apiOnline,
    handleOpenMatchModal,
    handleCloseMatchModal,
    handleConfirmMatch,
    handleMarkHandedOver,
    handleExportRecap,
    handleSaveQuickReport
  };
}

// ──── Helpers ────
function mapApiStatus(status, type = 'lost') {
  if (isReportResolved(status)) return 'Diserahkan';
  return reportStatusLabel(status, type);
}

function mapApiStatusType(status) {
  return reportStatusType(status);
}

/**
 * Hitung KPI card "Dashboard Operasional" dari daftar report API.
 * Konsisten terhadap label masing-masing card:
 *  - Total Barang Temuan (Bulan Ini): report found dengan created_at bulan berjalan.
 *  - Barang Menunggu Verifikasi: semua report berstatus 'baru' ATAU 'dicocokkan'.
 *  - Terverifikasi Bulan Ini: report 'dikonfirmasi' yang diperbarui bulan berjalan.
 *  - Resolved / Selesai Handover: semua report 'dikembalikan' + rate sukses.
 */
function buildDashboardMetrics(reports = []) {
  const list = Array.isArray(reports) ? reports : [];

  const now = new Date();
  const inThisMonth = (value) => {
    if (!value) return false;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return false;
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  };

  const foundAll = list.filter((r) => r.type === 'found');
  const foundThisMonth = foundAll.filter((r) => inThisMonth(r.created_at));
  const pending = list.filter((r) => isReportAwaiting(r.status));
  const verifiedThisMonth = list.filter(
    (r) => isReportVerified(r.status) && inThisMonth(r.updated_at || r.created_at)
  );
  const completed = list.filter((r) => isReportResolved(r.status));
  const successRate = list.length > 0 ? Math.round((completed.length / list.length) * 100) : 0;

  return {
    totalFound: {
      value: foundThisMonth.length,
      unit: 'Item',
      label: 'Total Barang Temuan (Bulan Ini)',
      trendText: `+${foundAll.length} total dari API`,
      trendType: 'up',
    },
    pendingVerification: {
      value: pending.length,
      unit: 'Barang',
      label: 'Barang Menunggu Verifikasi',
      badge: pending.length > 0 ? 'Butuh Tindakan Segera' : '',
      alertText: pending.length > 2 ? `${pending.length} barang menunggu` : '',
      isHighlighted: pending.length > 0,
    },
    verifiedMonth: {
      value: verifiedThisMonth.length,
      unit: 'Item',
      label: 'Terverifikasi Bulan Ini',
      statusText: 'Terkonfirmasi Valid',
    },
    resolvedHandover: {
      value: completed.length,
      unit: 'Dikembalikan',
      label: 'Resolved / Selesai Handover',
      successRate: `${successRate}% Rate Sukses`,
      targetText: 'Target: 80%',
    },
  };
}

export default useDashboardController;
