import React, { useState, useEffect, useMemo } from 'react';
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
  RotateCcw,
  Shield,
  Layers,
  MapPin,
  Clock,
  User,
  Tag
} from 'lucide-react';
import Sidebar from '../dashboard/components/Sidebar';
import TopNavbar from '../dashboard/components/TopNavbar';
import { StorageService } from '../../services/StorageService';
import './OperationalReportsView.css';

/**
 * View Component: OperationalReportsView (Halaman: Laporan)
 * Enables hotel administrators to:
 * 1. View 4 Top KPI cards of official operational archives.
 * 2. Filter & search operational reports (found item, guest loss, handover, audit recap).
 * 3. Create new official operational reports with a full-featured modal form.
 * 4. Preview and print official hotel documentation sheets.
 */
export function OperationalReportsView({ 
  activeNav = 'Laporan', 
  onNavChange, 
  onLogout 
}) {
  const [reports, setReports] = useState(() => StorageService.getReports());
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [previewReport, setPreviewReport] = useState(null);
  const [toastNotification, setToastNotification] = useState(null);

  // Form State for creating new report
  const [formData, setFormData] = useState({
    title: '',
    reportType: 'found_item',
    category: 'Elektronik & Gadget',
    reporterName: '',
    reporterContact: '',
    location: '',
    priority: 'Normal',
    officialOfficer: 'Admin FO On Duty',
    status: 'Diterbitkan',
    description: ''
  });

  const refreshData = () => {
    setReports(StorageService.getReports());
  };

  useEffect(() => {
    refreshData();
    const handleUpdate = () => refreshData();
    window.addEventListener('findit_reports_updated', handleUpdate);
    return () => {
      window.removeEventListener('findit_reports_updated', handleUpdate);
    };
  }, []);

  const showToast = (message, type = 'success') => {
    setToastNotification({ message, type });
    setTimeout(() => setToastNotification(null), 3500);
  };

  // Compute 4 Top Metrics
  const metrics = useMemo(() => {
    const total = reports.length;
    const found = reports.filter((r) => r.reportType === 'found_item').length;
    const lost = reports.filter((r) => r.reportType === 'lost_claim').length;
    const other = reports.filter(
      (r) => r.reportType === 'handover_report' || r.reportType === 'audit_recap'
    ).length;

    return { total, found, lost, other };
  }, [reports]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (typeFilter !== 'all' && r.reportType !== typeFilter) return false;
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
  }, [reports, typeFilter, statusFilter, searchQuery]);

  // Handle Form Submission
  const handleSaveNewReport = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Mohon masukkan judul laporan.');
      return;
    }

    StorageService.addReport({
      title: formData.title,
      reportType: formData.reportType,
      category: formData.category,
      reporterName: formData.reporterName || 'Staf Front Office',
      reporterContact: formData.reporterContact || '-',
      location: formData.location || 'Area Hotel',
      priority: formData.priority,
      officialOfficer: formData.officialOfficer || 'Sarah Jenkins (FO Supervisor)',
      status: formData.status,
      description: formData.description || 'Tidak ada uraian kronologi tambahan.'
    });

    setIsCreateModalOpen(false);
    setFormData({
      title: '',
      reportType: 'found_item',
      category: 'Elektronik & Gadget',
      reporterName: '',
      reporterContact: '',
      location: '',
      priority: 'Normal',
      officialOfficer: 'Admin FO On Duty',
      status: 'Diterbitkan',
      description: ''
    });

    refreshData();
    showToast('Laporan operasional baru berhasil dibuat & disimpan!', 'success');
  };

  const handleDeleteReport = (reportId) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus laporan ${reportId}?`)) {
      StorageService.deleteReport(reportId);
      refreshData();
      showToast(`Laporan ${reportId} berhasil dihapus.`, 'info');
    }
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

  const getStatusClass = (status) => {
    switch (status) {
      case 'Diterbitkan':
        return 'diterbitkan';
      case 'Terverifikasi':
        return 'terverifikasi';
      case 'Selesai':
        return 'selesai';
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
              onClick={() => setIsCreateModalOpen(true)}
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
                <span className="summary-card-title">TOTAL LAPORAN</span>
                <div className="summary-icon-box blue">
                  <Folder size={16} />
                </div>
              </div>
              <div className="summary-card-number">{metrics.total}</div>
              <div className="summary-card-subtext positive">
                <span>📈 Arsip resmi terdaftar</span>
              </div>
            </div>

            {/* Card 2: Laporan Temuan HK */}
            <div className="report-summary-card">
              <div className="summary-card-header">
                <span className="summary-card-title">BARANG TEMUAN HK</span>
                <div className="summary-icon-box emerald">
                  <CheckCircle2 size={16} />
                </div>
              </div>
              <div className="summary-card-number">{metrics.found}</div>
              <div className="summary-card-subtext">
                <span>• Inventaris housekeeping</span>
              </div>
            </div>

            {/* Card 3: Laporan Kehilangan Tamu */}
            <div className="report-summary-card">
              <div className="summary-card-header">
                <span className="summary-card-title">KLAIM KEHILANGAN</span>
                <div className="summary-icon-box amber">
                  <AlertCircle size={16} />
                </div>
              </div>
              <div className="summary-card-number">{metrics.lost}</div>
              <div className="summary-card-subtext">
                <span>• Laporan tamu hotel</span>
              </div>
            </div>

            {/* Card 4: Berita Acara & Rekap */}
            <div className="report-summary-card">
              <div className="summary-card-header">
                <span className="summary-card-title">BERITA ACARA &amp; REKAP</span>
                <div className="summary-icon-box purple">
                  <Shield size={16} />
                </div>
              </div>
              <div className="summary-card-number">{metrics.other}</div>
              <div className="summary-card-subtext">
                <span>• Handover &amp; audit shift</span>
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
                {/* Tipe Filter */}
                <div className="reports-select-box">
                  <select
                    className="reports-select-element"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="all">Semua Tipe Laporan</option>
                    <option value="found_item">Barang Temuan HK</option>
                    <option value="lost_claim">Klaim Kehilangan Tamu</option>
                    <option value="handover_report">Berita Acara Handover</option>
                    <option value="audit_recap">Rekap Audit Shift</option>
                  </select>
                  <ChevronDown size={14} className="reports-select-chevron" />
                </div>

                {/* Status Filter */}
                <div className="reports-select-box">
                  <select
                    className="reports-select-element"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Semua Status</option>
                    <option value="Diterbitkan">Diterbitkan</option>
                    <option value="Terverifikasi">Terverifikasi</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Draft">Draft</option>
                  </select>
                  <ChevronDown size={14} className="reports-select-chevron" />
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
                          <h4 className="reports-empty-title">Belum Ada Laporan Ditemukan</h4>
                          <p className="reports-empty-desc">
                            Tidak ada dokumen laporan yang cocok dengan kriteria pencarian atau arsip masih kosong.
                          </p>
                          <button
                            type="button"
                            className="btn-create-report-primary"
                            onClick={() => setIsCreateModalOpen(true)}
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
                          <span className={`status-pill-badge ${getStatusClass(r.status)}`}>
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
                              onClick={() => handleDeleteReport(r.id)}
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

      {/* Modal 1: Buat Laporan Baru */}
      {isCreateModalOpen && (
        <div className="reports-modal-backdrop" onClick={() => setIsCreateModalOpen(false)}>
          <div className="reports-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <div className="modal-header-left">
                <FileText size={20} style={{ color: '#1d4ed8' }} />
                <h3 className="modal-title">Buat Laporan Operasional Baru</h3>
              </div>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setIsCreateModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNewReport}>
              <div className="modal-form-content">
                <div className="form-field-group">
                  <label className="form-field-label">Judul Laporan *</label>
                  <input
                    type="text"
                    required
                    className="form-input-control"
                    placeholder="Contoh: Laporan Penemuan Jam Tangan di Kamar 502"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="form-grid-2col">
                  <div className="form-field-group">
                    <label className="form-field-label">Tipe Laporan</label>
                    <select
                      className="form-select-control"
                      value={formData.reportType}
                      onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                    >
                      <option value="found_item">Barang Temuan HK</option>
                      <option value="lost_claim">Klaim Kehilangan Tamu</option>
                      <option value="handover_report">Berita Acara Handover</option>
                      <option value="audit_recap">Rekapitulasi Shift</option>
                    </select>
                  </div>

                  <div className="form-field-group">
                    <label className="form-field-label">Kategori Barang</label>
                    <select
                      className="form-select-control"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Elektronik & Gadget">Elektronik &amp; Gadget</option>
                      <option value="Aksesoris & Jam">Aksesoris &amp; Jam</option>
                      <option value="Perhiasan & Berharga">Perhiasan &amp; Berharga</option>
                      <option value="Bagasi & Koper">Bagasi &amp; Koper</option>
                      <option value="Pakaian & Sandang">Pakaian &amp; Sandang</option>
                      <option value="Dokumen & Identitas">Dokumen &amp; Identitas</option>
                      <option value="Lain-lain">Lain-lain</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid-2col">
                  <div className="form-field-group">
                    <label className="form-field-label">Nama Pelapor / Staf / Tamu</label>
                    <input
                      type="text"
                      className="form-input-control"
                      placeholder="Contoh: Siti Rahma (HK Lt. 5)"
                      value={formData.reporterName}
                      onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="form-field-label">Kontak / No. Kamar / Ext</label>
                    <input
                      type="text"
                      className="form-input-control"
                      placeholder="Contoh: Kamar 502 / Ext 5002"
                      value={formData.reporterContact}
                      onChange={(e) => setFormData({ ...formData, reporterContact: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid-2col">
                  <div className="form-field-group">
                    <label className="form-field-label">Lokasi Penemuan / Kejadian</label>
                    <input
                      type="text"
                      className="form-input-control"
                      placeholder="Contoh: Meja Nakas Kamar 502"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="form-field-label">Tingkat Prioritas</label>
                    <select
                      className="form-select-control"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="Normal">Normal</option>
                      <option value="Tinggi">Tinggi</option>
                      <option value="Urgent">Urgent (Segera)</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid-2col">
                  <div className="form-field-group">
                    <label className="form-field-label">Petugas Pemeriksa (FO / Admin)</label>
                    <input
                      type="text"
                      className="form-input-control"
                      placeholder="Nama Admin"
                      value={formData.officialOfficer}
                      onChange={(e) => setFormData({ ...formData, officialOfficer: e.target.value })}
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="form-field-label">Status Awal</label>
                    <select
                      className="form-select-control"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Diterbitkan">Diterbitkan</option>
                      <option value="Terverifikasi">Terverifikasi</option>
                      <option value="Selesai">Selesai</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div className="form-field-group">
                  <label className="form-field-label">Rincian Narasi &amp; Kronologi Laporan</label>
                  <textarea
                    className="form-textarea-control"
                    placeholder="Tuliskan secara lengkap detail kronologi, kondisi fisik barang, tindakan penanganan, dan lokasi brankas penyimpanan..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn-submit-save">
                  Simpan &amp; Terbitkan Laporan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Pratinjau Lembar Laporan Resmi Hotel (Official Document) */}
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
