import React from 'react';
import { Search, Download, Plus, Filter } from 'lucide-react';

/**
 * View Component: ClaimTicketsToolbar
 * Search input, status filter tabs, and action buttons for Claim Tickets.
 */
export function ClaimTicketsToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  totalCount,
  onNewClaim,
  onExportCSV
}) {
  const statusOptions = [
    { id: 'all', label: `Semua (${totalCount})` },
    { id: 'Menunggu Verifikasi', label: 'Menunggu Verifikasi' },
    { id: 'Terverifikasi', label: 'Terverifikasi' },
    { id: 'Selesai Handover', label: 'Selesai Handover' }
  ];

  return (
    <div className="claim-toolbar-wrap">
      {/* Top row: Search & Action Buttons */}
      <div className="claim-toolbar-top">
        <div className="claim-search-box">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            className="claim-search-input"
            placeholder="Cari No. Tiket (#TK-...), nama tamu, nomor kamar, atau nama barang..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="claim-actions-group">
          <button
            type="button"
            className="btn-export-clean"
            onClick={onExportCSV}
            title="Ekspor daftar tiket ke file CSV"
          >
            <Download size={14} />
            <span>Ekspor CSV</span>
          </button>

          <button
            type="button"
            className="btn-add-ticket-amber"
            onClick={onNewClaim}
          >
            <Plus size={15} />
            <span>+ Buat Tiket Klaim Baru</span>
          </button>
        </div>
      </div>

      {/* Bottom row: Filter tabs */}
      <div className="claim-tabs-row">
        <span className="filter-label">Filter Status:</span>
        <div className="tabs-pill-list">
          {statusOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`tab-filter-btn ${statusFilter === opt.id ? 'active' : ''}`}
              onClick={() => onStatusFilterChange(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ClaimTicketsToolbar;
