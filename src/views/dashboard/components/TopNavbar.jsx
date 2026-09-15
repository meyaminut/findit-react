import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

/**
 * View Component: TopNavbar
 * Renders the top search and user profile bar.
 */
export function TopNavbar({ 
  searchQuery = '', 
  onSearchChange,
  onProfileClick,
  userName = 'Admin',
  userRole = 'Operations Admin',
  userAvatar = '',
  notificationCount = 0
}) {
  return (
    <header className="dashboard-top-navbar">
      {/* Search Input Bar */}
      <div className="top-search-wrapper">
        <Search size={16} className="search-icon-muted" />
        <input
          type="text"
          className="top-search-input"
          placeholder="Press / or search reports, items, ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
        />
      </div>

      {/* Right Controls */}
      <div className="top-right-controls">
        {/* Notification Bell with Amber Badge */}
        <div className="notification-bell-btn" title={`${notificationCount} Notifikasi Baru`}>
          <Bell size={18} className="bell-icon" />
          <span className="bell-badge-yellow">{notificationCount}</span>
        </div>

        {/* User Profile */}
        <div 
          className="user-profile-badge" 
          onClick={onProfileClick}
          style={{ cursor: onProfileClick ? 'pointer' : 'default' }}
          title="Kelola Profil & Administrator"
        >
          <div className="user-avatar-wrap">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="user-profile-img"
              />
            ) : (
              <div className="user-profile-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#00164E', color: '#fff', fontSize: '13px', fontWeight: 600 }}>
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="user-profile-text">
            <span className="user-full-name">{userName}</span>
            <span className="user-job-role">{userRole}</span>
          </div>
          <ChevronDown size={14} style={{ color: '#94A3B8', marginLeft: '4px' }} />
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;

