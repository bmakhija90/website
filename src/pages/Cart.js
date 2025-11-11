import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';


const Cart = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cart.items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Your Cart
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Your cart is empty
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        {cart.items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            Total: ${getCartTotal().toFixed(2)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={clearCart}
          >
            Clear Cart
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCheckout}
            sx={{ flexGrow: 1 }}
          >
            Proceed to Checkout
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Cart;