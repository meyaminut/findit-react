import { DashboardModel } from '../models/DashboardModel';

/**
 * Controller: DashboardController
 * Handles operational queue triage, match approvals, dismissals, and incident dispatching.
 */
export class DashboardController {
  static getMetrics() {
    return DashboardModel.getKpiMetrics();
  }

  static getQueueItems() {
    return DashboardModel.getInitialQueueItems();
  }

  static getDiagnostics() {
    return DashboardModel.getSystemDiagnostic();
  }

  /**
   * Approve a matched lost & found pairing
   */
  static async approveMatch(matchId, handoverMethod = 'Airport Security Dispatch Desk') {
    // In production, performs SQL UPDATE `matches` SET status='approved', handover_method=...
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      success: true,
      message: `Match #${matchId} verified & approved. Contact details shared with both parties.`
    };
  }

  /**
   * Reject an auto-paired recommendation
   */
  static async rejectMatch(matchId, reason = 'Unmatched physical characteristics') {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      message: `Match #${matchId} unlinked. Item returned to open search queue.`
    };
  }

  /**
   * Create and persist a new Lost or Found incident report
   */
  static async createIncident(incidentData) {
    await new Promise((resolve) => setTimeout(resolve, 700));
    const newIdentifier = incidentData.type === 'lost' 
      ? `R-${Math.floor(1000 + Math.random() * 9000)}`
      : `F-${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      success: true,
      identifier: newIdentifier,
      data: incidentData,
      message: `Incident #${newIdentifier} registered and submitted for AI matching.`
    };
  }
}

export default DashboardController;
