import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import * as bitcoin from 'bitcoinjs-lib';

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/wallet');
        setBalance(response.data.balance);
        setAddress(response.data.address);
        setTransactions(response.data.transactions);
      } catch (err) {
        setError('Failed to fetch wallet data');
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  const generateAddress = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/wallet/generate-address');
      setAddress(response.data.address);
      return response.data.address;
    } catch (err) {
      setError('Failed to generate address');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (amount, recipientAddress) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/wallet/create-payment', {
        amount,
        recipientAddress,
      });
      return response.data;
    } catch (err) {
      setError('Failed to create payment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async (paymentId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/wallet/payment-status/${paymentId}`);
      return response.data;
    } catch (err) {
      setError('Failed to check payment status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    balance,
    address,
    transactions,
    loading,
    error,
    generateAddress,
    createPayment,
    checkPaymentStatus,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}; 