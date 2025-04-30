import axios from 'axios';
import { API_URL } from '../config/constants';

const oracleService = {
  getBitcoinPrice: async () => {
    try {
      const response = await axios.get(`${API_URL}/oracle/price`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);
      throw error;
    }
  },

  getExchangeRate: async (fromCurrency, toCurrency) => {
    try {
      const response = await axios.get(`${API_URL}/oracle/exchange-rate`, {
        params: { fromCurrency, toCurrency }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      throw error;
    }
  },

  verifyTransaction: async (txid) => {
    try {
      const response = await axios.get(`${API_URL}/oracle/verify/${txid}`);
      return response.data;
    } catch (error) {
      console.error('Error verifying transaction:', error);
      throw error;
    }
  }
};

export default oracleService; 