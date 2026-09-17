import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AlarmClock,
  ArrowLeft,
  Bell,
  Check,
  Copy,
  LayoutDashboard,
  Lock,
} from 'lucide-react';
import { getCurrentUser } from '../../services/api';
import './UserReportConfirmation.css';

const STEPS = [
  {
    state: 'done',
    title: 'Laporan Diterima & Disposisi',
    desc: 'Notifikasi instan dikirim ke Supervisor Floor 3.',
  },
  {
    state: 'progress',
    title: 'Sedang Berlangsung',
    badge: 'Pencarian Aktif',
    desc: 'Tim housekeeping sedang menyisir area kamar Anda.',
  },
  {
    state: 'pending',
    number: 3,
    title: 'Menunggu Verifikasi Admin',
    desc: 'Pencocokan laporan oleh admin & tim verifikasi sebelum hasil akhir.',
  },
];

/**
 * View Component: UserReportConfirmation
 * Halaman "Konfirmasi Laporan" di User Portal.
 * Menampilkan nomor tiket, ringkasan barang, timeline proses, serta aksi
 * salin nomor tiket. Data laporan diambil dari location.state (hasil POST
 * /reports) dengan fallback ke nilai default bila dibuka langsung.
 */
export default function UserReportConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  const report = location.state?.report || null;
  const currentUser = getCurrentUser();

  const ticketNumber = report?.report_identifier || '#CLM-2024-0892';
  const roomNumber = report?.room_number || 'Kamar 314';
  const itemTitle = report?.title || report?.description || 'Smartwatch Garmin Venu SQ';
  const itemMeta = report?.category
    ? `${report.category} • ${roomNumber}`
    : `Warna Hitam • ${roomNumber} (Meja Kerja)`;
  const userName = currentUser?.name?.split(' ')[0] || 'Bpk. Hendra';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ticketNumber);
    } catch {
      // clipboard mungkin tidak tersedia (konteks non-secure)
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="user-confirmation-page">
      <div className="user-confirmation-frame">
        {/* ---------------------- HEADER KONFIRMASI ---------------------- */}
        <header className="uc-header">
          <button type="button" className="back-btn" onClick={() => navigate('/user/dashboard')} aria-label="Back">
            <ArrowLeft size={20} />
          </button>
          <div className="uc-success-icon">
            <Bell size={44} strokeWidth={2} />
            <span className="uc-success-check">
              <Check size={16} strokeWidth={3.5} />
            </span>
          </div>
          <span className="uc-badge">KONFIRMASI TIKET</span>
          <h1 className="uc-title">Laporan Berhasil Diterima!</h1>
          <p className="uc-subtitle">
            Terima kasih, {userName}. Tim kami sedang langsung memeriksa {roomNumber} sekarang juga.
          </p>
        </header>

        {/* ------------------- TICKET SUMMARY WHITE CARD ----------------- */}
        <section className="uc-summary">
          {/* Nomor Tiket */}
          <div className="uc-ticket-row">
            <div className="uc-ticket-left">
              <span className="uc-ticket-label">NOMOR TIKET</span>
              <span className="uc-ticket-number">{ticketNumber}</span>
            </div>
            <button type="button" className={`uc-copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
              {copied ? <Check size={14} strokeWidth={3} /> : <Copy size={14} />}
              {copied ? 'Tersalin' : 'Salin'}
            </button>
          </div>

          {/* Detail Barang */}
          <div className="uc-divider" />
          <div className="uc-item-row">
            <span className="uc-item-icon">
              <AlarmClock size={22} />
            </span>
            <div className="uc-item-text">
              <span className="uc-item-label">Barang Dilaporkan</span>
              <span className="uc-item-name">{itemTitle}</span>
              <span className="uc-item-sub">{itemMeta}</span>
            </div>
          </div>

          {/* Status Badge */}
          <span className="uc-status-badge">
            <span className="uc-status-dot" />
            Pencarian Aktif (Housekeeping On-Duty)
          </span>

          {/* Estimasi Box */}
          <div className="uc-estimate">
            <span className="uc-estimate-icon">
              <AlarmClock size={18} />
            </span>
            <span className="uc-estimate-text">
              Estimasi update: <strong>&lt; 30 menit</strong> ke WhatsApp Anda
              ({currentUser?.phone ? `+${currentUser.phone}` : '+62 812-****-8821'})
            </span>
          </div>
        </section>

        {/* ---------------------- TIMELINE PROSES ------------------------ */}
        <section className="uc-timeline">
          <div className="uc-timeline-head">
            <span className="uc-timeline-title">Proses Berikutnya</span>
            <span className="uc-stage-badge">Tahap 2 dari 3</span>
          </div>

          <ol className="uc-steps">
            {STEPS.map((step, index) => (
              <li className={`uc-step uc-step-${step.state}`} key={step.title}>
                <div className="uc-step-track">
                  {step.state === 'done' && (
                    <span className="uc-step-icon uc-step-icon-done">
                      <Check size={17} strokeWidth={3} />
                    </span>
                  )}
                  {step.state === 'progress' && (
                    <span className="uc-step-icon uc-step-icon-progress">
                      <span className="uc-step-dot" />
                    </span>
                  )}
                  {step.state === 'pending' && (
                    <span className="uc-step-icon uc-step-icon-pending">{step.number}</span>
                  )}
                  {index < STEPS.length - 1 && <span className="uc-step-line" />}
                </div>
                <div className="uc-step-body">
                  <div className="uc-step-title-row">
                    <span className="uc-step-title">{step.title}</span>
                    {step.badge && <span className="uc-step-badge">{step.badge}</span>}
                  </div>
                  <span className="uc-step-desc">{step.desc}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ----------------------- ACTION BUTTONS ------------------------ */}
        <p className="uc-footer-hint">
          <Lock size={12} />
          Data laporan dienkripsi &amp; hanya diakses tim verifikasi internal.
        </p>

        <button type="button" className="uc-dashboard-btn" onClick={() => navigate('/user/dashboard')}>
          <LayoutDashboard size={16} /> Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}