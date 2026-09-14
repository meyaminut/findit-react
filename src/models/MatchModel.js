/**
 * Model: MatchModel
 * Represents the `matches` table in database `u278523899_findit`
 */
export class MatchModel {
  constructor({
    id = null,
    lost_report_id = null,
    found_report_id = null,
    status = 'pending', // 'pending' | 'approved' | 'rejected' | 'completed'
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
    return this.status === 'pending';
  }

  isApproved() {
    return this.status === 'approved';
  }
}

export default MatchModel;
