import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  DoorClosed,
  Headphones,
  Lock,
  MessageCircle,
  Phone,
  ShieldPlus,
} from 'lucide-react';
import heroImage from '../../assets/hero.png';
import './UserSurveyLanding.css';

const RATINGS = [
  { emoji: '😞', label: 'Kurang' },
  { emoji: '😐', label: 'Cukup' },
  { emoji: '🙂', label: 'Baik' },
  { emoji: '😊', label: 'Puas' },
  { emoji: '🤩', label: 'Istimewa' },
];

const DEFAULT_RATING = 4;

/**
 * View Component: UserSurveyLanding
 * Halaman "Survei & Deteksi Tamu (Survey Landing)" di User Portal.
 * Alur: rating -> deteksi barang tertinggal -> "Ya" ke UserReportForm
 *       / "Tidak" -> UserSuccessWelcome (thank you, /user/thanks).
 */
export default function UserSurveyLanding() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(DEFAULT_RATING);

  return (
    <div className="guest-survey-page">
      <div className="guest-survey-frame">
        {/* ------------------------- HEADER SECTION ------------------------- */}
        <header className="gs-header">
          <div className="gs-top-bar">
            <span className="gs-hotel-logo">
              <Building2 size={20} />
            </span>
            <span className="gs-hotel-name">Grand Meliá</span>
            <span className="gs-hotel-sub">JAKARTA • KUNINGAN</span>
            <span className="gs-status-badge">
              <span className="gs-status-dot" />
              Selesai Kunjungan
            </span>
          </div>

          <div className="gs-info-box">
            <span className="gs-info-icon">
              <DoorClosed size={17} />
            </span>
            <span className="gs-info-text">
              Kamar 314 (Deluxe King) • Checkout Hari Ini, 11:45 WIB
            </span>
          </div>

          <h1 className="gs-greeting">Halo Ibu Dian Pratiwi,</h1>
          <p className="gs-desc">
            Terima kasih telah mempercayakan kenyamanan istirahat Anda bersama kami.
            Kami ingin memastikan kepulangan Anda berlangsung sempurna dan bebas kekhawatiran.
          </p>
        </header>

        {/* --------------------- HERO IMAGE & RATING ------------------------ */}
        <section className="gs-hero">
          <img src={heroImage} alt="Kamar Grand Meliá" className="gs-hero-img" draggable={false} />
          <span className="gs-hero-badge">PENGALAMAN TAMU PRIORITAS #GMJ-314</span>
        </section>

        <section className="gs-section gs-rating-section">
          <h2 className="gs-section-title">Bagaimana pengalaman menginap Anda?</h2>
          <p className="gs-section-sub">
            Satu sentuhan Anda sangat berarti bagi peningkatan standar pelayanan tim kami.
          </p>
          <div className="gs-rating-grid">
            {RATINGS.map((item, index) => (
              <button
                key={item.label}
                type="button"
                className={`gs-rating-item ${rating === index ? 'selected' : ''}`}
                onClick={() => setRating(index)}
                aria-pressed={rating === index}
              >
                <span className="gs-rating-emoji">{item.emoji}</span>
                <span className="gs-rating-label">{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ------------- DETEKSI BARANG TERTINGGAL (LOGIKA UTAMA) ----------- */}
        <section className="gs-detect">
              <span className="gs-detect-badge">PEMERIKSAAN BARANG BAWAAN</span>
              <h2 className="gs-detect-title">
                Apakah ada barang Anda yang mungkin tertinggal di kamar?
              </h2>
              <div className="gs-notice">
                <span className="gs-notice-icon">
                  <ShieldPlus size={19} />
                </span>
                <p className="gs-notice-text">
                  Tim Housekeeping kami selalu memeriksa laci, brankas, dan sudut ranjang
                  secara menyeluruh sebelum proses sanitasi kamar berikutnya.
                </p>
              </div>
              <button
                type="button"
                className="gs-action gs-action-yes"
                onClick={() => navigate('/user/report-form')}
              >
                <span className="gs-action-emoji">❓</span> Ya, Ada yang Tertinggal
              </button>
              <button
                type="button"
                className="gs-action gs-action-no"
                onClick={() => navigate('/user/thanks')}
              >
                <span className="gs-action-emoji">✓</span> Tidak, Semua Lengkap
              </button>
        </section>

        {/* -------------------- FOOTER LAYANAN TAMU 24 JAM ------------------ */}
        <section className="gs-services">
          <div className="gs-services-head">
            <span className="gs-services-icon">
              <Headphones size={20} />
            </span>
            <div>
              <span className="gs-services-title">Layanan Tamu 24 Jam</span>
              <span className="gs-services-sub">Front Desk &amp; Tim Tata Graha</span>
            </div>
          </div>
          <p className="gs-services-text">
            Butuh bantuan instan terkait bagasi, pengiriman paket barang tertinggal via
            ekspedisi, atau pemesanan taksi bandara?
          </p>
          <div className="gs-contact-grid">
            <button type="button" className="gs-contact-btn gs-contact-wa">
              <MessageCircle size={17} />
              WhatsApp FO
            </button>
            <button type="button" className="gs-contact-btn gs-contact-phone">
              <Phone size={17} />
              (021) 526 8080
            </button>
          </div>
        </section>

        <p className="gs-encrypt">
          <Lock size={12} />
          Enkripsi Data Tamu Aman • Grand Meliá Hospitality v2.4
        </p>
      </div>
    </div>
  );
}