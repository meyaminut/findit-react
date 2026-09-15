import { useState, useMemo } from 'react';
import { AllReportsController } from './AllReportsController';

/**
 * Controller Hook: useAllReportsController
 * Exposes reactive filtering, table sorting, export, and selection to AllReportsView
 */
export function useAllReportsController() {
  const [reports, setReports] = useState(() => AllReportsController.getReports());
  const metrics = useMemo(() => AllReportsController.getMetrics(), []);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'lost' | 'found'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'new' | 'matched' | 'confirmed' | 'returned'
  const [dateRange, setDateRange] = useState('30days');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [selectedReport, setSelectedReport] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

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
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesId = item.id.toLowerCase().includes(q);
        const matchesReporter = item.reporter.name.toLowerCase().includes(q);
        const matchesLoc = item.location.toLowerCase().includes(q);
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
    totalCount: '1,428',
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
    handleExport,
    handleSelectReport,
    handleCloseDetail
  };
}

export default useAllReportsController;
