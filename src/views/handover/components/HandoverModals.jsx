import React from 'react';
import { X, FileText, CheckCircle2 } from 'lucide-react';

export function HandoverModals({
  isPreviewModalOpen,
  isAuditModalOpen,
  document,
  auditLogs = [],
  onClosePreview,
  onCloseAudit
}) {
  return (
    <>
      {/* Modal 1: Preview Signed PDF Tanda Terima */}
      {isPreviewModalOpen && (
        <div className="handover-modal-backdrop" onClick={onClosePreview}>
          <div className="handover-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-bar">
              <div className="modal-title-left">
                <FileText size={18} className="modal-icon-blue" />
                <h3 className="modal-title-text">{document.title}</h3>
              </div>
              <button 
                type="button" 
                className="modal-close-icon-btn"
                onClick={onClosePreview}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-scrollable-body">
              <div className="mock-receipt-paper">
                <div className="receipt-paper-header">
                  <h2 className="hotel-letterhead">GRAND MELIA JAKARTA</h2>
                  <p className="letterhead-sub">LOST &amp; FOUND SERAH TERIMA DOKUMEN RESMI</p>
                </div>

                <div className="receipt-content-lines">
                  <div className="receipt-row">
                    <span>Nomor Tiket:</span>
                    <strong>#TK-2024-0314</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Nama Tamu Penerima:</span>
                    <strong>Hendra Gunawan (Kamar 314)</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Barang Diterima:</span>
                    <strong>Garmin Venu SQ Music (S/N: GR-8921-X)</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Waktu Penyerahan:</span>
                    <strong>14 Maret 2024, 14:15 WIB</strong>
                  </div>
                </div>

                {/* Simulated Signature Section */}
                <div className="receipt-signatures-grid">
                  <div className="signature-col">
                    <span className="sign-title">Penerima Barang (Tamu)</span>
                    <div className="signature-box signed">
                      <span className="mock-handwriting">Hendra G.</span>
                    </div>
                    <span className="sign-name">Hendra Gunawan</span>
                  </div>

                  <div className="signature-col">
                    <span className="sign-title">Petugas Penyerah (FO)</span>
                    <div className="signature-box signed">
                      <span className="mock-handwriting">Dimas FO</span>
                    </div>
                    <span className="sign-name">Dimas Wicaksono</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-bottom-bar">
              <button 
                type="button" 
                className="btn-modal-cancel"
                onClick={onClosePreview}
              >
                Tutup Pratinjau
              </button>
              <button 
                type="button" 
                className="btn-modal-primary"
                onClick={() => window.print()}
              >
                Cetak Dokumen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Handover Audit Log Timeline */}
      {isAuditModalOpen && (
        <div className="handover-modal-backdrop" onClick={onCloseAudit}>
          <div className="handover-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-bar">
              <div className="modal-title-left">
                <h3 className="modal-title-text">Riwayat Aktivitas &amp; Audit Log Tiket</h3>
              </div>
              <button 
                type="button" 
                className="modal-close-icon-btn"
                onClick={onCloseAudit}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-scrollable-body">
              <div className="audit-timeline-list">
                {auditLogs.length > 0 ? (
                  auditLogs.map((log) => (
                    <div key={log.id} className="audit-timeline-item">
                      <div className="timeline-dot-green">
                        <CheckCircle2 size={13} />
                      </div>
                      <div className="timeline-item-content">
                        <span className="timeline-time">{log.time}</span>
                        <p className="timeline-text">{log.text}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-500">
                    Belum ada riwayat audit log tercatat.
                  </div>
                )}
              </div>
            </div>

            <div className="modal-bottom-bar">
              <button 
                type="button" 
                className="btn-modal-cancel"
                onClick={onCloseAudit}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HandoverModals;
