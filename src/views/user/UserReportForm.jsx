import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Camera,
  Check,
  ImagePlus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import './UserReportForm.css';

const CATEGORIES = ['Elektronik', 'Perhiasan & Jam', 'Dompet / Tas', 'Pakaian', 'Dokumen', 'Lainnya'];

const LOCATION_PILLS = ['Di Meja Nakas', 'Di Lemari Pakaian', 'Di Kamar Mandi', 'Bawah Ranjang'];

/**
 * View Component: UserReportForm
 * Form "Laporkan Barang Tertinggal (Guest Report)" di User Portal.
 * Layout & elemen mengikuti spesifikasi desain (banner, detail barang,
 * kontak konfirmasi, submit) dengan state management sederhana.
 */
export default function UserReportForm() {
  const navigate = useNavigate();
  const [roomNumber, setRoomNumber] = useState('');

  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(null);
  const [location, setLocation] = useState('');
  const [features, setFeatures] = useState('');

  const [photos, setPhotos] = useState([]);
  const inputCameraRef = useRef(null);
  const inputGalleryRef = useRef(null);

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

  const handleCameraFiles = (files) => {
    const imageList = Array.from(files).map((file) => URL.createObjectURL(file));
    setPhotos(imageList);
  };

  const removePhoto = (url) => {
    setPhotos((prev) => prev.filter((photo) => photo !== url));
  };

  const getContactData = () => {
    try {
      const userData = JSON.parse(window.localStorage.getItem('findit-registered-user')) || {};
      return {
        email: userData.email || '',
        whatsapp: userData.phone || '',
      };
    } catch {
      return { email: '', whatsapp: '' };
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!roomNumber.trim() || !description.trim()) return;

    const reportData = {
      roomNumber: roomNumber.trim(),
      description: description.trim(),
      category,
      location,
      features,
      photos,
      contact: getContactData(),
    };

    // TODO: hubungkan ke API / controller laporan guest sebelum redirect
    navigate('/user/confirmation', { state: { report: reportData } });
  };

  return (
    <div className="guest-report-page">
      <div className="guest-report-frame">
        {/* Page Header */}
        <header className="gr-header">
          <button type="button" className="back-btn" onClick={() => navigate('/user/survey')} aria-label="Back">
            <ArrowLeft size={20} />
          </button>
          <div className="gr-header-inner">
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
          {/* (dihapus: lokasi pindah ke input "Nomor Kamar" di dalam form) */}

          <form className="gr-form" onSubmit={handleSubmit}>
            {/* ---------- SECTION 1: DETAIL BARANG ---------- */}
            <div className="gr-section">
              <span className="gr-section-head">
                Detail Barang Tertinggal
              </span>

              {/* Nomor Kamar (wajib) */}
              <div className="gr-field">
                <label className="gr-label" htmlFor="gr-room-number">
                  Nomor Kamar <span className="gr-required">*</span>
                </label>
                <input
                  id="gr-room-number"
                  type="text"
                  inputMode="numeric"
                  className={`gr-input ${touched && !roomNumber.trim() ? 'gr-input-error' : ''}`}
                  placeholder="Contoh: 314, 502, atau Area Lobby"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  required
                />
                {touched && !roomNumber.trim() && (
                  <span className="gr-error-text">Mohon isi nomor kamar Anda.</span>
                )}
              </div>

              {/* Upload Foto */}
              <div className="gr-field gr-field-upload">
                <span className="gr-label">Unggah Foto Barang (Jika Ada)</span>

                {/* Hidden inputs: kamera & galeri */}
                <input
                  ref={inputCameraRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="gr-file-input"
                  onChange={(e) => {
                    handleCameraFiles(e.target.files);
                    e.target.value = '';
                  }}
                />
                <input
                  ref={inputGalleryRef}
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
                  <div className="gr-upload-panel">
                    <span className="gr-upload-icon">
                      <Camera size={28} />
                    </span>
                    <span className="gr-upload-text">Tambahkan foto barang Anda</span>
                    <span className="gr-upload-sub">Membantu petugas mengenali barang lebih cepat</span>
                    <div className="gr-upload-actions">
                      <button
                        type="button"
                        className="gr-upload-btn gr-upload-camera"
                        onClick={() => inputCameraRef.current && inputCameraRef.current.click()}
                      >
                        <Camera size={17} />
                        Ambil Foto (Kamera)
                      </button>
                      <button
                        type="button"
                        className="gr-upload-btn gr-upload-gallery"
                        onClick={() => inputGalleryRef.current && inputGalleryRef.current.click()}
                      >
                        <ImagePlus size={17} />
                        Pilih dari Galeri / File
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="gr-upload-panel">
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
                    </div>
                    <div className="gr-upload-actions">
                      <button
                        type="button"
                        className="gr-upload-btn gr-upload-camera"
                        onClick={() => inputCameraRef.current && inputCameraRef.current.click()}
                      >
                        <RefreshCw size={16} />
                        Ganti Foto
                      </button>
                      <button
                        type="button"
                        className="gr-upload-btn gr-upload-remove"
                        onClick={() => setPhotos([])}
                      >
                        <Trash2 size={16} />
                        Hapus Foto
                      </button>
                    </div>
                  </div>
                )}
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