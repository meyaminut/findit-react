import React from 'react';
import { 
  FileText, 
  Zap, 
  ShieldCheck, 
  Truck, 
  TrendingUp, 
  AlertTriangle 
} from 'lucide-react';

/**
 * View Component: KpiMetrics
 * Renders the 4 operational metric cards at the top of the dashboard
 */
export function KpiMetrics({ metrics }) {
  return (
    <div className="kpi-metrics-grid">
      {/* 1. Total Reports */}
      <div className="kpi-card">
        <div className="kpi-card-header">
          <span className="kpi-label">TOTAL REPORTS</span>
          <div className="kpi-icon-wrap blue">
            <FileText size={18} />
          </div>
        </div>
        <div className="kpi-main-val">{metrics.totalReports.value}</div>
        <div className="kpi-subtitle">{metrics.totalReports.subtitle}</div>
        <div className="kpi-badge-wrap">
          <span className="kpi-badge-pill blue">
            <TrendingUp size={13} />
            <span>{metrics.totalReports.changeText}</span>
          </span>
        </div>
      </div>

      {/* 2. Pending Matches (Action Required - Orange Highlight) */}
      <div className="kpi-card critical-attention">
        <div className="kpi-card-header">
          <span className="kpi-label">PENDING MATCHES</span>
          <div className="kpi-icon-wrap orange">
            <Zap size={18} />
          </div>
        </div>
        <div className="kpi-val-row">
          <span className="kpi-main-val">{metrics.pendingMatches.value}</span>
          <span className="kpi-action-tag">Action Required</span>
        </div>
        <div className="kpi-subtitle">{metrics.pendingMatches.subtitle}</div>
        <div className="kpi-escalation-alert">
          <AlertTriangle size={14} />
          <span>{metrics.pendingMatches.escalationText}</span>
        </div>
      </div>

      {/* 3. Confirmed This Month */}
      <div className="kpi-card">
        <div className="kpi-card-header">
          <span className="kpi-label">CONFIRMED THIS MONTH</span>
          <div className="kpi-icon-wrap blue">
            <ShieldCheck size={18} />
          </div>
        </div>
        <div className="kpi-main-val">{metrics.confirmedMonth.value}</div>
        <div className="kpi-subtitle">{metrics.confirmedMonth.subtitle}</div>
        <div className="kpi-badge-wrap">
          <span className="kpi-badge-pill blue">
            <TrendingUp size={13} />
            <span>{metrics.confirmedMonth.changeText}</span>
          </span>
        </div>
      </div>

      {/* 4. Returned To Owners */}
      <div className="kpi-card">
        <div className="kpi-card-header">
          <span className="kpi-label">RETURNED TO OWNERS</span>
          <div className="kpi-icon-wrap blue">
            <Truck size={18} />
          </div>
        </div>
        <div className="kpi-main-val">{metrics.returnedOwners.value}</div>
        <div className="kpi-subtitle">{metrics.returnedOwners.subtitle}</div>
        <div className="kpi-badge-wrap">
          <span className="kpi-badge-pill gray">
            <span>{metrics.returnedOwners.efficiencyText}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default KpiMetrics;
