import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Grid,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const steps = [
  'Pedido Confirmado',
  'Em Preparação',
  'Enviado',
  'Em Trânsito',
  'Entregue',
];

const DeliveryTracking = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    const fetchTrackingInfo = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/delivery/latest/tracking');
        setTrackingInfo(response.data);
        setActiveStep(response.data.status);
      } catch (err) {
        setError('Erro ao buscar informações de rastreamento');
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingInfo();
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ my: 4 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
        >
          Voltar para a Página Inicial
        </Button>
      </Container>
    );
  }

  if (!trackingInfo) {
    return (
      <Container>
        <Alert severity="info" sx={{ my: 4 }}>
          Nenhum pedido encontrado para rastreamento.
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
        >
          Voltar para a Página Inicial
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Acompanhamento de Entrega
          </Typography>

          <Box sx={{ width: '100%', mt: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Detalhes da Entrega
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" paragraph>
                  <strong>Número do Pedido:</strong> {trackingInfo.orderId}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Data de Envio:</strong>{' '}
                  {new Date(trackingInfo.shippingDate).toLocaleDateString('pt-BR')}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Previsão de Entrega:</strong>{' '}
                  {new Date(trackingInfo.estimatedDelivery).toLocaleDateString('pt-BR')}
                </Typography>
                {trackingInfo.trackingNumber && (
                  <Typography variant="body1" paragraph>
                    <strong>Código de Rastreamento:</strong>{' '}
                    <Chip
                      label={trackingInfo.trackingNumber}
                      color="primary"
                      variant="outlined"
                    />
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>

          {trackingInfo.updates && trackingInfo.updates.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Histórico de Atualizações
              </Typography>
              <List>
                {trackingInfo.updates.map((update, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={steps[update.status]}
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              {new Date(update.timestamp).toLocaleString('pt-BR')}
                            </Typography>
                            {update.location && (
                              <Typography variant="body2" component="div">
                                Local: {update.location}
                              </Typography>
                            )}
                            {update.description && (
                              <Typography variant="body2" component="div">
                                {update.description}
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                    {index < trackingInfo.updates.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          )}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/')}
            >
              Voltar para a Página Inicial
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/orders')}
            >
              Ver Todos os Pedidos
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default DeliveryTracking; 