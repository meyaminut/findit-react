import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Sparkles, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import Sidebar from '../dashboard/components/Sidebar';
import TopNavbar from '../dashboard/components/TopNavbar';
import MatchReviewHeader from './components/MatchReviewHeader';
import GuestClaimDetailCard from './components/GuestClaimDetailCard';
import HousekeepingCandidatesCard from './components/HousekeepingCandidatesCard';
import MatchReviewFooter from './components/MatchReviewFooter';
import { StorageService } from '../../services/StorageService';
import './MatchReviewView.css';

/**
 * View Component: MatchReviewView (7. Verifikasi & Pencocokan / Match Review)
 * Modularized clean MVC View for Front Office verification.
 * Backed by StorageService for state persistence.
 */
export function MatchReviewView({ 
  activeNav = 'Verifikasi & Pencocokan', 
  onNavChange, 
  onLogout,
  onProceedToHandover 
}) {
  const [tickets, setTickets] = useState(() => StorageService.getTickets());
  const [foundItems, setFoundItems] = useState(() => StorageService.getFoundItems());
  const [searchQuery, setSearchQuery] = useState('');
  const [roomFilter, setRoomFilter] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [zoomedPhotoUrl, setZoomedPhotoUrl] = useState(null);
  const [toastNotification, setToastNotification] = useState(null);

  const [verifiedPoints, setVerifiedPoints] = useState({
    category: true,
    model: true,
    color: true,
    location: true,
    secret: true
  });

  // Pick first pending ticket or fallback
  const activeTicket = tickets.find(t => t.status === 'Menunggu Verifikasi') || tickets[0] || {
    id: '#TK-2024-0314',
    guestName: 'Hendra Gunawan',
    roomNumber: 'Kamar 314',
    itemName: 'Garmin Venu SQ (Tali Karet Hitam)',
    category: 'Elektronik • Smartwatch',
    color: 'Hitam Matte',
    locationLost: 'Meja Nakas Kanan Kamar 314',
    secretDetail: 'Ada goresan halus sudut kiri atas, wallpaper foto anjing golden retriever.',
    phone: '+62 812-3456-7890',
    email: 'hendra.gunawan@email.com',
    status: 'Menunggu Verifikasi',
    reportedAt: '14 Mar 2024, 10:50 WIB'
  };

  const showToast = (message, type = 'success') => {
    setToastNotification({ message, type });
    setTimeout(() => setToastNotification(null), 3500);
  };

  const handleVerifyToggle = (key) => {
    setVerifiedPoints(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleMarkVerified = () => {
    if (activeTicket?.id) {
      StorageService.updateTicketStatus(activeTicket.id, 'Terverifikasi');
    }
    showToast(`Tiket ${activeTicket.id} berhasil diverifikasi! Mengalihkan ke Proses Handover...`);
    setTimeout(() => {
      if (onProceedToHandover) {
        onProceedToHandover();
      } else if (onNavChange) {
        onNavChange('Handover');
      }
    }, 800);
  };

  const handleRejectRelation = () => {
    showToast('Relasi barang dilepas. Kandidat dikembalikan ke antrean temuan.', 'warning');
  };

  const handlePostpone = () => {
    showToast('Status diperbarui: Menunda dan meminta bukti tambahan ke tamu.', 'info');
  };

  return (
    <div className="match-review-app-layout">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeNav={activeNav}
        onNavChange={onNavChange}
        onLogout={onLogout}
      />

      {/* 2. Main Viewport Container */}
      <div className="match-review-viewport">
        <TopNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Scrollable Main Workspace */}
        <main className="match-review-content">
          <MatchReviewHeader
            ticket={activeTicket}
            onProtocolClick={() => showToast('Protokol SOP FO Double-Blind Check Aktif: Data klaim tersandi terlindungi.', 'info')}
          />

          {/* Active Mode Banner */}
          <div className="matching-mode-banner">
            <div className="banner-left-content">
              <div className="banner-mode-icon-box">
                <ArrowRightLeft size={18} className="banner-mode-icon" />
              </div>
              <div className="banner-text-group">
                <h2 className="banner-mode-title">Mode Pencocokan Aktif</h2>
                <p className="banner-mode-desc">
                  Bandingkan klaim rahasia tamu dengan data fisik barang temuan housekeeping. Hindari membacakan ciri khusus ke tamu terlebih dahulu.
                </p>
              </div>
            </div>

            <div className="banner-ai-pill">
              <Sparkles size={14} className="banner-sparkle-icon" />
              <span>Pencocokan Ciri Khusus: Sinkronisasi 98%</span>
            </div>
          </div>

          {/* 2-Column Side-by-Side Comparison Workspace */}
          <div className="comparison-2col-grid">
            <GuestClaimDetailCard
              ticket={activeTicket}
              verifiedPoints={verifiedPoints}
              onVerifyToggle={handleVerifyToggle}
            />

            <HousekeepingCandidatesCard
              roomFilter={roomFilter}
              onRoomFilterChange={setRoomFilter}
              candidates={foundItems}
              selectedCandidate={selectedCandidate}
              onSelectCandidate={setSelectedCandidate}
              onZoomPhoto={(url) => setZoomedPhotoUrl(url)}
            />
          </div>
        </main>

        {/* 3. Sticky Bottom Operational Action Bar */}
        <MatchReviewFooter
          onRejectRelation={handleRejectRelation}
          onPostpone={handlePostpone}
          onMarkVerified={handleMarkVerified}
          verifiedCount={Object.values(verifiedPoints).filter(Boolean).length}
        />
      </div>

      {/* Modal: Zoom Photo Preview */}
      {zoomedPhotoUrl && (
        <div className="photo-zoom-modal-backdrop" onClick={() => setZoomedPhotoUrl(null)}>
          <div className="photo-zoom-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="zoom-modal-header">
              <span>Foto Temuan Fisik Petugas HK</span>
              <button 
                type="button" 
                className="zoom-modal-close"
                onClick={() => setZoomedPhotoUrl(null)}
              >
                <X size={18} />
              </button>
            </div>
            <img 
              src={zoomedPhotoUrl} 
              alt="Detail Barang Temuan" 
              className="zoomed-modal-img"
            />
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastNotification && (
        <div className={`operational-toast-pill ${toastNotification.type}`}>
          {toastNotification.type === 'warning' ? (
            <AlertTriangle size={16} />
          ) : (
            <CheckCircle2 size={16} />
          )}
          <span>{toastNotification.message}</span>
        </div>
      )}
    </div>
  );
}

export default MatchReviewView;
