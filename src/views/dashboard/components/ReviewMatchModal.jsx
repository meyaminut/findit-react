import React from 'react';
import { X, CheckCircle, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

/**
 * View Component: ReviewMatchModal
 * Modal to inspect pairing candidates and approve or reject custody matches
 */
export function ReviewMatchModal({ match, onClose, onApprove, onReject, isLoading }) {
  if (!match) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container review-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="modal-header">
          <div className="modal-badge-row">
            <span className="modal-match-id">Match #{match.id}</span>
            <span className="modal-confidence-pill">
              {match.confidenceScore}% AI Confidence Score
            </span>
          </div>
          <h3>Verify Lost & Found Pairing</h3>
          <p>Carefully compare item descriptors before approving contact exchange.</p>
        </div>

        {/* Side by side comparison */}
        <div className="pairing-comparison-grid">
          {/* Lost Report Side */}
          <div className="compare-card lost">
            <div className="compare-card-tag lost">LOST ITEM REPORT</div>
            <h4>{match.title}</h4>
            <div className="compare-meta-item">
              <span className="meta-k">Report ID:</span>
              <span className="meta-v">#{match.lostReportId}</span>
            </div>
            <div className="compare-meta-item">
              <span className="meta-k">Reported By:</span>
              <span className="meta-v">{match.owner || 'Owner'}</span>
            </div>
            <div className="compare-meta-item">
              <span className="meta-k">Location:</span>
              <span className="meta-v">{match.location}</span>
            </div>
            <div className="compare-meta-item">
              <span className="meta-k">Category:</span>
              <span className="meta-v">{match.category}</span>
            </div>
          </div>

          <div className="compare-arrow-divider">
            <ArrowRight size={20} />
          </div>

          {/* Found Report Side */}
          <div className="compare-card found">
            <div className="compare-card-tag found">FOUND ITEM REPORT</div>
            <h4>{match.counterpartTitle}</h4>
            <div className="compare-meta-item">
              <span className="meta-k">Report ID:</span>
              <span className="meta-v">#{match.foundReportId}</span>
            </div>
            <div className="compare-meta-item">
              <span className="meta-k">Reported By:</span>
              <span className="meta-v">{match.finder || 'Finder / Staff'}</span>
            </div>
            <div className="compare-meta-item">
              <span className="meta-k">Location:</span>
              <span className="meta-v">{match.location}</span>
            </div>
            <div className="compare-meta-item">
              <span className="meta-k">Status:</span>
              <span className="meta-v">Secure Storage</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="review-modal-actions">
          <button
            type="button"
            className="btn-reject-match"
            disabled={isLoading}
            onClick={() => onReject(match.id)}
          >
            <AlertCircle size={16} />
            <span>Reject Pairing</span>
          </button>

          <button
            type="button"
            className="btn-approve-match"
            disabled={isLoading}
            onClick={() => onApprove(match.id)}
          >
            <CheckCircle size={16} />
            <span>{isLoading ? 'Verifying...' : 'Approve Match & Share Contact'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewMatchModal;
