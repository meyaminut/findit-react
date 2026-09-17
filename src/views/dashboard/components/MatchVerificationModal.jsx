import React from 'react';
import { X, CheckCircle2, PackageSearch } from 'lucide-react';

/**
 * View Component: MatchVerificationModal
 * Modal triggered by clicking "Cocokkan" on any ticket row.
 * Candidate side is rendered from REAL matched data (ticket._candidate)
 * or from an honest empty state when no pairing exists yet.
 */
function foundPlaceholder(candidate) {
  return candidate.found_report_id
    ? `Barang Temuan #${candidate.found_report_id}`
    : '-';
}

const matchStatusLabel = (status) => {
  const lower = String(status || '').toLowerCase();
  if (lower === 'approved') return 'Terverifikasi';
  if (lower === 'rejected') return 'Ditolak';
  return 'Menunggu Verifikasi';
};

export function MatchVerificationModal({ ticket, onClose, onConfirmMatch, isLoading }) {
  if (!ticket) return null;

  const candidate = ticket._candidate;
  const hasCandidate = Boolean(candidate);

  const statusClass = candidate?.matchStatus === 'approved'
    ? 'match-status-approved'
    : 'match-status-pending';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()}>
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
                <span className="meta-value bold">
                  {ticket.guestName} {ticket.isVip ? '(VIP)' : ''}
                </span>
              </div>
              <div className="match-meta-row">
                <span className="meta-label">Kamar:</span>
                <span className="meta-value">{ticket.room || '-'}</span>
              </div>
              <div className="match-meta-row">
                <span className="meta-label">Waktu:</span>
                <span className="meta-value">{ticket.reportTime || '-'}</span>
              </div>
              <div className="match-meta-row">
                <span className="meta-label">Deskripsi:</span>
                <span className="meta-value">{ticket.description || '-'}</span>
              </div>
            </div>
          </div>

          {/* Paired Found Item (real data) or honest empty state */}
          <div className="match-card-side storage-side">
            {hasCandidate ? (
              <>
                <div className="match-side-badge badge-green">PASANGAN BARANG TEMUAN</div>
                <h4 className="match-item-name">{candidate.name}</h4>
                <div className="match-meta-list">
                  <div className="match-meta-row">
                    <span className="meta-label">Lokasi Temu:</span>
                    <span className="meta-value">{candidate.locationFound || '-'}</span>
                  </div>
                  <div className="match-meta-row">
                    <span className="meta-label">Ditemukan Oleh:</span>
                    <span className="meta-value">{candidate.finderName || foundPlaceholder(candidate)}</span>
                  </div>
                  <div className="match-meta-row">
                    <span className="meta-label">Waktu Temu:</span>
                    <span className="meta-value">{candidate.foundAt || '-'}</span>
                  </div>
                  <div className="match-meta-row">
                    <span className="meta-label">Status:</span>
                    <span className={`meta-value ${statusClass}`}>
                      {matchStatusLabel(candidate.matchStatus)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="match-empty-state">
                <PackageSearch size={30} className="match-empty-icon" />
                <p className="match-empty-title">Belum Ada Pasangan</p>
                <p className="match-empty-text">
                  Laporan ini belum dipasangkan dengan barang temuan. Buat pasangan manualnya di
                  halaman Match Review (menu "Verifikasi") terlebih dahulu.
                </p>
              </div>
            )}
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
            disabled={isLoading || !hasCandidate}
            title={
              !hasCandidate
                ? 'Belum ada pasangan. Buat pasangan di halaman Match Review (menu Verifikasi) terlebih dahulu.'
                : undefined
            }
          >
            {isLoading ? 'Memverifikasi...' : 'Konfirmasi Kecocokan & Verifikasi'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MatchVerificationModal;
