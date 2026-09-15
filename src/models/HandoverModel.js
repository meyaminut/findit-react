/**
 * Model: HandoverModel
 * Defines state and data structures for the official Grand Melia Lost & Found Handover process.
 * Follows strict MVC architecture.
 */

export const initialHandoverData = {
  ticketId: '#TK-2024-0314',
  itemId: '#LF-2024-0314-08',
  status: 'TERVERIFIKASI (SIAP DIAMBIL)',
  timestamp: '14 Mar 2024, 14:10 WIB',
  guest: {
    name: 'Hendra Gunawan',
    room: '314',
    roomType: 'Deluxe Suite',
    phone: '+62 812-3456-7890',
    idCard: '317102********',
    idType: 'KTP'
  },
  item: {
    name: 'Garmin Venu SQ',
    edition: 'Garmin Venu SQ Music Edition (Black Strap)',
    serialNumber: 'GMN-988421-X',
    finder: 'Siti Rahma (HK)',
    location: 'Nightstand Kamar 314',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=480&auto=format&fit=crop&q=80'
  },
  vault: {
    lockerId: 'Loker B-12',
    name: 'Brankas Utama',
    keyTag: 'Kunci FO-DM'
  },
  officer: {
    name: 'Budi Santoso',
    role: 'Duty Manager Front Office'
  },
  checklists: {
    physicalIdVerified: true,
    biometricRoomMatched: true,
    itemInspectedByGuest: true
  },
  pickupMethod: 'direct', // 'direct' | 'courier' | 'authorization'
  document: {
    filename: 'Tanda_Terima_Hendra_314.jpg',
    size: '2.4 MB',
    uploadedAt: '14:10 WIB',
    uploader: 'Duty Desk (Budi Santoso)',
    previewUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80'
  },
  additionalNotes: 'Tamu mengambil langsung sebelum menuju bandara Soekarno-Hatta. Diterima dalam kondisi menyala baik dan baterai 84%.'
};

export default initialHandoverData;
