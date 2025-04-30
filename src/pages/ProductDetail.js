import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Grid, Typography, Box, Button, Paper, Divider, Rating } from '@mui/material';
import { useCart } from '../contexts/CartContext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Mock product data (replace with API call)
  const product = {
    id: parseInt(id),
    name: 'Smartphone XYZ',
    description: 'Último modelo, 128GB, 6GB RAM, Câmera 108MP, Tela AMOLED 6.7"',
    price: 2499.99,
    image: 'https://via.placeholder.com/600x400',
    rating: 4.5,
    reviews: 128,
    specs: [
      '128GB Armazenamento',
      '6GB RAM',
      'Processador Octa-core',
      'Câmera 108MP',
      'Bateria 5000mAh'
    ]
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleAddToCart = () => {
    addToCart(product);
    navigate('/cart');
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3}
              sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </Paper>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h3" component="h1" gutterBottom>
                {product.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={product.rating} precision={0.5} readOnly />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ({product.reviews} avaliações)
                </Typography>
              </Box>

              <Typography variant="h4" color="primary" sx={{ mb: 3 }}>
                {formatPrice(product.price)}
              </Typography>

              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>

              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                fullWidth
                sx={{ mb: 2 }}
              >
                Adicionar ao Carrinho
              </Button>

              <Divider sx={{ my: 3 }} />

              {/* Specifications */}
              <Typography variant="h6" gutterBottom>
                Especificações
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {product.specs.map((spec, index) => (
                  <Typography component="li" key={index} paragraph>
                    {spec}
                  </Typography>
                ))}
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Benefits */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <SecurityIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="body2">
                      Pagamento Seguro com Bitcoin
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <LocalShippingIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="body2">
                      Entrega em todo Brasil
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <SecurityIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="body2">
                      Garantia de 12 meses
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductDetail; 