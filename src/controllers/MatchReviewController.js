import { MatchReviewModel } from '../models/MatchReviewModel';
import { StorageService } from '../services/StorageService';

/**
 * Controller: MatchReviewController
 * Handles business logic for reviewing candidate pairings, confirming matches,
 * rejecting incorrect predictions, and dispatching verification notifications.
 * Directly persists match state to StorageService.
 */
export class MatchReviewController {
  static getCandidates(ticketId = null) {
    return MatchReviewModel.getCandidates(ticketId);
  }

  static async confirmMatch(candidateId, options = {}) {
    const candidates = MatchReviewModel.getCandidates();
    const candidate = candidates.find((c) => c.id === candidateId || c.matchId === candidateId);

    const extra = {
      verified_by: options.verified_by || 'Staf Front Office',
      contact_shared_at: new Date().toISOString(),
      lost_report_id: candidate?.lost_report_id || options.lost_report_id || null,
      found_report_id: candidate?.found_report_id || options.found_report_id || null,
      handover_method: options.handover_method || null,
      activity_note: options.activity_note || 'Match terkonfirmasi oleh petugas FO',
      ...options
    };

    const updatedMatch = StorageService.updateMatchStatus(candidateId, 'approved', extra);

    return {
      success: true,
      candidateId,
      match: updatedMatch,
      message: `Match #${candidateId} confirmed. Authorized contact details shared between owner & custody desk.`
    };
  }

  static async rejectMatch(candidateId, reason = 'Descriptors mismatch') {
    const candidates = MatchReviewModel.getCandidates();
    const candidate = candidates.find((c) => c.id === candidateId || c.matchId === candidateId);

    const extra = {
      activity_note: `Ditolak: ${reason}`,
      lost_report_id: candidate?.lost_report_id || null,
      found_report_id: candidate?.found_report_id || null
    };

    const updatedMatch = StorageService.updateMatchStatus(candidateId, 'rejected', extra);

    return {
      success: true,
      candidateId,
      match: updatedMatch,
      message: `Pairing #${candidateId} rejected. Reports returned to triage pool.`
    };
  }

  static async flagForInspection(candidateId, notes = '') {
    const candidates = MatchReviewModel.getCandidates();
    const candidate = candidates.find((c) => c.id === candidateId || c.matchId === candidateId);

    const extra = {
      activity_note: notes || 'Ditandai untuk inspeksi fisik sekunder oleh petugas custody',
      lost_report_id: candidate?.lost_report_id || null,
      found_report_id: candidate?.found_report_id || null
    };

    const updatedMatch = StorageService.updateMatchStatus(candidateId, 'pending', extra);

    return {
      success: true,
      candidateId,
      match: updatedMatch,
      message: `Match #${candidateId} flagged for secondary physical inspection by custody officer.`
    };
  }
}

export default MatchReviewController;
