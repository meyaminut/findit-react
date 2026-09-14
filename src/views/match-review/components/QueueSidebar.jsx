import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';

/**
 * View Component: QueueSidebar
 * Displays candidate pairing queue list on the left side of the Match Review workspace
 */
export function QueueSidebar({ candidates, selectedId, onSelectCandidate }) {
  return (
    <div className="review-queue-panel">
      {/* Queue Header */}
      <div className="review-queue-header">
        <div className="queue-title-badge-wrap">
          <h3 className="review-queue-title">Review Queue</h3>
          <span className="priority-count-pill">
            {candidates.length} pending priority
          </span>
        </div>
        <span className="sort-order-hint">Sorted by: Confidence Score</span>
      </div>

      {/* Candidate Cards List */}
      <div className="candidate-cards-scroll">
        {candidates.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <div
              key={item.id}
              className={`candidate-queue-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectCandidate(item.id)}
            >
              {/* Card Meta Row */}
              <div className="candidate-card-top-row">
                <div className="candidate-id-wrap">
                  <strong className="candidate-id-text">#{item.id}</strong>
                  <span className={`confidence-tag-pill ${item.tagType}`}>
                    {item.tag}
                  </span>
                </div>
                <span className="candidate-time-ago">{item.timeAgo}</span>
              </div>

              {/* Items Pairing Snippet */}
              <div className="candidate-paired-preview-grid">
                <div className="paired-side-snippet">
                  <span className="snippet-type-label">LOST ITEM</span>
                  <span className="snippet-item-name">{item.lostReport.title}</span>
                  <span className="snippet-location">{item.lostReport.location}</span>
                </div>

                <div className="paired-side-snippet">
                  <span className="snippet-type-label">FOUND ITEM</span>
                  <span className="snippet-item-name">{item.foundReport.title}</span>
                  <span className="snippet-location">{item.foundReport.location}</span>
                </div>
              </div>

              {/* Confidence Match Bar */}
              <div className="candidate-card-footer">
                <span className="confidence-match-label">Confidence Match</span>
                <div className="confidence-score-row">
                  <div className="card-confidence-track">
                    <div 
                      className="card-confidence-fill" 
                      style={{ width: `${item.confidenceScore}%` }}
                    ></div>
                  </div>
                  <strong className="card-confidence-val">
                    {item.confidenceScore}%
                  </strong>
                  <span className="card-selection-arrow">
                    {isSelected ? <ArrowRight size={15} /> : <ChevronRight size={15} />}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default QueueSidebar;
