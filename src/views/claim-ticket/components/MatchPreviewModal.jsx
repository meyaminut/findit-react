import React from 'react';
import { X, Sparkles, CheckCircle2, ShieldCheck, MapPin, Clock } from 'lucide-react';

/**
 * View Component: MatchPreviewModal
 * Modal displaying the side-by-side comparison between the new claim and the candidate in storage.
 */
export function MatchPreviewModal({ isOpen, onClose, formData, candidate }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog-box modal-match-preview" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top-bar">
          <div className="modal-title-wrap">
            <Sparkles size={20} className="text-emerald-600" />
            <h3 className="modal-heading">Pratinjau Kecocokan AI (Auto-Correlation)</h3>
          </div>
          <button type="button" className="modal-close-icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="match-preview-cards-grid">
          {/* Left: Guest Claim */}
          <div className="preview-card-box guest-card">
            <span className="card-type-tag">KLAIM TAMU (FORM SAAT INI)</span>
            <h4 className="preview-item-title">{formData.brandAndModel}</h4>
            <div className="preview-meta-list">
              <div className="preview-meta-row">
                <span className="p-label">Tamu:</span>
                <span className="p-val bold">{formData.guestName}</span>
              </div>
              <div className="preview-meta-row">
                <span className="p-label">Kamar:</span>
                <span className="p-val">{formData.roomNumber}</span>
              </div>
              <div className="preview-meta-row">
                <span className="p-label">Ciri Fisik:</span>
                <span className="p-val">{formData.colorAndFeatures}</span>
              </div>
              <div className="preview-meta-row">
                <span className="p-label">Bukti Utama:</span>
                <span className="p-val text-amber-900 bg-amber-50 p-1 rounded font-mono text-xs">
                  {formData.secretProof}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Storage Item Found */}
          <div className="preview-card-box storage-card">
            <div className="flex-between-row">
              <span className="card-type-tag text-emerald-700">BARANG TEMUAN DI GUDANG</span>
              <span className="confidence-score-badge">96% Skor Kecocokan</span>
            </div>
            <h4 className="preview-item-title">{candidate.itemTitle}</h4>
            <div className="preview-meta-list">
              <div className="preview-meta-row">
                <span className="p-label">Lokasi Simpan:</span>
                <span className="p-val bold">{candidate.storageLocker}</span>
              </div>
              <div className="preview-meta-row">
                <span className="p-label">Waktu Temu:</span>
                <span className="p-val">Hari ini, {candidate.discoveredAt}</span>
              </div>
              <div className="preview-meta-row">
                <span className="p-label">Ditemukan Oleh:</span>
                <span className="p-val">{candidate.reportedBy}</span>
              </div>
              <div className="preview-meta-row">
                <span className="p-label">Verifikasi:</span>
                <span className="p-val text-emerald-700 font-semibold">
                  Tersedia untuk dicocokkan langsung saat tiket dibuat
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions-bar">
          <button type="button" className="btn-cancel-modal" onClick={onClose}>
            Tutup
          </button>
          <button type="button" className="btn-save-modal" onClick={onClose}>
            Terapkan Relasi Tiket
          </button>
        </div>
      </div>
    </div>
  );
}

export default MatchPreviewModal;
