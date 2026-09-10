import React, { useState, useEffect, useMemo, useCallback } from 'react';
import productService from './services/productService';
import Header from './components/Header';
import DashboardStats from './components/DashboardStats';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import ProductTable from './components/ProductTable';
import ProductModal from './components/ProductModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import NotificationToast from './components/NotificationToast';
import { LoadingState, EmptyState, ErrorMessage } from './components/StateViews';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBackendConnected, setIsBackendConnected] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirmation Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notification Toast
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // First check health
      await productService.checkHealth();
      setIsBackendConnected(true);

      const response = await productService.getProducts();
      if (response && response.success) {
        setProducts(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Fetch products error:', err);
      setIsBackendConnected(false);
      setError(err.message || 'Unable to load products. Please check server status.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Extract unique categories dynamically from products
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category) set.add(p.category.trim());
    });
    return Array.from(set).sort();
  }, [products]);

  // Filter products based on search query, selected category, and low stock toggle
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search by name (case-insensitive)
      const matchesSearch = searchQuery.trim() === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase().trim());

      // Filter by category
      const matchesCategory = selectedCategory === 'All Categories' || 
        product.category.toLowerCase() === selectedCategory.toLowerCase();

      // Filter low stock
      const matchesLowStock = !showLowStockOnly || 
        (Number(product.quantity) <= Number(product.minStock));

      return matchesSearch && matchesCategory && matchesLowStock;
    });
  }, [products, searchQuery, selectedCategory, showLowStockOnly]);

  // Product CRUD Handlers
  const handleOpenAddModal = () => {
    setModalMode('add');
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = async (formData) => {
    setIsSubmitting(true);
    try {
      if (modalMode === 'add') {
        const res = await productService.createProduct(formData);
        if (res.success) {
          showToast('Product added successfully!');
          await fetchProducts();
          handleCloseModal();
        } else {
          throw new Error(res.message || 'Failed to create product');
        }
      } else {
        const id = selectedProduct.id || selectedProduct._id;
        const res = await productService.updateProduct(id, formData);
        if (res.success) {
          showToast('Product updated successfully!');
          await fetchProducts();
          handleCloseModal();
        } else {
          throw new Error(res.message || 'Failed to update product');
        }
      }
    } catch (err) {
      throw err; // Passed to ProductModal internal form error state
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      const id = productToDelete.id || productToDelete._id;
      const res = await productService.deleteProduct(id);
      if (res.success) {
        showToast('Product deleted successfully!');
        await fetchProducts();
        handleCloseDeleteModal();
      } else {
        showToast(res.message || 'Failed to delete product', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error deleting product', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="app-layout">
      <Header isBackendConnected={isBackendConnected} onRefresh={fetchProducts} />

      <main className="main-content">
        <div className="container">
          {/* Dashboard Summary Statistics */}
          <DashboardStats products={products} />

          {/* Controls Bar: Search, Category Filter, Low Stock Toggle, Add Button */}
          <div className="controls-card">
            <div className="controls-left">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery('')}
              />
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onChange={setSelectedCategory}
              />
              <button
                className={`btn btn-toggle ${showLowStockOnly ? 'active' : ''}`}
                onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                title="Show low stock items only"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                </svg>
                <span>Low Stock Filter</span>
              </button>
            </div>

            <div className="controls-right">
              <button className="btn btn-primary" onClick={handleOpenAddModal}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Main Content Area based on states */}
          <div className="table-card">
            {loading ? (
              <LoadingState />
            ) : error ? (
              <ErrorMessage message={error} onRetry={fetchProducts} />
            ) : filteredProducts.length === 0 ? (
              <EmptyState
                title={
                  searchQuery || selectedCategory !== 'All Categories' || showLowStockOnly
                    ? 'No matching products'
                    : 'No products found'
                }
                message={
                  searchQuery || selectedCategory !== 'All Categories' || showLowStockOnly
                    ? 'Try adjusting your search criteria or clear active filters.'
                    : 'Your inventory is currently empty. Click below to add your first product.'
                }
                onAddProduct={
                  !searchQuery && selectedCategory === 'All Categories' && !showLowStockOnly
                    ? handleOpenAddModal
                    : undefined
                }
              />
            ) : (
              <ProductTable
                products={filteredProducts}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
              />
            )}
          </div>
        </div>
      </main>

      {/* Modals & Toast Notifications */}
      <ProductModal
        isOpen={isModalOpen}
        mode={modalMode}
        product={selectedProduct}
        onClose={handleCloseModal}
        onSubmit={handleSaveProduct}
        isSubmitting={isSubmitting}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        product={productToDelete}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      <NotificationToast
        notification={notification}
        onClose={() => setNotification(null)}
      />
    </div>
  );
}

export default App;
