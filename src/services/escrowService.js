import axios from 'axios';
import { API_URL } from '../config/constants';

const escrowService = {
  createEscrow: async (orderId, amount, buyerAddress, sellerAddress) => {
    try {
      const response = await axios.post(`${API_URL}/escrow/create`, {
        orderId,
        amount,
        buyerAddress,
        sellerAddress
      });
      return response.data;
    } catch (error) {
      console.error('Error creating escrow:', error);
      throw error;
    }
  },

  getEscrowStatus: async (escrowId) => {
    try {
      const response = await axios.get(`${API_URL}/escrow/${escrowId}/status`);
      return response.data;
    } catch (error) {
      console.error('Error getting escrow status:', error);
      throw error;
    }
  },

  releaseEscrow: async (escrowId, signature) => {
    try {
      const response = await axios.post(`${API_URL}/escrow/${escrowId}/release`, {
        signature
      });
      return response.data;
    } catch (error) {
      console.error('Error releasing escrow:', error);
      throw error;
    }
  },

  refundEscrow: async (escrowId, signature) => {
    try {
      const response = await axios.post(`${API_URL}/escrow/${escrowId}/refund`, {
        signature
      });
      return response.data;
    } catch (error) {
      console.error('Error refunding escrow:', error);
      throw error;
    }
  },

  getEscrowDetails: async (escrowId) => {
    try {
      const response = await axios.get(`${API_URL}/escrow/${escrowId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting escrow details:', error);
      throw error;
    }
  }
};

export default escrowService; 