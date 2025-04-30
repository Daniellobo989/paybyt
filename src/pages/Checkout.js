import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Paper,
    TextField,
    Button,
    Grid,
    Alert,
} from '@mui/material';
import { useCart } from '../context/CartContext';
import BitcoinPayment from '../components/BitcoinPayment';
import Sentry from '../config/sentry';

const Checkout = () => {
    const { cart, total, clearCart } = useCart();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
    });
    const [error, setError] = useState(null);
    const [paymentComplete, setPaymentComplete] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePaymentComplete = async () => {
        try {
            // Validar dados do formulário
            if (!formData.name || !formData.email || !formData.address) {
                throw new Error('Por favor, preencha todos os campos obrigatórios');
            }

            // Aqui você pode adicionar a lógica para salvar o pedido no backend
            // Por enquanto, vamos apenas simular um sucesso
            await new Promise(resolve => setTimeout(resolve, 1000));

            clearCart();
            setPaymentComplete(true);
            navigate('/order-success');
        } catch (error) {
            Sentry.captureException(error);
            setError(error.message);
        }
    };

    if (cart.length === 0 && !paymentComplete) {
        return (
            <Container>
                <Alert severity="warning" sx={{ my: 4 }}>
                    Seu carrinho está vazio. Por favor, adicione itens antes de prosseguir para o checkout.
                </Alert>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/')}
                >
                    Continuar Comprando
                </Button>
            </Container>
        );
    }

    if (paymentComplete) {
        return (
            <Container>
                <Box sx={{ my: 4, textAlign: 'center' }}>
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Pagamento confirmado! Seu pedido foi processado com sucesso.
                    </Alert>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/order-success')}
                    >
                        Ver Detalhes do Pedido
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container>
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Finalizar Compra
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, mb: 4 }}>
                            <Typography variant="h6" gutterBottom>
                                Informações de Entrega
                            </Typography>
                            <form>
                                <TextField
                                    fullWidth
                                    label="Nome Completo"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Endereço"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    required
                                />
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Cidade"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            margin="normal"
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Estado"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            margin="normal"
                                            required
                                        />
                                    </Grid>
                                </Grid>
                                <TextField
                                    fullWidth
                                    label="CEP"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    required
                                />
                            </form>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Pagamento
                            </Typography>
                            {error && (
                                <Typography color="error" sx={{ mb: 2 }}>
                                    {error}
                                </Typography>
                            )}
                            <BitcoinPayment
                                amount={total}
                                onPaymentComplete={handlePaymentComplete}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Checkout; 