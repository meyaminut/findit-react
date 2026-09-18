import { X, Trash2, AlertTriangle } from 'lucide-react';
import './ConfirmDialog.css';

/**
 * View Component: ConfirmDialog
 * Modal konfirmasi generik (pengganti window.confirm) yang konsisten dengan
 * desain sistem yang dipakai di seluruh app (backdrop blur, kartu putih,
 * header + body + footer aksi). Aksi destruktif pakai tombol merah.
 */
export function ConfirmDialog({
  title = 'Konfirmasi',
  message = '',
  confirmLabel = 'Hapus',
  danger = true,
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="confirm-dialog-backdrop" onClick={onCancel}>
      <div
        className="confirm-dialog-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-dialog-top">
          <div className="confirm-dialog-title-row">
            <span className={`confirm-dialog-icon ${danger ? 'is-danger' : 'is-warning'}`}>
              {danger ? <Trash2 size={18} /> : <AlertTriangle size={18} />}
            </span>
            <h3 id="confirm-dialog-title" className="confirm-dialog-title">
              {title}
            </h3>
          </div>
          <button
            type="button"
            className="confirm-dialog-close"
            onClick={onCancel}
            aria-label="Tutup"
          >
            <X size={16} />
          </button>
        </div>

        <div className="confirm-dialog-body">
          <p className="confirm-dialog-message">{message}</p>
        </div>

        <div className="confirm-dialog-actions">
          <button
            type="button"
            className="btn-confirm-neutral"
            onClick={onCancel}
            disabled={isLoading}
          >
            Batal
          </button>
          <button
            type="button"
            className="btn-confirm-danger-cta"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Memproses...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;