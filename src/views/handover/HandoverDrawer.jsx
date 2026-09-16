import React, { useState } from 'react';
import { X, HelpCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import HandoverPartySummary from './components/HandoverPartySummary';
import HandoverChecklistSection from './components/HandoverChecklistSection';
import HandoverProofSection from './components/HandoverProofSection';
import HandoverFooterActions from './components/HandoverFooterActions';
import HandoverModals from './components/HandoverModals';
import useHandoverController from '../../controllers/useHandoverController';
import { StorageService } from '../../services/StorageService';
import './HandoverView.css';
import './HandoverDrawer.css';

/**
 * View Component: HandoverDrawer
 * Slide-over drawer panel for Handover & Ticket Resolution.
 * Includes unsaved changes guard to prevent accidental closure.
 */
export function HandoverDrawer({
  isOpen = false,
  ticket = null,
  matchedItem = null,
  matchId = null,
  onClose,
  onComplete
}) {
  const {
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
    handleOpenAuditLog
  } = useHandoverController({ matchId, ticket, matchedItem });

  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const auditLogs = StorageService.getAuditLogs();

  if (!isOpen) return null;

  // Track if user made changes that haven't been completed/saved
  const hasUnsavedChanges =
    !isResolved &&
    (checkedCount > 0 ||
      (data.additionalNotes && data.additionalNotes.trim().length > 0) ||
      data.pickupMethod !== 'direct');

  const handleRequestClose = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedModal(true);
    } else {
      onClose && onClose();
    }
  };

  const handleConfirmDiscard = () => {
    setShowUnsavedModal(false);
    onClose && onClose();
  };

  const handleFinishHandover = () => {
    handleResolveTicket(() => {
      if (onComplete) onComplete();
      onClose && onClose();
    });
  };

  return (
    <>
      {/* 1. Semi-transparent backdrop over main content area */}
      <div 
        className="handover-drawer-backdrop" 
        onClick={handleRequestClose}
        aria-label="Tutup form handover"
      />

      {/* 2. Slide-over Panel */}
      <div 
        className="handover-drawer-panel" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="handover-drawer-heading"
      >
        {/* Drawer Top Header */}
        <div className="handover-drawer-header">
          <div className="handover-drawer-header-left">
            <div className="handover-breadcrumb-meta">
              <span className="desk-origin-tag">FRONT OFFICE DESK</span>
              <span className="dot-sep">•</span>
              <span className="ticket-id-tag">{data.ticketId}</span>
              <span className="slash-sep">/</span>
              <span className="item-id-tag">{data.itemId}</span>
            </div>
            <h2 id="handover-drawer-heading" className="handover-drawer-title">
              Form Serah Terima (Handover)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="status-verified-badge hidden sm:flex" title="Barang telah terverifikasi dan siap diserahkan">
              <span className="badge-pulse-dot"></span>
              <span className="badge-status-text">
                {isResolved ? 'SELESAI HANDOVER' : 'TERVERIFIKASI'}
              </span>
            </div>
            <button
              type="button"
              className="handover-drawer-close-btn"
              onClick={handleRequestClose}
              title="Tutup Panel Handover"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="handover-drawer-body">
          {/* Party Summary */}
          <HandoverPartySummary
            guest={data.guest}
            item={data.item}
            vault={data.vault}
            officer={data.officer}
          />

          {/* Stacked Handover Form Sections */}
          <div className="handover-drawer-stacked-sections">
            <HandoverChecklistSection
              checklists={data.checklists}
              guest={data.guest}
              item={data.item}
              isReadyForResolution={isReadyForResolution}
              checkedCount={checkedCount}
              onToggleChecklist={toggleChecklist}
            />

            <HandoverProofSection
              document={data.document}
              pickupMethod={data.pickupMethod}
              additionalNotes={data.additionalNotes}
              onPickupMethodChange={setPickupMethod}
              onNotesChange={handleNotesChange}
              onPreviewModalOpen={() => setIsPreviewModalOpen(true)}
            />
          </div>
        </div>

        {/* Sticky Drawer Footer */}
        <div className="handover-drawer-footer">
          <HandoverFooterActions
            isResolved={isResolved}
            isReadyForResolution={isReadyForResolution}
            onPrintPDF={handlePrintPDF}
            onSendWhatsApp={handleSendWhatsApp}
            onOpenAuditLog={handleOpenAuditLog}
            onResolveTicket={handleFinishHandover}
          />
        </div>
      </div>

      {/* 3. Unsaved Changes Guard Confirmation Dialog */}
      {showUnsavedModal && (
        <div className="unsaved-confirm-backdrop" onClick={() => setShowUnsavedModal(false)}>
          <div 
            className="unsaved-confirm-card" 
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-labelledby="unsaved-title"
          >
            <div className="unsaved-confirm-icon-box">
              <AlertTriangle size={24} />
            </div>
            <h3 id="unsaved-title" className="unsaved-confirm-title">
              Perubahan Belum Disimpan
            </h3>
            <p className="unsaved-confirm-desc">
              Perubahan belum disimpan. Yakin mau menutup form handover ini? Data verifikasi checklist atau catatan yang baru saja Anda masukkan akan dibuang.
            </p>
            <div className="unsaved-confirm-actions">
              <button
                type="button"
                className="btn-confirm-cancel"
                onClick={() => setShowUnsavedModal(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn-confirm-discard"
                onClick={handleConfirmDiscard}
              >
                Ya, Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modals: PDF Receipt Preview & Audit Logs */}
      <HandoverModals
        isPreviewModalOpen={isPreviewModalOpen}
        isAuditModalOpen={isAuditModalOpen}
        document={data.document}
        auditLogs={auditLogs}
        onClosePreview={() => setIsPreviewModalOpen(false)}
        onCloseAudit={() => setIsAuditModalOpen(false)}
      />

      {/* 5. Inline Toast Notification */}
      {toastNotification && (
        <div 
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '24px',
            zIndex: 1250,
            background: toastNotification.type === 'warning' ? '#FEF3C7' : '#DCFCE7',
            color: toastNotification.type === 'warning' ? '#92400E' : '#166534',
            border: `1px solid ${toastNotification.type === 'warning' ? '#FCD34D' : '#86EFAC'}`,
            borderRadius: '10px',
            padding: '10px 16px',
            fontWeight: 700,
            fontSize: '13px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          {toastNotification.message}
        </div>
      )}
    </>
  );
}

export default HandoverDrawer;
