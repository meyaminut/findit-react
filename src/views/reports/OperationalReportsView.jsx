import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  ChevronDown, 
  Trash2, 
  Eye, 
  Printer, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Folder, 
  Shield
} from 'lucide-react';
import Sidebar from '../dashboard/components/Sidebar';
import TopNavbar from '../dashboard/components/TopNavbar';
import ApiService from '../../services/ApiService';
import {
  isReportAwaiting,
  isReportVerified,
  isReportResolved,
  reportStatusLabel,
  reportStatusType,
} from '../../services/reportStatus';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useConfirmDialog } from '../../hooks/useConfirmDialog';
import './OperationalReportsView.css';

/**
 * View Component: OperationalReportsView (Halaman: Laporan)
 * API-first — daftar laporan diambil LIVE dari backend (type 'lost'),
 * konsisten dengan antrean Verifikasi (MatchReviewView), bukan localStorage.
 * Offline backend -> daftar kosong + banner peringatan.
 */
const mapApiLostReports = (list) => {
  if (!Array.isArray(list)) return [];
  return list.map((r) => {
    const id = r.id ?? r.ID;
    const dateStr = r.created_at
      ? new Date(r.created_at).toLocaleDateString('id-ID', {
          day: 'numeric', month: 'short', year: 'numeric'
        })
      : '';
    const timeStr = r.created_at
      ? new Date(r.created_at).toLocaleTimeString('id-ID', {
          hour: '2-digit', minute: '2-digit'
        })
      : '';
    const roomNumber = r.room_number || r.roomNumber || '';
    return {
      id: r.report_identifier || `#LAP-${id}`,
      _apiId: id,
      _source: 'api',
      title: r.title || 'Laporan Kehilangan Barang',
      reportType: 'lost_claim',
      category: r.category || 'Lainnya',
      reporterName: r.user?.name || r.guest_name || r.name || 'Tamu',
      reporterContact: roomNumber ? `Kamar ${roomNumber}` : '-',
      location: r.location || (roomNumber ? `Kamar ${roomNumber}` : 'Area Hotel'),
      priority: r.priority || 'Normal',
      description: r.description || '',
      officialOfficer: r.verified_by ? 'Petugas Pemeriksa' : 'Admin On Duty',
      statusRaw: r.status,
      status: reportStatusLabel(r.status, 'lost'),
      dateFormatted: `${dateStr}, ${timeStr} WIB`,
      createdAt: r.created_at || new Date().toISOString(),
    };
  });
};

// Fetch helper di luar komponen (modul murni, tanpa state) agar efek mount
// hanya memicu promise async — tidak ada setState sinkron di dalam efek.
const fetchLostReports = async () => {
  try {
    const [health, rawReports] = await Promise.all([
      ApiService.checkHealth(),
      ApiService.getReports('lost'),
    ]);
    if (!health.online) {
      return { online: false, reports: [] };
    }
    return { online: true, reports: mapApiLostReports(rawReports) };
  } catch (err) {
    console.warn('[OperationalReportsView] API tidak tersedia:', err.message);
    return { online: false, reports: [] };
  }
};

export function OperationalReportsView({ 
  activeNav = 'Laporan', 
  onNavChange, 
  onLogout 
}) {
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [previewReport, setPreviewReport] = useState(null);
  const [toastNotification, setToastNotification] = useState(null);
  const [apiChecked, setApiChecked] = useState(false);
  const [apiActive, setApiActive] = useState(false);
  const confirmDialog = useConfirmDialog();

  // API-first: tarik laporan kehilangan (lost) live dari backend — satu sumber
  // kebenaran yang sama dengan antrean Verifikasi. Tidak pakai localStorage.
  const loadApiReports = useCallback(async () => {
    try {
      const { online, reports: apiReports } = await fetchLostReports();
      setApiActive(online);
      setReports(apiReports);
    } finally {
      setApiChecked(true);
    }
  }, []);

  useEffect(() => {
    void loadApiReports();
    const handleUpdate = () => void loadApiReports();
    window.addEventListener('findit_reports_updated', handleUpdate);
    window.addEventListener('findit_tickets_updated', handleUpdate);
    return () => {
      window.removeEventListener('findit_reports_updated', handleUpdate);
      window.removeEventListener('findit_tickets_updated', handleUpdate);
    };
  }, [loadApiReports]);

  const showToast = (message, type = 'success') => {
    setToastNotification({ message, type });
    setTimeout(() => setToastNotification(null), 3500);
  };

  // Compute 4 Top Metrics (status klaim kehilangan — konsisten dgn Verifikasi)
  const metrics = useMemo(() => {
    const total = reports.length;
    const awaiting = reports.filter((r) => isReportAwaiting(r.statusRaw)).length;
    const verified = reports.filter((r) => isReportVerified(r.statusRaw)).length;
    const resolved = reports.filter((r) => isReportResolved(r.statusRaw)).length;

    return { total, awaiting, verified, resolved };
  }, [reports]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = r.title && r.title.toLowerCase().includes(q);
        const matchesId = r.id && r.id.toLowerCase().includes(q);
        const matchesReporter = r.reporterName && r.reporterName.toLowerCase().includes(q);
        const matchesLoc = r.location && r.location.toLowerCase().includes(q);
        const matchesCat = r.category && r.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesId && !matchesReporter && !matchesLoc && !matchesCat) {
          return false;
        }
      }

      return true;
    });
  }, [reports, statusFilter, searchQuery]);

  const handleDeleteReport = async (report) => {
    if (!report) return;
    const ok = await confirmDialog.confirm({
      title: 'Hapus Laporan?',
      message: `Apakah Anda yakin ingin menghapus laporan ${report.id} dari backend? Tindakan ini permanen dan tidak dapat dibatalkan.`,
    });
    if (!ok) return;
    if (report._source === 'api' && report._apiId != null) {
      try {
        await ApiService.deleteReport(report._apiId);
        showToast(`Laporan ${report.id} berhasil dihapus dari backend.`, 'success');
      } catch (err) {
        showToast(`Gagal menghapus laporan: ${err.message}`, 'info');
      } finally {
        await loadApiReports();
      }
      return;
    }
    showToast('Laporan ini tidak bisa dihapus dari backend.', 'info');
  };

  const getReportTypeBadge = (type) => {
    switch (type) {
      case 'found_item':
        return <span className="type-tag found_item">TEMUAN HK</span>;
      case 'lost_claim':
        return <span className="type-tag lost_claim">KEHILANGAN TAMU</span>;
      case 'handover_report':
        return <span className="type-tag handover_report">BERITA ACARA</span>;
      case 'audit_recap':
        return <span className="type-tag audit_recap">REKAP AUDIT</span>;
      default:
        return <span className="type-tag">{type}</span>;
    }
  };

  const getReportTypeLabel = (type) => {
    switch (type) {
      case 'found_item':
        return 'Laporan Barang Temuan Housekeeping';
      case 'lost_claim':
        return 'Laporan Klaim Kehilangan Tamu';
      case 'handover_report':
        return 'Berita Acara Serah Terima';
      case 'audit_recap':
        return 'Rekapitulasi Audit Inventaris Shift';
      default:
        return 'Laporan Operasional';
    }
  };

  const getStatusClass = (statusRaw) => {
    switch (reportStatusType(statusRaw)) {
      case 'green':
        return 'terverifikasi';
      case 'amber':
        return 'diterbitkan';
      case 'blue':
        return 'selesai';
      case 'red':
        return 'draft';
      default:
        return 'draft';
    }
  };

  return (
    <div className="operational-reports-app-layout">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeNav={activeNav}
        onNavChange={onNavChange}
        onLogout={onLogout}
      />

      {/* 2. Main Viewport Container */}
      <div className="operational-reports-main-viewport">
        <TopNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNavChange={onNavChange}
          onLogout={onLogout}
        />

        {/* Workspace Content */}
        <main className="operational-reports-workspace">
          {apiChecked && !apiActive && (
            <div className="offline-api-notice" role="status">
              Backend tidak dapat dihubungi — daftar laporan kosong. Laporan baru
              hanya akan tersimpan di backend saat koneksi kembali.
            </div>
          )}

          {/* Top Header Section */}
          <section className="reports-header-section">
            <div className="reports-header-left">
              <div className="reports-header-icon-box">
                <FileText size={24} />
              </div>
              <div>
                <h1 className="reports-main-heading">Laporan Operasional</h1>
                <p className="reports-sub-heading">
                  Pusat pembuatan dan arsip laporan barang temuan, klaim kehilangan tamu, serta rekapitulasi operasional hotel Grand Melia Jakarta.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="btn-create-report-primary"
              onClick={() => onNavChange && onNavChange('Buat Laporan')}
            >
              <Plus size={16} />
              <span>+ Buat Laporan Baru</span>
            </button>
          </section>

          {/* 4 Top KPI Cards */}
          <section className="reports-kpi-summary-grid">
            {/* Card 1: Total Laporan */}
            <div className="report-summary-card">
              <div className="summary-card-header">
                <span className="summary-card-title">TOTAL KLAIM</span>
                <div className="summary-icon-box blue">
                  <Folder size={16} />
                </div>
              </div>
              <div className="summary-card-number">{metrics.total}</div>
              <div className="summary-card-subtext positive">
                <span>📈 Laporan kehilangan tamu</span>
              </div>
            </div>

            {/* Card 2: Menunggu Verifikasi */}
            <div className="report-summary-card">
              <div className="summary-card-header">
                <span className="summary-card-title">MENUNGGU VERIFIKASI</span>
                <div className="summary-icon-box emerald">
                  <CheckCircle2 size={16} />
                </div>
              </div>
              <div className="summary-card-number">{metrics.awaiting}</div>
              <div className="summary-card-subtext">
                <span>• Butuh pencocokan admin</span>
              </div>
            </div>

            {/* Card 3: Terverifikasi */}
            <div className="report-summary-card">
              <div className="summary-card-header">
                <span className="summary-card-title">TERVERIFIKASI</span>
                <div className="summary-icon-box amber">
                  <AlertCircle size={16} />
                </div>
              </div>
              <div className="summary-card-number">{metrics.verified}</div>
              <div className="summary-card-subtext">
                <span>• Pasangan dikonfirmasi tim FO</span>
              </div>
            </div>

            {/* Card 4: Diserahkan */}
            <div className="report-summary-card">
              <div className="summary-card-header">
                <span className="summary-card-title">DISERAHKAN</span>
                <div className="summary-icon-box purple">
                  <Shield size={16} />
                </div>
              </div>
              <div className="summary-card-number">{metrics.resolved}</div>
              <div className="summary-card-subtext">
                <span>• Selesai serah terima tamu</span>
              </div>
            </div>
          </section>

          {/* Master Table Card */}
          <section className="reports-master-card">
            <div className="reports-master-header">
              <div className="master-title-row">
                <h3 className="master-section-title">Daftar Arsip Laporan</h3>
                <span className="reports-badge-count">
                  {filteredReports.length} laporan terdaftar
                </span>
              </div>
            </div>

            {/* Filter Toolbar */}
            <div className="reports-filter-row">
              <div className="reports-search-wrap">
                <Search size={15} className="reports-search-icon" />
                <input
                  type="text"
                  className="reports-search-input"
                  placeholder="Cari no. laporan, judul, staf pelapor, lokasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="reports-dropdown-group">
                {/* Status Filter */}
                <div className="reports-select-box">
                  <select
                    className="reports-select-element"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Semua Status</option>
                    <option value="Baru Masuk">Baru Masuk</option>
                    <option value="Dicocokkan">Dicocokkan</option>
                    <option value="Terverifikasi">Terverifikasi</option>
                    <option value="Selesai Handover">Selesai Handover</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                  <ChevronDown size={14} className="reports-select-chevron" />
                </div>

                {/* Info Sumber Data */}
                <div className="reports-select-box">
                  <span className="reports-source-badge">
                    <span className="type-tag lost_claim">HANYA KLAIM KEHILANGAN</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="reports-table-wrap">
              <table className="reports-data-grid">
                <thead>
                  <tr>
                    <th style={{ width: '130px' }}>NO. LAPORAN</th>
                    <th>JUDUL LAPORAN &amp; KATEGORI</th>
                    <th style={{ width: '150px' }}>TIPE</th>
                    <th style={{ width: '180px' }}>PELAPOR / STAF</th>
                    <th style={{ width: '190px' }}>LOKASI / KAMAR</th>
                    <th style={{ width: '140px' }}>WAKTU TERBIT</th>
                    <th style={{ width: '130px' }}>STATUS</th>
                    <th style={{ width: '140px', textAlign: 'center' }}>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan={8}>
                        <div className="reports-empty-box">
                          <FileText size={36} className="reports-empty-icon" />
                          <h4 className="reports-empty-title">
                            {apiActive ? 'Belum Ada Laporan Ditemukan' : 'Backend Tidak Dapat Dihubungi'}
                          </h4>
                          <p className="reports-empty-desc">
                            {apiActive
                              ? 'Tidak ada laporan kehilangan tamu yang cocok dengan kriteria pencarian atau arsip masih kosong.'
                              : 'Daftar laporan berasal langsung dari backend (sama dengan halaman Verifikasi). Periksa koneksi server lalu muat ulang halaman ini.'}
                          </p>
                          <button
                            type="button"
                            className="btn-create-report-primary"
                            onClick={() => onNavChange && onNavChange('Buat Laporan')}
                          >
                            <Plus size={15} />
                            <span>Buat Laporan Sekarang</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredReports.map((r) => (
                      <tr key={r.id} className="report-row-item">
                        <td>
                          <span className="report-id-badge">{r.id}</span>
                        </td>
                        <td>
                          <div className="report-title-cell">
                            <span className="report-title-text">{r.title}</span>
                            <span className="report-category-text">{r.category}</span>
                          </div>
                        </td>
                        <td>{getReportTypeBadge(r.reportType)}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 600, color: '#1e293b' }}>{r.reporterName}</span>
                            <span style={{ fontSize: '11.5px', color: '#64748b' }}>{r.reporterContact}</span>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '12.5px', color: '#334155' }}>{r.location}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>{r.dateFormatted}</span>
                        </td>
                        <td>
                          <span className={`status-pill-badge ${getStatusClass(r.statusRaw)}`}>
                            <span className="status-dot" />
                            {r.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div className="action-buttons-group" style={{ justifyContent: 'center' }}>
                            <button
                              type="button"
                              className="btn-action-preview"
                              onClick={() => setPreviewReport(r)}
                              title="Lihat Pratinjau Dokumen Resmi"
                            >
                              <Eye size={13} />
                              <span>Detail</span>
                            </button>
                            <button
                              type="button"
                              className="btn-action-delete"
                              onClick={() => handleDeleteReport(r)}
                              title="Hapus Laporan"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {/* Modal 1: Pratinjau Lembar Laporan Resmi Hotel (Official Document) */}
      {previewReport && (
        <div className="reports-modal-backdrop" onClick={() => setPreviewReport(null)}>
          <div className="reports-modal-card" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <div className="modal-header-left">
                <FileText size={20} style={{ color: '#1d4ed8' }} />
                <h3 className="modal-title">Pratinjau Lembar Laporan Resmi</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-print-doc"
                  onClick={() => window.print()}
                >
                  <Printer size={14} />
                  <span>Cetak Dokumen</span>
                </button>
                <button
                  type="button"
                  className="btn-close-modal"
                  onClick={() => setPreviewReport(null)}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              <div className="official-document-sheet">
                {/* Official Letterhead */}
                <div className="document-letterhead">
                  <div className="hotel-info-block">
                    <span className="hotel-official-name">GRAND MELIA JAKARTA</span>
                    <span className="hotel-official-address">
                      Jl. H.R. Rasuna Said Kav. X-0, Kuningan, Jakarta Selatan • Front Office &amp; Housekeeping Division
                    </span>
                  </div>
                  <div className="document-stamp-box">
                    <span className="document-code-title">KODE ARSIP RESMI</span>
                    <div className="document-code-val">{previewReport.id}</div>
                  </div>
                </div>

                <h2 className="doc-report-title">
                  {getReportTypeLabel(previewReport.reportType)}
                </h2>

                {/* Metadata Table */}
                <table className="doc-meta-table">
                  <tbody>
                    <tr>
                      <td className="doc-meta-label">Judul Laporan</td>
                      <td className="doc-meta-content" colSpan={3}>
                        <strong>{previewReport.title}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td className="doc-meta-label">Kategori Barang</td>
                      <td className="doc-meta-content">{previewReport.category}</td>
                      <td className="doc-meta-label">Tingkat Prioritas</td>
                      <td className="doc-meta-content">
                        <strong>{previewReport.priority}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td className="doc-meta-label">Nama Pelapor / Staf</td>
                      <td className="doc-meta-content">{previewReport.reporterName}</td>
                      <td className="doc-meta-label">Kontak / No. Kamar</td>
                      <td className="doc-meta-content">{previewReport.reporterContact}</td>
                    </tr>
                    <tr>
                      <td className="doc-meta-label">Lokasi Kejadian</td>
                      <td className="doc-meta-content">{previewReport.location}</td>
                      <td className="doc-meta-label">Waktu Penerbitan</td>
                      <td className="doc-meta-content">{previewReport.dateFormatted}</td>
                    </tr>
                    <tr>
                      <td className="doc-meta-label">Petugas Pemeriksa</td>
                      <td className="doc-meta-content">{previewReport.officialOfficer}</td>
                      <td className="doc-meta-label">Status Dokumen</td>
                      <td className="doc-meta-content">
                        <strong>{previewReport.status}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Narrative Description */}
                <div>
                  <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                    URAIAN &amp; KRONOLOGI OPERASIONAL
                  </h4>
                  <div className="doc-narrative-box">
                    {previewReport.description}
                  </div>
                </div>

                {/* Signature Blocks */}
                <div className="doc-signatures-grid">
                  <div className="signature-box">
                    <span className="sig-role">Pelapor / Penemu</span>
                    <span className="sig-name">{previewReport.reporterName}</span>
                  </div>
                  <div className="signature-box">
                    <span className="sig-role">Petugas Front Office</span>
                    <span className="sig-name">{previewReport.officialOfficer}</span>
                  </div>
                  <div className="signature-box">
                    <span className="sig-role">Duty Manager on Duty</span>
                    <span className="sig-name">Budi Santoso, CHA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog (pengganti window.confirm) */}
      {confirmDialog.dialog && <ConfirmDialog {...confirmDialog.dialog} />}

      {/* Toast Notification */}
      {toastNotification && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          padding: '12px 20px',
          backgroundColor: toastNotification.type === 'success' ? '#10b981' : '#3b82f6',
          color: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          fontSize: '13.5px',
          fontWeight: 600,
          zIndex: 2000,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {toastNotification.message}
        </div>
      )}
    </div>
  );
}

export default OperationalReportsView;
