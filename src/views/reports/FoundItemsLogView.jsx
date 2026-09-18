import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Sidebar from '../dashboard/components/Sidebar';
import TopNavbar from '../dashboard/components/TopNavbar';
import FoundItemsKpiHeader from './components/FoundItemsKpiHeader';
import FoundItemsFilters from './components/FoundItemsFilters';
import FoundItemsTable from './components/FoundItemsTable';
import ManualFoundItemModal from './components/ManualFoundItemModal';
import StorageService from '../../services/StorageService';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useConfirmDialog } from '../../hooks/useConfirmDialog';
import './FoundItemsLogView.css';

/**
 * View Component: FoundItemsLogView (Screen 9: Master Inventory)
 * Modularized, clean architecture with dynamic localStorage storage and zero dummy data.
 */
export function FoundItemsLogView({
  activeNav = 'Barang Temuan',
  onNavChange,
  onLogout
}) {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState(null);
  const confirmDialog = useConfirmDialog();

  const loadItems = () => {
    setItems(StorageService.getFoundItems());
  };

  useEffect(() => {
    loadItems();
    const handleUpdate = () => loadItems();
    window.addEventListener('findit_items_updated', handleUpdate);
    return () => window.removeEventListener('findit_items_updated', handleUpdate);
  }, []);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesStat = selectedStatus === 'all' || item.status === selectedStatus;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        item.id.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.roomNumber.toLowerCase().includes(q) ||
        item.finderName.toLowerCase().includes(q);
      return matchesCat && matchesStat && matchesSearch;
    });
  }, [items, selectedCategory, selectedStatus, searchQuery]);

  // Dynamic KPI counts
  const inSafeCount = useMemo(() => items.filter((i) => i.status === 'Di Brankas FO').length, [items]);
  const returnedCount = useMemo(() => items.filter((i) => i.status === 'Sudah Diambil').length, [items]);

  const handleSaveManualItem = (formData) => {
    StorageService.addFoundItem(formData);
  };

  const showToast = (message, type = 'success') => {
    setToastNotification({ message, type });
    setTimeout(() => setToastNotification(null), 3500);
  };

  const handleDeleteItem = async (itemId) => {
    const item = items.find((i) => i.id === itemId);
    const ok = await confirmDialog.confirm({
      title: 'Hapus Barang?',
      message: `Hapus barang "${item?.name || itemId}" dari inventaris? Tindakan ini permanen dan tidak dapat dibatalkan.`,
    });
    if (!ok) return;
    StorageService.deleteFoundItem(itemId);
    showToast(`Barang temuan "${item?.name || itemId}" berhasil dihapus dari inventaris.`, 'success');
  };

  const handleExportCSV = () => {
    StorageService.exportToCSV(filteredItems, `Master_Inventory_${Date.now()}.csv`);
  };

  const handleLoadSampleData = () => {
    StorageService.seedSampleData();
  };

  return (
    <div className="found-items-app-layout">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeNav={activeNav}
        onNavChange={onNavChange}
        onLogout={onLogout}
      />

      {/* 2. Main Viewport */}
      <div className="found-items-main-viewport">
        <TopNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="found-items-scrollable-content">
          {/* Header & KPI Summary */}
          <FoundItemsKpiHeader
            totalCount={items.length}
            inSafeCount={inSafeCount}
            returnedCount={returnedCount}
          />

          {/* Search, Action & Filters Toolbar */}
          <FoundItemsFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            onOpenManualModal={() => setIsManualModalOpen(true)}
            onExportCSV={handleExportCSV}
          />

          {/* Table or Clean Empty State */}
          <FoundItemsTable
            items={filteredItems}
            onOpenManualModal={() => setIsManualModalOpen(true)}
            onLoadSampleData={handleLoadSampleData}
            onDeleteItem={handleDeleteItem}
          />
        </main>
      </div>

      {/* Modal Input Temuan Manual */}
      <ManualFoundItemModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSave={handleSaveManualItem}
      />

      {/* Confirm Dialog (pengganti window.confirm) */}
      {confirmDialog.dialog && <ConfirmDialog {...confirmDialog.dialog} />}

      {/* Toast Notification */}
      {toastNotification && (
        <div className={`inventory-toast-pill ${toastNotification.type}`}>
          <CheckCircle2 size={16} />
          <span>{toastNotification.message}</span>
        </div>
      )}
    </div>
  );
}

export default FoundItemsLogView;
