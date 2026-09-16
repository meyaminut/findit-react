import { useState, useEffect, useMemo, useCallback } from 'react';
import { DashboardController } from './DashboardController';
import ApiService from '../services/ApiService';

/**
 * Controller Hook: useDashboardController
 * Exposes reactive state and action handlers for the redesigned Grand Melia Admin Dashboard.
 * Now fetches live data from the API on mount and falls back to local data.
 */
export function useDashboardController() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [activeTableFilter, setActiveTableFilter] = useState('all'); // 'all' | 'vip' | 'electronics'
  const [searchQuery, setSearchQuery] = useState('');
  const [apiOnline, setApiOnline] = useState(false);
  
  // Operational Data
  const [metrics, setMetrics] = useState(() => DashboardController.getMetrics());
  const [tickets, setTickets] = useState(() => DashboardController.getTickets());
  const [activities, setActivities] = useState(() => DashboardController.getActivities());
  const [categories, setCategories] = useState(() => DashboardController.getCategories());
  const [unlabeledItems] = useState(() => DashboardController.getUnlabeledItems());

  // Modals & UI States
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isQuickReportOpen, setIsQuickReportOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const showToast = useCallback((message, type = 'success') => {
    setToastNotification({ message, type });
    setTimeout(() => setToastNotification(null), 4000);
  }, []);

  // ──── Fetch live API data on mount ────
  useEffect(() => {
    let cancelled = false;

    async function loadApiData() {
      try {
        const healthResult = await ApiService.checkHealth();
        if (cancelled) return;
        setApiOnline(healthResult.online);

        if (!healthResult.online) {
          console.info('[Dashboard] API offline, using local data');
          return;
        }

        // Fetch reports from API
        const allReports = await ApiService.getReports();
        if (cancelled) return;

        if (Array.isArray(allReports) && allReports.length > 0) {
          // Transform API reports to dashboard ticket format
          const apiTickets = allReports.map((r, idx) => {
            const isLost = r.type === 'lost';
            const dateStr = r.created_at
              ? new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
              : '';
            const timeStr = r.created_at
              ? new Date(r.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
              : '';

            return {
              id: `#RPT-${r.id || r.ID}`,
              _apiId: r.id || r.ID,
              ticketNumber: `RPT-${r.id || r.ID}`,
              guestName: r.user?.name || (isLost ? 'Tamu' : 'Staf'),
              isVip: false,
              room: r.location || '-',
              itemTitle: r.title || 'Barang',
              category: (r.category || 'general').toLowerCase(),
              iconType: isLost ? 'alert-circle' : 'box',
              locationDetail: r.location || '-',
              reportTime: `${dateStr}, ${timeStr} WIB`,
              status: mapApiStatus(r.status),
              statusType: mapApiStatusType(r.status),
              priorityTag: null,
              type: r.type,
              description: r.description || '',
              _source: 'api',
            };
          });

          setTickets((prev) => {
            // Merge: API data first, then any local-only data
            const localOnly = prev.filter(t => t._source !== 'api');
            return [...apiTickets, ...localOnly];
          });

          // Update KPI metrics from live data
          const foundReports = allReports.filter(r => r.type === 'found');
          const lostReports = allReports.filter(r => r.type === 'lost');
          const pending = allReports.filter(r => r.status === 'pending');
          const verified = allReports.filter(r => r.status === 'verified' || r.status === 'diverifikasi');
          const completed = allReports.filter(r => r.status === 'completed' || r.status === 'claimed');

          setMetrics({
            totalFound: {
              value: foundReports.length,
              unit: 'Item',
              label: 'Total Barang Temuan (Bulan Ini)',
              trendText: `+${foundReports.length} dari API`,
              trendType: 'up'
            },
            pendingVerification: {
              value: pending.length,
              unit: 'Barang',
              label: 'Barang Menunggu Verifikasi',
              badge: pending.length > 0 ? 'Butuh Tindakan Segera' : '',
              alertText: pending.length > 2 ? `${pending.length} barang menunggu` : '',
              isHighlighted: pending.length > 0
            },
            verifiedMonth: {
              value: verified.length,
              unit: 'Item',
              label: 'Terverifikasi Bulan Ini',
              statusText: 'Terkonfirmasi Valid'
            },
            resolvedHandover: {
              value: completed.length,
              unit: 'Dikembalikan',
              label: 'Resolved / Selesai Handover',
              successRate: allReports.length > 0
                ? `${Math.round((completed.length / allReports.length) * 100)}% Rate Sukses`
                : '0% Rate Sukses',
              targetText: 'Target: 80%'
            }
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

        // Also fetch matches count
        try {
          const matches = await ApiService.getMatches();
          if (!cancelled && Array.isArray(matches)) {
            // Additional metrics update if matches exist
          }
        } catch {}

      } catch (err) {
        console.warn('[Dashboard] Failed to load API data:', err.message);
      }
    }

    loadApiData();

    return () => { cancelled = true; };
  }, []);

  const showToastCallback = showToast;

  // Filtered tickets based on tab and search
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Tab filter
      if (activeTableFilter === 'vip' && !ticket.isVip) return false;
      if (activeTableFilter === 'electronics' && ticket.category !== 'electronics') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          (ticket.id || '').toLowerCase().includes(q) ||
          (ticket.guestName || '').toLowerCase().includes(q) ||
          (ticket.room || '').toLowerCase().includes(q) ||
          (ticket.itemTitle || '').toLowerCase().includes(q)
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

  const handleConfirmMatch = async (ticketId) => {
    setActionLoading(true);
    const res = await DashboardController.verifyTicketMatch(ticketId);
    setActionLoading(false);
    if (res.success) {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? { ...t, status: 'Terverifikasi', statusType: 'green' }
            : t
        )
      );
      setSelectedTicket(null);
      showToastCallback(res.message, 'success');
      // Update metrics
      setMetrics((prev) => ({
        ...prev,
        pendingVerification: {
          ...prev.pendingVerification,
          value: Math.max(0, prev.pendingVerification.value - 1)
        },
        verifiedMonth: {
          ...prev.verifiedMonth,
          value: prev.verifiedMonth.value + 1
        }
      }));
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

  const handleSaveQuickReport = async (reportData) => {
    setActionLoading(true);

    // Try to submit to live API first
    if (apiOnline) {
      try {
        const apiResult = await ApiService.createReport({
          type: 'found',
          title: reportData.title || reportData.brandAndModel || 'Barang Temuan',
          description: reportData.description || reportData.colorAndFeatures || '',
          category: reportData.category || 'Lainnya',
          location: reportData.location || reportData.room || '',
          user_id: 1,
          status: 'pending',
          item_date: new Date().toISOString().split('T')[0],
        });
        setActionLoading(false);
        setIsQuickReportOpen(false);
        showToastCallback(`Laporan berhasil dikirim ke server API (ID: ${apiResult?.id || apiResult?.ID || 'baru'}).`, 'success');
        
        // Add to local list
        const newTicket = {
          id: `#RPT-${apiResult?.id || apiResult?.ID || Date.now()}`,
          _apiId: apiResult?.id || apiResult?.ID,
          ticketNumber: `RPT-${apiResult?.id || apiResult?.ID || Date.now()}`,
          guestName: reportData.guestName || 'Staf FO',
          isVip: reportData.isVip || false,
          room: reportData.room || reportData.location || 'Lobby Utama',
          itemTitle: reportData.title || 'Barang Tertinggal',
          category: reportData.category || 'general',
          iconType: 'box',
          locationDetail: reportData.location || 'Area Hotel',
          reportTime: 'Baru saja',
          status: 'Baru Masuk',
          statusType: 'gray',
          priorityTag: reportData.isVip ? 'Prioritas VIP' : null,
          _source: 'api',
        };
        setTickets((prev) => [newTicket, ...prev]);
        return;
      } catch (err) {
        console.warn('[Dashboard] API createReport failed, falling back:', err.message);
      }
    }

    // Fallback to local
    const res = await DashboardController.createIncident(reportData);
    setActionLoading(false);
    if (res.success) {
      setIsQuickReportOpen(false);
      showToastCallback(res.message, 'success');
      const newTicket = {
        id: res.identifier,
        ticketNumber: res.identifier.replace('#', ''),
        guestName: reportData.guestName || 'Tamu FO',
        isVip: reportData.isVip || false,
        room: reportData.room || 'Lobby Utama',
        itemTitle: reportData.title || 'Barang Tertinggal',
        category: reportData.category || 'general',
        iconType: 'box',
        locationDetail: reportData.location || 'Area Hotel',
        reportTime: 'Baru saja',
        status: 'Baru Masuk',
        statusType: 'gray',
        priorityTag: reportData.isVip ? 'Prioritas VIP' : null
      };
      setTickets((prev) => [newTicket, ...prev]);
    }
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
    unlabeledItems,
    selectedTicket,
    isQuickReportOpen,
    setIsQuickReportOpen,
    toastNotification,
    actionLoading,
    apiOnline,
    handleOpenMatchModal,
    handleCloseMatchModal,
    handleConfirmMatch,
    handleExportRecap,
    handleSaveQuickReport
  };
}

// ──── Helpers ────
function mapApiStatus(status) {
  const map = {
    'pending': 'Baru Masuk',
    'diverifikasi': 'Terverifikasi',
    'verified': 'Terverifikasi',
    'approved': 'Disetujui',
    'completed': 'Selesai',
    'claimed': 'Diklaim',
    'rejected': 'Ditolak',
  };
  return map[status] || 'Baru Masuk';
}

function mapApiStatusType(status) {
  const map = {
    'pending': 'gray',
    'diverifikasi': 'green',
    'verified': 'green',
    'approved': 'blue',
    'completed': 'green',
    'claimed': 'green',
    'rejected': 'red',
  };
  return map[status] || 'gray';
}

export default useDashboardController;
