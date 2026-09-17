import React from 'react';
import { Camera, PhoneCall, CheckCheck, ShieldCheck } from 'lucide-react';

/**
 * View Component: LiveActivityWidget
 * Renders the real-time operational activity log feed on the dashboard.
 */
export function LiveActivityWidget({ activities }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'camera':
        return (
          <div className="activity-icon-badge blue-badge">
            <Camera size={14} />
          </div>
        );
      case 'phone':
        return (
          <div className="activity-icon-badge yellow-badge">
            <PhoneCall size={14} />
          </div>
        );
      case 'handover':
        return (
          <div className="activity-icon-badge green-badge">
            <CheckCheck size={14} />
          </div>
        );
      case 'safe':
        return (
          <div className="activity-icon-badge purple-badge">
            <ShieldCheck size={14} />
          </div>
        );
      default:
        return (
          <div className="activity-icon-badge blue-badge">
            <Camera size={14} />
          </div>
        );
    }
  };

  return (
    <div className="dashboard-widget-card live-activity-card">
      {/* Header */}
      <div className="widget-header-row">
        <div className="widget-title-group">
          <span className="live-pulse-dot"></span>
          <h3 className="widget-title-text">Aktivitas Terbaru</h3>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="activity-feed-list">
        {activities.map((item) => (
          <div key={item.id} className="activity-feed-item">
            <div className="activity-icon-col">
              {getActivityIcon(item.type)}
            </div>
            <div className="activity-details-col">
              <p className="activity-description-text">{item.text}</p>
              <span className="activity-timestamp">{item.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Button */}
      <div className="widget-footer-action">
        <button type="button" className="full-width-soft-btn">
          Lihat Log Aktivitas Lengkap
        </button>
      </div>
    </div>
  );
}

export default LiveActivityWidget;
