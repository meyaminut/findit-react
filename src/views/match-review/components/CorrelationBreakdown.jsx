import React from 'react';
import { Cpu } from 'lucide-react';

/**
 * View Component: CorrelationBreakdown
 * Visualizes granular AI similarity telemetry (Location, Time, Features)
 */
export function CorrelationBreakdown({ aiBreakdown }) {
  if (!aiBreakdown) return null;

  const { locationProximity, timeDelta, featureSimilarity } = aiBreakdown;

  return (
    <div className="ai-breakdown-card">
      <div className="breakdown-header">
        <Cpu size={17} className="breakdown-icon" />
        <h3 className="breakdown-title">AI Correlation Breakdown</h3>
      </div>

      <div className="breakdown-cards-grid">
        {/* Metric 1: Location Proximity */}
        <div className="breakdown-item-box">
          <div className="breakdown-row-top">
            <span className="breakdown-metric-name">Location Proximity</span>
            <strong className="breakdown-metric-val">{locationProximity.score}%</strong>
          </div>
          <div className="breakdown-bar-track">
            <div 
              className="breakdown-bar-fill blue" 
              style={{ width: `${locationProximity.score}%` }}
            ></div>
          </div>
          <p className="breakdown-metric-desc">{locationProximity.desc}</p>
        </div>

        {/* Metric 2: Time Delta */}
        <div className="breakdown-item-box">
          <div className="breakdown-row-top">
            <span className="breakdown-metric-name">Time Delta</span>
            <strong className="breakdown-metric-val">{timeDelta.score}%</strong>
          </div>
          <div className="breakdown-bar-track">
            <div 
              className="breakdown-bar-fill blue" 
              style={{ width: `${timeDelta.score}%` }}
            ></div>
          </div>
          <p className="breakdown-metric-desc">{timeDelta.desc}</p>
        </div>

        {/* Metric 3: Feature Similarity */}
        <div className="breakdown-item-box">
          <div className="breakdown-row-top">
            <span className="breakdown-metric-name">Feature Similarity</span>
            <strong className="breakdown-metric-val">{featureSimilarity.score}%</strong>
          </div>
          <div className="breakdown-bar-track">
            <div 
              className="breakdown-bar-fill orange" 
              style={{ width: `${featureSimilarity.score}%` }}
            ></div>
          </div>
          <p className="breakdown-metric-desc">{featureSimilarity.desc}</p>
        </div>
      </div>
    </div>
  );
}

export default CorrelationBreakdown;
