import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  TextField,
} from '@mui/material';
import { Delete, Add, Remove } from '@mui/icons-material';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    updateQuantity(item.id, newQuantity);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <img
            src={item.image}
            alt={item.name}
            style={{ width: 80, height: 80, objectFit: 'cover' }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">{item.name}</Typography>
            <Typography color="text.secondary">${item.price}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => handleQuantityChange(item.quantity - 1)}
            >
              <Remove />
            </IconButton>
            <TextField
              size="small"
              value={item.quantity}
              inputProps={{ 
                style: { textAlign: 'center', width: 50 },
                min: 1
              }}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
            />
            <IconButton
              size="small"
              onClick={() => handleQuantityChange(item.quantity + 1)}
            >
              <Add />
            </IconButton>
          </Box>
          <Typography variant="h6" sx={{ minWidth: 80, textAlign: 'right' }}>
            ${(item.price * item.quantity).toFixed(2)}
          </Typography>
          <IconButton
            color="error"
            onClick={() => removeFromCart(item.id)}
          >
            <Delete />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CartItem;