import React from 'react';
import { 
  RotateCcw, 
  Bookmark, 
  PlusCircle, 
  Layers, 
  ShieldCheck, 
  Inbox,
  ArrowLeft
} from 'lucide-react';
import useClaimTicketController from '../../controllers/useClaimTicketController';
import Sidebar from '../dashboard/components/Sidebar';
import TopNavbar from '../dashboard/components/TopNavbar';
import GuestStayInfoCard from './components/GuestStayInfoCard';
import ConfidentialItemCard from './components/ConfidentialItemCard';
import AutoMatchBanner from './components/AutoMatchBanner';
import MatchPreviewModal from './components/MatchPreviewModal';
import './NewClaimTicketView.css';

/**
 * View Component: NewClaimTicketView (6. Buat Laporan Tamu)
 * Clean MVC View rendering the official Grand Melia New Claim Ticket intake screen.
 * Uses FindIt's signature royal blue navigation sidebar and Figma color tokens.
 */
export function NewClaimTicketView({ onLogout, onNavChange, activeNav = 'Tiket Klaim' }) {
  const {
    formData,
    categories,
    quickLocations,
    autoMatchCandidate,
    isMatchPreviewOpen,
    setIsMatchPreviewOpen,
    isSubmitting,
    toastNotification,
    handleInputChange,
    handleCategoryChange,
    handleLoyaltyChange,
    handleQuickLocationSelect,
    handleResetForm,
    handleSaveDraft,
    handleSubmit
  } = useClaimTicketController();

  const handleNav = (navId) => {
    if (onNavChange) {
      onNavChange(navId);
    }
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit(e, () => {
      setTimeout(() => {
        if (onNavChange) {
          onNavChange('Tiket Klaim');
        }
      }, 700);
    });
  };

  return (
    <div className="claim-app-layout">
      {/* 1. Left Sidebar Navigation (Royal Blue with Active Indicator) */}
      <Sidebar
        activeNav={activeNav}
        onNavChange={handleNav}
        onLogout={onLogout}
      />

      {/* 2. Main Viewport Container */}
      <div className="claim-main-viewport">
        {/* Global Top Navbar */}
        <TopNavbar />

        {/* Scrollable Form Content */}
        <main className="claim-scrollable-content">
          <form onSubmit={onFormSubmit}>
            {/* Header / Title Section */}
            <div className="claim-page-header">
              <div className="claim-header-titles">
                {/* Back to Ticket List Button */}
                <button
                  type="button"
                  className="btn-back-to-tickets"
                  onClick={() => handleNav('Tiket Klaim')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#1e3a8a',
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginBottom: '10px',
                    width: 'fit-content'
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Kembali ke Verifikasi</span>
                </button>

                {/* Source & Ticket Breadcrumb */}
                <div className="claim-breadcrumb-row">
                  <div className="source-tag-blue">
                    <Inbox size={13} className="inbox-icon" />
                    <span>FRONT DESK &amp; ORDER TAKER INTAKE</span>
                  </div>
                  <span className="breadcrumb-divider">/</span>
                  <span className="ticket-id-breadcrumb">
                    Laporan Barang Baru {formData.ticketNumber}
                  </span>
                </div>

                {/* Main Heading */}
                <h1 className="claim-main-heading">
                  Buat Laporan Klaim Tamu Baru
                </h1>

                {/* Subheading */}
                <p className="claim-subheading">
                  Input laporan kehilangan barang dari telepon tamu / front desk inquiry secara akurat untuk mempermudah pelacakan tim Housekeeping.
                </p>
              </div>

              {/* PMS Synced Badge */}
              <div className="pms-synced-box">
                <div className="pms-top-line">
                  <span className="pms-status-dot"></span>
                  <span className="pms-status-label">PMS SYNCED</span>
                </div>
                <span className="pms-hotel-title">
                  Grand Melia Jakarta (OPERA Cloud Live)
                </span>
              </div>
            </div>

            {/* 3. Card 1: Guest Stay Info */}
            <GuestStayInfoCard
              formData={formData}
              onChange={handleInputChange}
              onLoyaltyChange={handleLoyaltyChange}
            />

            {/* 4. Card 2: Confidential Item Verification */}
            <ConfidentialItemCard
              formData={formData}
              categories={categories}
              quickLocations={quickLocations}
              onChange={handleInputChange}
              onCategoryChange={handleCategoryChange}
              onQuickLocationSelect={handleQuickLocationSelect}
            />

            {/* 5. Card 3: Auto-Match Intelligence Ready Banner */}
            <AutoMatchBanner
              candidate={autoMatchCandidate}
              onPreviewMatch={() => setIsMatchPreviewOpen(true)}
            />

            {/* 6. Bottom Action Controls Bar */}
            <div className="claim-bottom-actions-bar">
              <div className="actions-left-group">
                <button
                  type="button"
                  className="btn-action-neutral"
                  onClick={handleResetForm}
                >
                  <RotateCcw size={15} />
                  <span>Batal &amp; Reset Form</span>
                </button>

                <button
                  type="button"
                  className="btn-action-neutral"
                  onClick={handleSaveDraft}
                  disabled={isSubmitting}
                >
                  <Bookmark size={15} />
                  <span>Simpan Draf Laporan</span>
                </button>
              </div>

              <div className="actions-right-group">
                <button
                  type="submit"
                  className="btn-create-claim-gold"
                  disabled={isSubmitting}
                >
                  <PlusCircle size={17} />
                  <span>{isSubmitting ? 'Memproses...' : '+ Buat Laporan Barang Sekarang'}</span>
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>

      {/* Modal: Match Preview */}
      <MatchPreviewModal
        isOpen={isMatchPreviewOpen}
        onClose={() => setIsMatchPreviewOpen(false)}
        formData={formData}
        candidate={autoMatchCandidate}
      />

      {/* Toast Notifications */}
      {toastNotification && (
        <div className="claim-toast-container">
          <div className={`claim-toast ${toastNotification.type}`}>
            {toastNotification.message}
          </div>
        </div>
      )}
    </div>
  );
}

export default NewClaimTicketView;
