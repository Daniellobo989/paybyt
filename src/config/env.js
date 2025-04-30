const isProduction = process.env.NODE_ENV === 'production';

const defaultEnv = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  sentryDsn: process.env.REACT_APP_SENTRY_DSN,
  env: process.env.REACT_APP_ENV || 'development',
  debug: process.env.REACT_APP_DEBUG === 'true',
  bitcoinNetwork: process.env.REACT_APP_BITCOIN_NETWORK || 'testnet',
  minConfirmations: parseInt(process.env.REACT_APP_MIN_CONFIRMATIONS || '1'),
  paymentTimeout: parseInt(process.env.REACT_APP_PAYMENT_TIMEOUT || '3600'),
  taxRate: parseFloat(process.env.REACT_APP_TAX_RATE || '0.05'),
  shippingFee: parseFloat(process.env.REACT_APP_SHIPPING_FEE || '10.00')
};

const productionEnv = {
  apiUrl: 'https://api.paybyt.com',
  sentryDsn: process.env.REACT_APP_SENTRY_DSN,
  env: 'production',
  debug: false,
  bitcoinNetwork: 'mainnet',
  minConfirmations: 3,
  paymentTimeout: 3600,
  taxRate: 0.05,
  shippingFee: 10.00
};

const env = isProduction ? productionEnv : defaultEnv;

export default env; 