import React from 'react';
import { X, CheckCircle2, AlertCircle, MapPin, Clock, Tag } from 'lucide-react';

/**
 * View Component: MatchVerificationModal
 * Modal triggered by clicking "Cocokkan" on any ticket row.
 */
export function MatchVerificationModal({ ticket, onClose, onConfirmMatch, isLoading }) {
  if (!ticket) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog-box modal-match-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top-bar">
          <div className="modal-title-wrap">
            <CheckCircle2 size={20} className="text-amber-500" />
            <h3 className="modal-heading">Pencocokan Barang: {ticket.id}</h3>
          </div>
          <button type="button" className="modal-close-icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="match-comparison-content">
          {/* Ticket Claim Info */}
          <div className="match-card-side guest-side">
            <div className="match-side-badge">KLAIM TAMU HOTEL</div>
            <h4 className="match-item-name">{ticket.itemTitle}</h4>
            <div className="match-meta-list">
              <div className="match-meta-row">
                <span className="meta-label">Nama Tamu:</span>
                <span className="meta-value bold">{ticket.guestName} {ticket.isVip && '(VIP)'}</span>
              </div>
              <div className="match-meta-row">
                <span className="meta-label">Kamar:</span>
                <span className="meta-value">{ticket.room}</span>
              </div>
              <div className="match-meta-row">
                <span className="meta-label">Waktu:</span>
                <span className="meta-value">{ticket.reportTime}</span>
              </div>
              <div className="match-meta-row">
                <span className="meta-label">Catatan:</span>
                <span className="meta-value">{ticket.locationDetail || ticket.priorityTag || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* AI Matching Candidate */}
          <div className="match-card-side storage-side">
            <div className="match-side-badge badge-green">KANDIDAT BARANG TEMUAN</div>
            <div className="ai-confidence-pill">94% Skor Kecocokan AI</div>
            <h4 className="match-item-name">Temuan Serupa di Storage HK</h4>
            <div className="match-meta-list">
              <div className="match-meta-row">
                <span className="meta-label">Lokasi Temu:</span>
                <span className="meta-value">Housekeeping Floor Storage (Lantai 5)</span>
              </div>
              <div className="match-meta-row">
                <span className="meta-label">Ditemukan Oleh:</span>
                <span className="meta-value">Siti Aminah (HK Shift Pagi)</span>
              </div>
              <div className="match-meta-row">
                <span className="meta-label">Status Fisik:</span>
                <span className="meta-value text-green-700 font-semibold">Tersimpan di Brankas FO</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions-bar">
          <button type="button" className="btn-cancel-modal" onClick={onClose}>
            Batal
          </button>
          <button
            type="button"
            className="btn-confirm-match-gold"
            onClick={() => onConfirmMatch(ticket.id)}
            disabled={isLoading}
          >
            {isLoading ? 'Memverifikasi...' : 'Konfirmasi Kecocokan & Verifikasi'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MatchVerificationModal;
