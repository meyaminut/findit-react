import React from 'react';
import { Database, FileText, GitCompare, Users, LogOut, CheckCircle, Clock } from 'lucide-react';
import Logo from '../components/Logo';

/**
 * View Component: OperationalDashboardView
 * Displays the authenticated operational console state
 */
export function OperationalDashboardView({ user, onLogout }) {
  return (
    <div className="active-session-card">
      <div className="session-header">
        <div className="session-user-badge">
          <div className="user-avatar">
            {user?.name?.slice(0, 2).toUpperCase() || 'AD'}
          </div>
          <div className="user-meta">
            <h4>{user?.name || 'FindIt Operations Lead'}</h4>
            <span>{user?.email || 'admin@findit.internal'}</span>
          </div>
        </div>
        <span className="role-pill-admin">ROLE: {user?.role || 'admin'}</span>
      </div>

      <div className="session-db-info">
        <Database size={17} />
        <span>Connected Database: <strong>u278523899_findit</strong></span>
      </div>

      <div className="session-stats-grid">
        <div className="stat-box">
          <div className="stat-label">Lost Reports</div>
          <div className="stat-val">28 Active</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Found Reports</div>
          <div className="stat-val">19 Active</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Pending Matches</div>
          <div className="stat-val">7 Verifications</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Registered Users</div>
          <div className="stat-val">142 Users</div>
        </div>
      </div>

      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', lineHeight: '1.5' }}>
        ✓ Authenticated via MVC architecture. Operational session ready for next UI module.
      </p>

      <button type="button" className="signout-btn" onClick={onLogout}>
        <LogOut size={16} />
        <span>Sign Out / Return to Login View</span>
      </button>
    </div>
  );
}

export default OperationalDashboardView;
