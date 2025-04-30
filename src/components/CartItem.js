import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  ButtonGroup,
  Button,
  Tooltip
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useCart } from '../context/CartContext';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart, btcPrice } = useCart();

  const handleQuantityChange = (change) => {
    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
      removeFromCart(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  const convertToBTC = (priceInBRL) => {
    if (!btcPrice) return 0;
    return priceInBRL / btcPrice;
  };

  const formatBTC = (value) => {
    return value.toFixed(8);
  };

  const itemPriceInBTC = convertToBTC(item.price);
  const totalPriceInBTC = itemPriceInBTC * item.quantity;

  return (
    <Card sx={{ display: 'flex', mb: 2, position: 'relative' }}>
      <CardMedia
        component="img"
        sx={{ width: 120, height: 120, objectFit: 'cover' }}
        image={item.image}
        alt={item.name}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h6">
            {item.name}
          </Typography>
          <Tooltip title={`R$ ${item.price.toFixed(2)}`} placement="right">
            <Typography variant="subtitle1" color="text.secondary" component="div">
              ₿ {formatBTC(itemPriceInBTC)}
            </Typography>
          </Tooltip>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <ButtonGroup size="small" aria-label="quantity controls">
              <Button onClick={() => handleQuantityChange(-1)}>
                <RemoveIcon fontSize="small" />
              </Button>
              <Button disabled>{item.quantity}</Button>
              <Button onClick={() => handleQuantityChange(1)}>
                <AddIcon fontSize="small" />
              </Button>
            </ButtonGroup>
            <Tooltip title={`R$ ${(item.price * item.quantity).toFixed(2)}`} placement="right">
              <Typography variant="subtitle1" sx={{ ml: 2 }}>
                Total: ₿ {formatBTC(totalPriceInBTC)}
              </Typography>
            </Tooltip>
          </Box>
        </CardContent>
      </Box>
      <IconButton
        aria-label="remove from cart"
        onClick={() => removeFromCart(item.id)}
        sx={{ position: 'absolute', top: 8, right: 8 }}
      >
        <DeleteIcon />
      </IconButton>
    </Card>
  );
} 