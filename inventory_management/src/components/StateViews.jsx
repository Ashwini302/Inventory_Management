import React from 'react';

export const LoadingState = ({ message = 'Loading products...' }) => {
  return (
    <div className="state-container loading-state">
      <div className="spinner-large"></div>
      <p className="state-message">{message}</p>
    </div>
  );
};

export const EmptyState = ({
  title = 'No products found',
  message = 'Get started by creating your first product or try adjusting your search filters.',
  onAddProduct,
}) => {
  return (
    <div className="state-container empty-state">
      <div className="state-icon-wrapper">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      </div>
      <h3 className="state-title">{title}</h3>
      <p className="state-message">{message}</p>
      {onAddProduct && (
        <button className="btn btn-primary mt-4" onClick={onAddProduct}>
          + Add First Product
        </button>
      )}
    </div>
  );
};

export const ErrorMessage = ({
  message = 'Unable to load products. Please check if backend server is running.',
  onRetry,
}) => {
  return (
    <div className="state-container error-state">
      <div className="state-icon-wrapper icon-error">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className="state-title">Connection Error</h3>
      <p className="state-message">{message}</p>
      {onRetry && (
        <button className="btn btn-secondary mt-4" onClick={onRetry}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
            <path d="M23 4v6h-6" />
            <path d="M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          Try Again
        </button>
      )}
    </div>
  );
};
