import { useState } from 'react';
import initialHandoverData from '../models/HandoverModel';
import { StorageService } from '../services/StorageService';

/**
 * Controller Hook: useHandoverController
 * Manages operational state and user interactions for the Handover & Ticket Resolution screen.
 * Follows strict MVC separation of concerns.
 */
export function useHandoverController() {
  const [data, setData] = useState(initialHandoverData);
  const [isResolved, setIsResolved] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastNotification({ message, type });
    setTimeout(() => setToastNotification(null), 3500);
  };

  const toggleChecklist = (field) => {
    setData(prev => ({
      ...prev,
      checklists: {
        ...prev.checklists,
        [field]: !prev.checklists[field]
      }
    }));
  };

  const setPickupMethod = (method) => {
    setData(prev => ({
      ...prev,
      pickupMethod: method
    }));
  };

  const handleNotesChange = (notes) => {
    setData(prev => ({
      ...prev,
      additionalNotes: notes
    }));
  };

  const handleResolveTicket = (onComplete) => {
    const allChecked = Object.values(data.checklists).every(Boolean);
    if (!allChecked) {
      showToast('Harap lengkapi semua checklist verifikasi (3/3) sebelum menyelesaikan tiket.', 'warning');
      return;
    }

    setIsResolved(true);
    // Persist status change in StorageService
    StorageService.updateTicketStatus(data.ticketId, 'Selesai Handover');
    showToast(`Tiket ${data.ticketId} berhasil ditutup dan diselesaikan (Handover Selesai)!`);
    if (onComplete) {
      setTimeout(() => {
        onComplete();
      }, 1200);
    }
  };

  const handlePrintPDF = () => {
    showToast('Membuat dokumen Tanda Terima Serah Terima PDF...');
    window.print();
  };

  const handleSendWhatsApp = () => {
    showToast(`Notifikasi serah terima berhasil dikirim via WhatsApp ke ${data.guest.phone}!`);
  };

  const handleOpenAuditLog = () => {
    setIsAuditModalOpen(true);
  };

  const checkedCount = Object.values(data.checklists).filter(Boolean).length;
  const isReadyForResolution = checkedCount === 3;

  return {
    data,
    isResolved,
    isPreviewModalOpen,
    setIsPreviewModalOpen,
    isAuditModalOpen,
    setIsAuditModalOpen,
    toastNotification,
    checkedCount,
    isReadyForResolution,
    toggleChecklist,
    setPickupMethod,
    handleNotesChange,
    handleResolveTicket,
    handlePrintPDF,
    handleSendWhatsApp,
    handleOpenAuditLog,
    showToast
  };
}

export default useHandoverController;
