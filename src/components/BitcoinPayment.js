import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { ContentCopy, Warning, CheckCircle, Timer, AccountBalanceWallet } from '@mui/icons-material';
import QRCode from 'qrcode.react';
import bitcoinService from '../services/bitcoinService';
import { PAYMENT_TIMEOUT } from '../config/constants';

const BitcoinPayment = ({ amount, onPaymentComplete }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('pending');
  const [copied, setCopied] = useState(false);
  const [btcAmount, setBtcAmount] = useState(null);
  const [timeLeft, setTimeLeft] = useState(PAYMENT_TIMEOUT);
  const [securityWarning, setSecurityWarning] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    'Gerando endereço',
    'Aguardando pagamento',
    'Confirmando transação',
    'Pagamento concluído'
  ];

  useEffect(() => {
    try {
      bitcoinService.validateAmount(amount);
    } catch (error) {
      setError(error.message);
      return;
    }
  }, [amount]);

  const initializePayment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setActiveStep(0);
      
      const btcValue = await bitcoinService.convertBRLtoBTC(amount);
      if (!btcValue || btcValue <= 0) {
        throw new Error('Erro na conversão do valor para Bitcoin');
      }
      setBtcAmount(btcValue);
      setActiveStep(1);

      const request = await bitcoinService.createPaymentRequest(btcValue);
      if (!request.address || !request.id) {
        throw new Error('Dados de pagamento inválidos');
      }
      setPaymentRequest(request);
      setStatus('awaiting_payment');
      setTimeLeft(PAYMENT_TIMEOUT);
    } catch (error) {
      console.error('Erro ao inicializar pagamento:', error);
      setError('Não foi possível iniciar o pagamento. Por favor, tente novamente em alguns instantes.');
    } finally {
      setLoading(false);
    }
  }, [amount]);

  useEffect(() => {
    if (status === 'awaiting_payment' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1000) {
            setStatus('expired');
            setError('O tempo para pagamento expirou. Por favor, inicie uma nova transação.');
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, timeLeft]);

  useEffect(() => {
    let intervalId;

    if (paymentRequest?.id && status === 'awaiting_payment') {
      intervalId = setInterval(async () => {
        try {
          const result = await bitcoinService.checkPaymentStatus(paymentRequest.id);
          
          if (!result || typeof result.status !== 'string') {
            setSecurityWarning('Erro ao verificar o status do pagamento. Aguarde um momento...');
            return;
          }

          if (result.status === 'completed') {
            if (result.confirmations >= 1) {
              setActiveStep(3);
              setStatus('completed');
              onPaymentComplete();
            } else {
              setActiveStep(2);
              setSecurityWarning('Pagamento detectado! Aguardando confirmações da rede Bitcoin...');
            }
          } else if (result.status === 'expired') {
            setStatus('expired');
            setError('O tempo para pagamento expirou. Por favor, inicie uma nova transação.');
          } else if (result.status === 'invalid') {
            setStatus('error');
            setError('Foi detectado um problema com o pagamento. Por favor, tente novamente.');
          }
        } catch (error) {
          console.error('Erro ao verificar status do pagamento:', error);
          setSecurityWarning('Erro ao verificar o status do pagamento');
        }
      }, 10000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [paymentRequest, status, onPaymentComplete]);

  useEffect(() => {
    initializePayment();
  }, [initializePayment]);

  const handleCopyAddress = useCallback(() => {
    if (paymentRequest?.address) {
      navigator.clipboard.writeText(paymentRequest.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [paymentRequest]);

  const formatTimeLeft = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" p={3}>
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Preparando seu pagamento...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ mt: 2 }}
        action={
          <IconButton
            color="inherit"
            size="small"
            onClick={initializePayment}
          >
            <Timer />
          </IconButton>
        }
      >
        {error}
      </Alert>
    );
  }

  if (status === 'completed') {
    return (
      <Alert 
        severity="success" 
        sx={{ mt: 2 }}
        icon={<CheckCircle fontSize="inherit" />}
      >
        Pagamento concluído com sucesso! Obrigado pela sua compra.
      </Alert>
    );
  }

  if (status === 'expired') {
    return (
      <Alert 
        severity="warning" 
        sx={{ mt: 2 }}
        action={
          <IconButton
            color="inherit"
            size="small"
            onClick={initializePayment}
          >
            <Timer />
          </IconButton>
        }
      >
        Tempo expirado. Clique no ícone para tentar novamente.
      </Alert>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: isMobile ? 2 : 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Pagamento em Bitcoin
      </Typography>

      <Stepper 
        activeStep={activeStep} 
        alternativeLabel={!isMobile}
        orientation={isMobile ? "vertical" : "horizontal"}
        sx={{ my: 3 }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <AccountBalanceWallet sx={{ mr: 1 }} />
          {btcAmount?.toFixed(8)} BTC
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Valor em Reais: R$ {amount?.toFixed(2)}
        </Typography>
        <Typography 
          variant="body2" 
          color={timeLeft < 300000 ? "error" : "warning.main"} 
          sx={{ mt: 1, display: 'flex', alignItems: 'center' }}
        >
          <Timer sx={{ mr: 1, fontSize: 20 }} />
          Tempo restante: {formatTimeLeft(timeLeft)}
        </Typography>
      </Box>

      {paymentRequest && (
        <>
          <Box sx={{ 
            mb: 2, 
            textAlign: 'center',
            backgroundColor: 'grey.100',
            p: 3,
            borderRadius: 2
          }}>
            <QRCode 
              value={`bitcoin:${paymentRequest.address}?amount=${btcAmount}`}
              size={isMobile ? 200 : 250}
              level="H"
              includeMargin={true}
            />
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            backgroundColor: 'grey.50',
            p: 2,
            borderRadius: 1
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Endereço Bitcoin:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'monospace',
                  wordBreak: 'break-all'
                }}
              >
                {paymentRequest.address}
              </Typography>
            </Box>
            <Tooltip title={copied ? "Copiado!" : "Copiar endereço"}>
              <IconButton onClick={handleCopyAddress} size="large">
                <ContentCopy />
              </IconButton>
            </Tooltip>
          </Box>

          <Alert severity="info" sx={{ mt: 2 }} icon={<AccountBalanceWallet />}>
            <Typography variant="body1">
              Por favor, envie exatamente {btcAmount?.toFixed(8)} BTC para o endereço acima.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              O pagamento será detectado automaticamente após o envio.
            </Typography>
          </Alert>

          {securityWarning && (
            <Alert severity="warning" icon={<Warning />} sx={{ mt: 2 }}>
              {securityWarning}
            </Alert>
          )}
        </>
      )}

      <Snackbar
        open={!!securityWarning}
        autoHideDuration={6000}
        onClose={() => setSecurityWarning(null)}
        message={securityWarning}
      />
    </Paper>
  );
};

export default BitcoinPayment; 