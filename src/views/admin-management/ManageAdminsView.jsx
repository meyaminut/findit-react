import React, { useState } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  UserPlus, 
  Info, 
  Users, 
  Activity, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Bell, 
  ChevronDown, 
  Check, 
  X, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  Mail,
  User
} from 'lucide-react';
import Sidebar from '../dashboard/components/Sidebar';
import useAdminManagementController from '../../controllers/useAdminManagementController';
import './ManageAdminsView.css';

/**
 * View Component: ManageAdminsView
 * Pixel-perfect implementation of the clean, anti-AI "Manage Admins" operational console.
 * Features crisp 1px borders, high-contrast typography, and official Find!t brand palette.
 */
export function ManageAdminsView({
  activeNav = 'Kelola Admin',
  onNavChange,
  onLogout
}) {
  const {
    admins,
    totalCount,
    activeCount,
    filterTab,
    setFilterTab,
    searchQuery,
    setSearchQuery,
    isAddModalOpen,
    handleOpenAddModal,
    handleCloseAddModal,
    formData,
    handleFormChange,
    handleFormSubmit,
    handleToggleStatus,
    handleDeleteAdmin,
    protocol,
    metrics,
    toastNotification
  } = useAdminManagementController();

  const [activeActionMenuId, setActiveActionMenuId] = useState(null);

  const toggleActionMenu = (id, e) => {
    e.stopPropagation();
    setActiveActionMenuId((prev) => (prev === id ? null : id));
  };

  const closeActionMenu = () => {
    setActiveActionMenuId(null);
  };

  return (
    <div className="manage-admins-layout" onClick={closeActionMenu}>
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
              placeholder="Press / or search reports, items, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="clean-nav-right">
            <button type="button" className="clean-bell-btn" title="3 Notifikasi">
              <Bell size={17} />
              <span className="clean-bell-badge">3</span>
            </button>

            <div className="clean-nav-divider" />

            <div className="clean-user-profile">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                alt="Sarah Jenkins"
                className="clean-user-avatar"
              />
              <div className="clean-user-text">
                <span className="clean-user-name">Sarah Jenkins</span>
                <span className="clean-user-role">Senior Operations Admin</span>
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
                <h1 className="admin-main-title">Manage Admins</h1>
                <span className="admin-active-pill">{activeCount} Active</span>
              </div>
              <p className="admin-subtitle">
                Manage operational staff and system administrators
              </p>
            </div>

            <div className="admin-header-actions">
              <div className="system-policy-badge">
                <ShieldCheck size={14} className="policy-icon" />
                <span>System Policy: {protocol.policyVersion}</span>
              </div>

              <button
                type="button"
                className="btn-add-admin"
                onClick={handleOpenAddModal}
              >
                <UserPlus size={16} />
                <span>+ Add Admin</span>
              </button>
            </div>
          </div>

          {/* Equal Privilege Access Protocol Banner */}
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
            {/* Card 1: Authorized Seats */}
            <div className="clean-metric-card">
              <div className="metric-info-col">
                <span className="metric-label">Authorized Seats</span>
                <div className="metric-value-row">
                  <span className="metric-bold-value">{metrics.authorizedSeats.activeCount}</span>
                  <span className="metric-sub-value">/ {metrics.authorizedSeats.totalAllocated} allocated</span>
                </div>
              </div>
              <div className="metric-icon-square blue">
                <Users size={18} />
              </div>
            </div>

            {/* Card 2: Recent Activity (24h) */}
            <div className="clean-metric-card">
              <div className="metric-info-col">
                <span className="metric-label">Recent Activity (24h)</span>
                <div className="metric-value-row">
                  <span className="metric-bold-value">{metrics.recentActivity.activeCount}</span>
                  <span className="metric-bold-unit">{metrics.recentActivity.unit}</span>
                </div>
              </div>
              <div className="metric-icon-square amber">
                <Activity size={18} />
              </div>
            </div>

            {/* Card 3: Security Enforcement */}
            <div className="clean-metric-card">
              <div className="metric-info-col">
                <span className="metric-label">Security Enforcement</span>
                <div className="metric-value-row">
                  <span className="metric-bold-value">{metrics.securityEnforcement.status}</span>
                </div>
              </div>
              <div className="metric-icon-square soft-blue">
                <Shield size={18} />
              </div>
            </div>
          </div>

          {/* Filter Directory Bar */}
          <div className="filter-directory-bar">
            <div className="filter-tabs-group">
              <span className="filter-directory-label">Filter Directory:</span>
              <button
                type="button"
                className={`directory-tab ${filterTab === 'all' ? 'active' : ''}`}
                onClick={() => setFilterTab('all')}
              >
                All ({totalCount})
              </button>
              <button
                type="button"
                className={`directory-tab ${filterTab === 'active' ? 'active' : ''}`}
                onClick={() => setFilterTab('active')}
              >
                Active Only
              </button>
            </div>

            <span className="showing-accounts-meta">
              Showing all operational accounts
            </span>
          </div>

          {/* Operational Accounts Table Card */}
          <div className="admin-table-card">
            <table className="clean-admin-table">
              <thead>
                <tr>
                  <th style={{ width: '260px' }}>NAME &amp; AVATAR</th>
                  <th style={{ width: '220px' }}>WORK EMAIL</th>
                  <th style={{ width: '150px' }}>DATE ADDED</th>
                  <th style={{ width: '150px' }}>LAST ACTIVE</th>
                  <th style={{ width: '130px' }}>STATUS</th>
                  <th style={{ width: '150px', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="clean-table-row">
                    {/* 1. Name & Avatar */}
                    <td className="cell-user-identity">
                      <div className="identity-flex">
                        <div className="avatar-wrapper">
                          <img
                            src={admin.avatar}
                            alt={admin.name}
                            className="admin-avatar-img"
                          />
                          <span className={`status-indicator-dot ${admin.status}`} />
                        </div>
                        <div className="identity-text">
                          <div className="name-badge-row">
                            <span className="admin-row-name">{admin.name}</span>
                            {admin.isCurrentUser && (
                              <span className="badge-you-pill">YOU</span>
                            )}
                          </div>
                          <span className="admin-row-role">{admin.role}</span>
                        </div>
                      </div>
                    </td>

                    {/* 2. Work Email */}
                    <td className="cell-email">
                      <span className="admin-email-text">{admin.email}</span>
                    </td>

                    {/* 3. Date Added */}
                    <td className="cell-date">
                      <span className="admin-date-text">{admin.dateAdded}</span>
                    </td>

                    {/* 4. Last Active */}
                    <td className="cell-last-active">
                      <div className="last-active-flex">
                        {admin.lastActive === 'Just now' && (
                          <span className="amber-pulse-dot" />
                        )}
                        <span className={`last-active-text ${admin.lastActive === 'Just now' ? 'now' : ''}`}>
                          {admin.lastActive}
                        </span>
                      </div>
                    </td>

                    {/* 5. Status */}
                    <td className="cell-status">
                      <span className={`clean-status-pill ${admin.status}`}>
                        <span className="status-pill-dot" />
                        {admin.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* 6. Actions */}
                    <td className="cell-actions">
                      {admin.isCurrentUser ? (
                        <span className="current-session-label">Current Session</span>
                      ) : (
                        <div className="action-menu-relative">
                          <button
                            type="button"
                            className="btn-dots-menu"
                            onClick={(e) => toggleActionMenu(admin.id, e)}
                            title="Aksi Akun"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {activeActionMenuId === admin.id && (
                            <div
                              className="action-dropdown-popover"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => {
                                  handleToggleStatus(admin.id);
                                  closeActionMenu();
                                }}
                              >
                                {admin.status === 'active' ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                              </button>
                              <button
                                type="button"
                                className="dropdown-item danger"
                                onClick={() => {
                                  handleDeleteAdmin(admin.id);
                                  closeActionMenu();
                                }}
                              >
                                Hapus Akses Admin
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Table Pagination Footer */}
            <div className="admin-table-footer">
              <span className="footer-meta-count">
                Showing 1–{admins.length} of {totalCount} accounts
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

      {/* Add Admin Modal */}
      {isAddModalOpen && (
        <div className="admin-modal-backdrop" onClick={handleCloseAddModal}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="modal-title-wrap">
                <h3 className="modal-title">+ Add Operational Administrator</h3>
                <p className="modal-sub">Undang staf operasional baru dengan hak akses penuh sesuai protokol RBAC.</p>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={handleCloseAddModal}
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
                <label className="form-label">Email Kerja (@findit.internal) *</label>
                <div className="input-with-icon">
                  <Mail size={15} className="input-icon" />
                  <input
                    type="email"
                    className="form-input"
                    placeholder="maya.p@findit.internal"
                    value={formData.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Peran / Jabatan Operasional *</label>
                <select
                  className="form-select"
                  value={formData.role}
                  onChange={(e) => handleFormChange('role', e.target.value)}
                >
                  <option value="Operations Specialist">Operations Specialist</option>
                  <option value="Intake Supervisor">Intake Supervisor</option>
                  <option value="Match Verification Lead">Match Verification Lead</option>
                  <option value="Auditor & Catalog Lead">Auditor &amp; Catalog Lead</option>
                  <option value="Front Office Supervisor">Front Office Supervisor</option>
                </select>
              </div>

              <div className="security-notice-box">
                <Lock size={16} className="security-lock-icon" />
                <div className="security-notice-text">
                  <span className="notice-bold">MFA &amp; Single Sign-On Enforced</span>
                  <span className="notice-sub">Tautan aktivasi akun dan pendaftaran OTP autentikator akan dikirim otomatis ke email internal.</span>
                </div>
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="btn-cancel-flat"
                  onClick={handleCloseAddModal}
                >
                  Batal
                </button>
                <button type="submit" className="btn-save-amber">
                  Kirim Undangan Akses Admin
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
