import { ClaimTicketModel } from '../models/ClaimTicketModel';
import { StorageService } from '../services/StorageService';
import { MatchReviewModel } from '../models/MatchReviewModel';

export class ClaimTicketController {
  static getInitialClaim() {
    return ClaimTicketModel.getInitialData();
  }

  static getCategories() {
    return ClaimTicketModel.getCategories();
  }

  static getQuickLocations() {
    return ClaimTicketModel.getQuickLocations();
  }

  /**
   * Retrieves auto-match candidate if available.
   * Centralized to MatchReviewModel as the single matching engine.
   */
  static getAutoMatch(ticketId = null) {
    if (!ticketId) return null;
    const candidates = MatchReviewModel.getCandidates(ticketId);
    return candidates.length > 0 ? candidates[0] : null;
  }

  static async submitClaim(ticketData) {
    const newTicket = StorageService.addTicket({
      guestName: ticketData.guestName || 'Tamu Hotel',
      roomNumber: ticketData.roomNumber || 'FO Inquiry',
      phone: ticketData.phoneNumber || '-',
      email: ticketData.email || '-',
      itemName: ticketData.brandAndModel || 'Barang Berharga',
      category: ticketData.category === 'electronics' ? 'Elektronik' : 
                ticketData.category === 'wallet' ? 'Dompet / Tas' :
                ticketData.category === 'jewelry' ? 'Perhiasan & Jam' :
                ticketData.category === 'documents' ? 'Dokumen & Paspor' : 'Pakaian / Aksesoris',
      brand: ticketData.brandAndModel || '-',
      color: ticketData.colorAndFeatures || '-',
      locationLost: ticketData.lostLocation || 'Kamar Tamu',
      secretDetail: ticketData.secretProof || '-',
      priority: ticketData.loyaltyTier === 'diamond' ? 'VIP' : (ticketData.loyaltyTier === 'gold' ? 'Prioritas' : 'Reguler')
    });

    return {
      success: true,
      ticket: newTicket,
      message: `Tiket klaim ${newTicket.id} (${newTicket.itemName}) berhasil dibuat dan disimpan!`
    };
  }

  static async saveDraft(ticketData) {
    return {
      success: true,
      message: `Draf laporan untuk ${ticketData.guestName || 'tamu'} berhasil disimpan sementara.`
    };
  }
}

export default ClaimTicketController;
