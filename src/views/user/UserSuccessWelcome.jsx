import { useNavigate } from 'react-router-dom';
import { Check, HelpCircle, ShieldCheck } from 'lucide-react';
import finditLogo from '../../assets/logo-dark.png';
import './UserSuccessWelcome.css';

/**
 * View Component: UserSuccessWelcome (Thank You Screen)
 * Ucapan terima kasih setelah tamu menjawab "Tidak, Semua Lengkap" di
 * UserSurveyLanding. Berisi pesan terima kasih serta backup action untuk
 * melaporkan barang tertinggal.
 */
export default function UserSuccessWelcome() {
  const navigate = useNavigate();

  return (
    <div className="tw-page">
      <div className="tw-frame">
        {/* ---------------- HERO SECTION & UCAPAN TERIMA KASIH ---------------- */}
        <header className="tw-hero">
          <img src={finditLogo} alt="Grand Melia Logo" className="tw-brand-logo" />
          <span className="tw-status-badge">
            <Check size={15} strokeWidth={3} />
            Semua Aman &amp; Lengkap
          </span>
          <h1 className="tw-title">Senang Mendengarnya!</h1>
          <p className="tw-subtitle">
            Terima kasih banyak sudah menginap bersama kami di Grand Melia Jakarta.
          </p>
          <p className="tw-subtitle">
            Semoga perjalanan pulang Anda menyenangkan dan selamat sampai tujuan. Seluruh tim kami
            menantikan kedatangan Anda kembali di lain kesempatan.
          </p>
        </header>

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

        {/* Footer Branding */}
        <div className="tw-brand">
          <span className="tw-brand-line tw-brand-main">
            <ShieldCheck size={14} />
            FindIt! by Grand Melia Jakarta
          </span>
          <span className="tw-brand-line">© 2024 Gran Meliá Hotel. Hospitality with Spanish Passion.</span>
        </div>
      </div>
    </div>
  );
}