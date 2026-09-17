import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';
import ReportLostForm from '../components/ReportLostForm';

/**
 * View Component: UserReportForm
 * Halaman "Laporkan Barang Tertinggal (Guest Report)" di User Portal.
 * Form (field, urutan, validasi) dirender dari komponen bersama
 * ReportLostForm agar identik dengan form laporan yang dipakai admin
 * (QuickReportModal di Dashboard & full-page /admin/laporan/baru).
 */
export default function UserReportForm() {
  const navigate = useNavigate();

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

          {/* Shared Lost-Item Report Form */}
          <ReportLostForm
            onSuccess={(result) => {
              navigate('/user/confirmation', { state: { report: result.data } });
            }}
          />
        </main>
      </div>
    </div>
  );
}