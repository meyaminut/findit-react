import React from 'react';

/**
 * View Component: TrendChartWidget
 * Visualizes Intake & Recovery trends over the last 30 operational days
 */
export function TrendChartWidget() {
  return (
    <div className="widget-card">
      <div className="widget-card-header">
        <div>
          <h3 className="widget-title">Intake & Recovery Trends</h3>
          <p className="widget-subtitle">Last 30 operational days</p>
        </div>
        <span className="logs-count-badge">342 logs</span>
      </div>

      {/* SVG Curve Chart */}
      <div className="trend-chart-container">
        <svg 
          className="trend-svg" 
          viewBox="0 0 320 110" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Dotted Guide Line */}
          <line 
            x1="0" 
            y1="50" 
            x2="320" 
            y2="50" 
            stroke="#e2e8f0" 
            strokeDasharray="4 4" 
            strokeWidth="1" 
          />

          {/* Curve 1: Lost Reports (Navy Blue) */}
          <path
            d="M 5 80 C 40 45, 75 48, 110 65 C 145 82, 175 70, 200 45 C 235 15, 275 10, 315 50"
            stroke="#1E3A8A"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Curve 2: Recovered / Handoffs (Orange) */}
          <path
            d="M 5 95 C 40 85, 80 65, 120 72 C 160 80, 185 88, 220 62 C 255 35, 280 40, 315 68"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Data Points on Orange line */}
          <circle cx="240" cy="50" r="4" fill="#F59E0B" stroke="#ffffff" strokeWidth="2" />
          <circle cx="315" cy="68" r="4" fill="#F59E0B" stroke="#ffffff" strokeWidth="2" />
        </svg>
      </div>

      {/* Chart Legend */}
      <div className="trend-legend-row">
        <div className="legend-item">
          <span className="legend-dot blue"></span>
          <span>Lost Reports</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot orange"></span>
          <span>Recovered (Handoffs)</span>
        </div>
      </div>
    </div>
  );
}

export default TrendChartWidget;
