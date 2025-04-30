import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    Paper,
    Typography,
    Alert,
    Grid,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const order = location.state?.order;
    const { cart, total } = useCart();

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Box sx={{ mb: 3 }}>
                    <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main' }} />
                </Box>
                
                <Typography variant="h4" gutterBottom>
                    Pagamento Realizado com Sucesso!
                </Typography>
                
                <Typography variant="body1" paragraph>
                    Obrigado por comprar conosco. Seu pedido foi processado e confirmado na blockchain.
                </Typography>

                {order && (
                    <Grid container spacing={2} sx={{ mt: 3, textAlign: 'left' }}>
                        <Grid item xs={12}>
                            <Typography variant="h6">Detalhes do Pedido</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="textSecondary">
                                Número do Pedido:
                            </Typography>
                            <Typography variant="body1">
                                {order.id}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="textSecondary">
                                Data:
                            </Typography>
                            <Typography variant="body1">
                                {new Date(order.createdAt).toLocaleString('pt-BR')}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="textSecondary">
                                Total:
                            </Typography>
                            <Typography variant="body1">
                                ${order.totalAmount.toFixed(2)}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="textSecondary">
                                Status:
                            </Typography>
                            <Typography variant="body1" color="success.main">
                                Confirmado
                            </Typography>
                        </Grid>
                    </Grid>
                )}
                
                <Alert severity="info" sx={{ mt: 3, mb: 3 }}>
                    Você receberá um e-mail com os detalhes do seu pedido e informações de rastreamento.
                </Alert>
                
                <Box sx={{ mt: 4, textAlign: 'left' }}>
                    <Typography variant="h6" gutterBottom>
                        Resumo do Pedido
                    </Typography>
                    <List>
                        {cart.map((item) => (
                            <React.Fragment key={item.id}>
                                <ListItem>
                                    <ListItemText
                                        primary={item.name}
                                        secondary={`${item.quantity} x ${new Intl.NumberFormat('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL',
                                        }).format(item.price)}`}
                                    />
                                    <Typography>
                                        {new Intl.NumberFormat('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL',
                                        }).format(item.price * item.quantity)}
                                    </Typography>
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Typography variant="h6">Total</Typography>
                        <Typography variant="h6">
                            {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            }).format(total)}
                        </Typography>
                    </Box>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/')}
                    >
                        Continuar Comprando
                    </Button>
                    
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate('/tracking')}
                    >
                        Acompanhar Entrega
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default OrderSuccess; 