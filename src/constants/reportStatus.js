/**
 * Constants: reportStatus
 * Kontrak status laporan (Report.status) untuk Admin Dashboard & views.
 *
 * Nilai kanonik berikut kosong dari vocab backend findit-api (VARCHAR bebas):
 *   `baru` → `dicocokkan` → `dikonfirmasi` → `dikembalikan`
 *
 * `HANDED_OVER` adalah stage "barang diserahkan/diambil tamu" dan
 * bernilai kanonik yang sama dengan `RETURNED` (`dikembalikan`) agar
 * satu sumber kebenaran untuk counter "Dikembalikan" di dashboard.
 */

export const HANDED_OVER = 'dikembalikan'
export const RETURNED = 'dikembalikan'

export const REPORT_STATUS = Object.freeze({
  NEW: 'baru',
  MATCHED: 'dicocokkan',
  CONFIRMED: 'dikonfirmasi',
  HANDED_OVER,
  RETURNED,
  REJECTED: 'rejected',
})

export const REPORT_STATUS_LABEL = Object.freeze({
  [REPORT_STATUS.NEW]: 'Baru Masuk',
  [REPORT_STATUS.MATCHED]: 'Dicocokkan',
  [REPORT_STATUS.CONFIRMED]: 'Terverifikasi',
  [REPORT_STATUS.HANDED_OVER]: 'Diserahkan',
  [REPORT_STATUS.REJECTED]: 'Ditolak',
})

export const REPORT_STATUS_TYPE = Object.freeze({
  [REPORT_STATUS.NEW]: 'gray',
  [REPORT_STATUS.MATCHED]: 'amber',
  [REPORT_STATUS.CONFIRMED]: 'green',
  [REPORT_STATUS.HANDED_OVER]: 'blue',
  [REPORT_STATUS.REJECTED]: 'red',
})

/** Alias warisan/lama → nilai kanonik, dipakai oleh services/reportStatus & proxy API. */
export const REPORT_STATUS_ALIASES = Object.freeze({
  'baru masuk': REPORT_STATUS.NEW,
  pending: REPORT_STATUS.NEW,
  'menunggu verifikasi': REPORT_STATUS.NEW,
  'di brankas fo': REPORT_STATUS.NEW,
  matched: REPORT_STATUS.MATCHED,
  diverifikasi: REPORT_STATUS.CONFIRMED,
  verified: REPORT_STATUS.CONFIRMED,
  approved: REPORT_STATUS.CONFIRMED,
  terverifikasi: REPORT_STATUS.CONFIRMED,
  disetujui: REPORT_STATUS.CONFIRMED,
  completed: REPORT_STATUS.RETURNED,
  claimed: REPORT_STATUS.RETURNED,
  returned: REPORT_STATUS.RETURNED,
  'sudah diambil': REPORT_STATUS.RETURNED,
  'selesai handover': REPORT_STATUS.RETURNED,
  diserahkan: REPORT_STATUS.HANDED_OVER,
  selesai: REPORT_STATUS.RETURNED,
  diklaim: REPORT_STATUS.RETURNED,
  ditolak: REPORT_STATUS.REJECTED,
})