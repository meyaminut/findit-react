import React from 'react';
import { Flag, X, Check } from 'lucide-react';

/**
 * View Component: MatchActionBar
 * Footer action toolbar allowing operational operators to flag, reject, or confirm pairing
 */
export function MatchActionBar({ onFlag, onReject, onConfirm, isLoading }) {
  return (
    <div className="match-action-toolbar">
      {/* Flag Inspection Link */}
      <button
        type="button"
        className="btn-flag-inspection"
        onClick={onFlag}
        disabled={isLoading}
      >
        <Flag size={15} />
        <span>Flag for Further Inspection</span>
      </button>

      {/* Primary Decision Group */}
      <div className="decision-buttons-group">
        <button
          type="button"
          className="btn-reject-pairing"
          onClick={onReject}
          disabled={isLoading}
        >
          <X size={16} />
          <span>Reject Match</span>
        </button>

        <button
          type="button"
          className="btn-confirm-pairing"
          onClick={onConfirm}
          disabled={isLoading}
        >
          <Check size={16} />
          <span>{isLoading ? 'Verifying...' : 'Confirm Match'}</span>
        </button>
      </div>
    </div>
  );
}

export default MatchActionBar;
