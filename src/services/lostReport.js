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
 *   3. Fallback offline -> tiket lokal StorageService (dashboard tetap jalan).
 *
 * Arsip halaman Laporan (/admin/laporan) dibaca LANGSUNG dari backend
 * (OperationalReportsView API-first) — tidak memerlukan mirror localStorage.
 */

import ApiService from './ApiService';
import { StorageService } from './StorageService';

/**
 * Upload satu file foto dari sisi admin. Throw error agar form menampilkan
 * banner error bila backend tidak menerima file.
 */
async function uploadPhoto(file) {
  return ApiService.uploadPhoto(file);
}

/**
 * Simpan laporan kehilangan. Return shape standar form:
 *   { status: 'success', data, message }
 *
 * - online: API create lost report.
 * - offline: fallback tiket lokal ke StorageService.
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

    return {
      status: 'success',
      data,
      message: `Laporan kehilangan berhasil dibuat (ID: ${data?.id || data?.ID || 'baru'}).`,
    };
  } catch (err) {
    // Fallback offline: simpan sebagai tiket lokal agar tidak kehilangan data.
    console.warn('[lostReport] API gagal, fallback ke tiket lokal:', err.message);
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
      data: localTicket,
      message: `Laporan ${localTicket.id} disimpan secara lokal (mode offline).`,
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