import React from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  DoorClosed, 
  Calendar, 
  CheckCircle2,
  Star,
  Gem,
  ChevronDown
} from 'lucide-react';

/**
 * View Component: GuestStayInfoCard
 * Card 1: Informasi Tamu & Riwayat Menginap
 */
export function GuestStayInfoCard({ formData, onChange, onLoyaltyChange }) {
  return (
    <div className="claim-card guest-stay-card">
      {/* Card Header */}
      <div className="claim-card-header">
        <div className="card-header-left">
          <div className="step-number-circle">1</div>
          <div className="card-header-titles">
            <h3 className="card-title-text">Informasi Tamu &amp; Riwayat Menginap</h3>
            <p className="card-subtitle-text">
              Validasi identitas profil tamu terdaftar pada sistem reservasi hotel.
            </p>
          </div>
        </div>
        <div className="reservation-sync-badge">
          <CheckCircle2 size={13} className="sync-icon-blue" />
          <span>Terhubung Data Reservasi</span>
        </div>
      </div>

      {/* Form Fields Grid */}
      <div className="claim-form-grid">
        {/* Row 1: Name, Phone, Email */}
        <div className="form-row-3col">
          {/* Guest Name */}
          <div className="claim-field-group">
            <label className="claim-field-label">
              Nama Lengkap Tamu <span className="text-red-500">*</span>
            </label>
            <div className="claim-input-box">
              <User size={16} className="claim-input-icon" />
              <input
                type="text"
                className="claim-input"
                value={formData.guestName}
                onChange={(e) => onChange('guestName', e.target.value)}
                placeholder="Nama Tamu Sesuai KTP"
                required
              />
            </div>
            <span className="field-hint-text">Sesuai KTP / Paspor saat check-in</span>
          </div>

          {/* Phone / WhatsApp */}
          <div className="claim-field-group">
            <div className="label-with-badge">
              <label className="claim-field-label">
                Nomor Telepon / WhatsApp <span className="text-red-500">*</span>
              </label>
              <span className="verified-guest-pill">
                ✓ Verified Guest
              </span>
            </div>
            <div className="claim-input-box">
              <Phone size={16} className="claim-input-icon" />
              <input
                type="tel"
                className="claim-input"
                value={formData.phoneNumber}
                onChange={(e) => onChange('phoneNumber', e.target.value)}
                placeholder="+62 ..."
                required
              />
            </div>
            <span className="field-hint-text green-hint">
              <span className="hint-bullet">📱</span> Siap dikirimi notifikasi WhatsApp otomatis
            </span>
          </div>

          {/* Email */}
          <div className="claim-field-group">
            <label className="claim-field-label">Email Tamu</label>
            <div className="claim-input-box">
              <Mail size={16} className="claim-input-icon" />
              <input
                type="email"
                className="claim-input"
                value={formData.email}
                onChange={(e) => onChange('email', e.target.value)}
                placeholder="email.tamu@example.com"
              />
            </div>
            <span className="field-hint-text">Untuk salinan resmi Berita Acara Klaim</span>
          </div>
        </div>

        {/* Row 2: Room Number, Checkout Date, Loyalty Tier */}
        <div className="form-row-3col">
          {/* Room Number */}
          <div className="claim-field-group">
            <label className="claim-field-label">
              Nomor Kamar Tamu <span className="text-red-500">*</span>
            </label>
            <div className="claim-input-box select-wrapper">
              <DoorClosed size={16} className="claim-input-icon" />
              <select
                className="claim-select"
                value={formData.roomNumber}
                onChange={(e) => onChange('roomNumber', e.target.value)}
              >
                <option value="Kamar 314 - Deluxe King (Lantai 3)">
                  Kamar 314 - Deluxe King (Lantai 3)
                </option>
                <option value="Kamar 502 - Deluxe Suite (Lantai 5)">
                  Kamar 502 - Deluxe Suite (Lantai 5)
                </option>
                <option value="Kamar 810 - Presidential (Lantai 8)">
                  Kamar 810 - Presidential (Lantai 8)
                </option>
                <option value="Kamar 204 - Standard Room (Lantai 2)">
                  Kamar 204 - Standard Room (Lantai 2)
                </option>
              </select>
              <ChevronDown size={14} className="select-chevron" />
            </div>
            <span className="field-hint-text">Kamar menginap terakhir terdaftar</span>
          </div>

          {/* Checkout Date */}
          <div className="claim-field-group">
            <label className="claim-field-label">
              Tanggal Check-out <span className="text-red-500">*</span>
            </label>
            <div className="claim-input-box">
              <Calendar size={16} className="claim-input-icon" />
              <input
                type="date"
                className="claim-input date-input"
                value={formData.checkoutDate}
                onChange={(e) => onChange('checkoutDate', e.target.value)}
                required
              />
            </div>
            <span className="field-hint-text">Riwayat keluar: 14 Maret 2024 (11:45 WIB)</span>
          </div>

          {/* Loyalty Tier */}
          <div className="claim-field-group">
            <label className="claim-field-label">Kategori Loyalitas Tamu</label>
            <div className="loyalty-pill-group">
              <button
                type="button"
                className={`loyalty-pill-btn ${formData.loyaltyTier === 'regular' ? 'active-regular' : ''}`}
                onClick={() => onLoyaltyChange('regular')}
              >
                Regular
              </button>
              <button
                type="button"
                className={`loyalty-pill-btn ${formData.loyaltyTier === 'gold' ? 'active-gold' : ''}`}
                onClick={() => onLoyaltyChange('gold')}
              >
                <Star size={11} className="fill-amber-900" />
                <span>Hotel Loyalty Gold</span>
              </button>
              <button
                type="button"
                className={`loyalty-pill-btn ${formData.loyaltyTier === 'diamond' ? 'active-diamond' : ''}`}
                onClick={() => onLoyaltyChange('diamond')}
              >
                <Gem size={11} />
                <span>VIP Diamond</span>
              </button>
            </div>
            <span className="field-hint-text">SLA penanganan prioritas: 60 menit</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestStayInfoCard;
