import React from 'react';
import { User, ShieldCheck, Printer } from 'lucide-react';

export function MatchReviewHeader({ ticket, onProtocolClick }) {
  return (
    <div className="review-top-header">
      <div className="review-header-left">
        <div className="review-meta-row">
          <span className="ticket-id-badge">{ticket?.id || '#TK-2024-0314'}</span>
          <span className="sop-phase-tag">VERIFIKASI LAPANGAN FO</span>
          <span className="status-pill-pending">
            <span className="pill-dot-blue"></span>
            {ticket?.status || 'Menunggu Verifikasi'}
          </span>
        </div>
        <div className="guest-title-row">
          <span className="guest-icon-badge">
            <User size={18} />
          </span>
          <h1 className="guest-main-name">{ticket?.guestName || '-'}</h1>
          <span className="guest-stay-meta">
            ({ticket?.roomNumber || '-'} • {ticket?.reportedAt || '-'})
          </span>
        </div>
      </div>

      <div className="review-header-actions">
        <button 
          type="button" 
          className="sop-protocol-btn"
          onClick={onProtocolClick}
        >
          <ShieldCheck size={16} className="sop-shield-icon" />
          <span>SOP PROTOCOL: FO Double-Blind Check</span>
        </button>
        <button 
          type="button" 
          className="print-action-btn"
          title="Cetak Formulir Verifikasi"
          onClick={() => window.print()}
        >
          <Printer size={16} />
        </button>
      </div>
    </div>
  );
}

export default MatchReviewHeader;
