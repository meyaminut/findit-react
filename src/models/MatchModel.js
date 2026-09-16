/**
 * Canonical match statuses acting as the Single Source of Truth
 */
export const MATCH_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed'
};

export const TICKET_STATUS_MAP = {
  pending: 'Menunggu Verifikasi',
  approved: 'Terverifikasi',
  rejected: 'Menunggu Verifikasi',
  completed: 'Selesai Handover'
};

export const FOUND_ITEM_STATUS_MAP = {
  pending: 'Di Brankas FO',
  approved: 'Dalam Proses',
  rejected: 'Di Brankas FO',
  completed: 'Sudah Diambil'
};

export const TICKET_TO_MATCH_STATUS = {
  'Menunggu Verifikasi': 'pending',
  'Terverifikasi': 'approved',
  'Selesai Handover': 'completed',
  'Ditolak': 'rejected',
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
  completed: 'completed'
};

export const ITEM_TO_MATCH_STATUS = {
  'Di Brankas FO': 'pending',
  'Dalam Proses': 'approved',
  'Sudah Diambil': 'completed',
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
  completed: 'completed'
};

/**
 * Model: MatchModel
 * Represents the `matches` table in database `u278523899_findit`
 */
export class MatchModel {
  constructor({
    id = null,
    lost_report_id = null,
    found_report_id = null,
    status = MATCH_STATUS.PENDING, // 'pending' | 'approved' | 'rejected' | 'completed'
    verified_by = null,
    handover_method = null,
    contact_shared_at = null,
    activity_note = '',
    created_at = null,
    updated_at = null
  } = {}) {
    this.id = id;
    this.lost_report_id = lost_report_id;
    this.found_report_id = found_report_id;
    this.status = status;
    this.verified_by = verified_by;
    this.handover_method = handover_method;
    this.contact_shared_at = contact_shared_at;
    this.activity_note = activity_note;
    this.created_at = created_at || new Date().toISOString();
    this.updated_at = updated_at || new Date().toISOString();
  }

  isPending() {
    return this.status === MATCH_STATUS.PENDING;
  }

  isApproved() {
    return this.status === MATCH_STATUS.APPROVED;
  }

  isCompleted() {
    return this.status === MATCH_STATUS.COMPLETED;
  }

  isRejected() {
    return this.status === MATCH_STATUS.REJECTED;
  }

  getTicketStatusLabel() {
    return TICKET_STATUS_MAP[this.status] || 'Menunggu Verifikasi';
  }

  getFoundItemStatusLabel() {
    return FOUND_ITEM_STATUS_MAP[this.status] || 'Di Brankas FO';
  }
}

export default MatchModel;
