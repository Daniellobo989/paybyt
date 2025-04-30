import { API_URL } from '../config/constants';
import axios from 'axios';

const deliveryService = {
  getAllDeliveries: async () => {
    const response = await axios.get(`${API_URL}/deliveries`);
    return response.data;
  },

  getDeliveryById: async (id) => {
    const response = await axios.get(`${API_URL}/deliveries/${id}`);
    return response.data;
  },

  updateDeliveryStatus: async (id, status) => {
    const response = await axios.put(
      `${API_URL}/deliveries/${id}/status`,
      { status },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  updateTracking: async (id, trackingData) => {
    const response = await axios.put(
      `${API_URL}/deliveries/${id}/tracking`,
      trackingData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  getDeliveryHistory: async (id) => {
    const response = await axios.get(`${API_URL}/deliveries/${id}/history`);
    return response.data;
  },
};

export const useDeliveryService = () => {
  return deliveryService;
};

export default deliveryService;