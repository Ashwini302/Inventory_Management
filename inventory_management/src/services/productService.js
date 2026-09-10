const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Handle API HTTP response
 */
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = { message: await response.text() };
  }

  if (!response.ok) {
    const errorMsg = data.message || `API error (${response.status}): ${response.statusText}`;
    throw new Error(errorMsg);
  }

  return data;
};

export const productService = {
  /**
   * Health check endpoint
   */
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await handleResponse(response);
    } catch (error) {
      throw new Error(`Backend unavailable: ${error.message}`);
    }
  },

  /**
   * Get all products (with optional search and category filters)
   */
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'All Categories') {
      query.append('category', params.category);
    }

    const queryString = query.toString();
    const url = `${API_BASE_URL}/products${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    return await handleResponse(response);
  },

  /**
   * Get low stock products endpoint
   */
  async getLowStockProducts() {
    const response = await fetch(`${API_BASE_URL}/products/low-stock`);
    return await handleResponse(response);
  },

  /**
   * Get product by ID
   */
  async getProductById(id) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return await handleResponse(response);
  },

  /**
   * Create a new product
   */
  async createProduct(productData) {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    return await handleResponse(response);
  },

  /**
   * Update an existing product
   */
  async updateProduct(id, productData) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    return await handleResponse(response);
  },

  /**
   * Delete a product
   */
  async deleteProduct(id) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
    return await handleResponse(response);
  },
};

export default productService;
