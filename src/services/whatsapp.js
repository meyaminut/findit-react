/**
 * Service: whatsapp
 * Utilitas notifikasi WhatsApp semi-otomatis via deep link `wa.me`.
 *
 * Admin memicu pratinjau saat memverifikasi match atau menandai barang
 * diserahkan; pesan ditampilkan di modal pratinjau lalu dibuka di WhatsApp
 * (admin tetap menekan tombol kirim). Tidak ada token/gateway yang dibutuhkan.
 */

/**
 * Normalisasi nomor telepon Indonesia ke format internasional tanpa tanda baca.
 * Contoh: "0812-3456-7890" -> "6281234567890", "+62 812 3456 7890" -> "6281234567890".
 */
export function normalizePhone(raw) {
  if (!raw) return '';
  let digits = String(raw).replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('0')) digits = digits.slice(1);
  if (!digits.startsWith('62')) digits = `62${digits}`;
  return digits;
}

/**
 * Bangun URL deep link WhatsApp dengan pesan yang sudah di-encode.
 */
export function buildWhatsAppUrl(phone, message) {
  const normalized = normalizePhone(phone);
  if (!normalized) return '';
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message || '')}`;
}

const EVENT_VERIFIED = 'verified';
const EVENT_HANDOVER = 'handover';

/**
 * Susun teks notifikasi berdasarkan momen (verifikasi match / serah terima).
 * Bahasa Indonesia, tanpa emoji.
 */
export function buildNotificationMessage({ event, guestName, itemTitle, room } = {}) {
  const name = guestName && guestName !== '-' ? guestName : 'Tamu';
  const item = itemTitle && itemTitle !== '-' ? itemTitle : 'barang Anda';
  const roomLabel = room && room !== '-' ? ` (${room})` : '';

  if (event === EVENT_HANDOVER) {
    return `Halo ${name}, barang "${item}"${roomLabel} telah diserahkan/diambil. Terima kasih telah menggunakan layanan Grand Meliá.`;
  }

  return `Halo ${name}, kabar baik! Barang yang Anda laporkan, "${item}"${roomLabel}, telah DITEMUKAN oleh tim Grand Meliá. Silakan menghubungi Front Office atau datang ke Front Desk untuk proses pengambilan. Terima kasih.`;
}

/**
 * Label singkat momen notifikasi untuk ditampilkan di modal pratinjau.
 */
export function notifEventLabel(event) {
  return event === EVENT_HANDOVER ? 'Serah Terima' : 'Barang Ditemukan';
}

export const WHATSAPP_EVENTS = {
  VERIFIED: EVENT_VERIFIED,
  HANDOVER: EVENT_HANDOVER,
};

export default {
  normalizePhone,
  buildWhatsAppUrl,
  buildNotificationMessage,
  notifEventLabel,
  WHATSAPP_EVENTS,
};
