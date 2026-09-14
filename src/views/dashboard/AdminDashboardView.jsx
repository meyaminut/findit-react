import React from 'react';
import useDashboardController from '../../controllers/useDashboardController';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import KpiMetrics from './components/KpiMetrics';
import QueueList from './components/QueueList';
import TrendChartWidget from './components/TrendChartWidget';
import DiagnosticWidget from './components/DiagnosticWidget';
import ReviewMatchModal from './components/ReviewMatchModal';
import CreateIncidentModal from './components/CreateIncidentModal';
import './AdminDashboardView.css';

/**
 * View Component: AdminDashboardView ("Control & Dispatch")
 * Strict MVC View layer rendering the operational console dashboard.
 * Delegates all logic to `useDashboardController`.
 */
export function AdminDashboardView({ onLogout, onNavChange }) {
  const {
    activeNav,
    setActiveNav,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    metrics,
    diagnostics,
    filteredQueue,
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
  } = useDashboardController();

  const handleNav = (navId) => {
    setActiveNav(navId);
    if (onNavChange) {
      onNavChange(navId);
    }
  };

  return (
    <div className="dashboard-layout-container">
      {/* 1. Left Sidebar Navigation (With clean Logo only, no text as requested) */}
      <Sidebar
        activeNav="Dashboard"
        onNavChange={handleNav}
        onLogout={onLogout}
      />

      {/* 2. Main Dashboard Area */}
      <div className="dashboard-main-area">
        {/* Global Top Navbar */}
        <TopNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Dashboard Content */}
        <main className="dashboard-content-body">
          {/* Page Header (Breadcrumbs, Title, Shift Tag) */}
          <div className="dashboard-page-header">
            <div className="header-left-col">
              <span className="dashboard-breadcrumbs">
                OVERVIEW &gt; OPERATIONAL DASHBOARD
              </span>
              <h1 className="dashboard-main-heading">Control &amp; Dispatch</h1>
            </div>

            <div className="dashboard-shift-pill">
              <span className="shift-dot-orange"></span>
              <span>Today, Oct 24, 2024 &nbsp; <strong className="shift-badge-inner">Shift 02 (Day)</strong></span>
            </div>
          </div>

          {/* 4 KPI Telemetry Cards */}
          <KpiMetrics metrics={metrics} />

          {/* Main 2-Column Split */}
          <div className="dashboard-grid-2col">
            {/* Left Column: Triage Queue & Candidate Pairings */}
            <QueueList
              queueItems={filteredQueue}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              onOpenReview={handleOpenReview}
              onDismiss={handleDismiss}
              onScanDatabase={handleScanDatabase}
            />

            {/* Right Column: Widgets */}
            <div className="dashboard-side-col">
              <TrendChartWidget />
              <DiagnosticWidget
                diagnostics={diagnostics}
                onCreateIncident={() => setIsCreateIncidentOpen(true)}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Modal: Review Match Pairing */}
      <ReviewMatchModal
        match={selectedMatch}
        onClose={handleCloseReview}
        onApprove={handleApproveMatch}
        onReject={handleRejectMatch}
        isLoading={actionLoading}
      />

      {/* Modal: Create Incident Report */}
      <CreateIncidentModal
        isOpen={isCreateIncidentOpen}
        onClose={() => setIsCreateIncidentOpen(false)}
        onSave={handleSaveIncident}
        isLoading={actionLoading}
      />

      {/* Interactive Toast Notifications */}
      {toastNotification && (
        <div className="dashboard-toast-container">
          <div className="dashboard-toast">
            {toastNotification.message}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardView;
