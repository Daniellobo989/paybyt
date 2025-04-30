import { API_URL } from '../config/constants';
import axios from 'axios';

const productService = {
  getAllProducts: async () => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  },

  getProductById: async (id) => {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await axios.post(`${API_URL}/products`, productData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await axios.put(`${API_URL}/products/${id}`, productData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await axios.delete(`${API_URL}/products/${id}`);
    return response.data;
  },
};

export const useProductService = () => {
  return productService;
};

export default productService; 