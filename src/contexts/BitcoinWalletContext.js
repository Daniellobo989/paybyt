import React, { createContext, useContext, useState, useEffect } from 'react';
import Sentry from '../config/sentry';
import bitcoinService from '../services/bitcoinService';
import { transactionUtils } from '../utils/transactionUtils';

const BitcoinWalletContext = createContext();

export const useBitcoinWallet = () => {
  const context = useContext(BitcoinWalletContext);
  if (!context) {
    throw new Error('useBitcoinWallet must be used within a BitcoinWalletProvider');
  }
  return context;
};

export const BitcoinWalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState({ confirmed: 0, unconfirmed: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initializeWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      const newWallet = await bitcoinService.createWallet();
      setWallet(newWallet);
      
      // Initialize balance
      const balanceData = await bitcoinService.getWalletBalance(newWallet.address);
      setBalance(balanceData);
      
      // Get initial transaction history
      const history = await bitcoinService.getTransactionHistory(newWallet.address);
      setTransactions(history);
    } catch (error) {
      console.error('Failed to initialize wallet:', error);
      setError('Failed to initialize wallet');
      Sentry.captureException(error);
    } finally {
      setLoading(false);
    }
  };

  const refreshWalletData = async () => {
    if (!wallet?.address) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [balanceData, history] = await Promise.all([
        bitcoinService.getWalletBalance(wallet.address),
        bitcoinService.getTransactionHistory(wallet.address)
      ]);
      
      setBalance(balanceData);
      setTransactions(history);
    } catch (error) {
      console.error('Failed to refresh wallet data:', error);
      setError('Failed to refresh wallet data');
      Sentry.captureException(error);
    } finally {
      setLoading(false);
    }
  };

  const createPaymentRequest = async (amount) => {
    try {
      setLoading(true);
      setError(null);
      const paymentRequest = await bitcoinService.createPaymentRequest(amount);
      return paymentRequest;
    } catch (error) {
      console.error('Failed to create payment request:', error);
      setError('Failed to create payment request');
      Sentry.captureException(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async (paymentId) => {
    try {
      const status = await bitcoinService.checkPaymentStatus(paymentId);
      if (status.status === 'completed') {
        await refreshWalletData();
      }
      return status;
    } catch (error) {
      console.error('Failed to check payment status:', error);
      Sentry.captureException(error);
      throw error;
    }
  };

  const createTransaction = async (recipientAddress, amount, feeRate) => {
    try {
      setLoading(true);
      setError(null);

      // Validate inputs
      bitcoinService.validateAddress(recipientAddress);
      bitcoinService.validateAmount(amount);

      // Convert amount to satoshis
      const amountSats = transactionUtils.BTCToSatoshis(amount);
      
      // Create transaction
      const txData = {
        inputs: [], // Will be filled by the server
        outputs: [{
          address: recipientAddress,
          value: amountSats
        }]
      };

      const psbt = await bitcoinService.createTransaction(txData.inputs, txData.outputs, feeRate);
      return psbt;
    } catch (error) {
      console.error('Failed to create transaction:', error);
      setError('Failed to create transaction');
      Sentry.captureException(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const broadcastTransaction = async (txHex) => {
    try {
      setLoading(true);
      setError(null);
      const result = await bitcoinService.broadcastTransaction(txHex);
      await refreshWalletData();
      return result;
    } catch (error) {
      console.error('Failed to broadcast transaction:', error);
      setError('Failed to broadcast transaction');
      Sentry.captureException(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const estimateFee = async (amount) => {
    try {
      setLoading(true);
      setError(null);
      const fee = await bitcoinService.estimateFee(amount);
      return fee;
    } catch (error) {
      console.error('Failed to estimate fee:', error);
      setError('Failed to estimate fee');
      Sentry.captureException(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeWallet();
  }, []);

  const value = {
    wallet,
    balance,
    transactions,
    loading,
    error,
    createPaymentRequest,
    checkPaymentStatus,
    createTransaction,
    broadcastTransaction,
    estimateFee,
    refreshWalletData
  };

  return (
    <BitcoinWalletContext.Provider value={value}>
      {children}
    </BitcoinWalletContext.Provider>
  );
};

export default BitcoinWalletProvider; 