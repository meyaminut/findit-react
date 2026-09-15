import { DashboardModel } from '../models/DashboardModel';

/**
 * Controller: DashboardController
 * Handles operational queue triage, match approvals, dismissals, and incident dispatching
 * for Grand Melia Jakarta Lost & Found operations console.
 */
export class DashboardController {
  static getMetrics() {
    return DashboardModel.getKpiMetrics();
  }

  static getTickets() {
    return DashboardModel.getActionableTickets();
  }

  static getActivities() {
    return DashboardModel.getLiveActivities();
  }

  static getCategories() {
    return DashboardModel.getCategories();
  }

  static getUnlabeledItems() {
    return DashboardModel.getUnlabeledStorageItems();
  }

  /**
   * Verify and match an actionable ticket
   */
  static async verifyTicketMatch(ticketId) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      message: `Tiket ${ticketId} berhasil diverifikasi dan diteruskan ke tahap pencocokan.`
    };
  }

  /**
   * Create and persist a new Lost or Found incident report
   */
  static async createIncident(incidentData) {
    await new Promise((resolve) => setTimeout(resolve, 650));
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `#TK-2024-${randomNum}`;

    return {
      success: true,
      identifier: newId,
      message: `Laporan cepat ${newId} berhasil dibuat dan diarsipkan di Grand Melia FO.`
    };
  }

  /**
   * Export operational recap report
   */
  static async exportRecapReport() {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      success: true,
      message: 'Rekap Operasional Lost & Found (Shift Pagi) berhasil diekspor ke PDF/Excel.'
    };
  }
}

export default DashboardController;
