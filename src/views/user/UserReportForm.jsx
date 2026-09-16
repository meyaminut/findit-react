import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Bell,
  Camera,
  Check,
  DoorClosed,
  Mail,
  MessageCircle,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import './UserReportForm.css';

const CATEGORIES = ['Elektronik', 'Perhiasan & Jam', 'Dompet / Tas', 'Pakaian', 'Dokumen', 'Lainnya'];

const LOCATION_PILLS = ['Di Meja Nakas', 'Di Lemari Pakaian', 'Di Kamar Mandi', 'Bawah Ranjang'];

const DEFAULT_ROOM = 'Kamar 314 (Deluxe King)';

/**
 * View Component: UserReportForm
 * Form "Laporkan Barang Tertinggal (Guest Report)" di User Portal.
 * Layout & elemen mengikuti spesifikasi desain (banner, detail barang,
 * kontak konfirmasi, submit) dengan state management sederhana.
 */
export default function UserReportForm() {
  const navigate = useNavigate();
  const [room] = useState(DEFAULT_ROOM);
  const [roomChanging, setRoomChanging] = useState(false);

  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(null);
  const [location, setLocation] = useState('');
  const [features, setFeatures] = useState('');

  const [photos, setPhotos] = useState([]);
  const fileInputRef = useRef(null);

  const [waNumber, setWaNumber] = useState('+62 812-3456-7890');
  const [email, setEmail] = useState('hendra.gunawan@example.com');
  const [waUpdates, setWaUpdates] = useState(true);

  const [touched, setTouched] = useState(false);

  const toggleCategory = (value) => {
    setCategory((prev) => (prev === value ? null : value));
  };

  const toggleLocationPill = (pill) => {
    const parts = location.split(',').map((part) => part.trim()).filter(Boolean);
    if (parts.includes(pill)) {
      setLocation(parts.filter((part) => part !== pill).join(', '));
    } else {
      setLocation([...parts, pill].join(', '));
    }
  };

  const handleFiles = (files) => {
    const imageList = Array.from(files).map((file) => URL.createObjectURL(file));
    setPhotos((prev) => [...prev, ...imageList]);
  };

  const removePhoto = (url) => {
    setPhotos((prev) => prev.filter((photo) => photo !== url));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!description.trim()) return;
    // TODO: hubungkan ke API / controller laporan guest sebelum redirect
    navigate('/user/confirmation');
  };

  return (
    <div className="guest-report-page">
      <div className="guest-report-frame">
        {/* Page Header */}
        <header className="gr-header">
          <div className="gr-header-inner">
            <span className="gr-header-pill">
              <span className="gr-header-dot" />
              HOUSEKEEPING & FRONT OFFICE
            </span>
            <h1 className="gr-title">Laporkan Barang Tertinggal</h1>
            <p className="gr-subtitle">Bantu kami menemukan barang Anda secepat mungkin.</p>
          </div>
        </header>

        <main className="gr-content">
          {/* Banner Top */}
          <section className="gr-banner">
            <span className="gr-banner-icon">
              <Bell size={22} />
            </span>
            <div className="gr-banner-body">
              <span className="gr-banner-badge">• Respon Cepat Housekeeping</span>
              <h2 className="gr-banner-title">Jangan khawatir, kami siap membantu!</h2>
              <p className="gr-banner-subtitle">
                Ceritakan sedikit tentang barang Anda. Tim Housekeeping &amp; Front Office Grand Melia
                akan segera melakukan pencarian langsung ke kamar Anda.
              </p>
            </div>
          </section>

          {/* Location Card */}
          <section className="gr-room-card">
            <span className="gr-room-icon">
              <DoorClosed size={20} />
            </span>
            <div className="gr-room-text">
              <span className="gr-room-label">LOKASI PENCARIAN</span>
              <span className="gr-room-value">{room}</span>
            </div>
            <button
              type="button"
              className="gr-change-btn"
              onClick={() => setRoomChanging((value) => !value)}
            >
              {roomChanging ? 'Dipakai' : 'Ganti Kamar'}
            </button>
          </section>

          <form className="gr-form" onSubmit={handleSubmit}>
            {/* ---------- SECTION 1: DETAIL BARANG ---------- */}
            <div className="gr-section">
              <span className="gr-section-head">
                <span className="gr-section-num">1</span>
                Detail Barang
              </span>

              {/* Upload Foto (paling atas) */}
              <div className="gr-field gr-field-upload">
                <span className="gr-label">Unggah Foto Barang (Jika Ada)</span>
                <div className="gr-upload-wrap">
                  <button
                    type="button"
                    className={`gr-upload-box ${photos.length ? 'has-photo' : ''}`}
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="gr-file-input"
                      onChange={(e) => {
                        handleFiles(e.target.files);
                        e.target.value = '';
                      }}
                    />
                    {photos.length === 0 ? (
                      <>
                        <span className="gr-upload-icon">
                          <Camera size={26} />
                        </span>
                        <span className="gr-upload-text">Ketuk untuk mengambil foto atau pilih galeri</span>
                        <span className="gr-upload-sub">Membantu petugas mengenali barang lebih cepat</span>
                      </>
                    ) : (
                      <div className="gr-upload-previews">
                        {photos.map((photo) => (
                          <div className="gr-photo-thumb" key={photo}>
                            <img src={photo} alt="Foto barang" />
                            <button
                              type="button"
                              className="gr-photo-remove"
                              onClick={(e) => {
                                e.stopPropagation();
                                removePhoto(photo);
                              }}
                              aria-label="Hapus foto"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="gr-add-photo"
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                          aria-label="Tambah foto"
                        >
                          <Camera size={20} />
                        </button>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Deskripsi Barang */}
              <div className="gr-field">
                <label className="gr-label" htmlFor="gr-description">
                  Barang apa yang tertinggal? <span className="gr-required">*</span>
                </label>
                <textarea
                  id="gr-description"
                  className={`gr-input gr-textarea ${touched && !description.trim() ? 'gr-input-error' : ''}`}
                  rows={2}
                  placeholder="Contoh: Jam tangan Garmin hitam, dompet kulit, charger MacBook..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {touched && !description.trim() && (
                  <span className="gr-error-text">Mohon isi barang yang tertinggal.</span>
                )}
              </div>

              {/* Kategori Cepat */}
              <div className="gr-field">
                <span className="gr-pill-label">Kategori Cepat:</span>
                <div className="gr-pills">
                  {CATEGORIES.map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`gr-pill ${category === value ? 'active' : ''}`}
                      onClick={() => toggleCategory(value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lokasi Perkiraan */}
              <div className="gr-field">
                <label className="gr-label" htmlFor="gr-location">
                  Di mana kira-kira barang diletakkan?
                </label>
                <input
                  id="gr-location"
                  type="text"
                  className="gr-input"
                  placeholder="Tuliskan letak perkiraan terakhir..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <div className="gr-location-pills">
                  {LOCATION_PILLS.map((pill) => {
                    const active = location
                      .split(',')
                      .map((part) => part.trim())
                      .filter(Boolean)
                      .includes(pill);
                    return (
                      <button
                        key={pill}
                        type="button"
                        className={`gr-location-pill ${active ? 'active' : ''}`}
                        onClick={() => toggleLocationPill(pill)}
                      >
                        {active ? <Check size={14} /> : <span className="gr-location-plus">+</span>}
                        {pill}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ciri Khusus */}
              <div className="gr-field">
                <label className="gr-label" htmlFor="gr-features">
                  Ciri Khusus / Warna / Merek
                </label>
                <textarea
                  id="gr-features"
                  className="gr-input gr-textarea"
                  rows={3}
                  placeholder="Misal warna, goresan, stiker, atau ciri yang membedakan agar kami cepat mencocokkan..."
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                />
              </div>
            </div>

            {/* ---------- SECTION 2: KONTAK KONFIRMASI ---------- */}
            <div className="gr-section">
              <span className="gr-section-head">
                <span className="gr-section-num">2</span>
                Kontak Konfirmasi
              </span>

              <div className="gr-contact-card">
                <div className="gr-contact-head">
                  <span className="gr-contact-icon">
                    <User size={18} />
                  </span>
                  <span className="gr-contact-title">Kontak Konfirmasi</span>
                </div>

                {/* WhatsApp */}
                <div className="gr-field">
                  <label className="gr-label" htmlFor="gr-wa">
                    Nomor WhatsApp aktif untuk kami hubungi
                  </label>
                  <div className="gr-input-wrap">
                    <span className="gr-input-icon">
                      <MessageCircle size={17} />
                    </span>
                    <input
                      id="gr-wa"
                      type="tel"
                      className="gr-input-inner"
                      value={waNumber}
                      onChange={(e) => setWaNumber(e.target.value)}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="gr-field">
                  <label className="gr-label" htmlFor="gr-email">
                    Email konfirmasi
                  </label>
                  <div className="gr-input-wrap">
                    <span className="gr-input-icon">
                      <Mail size={17} />
                    </span>
                    <input
                      id="gr-email"
                      type="email"
                      className="gr-input-inner"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Toggle WhatsApp Update */}
                <div className="gr-toggle-row">
                  <div className="gr-toggle-text">
                    <span className="gr-toggle-title">Update Instan via WhatsApp</span>
                    <span className="gr-toggle-sub">
                      Kirim kabar saat barang ditemukan oleh petugas (Direkomendasikan)
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={waUpdates}
                    className={`gr-switch ${waUpdates ? 'on' : ''}`}
                    onClick={() => setWaUpdates((value) => !value)}
                  >
                    <span className="gr-switch-thumb" />
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="gr-submit-btn">
              Kirim Laporan &amp; Mulai Pencarian
              <ArrowRight size={18} className="gr-submit-arrow" />
            </button>

            {/* Footer Info */}
            <p className="gr-footer-info">
              <ShieldCheck size={15} />
              Gratis &amp; langsung ditangani oleh Duty Manager Front Office.
            </p>
          </form>
        </main>
      </div>
    </div>
  );
}