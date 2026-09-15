import React from 'react';
import { Check } from 'lucide-react';

export function HandoverChecklistSection({
  checklists,
  guest,
  item,
  isReadyForResolution,
  checkedCount,
  onToggleChecklist
}) {
  return (
    <section className="handover-col-card">
      <div className="col-card-header">
        <div className="step-badge-title">
          <span className="step-circle-number">1</span>
          <h2 className="step-title-text">Checklist Verifikasi Identitas</h2>
        </div>
        <div className={`checklist-counter-pill ${isReadyForResolution ? 'complete' : ''}`}>
          <Check size={13} />
          <span>{checkedCount} / 3 Lengkap</span>
        </div>
      </div>

      {/* Checklist items list */}
      <div className="verification-checklist-list">
        {/* Item 1: Identitas Resmi */}
        <div 
          className={`checklist-item-row ${checklists.physicalIdVerified ? 'checked' : ''}`}
          onClick={() => onToggleChecklist('physicalIdVerified')}
        >
          <div className="checkbox-custom-box">
            {checklists.physicalIdVerified && <Check size={14} />}
          </div>
          <div className="checklist-item-body">
            <h3 className="item-title">Identitas resmi tamu telah diverifikasi fisik</h3>
            <p className="item-desc">
              Menunjukkan KTP / SIM / Paspor asli yang masih aktif dan sah.
            </p>
            <div className="id-chip-tag">
              <span className="id-card-icon">🪪</span>
              <span>KTP: {guest.idCard} ({guest.name})</span>
            </div>
          </div>
        </div>

        {/* Item 2: Pencocokan Biometrik */}
        <div 
          className={`checklist-item-row ${checklists.biometricRoomMatched ? 'checked' : ''}`}
          onClick={() => onToggleChecklist('biometricRoomMatched')}
        >
          <div className="checkbox-custom-box">
            {checklists.biometricRoomMatched && <Check size={14} />}
          </div>
          <div className="checklist-item-body">
            <h3 className="item-title">Pencocokan biometrik &amp; data kamar reservasi</h3>
            <p className="item-desc">
              Wajah tamu cocok dengan pasfoto identitas dan data folio registrasi reservasi hotel (Kamar {guest.room}).
            </p>
            <span className="verified-sign-text">
              ✓ Terverifikasi oleh FO Supervisor
            </span>
          </div>
        </div>

        {/* Item 3: Pemeriksaan Fisik Barang */}
        <div 
          className={`checklist-item-row ${checklists.itemInspectedByGuest ? 'checked' : ''}`}
          onClick={() => onToggleChecklist('itemInspectedByGuest')}
        >
          <div className="checkbox-custom-box">
            {checklists.itemInspectedByGuest && <Check size={14} />}
          </div>
          <div className="checklist-item-body">
            <h3 className="item-title">Pemeriksaan fisik barang oleh tamu langsung</h3>
            <p className="item-desc">
              Tamu menyalakan barang, memeriksa bodi fisik, dan mengonfirmasi kondisi prima tanpa keluhan.
            </p>
            <span className="verified-sign-text">
              ✓ Kondisi Diterima: Baik &amp; Berfungsi
            </span>
          </div>
        </div>
      </div>

      {/* Item Specification Mini Card */}
      <div className="item-spec-mini-card">
        <img 
          src={item.image} 
          alt={item.edition} 
          className="spec-thumb-img"
        />
        <div className="spec-thumb-info">
          <span className="spec-eyebrow">SPESIFIKASI BARANG</span>
          <h4 className="spec-model-title">{item.edition}</h4>
          <span className="spec-origin-meta">
            Ditemukan di {item.location} oleh {item.finder}
          </span>
        </div>
      </div>
    </section>
  );
}

export default HandoverChecklistSection;
