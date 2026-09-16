import { useState, useEffect } from 'react';
import { StorageService } from '../services/StorageService';

/**
 * Controller Hook: useHandoverController
 * Manages operational state and user interactions for the Handover & Ticket Resolution screen.
 * Resolves data directly from the active Match (MatchModel), deriving related guest (ClaimTicket)
 * and item (FoundItem) data without duplicating state.
 */
export function useHandoverController({ matchId = null, ticket: propTicket = null, matchedItem: propItem = null } = {}) {
  const getInitialState = () => {
    const matches = StorageService.getMatches();
    const resolvedMatchId = matchId || propItem?.id;
    const activeMatch = resolvedMatchId
      ? matches.find((m) => m.id === resolvedMatchId || m.lost_report_id === propTicket?.id)
      : matches.find((m) => m.status === 'approved') || matches[0];

    const tickets = StorageService.getTickets();
    const foundItems = StorageService.getFoundItems();

    const ticket = propTicket || (activeMatch
      ? tickets.find((t) => t.id === activeMatch.lost_report_id) || tickets[0]
      : tickets[0]);

    const item = (propItem?.rawItem || propItem) || (activeMatch
      ? foundItems.find((i) => i.id === activeMatch.found_report_id) || foundItems[0]
      : foundItems[0]);

    const isMatchResolved = activeMatch?.status === 'completed' || ticket?.status === 'Selesai Handover';

    return {
      matchId: activeMatch?.id || resolvedMatchId || propItem?.id || '#M-2024-0001',
      ticketId: ticket?.id || activeMatch?.lost_report_id || '-',
      itemId: item?.id || activeMatch?.found_report_id || '-',
      status: isMatchResolved
        ? 'SELESAI HANDOVER'
        : activeMatch?.status === 'approved'
          ? 'TERVERIFIKASI (SIAP DIAMBIL)'
          : 'MENUNGGU VERIFIKASI',
      timestamp: activeMatch?.contact_shared_at || activeMatch?.createdAt || '-',
      guest: {
        name: ticket?.guestName || ticket?.lostReport?.contactName || 'Tamu Hotel',
        room: ticket?.roomNumber || ticket?.lostReport?.location || '-',
        roomType: ticket?.roomType || 'Deluxe Room',
        phone: ticket?.phone || ticket?.phoneNumber || '-',
        idCard: ticket?.id || '-',
        idType: 'KTP'
      },
      item: {
        name: item?.name || item?.foundReport?.title || ticket?.itemName || '-',
        edition: item?.rawItem?.name || item?.rawItem?.category || ticket?.brand || item?.name || '-',
        serialNumber: item?.id || '-',
        finder: item?.finderName || item?.foundReport?.finderInfo || '-',
        location: item?.locationFound || item?.roomNumber || '-',
        image: item?.photoUrl || item?.foundReport?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=480&auto=format&fit=crop&q=80'
      },
      vault: {
        lockerId: item?.storageLocation || 'Brankas Utama',
        name: 'Brankas Utama FO',
        keyTag: item?.storageLocation || '-'
      },
      officer: {
        name: activeMatch?.verified_by || 'Duty Manager FO',
        role: 'Duty Manager Front Office'
      },
      checklists: activeMatch?.handover_checklists || {
        physicalIdVerified: isMatchResolved,
        biometricRoomMatched: isMatchResolved,
        itemInspectedByGuest: isMatchResolved
      },
      pickupMethod: activeMatch?.handover_method || 'direct',
      document: {
        title: 'Tanda Terima Serah Terima',
        filename: 'Tanda_Terima.pdf',
        fileSize: '1.2 MB',
        size: '1.2 MB',
        uploadedAt: activeMatch?.resolved_at || 'Hari ini',
        uploader: activeMatch?.handover_by || 'Duty Manager FO',
        previewUrl: activeMatch?.handover_document_url || ''
      },
      additionalNotes: activeMatch?.activity_note || ''
    };
  };

  const [data, setData] = useState(getInitialState);
  const [isResolved, setIsResolved] = useState(() => {
    const matches = StorageService.getMatches();
    const resolvedMatchId = matchId || propItem?.id;
    const activeMatch = resolvedMatchId
      ? matches.find((m) => m.id === resolvedMatchId || m.lost_report_id === propTicket?.id)
      : matches.find((m) => m.status === 'approved') || matches[0];
    return activeMatch?.status === 'completed' || propTicket?.status === 'Selesai Handover';
  });

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState(null);

  // Sync state whenever matchId, ticket, or item props change
  useEffect(() => {
    const state = getInitialState();
    setData(state);
    const matches = StorageService.getMatches();
    const resolvedMatchId = matchId || propItem?.id;
    const activeMatch = resolvedMatchId
      ? matches.find((m) => m.id === resolvedMatchId || m.lost_report_id === propTicket?.id)
      : matches.find((m) => m.status === 'approved') || matches[0];
    setIsResolved(activeMatch?.status === 'completed' || propTicket?.status === 'Selesai Handover');
  }, [matchId, propTicket?.id, propItem?.id]);

  const showToast = (message, type = 'success') => {
    setToastNotification({ message, type });
    setTimeout(() => setToastNotification(null), 3500);
  };

  const toggleChecklist = (field) => {
    setData((prev) => ({
      ...prev,
      checklists: {
        ...prev.checklists,
        [field]: !prev.checklists[field]
      }
    }));
  };

  const setPickupMethod = (method) => {
    setData((prev) => ({
      ...prev,
      pickupMethod: method
    }));
  };

  const handleNotesChange = (notes) => {
    setData((prev) => ({
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
    // Persist status change directly to Match in StorageService as Single Source of Truth
    StorageService.updateMatchStatus(data.matchId, 'completed', {
      handover_checklists: data.checklists,
      handover_method: data.pickupMethod,
      handover_by: data.officer.name,
      resolved_at: new Date().toISOString(),
      activity_note: data.additionalNotes || 'Handover selesai dan diserahkan ke tamu'
    });

    if (data.ticketId && data.ticketId !== '-') {
      StorageService.updateTicketStatus(data.ticketId, 'Selesai Handover');
    }

    showToast(`Handover Match #${data.matchId} (Tiket ${data.ticketId}) berhasil diselesaikan!`);
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
