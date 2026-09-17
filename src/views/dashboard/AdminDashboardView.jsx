import { PlusCircle } from 'lucide-react';
import useDashboardController from '../../controllers/useDashboardController';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import KpiMetrics from './components/KpiMetrics';
import ActionableTicketsTable from './components/ActionableTicketsTable';
import LiveActivityWidget from './components/LiveActivityWidget';
import CategoryStatsWidget from './components/CategoryStatsWidget';
import QuickReportModal from './components/QuickReportModal';
import MatchVerificationModal from './components/MatchVerificationModal';
import './AdminDashboardView.css';

/**
 * View Component: AdminDashboardView
 * Fully redesigned to match the official Grand Melia "Dashboard Operasional Lost & Found"
 * operations console while retaining FindIt's signature royal blue color across the layout.
 * Follows strict MVC separation of concerns.
 */
export function AdminDashboardView({ onLogout, onNavChange }) {
  const {
    activeNav,
    setActiveNav,
    activeTableFilter,
    setActiveTableFilter,
    searchQuery,
    setSearchQuery,
    metrics,
    tickets,
    activities,
    categories,
    selectedTicket,
    isQuickReportOpen,
    setIsQuickReportOpen,
    toastNotification,
    actionLoading,
    apiOnline,
    handleOpenMatchModal,
    handleCloseMatchModal,
    handleConfirmMatch,
    handleMarkHandedOver,
    handleSaveQuickReport
  } = useDashboardController();

  const handleNav = (navId) => {
    setActiveNav(navId);
    if (onNavChange) {
      onNavChange(navId);
    }
  };

  return (
    <div className="dashboard-app-layout">
      {/* 1. Left Sidebar Navigation (Signature Royal Blue) */}
      <Sidebar
        activeNav={activeNav}
        onNavChange={handleNav}
        onLogout={onLogout}
      />

      {/* 2. Main Content Dashboard Container */}
      <div className="dashboard-main-viewport">
        {/* Global Top Navbar */}
        <TopNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNavChange={onNavChange}
          onLogout={onLogout}
        />

        {/* Scrollable Dashboard Body */}
        <main className="dashboard-scrollable-content">
          {/* Page Title & Operational Badges */}
          <div className="dashboard-hero-header">
            <div className="hero-titles-col">
              {/* Top Badges Row */}
              <div className="hero-badges-row">
                {apiOnline ? (
                  <span className="online-badge-green">
                    <span className="green-status-dot"></span>
                    Terhubung ke Server
                  </span>
                ) : (
                  <span className="online-badge-gray">
                    <span className="gray-status-dot"></span>
                    Mode Offline — Data Lokal
                  </span>
                )}
              </div>

              {/* Main Heading */}
              <h1 className="hero-main-title">
                Dashboard Operasional Lost &amp; Found
              </h1>
            </div>

            {/* Right Action Buttons */}
            <div className="hero-actions-col">
              <button
                type="button"
                className="btn-create-report-blue"
                onClick={() => setIsQuickReportOpen(true)}
              >
                <PlusCircle size={16} className="btn-icon" />
                <span>+ Buat Laporan</span>
              </button>
            </div>
          </div>

          {/* 4 KPI Telemetry Cards */}
          <KpiMetrics metrics={metrics} />

          {/* Main 2-Column Split */}
          <div className="dashboard-middle-grid">
            {/* Left Column (~65%): Actionable Tickets Table */}
            <div className="grid-left-column">
              <ActionableTicketsTable
                tickets={tickets}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                activeFilter={activeTableFilter}
                onFilterChange={setActiveTableFilter}
                onOpenMatch={handleOpenMatchModal}
                onMarkHandedOver={handleMarkHandedOver}
              />
            </div>

            {/* Right Column (~35%): Category Stats & Live Activity Feed */}
            <div className="grid-right-column">
              <CategoryStatsWidget categories={categories} />
              <LiveActivityWidget activities={activities} />
            </div>
          </div>
        </main>
      </div>

      {/* Modal: Quick Report FO */}
      <QuickReportModal
        isOpen={isQuickReportOpen}
        onClose={() => setIsQuickReportOpen(false)}
        onSave={handleSaveQuickReport}
        isLoading={actionLoading}
      />

      {/* Modal: Match Verification */}
      <MatchVerificationModal
        ticket={selectedTicket}
        onClose={handleCloseMatchModal}
        onConfirmMatch={handleConfirmMatch}
        isLoading={actionLoading}
      />

      {/* Interactive Toast Notifications */}
      {toastNotification && (
        <div className="dashboard-toast-container">
          <div className={`dashboard-toast ${toastNotification.type}`}>
            {toastNotification.message}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardView;
