import env from './config/env';

const config = {
    apiUrl: process.env.REACT_APP_API_URL || 'https://api.paybyt.com',
    baseUrl: process.env.PUBLIC_URL || '',
    sentryDsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    domain: 'www.paybyt.com',
    siteName: 'PayByT',
    siteDescription: 'Compre com Bitcoin de forma simples e segura',
    defaultCurrency: 'BRL',
    bitcoinNetwork: env.bitcoinNetwork,
    minConfirmations: env.minConfirmations,
    paymentTimeout: env.paymentTimeout,
    taxRate: env.taxRate,
    shippingFee: env.shippingFee,
    features: {
        bitcoinPayments: true,
        lightningPayments: false,
        escrow: true,
        multisig: false
    }
};

export default config; 