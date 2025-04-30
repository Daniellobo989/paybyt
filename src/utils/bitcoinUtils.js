import * as bitcoin from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import { BIP32Factory } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import env from '../config/env';

// Inicializa o bip32 com a biblioteca de curvas elípticas
const bip32 = BIP32Factory(ecc);

export const bitcoinUtils = {
  generateMnemonic() {
    return bip39.generateMnemonic();
  },

  mnemonicToSeed(mnemonic) {
    return bip39.mnemonicToSeed(mnemonic);
  },

  createHDWallet(mnemonic) {
    const seed = this.mnemonicToSeed(mnemonic);
    const root = bip32.fromSeed(seed, this.getNetwork());
    return root;
  },

  getNetwork() {
    return env.bitcoinNetwork === 'mainnet' 
      ? bitcoin.networks.bitcoin 
      : bitcoin.networks.testnet;
  },

  deriveAddress(wallet, index = 0) {
    const path = `m/44'/${this.getNetwork() === bitcoin.networks.bitcoin ? '0' : '1'}'/0'/0/${index}`;
    const child = wallet.derivePath(path);
    const { address } = bitcoin.payments.p2pkh({
      pubkey: child.publicKey,
      network: this.getNetwork()
    });
    return address;
  },

  validateAddress(address) {
    try {
      bitcoin.address.toOutputScript(address, this.getNetwork());
      return true;
    } catch (e) {
      return false;
    }
  },

  formatAmount(amount) {
    return (amount / 100000000).toFixed(8);
  },

  parseAmount(amount) {
    return Math.round(parseFloat(amount) * 100000000);
  },

  createTransaction(utxos, toAddress, amount, fee, changeAddress) {
    const psbt = new bitcoin.Psbt({ network: this.getNetwork() });
    
    let totalInput = 0;
    utxos.forEach(utxo => {
      psbt.addInput({
        hash: utxo.txid,
        index: utxo.vout,
        witnessUtxo: {
          script: Buffer.from(utxo.scriptPubKey, 'hex'),
          value: utxo.value
        }
      });
      totalInput += utxo.value;
    });

    const totalOutput = amount + fee;
    if (totalInput < totalOutput) {
      throw new Error('Insufficient funds');
    }

    psbt.addOutput({
      address: toAddress,
      value: amount
    });
    
    if (totalInput > totalOutput) {
      psbt.addOutput({
        address: changeAddress,
        value: totalInput - totalOutput
      });
    }

    return psbt;
  }
};

export default bitcoinUtils; 