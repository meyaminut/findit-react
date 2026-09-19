import { useState, useMemo, useEffect, useCallback } from 'react';
import ApiService from '../services/ApiService';
import { ACCESS_PROTOCOL } from '../models/AdminManagementModel';

export const WORKER_DEFAULT_PASSWORD = 'findit123';

/**
 * Controller Hook: useAdminManagementController
 * Kelola Pekerja / Room Attendant — API-first (langsung ke backend, tanpa data fiktif).
 * Operasi: list (GET /users/list), create (POST /register), update (PUT /users/:id),
 * delete (DELETE /users/:id). Error server ditampilkan apa adanya lewat toast.
 */
export function useAdminManagementController() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'active'
  const [searchQuery, setSearchQuery] = useState('');
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [editing, setEditing] = useState(null);
  const [toastNotification, setToastNotification] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    role: 'worker',
    email: '',
    phone: '',
    password: ''
  });

  const showToast = useCallback((message, type = 'success') => {
    setToastNotification({ message, type, id: Date.now() });
    setTimeout(() => setToastNotification(null), 4000);
  }, []);

  const getErrorMessage = useCallback((err) => {
    if (!err) return 'Terjadi kesalahan tak terduga.';
    if (err.status === 401) return 'Sesi berakhir. Silakan masuk kembali.';
    if (err.status === 403) return 'Anda tidak memiliki izin untuk operasi ini.';
    if (err.status === 409) return err.message || 'Data tersebut sudah ada / tidak dapat dihapus.';
    return err.message || `Server menolak permintaan (HTTP ${err.status || '?'}).`;
  }, []);

  const loadWorkers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ApiService.getWorkers();
      setWorkers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('[useAdminManagementController] loadWorkers failed:', err);
      setWorkers([]);
      showToast('Gagal memuat data pekerja: ' + getErrorMessage(err), 'warning');
    } finally {
      setLoading(false);
    }
  }, [showToast, getErrorMessage]);

  // Muat data saat mount — setState dipanggil di dalam callback async (setelah
  // await), bukan sinkron di dalam body effect.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await ApiService.getWorkers();
        if (cancelled) return;
        setWorkers(Array.isArray(data) ? data : []);
      } catch (err) {
        if (cancelled) return;
        console.warn('[useAdminManagementController] loadWorkers failed:', err);
        setWorkers([]);
        showToast('Gagal memuat data pekerja: ' + getErrorMessage(err), 'warning');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showToast, getErrorMessage]);

  const filteredWorkers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return workers.filter((w) => {
      const matchesTab = filterTab === 'all' || (filterTab === 'active' && w.role === 'worker');
      const matchesSearch =
        !q ||
        (w.name || '').toLowerCase().includes(q) ||
        (w.email || '').toLowerCase().includes(q) ||
        (w.role || '').toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [workers, filterTab, searchQuery]);

  const totalCount = workers.length;
  const activeCount = useMemo(
    () => workers.filter((w) => w.role === 'worker').length,
    [workers]
  );

  const resetFormData = () => {
    setFormData({ name: '', role: 'worker', email: '', phone: '', password: '' });
  };

  const handleOpenAddModal = () => {
    resetFormData();
    setEditing(null);
    setModalMode('add');
  };

  const handleOpenEditModal = (worker) => {
    setFormData({
      name: worker.name || '',
      role: worker.role === 'user' ? 'user' : 'worker',
      email: worker.email || '',
      phone: worker.phone || '',
      password: ''
    });
    setEditing(worker);
    setModalMode('edit');
  };

  const handleCloseModal = () => {
    if (saving) return;
    setModalMode(null);
    setEditing(null);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async (e) => {
    if (e) e.preventDefault();
    if (saving) return;

    if (!formData.name.trim()) {
      showToast('Mohon isi nama lengkap pekerja.', 'warning');
      return;
    }
    if (!formData.email.trim()) {
      showToast('Mohon isi email kerja pekerja.', 'warning');
      return;
    }
    if (
      modalMode === 'edit' &&
      formData.password.trim() &&
      formData.password.trim().length < 6
    ) {
      showToast('Password baru minimal 6 karakter.', 'warning');
      return;
    }

    setSaving(true);
    try {
      if (modalMode === 'edit' && editing?.id) {
        const updated = await ApiService.updateWorker(editing.id, {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          role: formData.role,
          password: formData.password.trim()
        });
        showToast(
          `Pekerja ${updated?.name || formData.name.trim()} berhasil diperbarui${
            formData.password.trim() ? ' (termasuk password baru)' : ''
          }.`
        );
      } else {
        const created = await ApiService.createWorker({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          role: formData.role
        });
        showToast(
          `Pekerja ${created?.name || formData.name.trim()} ditambahkan. Password awal: ${WORKER_DEFAULT_PASSWORD}`
        );
      }
      setModalMode(null);
      setEditing(null);
      await loadWorkers();
    } catch (err) {
      showToast('Gagal menyimpan pekerja: ' + getErrorMessage(err), 'warning');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteWorker = async (workerId) => {
    const target = workers.find((w) => String(w.id) === String(workerId));
    const ok = window.confirm(
      `Hapus pekerja ${target?.name || 'ini'}? Tindakan ini menghapus akun dari sistem.`
    );
    if (!ok) return;

    try {
      setSaving(true);
      await ApiService.deleteWorker(workerId);
      showToast(`Pekerja ${target?.name || ''} telah dihapus.`);
      await loadWorkers();
    } catch (err) {
      showToast('Gagal menghapus pekerja: ' + getErrorMessage(err), 'warning');
    } finally {
      setSaving(false);
    }
  };

  return {
    workers: filteredWorkers,
    totalCount,
    activeCount,
    loading,
    saving,
    filterTab,
    setFilterTab,
    searchQuery,
    setSearchQuery,
    modalMode,
    editing,
    handleOpenAddModal,
    handleOpenEditModal,
    handleCloseModal,
    formData,
    handleFormChange,
    handleFormSubmit,
    handleDeleteWorker,
    protocol: {
      ...ACCESS_PROTOCOL,
      title: 'KEBIJAKAN AKSES PEKERJA',
      description:
        'Pekerja/room attendant membantu pelaporan barang temuan dan verifikasi klaim. Kelola akun pekerja dari halaman ini — perubahan langsung tersimpan ke server.',
      policyVersion: 'Worker RBAC v1.0'
    },
    toastNotification
  };
}

export default useAdminManagementController;