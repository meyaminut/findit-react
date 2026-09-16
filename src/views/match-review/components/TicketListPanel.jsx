import React, { useState, useMemo } from 'react';
import { Search, Plus, PanelLeftClose, PanelLeft, Ticket } from 'lucide-react';
import './TicketListPanel.css';

/**
 * View Component: TicketListPanel
 * Slim left-hand panel displaying operational guest claim tickets in a Gmail-style split pane.
 * Features compact search, status filter pills, clickable rows with active highlights,
 * and independent scrollable container.
 */
export function TicketListPanel({
  tickets = [],
  selectedTicketId = null,
  onSelectTicket,
  onNewClaim,
  isCollapsed = false,
  onToggleCollapse
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filterOptions = [
    { id: 'all', label: `Semua (${tickets.length})` },
    { id: 'Menunggu Verifikasi', label: 'Menunggu' },
    { id: 'Terverifikasi', label: 'Terverifikasi' },
    { id: 'Selesai Handover', label: 'Selesai' }
  ];

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (t.id && t.id.toLowerCase().includes(q)) ||
        (t.guestName && t.guestName.toLowerCase().includes(q)) ||
        (t.roomNumber && t.roomNumber.toLowerCase().includes(q)) ||
        (t.itemName && t.itemName.toLowerCase().includes(q)) ||
        (t.brand && t.brand.toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [tickets, statusFilter, searchQuery]);

  const getStatusChipClass = (status) => {
    switch (status) {
      case 'Menunggu Verifikasi':
        return 'status-chip-amber';
      case 'Terverifikasi':
        return 'status-chip-blue';
      case 'Selesai Handover':
        return 'status-chip-green';
      default:
        return 'status-chip-amber';
    }
  };

  const formatShortTime = (timeStr, createdAt) => {
    if (timeStr && timeStr !== '-') {
      // If contains time like "Hari ini, 09:30 WIB", simplify
      return timeStr.replace('Hari ini, ', '').replace(' WIB', '');
    }
    if (createdAt) {
      try {
        const d = new Date(createdAt);
        return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      } catch {
        return 'Baru saja';
      }
    }
    return '-';
  };

  if (isCollapsed) {
    return (
      <div 
        style={{
          width: '44px',
          borderRight: '1px solid #E3E1E9',
          background: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '12px 0',
          gap: '12px',
          flexShrink: 0
        }}
      >
        <button
          type="button"
          className="btn-panel-toggle"
          onClick={onToggleCollapse}
          title="Tampilkan Panel Antrean Tiket"
        >
          <PanelLeft size={16} />
        </button>
        <span 
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            fontSize: '11.5px',
            fontWeight: 800,
            color: '#00164E',
            letterSpacing: '0.5px'
          }}
        >
          Antrean Tiket ({tickets.length})
        </span>
      </div>
    );
  }

  return (
    <aside className="ticket-list-panel" aria-label="Daftar Antrean Tiket Klaim">
      {/* 1. Header Toolbar */}
      <div className="ticket-list-header">
        <div className="ticket-list-header-top">
          <div className="ticket-list-title-wrap">
            <h2 className="ticket-list-heading">Antrean Tiket</h2>
            <span className="ticket-list-count-badge">{tickets.length}</span>
          </div>

          <div className="ticket-list-header-actions">
            <button
              type="button"
              className="btn-new-claim-compact"
              onClick={onNewClaim}
              title="Buat tiket klaim laporan tamu baru"
            >
              <Plus size={13} />
              <span>+ Buat Tiket</span>
            </button>

            {onToggleCollapse && (
              <button
                type="button"
                className="btn-panel-toggle"
                onClick={onToggleCollapse}
                title="Sembunyikan Panel Antrean"
              >
                <PanelLeftClose size={15} />
              </button>
            )}
          </div>
        </div>

        {/* 2. Compact Search Input */}
        <div className="ticket-list-search-box">
          <Search size={14} className="ticket-list-search-icon" />
          <input
            type="text"
            className="ticket-list-search-input"
            placeholder="Cari no. tiket, nama, kamar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* 3. Compact Filter Pills */}
        <div className="ticket-list-filter-pills">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`filter-pill-btn ${statusFilter === opt.id ? 'active' : ''}`}
              onClick={() => setStatusFilter(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Scrollable List of Ticket Cards */}
      <div className="ticket-list-scroll-area">
        {filteredTickets.length === 0 ? (
          <div className="ticket-list-empty">
            <Ticket size={24} style={{ opacity: 0.4 }} />
            <span>Tidak ada tiket yang cocok dengan filter.</span>
          </div>
        ) : (
          filteredTickets.map((t) => {
            const isSelected = selectedTicketId === t.id;
            return (
              <div
                key={t.id}
                className={`ticket-list-card ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectTicket && onSelectTicket(t.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectTicket && onSelectTicket(t.id);
                  }
                }}
              >
                {/* Row 1: ID, VIP tag, and time */}
                <div className="card-top-row">
                  <div className="flex items-center gap-1.5">
                    <span className="ticket-card-id">{t.id}</span>
                    {t.priority === 'VIP' && (
                      <span className="vip-tag-mini">VIP</span>
                    )}
                  </div>
                  <span className="ticket-card-time">
                    {formatShortTime(t.reportedAt, t.createdAt)}
                  </span>
                </div>

                {/* Row 2: Guest Name & Room */}
                <div className="card-guest-row">
                  <span className="ticket-card-guest" title={t.guestName}>
                    {t.guestName || 'Tamu Anonim'}
                  </span>
                  <span className="ticket-card-room">
                    Kamar {t.roomNumber || '-'}
                  </span>
                </div>

                {/* Row 3: Item Title & Category */}
                <div className="card-item-row" title={`${t.itemName || '-'} (${t.category || '-'})`}>
                  <span className="ticket-card-item-title">{t.itemName || 'Barang Berharga'}</span>
                  {t.color && (
                    <span className="ticket-card-item-sub">• {t.color}</span>
                  )}
                </div>

                {/* Row 4: Status badge */}
                <div className="card-bottom-row">
                  <span className={`ticket-status-chip ${getStatusChipClass(t.status)}`}>
                    <span className="status-chip-dot" />
                    {t.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}

export default TicketListPanel;
