import { API_URL } from '../config/constants';
import axios from 'axios';

const orderService = {
  getAllOrders: async () => {
    const response = await axios.get(`${API_URL}/orders`);
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await axios.get(`${API_URL}/orders/${id}`);
    return response.data;
  },

  createOrder: async (orderData) => {
    const response = await axios.post(`${API_URL}/orders`, orderData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await axios.put(
      `${API_URL}/orders/${id}/status`,
      { status },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  cancelOrder: async (id) => {
    const response = await axios.put(
      `${API_URL}/orders/${id}/cancel`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },
};

export const useOrderService = () => {
  return orderService;
};

export default orderService; 