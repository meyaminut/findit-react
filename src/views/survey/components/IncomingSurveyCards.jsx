import React from 'react';
import { ArrowRight, Search, Sparkles } from 'lucide-react';

/**
 * View Component: IncomingSurveyCards
 * Incoming responses from guests indicating lost items.
 */
export function IncomingSurveyCards({ responses, onReviewMatch }) {
  if (!responses || !responses.length) return null;

  return (
    <section className="incoming-responses-section">
      <div className="section-header-row">
        <div className="section-title-wrap">
          <span className="red-live-dot"></span>
          <h2 className="section-title">Tiket Masuk dari Respons Tamu</h2>
          <span className="pending-badge-pill">
            {responses.length} Respons Menunggu Tindak Lanjut
          </span>
        </div>
      </div>

      <div className="response-cards-grid">
        {responses.map((resp) => (
          <div key={resp.id} className="survey-response-card">
            <div className="response-card-top">
              <div className="guest-room-badge-wrap">
                <span className={`room-number-square ${resp.roomBadgeClass}`}>
                  {resp.roomNumber}
                </span>
                <div className="guest-name-col">
                  <h3 className="guest-name-bold">{resp.guestName}</h3>
                  <span className="guest-room-type">Kamar {resp.roomNumber} • {resp.roomType}</span>
                </div>
              </div>
              <span className={`status-pill ${resp.statusBadgeClass}`}>
                {resp.statusBadge}
              </span>
            </div>

            <div className="guest-statement-box">
              <div className="statement-header">
                <span className="statement-tag">PERNYATAAN TAMU</span>
                <span className="statement-timestamp">{resp.timestamp}</span>
              </div>
              <p className="statement-quote">&ldquo;{resp.statement}&rdquo;</p>
            </div>

            <div className={`hk-match-callout ${resp.matchType}`}>
              <Sparkles size={14} className="match-icon-sparkle" />
              <span className="match-callout-text">{resp.matchCallout}</span>
            </div>

            <div className="response-card-footer">
              <span className="source-meta-text">Sumber: {resp.source}</span>
              <button 
                type="button" 
                className="btn-action-match btn-gold"
                onClick={() => onReviewMatch(resp)}
              >
                <span>{resp.actionLabel || 'Verifikasi Sekarang →'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default IncomingSurveyCards;
