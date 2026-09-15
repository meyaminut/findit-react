/**
 * Model: AllReportsModel
 * Provides report structure, metric definitions, and filter options.
 * Starts empty — populated dynamically from StorageService.
 */
export class AllReportsModel {
  static getMetrics() {
    return {
      totalSubmissions: {
        val: '0',
        label: 'TOTAL SUBMISSIONS',
        subtitle: '-',
        icon: 'folder'
      },
      awaitingVerification: {
        val: '0',
        label: 'AWAITING VERIFICATION',
        subtitle: 'Requires desk audit',
        icon: 'hourglass'
      },
      matchedConfirmed: {
        val: '0',
        label: 'MATCHED & CONFIRMED',
        subtitle: '-',
        icon: 'handshake'
      },
      resolvedReturned: {
        val: '0',
        label: 'RESOLVED & RETURNED',
        subtitle: '-',
        icon: 'shield'
      }
    };
  }

  static getReports() {
    return [];
  }

  static getFilterOptions() {
    return {
      types: ['All Types', 'Lost', 'Found'],
      statuses: ['All Statuses', 'New', 'In Progress', 'Matched', 'Resolved'],
      categories: ['All Categories', 'Elektronik', 'Dompet / Tas', 'Perhiasan & Jam', 'Pakaian', 'Dokumen & Paspor'],
      timeRanges: ['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'All Time']
    };
  }
}

export default AllReportsModel;
