import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Button,
    Grid,
    Paper,
    IconButton,
    Divider,
    Card,
    CardContent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
    const navigate = useNavigate();
    const { items, updateQuantity, removeFromCart, totalPrice } = useCart();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    if (items.length === 0) {
        return (
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 8 }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center' }}>
                        <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h4" gutterBottom>
                            Seu carrinho está vazio
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            Adicione produtos para continuar comprando
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/')}
                        >
                            Continuar Comprando
                        </Button>
                    </Box>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Typography variant="h4" component="h1" gutterBottom>
                    Carrinho de Compras
                </Typography>

                <Grid container spacing={4}>
                    {/* Cart Items */}
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 2 }}>
                            {items.map((item) => (
                                <Box key={item.id}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={3} sm={2}>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                style={{ width: '100%', height: 'auto' }}
                                            />
                                        </Grid>
                                        <Grid item xs={9} sm={4}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                {item.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {formatPrice(item.price)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                >
                                                    <RemoveIcon />
                                                </IconButton>
                                                <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <AddIcon />
                                                </IconButton>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={4} sm={2}>
                                            <Typography variant="subtitle1">
                                                {formatPrice(item.price * item.quantity)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={2} sm={1}>
                                            <IconButton
                                                color="error"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                    <Divider sx={{ my: 2 }} />
                                </Box>
                            ))}
                        </Paper>
                    </Grid>

                    {/* Order Summary */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Resumo do Pedido
                                </Typography>
                                <Box sx={{ my: 2 }}>
                                    <Grid container justifyContent="space-between">
                                        <Grid item>
                                            <Typography>Subtotal</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography>{formatPrice(totalPrice)}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
                                        <Grid item>
                                            <Typography>Frete</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography>Grátis</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Divider sx={{ my: 2 }} />
                                <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
                                    <Grid item>
                                        <Typography variant="h6">Total</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h6">{formatPrice(totalPrice)}</Typography>
                                    </Grid>
                                </Grid>
                                <Button
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    onClick={() => navigate('/checkout')}
                                >
                                    Finalizar Compra
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    fullWidth
                                    onClick={() => navigate('/')}
                                    sx={{ mt: 2 }}
                                >
                                    Continuar Comprando
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Cart; 