import React from 'react';
import { 
  PieChart, 
  Laptop, 
  Shirt, 
  CreditCard, 
  Box, 
  Info 
} from 'lucide-react';

/**
 * View Component: CategoryStatsWidget
 * Renders the category breakdown progress bars and high-value security advisory note.
 */
export function CategoryStatsWidget({ categories }) {
  const getCatIcon = (icon) => {
    switch (icon) {
      case 'laptop':
        return <Laptop size={14} className="cat-icon-blue" />;
      case 'hanger':
        return <Shirt size={14} className="cat-icon-amber" />;
      case 'card':
        return <CreditCard size={14} className="cat-icon-green" />;
      default:
        return <Box size={14} className="cat-icon-gray" />;
    }
  };

  return (
    <div className="dashboard-widget-card category-stats-card">
      {/* Header */}
      <div className="category-header-row">
        <div className="category-title-group">
          <h3 className="category-title-text">Kategori Barang</h3>
          <p className="category-subtitle-text">Statistik temuan bulan berjalan</p>
        </div>
        <div className="pie-icon-btn">
          <PieChart size={18} className="pie-icon-muted" />
        </div>
      </div>

      {/* Category Bars List */}
      <div className="category-progress-list">
        {categories.map((cat) => (
          <div key={cat.id} className="category-progress-item">
            <div className="category-item-meta">
              <div className="category-name-group">
                {getCatIcon(cat.icon)}
                <span className="category-name-label">{cat.name}</span>
              </div>
              <span className="category-percent-label" style={{ color: cat.color }}>
                {cat.percent}% ({cat.items} item)
              </span>
            </div>
            {/* Progress Bar Track */}
            <div className="progress-bar-track">
              <div 
                className="progress-bar-fill"
                style={{ 
                  width: `${cat.percent}%`,
                  backgroundColor: cat.color 
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* High-Value Item Security Advisory Callout */}
      <div className="category-info-callout">
        <Info size={15} className="info-icon-amber" />
        <span className="info-callout-text">
          Kategori Berharga tinggi otomatis memerlukan 2x otorisasi FO.
        </span>
      </div>
    </div>
  );
}

export default CategoryStatsWidget;
