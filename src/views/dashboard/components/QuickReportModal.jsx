import { X, PlusCircle } from 'lucide-react';
import ReportLostForm from '../../components/ReportLostForm';
import { adminReportApi } from '../../../services/lostReport';

/**
 * View Component: QuickReportModal
 * Modal "+ Buat Laporan" yang dipicu dari Dashboard.
 * Form-nya reuse komponen bersama ReportLostForm (identik dengan form
 * laporan di sisi user dan full-page /admin/laporan/baru) — hanya beda
 * wrapper: modal vs full-page layout.
 */
export function QuickReportModal({ isOpen, onClose, onSave, isLoading }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top-bar">
          <div className="modal-title-wrap">
            <PlusCircle size={20} className="text-blue-600" />
            <h3 className="modal-heading">Buat Laporan</h3>
          </div>
          <button type="button" className="modal-close-icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="quick-report-form-scroll">
          <ReportLostForm
            api={adminReportApi}
            checkAuth={false}
            onSuccess={onSave || (() => {})}
            submitLabel={!isLoading ? 'Simpan Laporan' : undefined}
            footerNote="Laporan langsung diproses Front Office &amp; didaftarkan ke antrean Verifikasi."
          />
        </div>
      </div>
    </div>
  );
}

export default QuickReportModal;