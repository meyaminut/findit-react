import React from 'react';
import logoDark from '../../assets/logo-dark.png';
import logoLight from '../../assets/logo-light.png';

/**
 * View Component: Logo (Adaptive Brand Logo)
 * 
 * Rules:
 * - In DARK areas (e.g. dark navy sidebar, dark headers, dark mode):
 *   Uses `variant="light"` which displays the crisp white text and white icon with orange dot.
 * - In LIGHT areas (e.g. white cards, light navbar, modals):
 *   Uses `variant="dark"` which displays the deep navy text and blue icon with orange dot.
 * 
 * @param {'light' | 'dark'} variant - 'light' for dark areas, 'dark' for light areas (default 'dark')
 * @param {'small' | 'medium' | 'large' | number} size - sizing preset or height in px
 * @param {boolean} withSubtitle - renders "HOTEL LOST & FOUND" below the logo
 * @param {boolean} showAdminBadge - optional legacy admin badge
 * @param {string} className - optional additional class
 */
export function Logo({ 
  variant = 'dark', 
  size = 'medium', 
  withSubtitle = false, 
  showAdminBadge = false,
  className = '',
  alt = 'Find!t - Hotel Lost & Found'
}) {
  const selectedSrc = variant === 'light' ? logoLight : logoDark;

  const height = typeof size === 'number' 
    ? size 
    : size === 'large' 
      ? 52 
      : size === 'small' 
        ? 28 
        : 38;

  return (
    <div className={`findit-brand-wrapper ${variant === 'light' ? 'brand-on-dark' : 'brand-on-light'} ${className}`} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <div className="logo-row" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <img 
          src={selectedSrc} 
          alt={alt} 
          className="findit-brand-logo-img"
          style={{ 
            height: `${height}px`, 
            width: 'auto', 
            objectFit: 'contain',
            display: 'block' 
          }} 
        />
        {showAdminBadge && (
          <div className="admin-tag-badge" style={{
            background: '#FEA619',
            color: '#00164E',
            fontSize: '11px',
            fontWeight: 800,
            padding: '2px 7px',
            borderRadius: '4px',
            letterSpacing: '0.5px'
          }}>
            <span>ADMIN</span>
          </div>
        )}
      </div>
      {withSubtitle && (
        <span 
          className="brand-subtitle-text"
          style={{
            fontSize: '8px',
            fontWeight: 700,
            letterSpacing: '1.2px',
            marginTop: '3px',
            color: variant === 'light' ? 'rgba(255, 255, 255, 0.75)' : '#757682',
            textTransform: 'uppercase'
          }}
        >
          HOTEL LOST &amp; FOUND
        </span>
      )}
    </div>
  );
}

export default Logo;

