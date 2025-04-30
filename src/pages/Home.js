import React from 'react';
import { Container, Grid, Typography, Box, Card, CardContent, CardMedia, CardActionArea, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: 'Smartphone XYZ',
    description: 'Último modelo, 128GB, 6GB RAM',
    price: 2499.99,
    image: 'https://via.placeholder.com/300x200'
  },
  {
    id: 2,
    name: 'Notebook Pro',
    description: 'Intel i7, 16GB RAM, SSD 512GB',
    price: 4999.99,
    image: 'https://via.placeholder.com/300x200'
  },
  {
    id: 3,
    name: 'Smart TV 55"',
    description: '4K, HDR, Android TV',
    price: 3299.99,
    image: 'https://via.placeholder.com/300x200'
  },
  {
    id: 4,
    name: 'Console GameX',
    description: '1TB, 2 Controles, 3 Jogos',
    price: 2799.99,
    image: 'https://via.placeholder.com/300x200'
  }
];

const Home = () => {
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h2" component="h1" gutterBottom>
            PayByt Marketplace
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Compre com Bitcoin de forma segura e rápida
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
            onClick={() => navigate('/products')}
          >
            Ver todos os produtos
          </Button>
        </Box>

        {/* Featured Products */}
        <Typography variant="h4" component="h2" sx={{ mb: 4 }}>
          Produtos em Destaque
        </Typography>
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
              >
                <CardActionArea onClick={() => navigate(`/product/${product.id}`)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h3">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {product.description}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {formatPrice(product.price)}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Benefits Section */}
        <Box sx={{ mt: 8, mb: 4 }}>
          <Typography variant="h4" component="h2" sx={{ mb: 4, textAlign: 'center' }}>
            Por que escolher a PayByt?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Pagamento Seguro
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Transações protegidas com Bitcoin e sistema de escrow
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Entrega Rápida
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Envio para todo o Brasil com rastreamento
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Suporte 24/7
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Atendimento especializado todos os dias
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 