import React from 'react';
import { 
  Search, 
  Calendar, 
  CheckCircle2, 
  Briefcase, 
  Shield, 
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

/**
 * View Component: ReportsTable
 * Data grid for inspecting and filtering all registered reports with full search, badges, and pagination
 */
export function ReportsTable({
  reports,
  totalCount,
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  dateRange,
  onDateRangeChange,
  rowsPerPage,
  onRowsPerPageChange,
  currentPage,
  onPageChange,
  onSelectReport
}) {
  const getReporterBadgeIcon = (badgeType) => {
    switch (badgeType) {
      case 'verified':
        return <CheckCircle2 size={13} className="reporter-badge-icon verified" />;
      case 'staff':
        return <Briefcase size={13} className="reporter-badge-icon staff" />;
      case 'officer':
        return <Shield size={13} className="reporter-badge-icon officer" />;
      default:
        return <CheckCircle2 size={13} className="reporter-badge-icon verified" />;
    }
  };

  return (
    <div className="reports-table-card">
      {/* Table Card Header */}
      <div className="reports-card-header">
        <div className="reports-title-wrap">
          <h2 className="reports-main-title">All Reports</h2>
          <span className="reports-total-pill">{totalCount} total submissions</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="reports-filter-toolbar">
        {/* Search Box */}
        <div className="reports-search-box">
          <Search size={16} className="reports-search-icon" />
          <input
            type="text"
            className="reports-search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search item name, reporter, reference ID, location..."
          />
        </div>

        {/* Dropdown Filters */}
        <div className="reports-filter-dropdowns">
          <div className="select-wrapper">
            <select
              className="reports-select-pill"
              value={typeFilter}
              onChange={(e) => onTypeFilterChange(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="lost">Lost Only</option>
              <option value="found">Found Only</option>
            </select>
            <ChevronDown size={14} className="select-chevron" />
          </div>

          <div className="select-wrapper">
            <select
              className="reports-select-pill"
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="matched">Matched</option>
              <option value="confirmed">Confirmed</option>
              <option value="returned">Returned</option>
            </select>
            <ChevronDown size={14} className="select-chevron" />
          </div>

          <div className="date-range-pill">
            <span>Last 30 days</span>
            <Calendar size={14} className="date-icon" />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="reports-table-scroll">
        <table className="reports-data-table">
          <thead>
            <tr>
              <th>ITEM REFERENCE &amp; THUMBNAIL</th>
              <th>TYPE</th>
              <th>CATEGORY</th>
              <th>REPORTER / CONTACT</th>
              <th>LOCATION &amp; TIMESTAMP</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan="6" className="table-empty-row">
                  No matching reports found matching your criteria.
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr 
                  key={report.id}
                  className="report-table-row"
                  onClick={() => onSelectReport(report)}
                >
                  {/* Thumbnail & Title */}
                  <td className="col-item-ref">
                    <div className="item-thumbnail-wrap">
                      <img 
                        src={report.image} 
                        alt={report.title} 
                        className="item-thumbnail-img" 
                      />
                    </div>
                    <div className="item-info-text">
                      <strong className="item-table-title">{report.title}</strong>
                      <span className="item-table-id">#{report.id}</span>
                    </div>
                  </td>

                  {/* Type Pill */}
                  <td className="col-type">
                    <span className={`report-type-pill ${report.type}`}>
                      {report.type.toUpperCase()}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="col-category">
                    <span className="category-text">{report.category}</span>
                  </td>

                  {/* Reporter Contact */}
                  <td className="col-reporter">
                    <div className="reporter-details">
                      <strong className="reporter-name">{report.reporter.name}</strong>
                      <div className="reporter-badge-sub">
                        {getReporterBadgeIcon(report.reporter.badgeType)}
                        <span>{report.reporter.badge}</span>
                      </div>
                    </div>
                  </td>

                  {/* Location & Timestamp */}
                  <td className="col-location">
                    <div className="location-details">
                      <span className="location-main">{report.location}</span>
                      <span className="location-time">{report.timestamp}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="col-status">
                    <span className={`report-status-pill ${report.status}`}>
                      <span className="status-dot-indicator"></span>
                      <span>{report.statusLabel}</span>
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
        <span className="pagination-count-text">
          Showing 1 to {reports.length} of {totalCount} reports
        </span>

        <div className="pagination-rows-selector">
          <span>Rows:</span>
          <button 
            type="button" 
            className={`rows-btn ${rowsPerPage === 10 ? 'active' : ''}`}
            onClick={() => onRowsPerPageChange(10)}
          >
            10
          </button>
          <button 
            type="button" 
            className={`rows-btn ${rowsPerPage === 25 ? 'active' : ''}`}
            onClick={() => onRowsPerPageChange(25)}
          >
            25
          </button>
          <button 
            type="button" 
            className={`rows-btn ${rowsPerPage === 50 ? 'active' : ''}`}
            onClick={() => onRowsPerPageChange(50)}
          >
            50
          </button>
        </div>

        <div className="pagination-nav-group">
          <button type="button" className="page-nav-arrow" disabled>
            &lt; Previous
          </button>
          <button type="button" className="page-nav-num active">
            1
          </button>
          <button type="button" className="page-nav-num">
            2
          </button>
          <button type="button" className="page-nav-num">
            3
          </button>
          <span className="page-nav-dots">...</span>
          <button type="button" className="page-nav-num">
            143
          </button>
          <button type="button" className="page-nav-arrow">
            Next &gt;
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportsTable;
