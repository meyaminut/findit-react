import React, { useState, useEffect, useMemo } from 'react';
import { 
  Folder, 
  Hourglass, 
  Shield, 
  CheckCircle2, 
  Search, 
  ChevronDown, 
  Calendar, 
  Package, 
  X, 
  MapPin, 
  User, 
  Clock, 
  Tag,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import Sidebar from '../dashboard/components/Sidebar';
import TopNavbar from '../dashboard/components/TopNavbar';
import { StorageService } from '../../services/StorageService';
import ApiService from '../../services/ApiService';
import './AllReportsView.css';

/**
 * View Component: AllReportsView (Screen: Barang Temuan & Master Reports)
 * Faithfully matches the user's reference UI:
 * - 4 Metric KPI Cards (Total Submissions, Awaiting Verification, Matched & Confirmed, Resolved & Returned)
 * - Main Table Card with Search, Type Filter, Status Filter, Date Filter, and CSV Export
 * - Master Data Table with Item Reference & Thumbnail, Type, Category, Reporter, Location, Status
 * - Pagination footer with Row Selector (10, 25, 50) and page navigation
 */
export function AllReportsView({ 
  activeNav = 'Barang Temuan', 
  onNavChange, 
  onLogout 
}) {
  const [foundItems, setFoundItems] = useState(() => StorageService.getFoundItems());
  const [tickets, setTickets] = useState(() => StorageService.getTickets());
  const [apiReports, setApiReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'lost' | 'found'
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('30days');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [toastNotification, setToastNotification] = useState(null);

  const refreshData = () => {
    setFoundItems(StorageService.getFoundItems());
    setTickets(StorageService.getTickets());
  };

  useEffect(() => {
    refreshData();
    const handleSync = () => refreshData();
    window.addEventListener('findit_items_updated', handleSync);
    window.addEventListener('findit_tickets_updated', handleSync);

    // Fetch live API data
    async function fetchApiReports() {
      try {
        const reports = await ApiService.getReports();
        if (Array.isArray(reports) && reports.length > 0) {
          const mapped = reports.map((r) => {
            const isLost = r.type === 'lost';
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

            return {
              id: `RPT-${r.id || r.ID}`,
              _apiId: r.id || r.ID,
              rawId: `RPT-${r.id || r.ID}`,
              title: r.title || 'Barang',
              type: r.type || 'found',
              typeLabel: isLost ? 'LOST' : 'FOUND',
              category: r.category || 'Lainnya',
              photoUrl: r.photo_url || null,
              reporter: {
                name: r.user?.name || (isLost ? 'Tamu' : 'Staf Hotel'),
                badge: isLost ? 'Tamu' : 'Staf HK',
                contact: r.room_number ? `Kamar ${r.room_number}` : (r.location || '-')
              },
              location: r.location ? `${r.location}${r.room_number && !r.location.includes(r.room_number) ? ` (Kamar ${r.room_number})` : ''}` : (r.room_number ? `Kamar ${r.room_number}` : '-'),
              storageLocation: isLost ? 'Klaim Pelapor' : 'Brankas FO',
              timestamp: `${dateStr}, ${timeStr} WIB`,
              createdAt: r.created_at || new Date().toISOString(),
              status: mapApiStatusToDisplay(r.status, r.type),
              description: r.description || '',
              activityNote: r.activity_note || '',
              _source: 'api',
            };
          });
          setApiReports(mapped);
        }
      } catch (err) {
        console.warn('[AllReportsView] API fetch failed:', err.message);
      }
    }
    fetchApiReports();

    return () => {
      window.removeEventListener('findit_items_updated', handleSync);
      window.removeEventListener('findit_tickets_updated', handleSync);
    };
  }, []);

  const showToast = (message, type = 'success') => {
    setToastNotification({ message, type });
    setTimeout(() => setToastNotification(null), 3500);
  };

  // Unify found items and lost tickets into master reports stream
  const allReports = useMemo(() => {
    const reports = [];

    // 1. Found Items (Housekeeping Inventory)
    foundItems.forEach((item) => {
      reports.push({
        id: item.id,
        rawId: item.id,
        title: item.name,
        type: 'found',
        typeLabel: 'FOUND',
        category: item.category || 'General',
        photoUrl: item.photoUrl,
        reporter: {
          name: item.finderName || 'Housekeeping Staff',
          badge: 'Staff HK',
          contact: item.roomNumber ? `Kamar ${item.roomNumber}` : 'Housekeeping Dept'
        },
        location: item.locationFound || `Kamar ${item.roomNumber || '-'}`,
        storageLocation: item.storageLocation || 'Brankas FO',
        timestamp: item.foundAt || 'Hari ini',
        createdAt: item.createdAt || Date.now(),
        status: item.status || 'Di Brankas FO',
        rawItem: item
      });
    });

    // 2. Lost Tickets (Guest Claims)
    tickets.forEach((ticket) => {
      reports.push({
        id: ticket.id,
        rawId: ticket.id,
        title: ticket.itemName,
        type: 'lost',
        typeLabel: 'LOST',
        category: ticket.category || 'Personal Items',
        photoUrl: null,
        reporter: {
          name: ticket.guestName || 'Tamu Hotel',
          badge: ticket.priority === 'VIP' ? 'VIP Guest' : 'Tamu Reservasi',
          contact: ticket.roomNumber ? `Kamar ${ticket.roomNumber}` : (ticket.phone || '-')
        },
        location: ticket.locationLost || `Kamar ${ticket.roomNumber || '-'}`,
        storageLocation: 'Klaim Pelapor',
        timestamp: ticket.reportedAt || 'Hari ini',
        createdAt: ticket.createdAt || Date.now(),
        status: ticket.status || 'Menunggu Verifikasi',
        rawItem: ticket
      });
    });

    // 3. API Reports (Live Backend Data) — shown at the top
    if (apiReports.length > 0) {
      apiReports.forEach((apiR) => {
        reports.unshift(apiR);
      });
    }

    return reports;
  }, [foundItems, tickets, apiReports]);

  // Compute 4 Top Metrics
  const metrics = useMemo(() => {
    const total = allReports.length;
    const awaiting = allReports.filter(
      (r) => r.status === 'Menunggu Verifikasi' || r.status === 'Di Brankas FO'
    ).length;
    const matched = allReports.filter(
      (r) => r.status === 'Terverifikasi'
    ).length;
    const resolved = allReports.filter(
      (r) => r.status === 'Sudah Diambil' || r.status === 'Selesai Handover'
    ).length;

    return {
      total,
      awaiting,
      matched,
      resolved
    };
  }, [allReports]);

  // Filter reports
  const filteredReports = useMemo(() => {
    return allReports.filter((r) => {
      // Type Filter
      if (typeFilter !== 'all' && r.type !== typeFilter) {
        return false;
      }

      // Status Filter
      if (statusFilter !== 'all' && r.status !== statusFilter) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = r.title && r.title.toLowerCase().includes(q);
        const matchesId = r.id && r.id.toLowerCase().includes(q);
        const matchesReporter = r.reporter.name && r.reporter.name.toLowerCase().includes(q);
        const matchesLoc = r.location && r.location.toLowerCase().includes(q);
        const matchesCat = r.category && r.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesId && !matchesReporter && !matchesLoc && !matchesCat) {
          return false;
        }
      }

      return true;
    });
  }, [allReports, typeFilter, statusFilter, searchQuery]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredReports.length / rowsPerPage));
  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredReports.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredReports, currentPage, rowsPerPage]);

  const handleExportCSV = () => {
    const headers = ['ID Referensi', 'Judul Barang', 'Tipe', 'Kategori', 'Pelapor / Kontak', 'Lokasi', 'Waktu', 'Status'];
    const rows = filteredReports.map((r) => [
      r.id,
      `"${r.title}"`,
      r.typeLabel,
      `"${r.category}"`,
      `"${r.reporter.name} (${r.reporter.contact})"`,
      `"${r.location}"`,
      `"${r.timestamp}"`,
      `"${r.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Master_All_Reports_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Berhasil mengekspor ${filteredReports.length} data laporan ke format CSV.`, 'success');
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Menunggu Verifikasi':
      case 'Di Brankas FO':
        return 'warning';
      case 'Terverifikasi':
        return 'matched';
      case 'Sudah Diambil':
      case 'Selesai Handover':
        return 'returned';
      default:
        return 'new';
    }
  };

  return (
    <div className="all-reports-app-layout found-items-app-layout">
      {/* 1. Left Navigation Sidebar */}
      <Sidebar
        activeNav={activeNav}
        onNavChange={onNavChange}
        onLogout={onLogout}
      />

      {/* 2. Main Viewport Container */}
      <div className="all-reports-main-viewport found-items-main-viewport">
        <TopNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNavChange={onNavChange}
          onLogout={onLogout}
        />

        {/* Workspace matching user reference screenshot */}
        <main className="all-reports-workspace">
          {/* Top 4 KPI Metrics Grid */}
          <section className="reports-kpi-grid">
            {/* Card 1: Total Submissions */}
            <div className="report-kpi-card">
              <div className="report-kpi-header">
                <span className="report-kpi-label">TOTAL SUBMISSIONS</span>
                <div className="report-kpi-icon-box blue">
                  <Folder size={17} />
                </div>
              </div>
              <div className="report-kpi-val">{metrics.total}</div>
              <div className="report-kpi-subtext positive">
                <span>📈 Laporan terdaftar</span>
              </div>
            </div>

            {/* Card 2: Awaiting Verification */}
            <div className="report-kpi-card">
              <div className="report-kpi-header">
                <span className="report-kpi-label">AWAITING VERIFICATION</span>
                <div className="report-kpi-icon-box gray">
                  <Hourglass size={17} />
                </div>
              </div>
              <div className="report-kpi-val">{metrics.awaiting}</div>
              <div className="report-kpi-subtext neutral">
                <span className="kpi-subtext-dot gray" />
                <span>Butuh verifikasi</span>
              </div>
            </div>

            {/* Card 3: Matched & Confirmed */}
            <div className="report-kpi-card">
              <div className="report-kpi-header">
                <span className="report-kpi-label">MATCHED &amp; CONFIRMED</span>
                <div className="report-kpi-icon-box orange">
                  <Shield size={17} />
                </div>
              </div>
              <div className="report-kpi-val">{metrics.matched}</div>
              <div className="report-kpi-subtext warning">
                <span className="kpi-subtext-dot orange" />
                <span>Telah dicocokkan</span>
              </div>
            </div>

            {/* Card 4: Resolved & Returned */}
            <div className="report-kpi-card">
              <div className="report-kpi-header">
                <span className="report-kpi-label">RESOLVED &amp; RETURNED</span>
                <div className="report-kpi-icon-box green">
                  <CheckCircle2 size={17} />
                </div>
              </div>
              <div className="report-kpi-val">{metrics.resolved}</div>
              <div className="report-kpi-subtext success">
                <span className="kpi-subtext-dot blue" />
                <span>Selesai / diserahkan</span>
              </div>
            </div>
          </section>

          {/* Main All Reports Table Card */}
          <div className="reports-table-card">
            {/* Header with Title and Count Badge */}
            <div className="reports-card-header">
              <div className="reports-title-wrap">
                <h2 className="reports-main-title">All Reports</h2>
                <span className="reports-total-pill">
                  {filteredReports.length} total submissions
                </span>
              </div>
            </div>

            {/* Filter Toolbar matching reference image */}
            <div className="reports-filter-toolbar">
              <div className="reports-search-box">
                <Search size={15} className="reports-search-icon" />
                <input
                  type="text"
                  className="reports-search-input"
                  placeholder="Search item name, reporter, reference ID, location..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className="reports-filter-dropdowns">
                {/* Type Filter */}
                <div className="select-wrapper">
                  <select
                    className="reports-select-pill"
                    value={typeFilter}
                    onChange={(e) => {
                      setTypeFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="all">All Types</option>
                    <option value="lost">Lost</option>
                    <option value="found">Found</option>
                  </select>
                  <ChevronDown size={14} className="select-chevron" />
                </div>

                {/* Status Filter */}
                <div className="select-wrapper">
                  <select
                    className="reports-select-pill"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                    <option value="Di Brankas FO">Di Brankas FO</option>
                    <option value="Terverifikasi">Terverifikasi</option>
                    <option value="Sudah Diambil">Sudah Diambil</option>
                    <option value="Selesai Handover">Selesai</option>
                  </select>
                  <ChevronDown size={14} className="select-chevron" />
                </div>

                {/* Date Range Pill */}
                <div 
                  className="date-range-pill"
                  onClick={() => {
                    const nextRange = dateRange === '30days' ? '7days' : dateRange === '7days' ? 'all' : '30days';
                    setDateRange(nextRange);
                  }}
                  title="Klik untuk mengubah rentang tanggal"
                >
                  <span>
                    {dateRange === '30days' ? 'Last 30 days' : dateRange === '7days' ? 'Last 7 days' : 'All Time'}
                  </span>
                  <Calendar size={14} className="date-icon" />
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="reports-table-scroll">
              <table className="reports-data-table">
                <thead>
                  <tr>
                    <th style={{ width: '260px' }}>ITEM REFERENCE &amp; THUMBNAIL</th>
                    <th style={{ width: '100px' }}>TYPE</th>
                    <th style={{ width: '160px' }}>CATEGORY</th>
                    <th style={{ width: '200px' }}>REPORTER / CONTACT</th>
                    <th>LOCATION &amp; TIMESTAMP</th>
                    <th style={{ width: '160px' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedReports.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '48px 16px', color: '#64748b' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '24px 0' }}>
                          <Package size={36} style={{ color: '#94a3b8' }} />
                          <div style={{ fontWeight: 600, color: '#1e293b' }}>
                            {allReports.length === 0
                              ? 'Belum ada data barang temuan di sistem'
                              : 'Tidak ada laporan yang sesuai dengan kriteria filter Anda'}
                          </div>
                          <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '380px', margin: 0 }}>
                            {allReports.length === 0
                              ? 'Belum ada laporan yang tercatat di sistem. Laporan baru akan muncul secara otomatis saat tamu atau staf melaporkan barang.'
                              : 'Coba ubah kata kunci pencarian atau sesuaikan pilihan filter tipe dan status.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedReports.map((report) => (
                      <tr
                        key={report.id}
                        className="report-table-row"
                        onClick={() => setSelectedReport(report)}
                      >
                        {/* Col 1: Item Reference & Thumbnail */}
                        <td>
                          <div className="col-item-ref">
                            <div className="item-thumbnail-wrap">
                              {report.photoUrl ? (
                                <img
                                  src={report.photoUrl}
                                  alt={report.title}
                                  className="item-thumbnail-img"
                                />
                              ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', color: '#94a3b8' }}>
                                  <Package size={20} />
                                </div>
                              )}
                            </div>
                            <div className="item-info-text">
                              <span className="item-table-title">{report.title}</span>
                              <span className="item-table-id">{report.id}</span>
                            </div>
                          </div>
                        </td>

                        {/* Col 2: Type Pill */}
                        <td>
                          <span className={`report-type-pill ${report.type}`}>
                            {report.typeLabel}
                          </span>
                        </td>

                        {/* Col 3: Category */}
                        <td>
                          <span className="category-text">{report.category}</span>
                        </td>

                        {/* Col 4: Reporter / Contact */}
                        <td>
                          <div className="reporter-details">
                            <span className="reporter-name">{report.reporter?.name || '-'}</span>
                            <span className="reporter-badge-sub">
                              {report.reporter?.contact || '-'}
                            </span>
                          </div>
                        </td>

                        {/* Col 5: Location & Timestamp */}
                        <td>
                          <div className="location-details">
                            <span className="location-main">{report.location}</span>
                            <span className="location-time">{report.timestamp}</span>
                          </div>
                        </td>

                        {/* Col 6: Status */}
                        <td>
                          <span className={`report-status-pill ${getStatusClass(report.status)}`}>
                            <span className="status-dot-indicator" />
                            {report.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="reports-pagination-bar">
              <div className="pagination-info">
                Showing {filteredReports.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} to{' '}
                {Math.min(currentPage * rowsPerPage, filteredReports.length)} of {filteredReports.length} reports
              </div>

              <div className="pagination-rows-selector">
                <span>Rows:</span>
                {[10, 25, 50].map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`rows-btn ${rowsPerPage === num ? 'active' : ''}`}
                    onClick={() => {
                      setRowsPerPage(num);
                      setCurrentPage(1);
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <div className="pagination-nav-group">
                <button
                  type="button"
                  className="page-nav-arrow"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  &lt; Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    className={`page-nav-num ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  className="page-nav-arrow"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next &gt;
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Quick Details Modal for clicked report */}
      {selectedReport && (
        <div className="modal-backdrop" onClick={() => setSelectedReport(null)}>
          <div 
            className="modal-dialog-box report-modal-detail" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-top-bar">
              <div className="modal-title-wrap">
                <Package size={20} className="text-blue-600" />
                <h3 className="modal-heading">Rincian Laporan: {selectedReport.id}</h3>
              </div>
              <button 
                type="button" 
                className="modal-close-icon-btn" 
                onClick={() => setSelectedReport(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '20px 24px' }}>
              {selectedReport.photoUrl && (
                <div className="modal-detail-photo">
                  <img src={selectedReport.photoUrl} alt={selectedReport.title} />
                </div>
              )}

              <div className="modal-spec-grid">
                <div className="modal-spec-item">
                  <span className="spec-label">Judul Barang</span>
                  <span className="spec-val" style={{ fontWeight: 700 }}>{selectedReport.title}</span>
                </div>
                <div className="modal-spec-item">
                  <span className="spec-label">Tipe Laporan</span>
                  <span className="spec-val">
                    <span className={`report-type-pill ${selectedReport.type}`}>
                      {selectedReport.typeLabel}
                    </span>
                  </span>
                </div>
                <div className="modal-spec-item">
                  <span className="spec-label">Kategori</span>
                  <span className="spec-val">{selectedReport.category}</span>
                </div>
                <div className="modal-spec-item">
                  <span className="spec-label">Pelapor / Kontak</span>
                  <span className="spec-val">{selectedReport.reporter.name} ({selectedReport.reporter.contact})</span>
                </div>
                <div className="modal-spec-item">
                  <span className="spec-label">Lokasi</span>
                  <span className="spec-val">{selectedReport.location}</span>
                </div>
                <div className="modal-spec-item">
                  <span className="spec-label">Waktu</span>
                  <span className="spec-val">{selectedReport.timestamp}</span>
                </div>
                <div className="modal-spec-item">
                  <span className="spec-label">Status Saat Ini</span>
                  <span className="spec-val">
                    <span className={`report-status-pill ${getStatusClass(selectedReport.status)}`}>
                      {selectedReport.status}
                    </span>
                  </span>
                </div>
                <div className="modal-spec-item">
                  <span className="spec-label">Lokasi Simpan / Deskripsi</span>
                  <span className="spec-val">{selectedReport.storageLocation || '-'}</span>
                </div>
              </div>
            </div>

            <div className="modal-actions-bar">
              <button 
                type="button" 
                className="btn-cancel-modal"
                onClick={() => setSelectedReport(null)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastNotification && (
        <div className={`verification-toast-pill ${toastNotification.type}`}>
          <CheckCircle2 size={16} />
          <span>{toastNotification.message}</span>
        </div>
      )}
    </div>
  );
}

// ──── Helper: Map API status to display label ────
function mapApiStatusToDisplay(apiStatus, type = 'found') {
  const map = {
    'pending': type === 'lost' ? 'Menunggu Verifikasi' : 'Di Brankas FO',
    'diverifikasi': 'Terverifikasi',
    'verified': 'Terverifikasi',
    'approved': 'Terverifikasi',
    'completed': type === 'lost' ? 'Selesai Handover' : 'Sudah Diambil',
    'claimed': 'Sudah Diambil',
    'rejected': 'Ditolak',
  };
  return map[apiStatus] || (type === 'lost' ? 'Menunggu Verifikasi' : 'Di Brankas FO');
}

export default AllReportsView;
