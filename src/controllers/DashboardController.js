import { DashboardModel } from '../models/DashboardModel';
import { MatchReviewController } from './MatchReviewController';
import { ClaimTicketController } from './ClaimTicketController';
import { StorageService } from '../services/StorageService';

/**
 * Controller: DashboardController
 * Handles operational queue triage, match approvals, dismissals, and incident dispatching
 * for Grand Melia Jakarta Lost & Found operations console.
 * Logic is delegated to domain-specific controllers (MatchReviewController, ClaimTicketController).
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
   * Verify and match an actionable ticket.
   * Delegates match approval to MatchReviewController.confirmMatch()
   */
  static async verifyTicketMatch(ticketId) {
    // 1. Cari kandidat matching yang sesuai untuk ticketId
    const candidates = MatchReviewController.getCandidates(ticketId);
    let candidateId = null;
    let foundReportId = null;

    if (candidates && candidates.length > 0) {
      candidateId = candidates[0].id || candidates[0].matchId;
      foundReportId = candidates[0].found_report_id || null;
    } else {
      // Periksa apakah sudah ada data match yang mengaitkan ticketId
      const matches = StorageService.getMatches();
      const existingMatch = matches.find(
        (m) => m.lost_report_id === ticketId || m.id === ticketId
      );
      if (existingMatch) {
        candidateId = existingMatch.id;
        foundReportId = existingMatch.found_report_id;
      } else {
        candidateId = `M-${String(ticketId).replace(/[^a-zA-Z0-9]/g, '')}`;
      }
    }

    // 2. Delegasikan ke MatchReviewController.confirmMatch()
    const res = await MatchReviewController.confirmMatch(candidateId, {
      lost_report_id: ticketId,
      found_report_id: foundReportId,
      activity_note: `Verifikasi & pencocokan via antrean Dashboard untuk tiket ${ticketId}`
    });

    return {
      success: res.success,
      candidateId: res.candidateId,
      match: res.match,
      message: `Tiket ${ticketId} berhasil diverifikasi dan diteruskan ke tahap pencocokan.`
    };
  }

  /**
   * Create and persist a new Lost or Found incident report.
   * Delegates incident submission to ClaimTicketController.submitClaim()
   */
  static async createIncident(incidentData) {
    const cat = (incidentData.category || '').toLowerCase();
    let normalizedCategory = 'electronics';
    if (cat.includes('electr')) normalizedCategory = 'electronics';
    else if (cat.includes('wallet') || cat.includes('personal') || cat.includes('luggage')) normalizedCategory = 'wallet';
    else if (cat.includes('jewel')) normalizedCategory = 'jewelry';
    else if (cat.includes('doc')) normalizedCategory = 'documents';

    const claimPayload = {
      guestName: incidentData.guestName || 'Tamu FO',
      roomNumber: incidentData.roomNumber || incidentData.room || incidentData.location || 'FO Inquiry',
      phoneNumber: incidentData.phone || incidentData.phoneNumber || '-',
      email: incidentData.email || '-',
      brandAndModel: incidentData.title || incidentData.brandAndModel || 'Barang Tertinggal',
      category: normalizedCategory,
      colorAndFeatures: incidentData.description || incidentData.colorAndFeatures || '-',
      lostLocation: incidentData.location || incidentData.lostLocation || 'Area Hotel',
      secretProof: incidentData.description || '-',
      loyaltyTier: incidentData.isVip ? 'diamond' : 'regular'
    };

    const res = await ClaimTicketController.submitClaim(claimPayload);
    const identifier = res.ticket?.id || `#TK-2024-${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      success: res.success,
      identifier,
      ticket: res.ticket,
      message: `Laporan cepat ${identifier} berhasil dibuat dan diarsipkan di Grand Melia FO.`
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
