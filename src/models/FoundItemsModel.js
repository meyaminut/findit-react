/**
 * Model: FoundItemsModel
 * Master inventory of lost & found items found across Grand Melia Jakarta.
 * Follows strict MVC architecture.
 */

export const masterFoundItems = [
  {
    id: 'LF-2024-0314-08',
    regNumber: '#LF-2024-0314-08',
    roomNumber: '314',
    roomBadge: 'Kamar 314',
    category: 'Elektronik',
    title: 'Smartwatch Garmin Venu SQ Hitam',
    position: 'Meja Nakas Kanan',
    finder: {
      initial: 'S',
      name: 'Siti Aminah',
      dept: 'HK'
    },
    foundTime: '14 Mar 2024, 11:20 WIB',
    storageLocation: {
      type: 'vault',
      label: 'Loker FO B-12',
      badgeClass: 'badge-gold'
    },
    status: 'Belum Diklaim',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=160&auto=format&fit=crop&q=80'
  },
  {
    id: 'LF-2024-0314-05',
    regNumber: '#LF-2024-0314-05',
    roomNumber: '308',
    roomBadge: 'Kamar 308',
    category: 'Elektronik',
    title: 'AirPods Pro Case Putih',
    position: 'Dekat Headboard',
    finder: {
      initial: 'R',
      name: 'Rian S.',
      dept: 'HK'
    },
    foundTime: '14 Mar 2024, 10:45 WIB',
    storageLocation: {
      type: 'vault',
      label: 'Loker FO A-04',
      badgeClass: 'badge-gold'
    },
    status: 'Dalam Verifikasi',
    image: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=160&auto=format&fit=crop&q=80'
  },
  {
    id: 'LF-2024-0314-01',
    regNumber: '#LF-2024-0314-01',
    roomNumber: '412',
    roomBadge: 'Kamar 412',
    category: 'Dompet / Tas',
    title: 'Dompet Kulit Pria Hitam',
    position: 'Laci Meja Kerja',
    finder: {
      initial: 'A',
      name: 'Ahmad F.',
      dept: 'HK'
    },
    foundTime: '14 Mar 2024, 09:15 WIB',
    storageLocation: {
      type: 'master-vault',
      label: 'Brankas Utama',
      badgeClass: 'badge-red'
    },
    status: 'Belum Diklaim',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=160&auto=format&fit=crop&q=80'
  },
  {
    id: 'LF-2024-0313-88',
    regNumber: '#LF-2024-0313-88',
    roomNumber: '305',
    roomBadge: 'Kamar 305',
    category: 'Pakaian',
    title: 'Syal Wol Cashmere Biru Dongker',
    position: 'Sofa Tamu',
    finder: {
      initial: 'S',
      name: 'Siti Aminah',
      dept: 'HK'
    },
    foundTime: '13 Mar 2024, 16:20 WIB',
    storageLocation: {
      type: 'closet',
      label: 'Lemari C-01',
      badgeClass: 'badge-gold'
    },
    status: 'Sudah Diambil',
    image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=160&auto=format&fit=crop&q=80'
  },
  {
    id: 'LF-2024-0313-74',
    regNumber: '#LF-2024-0313-74',
    roomNumber: '510',
    roomBadge: 'Kamar 510',
    category: 'Perhiasan & Jam',
    title: 'Cincin Emas Kuning 18K',
    position: 'Wastafel Kamar Mandi',
    finder: {
      initial: 'S',
      name: 'Siti Aminah',
      dept: 'HK'
    },
    foundTime: '13 Mar 2024, 14:10 WIB',
    storageLocation: {
      type: 'master-vault',
      label: 'Brankas Utama',
      badgeClass: 'badge-red'
    },
    status: 'Dalam Verifikasi',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=160&auto=format&fit=crop&q=80'
  },
  {
    id: 'LF-2024-0313-62',
    regNumber: '#LF-2024-0313-62',
    roomNumber: '218',
    roomBadge: 'Kamar 218',
    category: 'Elektronik',
    title: 'iPad Pro 11 inch Space Gray',
    position: 'Bawah Bantal Tempat Tidur',
    finder: {
      initial: 'D',
      name: 'Dedi K.',
      dept: 'HK'
    },
    foundTime: '13 Mar 2024, 11:30 WIB',
    storageLocation: {
      type: 'vault',
      label: 'Loker FO A-02',
      badgeClass: 'badge-gold'
    },
    status: 'Belum Diklaim',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=160&auto=format&fit=crop&q=80'
  }
];

export const foundItemsKpi = {
  totalActive: 42,
  inVault: 28,
  collected: 14
};

export const roomFilterOptions = [
  'All Rooms (301-420)',
  'Lantai 2 (201-220)',
  'Lantai 3 (301-320)',
  'Lantai 4 (401-420)',
  'Lantai 5 (501-520)'
];

export const categoryFilterOptions = [
  'Semua Kategori (Elektronik, Dompet, Pakaian, dll)',
  'Elektronik',
  'Dompet / Tas',
  'Perhiasan & Jam',
  'Pakaian',
  'Dokumen & Paspor'
];

export const dateRangeOptions = [
  '7 Hari Terakhir (8 Mar - 14 Mar 2024)',
  'Hari Ini (14 Mar 2024)',
  'Bulan Ini (Maret 2024)',
  'Kustom Rentang Tanggal'
];

export const statusFilterOptions = [
  'Semua Status (Belum Diklaim, Verifikasi, dll)',
  'Belum Diklaim',
  'Dalam Verifikasi',
  'Sudah Diambil'
];

export default {
  masterFoundItems,
  foundItemsKpi,
  roomFilterOptions,
  categoryFilterOptions,
  dateRangeOptions,
  statusFilterOptions
};
