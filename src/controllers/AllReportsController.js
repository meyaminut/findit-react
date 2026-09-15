import { AllReportsModel } from '../models/AllReportsModel';

/**
 * Controller: AllReportsController
 * Handles filtering, searching, CSV export generation, and pagination for All Reports
 */
export class AllReportsController {
  static getMetrics() {
    return AllReportsModel.getMetrics();
  }

  static getReports() {
    return AllReportsModel.getReports();
  }

  static exportCsv(reports) {
    const headers = ['Report ID', 'Item Name', 'Type', 'Category', 'Reporter', 'Location', 'Timestamp', 'Status'];
    const rows = reports.map((r) => [
      r.id,
      r.title,
      r.type.toUpperCase(),
      r.category,
      r.reporter.name,
      `"${r.location}"`,
      r.timestamp,
      r.statusLabel
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `findit_reports_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return {
      success: true,
      message: `Exported ${reports.length} report records to CSV.`
    };
  }
}

export default AllReportsController;
