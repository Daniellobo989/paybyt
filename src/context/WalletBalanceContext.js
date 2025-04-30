import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { WalletContext } from './WalletContext';

const WalletBalanceContext = createContext();

function WalletBalanceProvider({ children }) {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const { isAuthenticated } = useContext(AuthContext);
  const { wallet } = useContext(WalletContext);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBalance();
      fetchTransactions();
    }
  }, [isAuthenticated]);

  const fetchBalance = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/wallet/balance');
      setBalance(response.data.balance);
    } catch (err) {
      setError('Erro ao carregar saldo');
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/wallet/transactions');
      setTransactions(response.data);
    } catch (err) {
      setError('Erro ao carregar transações');
    }
  };

  const deposit = async (amount) => {
    try {
      setLoading(true);
      
      // Criar endereço de depósito único
      const depositResponse = await axios.post('http://localhost:4000/api/wallet/deposit', {
        amount
      });

      // Iniciar monitoramento do depósito
      const monitorTx = await wallet.contracts.deposit.monitorDeposit(
        depositResponse.data.depositAddress,
        amount
      );

      // Atualizar saldo após confirmação
      await fetchBalance();
      await fetchTransactions();

      return { 
        success: true, 
        data: {
          depositAddress: depositResponse.data.depositAddress,
          monitorTx
        }
      };
    } catch (err) {
      setError('Erro ao processar depósito');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async (amount, address) => {
    try {
      setLoading(true);
      
      // Verificar saldo suficiente
      if (amount > balance) {
        throw new Error('Saldo insuficiente');
      }

      // Criar transação de saque
      const response = await axios.post('http://localhost:4000/api/wallet/withdraw', {
        amount,
        address
      });

      // Atualizar saldo após saque
      await fetchBalance();
      await fetchTransactions();

      return { success: true, data: response.data };
    } catch (err) {
      setError('Erro ao processar saque');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getDepositHistory = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/wallet/deposits');
      return response.data;
    } catch (err) {
      throw new Error('Erro ao buscar histórico de depósitos');
    }
  };

  const getWithdrawalHistory = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/wallet/withdrawals');
      return response.data;
    } catch (err) {
      throw new Error('Erro ao buscar histórico de saques');
    }
  };

  return (
    <WalletBalanceContext.Provider
      value={{
        balance,
        loading,
        error,
        transactions,
        deposit,
        withdraw,
        getDepositHistory,
        getWithdrawalHistory,
        fetchBalance,
        fetchTransactions
      }}
    >
      {children}
    </WalletBalanceContext.Provider>
  );
}

export { WalletBalanceContext, WalletBalanceProvider }; 