import { X, MessageCircle, Send } from 'lucide-react';

/**
 * View Component: WhatsAppPreviewModal
 * Modal pratinjau notifikasi WhatsApp (semi-otomatis via deep link wa.me).
 * Ditampilkan setelah admin memverifikasi match atau menandai barang diserahkan.
 * Teks pesan bisa diedit sebelum admin membuka WhatsApp.
 */
export function WhatsAppPreviewModal({ preview, isLoading, onClose, onMessageChange, onSend }) {
  if (!preview) return null;

  const { eventLabel, guestName, phone, itemTitle, room, message } = preview;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top-bar">
          <div className="modal-title-wrap">
            <MessageCircle size={20} className="wa-title-icon" />
            <h3 className="modal-heading">Pratinjau Notifikasi WhatsApp</h3>
          </div>
          <button type="button" className="modal-close-icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="wa-preview-content">
          <div className="wa-preview-recipient">
            <span className="wa-preview-event-badge">{eventLabel}</span>
            <div className="wa-preview-recipient-name">{guestName}</div>
            <div className="wa-preview-recipient-phone">+{phone}</div>
          </div>

          <div className="wa-preview-meta-grid">
            <div className="wa-preview-row">
              <span className="wa-preview-label">Barang</span>
              <span className="wa-preview-value">{itemTitle || '-'}</span>
            </div>
            <div className="wa-preview-row">
              <span className="wa-preview-label">Kamar</span>
              <span className="wa-preview-value">{room || '-'}</span>
            </div>
          </div>

          <label className="wa-preview-textarea-label" htmlFor="wa-preview-textarea">
            Isi Pesan (bisa diedit)
          </label>
          <textarea
            id="wa-preview-textarea"
            className="wa-preview-textarea"
            rows={6}
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
          />
          <p className="wa-preview-hint">
            Pesan akan dibuka di aplikasi WhatsApp. Admin tetap menekan tombol kirim di WhatsApp.
          </p>
        </div>

        <div className="modal-actions-bar">
          <button type="button" className="btn-cancel-modal" onClick={onClose}>
            Batal
          </button>
          <button
            type="button"
            className="btn-send-wa"
            onClick={onSend}
            disabled={isLoading || !message.trim()}
          >
            <Send size={15} />
            Buka WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

export default WhatsAppPreviewModal;
