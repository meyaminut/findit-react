import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

/**
 * View Component: TopNavbar
 * Global header navigation containing contextual search, alerts, and admin identity
 */
export function TopNavbar({ searchQuery, onSearchChange }) {
  return (
    <header className="dashboard-top-navbar">
      {/* Search Bar */}
      <div className="navbar-search-wrapper">
        <span className="search-icon-left">
          <Search size={17} />
        </span>
        <input
          type="text"
          className="navbar-search-input"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Press / or search reports, items, ID..."
        />
        <div className="search-notification-icon-wrap">
          <Bell size={18} />
          <span className="search-alert-count">3</span>
        </div>
      </div>

      {/* User Profile Info */}
      <div className="navbar-user-profile">
        <div className="user-avatar-container">
          <img 
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80" 
            alt="Sarah Jenkins"
            className="user-profile-img"
          />
        </div>
        <div className="user-profile-details">
          <span className="user-profile-name">Sarah Jenkins</span>
          <span className="user-profile-role">Senior Operations Admin</span>
        </div>
        <span className="user-profile-chevron">
          <ChevronDown size={16} />
        </span>
      </div>
    </header>
  );
}

export default TopNavbar;
