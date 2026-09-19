import { DashboardModel } from '../models/DashboardModel';

/**
 * Controller: DashboardController
 * Handles operational queue triage and recap export for Grand Melia Jakarta
 * Lost & Found operations console.
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
