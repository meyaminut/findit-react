import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Heart,
  HelpCircle,
  Key,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  Star,
} from 'lucide-react';
import lobbyImage from '../../assets/hero.png';
import './UserSuccessWelcome.css';

/**
 * View Component: UserSuccessWelcome (Thank You Screen)
 * Ucapan terima kasih setelah tamu menjawab "Tidak, Semua Lengkap" di
 * UserSurveyLanding. Berisi ringkasan kunjungan, e-folio, opsi bantuan,
 * serta backup action untuk melaporkan barang tertinggal.
 */
export default function UserSuccessWelcome() {
  const navigate = useNavigate();

  return (
    <div className="tw-page">
      <div className="tw-frame">
        {/* ---------------- HERO SECTION & UCAPAN TERIMA KASIH ---------------- */}
        <header className="tw-hero">
          <div className="tw-hero-icon">
            <Sparkles size={42} strokeWidth={2} />
            <span className="tw-hero-heart">
              <Heart size={16} fill="currentColor" strokeWidth={0} />
            </span>
          </div>
          <span className="tw-status-badge">✓ Semua Aman &amp; Lengkap</span>
          <h1 className="tw-title">Senang Mendengarnya! 😊</h1>
          <p className="tw-subtitle">
            Terima kasih banyak sudah menginap bersama kami di Grand Melia Jakarta.
          </p>
          <p className="tw-subtitle">
            Semoga perjalanan pulang Anda menyenangkan dan selamat sampai tujuan. Seluruh tim kami
            menantikan kedatangan Anda kembali di lain kesempatan.
          </p>

          {/* Banner Lobby */}
          <div className="tw-banner">
            <img src={lobbyImage} alt="Lobby Grand Melia Jakarta" className="tw-banner-img" draggable={false} />
            <span className="tw-banner-overlay" />
            <span className="tw-banner-loc">
              <MapPin size={14} />
              Grand Melia Jakarta • Jl. H.R. Rasuna Said
            </span>
          </div>
        </header>

        {/* ------------- SUMMARY CARD (RINGKASAN KUNINGAN & E-FOLIO) ---------- */}
        <section className="tw-summary">
          {/* Row 1 */}
          <div className="tw-sum-row">
            <span className="tw-sum-icon">
              <Key size={19} />
            </span>
            <div className="tw-sum-main">
              <span className="tw-sum-label">RINGKASAN KUNINGAN</span>
              <span className="tw-sum-value">Kamar 314</span>
            </div>
            <div className="tw-sum-right">
              <span className="tw-sum-date">12 - 14 Mar 2024</span>
              <span className="tw-sum-status">✓ Checked Out</span>
            </div>
          </div>

          {/* Row 2 - Poin Reward */}
          <div className="tw-reward-box">
            <span className="tw-reward-icon">
              <Star size={19} fill="currentColor" strokeWidth={0} />
            </span>
            <div>
              <span className="tw-reward-title">+250 MeliaRewards Poin</span>
              <span className="tw-reward-sub">Telah ditambahkan ke akun keanggotaan Anda</span>
            </div>
          </div>

          {/* Row 3 - E-Folio */}
          <button type="button" className="tw-folio-btn">
            <span className="tw-folio-icon">
              <FileText size={18} />
            </span>
            <span className="tw-folio-text">Unduh E-Folio / Nota Tagihan</span>
            <span className="tw-folio-badge">PDF</span>
          </button>
        </section>

        {/* ---------- BACKUP ACTION CARD (KONTINGENSI BARANG TERTINGGAL) ------ */}
        <section className="tw-backup">
          <span className="tw-backup-icon">
            <HelpCircle size={20} />
          </span>
          <h2 className="tw-backup-title">Tiba-tiba teringat ada barang tertinggal nanti?</h2>
          <p className="tw-backup-desc">
            Jangan khawatir. Tautan ini tetap aktif selama 7 hari. Anda dapat kembali ke halaman
            ini kapan saja untuk melaporkan barang hilang jika diperlukan.
          </p>
          <button
            type="button"
            className="tw-backup-btn"
            onClick={() => navigate('/user/report-form')}
          >
            Ubah Jawaban &amp; Laporkan Barang
          </button>
        </section>

        {/* ---------------- FOOTER LAYANAN PELANGGAN 24 JAM ------------------- */}
        <section className="tw-services">
          <span className="tw-services-badge">LAYANAN PELANGGAN 24 JAM</span>
          <h2 className="tw-services-title">Butuh Bantuan Lebih Cepat?</h2>
          <p className="tw-services-sub">
            Tim Housekeeping &amp; Concierge siap sedia membantu Anda setiap saat.
          </p>
          <div className="tw-contact-grid">
            <button type="button" className="tw-contact-btn tw-contact-phone">
              <Phone size={17} />
              <span className="tw-contact-text">
                Concierge Desk
                <span className="tw-contact-sub">+62 21 526 8080</span>
              </span>
            </button>
            <button type="button" className="tw-contact-btn tw-contact-wa">
              <MessageCircle size={17} />
              <span className="tw-contact-text">
                WhatsApp Care
                <span className="tw-contact-sub">Respon Cepat</span>
              </span>
            </button>
          </div>
        </section>

        {/* Footer Branding */}
        <div className="tw-brand">
          <span className="tw-brand-line">🛡️ Find It! by Grand Melia Jakarta</span>
          <span className="tw-brand-line">© 2024 Gran Meliá Hotel. Hospitality with Spanish Passion.</span>
        </div>
      </div>
    </div>
  );
}