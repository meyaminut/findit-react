import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  FileText, 
  Users, 
  LogOut 
} from 'lucide-react';
import finditLogo from '../../../assets/findit-logo.png';

/**
 * View Component: Sidebar
 * Renders the primary navigation sidebar for the admin portal.
 * NOTE: As requested by the user, the text "Find!t Admin" has been removed, 
 * showing purely the official Find!t brand logo in the navigation header.
 */
export function Sidebar({ activeNav, onNavChange, onLogout }) {
  const menuItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Match Review', label: 'Match Review', icon: Layers, badge: 3 },
    { id: 'All Reports', label: 'All Reports', icon: FileText },
    { id: 'Manage Admins', label: 'Manage Admins', icon: Users },
  ];

  return (
    <aside className="dashboard-sidebar">
      {/* Sidebar Header: Official Logo ONLY (No "Find!t Admin" text) */}
      <div className="sidebar-logo-container">
        <div className="sidebar-logo-wrap">
          <img 
            src={finditLogo} 
            alt="Find!t" 
            className="sidebar-findit-logo" 
          />
        </div>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onNavChange(item.id)}
            >
              <span className="nav-icon">
                <Icon size={19} />
              </span>
              <span className="nav-label">{item.label}</span>
              {item.badge && (
                <span className="nav-counter-badge">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer / Logout */}
      <div className="sidebar-footer">
        <button 
          type="button" 
          className="sidebar-logout-btn"
          onClick={onLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
