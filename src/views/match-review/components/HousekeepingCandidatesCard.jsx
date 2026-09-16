import React from 'react';
import { 
  Search, 
  X, 
  Maximize2, 
  Lock, 
  FileText, 
  Check 
} from 'lucide-react';

export function HousekeepingCandidatesCard({
  roomFilter,
  onRoomFilterChange,
  candidates = [],
  selectedCandidate,
  onSelectCandidate,
  onZoomPhoto
}) {
  const primaryItem = selectedCandidate || (candidates.length > 0 ? candidates[0] : null);
  const otherItems = candidates.filter(c => c.id !== primaryItem?.id);

  return (
    <section className="comparison-card housekeeping-column">
      <div className="card-header-row">
        <div className="header-icon-title">
          <div>
            <h3 className="card-title">Pencocokan Barang Temuan Housekeeping</h3>
            <span className="card-subtitle">Data hasil input cepat Room Attendant di lapangan</span>
          </div>
        </div>
        <div className="autofilter-toggle-pill">
          <span className="toggle-dot-green"></span>
          <span>Auto-Filter Aktif</span>
        </div>
      </div>

      {/* Room Attendant Filter Bar */}
      <div className="hk-search-filter-row">
        <div className="hk-search-input-box">
          <Search size={15} className="hk-search-icon" />
          <input
            type="text"
            value={roomFilter}
            onChange={(e) => onRoomFilterChange(e.target.value)}
            className="hk-search-field"
            placeholder="Filter kamar / area..."
          />
          {roomFilter && (
            <span className="room-filter-chip">
              {roomFilter}
              <button 
                type="button" 
                onClick={() => onRoomFilterChange('')}
                className="chip-remove-btn"
              >
                <X size={11} />
              </button>
            </span>
          )}
        </div>
      </div>

      <span className="candidates-count-caption">
        {candidates.length > 0 
          ? `Menampilkan ${candidates.length} Temuan di Area Terkait`
          : 'Menampilkan Temuan Terdaftar di Sistem Lost & Found'}
      </span>

      {/* SELECTED CANDIDATE CARD #1 */}
      {primaryItem ? (
        <div className="selected-candidate-card">
          <div className="candidate-top-banner">
            <span className="selected-tag">Kandidat Utama</span>
            <span className="candidate-ref-id">{primaryItem.id}</span>
            <span className="found-timestamp">• Ditemukan: {primaryItem.foundAt || 'Hari Ini, 11:20 WIB'}</span>
          </div>

          <div className="candidate-main-split">
            {/* Photo Section with Zoom Overlay */}
            <div className="candidate-photo-wrapper">
              <img 
                src={primaryItem.photoUrl || "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=480&auto=format&fit=crop&q=80"} 
                alt={primaryItem.name}
                className="candidate-img"
              />
              <div 
                className="photo-zoom-btn"
                onClick={() => onZoomPhoto(primaryItem.photoUrl || "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=1000&auto=format&fit=crop&q=80")}
                title="Perbesar Foto"
              >
                <Maximize2 size={13} />
              </div>
              <span className="photo-officer-caption">📷 Foto Petugas HK</span>
            </div>

            {/* Right Score and Location Details */}
            <div className="candidate-metrics-col">
              {/* FO Safe Box Location */}
              <div className="fo-vault-location-pill">
                <Lock size={13} className="vault-icon" />
                <span>LOKASI BRANKAS FO: <strong>{primaryItem.storageLocation || 'Loker #B-12'}</strong></span>
              </div>

              {/* Match Verification Score */}
              <div className="ai-score-card">
                <div className="score-circle">
                  <span className="score-number">
                    {primaryItem.confidenceScore != null ? `${primaryItem.confidenceScore}%` : (primaryItem.score != null ? `${primaryItem.score}%` : '98%')}
                  </span>
                </div>
                <div className="score-text">
                  <span className="score-title">
                    {(primaryItem.confidenceScore || 98) >= 80 
                      ? 'Tingkat Kesesuaian Fisik Sangat Tinggi' 
                      : (primaryItem.confidenceScore || 98) >= 50 
                        ? 'Tingkat Kesesuaian Sedang' 
                        : 'Tingkat Kesesuaian Rendah'}
                  </span>
                  <span className="score-desc">
                    {primaryItem.aiBreakdown?.featureSimilarity?.desc 
                      ? `${primaryItem.aiBreakdown.featureSimilarity.desc} • ${primaryItem.aiBreakdown.locationProximity?.desc || ''}`
                      : 'Kamar, Kategori, Model & Ciri Khusus Sinkron'}
                  </span>
                </div>
              </div>

              {/* Officer Details Grid */}
              <div className="officer-meta-grid">
                <div className="officer-meta-box">
                  <span className="meta-box-label">Petugas Penemu:</span>
                  <span className="meta-box-val">{primaryItem.finderName || 'Siti Aminah (HK - Lt 3)'}</span>
                </div>
                <div className="officer-meta-box">
                  <span className="meta-box-label">Lokasi Penemuan:</span>
                  <span className="meta-box-val">{primaryItem.locationFound || primaryItem.roomNumber || 'Kamar 314'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Room Attendant Physical Notes */}
          <div className="hk-physical-notes-box">
            <div className="notes-box-header">
              <FileText size={14} className="notes-icon" />
              <span>CATATAN FISIK ROOM ATTENDANT</span>
            </div>
            <p className="notes-content-text">
              &ldquo;{primaryItem.name} menyala, tali karet hitam, fisik bezel kiri ada scratch minor, ditemukan saat turnover kamar.&rdquo;
            </p>
          </div>

          {/* Match Pills Checklist */}
          <div className="match-pills-row">
            <span className="match-pill green">
              <Check size={12} /> Ciri Khusus Match
            </span>
            <span className="match-pill green">
              <Check size={12} /> Lokasi Temuan Sinkron
            </span>
            <span className="match-pill green">
              <Check size={12} /> Kategori Terkonfirmasi
            </span>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
          Belum ada barang temuan yang terkait dengan kamar ini.
        </div>
      )}

      {/* OTHER CANDIDATES SECTION */}
      {otherItems.length > 0 && (
        <div className="other-candidates-section">
          <div className="other-candidates-header">
            <span className="other-header-title">KANDIDAT TEMUAN LAINNYA DI AREA TERKAIT</span>
            <span className="other-header-action">Klik untuk beralih pembanding</span>
          </div>

          {otherItems.map((item) => (
            <div key={item.id} className="other-candidate-item">
              <img 
                src={item.photoUrl || "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=160&auto=format&fit=crop&q=80"} 
                alt={item.name}
                className="other-item-thumb"
              />
              <div className="other-item-info">
                <div className="other-item-top">
                  <span className="other-ref-id">{item.id}</span>
                  <span className="other-room-tag">{item.roomNumber}</span>
                </div>
                <span className="other-item-name">{item.name}</span>
                <span className="other-officer-meta">Penemu: {item.finderName} • {item.foundAt}</span>
              </div>
              <div className="other-item-actions">
                <button 
                  type="button" 
                  className="compare-switch-btn"
                  onClick={() => onSelectCandidate(item)}
                >
                  Bandingkan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default HousekeepingCandidatesCard;
