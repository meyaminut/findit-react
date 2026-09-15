/**
 * Model: PostCheckoutSurveyModel
 * Data structures for Screen 10: Survei Pasca-Checkout & Deteksi Proaktif.
 * Follows strict MVC architecture.
 */

export const surveyKpiMetrics = {
  checkoutsToday: 8,
  cleanedRooms: 4,
  surveysSent: 5,
  viaWhatsapp: 3,
  viaEmail: 2,
  positiveResponses: 3,
  avgResponseTime: '18m',
  resolutionImpact: '+64%'
};

export const incomingSurveyResponses = [
  {
    id: 'RESP-001',
    guestName: 'Ibu Dian Pratiwi',
    roomNumber: '510',
    roomType: 'Deluxe King City View',
    roomBadgeClass: 'badge-yellow',
    statusBadge: 'Tiket Baru Masuk',
    statusBadgeClass: 'badge-blue',
    timestamp: '12:39 WIB (25 mnt lalu)',
    statement: 'Tertinggal cincin emas di wastafel kamar mandi, dekat cermin make-up. Tolong diamankan.',
    matchScore: 98,
    matchCallout: 'Potensi Cocok (98%): HK Attendant Siti menemukan cincin emas di Kamar 510 (ID: LF-510-092)',
    matchType: 'high-match',
    source: 'WhatsApp Link Form',
    actionLabel: 'Verifikasi & Cocokkan Sekarang →'
  },
  {
    id: 'RESP-002',
    guestName: 'Mr. David Miller',
    roomNumber: '408',
    roomType: 'Executive Suite',
    roomBadgeClass: 'badge-gray',
    statusBadge: 'Dalam Pencocokan',
    statusBadgeClass: 'badge-yellow',
    timestamp: '10:15 WIB (2 jam lalu)',
    statement: 'Tertinggal jaket bomber cokelat di lemari gantungan pakaian paling kiri.',
    matchScore: 65,
    matchCallout: 'Sedang diproses oleh Supervisor FO (Ahmad). 1 Barang serupa di Gudang Floor 4.',
    matchType: 'in-review',
    source: 'Email Survey Click',
    actionLabel: 'Buka Match Review'
  }
];

export const checkoutGuestsList = [
  {
    id: 'GUEST-001',
    name: 'Bpk. Bambang Sutrisno',
    roomNumber: '204',
    roomType: 'Superior Twin • 2 Malam',
    checkoutTime: '12:05 WIB',
    checkoutAgo: '40 menit lalu',
    status: 'unseen',
    statusLabel: 'Belum Terkirim',
    hkLog: 'Kamar belum dibersihkan',
    hkLogClass: 'text-neutral',
    phone: '+62 813-8821-9901',
    email: 'bambang.sutrisno@gmail.com'
  },
  {
    id: 'GUEST-002',
    name: 'Ibu Dian Pratiwi',
    roomNumber: '510',
    roomType: 'Deluxe King • 1 Malam',
    checkoutTime: '11:40 WIB',
    checkoutAgo: '1 jam 5 mnt lalu',
    status: 'replied',
    statusLabel: 'Telah Dibalas',
    hkLog: 'Mengklaim Cincin Emas',
    hkTicket: 'Tiket #TC-0029 terbit',
    hkLogClass: 'text-danger',
    sentAt: 'Terkirim 11:45',
    phone: '+62 811-9234-1182',
    email: 'dian.pratiwi@outlook.com'
  },
  {
    id: 'GUEST-003',
    name: 'Mr. Alex Wong',
    roomNumber: '322',
    roomType: 'Executive King • 3 Malam',
    checkoutTime: '11:15 WIB',
    checkoutAgo: '1 jam 30 mnt lalu',
    status: 'sent-email',
    statusLabel: 'Terkirim via Email',
    hkLog: 'Email dibuka 11:22 • Menunggu balasan',
    hkLogClass: 'text-neutral',
    sentBadge: 'Email Terkirim',
    phone: '+65 9182 3341',
    email: 'alex.wong@sgcorp.com'
  },
  {
    id: 'GUEST-004',
    name: 'Bpk. Hendra Gunawan',
    roomNumber: '314',
    roomType: 'Premium Room • 4 Malam',
    checkoutTime: '11:00 WIB',
    checkoutAgo: '1 jam 45 mnt lalu',
    status: 'unseen',
    statusLabel: 'Belum Terkirim',
    hkLog: 'Kamar sudah selesai diperiksa (Nihil)',
    hkLogClass: 'text-neutral',
    phone: '+62 812-3456-7890',
    email: 'hendra.gunawan@email.com'
  }
];

export const hospitalityInsights = [
  {
    id: 'INS-01',
    icon: 'shield',
    title: 'Reduksi Komplain & Sengketa',
    desc: 'Pemberitahuan proaktif mengurangi 82% kepanikan tamu saat menyadari barangnya tertinggal setelah tiba di bandara atau rumah, serta menghilangkan perdebatan Front Desk.',
    pill: '-82% Beban Panggilan FO',
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
