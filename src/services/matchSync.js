/**
 * Service: matchSync
 * Helper bersama untuk alur verifikasi/pencocokan (Match) yang dipakai dua
 * entry point: MatchReviewView (Halaman Verifikasi) dan MatchVerificationModal
 * (Modal "Pencocokan Barang" di Dashboard).
 *
 * Prinsip API-first + anti-data-loss (STAGE 2):
 *  - PUT /matches/:id bersifat replace-all DAN mewajibkan lost_report_id +
 *    found_report_id => helper ini SELALU mengirim seluruh field record saat ini.
 *  - Saat approve/reject, status kedua Report terkait ikut disinkron karena
 *    backend TIDAK otomatis mengubah report.status saat match berubah:
 *      approve -> 2 report jadi 'dikonfirmasi'
 *      reject  -> 2 report dilepas kembali 'baru'
 *    Relasi terverifikasi 1:1 (data live: tiap report maksimal 1 match record),
 *    sehingga reject aman langsung set 'baru' tanpa cek match approved lain.
 */

import ApiService from './ApiService';
import { StorageService } from './StorageService';

export const isApiCandidate = (candidate) =>
  Boolean(
    candidate &&
    (candidate._apiId != null ||
      candidate._source === 'api' ||
      /-API-/i.test(String(candidate.lost_report_id ?? '')) ||
      /-API-/i.test(String(candidate.found_report_id ?? '')))
  );

// Cari record match di backend — via _apiId, atau pair lost+found.
// `matches` opsional (ekspektasi dari cache hasil GET /matches saat load).
export const findApiMatch = async (candidate, matches = null) => {
  const list = matches && Array.isArray(matches) ? matches : await ApiService.getMatches();
  if (!Array.isArray(list) || list.length === 0) return null;

  let target = null;
  if (candidate && candidate._apiId != null) {
    target = list.find((m) => String(m.id ?? m.ID) === String(candidate._apiId)) || null;
  }
  if (!target && candidate) {
    const lostId = String(candidate.lost_report_id ?? '').replace(/\D/g, '');
    const foundId = String(candidate.found_report_id ?? '').replace(/\D/g, '');
    if (lostId && foundId) {
      target =
        list.find(
          (m) => String(m.lost_report_id) === lostId && String(m.found_report_id) === foundId
        ) || null;
    }
  }
  return target;
};

// Penjaga kontrak backend: Match.verified_by bertipe uint — string wajib dinormalisasi.
const toNullableUint = (value) => {
  if (value == null || value === '') return null;
  const num = Number(value);
  return Number.isInteger(num) && num > 0 ? num : null;
};

// Payload PUT match: pertahankan seluruh field existing agar tidak terjadi
// data loss; status baru ditempatkan terakhir (override).
export const buildMatchUpdatePayload = (target, nextStatus, extra = {}) => ({
  lost_report_id: target.lost_report_id,
  found_report_id: target.found_report_id,
  similarity_score: target.similarity_score ?? 0,
  verified_by: toNullableUint(extra.verified_by ?? target.verified_by ?? null),
  handover_method: extra.handover_method ?? target.handover_method ?? '',
  contact_shared_at: extra.contact_shared_at ?? target.contact_shared_at ?? null,
  activity_note: extra.activity_note ?? target.activity_note ?? '',
  status: nextStatus,
});

export const reportStatusForMatch = (nextStatus) =>
  nextStatus === 'approved' ? 'dikonfirmasi' : 'baru';

const syncReportStatus = async (reportId, status) => {
  const id = reportId ?? null;
  if (id == null) return false;
  try {
    await ApiService.updateReport(id, { status });
    return true;
  } catch (err) {
    console.warn('[matchSync] updateReport status gagal:', err.message);
    return false;
  }
};

/**
 * Tandai barang sebagai "Diserahkan" (HANDED_OVER / dikembalikan).
 * Update status kedua report (lost & found) via API. Khusus baris yang
 * match-nya sudah approved. Mengembalikan true bila update API berhasil.
 */
export const markMatchHandedOver = async ({ ticket }) => {
  const reportStatus = 'dikembalikan';
  if (ticket?._apiId == null) return false;
  const jobs = [syncReportStatus(ticket._apiId, reportStatus)];
  const foundId = ticket?._candidate?.found_report_id;
  if (foundId != null) {
    jobs.push(syncReportStatus(foundId, reportStatus));
  }
  await Promise.all(jobs);
  return true;
};

/**
 * Terapkan keputusan verifikasi (approved/rejected) ke match + kedua report-nya.
 * `matches` opsional: cache hasil GET /matches (hindari refetch berulang).
 * Mengembalikan true bila record match benar-benar di-update via API.
 */
export const applyMatchDecision = async ({ candidate, nextStatus, extra = {}, matches = null }) => {
  const target = await findApiMatch(candidate, matches);
  if (!target) return false;

  const matchId = target.id ?? target.ID;
  const reportStatus = reportStatusForMatch(nextStatus);
  await Promise.all([
    ApiService.updateMatchStatus(
      matchId,
      nextStatus,
      buildMatchUpdatePayload(target, nextStatus, extra)
    ),
    syncReportStatus(target.lost_report_id, reportStatus),
    syncReportStatus(target.found_report_id, reportStatus),
  ]);
  return true;
};

// Fallback offline: simpan ke StorageService seperti perilaku semula.
export const applyMatchDecisionLocal = async ({ ticket, candidate, nextStatus, extra = {} }) => {
  if (!candidate?.id) return false;
  StorageService.updateMatchStatus(candidate.id, nextStatus, {
    lost_report_id: ticket.id,
    found_report_id: candidate.found_report_id || candidate.id,
    ...extra,
  });
  return true;
};