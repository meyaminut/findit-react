import React from 'react';
import { X, MapPin, Calendar, User, Tag, CheckCircle2 } from 'lucide-react';

/**
 * View Component: ReportDetailModal
 * Quick inspection modal for viewing full report metadata from database `reports`
 */
export function ReportDetailModal({ report, onClose }) {
  if (!report) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container report-modal-detail" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="modal-header">
          <div className="modal-tag-row">
            <span className={`report-type-pill ${report.type}`}>
              {report.type.toUpperCase()}
            </span>
            <span className={`report-status-pill ${report.status}`}>
              {report.statusLabel}
            </span>
          </div>
          <h3>{report.title}</h3>
          <p>Reference Identifier: <strong>#{report.id}</strong></p>
        </div>

        <div className="modal-detail-photo">
          <img src={report.image} alt={report.title} />
        </div>

        <div className="modal-spec-grid">
          <div className="modal-spec-item">
            <span className="spec-label">Category</span>
            <strong className="spec-val">{report.category}</strong>
          </div>

          <div className="modal-spec-item">
            <span className="spec-label">Location</span>
            <span className="spec-val">{report.location}</span>
          </div>

          <div className="modal-spec-item">
            <span className="spec-label">Timestamp</span>
            <span className="spec-val">{report.timestamp}</span>
          </div>

          <div className="modal-spec-item">
            <span className="spec-label">Reporter</span>
            <span className="spec-val">{report.reporter.name} ({report.reporter.badge})</span>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportDetailModal;
