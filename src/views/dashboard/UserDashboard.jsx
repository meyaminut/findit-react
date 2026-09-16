import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, Radar, Search } from 'lucide-react';
import './UserDashboard.css';

/**
 * View Component: UserDashboard
 * Landing page user portal (konteks pemulihan barang Grand Meliá / FindIt).
 * Aksi cepat: ke Survei & Deteksi Barang (/user/survey) atau
 * Laporkan Barang Tertinggal (/user/report-form).
 * TODO: ganti konten dengan halaman dashboard user yang sebenarnya
 * (daftar laporan aktif, status pemulihan, dsb) sesuai desain tim.
 */
export default function UserDashboard() {
  const navigate = useNavigate();

  return (
    <div className="user-dashboard-page">
      <div className="user-dashboard-frame">
        {/* Header */}
        <header className="ud-header">
          <div className="ud-header-inner">
            <div className="ud-logo">
              Find<span className="ud-logo-it">!t</span>
            </div>
            <h1 className="ud-title">Selamat datang kembali!</h1>
            <p className="ud-subtitle">
              Portal pemulihan barang Grand Meliá — pantau laporan &amp; status pencarian barang Anda.
            </p>
          </div>
        </header>

        {/* Body */}
        <main className="ud-body">
          <h2 className="ud-section-title">Dashboard Anda</h2>

          <div className="ud-placeholder-note">
            Dashboard dalam pengembangan — daftar laporan &amp; status pemulihan barang menyusul.
          </div>

          <div className="ud-card">
            <span className="ud-card-icon">
              <Search size={22} />
            </span>
            <div>
              <div className="ud-card-title">Laporan Aktif</div>
              <div className="ud-card-sub">Pantau semua barang yang Anda laporkan.</div>
            </div>
          </div>

          <div className="ud-card">
            <span className="ud-card-icon">
              <Radar size={22} />
            </span>
            <div>
              <div className="ud-card-title">Pencarian Berlangsung</div>
              <div className="ud-card-sub">Tim housekeeping menyisir kamar secara real-time.</div>
            </div>
          </div>

          <div className="ud-card">
            <span className="ud-card-icon">
              <Bell size={22} />
            </span>
            <div>
              <div className="ud-card-title">Notifikasi Update</div>
              <div className="ud-card-sub">Kabar terbaru via WhatsApp &amp; email.</div>
            </div>
          </div>

          {/* Actions */}
          <div className="ud-actions">
            <button type="button" className="ud-primary-btn" onClick={() => navigate('/user/survey')}>
              <Radar size={18} /> Survei &amp; Deteksi Barang
            </button>
            <button type="button" className="ud-secondary-btn" onClick={() => navigate('/user/report-form')}>
              <Search size={18} /> Laporkan Barang Tertinggal
            </button>
          </div>

          <button type="button" className="ud-logout-btn" onClick={() => navigate('/user/login')}>
            <LogOut size={14} /> Log out
          </button>
        </main>
      </div>
    </div>
  );
}