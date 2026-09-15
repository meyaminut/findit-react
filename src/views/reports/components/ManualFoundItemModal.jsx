import React, { useState } from 'react';
import { X, Package } from 'lucide-react';

/**
 * View Component: ManualFoundItemModal
 * Modal dialog for staff to record newly discovered lost items.
 */
export function ManualFoundItemModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    roomNumber: '',
    category: 'Elektronik',
    locationFound: '',
    storageLocation: 'Loker FO B-12',
    finderName: 'Siti Aminah (HK)'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.roomNumber.trim()) {
      alert('Mohon lengkapi nama barang dan nomor kamar.');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="found-modal-backdrop" onClick={onClose}>
      <div className="found-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="found-modal-header">
          <div className="modal-title-flex">
            <Package size={18} className="modal-title-icon" />
            <span className="modal-title-text">+ Input Temuan Manual Baru</span>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="found-modal-form">
          <div className="form-group-row">
            <label className="input-label">Nomor Kamar *</label>
            <input
              type="text"
              className="modal-text-input"
              placeholder="Contoh: 314"
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              required
            />
          </div>

          <div className="form-group-row">
            <label className="input-label">Kategori Barang *</label>
            <select
              className="modal-select-input"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Elektronik">Elektronik</option>
              <option value="Dompet / Tas">Dompet / Tas</option>
              <option value="Perhiasan & Jam">Perhiasan &amp; Jam</option>
              <option value="Pakaian">Pakaian</option>
              <option value="Dokumen">Dokumen / Paspor</option>
            </select>
          </div>

          <div className="form-group-row">
            <label className="input-label">Nama / Deskripsi Barang *</label>
            <input
              type="text"
              className="modal-text-input"
              placeholder="Contoh: Smartwatch Garmin Venu SQ Hitam"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group-row">
            <label className="input-label">Posisi Penemuan di Kamar *</label>
            <input
              type="text"
              className="modal-text-input"
              placeholder="Contoh: Meja nakas kanan samping tempat tidur"
              value={formData.locationFound}
              onChange={(e) => setFormData({ ...formData, locationFound: e.target.value })}
              required
            />
          </div>

          <div className="form-group-row">
            <label className="input-label">Lokasi Brankas Simpan *</label>
            <select
              className="modal-select-input"
              value={formData.storageLocation}
              onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
            >
              <option value="Loker FO B-12">Loker FO B-12</option>
              <option value="Loker FO A-04">Loker FO A-04</option>
              <option value="Brankas Utama FO">Brankas Utama FO</option>
              <option value="Lemari C-01">Lemari C-01</option>
            </select>
          </div>

          <div className="modal-actions-footer">
            <button type="button" className="btn-cancel-flat" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn-submit-amber">
              Simpan ke Master Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ManualFoundItemModal;
