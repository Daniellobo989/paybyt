import React, { useContext, useState } from 'react';
import { WalletContext } from '../context/WalletContext';

function WalletInfo() {
  const {
    balance,
    address,
    loading,
    error,
    createPayment,
    checkPaymentStatus,
    generateNewAddress,
    refreshWallet,
  } = useContext(WalletContext);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentError, setPaymentError] = useState(null);

  const handleCreatePayment = async (amount, orderId) => {
    setPaymentError(null);
    const result = await createPayment(amount, orderId);
    if (result.success) {
      setPaymentStatus(result.data);
      // Iniciar verificação do status do pagamento
      startPaymentStatusCheck(result.data.paymentId);
    } else {
      setPaymentError(result.error);
    }
  };

  const startPaymentStatusCheck = (paymentId) => {
    const interval = setInterval(async () => {
      const result = await checkPaymentStatus(paymentId);
      if (result.success) {
        if (result.data.status === 'confirmed') {
          clearInterval(interval);
          refreshWallet();
        }
        setPaymentStatus(result.data);
      } else {
        setPaymentError(result.error);
        clearInterval(interval);
      }
    }, 5000); // Verificar a cada 5 segundos
  };

  if (loading) return <div className="text-center py-4">Carregando...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Carteira Bitcoin</h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Saldo</p>
          <p className="text-2xl font-semibold text-gray-900">
            {balance} BTC
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Endereço</p>
          <div className="flex items-center mt-1">
            <p className="text-sm text-gray-900 font-mono">{address}</p>
            <button
              onClick={generateNewAddress}
              className="ml-2 text-sm text-indigo-600 hover:text-indigo-500"
            >
              Gerar Novo
            </button>
          </div>
        </div>

        {paymentStatus && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-900">Status do Pagamento</h3>
            <p className="mt-1 text-sm text-gray-500">
              ID: {paymentStatus.paymentId}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Status: {paymentStatus.status}
            </p>
            {paymentStatus.amount && (
              <p className="mt-1 text-sm text-gray-500">
                Valor: {paymentStatus.amount} BTC
              </p>
            )}
          </div>
        )}

        {paymentError && (
          <div className="mt-4 p-4 bg-red-50 rounded-md">
            <p className="text-sm text-red-600">{paymentError}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default WalletInfo; 