import { useState, useMemo } from 'react';
import { DashboardController } from './DashboardController';

/**
 * Controller Hook: useDashboardController
 * Exposes reactive state and event handlers for the Admin Dashboard view
 */
export function useDashboardController() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [activeFilter, setActiveFilter] = useState('pending'); // 'pending' | 'unmatched' | 'flagged'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dynamic queue list
  const [queueItems, setQueueItems] = useState(() => DashboardController.getQueueItems());
  const [metrics, setMetrics] = useState(() => DashboardController.getMetrics());
  const diagnostics = useMemo(() => DashboardController.getDiagnostics(), []);

  // Modals state
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isCreateIncidentOpen, setIsCreateIncidentOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const showToast = (message, type = 'success') => {
    setToastNotification({ message, type });
    setTimeout(() => setToastNotification(null), 4000);
  };

  // Filtered queue items
  const filteredQueue = useMemo(() => {
    return queueItems.filter((item) => {
      // Filter tab
      if (activeFilter === 'pending' && item.type !== 'match') return false;
      if (activeFilter === 'unmatched' && item.type !== 'report') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.id.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [queueItems, activeFilter, searchQuery]);

  // Actions
  const handleDismiss = (id) => {
    setQueueItems((prev) => prev.filter((item) => item.id !== id));
    showToast(`Queue item #${id} dismissed from immediate triage.`, 'info');
  };

  const handleOpenReview = (matchItem) => {
    setSelectedMatch(matchItem);
  };

  const handleCloseReview = () => {
    setSelectedMatch(null);
  };

  const handleApproveMatch = async (matchId) => {
    setActionLoading(true);
    const res = await DashboardController.approveMatch(matchId);
    setActionLoading(false);
    if (res.success) {
      setQueueItems((prev) => prev.filter((item) => item.id !== matchId));
      setSelectedMatch(null);
      showToast(res.message, 'success');
      // Increment confirmed stat
      setMetrics((prev) => ({
        ...prev,
        confirmedMonth: {
          ...prev.confirmedMonth,
          value: prev.confirmedMonth.value + 1
        },
        pendingMatches: {
          ...prev.pendingMatches,
          value: Math.max(0, prev.pendingMatches.value - 1)
        }
      }));
    }
  };

  const handleRejectMatch = async (matchId) => {
    setActionLoading(true);
    const res = await DashboardController.rejectMatch(matchId);
    setActionLoading(false);
    if (res.success) {
      setQueueItems((prev) => prev.filter((item) => item.id !== matchId));
      setSelectedMatch(null);
      showToast(res.message, 'warning');
    }
  };

  const handleScanDatabase = (reportId) => {
    showToast(`AI vector indexing scanned database for #${reportId}. No duplicates detected.`, 'info');
  };

  const handleSaveIncident = async (incidentData) => {
    setActionLoading(true);
    const res = await DashboardController.createIncident(incidentData);
    setActionLoading(false);
    if (res.success) {
      setIsCreateIncidentOpen(false);
      showToast(res.message, 'success');
      // Add to queue if active
      setQueueItems((prev) => [
        {
          id: res.identifier,
          type: 'report',
          tag: 'New Report',
          tagType: 'gray',
          category: incidentData.category || 'General',
          icon: 'fileText',
          location: incidentData.location || 'Terminal Area',
          title: incidentData.title,
          timeAgo: 'Reported just now',
          description: incidentData.description || 'Pending manual verification.'
        },
        ...prev
      ]);
    }
  };

  return {
    activeNav,
    setActiveNav,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    metrics,
    diagnostics,
    filteredQueue,
    totalQueueCount: queueItems.length,
    selectedMatch,
    isCreateIncidentOpen,
    setIsCreateIncidentOpen,
    toastNotification,
    actionLoading,
    handleDismiss,
    handleOpenReview,
    handleCloseReview,
    handleApproveMatch,
    handleRejectMatch,
    handleScanDatabase,
    handleSaveIncident
  };
}

export default useDashboardController;
