import React from 'react';
import { Ticket, ArrowRight, Trash2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

/**
 * View Component: ClaimTicketsTable
 * Renders the operational tickets list or an elegant empty state.
 */
export function ClaimTicketsTable({
  tickets,
  onVerifyTicket,
  onHandoverTicket,
  onDeleteTicket,
  onNewClaim,
  onLoadSampleData
}) {
  if (!tickets || tickets.length === 0) {
    return (
      <div className="claim-empty-state-card">
        <div className="empty-icon-box">
          <Ticket size={28} className="empty-ticket-icon" />
        </div>
        <h3 className="empty-title">Belum Ada Tiket Klaim Tamu</h3>
        <p className="empty-subtitle">
          Data dummy telah dikosongkan. Buat laporan klaim baru dari tamu yang melapor kehilangan barang berharga.
        </p>
        <div className="empty-actions-row">
          <button
            type="button"
            className="btn-create-empty-amber"
            onClick={onNewClaim}
          >
            + Buat Laporan Tamu Sekarang
          </button>
          <button
            type="button"
            className="btn-seed-sample"
            onClick={onLoadSampleData}
          >
            Muat 2 Sampel Uji Coba
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="claim-table-container">
      <table className="claim-tickets-table">
        <thead>
          <tr>
            <th style={{ width: '150px' }}>NO. TIKET</th>
            <th>TAMU &amp; KAMAR</th>
            <th>BARANG DIKLAIM</th>
            <th>LOKASI DUGAAN</th>
            <th style={{ width: '160px' }}>WAKTU LAPOR</th>
            <th style={{ width: '160px' }}>STATUS</th>
            <th style={{ width: '160px', textAlign: 'right' }}>AKSI OPERASIONAL</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.id} className="claim-table-row">
              {/* 1. No Tiket */}
              <td className="cell-ticket-id">
                <span className="ticket-id-tag">{t.id}</span>
                {t.priority === 'VIP' && (
                  <span className="vip-badge-small">VIP</span>
                )}
              </td>

              {/* 2. Tamu & Kamar */}
              <td className="cell-guest-room">
                <div className="guest-col-wrap">
                  <span className="guest-name-text">{t.guestName}</span>
                  <span className="guest-room-sub">
                    Kamar {t.roomNumber} • {t.roomType}
                  </span>
                </div>
              </td>

              {/* 3. Barang Diklaim */}
              <td className="cell-item-details">
                <div className="item-col-wrap">
                  <span className="item-name-bold">{t.itemName}</span>
                  <span className="item-category-sub">
                    {t.category} {t.color ? `• ${t.color}` : ''}
                  </span>
                </div>
              </td>

              {/* 4. Lokasi Dugaan */}
              <td className="cell-location">
                <span className="location-text">{t.locationLost}</span>
              </td>

              {/* 5. Waktu Lapor */}
              <td className="cell-time">
                <span className="reported-time-text">{t.reportedAt}</span>
              </td>

              {/* 6. Status */}
              <td className="cell-status">
                <span className={`status-pill ${t.status.replace(/\s+/g, '-').toLowerCase()}`}>
                  <span className="status-dot" />
                  {t.status}
                </span>
              </td>

              {/* 7. Aksi */}
              <td className="cell-actions">
                <div className="actions-flex-right">
                  {t.status === 'Menunggu Verifikasi' && (
                    <button
                      type="button"
                      className="btn-action-primary"
                      onClick={() => onVerifyTicket(t)}
                    >
                      <span>Verifikasi</span>
                      <ArrowRight size={13} />
                    </button>
                  )}

                  {t.status === 'Terverifikasi' && (
                    <button
                      type="button"
                      className="btn-action-handover"
                      onClick={() => onHandoverTicket(t)}
                    >
                      <span>Handover</span>
                      <ArrowRight size={13} />
                    </button>
                  )}

                  {t.status === 'Selesai Handover' && (
                    <span className="status-done-label">
                      <CheckCircle2 size={14} className="done-icon" /> Selesai
                    </span>
                  )}

                  <button
                    type="button"
                    className="btn-trash-item"
                    title="Hapus Tiket"
                    onClick={() => onDeleteTicket(t.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="claim-table-footer">
        <span className="footer-count-text">
          Menampilkan {tickets.length} tiket klaim aktif
        </span>
      </div>
    </div>
  );
}

export default ClaimTicketsTable;
