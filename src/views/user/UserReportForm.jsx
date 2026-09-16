import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Camera,
  Check,
  ImagePlus,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import { apiPost, apiUpload, ApiError, getCurrentUser } from '../../services/api';
import './UserReportForm.css';

const CATEGORIES = ['Elektronik', 'Perhiasan & Jam', 'Dompet / Tas', 'Pakaian', 'Dokumen', 'Lainnya'];

const LOCATION_PILLS = ['Di Meja Nakas', 'Di Lemari Pakaian', 'Di Kamar Mandi', 'Bawah Ranjang'];

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5 MB per file
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * View Component: UserReportForm
 * Form "Laporkan Barang Tertinggal (Guest Report)" di User Portal.
 * Submit melakukan 2 request berurutan: upload foto (POST /upload)
 * lalu simpan laporan (POST /reports). Error upload dan error simpan
 * ditampilkan terpisah.
 */
export default function UserReportForm() {
  const navigate = useNavigate();
  const [roomNumber, setRoomNumber] = useState('');

  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(null);
  const [location, setLocation] = useState('');
  const [features, setFeatures] = useState('');

  const [photos, setPhotos] = useState([]);
  const [photoError, setPhotoError] = useState(null);
  const inputCameraRef = useRef(null);
  const inputGalleryRef = useRef(null);

  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStage, setSubmitStage] = useState('idle'); // idle | uploading | creating
  const [errorBanner, setErrorBanner] = useState(null); // { type: 'upload'|'report'|'auth', message }

  const currentUser = getCurrentUser();

  const roomInvalid = touched && !roomNumber.trim();
  const descriptionInvalid = touched && !description.trim();
  const categoryInvalid = touched && !category;
  const isFormValid = roomNumber.trim() && description.trim() && category;

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

  const validateFile = (file) => {
    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      return 'Format foto tidak didukung. Hanya JPEG, PNG, dan WebP yang diizinkan.';
    }
    if (file.size > MAX_PHOTO_SIZE) {
      return 'Ukuran foto maksimal 5 MB per file.';
    }
    return null;
  };

  const collectFiles = (files) => {
    const accepted = [];
    let firstError = null;
    Array.from(files).forEach((file) => {
      const err = validateFile(file);
      if (err) {
        if (!firstError) firstError = err;
        return;
      }
      accepted.push({ preview: URL.createObjectURL(file), file });
    });
    if (firstError) setPhotoError(firstError);
    else setPhotoError(null);
    return accepted;
  };

  const handleFiles = (files) => {
    const accepted = collectFiles(files);
    if (accepted.length > 0) {
      setPhotos((prev) => [...prev, ...accepted]);
    }
  };

  const handleCameraFiles = (files) => {
    const accepted = collectFiles(files);
    if (accepted.length > 0) {
      setPhotos(accepted);
    }
  };

  const removePhoto = (previewUrl) => {
    setPhotos((prev) => {
      const target = prev.find((photo) => photo.preview === previewUrl);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((photo) => photo.preview !== previewUrl);
    });
  };

  const resetForm = () => {
    photos.forEach((photo) => URL.revokeObjectURL(photo.preview));
    setPhotos([]);
    setPhotoError(null);
    setRoomNumber('');
    setDescription('');
    setCategory(null);
    setLocation('');
    setFeatures('');
    setTouched(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (!isFormValid || isSubmitting) return;

    setErrorBanner(null);

    if (!currentUser) {
      setErrorBanner({
        type: 'auth',
        message: 'Anda perlu masuk untuk mengirim laporan. Silakan masuk terlebih dahulu.',
      });
      return;
    }

    setIsSubmitting(true);
    const photoUrls = [];

    // STEP 1: upload foto (jika ada)
    if (photos.length > 0) {
      setSubmitStage('uploading');
      try {
        for (const photo of photos) {
          const up = await apiUpload('/upload', photo.file, 'file');
          if (up?.data?.url) photoUrls.push(up.data.url);
        }
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.status === 401
              ? 'Sesi Anda berakhir. Silakan masuk kembali untuk mengunggah foto.'
              : err.message || 'Gagal mengunggah foto.'
            : 'Gagal mengunggah foto. Periksa koneksi Anda dan coba lagi.';
        setErrorBanner({ type: 'upload', message });
        setIsSubmitting(false);
        setSubmitStage('idle');
        return;
      }
    }

    // STEP 2: simpan laporan
    setSubmitStage('creating');
    try {
      const result = await apiPost('/reports', {
        user_id: currentUser.id,
        type: 'lost',
        title: description.trim().slice(0, 80),
        description: description.trim(),
        category: category || 'Lainnya',
        room_number: roomNumber.trim(),
        location,
        photo_url: photoUrls.filter(Boolean).join(','),
      });
      if (result?.status === 'success') {
        resetForm();
        navigate('/user/confirmation', { state: { report: result.data } });
        return;
      }
      setErrorBanner({
        type: 'report',
        message: result?.message || 'Gagal menyimpan laporan. Silakan coba lagi.',
      });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.status === 401
            ? 'Sesi Anda berakhir. Silakan masuk kembali untuk mengirim laporan.'
            : err.message || 'Gagal menyimpan laporan.'
          : 'Gagal menyimpan laporan. Silakan coba lagi.';
      setErrorBanner({ type: 'report', message });
    } finally {
      setIsSubmitting(false);
      setSubmitStage('idle');
    }
  };

  const submitLabel = () => {
    if (isSubmitting && submitStage === 'uploading') {
      return (
        <>
          <Loader2 size={18} className="gr-submit-spin" />
          Mengunggah foto...
        </>
      );
    }
    if (isSubmitting && submitStage === 'creating') {
      return (
        <>
          <Loader2 size={18} className="gr-submit-spin" />
          Menyimpan laporan...
        </>
      );
    }
    return (
      <>
        Kirim Laporan &amp; Mulai Pencarian
        <ArrowRight size={18} className="gr-submit-arrow" />
      </>
    );
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

          <form className="gr-form" onSubmit={handleSubmit}>
            {/* Banner Error Global */}
            {errorBanner && (
              <div className={`gr-error-banner gr-error-banner-${errorBanner.type}`} role="alert">
                <AlertCircle size={16} />
                <span>{errorBanner.message}</span>
              </div>
            )}

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
                  className={`gr-input ${roomInvalid ? 'gr-input-error' : ''}`}
                  placeholder="Contoh: 314, 502, atau Area Lobby"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  required
                />
                {roomInvalid && (
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
                        <div className="gr-photo-thumb" key={photo.preview}>
                          <img src={photo.preview} alt="Foto barang" />
                          <button
                            type="button"
                            className="gr-photo-remove"
                            onClick={(e) => {
                              e.stopPropagation();
                              removePhoto(photo.preview);
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
                        onClick={() => {
                          photos.forEach((photo) => URL.revokeObjectURL(photo.preview));
                          setPhotos([]);
                        }}
                      >
                        <Trash2 size={16} />
                        Hapus Foto
                      </button>
                    </div>
                  </div>
                )}
                {photoError && (
                  <span className="gr-error-text">{photoError}</span>
                )}
              </div>

              {/* Deskripsi Barang */}
              <div className="gr-field">
                <label className="gr-label" htmlFor="gr-description">
                  Barang apa yang tertinggal? <span className="gr-required">*</span>
                </label>
                <textarea
                  id="gr-description"
                  className={`gr-input gr-textarea ${descriptionInvalid ? 'gr-input-error' : ''}`}
                  rows={2}
                  placeholder="Contoh: Jam tangan Garmin hitam, dompet kulit, charger MacBook..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {descriptionInvalid && (
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
                      className={`gr-pill ${category === value ? 'active' : ''} ${categoryInvalid && !category ? 'gr-pill-error' : ''}`}
                      onClick={() => toggleCategory(value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                {categoryInvalid && (
                  <span className="gr-error-text">Mohon pilih salah satu kategori.</span>
                )}
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
            <button type="submit" className="gr-submit-btn" disabled={isSubmitting}>
              {submitLabel()}
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