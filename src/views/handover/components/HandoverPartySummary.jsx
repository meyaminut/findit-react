import React from 'react';
import { User, Watch, Lock, KeyRound, ShieldCheck } from 'lucide-react';

export function HandoverPartySummary({ guest, item, vault, officer }) {
  return (
    <div className="handover-summary-grid">
      {/* Card 1: Tamu Penerima */}
      <div className="summary-info-card">
        <div className="card-indicator-stripe blue" />
        <div className="summary-icon-box">
          <User size={18} />
        </div>
        <div className="summary-text-box">
          <span className="summary-label">TAMU PENERIMA</span>
          <span className="summary-val-primary">{guest.name}</span>
          <div className="summary-sub-chips">
            <span className="room-badge">Kamar {guest.room}</span>
            <span className="room-type-text">{guest.roomType}</span>
          </div>
        </div>
      </div>

      {/* Card 2: Barang Temuan */}
      <div className="summary-info-card">
        <div className="summary-icon-box">
          <Watch size={18} />
        </div>
        <div className="summary-text-box">
          <span className="summary-label">BARANG TEMUAN</span>
          <span className="summary-val-primary">{item.name}</span>
          <span className="summary-serial-text">S/N: {item.serialNumber}</span>
        </div>
      </div>

      {/* Card 3: Lokasi Brankas FO */}
      <div className="summary-info-card">
        <div className="summary-icon-box">
          <Lock size={18} />
        </div>
        <div className="summary-text-box">
          <span className="summary-label">LOKASI BRANKAS FO</span>
          <span className="summary-val-primary">{vault.lockerId} ({vault.name})</span>
          <div className="summary-key-row">
            <KeyRound size={12} className="key-icon-amber" />
            <span className="key-tag-text">{vault.keyTag}</span>
          </div>
        </div>
      </div>

      {/* Card 4: Petugas Penyerah */}
      <div className="summary-info-card">
        <div className="summary-icon-box">
          <ShieldCheck size={18} />
        </div>
        <div className="summary-text-box">
          <span className="summary-label">PETUGAS PENYERAH</span>
          <span className="summary-val-primary">{officer.name}</span>
          <span className="summary-role-text">{officer.role}</span>
        </div>
      </div>
    </div>
  );
}

export default HandoverPartySummary;
