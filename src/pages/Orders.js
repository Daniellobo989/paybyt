import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Implementar busca de pedidos
      setOrders([]);
      setError('');
    } catch (error) {
      setError('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography>Carregando pedidos...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Meus Pedidos
        </Typography>
        {orders.length === 0 ? (
          <Typography>Nenhum pedido encontrado</Typography>
        ) : (
          <Grid container spacing={3}>
            {orders.map((order) => (
              <Grid item xs={12} key={order.id}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6">
                    Pedido #{order.id}
                  </Typography>
                  <Typography>
                    Status: {order.status}
                  </Typography>
                  <Typography>
                    Data: {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography>
                    Total: {order.total} BTC
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Orders; 