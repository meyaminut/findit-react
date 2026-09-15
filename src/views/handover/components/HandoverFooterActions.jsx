import React from 'react';
import { Printer, Send, History, CheckCircle2 } from 'lucide-react';

export function HandoverFooterActions({
  isResolved,
  isReadyForResolution,
  onPrintPDF,
  onSendWhatsApp,
  onOpenAuditLog,
  onResolveTicket
}) {
  return (
    <footer className="handover-sticky-footer">
      <div className="footer-left-actions">
        <button 
          type="button" 
          className="btn-footer-neutral"
          onClick={onPrintPDF}
        >
          <Printer size={15} />
          <span>Cetak Tanda Terima (PDF)</span>
        </button>

        <button 
          type="button" 
          className="btn-footer-neutral"
          onClick={onSendWhatsApp}
        >
          <Send size={15} />
          <span>Kirim Konfirmasi WA</span>
        </button>

        <button 
          type="button" 
          className="btn-footer-neutral"
          onClick={onOpenAuditLog}
        >
          <History size={15} />
          <span>Audit Log</span>
        </button>
      </div>

      <div className="footer-right-actions">
        <button
          type="button"
          disabled={!isReadyForResolution || isResolved}
          className={`btn-resolve-ticket-gold ${isResolved ? 'resolved-state' : ''}`}
          onClick={onResolveTicket}
        >
          <CheckCircle2 size={16} />
          <span>
            {isResolved 
              ? '✓ Tiket Selesai & Ditutup' 
              : 'Tutup Tiket — Selesai Handover'}
          </span>
        </button>
      </div>
    </footer>
  );
}

export default HandoverFooterActions;
