import axios from 'axios';
import { networks, payments } from 'bitcoinjs-lib';
import { API_URL, BITCOIN_NETWORK, MIN_CONFIRMATIONS, SATS_PER_BTC } from '../config/constants';
import config from '../config';
import env from '../config/env';
import Sentry from '../config/sentry';
import { transactionUtils } from '../utils/transactionUtils';

const API_URL_LOCAL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

class BitcoinService {
  constructor() {
    this.network = BITCOIN_NETWORK === 'mainnet' ? networks.bitcoin : networks.testnet;
  }

  validateAmount(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new Error('Invalid amount: must be a number');
    }
    if (amount <= 0) {
      throw new Error('Invalid amount: must be greater than zero');
    }
    if (amount > 100000) { // Maximum limit of R$ 100,000
      throw new Error('Amount exceeds maximum limit');
    }
  }

  validateAddress(address) {
    if (!address || typeof address !== 'string') {
      throw new Error('Invalid Bitcoin address');
    }
    try {
      const { version } = payments.p2pkh({
        address,
        network: this.network
      });
      return version !== undefined;
    } catch (error) {
      throw new Error('Invalid Bitcoin address');
    }
  }

  async createWallet() {
    try {
      const response = await api.post('/bitcoin/wallet', {
        network: env.bitcoinNetwork
      });
      return response.data;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error('Failed to create wallet');
    }
  }

  async getWalletBalance(address) {
    try {
      this.validateAddress(address);
      const response = await api.get(`/bitcoin/balance/${address}`);
      
      if (!response.data || typeof response.data.confirmed !== 'number' || typeof response.data.unconfirmed !== 'number') {
        throw new Error('Invalid server response when fetching balance');
      }
      
      return {
        confirmed: response.data.confirmed,
        unconfirmed: response.data.unconfirmed
      };
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      throw new Error('Could not fetch wallet balance');
    }
  }

  async createPaymentRequest(amount) {
    try {
      this.validateAmount(amount);

      const response = await api.post('/payments/create', { 
        amount,
        network: BITCOIN_NETWORK,
        minConfirmations: MIN_CONFIRMATIONS,
        timestamp: Date.now(),
        nonce: Math.random().toString(36).substring(7)
      });

      if (!response.data || !response.data.address) {
        throw new Error('Invalid server response');
      }

      this.validateAddress(response.data.address);

      return response.data;
    } catch (error) {
      console.error('Error creating payment request:', error);
      throw new Error('Failed to create payment request');
    }
  }

  async checkPaymentStatus(paymentId) {
    try {
      if (!paymentId || typeof paymentId !== 'string') {
        throw new Error('Invalid payment ID');
      }

      const response = await api.get(`/payments/${paymentId}/status`, {
        params: {
          network: BITCOIN_NETWORK,
          minConfirmations: MIN_CONFIRMATIONS,
          timestamp: Date.now()
        }
      });

      if (!response.data || !response.data.status) {
        throw new Error('Invalid server response');
      }

      return response.data;
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw new Error('Failed to check payment status');
    }
  }

  async createTransaction(inputs, outputs, feeRate) {
    try {
      const txData = { inputs, outputs };
      const psbt = await transactionUtils.createTransaction(txData);
      
      const size = transactionUtils.estimateSize(inputs.length, outputs.length);
      const fee = Math.ceil(size * feeRate);
      
      transactionUtils.validateFee(fee, size);
      
      return psbt;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw new Error('Failed to create transaction');
    }
  }

  async broadcastTransaction(txHex) {
    try {
      if (typeof txHex !== 'string' || !/^[0-9a-fA-F]+$/.test(txHex)) {
        throw new Error('Invalid transaction');
      }

      const response = await api.post('/bitcoin/broadcast', {
        transaction: txHex,
        network: BITCOIN_NETWORK,
        timestamp: Date.now(),
        nonce: Math.random().toString(36).substring(7)
      });

      if (!response.data || !response.data.txid) {
        throw new Error('Invalid server response');
      }

      return response.data;
    } catch (error) {
      console.error('Error broadcasting transaction:', error);
      throw new Error('Failed to broadcast transaction');
    }
  }

  async getTransactionHistory(address) {
    try {
      this.validateAddress(address);
      const response = await api.get(`/bitcoin/transactions/${address}`);
      
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid server response when fetching history');
      }
      
      return response.data.map(tx => ({
        txid: tx.txid,
        type: tx.type,
        amount: tx.amount,
        confirmations: tx.confirmations,
        timestamp: tx.timestamp,
        fee: tx.fee
      }));
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw new Error('Could not fetch transaction history');
    }
  }

  async estimateFee(amount) {
    try {
      this.validateAmount(amount);
      const response = await api.get('/bitcoin/estimate-fee', {
        params: { 
          amount,
          network: BITCOIN_NETWORK,
          timestamp: Date.now()
        }
      });

      if (!response.data || typeof response.data.fee !== 'number') {
        throw new Error('Invalid server response');
      }

      return response.data.fee;
    } catch (error) {
      console.error('Error estimating transaction fee:', error);
      throw new Error('Failed to estimate transaction fee');
    }
  }

  async createMultisigAddress(publicKeys) {
    try {
      if (!Array.isArray(publicKeys) || publicKeys.length < 2) {
        throw new Error('Número insuficiente de chaves públicas');
      }

      // Validar formato das chaves públicas
      publicKeys.forEach((key, index) => {
        if (typeof key !== 'string' || !/^[0-9a-fA-F]{66}$/.test(key)) {
          throw new Error(`Chave pública inválida no índice ${index}`);
        }
      });

      const payment = payments.p2sh({
        redeem: payments.p2ms({
          m: 2,
          pubkeys: publicKeys.map(key => Buffer.from(key, 'hex')),
          network: this.network
        }),
        network: this.network
      });

      return {
        address: payment.address,
        redeemScript: payment.redeem.output.toString('hex')
      };
    } catch (error) {
      console.error('Erro ao criar endereço multisig:', error);
      throw new Error('Falha ao criar endereço multisig');
    }
  }

  async convertBRLtoBTC(amount) {
    try {
      this.validateAmount(amount);

      const response = await axios.get(`${API_URL}/bitcoin/convert`, {
        params: { 
          amount,
          timestamp: Date.now()
        }
      });

      if (!response.data || typeof response.data.btcAmount !== 'number') {
        throw new Error('Resposta inválida do servidor');
      }

      return response.data.btcAmount;
    } catch (error) {
      console.error('Erro ao converter valor para BTC:', error);
      throw new Error('Falha ao converter valor para BTC');
    }
  }

  getExplorerUrl(txid) {
    const baseUrl = BITCOIN_NETWORK === 'testnet' 
      ? 'https://mempool.space/testnet'
      : 'https://mempool.space';
    return `${baseUrl}/tx/${txid}`;
  }
}

const bitcoinService = new BitcoinService();
export default bitcoinService; 