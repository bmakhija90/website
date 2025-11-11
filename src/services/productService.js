import axios from 'axios';
import config from '../config';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (request) => {
    if (config.IS_DEVELOPMENT) {
      console.log(`🔄 API Call: ${request.method?.toUpperCase()} ${request.url}`, request.params);
    }
    return request;
  },
  (error) => {
    if (config.IS_DEVELOPMENT) {
      console.error('❌ API Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    if (config.IS_DEVELOPMENT) {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    if (config.IS_DEVELOPMENT) {
      console.error('❌ API Response Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data
      });
    }
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.warn('Unauthorized access - redirect to login');
    } else if (error.response?.status === 404) {
      console.warn('Resource not found');
    } else if (error.code === 'NETWORK_ERROR') {
      console.error('Network error - please check your connection');
    }
    
    return Promise.reject(error);
  }
);

const productService = {
  // Get all products
  getProducts: async (params = {}) => {
    try {
      const response = await apiClient.get('/products', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch products. Please try again later.'
      );
    }
  },

  // Get single product by ID
  getProductById: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch product details. Please try again later.'
      );
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await apiClient.get(`/products/category/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      throw new Error(
        error.response?.data?.message || 
        `Failed to fetch products in ${category} category.`
      );
    }
  },

  // Search products
  searchProducts: async (query) => {
    try {
      const response = await apiClient.get('/products/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error(`Error searching products for "${query}":`, error);
      throw new Error('Failed to search products. Please try again.');
    }
  }
};

export default productService;