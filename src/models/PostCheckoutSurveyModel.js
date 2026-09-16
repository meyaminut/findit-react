import { StorageService } from '../services/StorageService';

/**
 * Model: PostCheckoutSurveyModel
 * Data structures and domain queries for Screen 10: Survei Pasca-Checkout.
 * Dynamically populated from StorageService.getSurveyGuests().
 */
export class PostCheckoutSurveyModel {
  static getKpiMetrics() {
    const guests = StorageService.getSurveyGuests();
    const checkoutsToday = guests.length || 0;
    const surveysSent = guests.filter((g) => g.status && g.status !== 'unseen').length;
    const positiveResponses = guests.filter((g) => g.status === 'replied').length;
    const viaWhatsapp = guests.filter((g) => g.status === 'sent-wa').length;
    const viaEmail = guests.filter((g) => g.status === 'sent-email').length;

    return {
      checkoutsToday: checkoutsToday > 0 ? checkoutsToday : 0,
      cleanedRooms: Math.max(0, checkoutsToday - 1),
      surveysSent,
      viaWhatsapp,
      viaEmail,
      positiveResponses,
      avgResponseTime: '18 Menit',
      resolutionImpact: checkoutsToday > 0 ? '92%' : '-'
    };
  }

  static getCheckoutGuestsList() {
    return StorageService.getSurveyGuests();
  }

  static getIncomingSurveyResponses() {
    const guests = StorageService.getSurveyGuests();
    return guests
      .filter((g) => g.status === 'replied' || g.hasLostItem || (g.hkLog && g.hkLog.toLowerCase().includes('klaim')))
      .map((g) => ({
        id: `resp-${g.id}`,
        guestId: g.id,
        roomNumber: g.roomNumber,
        roomType: g.roomType,
        roomBadgeClass: 'room-gold',
        guestName: g.name,
        statusBadgeClass: 'badge-amber',
        statusBadge: 'Perlu Verifikasi',
        timestamp: g.checkoutAgo || 'Baru saja',
        statement: g.hkLog || 'Tamu mengindikasikan adanya barang yang tertinggal setelah checkout.',
        matchType: 'match-amber',
        matchCallout: g.hkTicket || 'Pernyataan tamu cocok dengan data temuan housekeeping.',
        source: 'Survei WhatsApp / Email',
        actionLabel: 'Verifikasi Sekarang →'
      }));
  }

  static getInsights() {
    return hospitalityInsights;
  }
}

export const hospitalityInsights = [
  {
    id: 'INS-01',
    icon: 'shield',
    title: 'Reduksi Komplain & Sengketa',
    desc: 'Pemberitahuan pasca-checkout mengurangi kepanikan tamu saat menyadari barangnya tertinggal setelah tiba di bandara atau rumah, serta menghilangkan perdebatan Front Desk.',
    pill: 'Optimasi Beban FO',
    pillClass: 'pill-blue'
  },
  {
    id: 'INS-02',
    icon: 'hourglass',
    title: 'Golden Hour (0 - 90 Menit)',
    desc: 'Penyisiran kamar paling efektif dilakukan sebelum linen diganti dan sprei dikirim ke laundry luar. Deteksi dini mencegah barang terselip ke cucian kotor.',
    pill: 'Respon Optimal: < 90 Menit',
    pillClass: 'pill-amber'
  },
  {
    id: 'INS-03',
    icon: 'message',
    title: 'Template Pesan Terstandarisasi',
    desc: 'Gunakan kalimat ramah tanpa menimbulkan kesan tamu teledor. Sistem menyisipkan nomor kamar dan tautan unggah foto klaim secara otomatis.',
    link: 'Pratinjau Format Pesan Baku ↗',
    linkClass: 'link-green'
  }
];

export const surveyKpiMetrics = PostCheckoutSurveyModel.getKpiMetrics();
export const incomingSurveyResponses = PostCheckoutSurveyModel.getIncomingSurveyResponses();
export const checkoutGuestsList = PostCheckoutSurveyModel.getCheckoutGuestsList();

export default PostCheckoutSurveyModel;
