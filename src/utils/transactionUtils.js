import { networks, payments, Psbt } from 'bitcoinjs-lib';
import { BITCOIN_NETWORK, SATS_PER_BTC } from '../config/constants';

export const transactionUtils = {
  network: BITCOIN_NETWORK === 'mainnet' ? networks.bitcoin : networks.testnet,

  validateTransaction(txData) {
    if (!txData || typeof txData !== 'object') {
      throw new Error('Invalid transaction data');
    }
    if (!txData.inputs || !Array.isArray(txData.inputs) || txData.inputs.length === 0) {
      throw new Error('Transaction must have at least one input');
    }
    if (!txData.outputs || !Array.isArray(txData.outputs) || txData.outputs.length === 0) {
      throw new Error('Transaction must have at least one output');
    }
  },

  async createTransaction(txData) {
    try {
      this.validateTransaction(txData);
      
      const psbt = new Psbt({ network: this.network });
      
      // Add inputs
      txData.inputs.forEach(input => {
        psbt.addInput({
          hash: input.txid,
          index: input.vout,
          witnessUtxo: {
            script: Buffer.from(input.scriptPubKey, 'hex'),
            value: input.value
          },
          sequence: input.sequence || 0xffffffff
        });
      });

      // Add outputs
      txData.outputs.forEach(output => {
        psbt.addOutput({
          address: output.address,
          value: output.value
        });
      });

      return psbt;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw new Error('Failed to create transaction');
    }
  },

  calculateFee(inputs, outputs) {
    const totalInput = inputs.reduce((sum, input) => sum + input.value, 0);
    const totalOutput = outputs.reduce((sum, output) => sum + output.value, 0);
    return totalInput - totalOutput;
  },

  validateFee(fee, size) {
    const minFeeRate = 1; // 1 sat/byte
    const maxFeeRate = 100; // 100 sat/byte
    const feeRate = fee / size;

    if (feeRate < minFeeRate) {
      throw new Error('Fee too low');
    }
    if (feeRate > maxFeeRate) {
      throw new Error('Fee too high');
    }
  },

  estimateSize(inputCount, outputCount) {
    // Rough size estimation for P2PKH transactions
    const baseSize = 10; // Version + Locktime
    const inputSize = 148; // Average P2PKH input size
    const outputSize = 34; // Average P2PKH output size
    return baseSize + (inputSize * inputCount) + (outputSize * outputCount);
  },

  satoshisToBTC(satoshis) {
    return satoshis / SATS_PER_BTC;
  },

  BTCToSatoshis(btc) {
    return Math.round(btc * SATS_PER_BTC);
  },

  async signTransaction(psbt, keyPair, inputIndex) {
    try {
      psbt.signInput(inputIndex, keyPair);
      psbt.validateSignaturesOfInput(inputIndex);
      return true;
    } catch (error) {
      console.error('Error signing transaction:', error);
      throw new Error('Failed to sign transaction');
    }
  },

  async finalizeTransaction(psbt) {
    try {
      psbt.finalizeAllInputs();
      const tx = psbt.extractTransaction();
      return tx.toHex();
    } catch (error) {
      console.error('Error finalizing transaction:', error);
      throw new Error('Failed to finalize transaction');
    }
  }
}; 