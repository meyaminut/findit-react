import React from 'react';
import { Clock, Download, PlusCircle } from 'lucide-react';
import useDashboardController from '../../controllers/useDashboardController';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import KpiMetrics from './components/KpiMetrics';
import ActionableTicketsTable from './components/ActionableTicketsTable';
import LiveActivityWidget from './components/LiveActivityWidget';
import CategoryStatsWidget from './components/CategoryStatsWidget';
import UnlabeledItemsGallery from './components/UnlabeledItemsGallery';
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
        />

        {/* Scrollable Dashboard Body */}
        <main className="dashboard-scrollable-content">
          {/* Page Title & Operational Badges */}
          <div className="dashboard-hero-header">
            <div className="hero-titles-col">
              {/* Top Badges Row */}
              <div className="hero-badges-row">
                <span className="desk-badge-blue">FRONT OFFICE DESK</span>
                <span className="online-badge-green">
                  <span className="green-status-dot"></span>
                  Sistem Online
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="hero-main-title">
                Dashboard Operasional Lost &amp; Found
              </h1>

              {/* Subtitle / Shift Meta */}
              <div className="hero-shift-meta">
                <Clock size={15} className="shift-clock-icon" />
                <span>Grand Melia Jakarta • Shift Pagi (07:00 - 15:00 WIB)</span>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="hero-actions-col">
              <button
                type="button"
                className="btn-export-rekap"
                onClick={handleExportRecap}
                disabled={actionLoading}
              >
                <Download size={16} className="btn-icon" />
                <span>Ekspor Rekap</span>
              </button>

              <button
                type="button"
                className="btn-create-report-blue"
                onClick={() => setIsQuickReportOpen(true)}
              >
                <PlusCircle size={16} className="btn-icon" />
                <span>+ Buat Laporan Cepat</span>
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
                activeFilter={activeTableFilter}
                onFilterChange={setActiveTableFilter}
                onOpenMatch={handleOpenMatchModal}
              />
            </div>

            {/* Right Column (~35%): Live Activity Feed & Category Stats */}
            <div className="grid-right-column">
              <LiveActivityWidget activities={activities} />
              <CategoryStatsWidget categories={categories} />
            </div>
          </div>

          {/* Bottom Section: Unlabeled Storage Items */}
          <UnlabeledItemsGallery items={unlabeledItems} />
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
