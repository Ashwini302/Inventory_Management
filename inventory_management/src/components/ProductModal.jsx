import React, { useState, useEffect } from 'react';

export const ProductModal = ({ isOpen, mode, product, onClose, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    minStock: '',
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  useEffect(() => {
    if (product && mode === 'edit') {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        price: product.price !== undefined ? String(product.price) : '',
        quantity: product.quantity !== undefined ? String(product.quantity) : '',
        minStock: product.minStock !== undefined ? String(product.minStock) : '',
      });
    } else {
      setFormData({
        name: '',
        category: '',
        price: '',
        quantity: '',
        minStock: '5',
      });
    }
    setErrors({});
    setGeneralError('');
  }, [product, mode, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Product name cannot be empty';
    }

    if (!formData.category || !formData.category.trim()) {
      newErrors.category = 'Category cannot be empty';
    }

    const priceNum = Number(formData.price);
    if (formData.price === '' || isNaN(priceNum)) {
      newErrors.price = 'Valid price is required';
    } else if (priceNum <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    const qtyNum = Number(formData.quantity);
    if (formData.quantity === '' || isNaN(qtyNum)) {
      newErrors.quantity = 'Valid quantity is required';
    } else if (qtyNum < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    } else if (!Number.isInteger(qtyNum)) {
      newErrors.quantity = 'Quantity must be an integer';
    }

    const minNum = Number(formData.minStock);
    if (formData.minStock === '' || isNaN(minNum)) {
      newErrors.minStock = 'Valid min stock is required';
    } else if (minNum < 0) {
      newErrors.minStock = 'Minimum stock cannot be negative';
    } else if (!Number.isInteger(minNum)) {
      newErrors.minStock = 'Minimum stock must be an integer';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validate()) return;

    try {
      await onSubmit({
        name: formData.name.trim(),
        category: formData.category.trim(),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        minStock: Number(formData.minStock),
      });
    } catch (err) {
      setGeneralError(err.message || 'Failed to save product. Please try again.');
    }
  };

  const isEdit = mode === 'edit';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {generalError && (
          <div className="modal-error-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Product Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-input ${errors.name ? 'input-error' : ''}`}
              placeholder="e.g. Wireless Mouse"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category <span className="required">*</span>
            </label>
            <input
              type="text"
              id="category"
              name="category"
              className={`form-input ${errors.category ? 'input-error' : ''}`}
              placeholder="e.g. Electronics, Furniture, Stationery"
              value={formData.category}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price" className="form-label">
                Price (₹) <span className="required">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                min="0"
                className={`form-input ${errors.price ? 'input-error' : ''}`}
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.price && <span className="error-text">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="quantity" className="form-label">
                Quantity <span className="required">*</span>
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                step="1"
                min="0"
                className={`form-input ${errors.quantity ? 'input-error' : ''}`}
                placeholder="0"
                value={formData.quantity}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.quantity && <span className="error-text">{errors.quantity}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="minStock" className="form-label">
                Min Stock Threshold <span className="required">*</span>
              </label>
              <input
                type="number"
                id="minStock"
                name="minStock"
                step="1"
                min="0"
                className={`form-input ${errors.minStock ? 'input-error' : ''}`}
                placeholder="5"
                value={formData.minStock}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.minStock && <span className="error-text">{errors.minStock}</span>}
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="btn-spinner-wrapper">
                  <span className="spinner-small"></span>
                  <span>Saving...</span>
                </span>
              ) : isEdit ? (
                'Save Changes'
              ) : (
                '+ Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
