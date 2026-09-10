import React from 'react';

export const LowStockBadge = ({ quantity, minStock }) => {
  const isLowStock = Number(quantity) <= Number(minStock);

  if (isLowStock) {
    return (
      <span className="badge badge-low-stock">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>LOW STOCK</span>
      </span>
    );
  }

  return (
    <span className="badge badge-in-stock">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
      <span>IN STOCK</span>
    </span>
  );
};

export default LowStockBadge;
