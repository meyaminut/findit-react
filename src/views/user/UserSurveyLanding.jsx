import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  FilePen,
  Star,
} from 'lucide-react';
import './UserSurveyLanding.css';

const STARS = [1, 2, 3, 4, 5];

/**
 * View Component: UserSurveyLanding
 * Halaman "Survei & Deteksi Tamu" di User Portal.
 * Alur: rating bintang -> 2 opsi keputusan ->
 *   "Ya" (Isi Form Laporan) -> /user/report-form
 *   "Tidak" (Selesaikan)    -> /user/thanks
 */
export default function UserSurveyLanding() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);

  return (
    <div className="guest-survey-page">
      <div className="guest-survey-frame">
        {/* ------------------------- HEADER HOTEL ------------------------ */}
        <header className="gs-header">
          <button type="button" className="back-btn" onClick={() => navigate('/user/dashboard')} aria-label="Back">
            <ArrowLeft size={20} />
          </button>

          <div className="gs-top-bar">
            <span className="gs-hotel-logo">
              <Building2 size={26} />
            </span>
            <div className="gs-hotel-id">
              <span className="gs-hotel-name">Grand Meliá</span>
              <span className="gs-hotel-sub">JAKARTA KUNINGAN</span>
            </div>
          </div>
        </header>

        {/* ----------------------- RATING LAYANAN ------------------------ */}
        <section className="gs-rating">
          <div className="gs-stars">
            {STARS.map((star) => (
              <button
                key={star}
                type="button"
                className={`gs-star ${rating >= star ? 'active' : ''}`}
                onClick={() => setRating(star)}
                aria-label={`${star} bintang`}
                aria-pressed={rating === star}
              >
                <Star
                  size={30}
                  fill={rating >= star ? '#fea619' : 'none'}
                  stroke={rating >= star ? '#fea619' : '#c9c6d4'}
                />
              </button>
            ))}
          </div>
          <span className="gs-rating-sub">Layanan Tamu Grand Meliá</span>
        </section>

        {/* ------------------- HEADLINE DETEKSI BARANG ------------------- */}
        <section className="gs-headline">
          <span className="gs-headline-badge">LAYANAN PEMULIHAN BARANG</span>
          <h1 className="gs-title">Apakah Ada Barang Anda yang Tertinggal?</h1>
          <p className="gs-subtitle">
            Bantu tim Housekeeping &amp; Front Office kami memastikan seluruh barang
            bawaan Anda aman sebelum meninggalkan area hotel.
          </p>
        </section>

        {/* --------------------- OPSI KEPUTUSAN TAMU --------------------- */}
        <section className="gs-options">
          <article className="gs-option gs-option-warn">
            <div className="gs-option-head">
              <span className="gs-option-tag">OPSI A</span>
              <span className="gs-option-icon">
                <FilePen size={20} />
              </span>
            </div>
            <h2 className="gs-option-title">Ya, Ada Barang Tertinggal</h2>
            <p className="gs-option-desc">
              Laporkan detail barang Anda untuk langsung diproses oleh tim kami.
            </p>
            <button
              type="button"
              className="gs-option-btn gs-btn-warn"
              onClick={() => navigate('/user/report-form')}
            >
              Isi Form Laporan
              <ArrowRight size={17} />
            </button>
          </article>

          <article className="gs-option gs-option-safe">
            <div className="gs-option-head">
              <span className="gs-option-tag">OPSI B</span>
              <span className="gs-option-icon">
                <CheckCircle2 size={20} />
              </span>
            </div>
            <h2 className="gs-option-title">Tidak, Semua Barang Lengkap</h2>
            <p className="gs-option-desc">
              Seluruh barang bawaan sudah aman dan tidak ada yang tertinggal.
            </p>
            <button
              type="button"
              className="gs-option-btn gs-btn-safe"
              onClick={() => navigate('/user/thanks')}
            >
              Selesaikan &amp; Lihat Ringkasan
              <ArrowRight size={17} />
            </button>
          </article>
        </section>

        {/* ------------------------- FOOTER CATATAN ---------------------- */}
        <p className="gs-footnote">
          Pencarian aktif ditangani langsung oleh Duty Manager &amp; Housekeeping.
        </p>
      </div>
    </div>
  );
}