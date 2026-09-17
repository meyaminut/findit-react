/**
 * Service: reportStatus
 * Kanonisasi & label status laporan (Report.status) sesuai vocab backend.
 *
 * Vocab asli backend (free-form VARCHAR, lihat findit-api models/report.go):
 *   `baru` (default) -> `dicocokkan` -> `dikonfirmasi` -> `dikembalikan`
 * Referensi enum produk: findit-flutter lib/models/report.dart
 *   ReportStatus { baru, dicocokkan, dikonfirmasi, dikembalikan }
 *
 * `normalizeReportStatus` juga menerima alias lama (pending/verified/approved/
 * completed/claimed) agar data legacy tetap tampil benar.
 */

const REPORT_STATUS_ALIASES = {
  baru: 'baru',
  'baru masuk': 'baru',
  pending: 'baru',
  'menunggu verifikasi': 'baru',
  'di brankas fo': 'baru',
  dicocokkan: 'dicocokkan',
  matched: 'dicocokkan',
  dikonfirmasi: 'dikonfirmasi',
  diverifikasi: 'dikonfirmasi',
  verified: 'dikonfirmasi',
  approved: 'dikonfirmasi',
  terverifikasi: 'dikonfirmasi',
  disetujui: 'dikonfirmasi',
  dikembalikan: 'dikembalikan',
  completed: 'dikembalikan',
  claimed: 'dikembalikan',
  returned: 'dikembalikan',
  'sudah diambil': 'dikembalikan',
  'selesai handover': 'dikembalikan',
  selesai: 'dikembalikan',
  diklaim: 'dikembalikan',
  rejected: 'rejected',
  ditolak: 'rejected',
}

export function normalizeReportStatus(raw) {
  if (raw == null) return 'baru'
  const key = String(raw).toLowerCase()
  return REPORT_STATUS_ALIASES[key] || 'baru'
}

export function isReportAwaiting(raw) {
  const s = normalizeReportStatus(raw)
  return s === 'baru' || s === 'dicocokkan'
}

export function isReportVerified(raw) {
  return normalizeReportStatus(raw) === 'dikonfirmasi'
}

export function isReportResolved(raw) {
  return normalizeReportStatus(raw) === 'dikembalikan'
}

export function reportStatusLabel(raw, type = 'found') {
  switch (normalizeReportStatus(raw)) {
    case 'baru':
      return 'Baru Masuk'
    case 'dicocokkan':
      return 'Dicocokkan'
    case 'dikonfirmasi':
      return 'Terverifikasi'
    case 'dikembalikan':
      return type === 'lost' ? 'Selesai Handover' : 'Sudah Diambil'
    case 'rejected':
      return 'Ditolak'
    default:
      return 'Baru Masuk'
  }
}

export function reportStatusType(raw) {
  switch (normalizeReportStatus(raw)) {
    case 'dikonfirmasi':
      return 'green'
    case 'dicocokkan':
      return 'amber'
    case 'dikembalikan':
      return 'blue'
    case 'rejected':
      return 'red'
    default:
      return 'gray'
  }
}