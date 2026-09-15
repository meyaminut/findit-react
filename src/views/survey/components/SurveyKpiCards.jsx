import React from 'react';
import { BedDouble, Send, AlertTriangle, Clock } from 'lucide-react';

/**
 * View Component: SurveyKpiCards
 * 4 clean white KPI cards for checkout telemetry.
 */
export function SurveyKpiCards({ checkoutsToday, surveysSent, positiveResponses, avgResponseTime }) {
  return (
    <div className="survey-kpi-grid">
      {/* Card 1 */}
      <div className="survey-kpi-card">
        <div className="survey-kpi-left">
          <span className="survey-kpi-label">CHECK-OUT HARI INI</span>
          <span className="survey-kpi-value">{checkoutsToday}</span>
          <span className="survey-kpi-sub">Kamar telah dibersihkan</span>
        </div>
        <div className="survey-kpi-icon-box blue">
          <BedDouble size={18} />
        </div>
      </div>

      {/* Card 2 */}
      <div className="survey-kpi-card">
        <div className="survey-kpi-left">
          <span className="survey-kpi-label">SURVEI TERKIRIM</span>
          <span className="survey-kpi-value">{surveysSent}</span>
          <span className="survey-kpi-sub">Via WhatsApp &amp; Email</span>
        </div>
        <div className="survey-kpi-icon-box blue-soft">
          <Send size={16} />
        </div>
      </div>

      {/* Card 3 */}
      <div className="survey-kpi-card yellow-card">
        <div className="survey-kpi-left">
          <span className="survey-kpi-label yellow">RESPONS POSITIF</span>
          <span className="survey-kpi-value yellow">{positiveResponses}</span>
          <span className="survey-kpi-sub yellow">Ada barang tertinggal</span>
        </div>
        <div className="survey-kpi-icon-box yellow">
          <AlertTriangle size={16} />
        </div>
      </div>

      {/* Card 4 */}
      <div className="survey-kpi-card green-card">
        <div className="survey-kpi-left">
          <span className="survey-kpi-label green">RATA-RATA RESPON</span>
          <span className="survey-kpi-value green">{avgResponseTime}</span>
          <span className="survey-kpi-sub green">Responsif</span>
        </div>
        <div className="survey-kpi-icon-box green">
          <Clock size={16} />
        </div>
      </div>
    </div>
  );
}

export default SurveyKpiCards;
