/**
 * Model: ClaimTicketModel
 * Represents a new Guest Claim Ticket (Buat Laporan Tamu) in Grand Melia Lost & Found system,
 * backed by database `u278523899_findit`.
 */
export class ClaimTicketModel {
  constructor(data = {}) {
    this.ticketNumber = data.ticketNumber || `#TK-${Math.floor(1000 + Math.random() * 9000)}`;
    this.guestName = data.guestName || '';
    this.phoneNumber = data.phoneNumber || '';
    this.email = data.email || '';
    this.roomNumber = data.roomNumber || '';
    this.checkoutDate = data.checkoutDate || '';
    this.loyaltyTier = data.loyaltyTier || 'regular'; // 'regular' | 'gold' | 'diamond'
    
    // Confidential Verification Details
    this.category = data.category || 'electronics';
    this.brandAndModel = data.brandAndModel || '';
    this.colorAndFeatures = data.colorAndFeatures || '';
    this.lostLocation = data.lostLocation || '';
    this.secretProof = data.secretProof || '';
    
    // Status & System
    this.status = data.status || 'open';
    this.pmsSynced = true;
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  static getInitialData() {
    return new ClaimTicketModel();
  }

  static getCategories() {
    return [
      { id: 'electronics', label: 'Elektronik', icon: 'laptop' },
      { id: 'wallet', label: 'Dompet / Tas', icon: 'wallet' },
      { id: 'jewelry', label: 'Perhiasan & Jam', icon: 'watch' },
      { id: 'clothing', label: 'Pakaian / Aksesoris', icon: 'shirt' },
      { id: 'documents', label: 'Dokumen & Paspor', icon: 'fileText' }
    ];
  }

  static getQuickLocations() {
    return [
      'Meja Nakas',
      'Safe Box',
      'Wardrobe',
      'Bawah Bantal',
      'Wastafel'
    ];
  }

  static getAutoMatchCandidate() {
    return null;
  }
}

export default ClaimTicketModel;
