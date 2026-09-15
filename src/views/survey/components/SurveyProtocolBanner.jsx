import React from 'react';
import { Mail } from 'lucide-react';

/**
 * View Component: SurveyProtocolBanner
 * Clean protocol banner with 4px solid navy left border.
 */
export function SurveyProtocolBanner({ impactPercentage = '+64%' }) {
  return (
    <div className="proaktif-hero-banner">
      <div className="proaktif-left-group">
        <div className="proaktif-icon-circle">
          <Mail size={18} />
        </div>
        <div className="proaktif-text-group">
          <div className="proaktif-badge-pill">
            <span className="badge-tag-amber">SOP CHECKOUT</span>
            <span>Konfirmasi Barang Tertinggal Tamu</span>
          </div>
          <h1 className="proaktif-title">
            Survei Pasca-Checkout &amp; Deteksi Cepat
          </h1>
          <p className="proaktif-subtitle">
            Kirim pengingat barang tertinggal ke tamu yang baru check-out sebelum tamu meninggalkan area bandara atau kota.
          </p>
        </div>
      </div>

      <div className="proaktif-stats-card">
        <div className="stats-metric-header">
          <span className="impact-label">TINGKAT PENGEMBALIAN</span>
          <span className="impact-percentage">{impactPercentage}</span>
        </div>
        <p className="impact-desc">
          Meningkat signifikan dengan konfirmasi 1-2 jam pasca checkout.
        </p>
        <div className="impact-progress-track">
          <div className="impact-progress-bar" style={{ width: '64%' }} />
        </div>
      </div>
    </div>
  );
}

export default SurveyProtocolBanner;
