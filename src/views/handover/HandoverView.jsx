import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import Sidebar from '../dashboard/components/Sidebar';
import TopNavbar from '../dashboard/components/TopNavbar';
import HandoverPartySummary from './components/HandoverPartySummary';
import HandoverChecklistSection from './components/HandoverChecklistSection';
import HandoverProofSection from './components/HandoverProofSection';
import HandoverFooterActions from './components/HandoverFooterActions';
import HandoverModals from './components/HandoverModals';
import useHandoverController from '../../controllers/useHandoverController';
import { StorageService } from '../../services/StorageService';
import './HandoverView.css';

/**
 * View Component: HandoverView (8. Handover Screen)
 * Decomposed clean modular MVC View for Grand Melia Front Office Handover.
 */
export function HandoverView({ 
  activeNav = 'Handover', 
  onNavChange, 
  onLogout 
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
  } = useHandoverController();

  const [searchQuery, setSearchQuery] = useState('');
  const auditLogs = StorageService.getAuditLogs();

  return (
    <div className="handover-app-layout">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeNav={activeNav}
        onNavChange={onNavChange}
        onLogout={onLogout}
      />

      {/* 2. Main Viewport Container */}
      <div className="handover-main-viewport">
        <TopNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Main Content Workspace */}
        <main className="handover-scrollable-content">
          {/* Header & Status Section */}
          <div className="handover-page-header">
            <div className="handover-header-left">
              <div className="handover-breadcrumb-meta">
                <span className="desk-origin-tag">FRONT OFFICE DESK</span>
                <span className="dot-sep">•</span>
                <span className="ticket-id-tag">{data.ticketId}</span>
                <span className="slash-sep">/</span>
                <span className="item-id-tag">{data.itemId}</span>
              </div>
              <h1 className="handover-main-title">
                Proses Handover &amp; Penyelesaian Tiket
              </h1>
            </div>

            <div className="handover-header-right">
              <div className="status-verified-badge" title="Barang telah terverifikasi dan siap diserahkan">
                <span className="badge-pulse-dot"></span>
                <span className="badge-status-text">TERVERIFIKASI (SIAP DIAMBIL)</span>
                <HelpCircle size={14} className="help-icon-muted" />
              </div>
            </div>
          </div>

          {/* Top 4-Card Party Summary Bar */}
          <HandoverPartySummary
            guest={data.guest}
            item={data.item}
            vault={data.vault}
            officer={data.officer}
          />

          {/* Main 2-Column Handover Body */}
          <div className="handover-2col-grid">
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
        </main>

        {/* Sticky Bottom Operational Action Bar */}
        <HandoverFooterActions
          isResolved={isResolved}
          isReadyForResolution={isReadyForResolution}
          onPrintPDF={handlePrintPDF}
          onSendWhatsApp={handleSendWhatsApp}
          onOpenAuditLog={handleOpenAuditLog}
          onResolveTicket={() => handleResolveTicket(() => {
            if (onNavChange) onNavChange('Tiket Klaim');
          })}
        />
      </div>

      {/* Modals: PDF Receipt Preview & Audit Logs */}
      <HandoverModals
        isPreviewModalOpen={isPreviewModalOpen}
        isAuditModalOpen={isAuditModalOpen}
        document={data.document}
        auditLogs={auditLogs}
        onClosePreview={() => setIsPreviewModalOpen(false)}
        onCloseAudit={() => setIsAuditModalOpen(false)}
      />

      {/* Toast Notifications */}
      {toastNotification && (
        <div className={`operational-toast-pill ${toastNotification.type}`}>
          {toastNotification.type === 'warning' ? (
            <AlertTriangle size={16} />
          ) : (
            <CheckCircle2 size={16} />
          )}
          <span>{toastNotification.message}</span>
        </div>
      )}
    </div>
  );
}

export default HandoverView;
