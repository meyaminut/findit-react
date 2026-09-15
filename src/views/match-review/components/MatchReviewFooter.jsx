import React from 'react';
import { AlertCircle, RotateCcw, Clock, CheckCircle2 } from 'lucide-react';

export function MatchReviewFooter({
  onRejectRelation,
  onPostpone,
  onMarkVerified,
  verifiedCount
}) {
  return (
    <footer className="review-bottom-action-bar">
      <div className="bottom-bar-left-hint">
        <AlertCircle size={17} className="bottom-hint-icon" />
        <p className="bottom-hint-text">
          Pastikan minimal 3 poin verifikasi rahasia telah terkonfirmasi secara presisi sebelum menandai barang sebagai terverifikasi.
        </p>
      </div>

      <div className="bottom-bar-buttons-group">
        <button 
          type="button" 
          className="action-btn btn-reject-relation"
          onClick={onRejectRelation}
        >
          <RotateCcw size={15} />
          <span>Tidak Cocok / Lepas Relasi</span>
        </button>

        <button 
          type="button" 
          className="action-btn btn-postpone"
          onClick={onPostpone}
        >
          <Clock size={15} />
          <span>Tunda • Minta Bukti Tambahan</span>
        </button>

        <button 
          type="button" 
          className="action-btn btn-confirm-verified"
          onClick={onMarkVerified}
        >
          <CheckCircle2 size={16} />
          <span>Tandai Terverifikasi (Siap Handover)</span>
        </button>
      </div>
    </footer>
  );
}

export default MatchReviewFooter;
