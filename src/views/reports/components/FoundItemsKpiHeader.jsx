import React from 'react';
import { Package, Lock, CheckCircle2 } from 'lucide-react';

/**
 * View Component: FoundItemsKpiHeader
 * 3 clean white KPI cards for the Found Items Inventory.
 */
export function FoundItemsKpiHeader({ totalCount, inSafeCount, returnedCount }) {
  return (
    <div className="found-items-header-section">
      <div className="found-header-title-group">
        <div className="inventory-icon-box">
          <Package size={20} className="inventory-box-icon" />
        </div>
        <div className="inventory-titles">
          <h1 className="inventory-main-title">
            Log Barang Temuan (Master Inventory)
          </h1>
          <p className="inventory-subtitle">
            Seluruh barang temuan housekeeping &amp; staf hotel di Grand Melia Jakarta.
          </p>
        </div>
      </div>

      <div className="found-kpi-cards-group">
        {/* Card 1: Total Aktif */}
        <div className="found-kpi-card">
          <div className="kpi-icon-square blue">
            <Package size={16} />
          </div>
          <div className="kpi-text-stack">
            <span className="kpi-micro-label">TOTAL AKTIF</span>
            <span className="kpi-value-bold">{totalCount} Item</span>
          </div>
        </div>

        {/* Card 2: Di Brankas FO */}
        <div className="found-kpi-card">
          <div className="kpi-icon-square yellow">
            <Lock size={16} />
          </div>
          <div className="kpi-text-stack">
            <span className="kpi-micro-label">DI BRANKAS FO</span>
            <span className="kpi-value-bold">{inSafeCount} Item</span>
          </div>
        </div>

        {/* Card 3: Sudah Diambil */}
        <div className="found-kpi-card">
          <div className="kpi-icon-square green">
            <CheckCircle2 size={16} />
          </div>
          <div className="kpi-text-stack">
            <span className="kpi-micro-label">SUDAH DIAMBIL</span>
            <span className="kpi-value-bold">{returnedCount} Item</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoundItemsKpiHeader;
