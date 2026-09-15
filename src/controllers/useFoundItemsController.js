import { useState, useMemo } from 'react';
import { 
  masterFoundItems, 
  foundItemsKpi, 
  roomFilterOptions, 
  categoryFilterOptions, 
  dateRangeOptions, 
  statusFilterOptions 
} from '../models/FoundItemsModel';

/**
 * Controller: useFoundItemsController
 * Manages operational state for Screen 9: Log Barang Temuan (Master Inventory).
 * Follows strict MVC architecture.
 */
export function useFoundItemsController() {
  const [items, setItems] = useState(masterFoundItems);
  const [kpi, setKpi] = useState(foundItemsKpi);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(roomFilterOptions[0]);
  const [selectedCategory, setSelectedCategory] = useState(categoryFilterOptions[0]);
  const [selectedDateRange, setSelectedDateRange] = useState(dateRangeOptions[0]);
  const [selectedStatus, setSelectedStatus] = useState(statusFilterOptions[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState(null);

  // Manual input form state
  const [manualFormData, setManualFormData] = useState({
    roomNumber: '',
    category: 'Elektronik',
    title: '',
    position: '',
    storageLocation: 'Loker FO B-12'
  });

  const showToast = (message, type = 'success') => {
    setToastNotification({ message, type });
    setTimeout(() => setToastNotification(null), 3500);
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesQuery = 
          item.regNumber.toLowerCase().includes(query) ||
          item.title.toLowerCase().includes(query) ||
          item.roomNumber.toLowerCase().includes(query) ||
          item.finder.name.toLowerCase().includes(query) ||
          item.position.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // Category filter
      if (selectedCategory !== categoryFilterOptions[0] && item.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (selectedStatus !== statusFilterOptions[0] && item.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [items, searchQuery, selectedCategory, selectedStatus]);

  const handleExportCSV = () => {
    showToast('Mengunduh Log_Barang_Temuan_GrandMelia.csv (42 Item)...');
  };

  const handleManualFormChange = (field, value) => {
    setManualFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleManualFormSubmit = (e) => {
    e.preventDefault();
    if (!manualFormData.title.trim() || !manualFormData.roomNumber.trim()) {
      showToast('Harap isi nama barang dan nomor kamar!', 'warning');
      return;
    }

    const newItem = {
      id: `LF-2024-${Date.now().toString().slice(-6)}`,
      regNumber: `#LF-2024-0314-${(items.length + 10).toString().padStart(2, '0')}`,
      roomNumber: manualFormData.roomNumber,
      roomBadge: `Kamar ${manualFormData.roomNumber}`,
      category: manualFormData.category,
      title: manualFormData.title,
      position: manualFormData.position || 'Area Kamar',
      finder: {
        initial: 'B',
        name: 'Budi Santoso',
        dept: 'FO'
      },
      foundTime: 'Hari ini, Baru saja',
      storageLocation: {
        type: 'vault',
        label: manualFormData.storageLocation,
        badgeClass: 'badge-gold'
      },
      status: 'Belum Diklaim',
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=160&auto=format&fit=crop&q=80'
    };

    setItems(prev => [newItem, ...prev]);
    setKpi(prev => ({
      ...prev,
      totalActive: prev.totalActive + 1,
      inVault: prev.inVault + 1
    }));
    setIsManualModalOpen(false);
    setManualFormData({
      roomNumber: '',
      category: 'Elektronik',
      title: '',
      position: '',
      storageLocation: 'Loker FO B-12'
    });
    showToast(`Barang temuan baru ${newItem.regNumber} berhasil didaftarkan ke Master Inventory!`);
  };

  return {
    items: filteredItems,
    allCount: items.length,
    kpi,
    searchQuery,
    setSearchQuery,
    selectedRoom,
    setSelectedRoom,
    selectedCategory,
    setSelectedCategory,
    selectedDateRange,
    setSelectedDateRange,
    selectedStatus,
    setSelectedStatus,
    currentPage,
    setCurrentPage,
    isManualModalOpen,
    setIsManualModalOpen,
    manualFormData,
    handleManualFormChange,
    handleManualFormSubmit,
    handleExportCSV,
    toastNotification,
    showToast
  };
}

export default useFoundItemsController;
