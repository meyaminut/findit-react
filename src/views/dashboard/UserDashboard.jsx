import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, Radar, Search, X } from 'lucide-react';
import { apiGet, getCurrentUser, clearSession } from '../../services/api';
import { normalizeReportStatus, reportStatusLabel, reportStatusType } from '../../services/reportStatus';
import finditLogo from '../../assets/logo-light.png';
import './UserDashboard.css';

/**
 * View Component: UserDashboard
 * Landing page user portal (konteks pemulihan barang Grand Meliá / FindIt).
 * Card "Laporan Aktif" & "Pencarian Berlangsung" -> /user/confirmation.
 * Card "Notifikasi Update" -> modal ringkas status notifikasi terbaru.
 * Aksi cepat: ke Survei & Deteksi Barang (/user/survey) atau
 * Laporkan Barang Tertinggal (/user/report-form).
 * Log out: hapus session & redirect ke /user/login.
 */
export default function UserDashboard() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const firstName = currentUser?.name?.split(' ')[0] || 'Tamu';
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [listModal, setListModal] = useState(null);
  const [reports, setReports] = useState([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);

  useEffect(() => {
    let active = true;
    apiGet('/reports')
      .then((res) => {
        const list = Array.isArray(res?.data) ? res.data : [];
        if (active) setReports(list);
      })
      .catch(() => {
        if (active) setReports([]);
      })
      .finally(() => {
        if (active) setIsLoadingReports(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const myReports = useMemo(() => {
    const uid = Number(currentUser?.id);
    return reports
      .filter((r) => Number(r.user_id) === uid)
      .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));
  }, [reports, currentUser]);

  const activeReports = useMemo(
    () => myReports.filter((r) => normalizeReportStatus(r.status) !== 'dikembalikan'),
    [myReports]
  );

  const roomLabel = (r) => (r.room_number ? `Kamar ${r.room_number}` : r.location || '');

  const listTitle = listModal === 'laporan' ? 'Laporan Aktif' : 'Pencarian Berlangsung';
  const listItems = listModal === 'laporan' ? myReports : activeReports;

  const handleLogout = () => {
    clearSession();
    navigate('/user/login');
  };

  return (
    <div className="user-dashboard-page">
      <div className="user-dashboard-frame">
        {/* Header */}
        <header className="ud-header">
          <div className="ud-header-inner">
            <div className="ud-logo">
              <img src={finditLogo} alt="Find!t" className="ud-logo-img" />
            </div>
            <h1 className="ud-title">Selamat datang kembali, {firstName}!</h1>
            <p className="ud-subtitle">
              Portal pemulihan barang Grand Meliá — pantau laporan &amp; status pencarian barang Anda.
            </p>
          </div>
        </header>

        {/* Body */}
        <main className="ud-body">
          <h2 className="ud-section-title">Dashboard Anda</h2>

          {/* Laporan Aktif */}
          <button type="button" className="ud-card" onClick={() => setListModal('laporan')}>
            <span className="ud-card-icon">
              <Search size={22} />
            </span>
            <div>
              <div className="ud-card-title">Laporan Aktif</div>
              <div className="ud-card-sub">Pantau semua barang yang Anda laporkan.</div>
            </div>
          </button>

          <button type="button" className="ud-card" onClick={() => setListModal('pencarian')}>
            <span className="ud-card-icon">
              <Radar size={22} />
            </span>
            <div>
              <div className="ud-card-title">Pencarian Berlangsung</div>
              <div className="ud-card-sub">Tim housekeeping menyisir kamar secara real-time.</div>
            </div>
          </button>

          {/* Notifikasi Update */}
          <button type="button" className="ud-card" onClick={() => setIsNotifOpen(true)}>
            <span className="ud-card-icon">
              <Bell size={22} />
            </span>
            <div>
              <div className="ud-card-title">Notifikasi Update</div>
              <div className="ud-card-sub">Kabar terbaru via WhatsApp &amp; email.</div>
            </div>
          </button>

          {/* Actions */}
          <div className="ud-actions">
            <button type="button" className="ud-primary-btn" onClick={() => navigate('/user/survey')}>
              <Radar size={18} /> Survei &amp; Deteksi Barang
            </button>
            <button type="button" className="ud-secondary-btn" onClick={() => navigate('/user/report-form')}>
              <Search size={18} /> Laporkan Barang Tertinggal
            </button>
          </div>

          <button type="button" className="ud-logout-btn" onClick={handleLogout}>
            <LogOut size={14} /> Log out
          </button>
        </main>

        {/* Modal List Laporan / Pencarian */}
        {listModal && (
          <div
            className="ud-modal-backdrop"
            onClick={() => setListModal(null)}
            role="presentation"
          >
            <div
              className="ud-modal-card"
              role="dialog"
              aria-modal="true"
              aria-label={listTitle}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="ud-modal-head">
                <span className="ud-modal-icon">
                  {listModal === 'laporan' ? <Search size={18} /> : <Radar size={18} />}
                </span>
                <h3 className="ud-modal-title">{listTitle}</h3>
                <button
                  type="button"
                  className="ud-modal-close"
                  onClick={() => setListModal(null)}
                  aria-label="Tutup"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="ud-modal-body ud-modal-list-body">
                {isLoadingReports ? (
                  <p className="ud-modal-empty">Memuat {listTitle.toLowerCase()}...</p>
                ) : listItems.length === 0 ? (
                  <>
                    <Search size={30} strokeWidth={1.5} className="ud-modal-empty-icon" />
                    <p className="ud-modal-empty">
                      {listModal === 'laporan' ? 'Belum ada laporan aktif.' : 'Tidak ada pencarian berlangsung.'}
                    </p>
                    <p className="ud-modal-empty-sub">Laporan yang Anda buat akan muncul di sini.</p>
                  </>
                ) : (
                  <ul className="ud-modal-list">
                    {listItems.map((r) => (
                      <li key={r.id}>
                        <button
                          type="button"
                          className="ud-item-row"
                          onClick={() => navigate('/user/confirmation', { state: { report: r } })}
                        >
                          <span className="ud-item-name">{r.title || 'Barang tanpa judul'}</span>
                          <span className="ud-item-meta">{roomLabel(r)}</span>
                          <span className={`ud-item-status ud-status-${reportStatusType(r.status)}`}>
                            {reportStatusLabel(r.status, r.type)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal Notifikasi Update */}
        {isNotifOpen && (
          <div
            className="ud-modal-backdrop"
            onClick={() => setIsNotifOpen(false)}
            role="presentation"
          >
            <div
              className="ud-modal-card"
              role="dialog"
              aria-modal="true"
              aria-label="Notifikasi Update"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="ud-modal-head">
                <span className="ud-modal-icon">
                  <Bell size={18} />
                </span>
                <h3 className="ud-modal-title">Notifikasi Update</h3>
                <button
                  type="button"
                  className="ud-modal-close"
                  onClick={() => setIsNotifOpen(false)}
                  aria-label="Tutup"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="ud-modal-body">
                <Bell size={30} strokeWidth={1.5} className="ud-modal-empty-icon" />
                <p className="ud-modal-empty">Belum ada notifikasi baru.</p>
                <p className="ud-modal-empty-sub">
                  Kabar terbaru status laporan Anda akan muncul di sini.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}