/**
 * Model: HandoverModel
 * Defines empty/placeholder state for the Handover process.
 * Real ticket data should be passed in from StorageService at the view level.
 */

export const initialHandoverData = {
  ticketId: '-',
  itemId: '-',
  status: 'TERVERIFIKASI (SIAP DIAMBIL)',
  timestamp: '-',
  guest: {
    name: '-',
    room: '-',
    roomType: '-',
    phone: '-',
    idCard: '-',
    idType: 'KTP'
  },
  item: {
    name: '-',
    edition: '-',
    serialNumber: '-',
    finder: '-',
    location: '-',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=480&auto=format&fit=crop&q=80'
  },
  vault: {
    lockerId: '-',
    name: 'Brankas Utama',
    keyTag: '-'
  },
  officer: {
    name: '-',
    role: 'Duty Manager Front Office'
  },
  checklists: {
    physicalIdVerified: false,
    biometricRoomMatched: false,
    itemInspectedByGuest: false
  },
  pickupMethod: 'direct',
  document: {
    title: 'Tanda Terima Serah Terima',
    filename: 'Tanda_Terima.pdf',
    fileSize: '-',
    size: '-',
    uploadedAt: '-',
    uploader: '-',
    previewUrl: ''
  },
  additionalNotes: ''
};

export default initialHandoverData;
