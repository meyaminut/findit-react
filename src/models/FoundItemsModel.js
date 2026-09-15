/**
 * Model: FoundItemsModel
 * Master inventory structure for lost & found items at Grand Melia Jakarta.
 * Starts empty — populated dynamically from StorageService.
 */

export const masterFoundItems = [];

export const foundItemsKpi = {
  totalActive: 0,
  inVault: 0,
  collected: 0
};

export const roomFilterOptions = [
  'All Rooms',
  'Lantai 2 (201-220)',
  'Lantai 3 (301-320)',
  'Lantai 4 (401-420)',
  'Lantai 5 (501-520)'
];

export const categoryFilterOptions = [
  'Semua Kategori',
  'Elektronik',
  'Dompet / Tas',
  'Perhiasan & Jam',
  'Pakaian',
  'Dokumen & Paspor'
];

export const dateRangeOptions = [
  '7 Hari Terakhir',
  'Hari Ini',
  'Bulan Ini',
  'Kustom Rentang Tanggal'
];

export const statusFilterOptions = [
  'Semua Status',
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
