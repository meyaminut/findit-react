import { useState, useMemo } from 'react';
import { DashboardController } from './DashboardController';

/**
 * Controller Hook: useDashboardController
 * Exposes reactive state and action handlers for the redesigned Grand Melia Admin Dashboard.
 */
export function useDashboardController() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [activeTableFilter, setActiveTableFilter] = useState('all'); // 'all' | 'vip' | 'electronics'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Operational Data
  const [metrics, setMetrics] = useState(() => DashboardController.getMetrics());
  const [tickets, setTickets] = useState(() => DashboardController.getTickets());
  const [activities, setActivities] = useState(() => DashboardController.getActivities());
  const [categories] = useState(() => DashboardController.getCategories());
  const [unlabeledItems] = useState(() => DashboardController.getUnlabeledItems());

  // Modals & UI States
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isQuickReportOpen, setIsQuickReportOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const showToast = (message, type = 'success') => {
    setToastNotification({ message, type });
    setTimeout(() => setToastNotification(null), 4000);
  };

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
          ticket.id.toLowerCase().includes(q) ||
          ticket.guestName.toLowerCase().includes(q) ||
          ticket.room.toLowerCase().includes(q) ||
          ticket.itemTitle.toLowerCase().includes(q)
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
      showToast(res.message, 'success');
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
      showToast(res.message, 'success');
    }
  };

  const handleSaveQuickReport = async (reportData) => {
    setActionLoading(true);
    const res = await DashboardController.createIncident(reportData);
    setActionLoading(false);
    if (res.success) {
      setIsQuickReportOpen(false);
      showToast(res.message, 'success');
      // Add new ticket to top of table
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
    handleOpenMatchModal,
    handleCloseMatchModal,
    handleConfirmMatch,
    handleExportRecap,
    handleSaveQuickReport
  };
}

export default useDashboardController;
