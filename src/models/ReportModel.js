/**
 * Model: ReportModel
 * Represents the `reports` table in database `u278523899_findit`
 */
export class ReportModel {
  constructor({
    id = null,
    report_identifier = '',
    user_id = null,
    type = 'lost', // 'lost' | 'found'
    title = '',
    description = '',
    category = '',
    location = '',
    photo_url = '',
    status = 'active', // 'active' | 'matched' | 'resolved' | 'cancelled'
    activity_note = '',
    item_date = null,
    created_at = null,
    updated_at = null
  } = {}) {
    this.id = id;
    this.report_identifier = report_identifier;
    this.user_id = user_id;
    this.type = type;
    this.title = title;
    this.description = description;
    this.category = category;
    this.location = location;
    this.photo_url = photo_url;
    this.status = status;
    this.activity_note = activity_note;
    this.item_date = item_date;
    this.created_at = created_at || new Date().toISOString();
    this.updated_at = updated_at || new Date().toISOString();
  }

  isLost() {
    return this.type === 'lost';
  }

  isFound() {
    return this.type === 'found';
  }

  isActive() {
    return this.status === 'active';
  }
}

export default ReportModel;
