import React, { useState } from 'react';
import { X, PlusCircle, User, MapPin, Tag, FileText } from 'lucide-react';

/**
 * View Component: QuickReportModal
 * Modal for quickly registering a new Lost or Found incident from Front Office desk.
 */
export function QuickReportModal({ isOpen, onClose, onSave, isLoading }) {
  const [guestName, setGuestName] = useState('');
  const [room, setRoom] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('electronics');
  const [location, setLocation] = useState('');
  const [isVip, setIsVip] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      guestName,
      room,
      title,
      category,
      location,
      isVip
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top-bar">
          <div className="modal-title-wrap">
            <PlusCircle size={20} className="text-blue-600" />
            <h3 className="modal-heading">Buat Laporan Cepat FO</h3>
          </div>
          <button type="button" className="modal-close-icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form-content">
          <div className="modal-grid-2col">
            <div className="form-field-group">
              <label className="field-label">Nama Tamu</label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  className="modal-text-input"
                  placeholder="Contoh: Ny. Sarah Jenkins"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-field-group">
              <label className="field-label">Nomor Kamar</label>
              <div className="input-with-icon">
                <MapPin size={16} className="input-icon" />
                <input
                  type="text"
                  className="modal-text-input"
                  placeholder="Contoh: Kamar 502 (Deluxe)"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-field-group">
            <label className="field-label">Nama / Deskripsi Barang</label>
            <div className="input-with-icon">
              <Tag size={16} className="input-icon" />
              <input
                type="text"
                className="modal-text-input"
                placeholder="Contoh: Dompet Kulit Braun Büffel Coklat"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-grid-2col">
            <div className="form-field-group">
              <label className="field-label">Kategori</label>
              <select
                className="modal-select-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="electronics">Elektronik &amp; Gadget</option>
                <option value="clothing">Pakaian &amp; Aksesori</option>
                <option value="documents">Dokumen / Kartu ID</option>
                <option value="others">Lain-lain / Perlengkapan</option>
              </select>
            </div>

            <div className="form-field-group">
              <label className="field-label">Lokasi Terakhir / Ditemukan</label>
              <div className="input-with-icon">
                <FileText size={16} className="input-icon" />
                <input
                  type="text"
                  className="modal-text-input"
                  placeholder="Contoh: Meja Rias / Resto"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="vip-toggle-row">
            <label className="vip-checkbox-label">
              <input
                type="checkbox"
                checked={isVip}
                onChange={(e) => setIsVip(e.target.checked)}
                className="vip-checkbox"
              />
              <span>Tamu Prioritas VIP</span>
            </label>
          </div>

          <div className="modal-actions-bar">
            <button type="button" className="btn-cancel-modal" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn-save-modal" disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : 'Simpan Laporan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuickReportModal;
