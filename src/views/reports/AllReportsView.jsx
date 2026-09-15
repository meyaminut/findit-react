import React from 'react';
import FoundItemsLogView from './FoundItemsLogView';

/**
 * View Component: AllReportsView (Screen 9: Log Barang Temuan - Master Inventory)
 * Re-routes directly to the official FoundItemsLogView.
 */
export function AllReportsView({ activeNav = 'Barang Temuan', onNavChange, onLogout }) {
  return (
    <FoundItemsLogView
      activeNav={activeNav}
      onNavChange={onNavChange}
      onLogout={onLogout}
    />
  );
}

export default AllReportsView;
