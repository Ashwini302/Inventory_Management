import React from 'react';

export const CategoryFilter = ({ categories = [], selectedCategory, onChange }) => {
  return (
    <div className="category-filter-container">
      <label htmlFor="category-select" className="sr-only">
        Filter by category
      </label>
      <div className="select-wrapper">
        <select
          id="category-select"
          className="category-select"
          value={selectedCategory}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="All Categories">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <svg className="select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
};

export default CategoryFilter;
