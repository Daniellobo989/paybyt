import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useWallet } from './WalletContext';

const DeliveryContext = createContext();

export const DeliveryProvider = ({ children }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const { wallet } = useWallet();

  // Configuração do contrato multisig
  const MULTISIG_CONTRACT = {
    address: process.env.REACT_APP_MULTISIG_CONTRACT_ADDRESS,
    requiredSignatures: 2, // Número de assinaturas necessárias
    signers: [
      process.env.REACT_APP_MERCHANT_WALLET,
      process.env.REACT_APP_CUSTOMER_WALLET
    ]
  };

  // Configuração do oráculo Chainlink
  const CHAINLINK_CONFIG = {
    oracleAddress: process.env.REACT_APP_CHAINLINK_ORACLE_ADDRESS,
    jobId: process.env.REACT_APP_CHAINLINK_JOB_ID,
    fee: process.env.REACT_APP_CHAINLINK_FEE
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDeliveries();
    }
  }, [isAuthenticated]);

  const fetchDeliveries = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/deliveries');
      setDeliveries(response.data);
    } catch (err) {
      setError('Erro ao carregar entregas');
    }
  };

  const createDelivery = async (orderId, deliveryDetails) => {
    try {
      setLoading(true);
      
      // Criar entrega no backend
      const response = await axios.post('http://localhost:4000/api/deliveries', {
        orderId,
        ...deliveryDetails
      });

      // Inicializar contrato multisig
      const multisigTx = await initializeMultisigContract(response.data._id, deliveryDetails.amount);
      
      // Configurar oráculo Chainlink para rastreamento
      await setupChainlinkOracle(response.data._id, deliveryDetails.trackingNumber);

      setDeliveries(prev => [...prev, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      setError('Erro ao criar entrega');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const initializeMultisigContract = async (deliveryId, amount) => {
    try {
      // Aqui você implementaria a lógica para inicializar o contrato multisig
      // usando a biblioteca ethers.js ou web3.js
      // Exemplo simplificado:
      const tx = await wallet.contracts.multisig.createTransaction(
        MULTISIG_CONTRACT.address,
        amount,
        deliveryId
      );
      return tx;
    } catch (err) {
      throw new Error('Erro ao inicializar contrato multisig');
    }
  };

  const setupChainlinkOracle = async (deliveryId, trackingNumber) => {
    try {
      // Configurar o oráculo Chainlink para rastrear a entrega
      // Exemplo simplificado:
      const tx = await wallet.contracts.chainlink.requestData(
        CHAINLINK_CONFIG.oracleAddress,
        CHAINLINK_CONFIG.jobId,
        CHAINLINK_CONFIG.fee,
        deliveryId,
        trackingNumber
      );
      return tx;
    } catch (err) {
      throw new Error('Erro ao configurar oráculo Chainlink');
    }
  };

  const updateDeliveryStatus = async (deliveryId, status) => {
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:4000/api/deliveries/${deliveryId}`, {
        status
      });

      // Se a entrega foi concluída, liberar fundos do contrato multisig
      if (status === 'ENTREGUE') {
        await releaseMultisigFunds(deliveryId);
      }

      setDeliveries(prev => prev.map(d => 
        d._id === deliveryId ? response.data : d
      ));
      return { success: true, data: response.data };
    } catch (err) {
      setError('Erro ao atualizar status da entrega');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const releaseMultisigFunds = async (deliveryId) => {
    try {
      // Liberar fundos do contrato multisig
      // Exemplo simplificado:
      const tx = await wallet.contracts.multisig.releaseFunds(
        MULTISIG_CONTRACT.address,
        deliveryId
      );
      return tx;
    } catch (err) {
      throw new Error('Erro ao liberar fundos do contrato multisig');
    }
  };

  const getDeliveryStatus = async (deliveryId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/deliveries/${deliveryId}/status`);
      return response.data;
    } catch (err) {
      throw new Error('Erro ao buscar status da entrega');
    }
  };

  const value = {
    deliveries,
    loading,
    error,
    createDelivery,
    updateDeliveryStatus,
    releaseMultisigFunds,
    getDeliveryStatus
  };

  return (
    <DeliveryContext.Provider value={value}>
      {children}
    </DeliveryContext.Provider>
  );
};

export const useDelivery = () => {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error('useDelivery must be used within a DeliveryProvider');
  }
  return context;
}; 