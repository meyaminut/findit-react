import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  User, 
  MapPin, 
  Clock, 
  X, 
  Layers, 
  Check, 
  AlertCircle,
  Package,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import Sidebar from '../dashboard/components/Sidebar';
import TopNavbar from '../dashboard/components/TopNavbar';
import { StorageService } from '../../services/StorageService';
import ApiService from '../../services/ApiService';
import { MatchReviewModel } from '../../models/MatchReviewModel';
import './MatchReviewView.css';

/**
 * View Component: MatchReviewView (Verifikasi & Pencocokan)
 * Master Data Table layout mirroring the Found Items (Barang Temuan) master inventory.
 * Displays all guest claim tickets, automatically pairs them with Housekeeping found item candidates,
 * evaluates confidence scores, and provides an interactive inspection modal for FO verification.
 */
export function MatchReviewView({ 
  activeNav = 'Verifikasi', 
  onNavChange, 
  onLogout 
}) {
  const [tickets, setTickets] = useState(() => StorageService.getTickets());
  const [foundItems, setFoundItems] = useState(() => StorageService.getFoundItems());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [inspectingTicket, setInspectingTicket] = useState(null);
  const [toastNotification, setToastNotification] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Sync data listener
  const refreshData = () => {
    setTickets(StorageService.getTickets());
    setFoundItems(StorageService.getFoundItems());
  };

  useEffect(() => {
    refreshData();
    const handleUpdate = () => refreshData();
    window.addEventListener('findit_tickets_updated', handleUpdate);
    window.addEventListener('findit_items_updated', handleUpdate);
    return () => {
      window.removeEventListener('findit_tickets_updated', handleUpdate);
      window.removeEventListener('findit_items_updated', handleUpdate);
    };
  }, []);

  const showToast = (message, type = 'success') => {
    setToastNotification({ message, type });
    setTimeout(() => {
      setToastNotification(null);
    }, 3500);
  };

  // Pre-calculate candidate pairings for tickets
  const ticketPairings = useMemo(() => {
    const pairings = {};
    tickets.forEach((t) => {
      const candidates = MatchReviewModel.getCandidates(t.id);
      pairings[t.id] = candidates.length > 0 ? candidates[0] : null;
    });
    return pairings;
  }, [tickets, foundItems]);

  // Categories list
  const categoryOptions = useMemo(() => {
    const cats = new Set(tickets.map((t) => t.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [tickets]);

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || t.status === selectedStatus;
      const q = searchQuery.toLowerCase().trim();
      const bestCandidate = ticketPairings[t.id];
      const matchesSearch =
        !q ||
        (t.id && t.id.toLowerCase().includes(q)) ||
        (t.guestName && t.guestName.toLowerCase().includes(q)) ||
        (t.roomNumber && t.roomNumber.toLowerCase().includes(q)) ||
        (t.itemName && t.itemName.toLowerCase().includes(q)) ||
        (bestCandidate && bestCandidate.name && bestCandidate.name.toLowerCase().includes(q));
      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [tickets, selectedCategory, selectedStatus, searchQuery, ticketPairings]);

  // KPI counts
  const totalCount = tickets.length;
  const pendingCount = tickets.filter((t) => t.status === 'Menunggu Verifikasi').length;
  const verifiedCount = tickets.filter((t) => t.status === 'Terverifikasi' || t.status === 'Selesai Handover').length;

  // Actions
  const handleDeleteTicket = (ticketId) => {
    if (window.confirm(`Hapus laporan barang ${ticketId}?`)) {
      StorageService.deleteTicket(ticketId);
      showToast(`Laporan barang ${ticketId} berhasil dihapus.`, 'info');
      refreshData();
    }
  };

  // ── API-integration helpers (API-first, fallback StorageService) ──
  const isApiCandidate = (candidate) =>
    Boolean(
      candidate &&
      (candidate._apiId != null ||
        candidate._source === 'api' ||
        /-API-/i.test(String(candidate.lost_report_id ?? '')) ||
        /-API-/i.test(String(candidate.found_report_id ?? '')))
    );

  const findApiMatch = async (candidate) => {
    const matches = await ApiService.getMatches();
    if (!Array.isArray(matches) || matches.length === 0) return null;

    let target = null;
    if (candidate._apiId != null) {
      target = matches.find((m) => String(m.id ?? m.ID) === String(candidate._apiId)) || null;
    }
    if (!target) {
      const lostId = String(candidate.lost_report_id ?? '').replace(/\D/g, '');
      const foundId = String(candidate.found_report_id ?? '').replace(/\D/g, '');
      if (lostId && foundId) {
        target =
          matches.find(
            (m) => String(m.lost_report_id) === lostId && String(m.found_report_id) === foundId
          ) || null;
      }
    }
    return target;
  };

  // Update match via API; selalu sertakan seluruh field (backend PUT bersifat
  // replace-all DAN mewajibkan lost_report_id + found_report_id).
  const apiUpdateMatchStatus = async (candidate, nextStatus) => {
    const target = await findApiMatch(candidate);
    if (!target) return false;
    await ApiService.updateMatchStatus(target.id ?? target.ID, nextStatus, {
      lost_report_id: target.lost_report_id,
      found_report_id: target.found_report_id,
      similarity_score: target.similarity_score ?? 0,
      verified_by: target.verified_by ?? null,
      handover_method: target.handover_method ?? '',
      contact_shared_at: target.contact_shared_at ?? null,
      activity_note: target.activity_note ?? '',
    });
    return true;
  };

  const syncMatchStatus = async (ticket, candidate, nextStatus, extra = {}) => {
    if (isApiCandidate(candidate)) {
      try {
        const updatedViaApi = await apiUpdateMatchStatus(candidate, nextStatus);
        if (updatedViaApi) return true;
      } catch (err) {
        console.warn('[MatchReview] API update gagal, fallback ke StorageService:', err.message);
      }
    }
    if (candidate?.id) {
      StorageService.updateMatchStatus(candidate.id, nextStatus, {
        lost_report_id: ticket.id,
        found_report_id: candidate.found_report_id || candidate.id,
        ...extra,
      });
    }
    return false;
  };

  const handleConfirmVerification = async (ticket, candidate) => {
    setActionLoading(true);
    try {
      await syncMatchStatus(ticket, candidate, 'approved', {
        verified_by: 'Duty Manager Front Office',
      });
      StorageService.updateTicketStatus(ticket.id, 'Terverifikasi');
      showToast(`Barang ${ticket.id} berhasil ditandai Terverifikasi!`, 'success');
    } finally {
      setActionLoading(false);
      setInspectingTicket(null);
      refreshData();
    }
  };

  const handleRejectRelation = async (ticket, candidate) => {
    setActionLoading(true);
    try {
      await syncMatchStatus(ticket, candidate, 'rejected');
      StorageService.updateTicketStatus(ticket.id, 'Menunggu Verifikasi');
      showToast(`Kandidat barang temuan dilepaskan dari barang ${ticket.id}.`, 'info');
    } finally {
      setActionLoading(false);
      setInspectingTicket(null);
      refreshData();
    }
  };

  const handleExportCSV = () => {
    StorageService.exportToCSV(filteredTickets, `Laporan_Verifikasi_${Date.now()}.csv`);
  };

  const handleLoadSampleData = () => {
    StorageService.seedSampleData();
    refreshData();
    showToast('2 Sampel barang klaim dan barang temuan berhasil dimuat!', 'success');
  };

  // Inspecting candidate helper
  const inspectingCandidate = inspectingTicket ? ticketPairings[inspectingTicket.id] : null;

  return (
    <div className="verification-app-layout">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeNav={activeNav}
        onNavChange={onNavChange}
        onLogout={onLogout}
      />

      {/* 2. Main Viewport Container */}
      <div className="verification-main-viewport">
        <TopNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNavChange={onNavChange}
          onLogout={onLogout}
        />

        <main className="verification-scrollable-content">
          {/* Header & KPI Summary Cards (Identical Layout to FoundItemsLogView) */}
          <section className="verification-header-section">
            <div className="verification-title-group">
              <div className="verification-icon-box">
                <CheckCircle2 size={24} />
              </div>
              <div className="verification-titles">
                <h1 className="verification-main-title">Verifikasi</h1>
                <span className="verification-subtitle">
                  Tabel master pencocokan klaim tamu hotel dengan inventaris fisik barang temuan housekeeping.
                </span>
              </div>
            </div>

            {/* KPI Cards Group */}
            <div className="verification-kpi-cards-group">
              <div className="verification-kpi-card blue-surface">
                <div className="kpi-icon-square blue">
                  <ShieldCheck size={18} />
                </div>
                <div className="kpi-text-stack">
                  <span className="kpi-micro-label">TOTAL KLAIM TAMU</span>
                  <span className="kpi-value-bold">{totalCount} Barang</span>
                </div>
              </div>

              <div className="verification-kpi-card yellow-surface">
                <div className="kpi-icon-square yellow">
                  <Clock size={18} />
                </div>
                <div className="kpi-text-stack">
                  <span className="kpi-micro-label">MENUNGGU VERIFIKASI</span>
                  <span className="kpi-value-bold">{pendingCount} Barang</span>
                </div>
              </div>

              <div className="verification-kpi-card green-surface">
                <div className="kpi-icon-square green">
                  <Check size={18} />
                </div>
                <div className="kpi-text-stack">
                  <span className="kpi-micro-label">TERVERIFIKASI</span>
                  <span className="kpi-value-bold">{verifiedCount} Barang</span>
                </div>
              </div>
            </div>
          </section>

          {/* Search, Filter & Action Toolbar */}
          <section className="verification-toolbar-card">
            <div className="toolbar-top-row">
              <div className="table-search-input-box">
                <Search size={16} className="search-muted-icon" />
                <input
                  type="text"
                  className="table-search-field"
                  placeholder="Cari no. barang, nama tamu, kamar, barang klaim..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="toolbar-right-buttons">
                <button
                  type="button"
                  className="btn-new-claim-action"
                  onClick={() => onNavChange && onNavChange('Buat Laporan Tamu')}
                >
                  <Plus size={15} />
                  <span>Buat Laporan Tamu</span>
                </button>
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="toolbar-filters-row">
              <div className="filter-select-wrapper">
                <span className="filter-label-icon">
                  <Filter size={10} />
                  KATEGORI BARANG
                </span>
                <select
                  className="filter-native-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">Semua Kategori</option>
                  {categoryOptions.filter((c) => c !== 'all').map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="filter-select-wrapper">
                <span className="filter-label-icon">
                  <CheckCircle2 size={10} />
                  STATUS VERIFIKASI
                </span>
                <select
                  className="filter-native-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">Semua Status</option>
                  <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                  <option value="Terverifikasi">Terverifikasi</option>
                  <option value="Selesai Handover">Selesai</option>
                </select>
              </div>
            </div>
          </section>

          {/* Master Verification Table */}
          {filteredTickets.length === 0 ? (
            <div className="claim-empty-state-card">
              <div className="empty-icon-box">
                <Package size={28} className="empty-ticket-icon" />
              </div>
              <h3 className="empty-title">Belum Ada Barang Klaim untuk Diverifikasi</h3>
              <p className="empty-subtitle">
                Tidak ada barang klaim yang sesuai dengan filter pencarian saat ini. Anda dapat membuat laporan baru atau memuat sampel data.
              </p>
              <div className="empty-actions-row">
                <button
                  type="button"
                  className="btn-create-empty-amber"
                  onClick={() => onNavChange && onNavChange('Buat Laporan Tamu')}
                >
                  + Buat Laporan Tamu Baru
                </button>
              </div>
            </div>
          ) : (
            <div className="master-verification-table-container">
              <table className="master-verification-table">
                <thead>
                  <tr>
                    <th style={{ width: '130px' }}>NO. BARANG</th>
                    <th>TAMU &amp; NO. KAMAR</th>
                    <th>BARANG DIKLAIM</th>
                    <th>KANDIDAT TEMUAN HK</th>
                    <th style={{ width: '150px' }}>SKOR SINKRONISASI</th>
                    <th style={{ width: '140px' }}>WAKTU LAPOR</th>
                    <th style={{ width: '150px' }}>STATUS</th>
                    <th style={{ width: '170px', textAlign: 'center' }}>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((t) => {
                    const candidate = ticketPairings[t.id];
                    const isPending = t.status === 'Menunggu Verifikasi';
                    return (
                      <tr key={t.id} className="verification-table-row">
                        {/* 1. No Tiket */}
                        <td className="cell-ticket-id">
                          <div className="ticket-id-stack">
                            <span 
                              className="reg-num-link"
                              onClick={() => setInspectingTicket(t)}
                              title="Klik untuk membuka rincian perbandingan"
                            >
                              {t.id}
                            </span>
                            {t.priority === 'VIP' && (
                              <span className="vip-badge-small">VIP</span>
                            )}
                          </div>
                        </td>

                        {/* 2. Tamu & No Kamar */}
                        <td className="cell-guest-info">
                          <div className="guest-info-stack">
                            <span className="guest-name-bold">{t.guestName || 'Tamu Anonim'}</span>
                            <span className="guest-room-sub">
                              Kamar {t.roomNumber || '-'} {t.roomType ? `• ${t.roomType}` : ''}
                            </span>
                          </div>
                        </td>

                        {/* 3. Barang Diklaim */}
                        <td className="cell-item-claimed">
                          <div className="item-claimed-stack">
                            <span className="item-name-bold">{t.itemName || 'Barang Berharga'}</span>
                            <span className="item-category-sub">
                              {t.category || '-'} {t.color ? `• ${t.color}` : ''}
                            </span>
                          </div>
                        </td>

                        {/* 4. Kandidat Temuan HK */}
                        <td className="cell-hk-candidate">
                          {candidate ? (
                            <div className="candidate-cell-flex">
                              {candidate.photoUrl ? (
                                <img
                                  src={candidate.photoUrl}
                                  alt={candidate.name}
                                  className="candidate-mini-thumb"
                                />
                              ) : (
                                <div className="candidate-icon-placeholder">
                                  <Package size={14} />
                                </div>
                              )}
                              <div className="candidate-info-stack">
                                <span className="candidate-title">{candidate.name}</span>
                                <span className="candidate-sub">
                                  <MapPin size={10} /> {candidate.locationFound || candidate.storageLocation || 'HK Storage'}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="no-candidate-hint">Belum ada temuan serupa</span>
                          )}
                        </td>

                        {/* 5. Skor Sinkronisasi */}
                        <td className="cell-confidence">
                          {candidate ? (
                            <span className={`confidence-pill-score ${candidate.confidenceScore >= 75 ? 'high' : 'medium'}`}>
                              <Sparkles size={12} />
                              {candidate.confidenceScore}% Cocok
                            </span>
                          ) : (
                            <span className="confidence-empty">-</span>
                          )}
                        </td>

                        {/* 6. Waktu Lapor */}
                        <td className="cell-report-time">
                          <span className="report-time-text">{t.reportedAt || '-'}</span>
                        </td>

                        {/* 7. Status */}
                        <td className="cell-status">
                          <span className={`status-pill ${isPending ? 'pending' : 'verified'}`}>
                            <span className="status-dot" />
                            {t.status}
                          </span>
                        </td>

                        {/* 8. Aksi */}
                        <td className="cell-actions" style={{ textAlign: 'center' }}>
                          <div className="action-buttons-flex">
                            <button
                              type="button"
                              className={isPending ? 'btn-table-verify' : 'btn-table-details'}
                              onClick={() => setInspectingTicket(t)}
                              title="Buka rincian pencocokan & SOP double-blind"
                            >
                              <span>{isPending ? 'Verifikasi' : 'Detail'}</span>
                              <ArrowRight size={13} />
                            </button>

                            <button
                              type="button"
                              className="btn-table-delete"
                              title="Hapus Laporan Barang"
                              onClick={() => handleDeleteTicket(t.id)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="verification-table-footer">
                <span className="footer-count-text">
                  Menampilkan {filteredTickets.length} dari total {tickets.length} klaim terdaftar
                </span>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. Interactive Verification & Inspection Modal */}
      {inspectingTicket && (
        <div className="modal-backdrop" onClick={() => setInspectingTicket(null)}>
          <div 
            className="modal-dialog-box verification-modal-box" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-top-bar">
              <div className="modal-title-wrap">
                <ShieldCheck size={22} className="text-blue-600" />
                <div>
                  <h3 className="modal-heading">
                    Pemeriksaan Ciri Khusus: {inspectingTicket.id}
                  </h3>
                  <span className="modal-sub-heading">
                    SOP FO Double-Blind Check • Tamu: {inspectingTicket.guestName} (Kamar {inspectingTicket.roomNumber})
                  </span>
                </div>
              </div>
              <button 
                type="button" 
                className="modal-close-icon-btn" 
                onClick={() => setInspectingTicket(null)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: Side-by-Side Comparison */}
            <div className="verification-modal-body">
              {/* Left Side: Guest Claim Confidential */}
              <div className="modal-compare-card guest-side">
                <div className="card-side-tag">1. LAPORAN KLAIM TAMU (CONFIDENTIAL)</div>
                <h4 className="compare-item-title">{inspectingTicket.itemName}</h4>

                <div className="compare-meta-grid">
                  <div className="compare-meta-item">
                    <span className="meta-label">Nama Tamu</span>
                    <span className="meta-value bold">{inspectingTicket.guestName}</span>
                  </div>
                  <div className="compare-meta-item">
                    <span className="meta-label">Nomor Kamar</span>
                    <span className="meta-value">Kamar {inspectingTicket.roomNumber}</span>
                  </div>
                  <div className="compare-meta-item">
                    <span className="meta-label">Kategori</span>
                    <span className="meta-value">{inspectingTicket.category || '-'}</span>
                  </div>
                  <div className="compare-meta-item">
                    <span className="meta-label">Warna Utama</span>
                    <span className="meta-value">{inspectingTicket.color || '-'}</span>
                  </div>
                </div>

                <div className="confidential-feature-box">
                  <span className="feature-label">Ciri Rahasia / Deskripsi Tambahan Tamu:</span>
                  <p className="feature-text">
                    {inspectingTicket.secretDetail || inspectingTicket.specialFeatures || inspectingTicket.description || 'Tidak ada deskripsi rahasia tertulis.'}
                  </p>
                </div>

                <div className="location-meta-row">
                  <MapPin size={12} />
                  <span>Lokasi Hilang: {inspectingTicket.locationLost || 'Area kamar'}</span>
                </div>
              </div>

              {/* Right Side: HK Found Item Candidate */}
              <div className="modal-compare-card hk-side">
                <div className="card-side-tag green">2. BARANG FISIK TEMUAN HOUSEKEEPING</div>
                {inspectingCandidate ? (
                  <>
                    <div className="hk-candidate-header">
                      {inspectingCandidate.photoUrl ? (
                        <img 
                          src={inspectingCandidate.photoUrl} 
                          alt={inspectingCandidate.name} 
                          className="hk-candidate-img-frame"
                        />
                      ) : (
                        <div className="hk-no-photo-box">
                          <Package size={24} />
                        </div>
                      )}
                      <div>
                        <h4 className="compare-item-title">{inspectingCandidate.name}</h4>
                        <span className="confidence-pill-score high">
                          <Sparkles size={11} /> {inspectingCandidate.confidenceScore || 95}% Kecocokan AI
                        </span>
                      </div>
                    </div>

                    <div className="compare-meta-grid">
                      <div className="compare-meta-item">
                        <span className="meta-label">Petugas Penemu</span>
                        <span className="meta-value bold">{inspectingCandidate.finderName || 'Staf Housekeeping'}</span>
                      </div>
                      <div className="compare-meta-item">
                        <span className="meta-label">Lokasi Ditemukan</span>
                        <span className="meta-value">{inspectingCandidate.locationFound || `Kamar ${inspectingCandidate.roomNumber}`}</span>
                      </div>
                      <div className="compare-meta-item">
                        <span className="meta-label">Lokasi Simpan</span>
                        <span className="meta-value">{inspectingCandidate.storageLocation || 'Brankas FO'}</span>
                      </div>
                      <div className="compare-meta-item">
                        <span className="meta-label">Waktu Temu</span>
                        <span className="meta-value">{inspectingCandidate.foundAt || '-'}</span>
                      </div>
                    </div>

                    <div className="confidential-feature-box hk">
                      <span className="feature-label">Deskripsi Fisik Lapangan HK:</span>
                      <p className="feature-text">
                        {inspectingCandidate.description || inspectingCandidate.notes || 'Barang dalam kondisi baik tersimpan aman di loker.'}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="empty-hk-match-state">
                    <AlertCircle size={28} className="text-amber-500" />
                    <h4>Belum Ada Barang Temuan Serupa</h4>
                    <p>
                      Sistem belum menemukan barang temuan dari Housekeeping yang memiliki kemiripan kategori atau nomor kamar yang cocok.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal SOP Check Notice */}
            <div className="modal-sop-banner">
              <ShieldCheck size={16} />
              <span>
                <strong>Protokol SOP Front Office:</strong> Pastikan minimal 3 poin verifikasi rahasia (warna, ciri khusus, isi/seri) telah dikonfirmasi oleh tamu sebelum menandai status Terverifikasi.
              </span>
            </div>

            {/* Modal Actions */}
            <div className="modal-actions-bar">
              <button 
                type="button" 
                className="btn-cancel-modal" 
                onClick={() => setInspectingTicket(null)}
              >
                Tutup
              </button>

              {inspectingCandidate && (
                <button
                  type="button"
                  className="btn-reject-relation"
                  onClick={() => handleRejectRelation(inspectingTicket, inspectingCandidate)}
                  disabled={actionLoading}
                >
                  Lepas Relasi / Tidak Cocok
                </button>
              )}

              <button
                type="button"
                className="btn-confirm-match-gold"
                onClick={() => handleConfirmVerification(inspectingTicket, inspectingCandidate)}
                disabled={actionLoading}
              >
                {actionLoading ? 'Memproses...' : 'Tandai Terverifikasi'}
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

export default MatchReviewView;
