import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WalletBalanceContext } from '../context/WalletBalanceContext';
import { AuthContext } from '../context/AuthContext';

function Wallet() {
  const navigate = useNavigate();
  const { balance, loading, error, transactions, deposit, withdraw, getDepositHistory, getWithdrawalHistory } = useContext(WalletBalanceContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [depositHistory, setDepositHistory] = useState([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('deposit');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    } else {
      loadHistory();
    }
  }, [isAuthenticated, navigate]);

  const loadHistory = async () => {
    try {
      const deposits = await getDepositHistory();
      const withdrawals = await getWithdrawalHistory();
      setDepositHistory(deposits);
      setWithdrawalHistory(withdrawals);
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      const result = await deposit(parseFloat(depositAmount));
      if (result.success) {
        setDepositAmount('');
        alert('Depósito iniciado! Use o endereço fornecido para enviar os fundos.');
      }
    } catch (err) {
      alert('Erro ao processar depósito: ' + err.message);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      const result = await withdraw(parseFloat(withdrawAmount), withdrawAddress);
      if (result.success) {
        setWithdrawAmount('');
        setWithdrawAddress('');
        alert('Saque processado com sucesso!');
      }
    } catch (err) {
      alert('Erro ao processar saque: ' + err.message);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Carregando...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Minha Carteira</h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {/* Saldo Atual */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900">Saldo Atual</h2>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{balance} BTC</p>
          </div>

          {/* Abas */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('deposit')}
                className={`${
                  activeTab === 'deposit'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Depositar
              </button>
              <button
                onClick={() => setActiveTab('withdraw')}
                className={`${
                  activeTab === 'withdraw'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Sacar
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`${
                  activeTab === 'history'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Histórico
              </button>
            </nav>
          </div>

          {/* Conteúdo das Abas */}
          <div className="mt-6">
            {activeTab === 'deposit' && (
              <form onSubmit={handleDeposit} className="space-y-4">
                <div>
                  <label htmlFor="depositAmount" className="block text-sm font-medium text-gray-700">
                    Valor do Depósito (BTC)
                  </label>
                  <input
                    type="number"
                    step="0.00000001"
                    id="depositAmount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Gerar Endereço de Depósito
                </button>
              </form>
            )}

            {activeTab === 'withdraw' && (
              <form onSubmit={handleWithdraw} className="space-y-4">
                <div>
                  <label htmlFor="withdrawAmount" className="block text-sm font-medium text-gray-700">
                    Valor do Saque (BTC)
                  </label>
                  <input
                    type="number"
                    step="0.00000001"
                    id="withdrawAmount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="withdrawAddress" className="block text-sm font-medium text-gray-700">
                    Endereço de Destino
                  </label>
                  <input
                    type="text"
                    id="withdrawAddress"
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Realizar Saque
                </button>
              </form>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico de Depósitos</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Data
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Valor
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {depositHistory.map((deposit) => (
                          <tr key={deposit._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(deposit.createdAt).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {deposit.amount} BTC
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {deposit.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico de Saques</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Data
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Valor
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Endereço
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {withdrawalHistory.map((withdrawal) => (
                          <tr key={withdrawal._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(withdrawal.createdAt).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {withdrawal.amount} BTC
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {withdrawal.address}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {withdrawal.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wallet; 