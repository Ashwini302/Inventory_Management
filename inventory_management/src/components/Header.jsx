import React from 'react';

export const Header = ({ isBackendConnected, onRefresh }) => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-brand">
          <div className="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div>
            <h1 className="brand-title">StockMaster</h1>
            <p className="brand-subtitle">Inventory & Product Management System</p>
          </div>
        </div>

        <div className="header-actions">
          <div className={`status-pill ${isBackendConnected ? 'online' : 'offline'}`}>
            <span className="status-dot"></span>
            <span className="status-text">
              {isBackendConnected ? 'Backend Connected' : 'Server Offline'}
            </span>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onRefresh} title="Refresh Data">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6" />
              <path d="M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            <span>Sync</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
