import React from 'react';
import { Cpu, Layers, Users, PlusCircle, Download, Command } from 'lucide-react';

/**
 * View Component: DiagnosticWidget
 * Renders operational system health diagnostics and dispatch action shortcuts
 */
export function DiagnosticWidget({ diagnostics, onCreateIncident }) {
  const handleExportLogistics = () => {
    alert('Logistics report export initiated. Generating CSV from u278523899_findit database.');
  };

  return (
    <>
      {/* System Diagnostic Card */}
      <div className="widget-card diagnostic-card">
        <div className="widget-card-header">
          <h3 className="widget-title">System Diagnostic</h3>
          <span className="diagnostic-status-dot"></span>
        </div>

        <div className="diagnostic-metrics-list">
          <div className="diagnostic-row">
            <div className="diagnostic-label-wrap">
              <Cpu size={16} className="diag-icon" />
              <span>Matching Engine</span>
            </div>
            <strong className="diagnostic-value highlight-blue">
              {diagnostics.matchingEnginePrecision}
            </strong>
          </div>

          <div className="diagnostic-row">
            <div className="diagnostic-label-wrap">
              <Layers size={16} className="diag-icon" />
              <span>Queue Throughput</span>
            </div>
            <strong className="diagnostic-value">
              {diagnostics.queueThroughput}
            </strong>
          </div>

          <div className="diagnostic-row">
            <div className="diagnostic-label-wrap">
              <Users size={16} className="diag-icon" />
              <span>On-Duty Agents</span>
            </div>
            <strong className="diagnostic-value">
              {diagnostics.onDutyAgents}
            </strong>
          </div>
        </div>
      </div>

      {/* Operational Actions Card */}
      <div className="widget-card actions-card">
        <div className="widget-card-header">
          <div>
            <h3 className="widget-title">Operational Actions</h3>
            <p className="widget-subtitle">Standard dispatch shortcuts</p>
          </div>
        </div>

        <div className="action-buttons-stack">
          <button 
            type="button" 
            className="btn-primary-action"
            onClick={onCreateIncident}
          >
            <div className="btn-action-left">
              <PlusCircle size={17} />
              <span>Create Incident Report</span>
            </div>
            <span className="btn-action-keyhint">⌘N</span>
          </button>

          <button 
            type="button" 
            className="btn-secondary-action"
            onClick={handleExportLogistics}
          >
            <div className="btn-action-left">
              <Download size={17} />
              <span>Daily Logistics Export</span>
            </div>
            <span className="btn-action-download-icon">↓</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default DiagnosticWidget;
