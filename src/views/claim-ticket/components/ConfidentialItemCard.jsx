import React from 'react';
import { 
  Lock, 
  ShieldAlert, 
  AlertTriangle, 
  Laptop, 
  Wallet, 
  Watch, 
  Shirt, 
  FileText, 
  Tag, 
  Palette, 
  MapPin, 
  KeyRound, 
  ShieldCheck 
} from 'lucide-react';

/**
 * View Component: ConfidentialItemCard
 * Card 2: Detail Rahasia Barang (Untuk Verifikasi Otentikasi)
 */
export function ConfidentialItemCard({
  formData,
  categories,
  quickLocations,
  onChange,
  onCategoryChange,
  onQuickLocationSelect
}) {
  const getCategoryIcon = (icon) => {
    switch (icon) {
      case 'laptop': return <Laptop size={14} />;
      case 'wallet': return <Wallet size={14} />;
      case 'watch': return <Watch size={14} />;
      case 'shirt': return <Shirt size={14} />;
      case 'fileText': return <FileText size={14} />;
      default: return <Tag size={14} />;
    }
  };

  return (
    <div className="claim-card confidential-item-card">
      {/* Card Header with Protocol Badges */}
      <div className="claim-card-header">
        <div className="card-header-left">
          <div className="lock-icon-circle">
            <Lock size={18} />
          </div>
          <div className="card-header-titles">
            <div className="protocol-tags-row">
              <span className="strictly-confidential-pill">
                STRICTLY CONFIDENTIAL
              </span>
              <span className="security-protocol-tag">
                Security Verification Protocol
              </span>
            </div>
            <h3 className="card-title-text text-dark">
              Detail Rahasia Barang (Untuk Verifikasi Otentikasi — JANGAN DIBERITAHUKAN KE TAMU!)
            </h3>
            <p className="card-subtitle-text">
              Catatan internal ini menjadi kunci penentu saat staf gudang mencocokkan barang fisik dengan klaim tamu.
            </p>
          </div>
        </div>

        <div className="anti-fraud-badge">
          <ShieldCheck size={14} className="text-emerald-700" />
          <span>Anti-Fraud Protection</span>
        </div>
      </div>

      {/* Procedural Mandatory Warning Box (Yellow/Amber) */}
      <div className="procedural-warning-callout">
        <div className="warning-heading-row">
          <AlertTriangle size={15} className="warning-triangle-icon" />
          <strong className="warning-strong-title">PEMBERITAHUAN PROSEDUR WAJIB:</strong>
        </div>
        <p className="warning-desc-text">
          Catat informasi spesifik yang hanya diketahui oleh pemilik asli barang untuk mencegah klaim palsu saat proses pencocokan. Ajukan pertanyaan terbuka kepada tamu, jangan memberi contekan visual!
        </p>
      </div>

      {/* Category Selection Tabs */}
      <div className="category-selection-section">
        <div className="category-label-row">
          <label className="claim-field-label">
            Kategori Barang <span className="text-red-500">*</span>
          </label>
          <span className="category-side-hint">Pilih jenis kompartemen penyimpanan</span>
        </div>

        <div className="category-tab-buttons-row">
          {categories.map((cat) => {
            const isActive = formData.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`category-tab-btn ${isActive ? 'active-cat-blue' : ''}`}
                onClick={() => onCategoryChange(cat.id)}
              >
                <span className="cat-btn-icon">{getCategoryIcon(cat.icon)}</span>
                <span className="cat-btn-label">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Fields */}
      <div className="claim-form-grid">
        {/* Row 1: Brand/Model & Features */}
        <div className="form-row-2col">
          {/* Brand & Model */}
          <div className="claim-field-group">
            <label className="claim-field-label">
              Merek &amp; Tipe Spesifik <span className="text-red-500">*</span>
            </label>
            <div className="claim-input-box">
              <Tag size={16} className="claim-input-icon" />
              <input
                type="text"
                className="claim-input"
                value={formData.brandAndModel}
                onChange={(e) => onChange('brandAndModel', e.target.value)}
                placeholder="Contoh: Garmin Venu SQ Music"
                required
              />
            </div>
            <span className="field-hint-text">
              Tanyakan nama brand, tipe generasi, dan varian memori/ukuran
            </span>
          </div>

          {/* Color & Physical Features */}
          <div className="claim-field-group">
            <label className="claim-field-label">
              Warna &amp; Ciri Khas Fisik <span className="text-red-500">*</span>
            </label>
            <div className="claim-input-box">
              <Palette size={16} className="claim-input-icon" />
              <input
                type="text"
                className="claim-input"
                value={formData.colorAndFeatures}
                onChange={(e) => onChange('colorAndFeatures', e.target.value)}
                placeholder="Contoh: Tali karet hitam dove, goresan bezel..."
                required
              />
            </div>
            <span className="field-hint-text">
              Cacat fisik, stiker khusus, lecet, atau modifikasi unik
            </span>
          </div>
        </div>

        {/* Row 2: Specific Lost Location with Quick Chips */}
        <div className="form-row-full">
          <div className="claim-field-group">
            <div className="label-with-hint">
              <label className="claim-field-label">
                Lokasi Spesifik Ditinggalkan / Hilang <span className="text-red-500">*</span>
              </label>
              <span className="room-attendant-hint">Poin investigasi Room Attendant</span>
            </div>
            <div className="claim-input-box">
              <MapPin size={16} className="claim-input-icon" />
              <input
                type="text"
                className="claim-input"
                value={formData.lostLocation}
                onChange={(e) => onChange('lostLocation', e.target.value)}
                placeholder="Contoh: Di atas meja nakas sebelah kanan ranjang tidur, dekat colokan charger"
                required
              />
            </div>

            {/* Quick Select Location Chips */}
            <div className="quick-select-chips-row">
              <span className="quick-select-label">Quick Select:</span>
              {quickLocations.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  className="quick-chip-btn"
                  onClick={() => onQuickLocationSelect(loc)}
                >
                  + {loc}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Secret Proof / SN / Password / Wallpaper */}
        <div className="form-row-full">
          <div className="claim-field-group">
            <div className="label-with-hint">
              <label className="claim-field-label">
                Isi / Nomor Seri / Password / Wallpaper (Bukti Utama Kepemilikan) <span className="text-red-500">*</span>
              </label>
              <span className="extreme-secret-badge">
                🔒 Rahasia Ekstrem
              </span>
            </div>
            <div className="claim-textarea-box">
              <div className="textarea-icon-bar">
                <KeyRound size={16} className="claim-input-icon" />
              </div>
              <textarea
                className="claim-textarea"
                rows={2}
                value={formData.secretProof}
                onChange={(e) => onChange('secretProof', e.target.value)}
                placeholder="Contoh: Wallpaper layar foto anjing golden retriever, serial SN: GR-8921-X..."
                required
              />
            </div>
            <div className="textarea-footer-hints">
              <span className="field-hint-text">
                Tamu wajib dapat memvalidasi data ini sebelum barang diserahkan.
              </span>
              <span className="char-count-text">
                Karakter tercatat: {formData.secretProof.length}/250
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfidentialItemCard;
