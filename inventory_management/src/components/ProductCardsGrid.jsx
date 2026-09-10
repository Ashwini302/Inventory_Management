import React from 'react';
import LowStockBadge from './LowStockBadge';

export const ProductCardsGrid = ({ products, onEdit, onDelete, onAdjustStock }) => {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="product-cards-grid">
      {products.map((product) => {
        const isLow = Number(product.quantity) <= Number(product.minStock);
        const id = product.id || product._id;
        
        // Progress ratio for minStock reference
        const maxRef = Math.max(Number(product.minStock) * 2, 20);
        const progressPct = Math.min(Math.round((Number(product.quantity) / maxRef) * 100), 100);

        return (
          <div key={id} className={`grid-card ${isLow ? 'card-low-stock' : ''}`}>
            <div className="card-top">
              <span className="category-chip">{product.category}</span>
              <LowStockBadge quantity={product.quantity} minStock={product.minStock} />
            </div>

            <div className="card-body">
              <h3 className="card-product-title">{product.name}</h3>
              <div className="card-price">{formatCurrency(product.price)}</div>

              {/* Stock Progress & Quick Controls */}
              <div className="stock-control-box">
                <div className="stock-label-row">
                  <span className="stock-text">Stock Level</span>
                  <span className="min-stock-text">Min: {product.minStock}</span>
                </div>

                <div className="card-stock-bar">
                  <div
                    className={`card-stock-fill ${isLow ? 'fill-low' : 'fill-good'}`}
                    style={{ width: `${progressPct}%` }}
                  ></div>
                </div>

                <div className="quick-qty-controls">
                  <span className="qty-label">Quantity:</span>
                  <div className="stepper-group">
                    <button
                      className="stepper-btn btn-minus"
                      onClick={() => onAdjustStock(product, -1)}
                      disabled={Number(product.quantity) <= 0}
                      title="Decrease Stock"
                    >
                      -
                    </button>
                    <span className="stepper-value">{product.quantity}</span>
                    <button
                      className="stepper-btn btn-plus"
                      onClick={() => onAdjustStock(product, 1)}
                      title="Increase Stock"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-actions">
              <button className="btn-action btn-edit" onClick={() => onEdit(product)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </button>
              <button className="btn-action btn-delete" onClick={() => onDelete(product)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductCardsGrid;
