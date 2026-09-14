import { MatchReviewModel } from '../models/MatchReviewModel';

/**
 * Controller: MatchReviewController
 * Handles business logic for reviewing candidate pairings, confirming matches,
 * rejecting incorrect predictions, and dispatching verification notifications.
 */
export class MatchReviewController {
  static getCandidates() {
    return MatchReviewModel.getCandidates();
  }

  static async confirmMatch(candidateId, options = {}) {
    // In production, updates `matches` table where id = candidateId to status 'approved'
    // and logs `verified_by = user_id`, `contact_shared_at = NOW()`
    await new Promise((resolve) => setTimeout(resolve, 600));

    return {
      success: true,
      candidateId,
      message: `Match #${candidateId} confirmed. Authorized contact details shared between owner & custody desk.`
    };
  }

  static async rejectMatch(candidateId, reason = 'Descriptors mismatch') {
    // In production, updates `matches` table where id = candidateId to status 'rejected'
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      success: true,
      candidateId,
      message: `Pairing #${candidateId} rejected. Reports returned to triage pool.`
    };
  }

  static async flagForInspection(candidateId, notes = '') {
    await new Promise((resolve) => setTimeout(resolve, 450));

    return {
      success: true,
      candidateId,
      message: `Match #${candidateId} flagged for secondary physical inspection by custody officer.`
    };
  }
}

export default MatchReviewController;
