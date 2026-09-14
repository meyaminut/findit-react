import React from 'react';
import finditLogo from '../../assets/findit-logo.png';

/**
 * View Component: Logo
 * Renders the official Find!t brand logo with optional admin indicator
 */
export function Logo({ showAdminBadge = true, size = 'medium' }) {
  const height = size === 'large' ? 56 : size === 'small' ? 32 : 44;

  return (
    <div className="logo-row">
      <img 
        src={finditLogo} 
        alt="Find!t Logo" 
        className="findit-brand-logo"
        style={{ height: `${height}px`, width: 'auto', objectFit: 'contain' }} 
      />
      {showAdminBadge && (
        <div className="admin-tag-badge">
          <span className="admin-tag-exclamation">!</span>
          <span>ADMIN</span>
        </div>
      )}
    </div>
  );
}

export default Logo;
