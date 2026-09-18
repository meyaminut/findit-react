import { useNavigate } from 'react-router-dom';
import { FilePlus2, Bell, ChevronRight } from 'lucide-react';
import Sidebar from '../dashboard/components/Sidebar';
import TopNavbar from '../dashboard/components/TopNavbar';
import ReportLostForm from '../components/ReportLostForm';
import { adminReportApi } from '../../services/lostReport';
import '../dashboard/AdminDashboardView.css';
import './NewLostReportView.css';

/**
 * View Component: NewLostReportView
 * Full-page "/admin/laporan/baru" — "Buat Laporan" entry of the admin ops console.
 * Form-nya reuse komponen bersama ReportLostForm (identik dengan form sisi user
 * & QuickReportModal Dashboard); bedanya hanya wrapper: full-page vs modal.
 * Payload report dikirim via adminReportApi (services/lostReport).
 */
export function NewLostReportView({ activeNav = 'Laporan', onNavChange, onLogout }) {
  const navigate = useNavigate();

  const handleSaved = () => {
    navigate('/admin/laporan');
  };

  return (
    <div className="dashboard-app-layout">
      <Sidebar activeNav={activeNav} onNavChange={onNavChange} onLogout={onLogout} />

      <div className="dashboard-main-viewport">
        <TopNavbar onNavChange={onNavChange} onLogout={onLogout} />

        <main className="dashboard-scrollable-content">
          {/* Page Header / Breadcrumb */}
          <div className="new-report-hero">
            <div className="new-report-breadcrumb">
              <button
                type="button"
                className="new-report-crumb-link"
                onClick={() => onNavChange && onNavChange('Laporan')}
              >
                Laporan
              </button>
              <ChevronRight size={14} className="new-report-crumb-sep" />
              <span className="new-report-crumb-current">Buat Laporan</span>
            </div>
            <div className="new-report-hero-row">
              <div className="new-report-hero-icon">
                <FilePlus2 size={22} />
              </div>
              <div>
                <h1 className="new-report-title">Buat Laporan</h1>
                <p className="new-report-subtitle">
                  Seragam dengan form laporan tamu — hasilnya otomatis masuk arsip Laporan &amp; antrean Verifikasi.
                </p>
              </div>
            </div>
            <div className="new-report-notice">
              <Bell size={16} />
              <span>
                Laporan yang disimpan akan tampil di halaman <strong>Laporan</strong> (arsip)
                dan siap diverifikasi pada menu <strong>Verifikasi</strong>.
              </span>
            </div>
          </div>

          {/* Shared Lost-Item Report Form (admin API) */}
          <section className="new-report-form-wrap">
            <ReportLostForm
              api={adminReportApi}
              checkAuth={false}
              showPhoto={false}
              onSuccess={() => handleSaved()}
              submitLabel="Simpan Laporan"
              footerNote="Laporan langsung didaftarkan ke arsip Laporan & antrean Verifikasi."
            />
          </section>
        </main>
      </div>
    </div>
  );
}

export default NewLostReportView;