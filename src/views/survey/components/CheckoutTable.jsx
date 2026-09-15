import React from 'react';
import { Send, Mail, MessageCircle, MessageSquare, Check } from 'lucide-react';

/**
 * View Component: CheckoutTable
 * Table of guests checked out with functional action triggers.
 */
export function CheckoutTable({
  guests,
  onSendMassSurveys,
  onSendSingleEmail,
  onSendSingleWhatsApp,
  onOpenChatRoom
}) {
  return (
    <section className="checkout-table-section">
      <div className="checkout-table-header-row">
        <div className="checkout-header-left">
          <h2 className="checkout-table-title">
            Daftar Tamu Baru Check-out
          </h2>
          <p className="checkout-table-subtitle">
            Kirim konfirmasi ke tamu 15–90 menit setelah check-out agar investigasi berjalan cepat.
          </p>
        </div>

        <div className="checkout-header-tools">
          <button 
            type="button" 
            className="btn-send-mass"
            onClick={onSendMassSurveys}
          >
            <Send size={13} />
            <span>Kirim Massal ke Belum Terkirim</span>
          </button>
        </div>
      </div>

      <div className="checkout-table-container">
        <table className="checkout-table">
          <thead>
            <tr>
              <th>NAMA TAMU &amp; KAMAR</th>
              <th style={{ width: '150px' }}>WAKTU CHECKOUT</th>
              <th style={{ width: '160px' }}>STATUS NOTIFIKASI</th>
              <th>LOG TERAKHIR</th>
              <th style={{ width: '240px', textAlign: 'right' }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest) => (
              <tr key={guest.id} className="checkout-table-row">
                <td className="cell-guest">
                  <div className="guest-row-flex">
                    <span className="guest-room-num-badge">{guest.roomNumber}</span>
                    <div className="guest-text-col">
                      <span className="guest-fullname">{guest.name}</span>
                      <span className="guest-sub-room">{guest.roomType}</span>
                    </div>
                  </div>
                </td>

                <td className="cell-checkout-time">
                  <div className="time-stack">
                    <span className="time-bold">{guest.checkoutTime}</span>
                    <span className="time-ago">{guest.checkoutAgo}</span>
                  </div>
                </td>

                <td className="cell-status">
                  <span className={`status-tag-pill ${guest.status}`}>
                    {guest.statusLabel}
                  </span>
                </td>

                <td className="cell-log">
                  <span className="log-text">{guest.hkLog}</span>
                </td>

                <td className="cell-actions">
                  <div className="actions-button-group">
                    {guest.status === 'unseen' && (
                      <>
                        <button 
                          type="button" 
                          className="btn-action-email"
                          onClick={() => onSendSingleEmail(guest)}
                        >
                          <Mail size={12} />
                          <span>Email</span>
                        </button>
                        <button 
                          type="button" 
                          className="btn-action-wa"
                          onClick={() => onSendSingleWhatsApp(guest)}
                        >
                          <MessageCircle size={12} />
                          <span>WA</span>
                        </button>
                      </>
                    )}

                    {guest.status === 'replied' && (
                      <button 
                        type="button" 
                        className="btn-open-chat"
                        onClick={() => onOpenChatRoom(guest)}
                      >
                        <MessageSquare size={12} />
                        <span>Buka Chat</span>
                      </button>
                    )}

                    {(guest.status === 'sent-email' || guest.status === 'sent-wa') && (
                      <span className="action-verified-check">
                        <Check size={13} /> Terkirim
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="checkout-table-footer">
          <span className="footer-count-text">
            Menampilkan {guests.length} data tamu check-out
          </span>
        </div>
      </div>
    </section>
  );
}

export default CheckoutTable;
