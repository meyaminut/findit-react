import React from 'react';
import { 
  LayoutDashboard, 
  Ticket, 
  Package, 
  FilePlus2, 
  CheckCircle2, 
  ClipboardCheck, 
  MessageSquareHeart, 
  LogOut,
  Building2,
  Users
} from 'lucide-react';
import Logo from '../../components/Logo';

/**
 * View Component: Sidebar
 * Renders the Grand Melia Operations navigation sidebar in FindIt's signature deep navy palette.
 * Automatically utilizes the light logo variant because the sidebar is a dark container.
 */
export function Sidebar({ activeNav = 'Dashboard', onNavChange, onLogout }) {
  const menuItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Tiket Klaim', label: 'Tiket Klaim', icon: Ticket },
    { id: 'Barang Temuan', label: 'Barang Temuan', icon: Package },
    { id: 'Buat Laporan Tamu', label: 'Buat Laporan Tamu', icon: FilePlus2 },
    { id: 'Verifikasi & Pencocokan', label: 'Verifikasi & Pencocokan', icon: CheckCircle2 },
    { id: 'Handover', label: 'Handover', icon: ClipboardCheck },
    { id: 'Survei Pasca-Checkout', label: 'Survei Pasca-Checkout', icon: MessageSquareHeart },
  ];

  return (
    <aside className="dashboard-sidebar-royal">
      {/* 1. Brand Logo Header (Adaptive Light Logo on Dark Navy Area) */}
      <div className="sidebar-brand-top">
        <div className="sidebar-brand-row">
          <Logo variant="light" withSubtitle={true} size={36} />
        </div>

        {/* Branch Location Card */}
        <div className="branch-location-card">
          <div className="branch-icon-box">
            <Building2 size={16} className="branch-icon" />
          </div>
          <div className="branch-info">
            <span className="branch-label">BRANCH LOCATION</span>
            <span className="branch-name">Grand Melia Jakarta</span>
          </div>
        </div>
      </div>

      {/* 2. Menu Navigation */}
      <nav className="sidebar-menu-list">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => onNavChange && onNavChange(item.id)}
            >
              <span className="nav-btn-icon">
                <Icon size={18} />
              </span>
              <span className="nav-btn-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 3. Bottom Logout Area */}
      <div className="sidebar-bottom-area">
        <button 
          type="button" 
          className="sidebar-logout-link"
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
