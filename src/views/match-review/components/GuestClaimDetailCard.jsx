import React from 'react';
import { 
  Lock, 
  CheckCircle2, 
  Watch, 
  MapPin, 
  Key, 
  Check, 
  Phone, 
  Mail 
} from 'lucide-react';

export function GuestClaimDetailCard({ 
  ticket, 
  verifiedPoints, 
  onVerifyToggle 
}) {
  const verifiedCount = Object.values(verifiedPoints).filter(Boolean).length;

  return (
    <section className="comparison-card guest-claim-column">
      <div className="card-header-row">
        <div className="header-icon-title">
          <div className="shield-icon-wrap">
            <Lock size={16} />
          </div>
          <div>
            <h3 className="card-title">Detail Klaim Tamu</h3>
            <span className="card-subtitle">Data Pengakuan Tamu (Tersandi)</span>
          </div>
        </div>
        <span className="confidential-pill">Confidential</span>
      </div>

      {/* Status Points Bar */}
      <div className="verified-points-summary-box">
        <div className="points-left">
          <CheckCircle2 size={16} className="points-check-icon" />
          <span className="points-label">Titik Cocok Terkonfirmasi:</span>
        </div>
        <span className="points-count-badge">{verifiedCount} / 5 Unsur Kunci</span>
      </div>

      {/* Verified Field Attributes */}
      <div className="claim-attributes-list">
        <div className="claim-attribute-item">
          <div className="attr-meta">
            <span className="attr-label">KATEGORI DIKLAIM</span>
            <span className="attr-value">
              <Watch size={15} className="attr-inline-icon" />
              {ticket?.category || 'Elektronik • Smartwatch'}
            </span>
          </div>
          <div 
            className={`attr-status-badge ${verifiedPoints.category ? 'verified' : ''}`}
            onClick={() => onVerifyToggle('category')}
            title="Klik untuk ubah verifikasi"
          >
            <Check size={14} />
          </div>
        </div>

        <div className="claim-attribute-item">
          <div className="attr-meta">
            <span className="attr-label">MEREK &amp; MODEL</span>
            <span className="attr-value">{ticket?.itemName || ticket?.brand || 'Garmin Venu SQ (Tali Karet Hitam)'}</span>
          </div>
          <div 
            className={`attr-status-badge ${verifiedPoints.model ? 'verified' : ''}`}
            onClick={() => onVerifyToggle('model')}
            title="Klik untuk ubah verifikasi"
          >
            <Check size={14} />
          </div>
        </div>

        <div className="claim-attribute-item">
          <div className="attr-meta">
            <span className="attr-label">WARNA DOMINAN</span>
            <span className="attr-value">
              <span className="color-swatch-dot black"></span>
              {ticket?.color || 'Hitam Matte'}
            </span>
          </div>
          <div 
            className={`attr-status-badge ${verifiedPoints.color ? 'verified' : ''}`}
            onClick={() => onVerifyToggle('color')}
            title="Klik untuk ubah verifikasi"
          >
            <Check size={14} />
          </div>
        </div>

        <div className="claim-attribute-item">
          <div className="attr-meta">
            <span className="attr-label">LOKASI DUGAAN TAMU</span>
            <span className="attr-value">
              <MapPin size={15} className="attr-inline-icon" />
              {ticket?.locationLost || 'Meja Nakas Kanan Kamar 314'}
            </span>
          </div>
          <div 
            className={`attr-status-badge ${verifiedPoints.location ? 'verified' : ''}`}
            onClick={() => onVerifyToggle('location')}
            title="Klik untuk ubah verifikasi"
          >
            <Check size={14} />
          </div>
        </div>
      </div>

      {/* Confidential Secret Verification Card */}
      <div className="secret-verification-card">
        <div className="secret-card-top">
          <div className="secret-badge-left">
            <Key size={14} className="secret-key-icon" />
            <span className="secret-card-title">CIRI KHAS KHUSUS (KUNCI RAHASIA)</span>
          </div>
          <span className="secret-level-pill">Ciri Khusus Terlindungi</span>
        </div>
        <p className="secret-quote-text">
          &ldquo;{ticket?.secretDetail || 'Ada goresan halus sudut kiri atas, wallpaper foto anjing golden retriever.'}&rdquo;
        </p>
        <div className="secret-match-feedback">
          <span>Cocok dengan temuan fisik di brankas FO</span>
          <Check size={13} className="secret-check-green" />
        </div>
      </div>

      {/* Guest Reporter Contact Info */}
      <div className="reporter-contact-block">
        <span className="reporter-header-tag">KONTAK PELAPOR</span>
        <div className="reporter-details">
          <div className="reporter-contact-row">
            <Phone size={13} />
            <span>{ticket?.phone || '+62 812-3456-7890'}</span>
          </div>
          <div className="reporter-contact-row">
            <Mail size={13} />
            <span>{ticket?.email || 'hendra.gunawan@email.com'}</span>
          </div>
          <div className="reporter-log-meta">
            <span>Dilaporkan: {ticket?.reportedAt || 'Hari ini, 11:45 WIB'}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GuestClaimDetailCard;
