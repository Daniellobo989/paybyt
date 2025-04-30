import React, { createContext, useContext, useState, useEffect } from 'react';
import oracleService from '../services/oracleService';

const OracleContext = createContext();

export const useOracle = () => {
  const context = useContext(OracleContext);
  if (!context) {
    throw new Error('useOracle must be used within an OracleProvider');
  }
  return context;
};

export const OracleProvider = ({ children }) => {
  const [bitcoinPrice, setBitcoinPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBitcoinPrice = async () => {
    try {
      setLoading(true);
      setError(null);
      const price = await oracleService.getBitcoinPrice();
      setBitcoinPrice(price);
    } catch (error) {
      console.error('Failed to fetch Bitcoin price:', error);
      setError('Failed to fetch Bitcoin price');
    } finally {
      setLoading(false);
    }
  };

  const getExchangeRate = async (fromCurrency, toCurrency) => {
    try {
      setLoading(true);
      setError(null);
      const rate = await oracleService.getExchangeRate(fromCurrency, toCurrency);
      return rate;
    } catch (error) {
      console.error('Failed to get exchange rate:', error);
      setError('Failed to get exchange rate');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyTransaction = async (txid) => {
    try {
      setLoading(true);
      setError(null);
      const result = await oracleService.verifyTransaction(txid);
      return result;
    } catch (error) {
      console.error('Failed to verify transaction:', error);
      setError('Failed to verify transaction');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBitcoinPrice();
    const interval = setInterval(fetchBitcoinPrice, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const value = {
    bitcoinPrice,
    loading,
    error,
    getExchangeRate,
    verifyTransaction
  };

  return (
    <OracleContext.Provider value={value}>
      {children}
    </OracleContext.Provider>
  );
};

export default OracleProvider; 