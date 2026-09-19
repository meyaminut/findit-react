import {
  Shield,
  ShieldCheck,
  UserPlus,
  Info,
  Users,
  Lock,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  ChevronDown,
  X,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  User,
  Pencil,
  Trash2
} from 'lucide-react';
import Sidebar from '../dashboard/components/Sidebar';
import useAdminManagementController, {
  WORKER_DEFAULT_PASSWORD
} from '../../controllers/useAdminManagementController';
import ApiService from '../../services/ApiService';
import './ManageAdminsView.css';

const ROLE_LABELS = {
  worker: 'Room Attendant',
  user: 'User / Tamu',
  admin: 'Admin'
};

const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const initials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '?';
};

/**
 * View Component: ManageAdminsView
 * Kelola Pekerja / Room Attendant — CRUD via API langsung ke backend.
 */
export function ManageAdminsView({
  activeNav = 'Kelola Pekerja',
  onNavChange,
  onLogout
}) {
  const {
    workers,
    totalCount,
    activeCount,
    loading,
    saving,
    filterTab,
    setFilterTab,
    searchQuery,
    setSearchQuery,
    modalMode,
    editing,
    handleOpenAddModal,
    handleOpenEditModal,
    handleCloseModal,
    formData,
    handleFormChange,
    handleFormSubmit,
    handleDeleteWorker,
    protocol,
    toastNotification
  } = useAdminManagementController();

  const readCurrentUser = () => {
    try {
      return ApiService.getCurrentUser() || {};
    } catch {
      return {};
    }
  };
  const currentUser = readCurrentUser();

  const isGuestDirectory = (w) => Boolean(w && (w.role === 'user' || w.role === 'admin'));

  return (
    <div className="manage-admins-layout">
      {/* 1. Left Sidebar Navigation (Dark Navy) */}
      <Sidebar
        activeNav={activeNav}
        onNavChange={onNavChange}
        onLogout={onLogout}
      />

      {/* 2. Main Viewport */}
      <div className="manage-admins-viewport">
        {/* Clean Top Navbar */}
        <header className="clean-top-navbar">
          <div className="clean-search-wrap">
            <Search size={15} className="clean-search-icon" />
            <input
              type="text"
              className="clean-search-input"
              placeholder="Cari nama, email, atau tipe akun..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="clean-nav-right">
            <button type="button" className="clean-bell-btn" title="Notifikasi">
              <Bell size={17} />
              <span className="clean-bell-badge">3</span>
            </button>

            <div className="clean-nav-divider" />

            <div className="clean-user-profile">
              <div className="clean-user-avatar clean-user-avatar-initials">
                {initials(currentUser.name)}
              </div>
              <div className="clean-user-text">
                <span className="clean-user-name">
                  {currentUser.name || 'Administrator'}
                </span>
                <span className="clean-user-role">Admin FindIt</span>
              </div>
              <ChevronDown size={15} className="clean-chevron-down" />
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="manage-admins-content">
          {/* Header Title & Actions Row */}
          <div className="admin-page-header">
            <div className="admin-title-group">
              <div className="admin-heading-row">
                <h1 className="admin-main-title">Kelola Pekerja</h1>
                <span className="admin-active-pill">{activeCount} Room Attendant</span>
              </div>
              <p className="admin-subtitle">
                Kelola staf operasional &amp; room attendant — perubahan langsung tersimpan ke server
              </p>
            </div>

            <div className="admin-header-actions">
              <div className="system-policy-badge">
                <ShieldCheck size={14} className="policy-icon" />
                <span>{protocol.policyVersion}</span>
              </div>

              <button
                type="button"
                className="btn-add-admin"
                onClick={handleOpenAddModal}
              >
                <UserPlus size={16} />
                <span>Tambah Pekerja</span>
              </button>
            </div>
          </div>

          {/* Access Protocol Banner */}
          <div className="access-protocol-banner">
            <div className="protocol-icon-box">
              <Info size={18} />
            </div>
            <div className="protocol-body">
              <h2 className="protocol-title">{protocol.title}</h2>
              <p className="protocol-desc">{protocol.description}</p>
            </div>
          </div>

          {/* 3 Metric Summary Cards */}
          <div className="admin-metrics-grid">
            {/* Card 1: Total Pekerja */}
            <div className="clean-metric-card">
              <div className="metric-info-col">
                <span className="metric-label">Total Pekerja</span>
                <div className="metric-value-row">
                  <span className="metric-bold-value">{loading ? '—' : totalCount}</span>
                  <span className="metric-sub-value">terdaftar di sistem</span>
                </div>
              </div>
              <div className="metric-icon-square blue">
                <Users size={18} />
              </div>
            </div>

            {/* Card 2: Room Attendant Aktif */}
            <div className="clean-metric-card">
              <div className="metric-info-col">
                <span className="metric-label">Room Attendant</span>
                <div className="metric-value-row">
                  <span className="metric-bold-value">{loading ? '—' : activeCount}</span>
                  <span className="metric-bold-unit">akun worker</span>
                </div>
              </div>
              <div className="metric-icon-square amber">
                <Shield size={18} />
              </div>
            </div>

            {/* Card 3: Kebijakan Akses */}
            <div className="clean-metric-card">
              <div className="metric-info-col">
                <span className="metric-label">Role Diizinkan</span>
                <div className="metric-value-row">
                  <span className="metric-bold-value">worker</span>
                </div>
              </div>
              <div className="metric-icon-square soft-blue">
                <Lock size={18} />
              </div>
            </div>
          </div>

          {/* Filter Directory Bar */}
          <div className="filter-directory-bar">
            <div className="filter-tabs-group">
              <span className="filter-directory-label">Filter:</span>
              <button
                type="button"
                className={`directory-tab ${filterTab === 'all' ? 'active' : ''}`}
                onClick={() => setFilterTab('all')}
              >
                Semua ({totalCount})
              </button>
              <button
                type="button"
                className={`directory-tab ${filterTab === 'active' ? 'active' : ''}`}
                onClick={() => setFilterTab('active')}
              >
                Worker Only ({activeCount})
              </button>
            </div>

            <span className="showing-accounts-meta">
              Menampilkan semua akun pekerja &amp; terkait
            </span>
          </div>

          {/* Operational Accounts Table Card */}
          <div className="admin-table-card">
            <table className="clean-admin-table">
              <thead>
                <tr>
                  <th style={{ width: '240px' }}>NAMA</th>
                  <th style={{ width: '240px' }}>KONTAK</th>
                  <th style={{ width: '160px' }}>TIPE AKUN</th>
                  <th style={{ width: '140px' }}>DIBUAT</th>
                  <th style={{ width: '160px', textAlign: 'right' }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="5" className="admin-table-empty">
                      <span className="admin-loading-spinner" />
                      <span className="admin-empty-text">Memuat data pekerja dari server...</span>
                    </td>
                  </tr>
                )}

                {!loading && workers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="admin-table-empty">
                      <span className="admin-empty-icon">👋</span>
                      <span className="admin-empty-text">
                        Belum ada pekerja. Klik &quot;Tambah Pekerja&quot; untuk membuat akun pertama.
                      </span>
                    </td>
                  </tr>
                )}

                {!loading &&
                  workers.map((worker) => (
                    <tr key={worker.id} className="clean-table-row">
                      {/* 1. Name & Avatar */}
                      <td className="cell-user-identity">
                        <div className="identity-flex">
                          <div className="avatar-wrapper">
                            <div className="admin-avatar-initials">{initials(worker.name)}</div>
                            <span className="status-indicator-dot active" />
                          </div>
                          <div className="identity-text">
                            <div className="name-badge-row">
                              <span className="admin-row-name">{worker.name}</span>
                            </div>
                            <span className="admin-row-role">
                              {ROLE_LABELS[worker.role] || worker.role || 'User'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 2. Contact */}
                      <td className="cell-email">
                        <span className="admin-email-text">{worker.email || '—'}</span>
                        {worker.phone && (
                          <span className="admin-phone-text">{worker.phone}</span>
                        )}
                      </td>

                      {/* 3. Role */}
                      <td className="cell-status">
                        <span className={`clean-status-pill ${isGuestDirectory(worker) ? 'inactive' : 'active'}`}>
                          <span className="status-pill-dot" />
                          {worker.role === 'worker' ? 'Worker' : worker.role || 'User'}
                        </span>
                      </td>

                      {/* 4. Created */}
                      <td className="cell-date">
                        <span className="admin-date-text">{formatDate(worker.createdAt)}</span>
                      </td>

                      {/* 5. Actions */}
                      <td className="cell-actions">
                        <div className="worker-actions-row">
                          <button
                            type="button"
                            className="btn-edit-action"
                            onClick={() => handleOpenEditModal(worker)}
                            title="Edit pekerja"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>
                          {worker.role !== 'admin' && (
                            <button
                              type="button"
                              className="btn-delete-action"
                              onClick={() => handleDeleteWorker(worker.id)}
                              disabled={saving}
                              title="Hapus pekerja"
                            >
                              <Trash2 size={14} />
                              Hapus
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Table Pagination Footer */}
            <div className="admin-table-footer">
              <span className="footer-meta-count">
                Showing 1–{workers.length} of {totalCount} accounts
              </span>

              <div className="clean-pagination">
                <button type="button" className="pagination-arrow-btn" disabled>
                  <ChevronLeft size={16} />
                </button>
                <button type="button" className="pagination-number-btn active">
                  1
                </button>
                <button type="button" className="pagination-arrow-btn" disabled>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add / Edit Worker Modal */}
      {modalMode && (
        <div className="admin-modal-backdrop" onClick={handleCloseModal}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="modal-title-wrap">
                <h3 className="modal-title">
                  {modalMode === 'edit' ? `Edit ${editing?.name || 'Pekerja'}` : 'Tambah Pekerja'}
                </h3>
                <p className="modal-sub">
                  {modalMode === 'edit'
                    ? 'Perbarui data akun pekerja — perubahan langsung tersimpan ke server.'
                    : `Buat akun pekerja baru. Password awal otomatis: ${WORKER_DEFAULT_PASSWORD}`}
                </p>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={handleCloseModal}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="admin-modal-form">
              <div className="form-group">
                <label className="form-label">Nama Lengkap *</label>
                <div className="input-with-icon">
                  <User size={15} className="input-icon" />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Contoh: Maya Putri"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <div className="input-with-icon">
                  <Mail size={15} className="input-icon" />
                  <input
                    type="email"
                    className="form-input"
                    placeholder="contoh@findit.id"
                    value={formData.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">No. HP (opsional)</label>
                <div className="input-with-icon">
                  <Phone size={15} className="input-icon" />
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="08xxxxxxxxxx"
                    value={formData.phone}
                    onChange={(e) => handleFormChange('phone', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tipe Akun *</label>
                <select
                  className="form-select"
                  value={formData.role}
                  onChange={(e) => handleFormChange('role', e.target.value)}
                >
                  <option value="worker">Room Attendant (worker)</option>
                  <option value="user">User / Tamu (user)</option>
                </select>
              </div>

              {modalMode === 'edit' && (
                <div className="form-group">
                  <label className="form-label">Password Baru (opsional)</label>
                  <div className="input-with-icon">
                    <Lock size={15} className="input-icon" />
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Kosongkan jika tidak diubah (min. 6 karakter)"
                      value={formData.password}
                      onChange={(e) => handleFormChange('password', e.target.value)}
                      minLength={6}
                    />
                  </div>
                </div>
              )}

              <div className="security-notice-box">
                <Lock size={16} className="security-lock-icon" />
                <div className="security-notice-text">
                  <span className="notice-bold">
                    {modalMode === 'edit'
                      ? formData.password
                        ? 'Password akan di-reset'
                        : 'Password tidak diubah'
                      : `Password awal otomatis: ${WORKER_DEFAULT_PASSWORD}`}
                  </span>
                  <span className="notice-sub">
                    {modalMode === 'edit'
                      ? 'Isi kolom password di atas untuk mengganti password pekerja.'
                      : 'Pekerja dapat mengganti password setelah login pertama.'}
                  </span>
                </div>
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="btn-cancel-flat"
                  onClick={handleCloseModal}
                >
                  Batal
                </button>
                <button type="submit" className="btn-save-amber" disabled={saving}>
                  {saving
                    ? 'Menyimpan...'
                    : modalMode === 'edit'
                    ? 'Simpan Perubahan'
                    : 'Simpan Pekerja'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastNotification && (
        <div className={`clean-toast-pill ${toastNotification.type}`}>
          {toastNotification.type === 'warning' ? (
            <AlertTriangle size={16} />
          ) : (
            <CheckCircle2 size={16} />
          )}
          <span>{toastNotification.message}</span>
        </div>
      )}
    </div>
  );
}

export default ManageAdminsView;