import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  OpenInNew,
  CheckCircle,
  Warning,
  AccessTime,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material';
import bitcoinService from '../services/bitcoinService';
import { BITCOIN_NETWORK } from '../config/constants';

const TransactionHistory = ({ address }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        const history = await bitcoinService.getTransactionHistory(address);
        setTransactions(history);
      } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        setError('Não foi possível carregar o histórico de transações.');
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      fetchTransactions();
    }
  }, [address]);

  const getStatusChip = (confirmations) => {
    if (confirmations >= 6) {
      return (
        <Chip
          icon={<CheckCircle />}
          label="Confirmada"
          color="success"
          size="small"
        />
      );
    } else if (confirmations > 0) {
      return (
        <Chip
          icon={<AccessTime />}
          label={`${confirmations} confirmações`}
          color="warning"
          size="small"
        />
      );
    }
    return (
      <Chip
        icon={<Warning />}
        label="Pendente"
        color="default"
        size="small"
      />
    );
  };

  const formatBTC = (amount) => {
    return `${amount.toFixed(8)} BTC`;
  };

  const getExplorerUrl = (txid) => {
    const baseUrl = BITCOIN_NETWORK === 'mainnet'
      ? 'https://mempool.space/tx/'
      : 'https://mempool.space/testnet/tx/';
    return `${baseUrl}${txid}`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!transactions.length) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Nenhuma transação encontrada para este endereço.
      </Alert>
    );
  }

  return (
    <Paper elevation={3} sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Histórico de Transações
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell align="right">Valor</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.txid}>
                <TableCell>
                  {new Date(tx.timestamp * 1000).toLocaleString()}
                </TableCell>
                <TableCell>
                  {tx.type === 'received' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                      <ArrowDownward fontSize="small" sx={{ mr: 1 }} />
                      Recebido
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
                      <ArrowUpward fontSize="small" sx={{ mr: 1 }} />
                      Enviado
                    </Box>
                  )}
                </TableCell>
                <TableCell align="right" sx={{ 
                  color: tx.type === 'received' ? 'success.main' : 'error.main',
                  fontWeight: 'medium'
                }}>
                  {tx.type === 'received' ? '+' : '-'} {formatBTC(tx.amount)}
                </TableCell>
                <TableCell>
                  {getStatusChip(tx.confirmations)}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Ver no explorador">
                    <IconButton
                      size="small"
                      onClick={() => window.open(getExplorerUrl(tx.txid), '_blank')}
                    >
                      <OpenInNew />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TransactionHistory; 