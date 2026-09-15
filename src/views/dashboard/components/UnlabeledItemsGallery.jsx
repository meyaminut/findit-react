import React from 'react';
import { Camera, ArrowRight } from 'lucide-react';

/**
 * View Component: UnlabeledItemsGallery
 * Renders the bottom grid of newly checked-in items awaiting official labeling.
 */
export function UnlabeledItemsGallery({ items }) {
  return (
    <section className="unlabeled-storage-section">
      {/* Section Header */}
      <div className="unlabeled-header-row">
        <div className="unlabeled-title-group">
          <Camera size={18} className="camera-icon-blue" />
          <h2 className="unlabeled-title-text">Barang Baru Masuk Belum Terlabel</h2>
        </div>
        <button type="button" className="view-all-storage-link">
          <span>Lihat Semua Storage</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Grid of 4 Photo Cards */}
      <div className="unlabeled-cards-grid">
        {items.map((item) => (
          <div key={item.id} className="unlabeled-photo-card">
            {/* Image Box with Room Badge */}
            <div className="unlabeled-img-container">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="unlabeled-item-img"
                loading="lazy"
              />
              <span className="room-tag-overlay">{item.roomTag}</span>
            </div>

            {/* Card Meta Content */}
            <div className="unlabeled-item-info">
              <h4 className="unlabeled-item-title">{item.title}</h4>
              <span className="unlabeled-item-meta">
                {item.time} {item.shift}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default UnlabeledItemsGallery;
