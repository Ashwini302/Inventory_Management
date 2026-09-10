import React from 'react';

export const DashboardStats = ({ products = [] }) => {
  const totalProducts = products.length;
  
  const totalQuantity = products.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
  
  const lowStockCount = products.filter(
    (item) => Number(item.quantity) <= Number(item.minStock)
  ).length;

  const totalValue = products.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon icon-blue">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <div className="stat-info">
          <span className="stat-label">Total Products</span>
          <h3 className="stat-value">{totalProducts}</h3>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon icon-purple">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        </div>
        <div className="stat-info">
          <span className="stat-label">Total Inventory Units</span>
          <h3 className="stat-value">{totalQuantity.toLocaleString()}</h3>
        </div>
      </div>

      <div className={`stat-card ${lowStockCount > 0 ? 'highlight-warning' : ''}`}>
        <div className="stat-icon icon-amber">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <div className="stat-info">
          <span className="stat-label">Low Stock Alerts</span>
          <h3 className="stat-value warning-text">{lowStockCount}</h3>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon icon-emerald">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <div className="stat-info">
          <span className="stat-label">Total Inventory Value</span>
          <h3 className="stat-value emerald-text">{formatCurrency(totalValue)}</h3>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
