import React from 'react';
import { Folder, Hourglass, Handshake, ShieldCheck, TrendingUp } from 'lucide-react';

/**
 * View Component: ReportKpiMetrics
 * Displays the 4 metric cards at the top of the All Reports management view
 */
export function ReportKpiMetrics({ metrics }) {
  return (
    <div className="reports-kpi-grid">
      {/* 1. Total Submissions */}
      <div className="report-kpi-card">
        <div className="report-kpi-header">
          <span className="report-kpi-label">{metrics.totalSubmissions.label}</span>
          <div className="report-kpi-icon-box blue">
            <Folder size={18} />
          </div>
        </div>
        <div className="report-kpi-val">{metrics.totalSubmissions.val}</div>
        <div className="report-kpi-subtext positive">
          <TrendingUp size={13} />
          <span>{metrics.totalSubmissions.subtitle}</span>
        </div>
      </div>

      {/* 2. Awaiting Verification */}
      <div className="report-kpi-card">
        <div className="report-kpi-header">
          <span className="report-kpi-label">{metrics.awaitingVerification.label}</span>
          <div className="report-kpi-icon-box gray">
            <Hourglass size={18} />
          </div>
        </div>
        <div className="report-kpi-val">{metrics.awaitingVerification.val}</div>
        <div className="report-kpi-subtext neutral">
          <span className="kpi-subtext-dot gray"></span>
          <span>{metrics.awaitingVerification.subtitle}</span>
        </div>
      </div>

      {/* 3. Matched & Confirmed */}
      <div className="report-kpi-card">
        <div className="report-kpi-header">
          <span className="report-kpi-label">{metrics.matchedConfirmed.label}</span>
          <div className="report-kpi-icon-box orange">
            <Handshake size={18} />
          </div>
        </div>
        <div className="report-kpi-val">{metrics.matchedConfirmed.val}</div>
        <div className="report-kpi-subtext warning">
          <span className="kpi-subtext-dot orange"></span>
          <span>{metrics.matchedConfirmed.subtitle}</span>
        </div>
      </div>

      {/* 4. Resolved & Returned */}
      <div className="report-kpi-card">
        <div className="report-kpi-header">
          <span className="report-kpi-label">{metrics.resolvedReturned.label}</span>
          <div className="report-kpi-icon-box green">
            <ShieldCheck size={18} />
          </div>
        </div>
        <div className="report-kpi-val">{metrics.resolvedReturned.val}</div>
        <div className="report-kpi-subtext success">
          <span className="kpi-subtext-dot blue"></span>
          <span>{metrics.resolvedReturned.subtitle}</span>
        </div>
      </div>
    </div>
  );
}

export default ReportKpiMetrics;
