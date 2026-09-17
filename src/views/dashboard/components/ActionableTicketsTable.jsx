import { 
  Watch, 
  Wallet, 
  Laptop, 
  Shirt, 
  Layers,
  Search 
} from 'lucide-react';

/**
 * View Component: ActionableTicketsTable
 * Renders the table "Tiket Perlu Ditindaklanjuti" matching the mockup.
 */
export function ActionableTicketsTable({ 
  tickets, 
  searchQuery,
  onSearchChange,
  activeFilter, 
  onFilterChange, 
  onOpenMatch,
  onMarkHandedOver
}) {
  const getCategoryIcon = (iconType) => {
    switch (iconType) {
      case 'watch':
        return <Watch size={15} className="item-icon-blue" />;
      case 'wallet':
        return <Wallet size={15} className="item-icon-amber" />;
      case 'laptop':
        return <Laptop size={15} className="item-icon-blue" />;
      case 'clothing':
        return <Shirt size={15} className="item-icon-slate" />;
      default:
        return <Layers size={15} className="item-icon-slate" />;
    }
  };

  const lostCount = tickets.filter((t) => t.type === 'lost').length;
  const foundCount = tickets.filter((t) => t.type === 'found').length;

  const isMatchApproved = (ticket) =>
    ticket._candidate?.matchStatus === 'approved' || ticket.statusType === 'green';

  return (
    <div className="actionable-tickets-card">
      {/* Header with Title and Filter Tabs */}
      <div className="tickets-card-header">
        <div className="tickets-title-col">
          <h2 className="tickets-main-title">Barang Perlu Ditindaklanjuti</h2>
          <p className="tickets-sub-title">
            Daftar klaim tamu &amp; laporan kamar yang belum diverifikasi silang
          </p>
        </div>

        {/* Search Box (Nama Barang / Kamar) */}
        <div className="tickets-search-box">
          <Search size={14} className="tickets-search-icon" />
          <input
            type="text"
            className="tickets-search-input"
            placeholder="Cari nama barang / kamar..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="tickets-filter-row">
        <div className="tickets-filter-pills">
          <button
            type="button"
            className={`filter-pill-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange('all')}
          >
            Semua ({tickets.length})
          </button>
          <button
            type="button"
            className={`filter-pill-btn ${activeFilter === 'lost' ? 'active' : ''}`}
            onClick={() => onFilterChange('lost')}
          >
            Hilang / Lost ({lostCount})
          </button>
          <button
            type="button"
            className={`filter-pill-btn ${activeFilter === 'found' ? 'active' : ''}`}
            onClick={() => onFilterChange('found')}
          >
            Temuan / Found ({foundCount})
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="tickets-table-scroll">
        <table className="tickets-table">
          <thead>
            <tr>
              <th>NO. BARANG</th>
              <th>TAMU &amp; KAMAR</th>
              <th>PERKIRAAN BARANG</th>
              <th>WAKTU LAPOR</th>
              <th>STATUS</th>
              <th className="text-center">TINDAKAN</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '48px 16px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#64748B' }}>
                    <Layers size={36} style={{ color: '#94A3B8', marginBottom: '4px' }} />
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#1E293B' }}>Tidak ada barang yang memerlukan tindakan saat ini</span>
                    <span style={{ fontSize: '13px' }}>Semua barang klaim tamu telah diverifikasi atau belum ada laporan baru.</span>
                  </div>
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id} className="ticket-table-row">
                  {/* 1. Ticket Number */}
                  <td className="ticket-id-cell">
                    <span className="ticket-id-link">{ticket.id}</span>
                  </td>

                  {/* 2. Guest Name & Room */}
                  <td className="guest-room-cell">
                    <div className="guest-name-row">
                      <span className="guest-name">{ticket.guestName}</span>
                      {ticket.isVip && (
                        <span className="vip-badge-yellow">VIP</span>
                      )}
                    </div>
                    <span className="room-meta">{ticket.room}</span>
                  </td>

                  {/* 3. Estimated Item & Location Detail */}
                  <td className="item-detail-cell">
                    <div className="item-title-row">
                      <span className="item-icon-wrap">
                        {getCategoryIcon(ticket.iconType)}
                      </span>
                      <span className="item-name">{ticket.itemTitle}</span>
                    </div>
                    {ticket.priorityTag ? (
                      <span className="priority-document-tag">
                        {ticket.priorityTag}
                      </span>
                    ) : (
                      <span className="location-subtext">
                        {ticket.locationDetail}
                      </span>
                    )}
                  </td>

                  {/* 4. Report Time */}
                  <td className="report-time-cell">
                    <span className="report-time-text">{ticket.reportTime}</span>
                  </td>

                  {/* 5. Status Pill */}
                  <td className="status-cell">
                    {ticket.statusType === 'blue' ? (
                      <span className="status-pill-blue">
                        <span className="dot-blue"></span>
                        {ticket.status}
                      </span>
                    ) : ticket.statusType === 'green' ? (
                      <span className="status-pill-green">
                        <span className="dot-green"></span>
                        {ticket.status}
                      </span>
                    ) : (
                      <span className="status-pill-gray">
                        <span className="dot-gray"></span>
                        {ticket.status}
                      </span>
                    )}
                  </td>

                  {/* 6. Action Button */}
                  <td className="action-cell text-center">
                    {isMatchApproved(ticket) ? (
                      <button
                        type="button"
                        className="handover-btn-green"
                        onClick={() => onMarkHandedOver && onMarkHandedOver(ticket)}
                      >
                        Tandai Diserahkan
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="match-btn-gold"
                        onClick={() => onOpenMatch && onOpenMatch(ticket)}
                      >
                        Cocokkan
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="tickets-pagination-footer">
        <span className="pagination-count-text">
          Menampilkan {tickets.length} barang operasional
        </span>
        <div className="pagination-controls">
          <button type="button" className="pagination-btn neutral" disabled>
            Sebelumnya
          </button>
          <button type="button" className="pagination-num-btn active">
            1
          </button>
          <button type="button" className="pagination-btn neutral" disabled>
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActionableTicketsTable;
