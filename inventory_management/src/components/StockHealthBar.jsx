import React from 'react';

export const StockHealthBar = ({ products = [] }) => {
  const total = products.length;
  if (total === 0) return null;

  const lowStockCount = products.filter(
    (item) => Number(item.quantity) <= Number(item.minStock) && Number(item.quantity) > 0
  ).length;

  const outOfStockCount = products.filter((item) => Number(item.quantity) === 0).length;

  const inStockCount = total - lowStockCount - outOfStockCount;

  const inStockPct = Math.round((inStockCount / total) * 100);
  const lowStockPct = Math.round((lowStockCount / total) * 100);
  const outOfStockPct = 100 - inStockPct - lowStockPct;

  return (
    <div className="stock-health-container">
      <div className="stock-health-header">
        <div className="health-title-group">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          <span className="health-title">Inventory Health Ratio</span>
        </div>
        <div className="health-legend">
          <span className="legend-item legend-good">
            <span className="legend-dot"></span> In Stock ({inStockCount})
          </span>
          <span className="legend-item legend-warning">
            <span className="legend-dot"></span> Low Stock ({lowStockCount})
          </span>
          <span className="legend-item legend-danger">
            <span className="legend-dot"></span> Out of Stock ({outOfStockCount})
          </span>
        </div>
      </div>

      <div className="health-progress-bar">
        <div
          className="bar-segment segment-good"
          style={{ width: `${inStockPct}%` }}
          title={`In Stock: ${inStockCount} (${inStockPct}%)`}
        ></div>
        <div
          className="bar-segment segment-warning"
          style={{ width: `${lowStockPct}%` }}
          title={`Low Stock: ${lowStockCount} (${lowStockPct}%)`}
        ></div>
        <div
          className="bar-segment segment-danger"
          style={{ width: `${outOfStockPct}%` }}
          title={`Out of Stock: ${outOfStockCount} (${outOfStockPct}%)`}
        ></div>
      </div>
    </div>
  );
};

export default StockHealthBar;
