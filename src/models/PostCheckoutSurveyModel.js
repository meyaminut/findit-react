/**
 * Model: PostCheckoutSurveyModel
 * Data structures for Screen 10: Survei Pasca-Checkout.
 * Starts empty — populated dynamically from StorageService.
 */

export const surveyKpiMetrics = {
  checkoutsToday: 0,
  cleanedRooms: 0,
  surveysSent: 0,
  viaWhatsapp: 0,
  viaEmail: 0,
  positiveResponses: 0,
  avgResponseTime: '-',
  resolutionImpact: '-'
};

export const incomingSurveyResponses = [];

export const checkoutGuestsList = [];

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

export default {
  surveyKpiMetrics,
  incomingSurveyResponses,
  checkoutGuestsList,
  hospitalityInsights
};
