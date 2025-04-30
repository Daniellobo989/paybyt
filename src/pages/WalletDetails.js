import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  Tooltip,
  Divider,
  CircularProgress,
  Alert,
  Button,
  Link,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip
} from '@mui/material';
import {
  AccountBalanceWallet,
  ContentCopy,
  Refresh,
  QrCode
} from '@mui/icons-material';
import QRCode from 'qrcode.react';
import BitcoinService from '../services/bitcoinService';
import TransactionHistory from '../components/TransactionHistory';
import { useBitcoinWallet } from '../contexts/BitcoinWalletContext';

const WalletDetails = () => {
  const [walletInfo, setWalletInfo] = useState({
    confirmedBalance: 0,
    unconfirmedBalance: 0,
    transactions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { bitcoinWallet } = useBitcoinWallet();
  const bitcoinService = new BitcoinService();

  const fetchWalletInfo = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const balance = await bitcoinService.getWalletBalance(bitcoinWallet.address);
      const transactions = await bitcoinService.getTransactionHistory(bitcoinWallet.address);
      
      setWalletInfo({
        confirmedBalance: balance.confirmed,
        unconfirmedBalance: balance.unconfirmed,
        transactions: transactions
      });
    } catch (err) {
      setError('Failed to fetch wallet information. Please try again later.');
      console.error('Error fetching wallet info:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (bitcoinWallet?.address) {
      fetchWalletInfo();
    }
  }, [bitcoinWallet?.address]);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(bitcoinWallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const formatBitcoin = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 8,
      maximumFractionDigits: 8
    }).format(amount);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      ) : (
        <>
          <Grid container spacing={3}>
            {/* Wallet Address Section */}
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'primary.main',
                  color: 'white'
                }}
              >
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h5" component="h2">
                    Wallet Address
                  </Typography>
                  <Box>
                    <Tooltip title={copied ? "Copied!" : "Copy Address"}>
                      <IconButton onClick={handleCopyAddress} color="inherit">
                        <ContentCopy />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={showQR ? "Hide QR Code" : "Show QR Code"}>
                      <IconButton onClick={() => setShowQR(!showQR)} color="inherit">
                        <QrCode />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    wordBreak: 'break-all',
                    fontFamily: 'monospace',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    p: 2,
                    borderRadius: 1
                  }}
                >
                  {bitcoinWallet.address}
                </Typography>
                {showQR && (
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Paper sx={{ p: 2, backgroundColor: 'white' }}>
                      <QRCode value={bitcoinWallet.address} size={200} />
                    </Paper>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Balance Cards */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'success.main',
                  color: 'white'
                }}
              >
                <Typography variant="h6" component="h3">
                  Confirmed Balance
                </Typography>
                <Typography variant="h4" component="p" sx={{ mt: 2 }}>
                  {formatBitcoin(walletInfo.confirmedBalance)} BTC
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'warning.main',
                  color: 'white'
                }}
              >
                <Typography variant="h6" component="h3">
                  Pending Balance
                </Typography>
                <Typography variant="h4" component="p" sx={{ mt: 2 }}>
                  {formatBitcoin(walletInfo.unconfirmedBalance)} BTC
                </Typography>
              </Paper>
            </Grid>

            {/* Transaction History */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  Transaction History
                </Typography>
                {walletInfo.transactions.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Amount (BTC)</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Transaction ID</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {walletInfo.transactions.map((tx) => (
                          <TableRow key={tx.txid}>
                            <TableCell>
                              {new Date(tx.timestamp * 1000).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={tx.type === 'received' ? 'Received' : 'Sent'}
                                color={tx.type === 'received' ? 'success' : 'primary'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              {formatBitcoin(Math.abs(tx.amount))}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={tx.confirmations >= 6 ? 'Confirmed' : 'Pending'}
                                color={tx.confirmations >= 6 ? 'success' : 'warning'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Tooltip title={tx.txid}>
                                <Link
                                  href={`https://mempool.space/tx/${tx.txid}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{
                                    display: 'block',
                                    maxWidth: 100,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {tx.txid}
                                </Link>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography color="text.secondary">
                      No transactions found
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default WalletDetails; 