import { useState, useMemo } from 'react';
import { INITIAL_ADMINS, ACCESS_PROTOCOL, ADMIN_METRICS } from '../models/AdminManagementModel';

/**
 * Controller Hook: useAdminManagementController
 * Manages administrative state, filtering, modal dialogs, and account actions.
 */
export function useAdminManagementController() {
  const [admins, setAdmins] = useState(INITIAL_ADMINS);
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'active'
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    role: 'Operations Specialist',
    email: '',
    mfaEnabled: true
  });

  const showToast = (message, type = 'success') => {
    setToastNotification({ message, type });
    setTimeout(() => {
      setToastNotification(null);
    }, 3500);
  };

  // Filtered accounts based on search query and active tab
  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) => {
      const matchesTab = filterTab === 'all' || admin.status === 'active';
      const matchesSearch =
        admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [admins, filterTab, searchQuery]);

  const activeCount = useMemo(() => {
    return admins.filter((a) => a.status === 'active').length;
  }, [admins]);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      role: 'Operations Specialist',
      email: '',
      mfaEnabled: true
    });
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleFormSubmit = (e) => {
    if (e) e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('Mohon isi nama lengkap dan email admin.', 'warning');
      return;
    }

    const newAdmin = {
      id: `adm-${Date.now().toString().slice(-4)}`,
      name: formData.name.trim(),
      role: formData.role,
      email: formData.email.trim().toLowerCase(),
      dateAdded: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      lastActive: 'Baru ditambahkan',
      status: 'active',
      isCurrentUser: false,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };

    setAdmins((prev) => [newAdmin, ...prev]);
    setIsAddModalOpen(false);
    showToast(`Akun administrator ${newAdmin.name} berhasil ditambahkan.`);
  };

  const handleToggleStatus = (adminId) => {
    setAdmins((prev) =>
      prev.map((a) => {
        if (a.id === adminId) {
          if (a.isCurrentUser) {
            showToast('Sesi aktif administrator saat ini tidak dapat dinonaktifkan.', 'warning');
            return a;
          }
          const nextStatus = a.status === 'active' ? 'inactive' : 'active';
          showToast(`Status akun ${a.name} diubah menjadi ${nextStatus}.`);
          return { ...a, status: nextStatus };
        }
        return a;
      })
    );
  };

  const handleDeleteAdmin = (adminId) => {
    const target = admins.find((a) => a.id === adminId);
    if (target?.isCurrentUser) {
      showToast('Tidak dapat menghapus sesi administrator Anda sendiri.', 'warning');
      return;
    }
    setAdmins((prev) => prev.filter((a) => a.id !== adminId));
    showToast(`Akun administrator ${target?.name || ''} telah dinonaktifkan.`);
  };

  return {
    admins: filteredAdmins,
    totalCount: admins.length,
    activeCount,
    filterTab,
    setFilterTab,
    searchQuery,
    setSearchQuery,
    isAddModalOpen,
    handleOpenAddModal,
    handleCloseAddModal,
    formData,
    handleFormChange,
    handleFormSubmit,
    handleToggleStatus,
    handleDeleteAdmin,
    protocol: ACCESS_PROTOCOL,
    metrics: {
      ...ADMIN_METRICS,
      authorizedSeats: {
        activeCount,
        totalAllocated: ADMIN_METRICS.authorizedSeats.totalAllocated
      }
    },
    toastNotification
  };
}

export default useAdminManagementController;
