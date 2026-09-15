import React from 'react';
import { FileSignature, Truck, FileText, Eye, Check } from 'lucide-react';

export function HandoverProofSection({
  document,
  pickupMethod,
  additionalNotes,
  onPickupMethodChange,
  onNotesChange,
  onPreviewModalOpen
}) {
  return (
    <section className="handover-col-card">
      <div className="col-card-header">
        <div className="step-badge-title">
          <span className="step-circle-number">2</span>
          <h2 className="step-title-text">Bukti Tanda Terima &amp; Dokumentasi</h2>
        </div>
        <span className="timestamp-badge-small">{document.uploadedAt}</span>
      </div>

      {/* Method Selection */}
      <div className="pickup-method-section">
        <span className="section-micro-label">METODE PENGAMBILAN</span>
        <div className="method-pills-row">
          {/* Option 1: Diambil Langsung */}
          <div 
            className={`method-option-card ${pickupMethod === 'direct' ? 'selected' : ''}`}
            onClick={() => onPickupMethodChange('direct')}
          >
            <div className="method-card-top">
              <FileSignature size={16} className="method-icon" />
              <div className="method-radio-dot">
                {pickupMethod === 'direct' && <span className="dot-inner"></span>}
              </div>
            </div>
            <div className="method-text-col">
              <span className="method-name">Diambil Langsung</span>
              <span className="method-sub">Front Desk</span>
            </div>
          </div>

          {/* Option 2: Kurir Ekspedisi */}
          <div 
            className={`method-option-card ${pickupMethod === 'courier' ? 'selected' : ''}`}
            onClick={() => onPickupMethodChange('courier')}
          >
            <div className="method-card-top">
              <Truck size={16} className="method-icon" />
              <div className="method-radio-dot">
                {pickupMethod === 'courier' && <span className="dot-inner"></span>}
              </div>
            </div>
            <div className="method-text-col">
              <span className="method-name">Kurir Ekspedisi</span>
              <span className="method-sub">JNE / Paxel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Receipt Document Box */}
      <div className="receipt-document-card">
        <div className="doc-icon-wrap">
          <FileText size={20} className="doc-icon" />
        </div>
        <div className="doc-meta-info">
          <span className="doc-filename">{document.title}</span>
          <div className="doc-sub-details">
            <span className="doc-filesize">{document.fileSize}</span>
            <span className="dot-sep">•</span>
            <span className="doc-badge-green">
              <Check size={11} /> TTD Digital Terverifikasi
            </span>
          </div>
        </div>
        <button 
          type="button" 
          className="btn-view-doc"
          onClick={onPreviewModalOpen}
        >
          <Eye size={14} />
          <span>Lihat Dokumen</span>
        </button>
      </div>

      {/* Handover Additional Notes */}
      <div className="handover-notes-section">
        <label className="notes-field-label">
          Catatan Serah Terima Petugas FO
        </label>
        <textarea
          rows={3}
          className="handover-textarea"
          value={additionalNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Tuliskan catatan tambahan mengenai serah terima barang atau konfirmasi tamu..."
        />
        <span className="notes-help-text">
          Tercatat otomatis pada Audit Log sistem Lost &amp; Found hotel.
        </span>
      </div>
    </section>
  );
}

export default HandoverProofSection;
