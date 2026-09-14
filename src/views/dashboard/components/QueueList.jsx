import React from 'react';
import { 
  Smartphone, 
  Wallet, 
  Laptop, 
  Briefcase, 
  Headphones, 
  FileText,
  Eye, 
  ChevronRight, 
  Search,
  ChevronLeft
} from 'lucide-react';

/**
 * View Component: QueueList
 * Displays high-priority triage queue items and candidate match pairings
 */
export function QueueList({
  queueItems,
  activeFilter,
  onFilterChange,
  onOpenReview,
  onDismiss,
  onScanDatabase
}) {
  const getCategoryIcon = (iconType) => {
    switch (iconType) {
      case 'smartphone':
        return <Smartphone size={20} />;
      case 'wallet':
        return <Wallet size={20} />;
      case 'laptop':
        return <Laptop size={20} />;
      case 'luggage':
        return <Briefcase size={20} />;
      case 'headphones':
        return <Headphones size={20} />;
      default:
        return <FileText size={20} />;
    }
  };

  return (
    <div className="queue-container-card">
      {/* Queue Card Header */}
      <div className="queue-card-header">
        <div>
          <div className="queue-title-row">
            <span className="queue-orange-dot"></span>
            <h2 className="queue-title">Reports Needing Attention</h2>
          </div>
          <p className="queue-subtitle">
            High-priority triage queue and candidate pairings
          </p>
        </div>
        <button 
          type="button" 
          className="queue-header-link"
          onClick={() => onFilterChange('pending')}
        >
          <span>Match Review Queue</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="queue-filter-tabs">
        <button
          type="button"
          className={`filter-pill-btn ${activeFilter === 'pending' ? 'active' : ''}`}
          onClick={() => onFilterChange('pending')}
        >
          <span>Pending Matches</span>
          <span className="filter-count-badge">5</span>
        </button>

        <button
          type="button"
          className={`filter-pill-btn ${activeFilter === 'unmatched' ? 'active' : ''}`}
          onClick={() => onFilterChange('unmatched')}
        >
          <span>New Unmatched</span>
          <span className="filter-count-badge gray">8</span>
        </button>

        <button
          type="button"
          className={`filter-pill-btn ${activeFilter === 'flagged' ? 'active' : ''}`}
          onClick={() => onFilterChange('flagged')}
        >
          <span>Flagged / Review</span>
          <span className="filter-count-badge red">2</span>
        </button>
      </div>

      {/* Queue List Items */}
      <div className="queue-items-list">
        {queueItems.length === 0 ? (
          <div className="queue-empty-state">
            <p>No reports currently awaiting triage in this category.</p>
          </div>
        ) : (
          queueItems.map((item) => {
            const isMatch = item.type === 'match';
            return (
              <div key={item.id} className="queue-item-card">
                {/* Left Category Icon */}
                <div className="queue-item-icon-box">
                  {getCategoryIcon(item.icon)}
                </div>

                {/* Center Content */}
                <div className="queue-item-content">
                  {/* Top Metadata Row */}
                  <div className="queue-item-meta-row">
                    <span className="queue-item-id">#{item.id}</span>
                    <span className={`queue-status-tag ${item.tagType}`}>
                      {item.tag}
                    </span>
                    {item.location && (
                      <span className="queue-item-location">{item.location}</span>
                    )}
                    {item.timeAgo && (
                      <span className="queue-item-time">{item.timeAgo}</span>
                    )}
                  </div>

                  {/* Main Title / Comparison */}
                  <div className="queue-item-main-title">
                    {isMatch ? (
                      <div className="pairing-title-wrap">
                        <strong className="lost-title">{item.title}</strong>
                        <span className="pairing-arrow">⇄</span>
                        <span className="found-title">{item.counterpartTitle}</span>
                      </div>
                    ) : (
                      <strong className="report-single-title">{item.title}</strong>
                    )}
                  </div>

                  {/* Optional Description Note for single reports */}
                  {item.description && (
                    <p className="queue-item-desc">{item.description}</p>
                  )}

                  {/* Confidence Bar if Match */}
                  {isMatch && (
                    <div className="queue-confidence-row">
                      <div className="confidence-track">
                        <div 
                          className="confidence-fill" 
                          style={{ width: `${item.confidenceScore}%` }}
                        ></div>
                      </div>
                      <span className="confidence-label">
                        {item.confidenceScore}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Right Action Buttons */}
                <div className="queue-item-actions">
                  {isMatch ? (
                    <>
                      <button
                        type="button"
                        className="btn-action-dismiss"
                        onClick={() => onDismiss(item.id)}
                      >
                        Dismiss
                      </button>
                      <button
                        type="button"
                        className="btn-action-review"
                        onClick={() => onOpenReview(item)}
                      >
                        <Eye size={15} />
                        <span>Review Match</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="btn-action-scan"
                      onClick={() => onScanDatabase(item.id)}
                    >
                      <Search size={14} />
                      <span>Scan Database</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Queue Pagination Footer */}
      <div className="queue-pagination-footer">
        <span className="pagination-info">Showing 5 of 15 pending queue items</span>
        <div className="pagination-nav-controls">
          <button type="button" className="page-nav-btn" disabled>
            <ChevronLeft size={14} />
          </button>
          <span className="page-current-number">1</span>
          <button type="button" className="page-nav-btn" disabled>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default QueueList;
