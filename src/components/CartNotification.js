import React from 'react';
import {
  Snackbar,
  Alert,
  Box,
  Typography,
  Avatar,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

const CartNotification = ({ open, onClose, product }) => {
  if (!product) return null;

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{
        '& .MuiSnackbar-root': {
          position: 'fixed',
        }
      }}
    >
      <Alert
        onClose={onClose}
        severity="success"
        icon={false}
        sx={{
          width: '100%',
          backgroundColor: 'success.light',
          color: 'success.contrastText',
          '& .MuiAlert-message': {
            width: '100%',
            padding: 0,
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 0.5 }}>
          <Avatar
            src={product.image}
            alt={product.name}
            sx={{ width: 50, height: 50 }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              Added to Cart!
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {product.name}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              ${product.price} × {product.quantity}
            </Typography>
          </Box>
          <CheckCircle sx={{ color: 'success.main' }} />
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default CartNotification;