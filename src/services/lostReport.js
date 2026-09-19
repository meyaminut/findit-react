/**
 * Service: lostReport
 * Adaptor submit laporan kehilangan (type: 'lost') dari sisi Admin/FO.
 *
 * Dipakai bersama oleh:
 *   - QuickReportModal (Dashboard, tampil sebagai popup/modal)
 *   - NewLostReportView (full-page /admin/laporan/baru)
 *
 * Strategi:
 *   1. Upload foto via ApiService.uploadPhoto (token admin).
 *   2. Simpan laporan via ApiService.createLostReport (kirim room_number
 *      supaya kolom "TAMU & NO. KAMAR" di Verifikasi konsisten).
 *   3. Fallback offline -> tiket lokal StorageService HANYA saat network
 *      error asli (backend unreachable/timeout). Error server (401/4xx/5xx)
 *      dikembalikan sebagai error agar form menunjukkannya ke user.
 *
 * Arsip halaman Laporan (/admin/laporan) dibaca LANGSUNG dari backend
 * (OperationalReportsView API-first) — tidak memerlukan mirror localStorage.
 */

import ApiService from './ApiService';
import { StorageService } from './StorageService';

/**
 * True network error (backend unreachable/timeout) — satu-satunya kondisi
 * yang boleh memicu fallback tiket lokal. apiClient menandai 401/4xx/5xx
 * dengan error.status > 0 (bukan network error).
 */
const isNetworkFailure = (err) =>
  !!(err && (err.isNetworkError || err.timeout || err.status === 0));

/**
 * Upload satu file foto dari sisi admin. Throw error agar form menampilkan
 * banner error bila backend tidak menerima file.
 */
async function uploadPhoto(file) {
  return ApiService.uploadPhoto(file);
}

/**
 * Simpan laporan kehilangan. Return shape standar form:
 *   { status: 'success', data, message }  — tersimpan di backend (mode online).
 *   { status: 'success', offline: true, data, message } — fallback tiket lokal
 *                                                          (backend benar-benar unreachable).
 *   { status: 'error', message }           — error dari server (401/4xx/5xx),
 *                                            TIDAK membuat tiket lokal.
 */
async function createReport(payload = {}) {
  const title = payload.title || 'Laporan Kehilangan Barang';
  const description = payload.description || '';
  const category = payload.category || 'Lainnya';
  const roomNumber = payload.room_number || '';
  const location = payload.location || '';

  try {
    const data = await ApiService.createLostReport({
      title,
      description,
      category,
      room_number: roomNumber,
      location,
      photo_url: payload.photo_url || '',
      guestName: payload.guestName || '',
    });

    const identifier = data?.report_identifier || data?.id || data?.ID || 'baru';

    return {
      status: 'success',
      data,
      message: `Laporan kehilangan berhasil dibuat (ID: ${identifier}).`,
    };
  } catch (err) {
    // Bukan network error (backend merespons 401/4xx/5xx) → tampilkan error
    // asli ke user. Jangan menulis tiket lokal palsu untuk error server.
    if (!isNetworkFailure(err)) {
      const message =
        err?.status === 401
          ? 'Sesi Anda berakhir. Silakan masuk kembali lalu ulangi laporan.'
          : err?.message || 'Gagal menyimpan laporan. Silakan coba lagi.';
      return { status: 'error', message };
    }

    // Hanya network error asli yang boleh fallback ke tiket lokal.
    console.warn('[lostReport] API tidak dapat dihubungi, fallback ke tiket lokal:', err.message);
    const localTicket = StorageService.addTicket({
      guestName: payload.guestName || 'Tamu',
      roomNumber: roomNumber || 'FO Inquiry',
      itemName: title,
      category,
      locationLost: location || 'Kamar Tamu',
      secretDetail: description || '-',
      brand: '-',
      color: payload.features || '-',
    });

    return {
      status: 'success',
      offline: true,
      data: localTicket,
      message: `Mode offline — laporan ${localTicket.id} disimpan lokal dan belum masuk server.`,
    };
  }
}

/**
 * Adaptor API yang di-inject ke komponen form bersama (ReportLostForm).
 */
export const adminReportApi = {
  uploadPhoto,
  createReport,
};

export default {
  adminReportApi,
  uploadPhoto,
  createReport,
};