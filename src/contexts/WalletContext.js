import React, { createContext, useState, useContext } from 'react';

const WalletContext = createContext(null);

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState('');
  const [transactions, setTransactions] = useState([]);

  const connectWallet = async () => {
    // Implementar conexão com carteira Bitcoin
    console.log('Conectando carteira...');
  };

  const getBalance = async () => {
    // Implementar busca de saldo
    console.log('Buscando saldo...');
  };

  const sendTransaction = async (toAddress, amount) => {
    // Implementar envio de transação
    console.log('Enviando transação...');
  };

  const value = {
    balance,
    address,
    transactions,
    connectWallet,
    getBalance,
    sendTransaction
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}; 