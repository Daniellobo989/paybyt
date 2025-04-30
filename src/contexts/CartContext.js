import React, { createContext, useContext, useState, useEffect } from 'react';
import Sentry from '../config/sentry';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      Sentry.captureException(error);
      console.error('Erro ao carregar carrinho:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setTotalPrice(total);
    } catch (error) {
      Sentry.captureException(error);
      console.error('Erro ao salvar carrinho:', error);
    }
  }, [items]);

  const addToCart = (product) => {
    try {
      setItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === product.id);
        if (existingItem) {
          return prevItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prevItems, { ...product, quantity: 1 }];
      });
    } catch (error) {
      Sentry.captureException(error);
      console.error('Erro ao adicionar ao carrinho:', error);
    }
  };

  const removeFromCart = (productId) => {
    try {
      setItems(prevItems => prevItems.filter(item => item.id !== productId));
    } catch (error) {
      Sentry.captureException(error);
      console.error('Erro ao remover do carrinho:', error);
    }
  };

  const updateQuantity = (productId, quantity) => {
    try {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      Sentry.captureException(error);
      console.error('Erro ao atualizar quantidade:', error);
    }
  };

  const clearCart = () => {
    try {
      setItems([]);
      localStorage.removeItem('cart');
    } catch (error) {
      Sentry.captureException(error);
      console.error('Erro ao limpar carrinho:', error);
    }
  };

  const value = {
    items,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}; 