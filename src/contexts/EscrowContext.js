import React, { createContext, useContext, useState } from 'react';
import escrowService from '../services/escrowService';

const EscrowContext = createContext();

export const useEscrow = () => {
  const context = useContext(EscrowContext);
  if (!context) {
    throw new Error('useEscrow must be used within an EscrowProvider');
  }
  return context;
};

export const EscrowProvider = ({ children }) => {
  const [escrow, setEscrow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createEscrow = async (orderId, amount, buyerAddress, sellerAddress) => {
    try {
      setLoading(true);
      setError(null);
      const newEscrow = await escrowService.createEscrow(
        orderId,
        amount,
        buyerAddress,
        sellerAddress
      );
      setEscrow(newEscrow);
      return newEscrow;
    } catch (error) {
      console.error('Failed to create escrow:', error);
      setError('Failed to create escrow');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getEscrowStatus = async (escrowId) => {
    try {
      setLoading(true);
      setError(null);
      const status = await escrowService.getEscrowStatus(escrowId);
      return status;
    } catch (error) {
      console.error('Failed to get escrow status:', error);
      setError('Failed to get escrow status');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const releaseEscrow = async (escrowId, signature) => {
    try {
      setLoading(true);
      setError(null);
      const result = await escrowService.releaseEscrow(escrowId, signature);
      return result;
    } catch (error) {
      console.error('Failed to release escrow:', error);
      setError('Failed to release escrow');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refundEscrow = async (escrowId, signature) => {
    try {
      setLoading(true);
      setError(null);
      const result = await escrowService.refundEscrow(escrowId, signature);
      return result;
    } catch (error) {
      console.error('Failed to refund escrow:', error);
      setError('Failed to refund escrow');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getEscrowDetails = async (escrowId) => {
    try {
      setLoading(true);
      setError(null);
      const details = await escrowService.getEscrowDetails(escrowId);
      setEscrow(details);
      return details;
    } catch (error) {
      console.error('Failed to get escrow details:', error);
      setError('Failed to get escrow details');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    escrow,
    loading,
    error,
    createEscrow,
    getEscrowStatus,
    releaseEscrow,
    refundEscrow,
    getEscrowDetails
  };

  return (
    <EscrowContext.Provider value={value}>
      {children}
    </EscrowContext.Provider>
  );
};

export default EscrowProvider; 