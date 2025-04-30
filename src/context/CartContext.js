import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useWallet } from './WalletContext';
import { useDelivery } from './DeliveryContext';
import bitcoinService from '../services/bitcoinService';

const CartContext = createContext();

// Taxas e comissões
const PLATFORM_FEE = 0.03; // 3% da plataforma

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.find(item => item.id === action.payload.id);
      if (existingItem) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];

    case 'REMOVE_ITEM':
      return state.filter(item => item.id !== action.payload);

    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [cartItems, dispatch] = useReducer(cartReducer, []);
  const [total, setTotal] = useState(0);
  const [totalBTC, setTotalBTC] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const [btcPrice, setBtcPrice] = useState(null);
  const { isAuthenticated } = useAuth();
  const { createPayment } = useWallet();
  const { createDelivery } = useDelivery();

  // Carregar carrinho do localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      dispatch({ type: 'CLEAR_CART' });
      parsedCart.forEach(item => dispatch({ type: 'ADD_ITEM', payload: item }));
    }
  }, []);

  // Salvar carrinho no localStorage e calcular totais
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    const calculateTotals = async () => {
      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const platformFee = subtotal * PLATFORM_FEE;
      const totalBRL = subtotal + platformFee;
      
      setTotal(totalBRL);
      
      try {
        const { btc } = await bitcoinService.convertBRLtoBTC(totalBRL);
        setTotalBTC(btc);
      } catch (error) {
        console.error('Erro ao converter valor para BTC:', error);
      }
    };

    calculateTotals();
  }, [cartItems]);

  // Atualizar preço do Bitcoin
  useEffect(() => {
    const updateBitcoinPrice = async () => {
      try {
        const { price } = await bitcoinService.getBitcoinPrice();
        setBtcPrice(price);
      } catch (error) {
        console.error('Erro ao buscar preço do Bitcoin:', error);
      }
    };

    updateBitcoinPrice();
    const interval = setInterval(updateBitcoinPrice, 30000);

    return () => clearInterval(interval);
  }, []);

  const addToCart = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeFromCart = (itemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };

  const updateQuantity = (itemId, quantity) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id: itemId, quantity }
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const createOrder = async () => {
    try {
      setLoading(true);
      
      const orderData = {
        items: cartItems,
        totalBRL: total,
        totalBTC: totalBTC,
        btcPrice,
        platformFee: total * PLATFORM_FEE
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Erro ao criar pedido');
      }

      const data = await response.json();
      setOrder(data);
      return { success: true, data };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cartItems,
    total,
    totalBTC,
    loading,
    error,
    order,
    btcPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    createOrder
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 