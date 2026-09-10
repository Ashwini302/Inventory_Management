import React from 'react';
import LowStockBadge from './LowStockBadge';

export const ProductTable = ({ products, onEdit, onDelete, onAdjustStock }) => {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="table-responsive">
      <table className="product-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Min Stock</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const isLow = Number(product.quantity) <= Number(product.minStock);
            const id = product.id || product._id;
            return (
              <tr key={id} className={isLow ? 'row-low-stock' : ''}>
                <td className="font-semibold product-name-cell">
                  <span>{product.name}</span>
                </td>
                <td>
                  <span className="category-chip">{product.category}</span>
                </td>
                <td className="font-medium">{formatCurrency(product.price)}</td>
                <td>
                  <div className="table-qty-control">
                    <button
                      className="table-stepper-btn"
                      onClick={() => onAdjustStock(product, -1)}
                      disabled={Number(product.quantity) <= 0}
                      title="Decrease Stock (-1)"
                    >
                      -
                    </button>
                    <span className={`quantity-badge ${isLow ? 'qty-low' : ''}`}>
                      {product.quantity}
                    </span>
                    <button
                      className="table-stepper-btn"
                      onClick={() => onAdjustStock(product, 1)}
                      title="Increase Stock (+1)"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="text-muted">{product.minStock}</td>
                <td>
                  <LowStockBadge quantity={product.quantity} minStock={product.minStock} />
                </td>
                <td className="text-right actions-cell">
                  <button
                    className="btn-action btn-edit"
                    onClick={() => onEdit(product)}
                    title="Edit Product"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    <span>Edit</span>
                  </button>
                  <button
                    className="btn-action btn-delete"
                    onClick={() => onDelete(product)}
                    title="Delete Product"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    <span>Delete</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
