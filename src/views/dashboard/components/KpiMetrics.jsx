import React from 'react';
import { 
  Archive, 
  AlertTriangle, 
  CheckSquare2, 
  CheckCircle2, 
  TrendingUp, 
  Clock 
} from 'lucide-react';

/**
 * View Component: KpiMetrics
 * Renders the 4 top telemetry KPI cards matching the mockup.
 * Card 2 features the prominent yellow alert card for "Tiket Menunggu Verifikasi".
 */
export function KpiMetrics({ metrics }) {
  if (!metrics) return null;

  const { totalFound, pendingVerification, verifiedMonth, resolvedHandover } = metrics;

  return (
    <section className="kpi-metrics-grid">
      {/* 1. Total Barang Temuan */}
      <div className="kpi-metric-card">
        <div className="kpi-card-header">
          <span className="kpi-card-label">{totalFound.label}</span>
          <div className="kpi-icon-badge blue-tint">
            <Archive size={17} />
          </div>
        </div>
        <div className="kpi-value-row">
          <span className="kpi-number">{totalFound.value}</span>
          <span className="kpi-unit">{totalFound.unit}</span>
        </div>
        <div className="kpi-footer-status">
          <span className="kpi-trend-text positive">
            <TrendingUp size={13} className="trend-icon" />
            {totalFound.trendText}
          </span>
        </div>
      </div>

      {/* 2. Tiket Menunggu Verifikasi (Yellow Alert Card) */}
      <div className="kpi-metric-card yellow-alert-card">
        <div className="kpi-card-header">
          <span className="kpi-card-label">{pendingVerification.label}</span>
          <div className="kpi-icon-badge yellow-tint">
            <AlertTriangle size={17} />
          </div>
        </div>
        <div className="kpi-value-row">
          <span className="kpi-number">{pendingVerification.value}</span>
          <span className="kpi-unit">{pendingVerification.unit}</span>
          <span className="kpi-action-pill-orange">
            {pendingVerification.badge}
          </span>
        </div>
        <div className="kpi-footer-status">
          <span className="kpi-alert-clock-text">
            <Clock size={13} className="alert-clock-icon" />
            {pendingVerification.alertText}
          </span>
        </div>
      </div>

      {/* 3. Terverifikasi Bulan Ini */}
      <div className="kpi-metric-card">
        <div className="kpi-card-header">
          <span className="kpi-card-label">{verifiedMonth.label}</span>
          <div className="kpi-icon-badge light-blue-tint">
            <CheckSquare2 size={17} />
          </div>
        </div>
        <div className="kpi-value-row">
          <span className="kpi-number">{verifiedMonth.value}</span>
          <span className="kpi-unit">{verifiedMonth.unit}</span>
        </div>
        <div className="kpi-footer-status">
          <span className="kpi-status-dot-pill">
            <span className="status-dot-brown"></span>
            {verifiedMonth.statusText}
          </span>
        </div>
      </div>

      {/* 4. Resolved / Selesai Handover */}
      <div className="kpi-metric-card">
        <div className="kpi-card-header">
          <span className="kpi-card-label">{resolvedHandover.label}</span>
          <div className="kpi-icon-badge green-tint">
            <CheckCircle2 size={17} />
          </div>
        </div>
        <div className="kpi-value-row">
          <span className="kpi-number">{resolvedHandover.value}</span>
          <span className="kpi-unit">{resolvedHandover.unit}</span>
        </div>
        <div className="kpi-footer-status row-flex">
          <span className="kpi-success-rate-pill">
            ✓ {resolvedHandover.successRate}
          </span>
          <span className="kpi-target-text">{resolvedHandover.targetText}</span>
        </div>
      </div>
    </section>
  );
}

export default KpiMetrics;
