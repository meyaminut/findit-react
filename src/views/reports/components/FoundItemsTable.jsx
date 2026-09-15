import React from 'react';
import { Package, Trash2, MapPin, CheckCircle2 } from 'lucide-react';

/**
 * View Component: FoundItemsTable
 * Master inventory table or clean empty state.
 */
export function FoundItemsTable({
  items,
  onOpenManualModal,
  onLoadSampleData,
  onDeleteItem,
  onUpdateStatus
}) {
  if (!items || items.length === 0) {
    return (
      <div className="claim-empty-state-card">
        <div className="empty-icon-box">
          <Package size={28} className="empty-ticket-icon" />
        </div>
        <h3 className="empty-title">Belum Ada Barang Temuan</h3>
        <p className="empty-subtitle">
          Data inventaris telah dikosongkan. Catat barang baru yang ditemukan oleh staf Housekeeping di area kamar atau fasilitas hotel.
        </p>
        <div className="empty-actions-row">
          <button
            type="button"
            className="btn-create-empty-amber"
            onClick={onOpenManualModal}
          >
            + Input Temuan Manual Baru
          </button>
          <button
            type="button"
            className="btn-seed-sample"
            onClick={onLoadSampleData}
          >
            Muat 2 Sampel Uji Coba
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-table-container">
      <table className="master-inventory-table">
        <thead>
          <tr>
            <th style={{ width: '80px' }}>FOTO</th>
            <th style={{ width: '150px' }}>NO. REGISTRASI</th>
            <th style={{ width: '110px' }}>NO. KAMAR</th>
            <th>KATEGORI</th>
            <th>DESKRIPSI BARANG &amp; POSISI</th>
            <th>PETUGAS PENCATAT</th>
            <th>WAKTU DITEMUKAN</th>
            <th>LOKASI SIMPAN</th>
            <th style={{ width: '60px', textAlign: 'center' }}>AKSI</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="inventory-table-row">
              {/* Foto Thumbnail */}
              <td className="cell-photo">
                <div className="item-thumbnail-wrap">
                  <img
                    src={item.photoUrl}
                    alt={item.name}
                    className="item-thumbnail-img"
                  />
                </div>
              </td>

              {/* No Registrasi */}
              <td className="cell-reg-num">
                <span className="reg-num-text">{item.id}</span>
              </td>

              {/* No Kamar */}
              <td className="cell-room-badge">
                <span className="room-number-chip">Kamar {item.roomNumber}</span>
              </td>

              {/* Kategori */}
              <td className="cell-category">
                <span className="category-text">{item.category}</span>
              </td>

              {/* Deskripsi & Posisi */}
              <td className="cell-desc-pos">
                <div className="desc-pos-stack">
                  <span className="item-title-bold">{item.name}</span>
                  <span className="item-pos-sub">
                    <MapPin size={11} className="pin-icon" />
                    {item.locationFound}
                  </span>
                </div>
              </td>

              {/* Petugas Pencatat */}
              <td className="cell-officer">
                <span className="officer-name-text">{item.finderName}</span>
              </td>

              {/* Waktu Ditemukan */}
              <td className="cell-time">
                <span className="found-time-text">{item.foundAt}</span>
              </td>

              {/* Lokasi Simpan */}
              <td className="cell-locker">
                <span className="storage-locker-pill">{item.storageLocation}</span>
              </td>

              {/* Aksi Hapus */}
              <td className="cell-action-del" style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  className="btn-trash-item"
                  title="Hapus Barang"
                  onClick={() => onDeleteItem(item.id)}
                >
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="inventory-table-footer">
        <span className="footer-count-text">
          Menampilkan {items.length} barang temuan terdaftar
        </span>
      </div>
    </div>
  );
}

export default FoundItemsTable;
