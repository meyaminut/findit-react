import React from 'react';
import { Search, Plus, DoorClosed, Layers, CheckSquare } from 'lucide-react';

/**
 * View Component: FoundItemsFilters
 * Search, export, manual input button, and 3 clean filter dropdowns.
 */
export function FoundItemsFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  onOpenManualModal,
  onExportCSV
}) {
  const categories = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'Elektronik', label: 'Elektronik' },
    { value: 'Dompet / Tas', label: 'Dompet / Tas' },
    { value: 'Perhiasan & Jam', label: 'Perhiasan & Jam' },
    { value: 'Pakaian', label: 'Pakaian' },
    { value: 'Dokumen', label: 'Dokumen / Paspor' }
  ];

  const statuses = [
    { value: 'all', label: 'Semua Status' },
    { value: 'Di Brankas FO', label: 'Di Brankas FO' },
    { value: 'Sudah Diambil', label: 'Sudah Diambil' },
    { value: 'Dalam Proses', label: 'Dalam Proses' }
  ];

  return (
    <div className="found-items-toolbar-card">
      <div className="toolbar-top-row">
        <div className="table-search-input-box">
          <Search size={15} className="search-icon-muted" />
          <input
            type="text"
            className="inventory-search-field"
            placeholder="Cari No. Registrasi, nama barang, nomor kamar, atau nama petugas..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="toolbar-action-buttons">
          <button
            type="button"
            className="btn-add-found-amber"
            onClick={onOpenManualModal}
          >
            <Plus size={15} />
            <span>+ Input Temuan Manual</span>
          </button>
        </div>
      </div>

      {/* Filter Dropdowns Row */}
      <div className="toolbar-filters-grid">
        {/* Kategori */}
        <div className="filter-select-wrapper">
          <Layers size={14} className="filter-prefix-icon" />
          <select
            className="filter-native-select"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="filter-select-wrapper">
          <CheckSquare size={14} className="filter-prefix-icon" />
          <select
            className="filter-native-select"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default FoundItemsFilters;
