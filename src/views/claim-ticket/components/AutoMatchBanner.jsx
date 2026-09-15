import React from 'react';
import { Sparkles, Layers } from 'lucide-react';

/**
 * View Component: AutoMatchBanner
 * Banner showing immediate AI correlation match candidate detected in hotel storage.
 */
export function AutoMatchBanner({ candidate, onPreviewMatch }) {
  if (!candidate) return null;

  return (
    <div className="auto-match-intelligence-banner">
      <div className="match-banner-left">
        <div className="match-sparkle-badge">
          <Sparkles size={18} className="sparkle-icon" />
        </div>

        <div className="match-banner-content">
          <div className="match-title-row">
            <h4 className="match-banner-title">Auto-Match Intelligence Ready</h4>
            <span className="candidate-count-pill">
              {candidate.candidateCount} Calon Cocok di Storage
            </span>
          </div>
          <p className="match-banner-desc">
            Sistem menemukan {candidate.candidateCount} {candidate.itemTitle} di {candidate.storageLocker} yang dicatat pagi ini pukul {candidate.discoveredAt} oleh {candidate.reportedBy}.
          </p>
        </div>
      </div>

      <div className="match-banner-action">
        <button
          type="button"
          className="btn-preview-match-soft"
          onClick={onPreviewMatch}
        >
          <Layers size={15} />
          <span>Pratinjau Temuan Cocok</span>
        </button>
      </div>
    </div>
  );
}

export default AutoMatchBanner;
