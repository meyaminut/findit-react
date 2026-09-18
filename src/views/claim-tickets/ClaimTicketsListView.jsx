import React, { useState, useEffect, useMemo } from 'react';
import { Ticket, Plus, CheckCircle2 } from 'lucide-react';
import Sidebar from '../dashboard/components/Sidebar';
import TopNavbar from '../dashboard/components/TopNavbar';
import ClaimTicketsToolbar from './components/ClaimTicketsToolbar';
import ClaimTicketsTable from './components/ClaimTicketsTable';
import StorageService from '../../services/StorageService';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useConfirmDialog } from '../../hooks/useConfirmDialog';
import './ClaimTicketsListView.css';

/**
 * View Component: ClaimTicketsListView
 * Dedicated operational screen for managing guest claim tickets.
 * Fully functional with real-time localStorage persistence and zero static dummy data.
 */
export function ClaimTicketsListView({
  activeNav = 'Tiket Klaim',
  onNavChange,
  onLogout
}) {
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toastNotification, setToastNotification] = useState(null);
  const confirmDialog = useConfirmDialog();

  const loadTickets = () => {
    setTickets(StorageService.getTickets());
  };

  useEffect(() => {
    loadTickets();
    const handleUpdate = () => loadTickets();
    window.addEventListener('findit_tickets_updated', handleUpdate);
    return () => window.removeEventListener('findit_tickets_updated', handleUpdate);
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.guestName.toLowerCase().includes(q) ||
        t.roomNumber.toLowerCase().includes(q) ||
        t.itemName.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [tickets, statusFilter, searchQuery]);

  const handleVerifyTicket = (ticket) => {
    if (onNavChange) {
      onNavChange('Verifikasi & Serah Terima');
    }
  };

  const handleHandoverTicket = (ticket) => {
    if (onNavChange) {
      onNavChange('Handover');
    }
  };

  const showToast = (message, type = 'success') => {
    setToastNotification({ message, type });
    setTimeout(() => setToastNotification(null), 3500);
  };

  const handleDeleteTicket = async (ticketId) => {
    const ticket = tickets.find((t) => t.id === ticketId);
    const ok = await confirmDialog.confirm({
      title: 'Hapus Tiket?',
      message: `Yakin ingin menghapus tiket ${ticket?.id || ticketId}? Tindakan ini tidak dapat dibatalkan.`,
    });
    if (!ok) return;
    StorageService.deleteTicket(ticketId);
    showToast(`Tiket ${ticket?.id || ticketId} berhasil dihapus.`, 'success');
  };

  const handleNewClaim = () => {
    if (onNavChange) {
      onNavChange('Buat Laporan Tamu');
    }
  };

  const handleExportCSV = () => {
    StorageService.exportToCSV(filteredTickets, `Tiket_Klaim_${Date.now()}.csv`);
  };

  const handleLoadSampleData = () => {
    StorageService.seedSampleData();
  };

  return (
    <div className="claim-tickets-app-layout">
      {/* 1. Left Sidebar */}
      <Sidebar
        activeNav={activeNav}
        onNavChange={onNavChange}
        onLogout={onLogout}
      />

      {/* 2. Main Viewport */}
      <div className="claim-tickets-viewport">
        <TopNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="claim-tickets-content">
          {/* Page Header */}
          <div className="claim-page-header">
            <div className="claim-header-left">
              <div className="claim-title-row">
                <div className="claim-icon-box">
                  <Ticket size={20} />
                </div>
                <h1 className="claim-main-title">Daftar Tiket Klaim Tamu</h1>
                <span className="claim-count-pill">{tickets.length} Tiket</span>
              </div>
              <p className="claim-subtitle">
                Laporan kehilangan barang berharga yang diajukan oleh tamu hotel di Grand Melia Jakarta.
              </p>
            </div>

            <button
              type="button"
              className="btn-header-add"
              onClick={handleNewClaim}
            >
              <Plus size={15} />
              <span>+ Buat Tiket Klaim Baru</span>
            </button>
          </div>

          {/* Search, Filter & Action Toolbar */}
          <ClaimTicketsToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            totalCount={tickets.length}
            onNewClaim={handleNewClaim}
            onExportCSV={handleExportCSV}
          />

          {/* Table or Clean Empty State */}
          <ClaimTicketsTable
            tickets={filteredTickets}
            onVerifyTicket={handleVerifyTicket}
            onHandoverTicket={handleHandoverTicket}
            onDeleteTicket={handleDeleteTicket}
            onNewClaim={handleNewClaim}
            onLoadSampleData={handleLoadSampleData}
          />
        </main>
      </div>

      {/* Confirm Dialog (pengganti window.confirm) */}
      {confirmDialog.dialog && <ConfirmDialog {...confirmDialog.dialog} />}

      {/* Toast Notification */}
      {toastNotification && (
        <div className={`claim-toast-pill ${toastNotification.type}`}>
          <CheckCircle2 size={16} />
          <span>{toastNotification.message}</span>
        </div>
      )}
    </div>
  );
}

export default ClaimTicketsListView;
