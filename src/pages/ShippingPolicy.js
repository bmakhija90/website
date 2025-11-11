import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
} from '@mui/material';

const ShippingPolicy = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shipping Policy
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Last updated: {new Date().toLocaleDateString()}
      </Typography>

      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Shipping Methods and Times
          </Typography>
          <Typography variant="body1" paragraph>
            We offer various shipping options to meet your needs. Most orders are processed within 1-2 business days.
          </Typography>
        </Box>

        {/* Add more shipping policy content */}
      </Paper>
    </Container>
  );
};

export default ShippingPolicy;