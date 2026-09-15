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
  userName = 'Sarah Jenkins',
  userRole = 'Senior Operations Admin',
  userAvatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
  notificationCount = 3
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
            <img
              src={userAvatar}
              alt={userName}
              className="user-profile-img"
            />
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

