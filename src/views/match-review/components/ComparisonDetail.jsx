import React from 'react';
import { ArrowLeftRight, MapPin, Calendar, User, Shield, Info } from 'lucide-react';

/**
 * View Component: ComparisonDetail
 * Displays the comprehensive side-by-side visual and attribute comparison
 * between the Lost Item Report and Found Item Custody Record
 */
export function ComparisonDetail({ candidate }) {
  if (!candidate) {
    return (
      <div className="comparison-empty-panel">
        <p>No candidate selected for review.</p>
      </div>
    );
  }

  const { lostReport, foundReport } = candidate;

  return (
    <div className="comparison-detail-container">
      {/* Detail Header */}
      <div className="comparison-detail-header">
        <div className="detail-title-col">
          <div className="detail-icon-title-row">
            <div className="detail-header-icon-box">
              <ArrowLeftRight size={18} />
            </div>
            <div>
              <h2 className="detail-main-title">
                Candidate #{candidate.id} Comparison
              </h2>
              <p className="detail-subtitle">
                Cross-referencing telemetry, metadata, and visual attributes
              </p>
            </div>
          </div>
        </div>

        <div className="detail-confidence-pill-navy">
          <span className="confidence-pill-dot-orange"></span>
          <span>{candidate.confidenceScore}% Confidence</span>
        </div>
      </div>

      {/* Side by Side Comparative Panels */}
      <div className="side-by-side-grid">
        {/* Left Side: Lost Report (Owner) */}
        <div className="report-spec-card lost-panel">
          <div className="spec-card-header">
            <span className="report-id-heading blue">
              LOST REPORT #{lostReport.id}
            </span>
            <span className="report-source-tag">Owner Report</span>
          </div>

          {/* Photo Box */}
          <div className="spec-photo-wrapper">
            <img 
              src={lostReport.image} 
              alt={lostReport.title} 
              className="spec-item-image"
            />
            <span className="photo-corner-badge">{lostReport.imageTag}</span>
          </div>

          {/* Attributes List */}
          <div className="spec-attributes-list">
            <div className="spec-attr-group">
              <span className="attr-key">Item Name</span>
              <strong className="attr-val-title">{lostReport.title}</strong>
            </div>

            <div className="spec-attr-group">
              <span className="attr-key">Category</span>
              <span className="attr-val-text">{lostReport.category}</span>
            </div>

            <div className="spec-attr-group">
              <span className="attr-key">Color &amp; Finish</span>
              <span className="attr-val-text">{lostReport.colorFinish}</span>
            </div>

            <div className="spec-attr-group">
              <span className="attr-key">Reported Location</span>
              <div className="location-pin-val">
                <MapPin size={14} className="pin-icon" />
                <span>{lostReport.location}</span>
              </div>
            </div>

            <div className="spec-attr-group">
              <span className="attr-key">Date &amp; Time Lost</span>
              <span className="attr-val-text">{lostReport.dateTime}</span>
            </div>

            {/* Distinguishing Markings Box */}
            <div className="distinguishing-markings-box">
              <span className="markings-label">Distinguishing Markings</span>
              <p className="markings-text">{lostReport.distinguishingMarkings}</p>
            </div>

            {/* Reporter Contact Info */}
            <div className="contact-details-box">
              <span className="contact-label">Reporter Contact</span>
              <span className="contact-val">
                {lostReport.contactName} ({lostReport.contactEmail})
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Found Report (Staff Custody) */}
        <div className="report-spec-card found-panel">
          <div className="spec-card-header">
            <span className="report-id-heading orange">
              FOUND REPORT #{foundReport.id}
            </span>
            <span className="report-source-tag">Staff Custody</span>
          </div>

          {/* Photo Box */}
          <div className="spec-photo-wrapper">
            <img 
              src={foundReport.image} 
              alt={foundReport.title} 
              className="spec-item-image"
            />
            <span className="photo-corner-badge custody">{foundReport.imageTag}</span>
          </div>

          {/* Attributes List */}
          <div className="spec-attributes-list">
            <div className="spec-attr-group">
              <span className="attr-key">Item Name</span>
              <strong className="attr-val-title">{foundReport.title}</strong>
            </div>

            <div className="spec-attr-group">
              <span className="attr-key">Category</span>
              <span className="attr-val-text">{foundReport.category}</span>
            </div>

            <div className="spec-attr-group">
              <span className="attr-key">Color &amp; Finish</span>
              <span className="attr-val-text">{foundReport.colorFinish}</span>
            </div>

            <div className="spec-attr-group">
              <span className="attr-key">Found Location</span>
              <div className="location-pin-val">
                <MapPin size={14} className="pin-icon" />
                <span>{foundReport.location}</span>
              </div>
            </div>

            <div className="spec-attr-group">
              <span className="attr-key">Date &amp; Time Found</span>
              <span className="attr-val-text">{foundReport.dateTime}</span>
            </div>

            {/* Distinguishing Markings Box */}
            <div className="distinguishing-markings-box">
              <span className="markings-label">Distinguishing Markings</span>
              <p className="markings-text">{foundReport.distinguishingMarkings}</p>
            </div>

            {/* Finder Staff Info */}
            <div className="contact-details-box">
              <span className="contact-label">Finder Information</span>
              <span className="contact-val">{foundReport.finderInfo}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComparisonDetail;
