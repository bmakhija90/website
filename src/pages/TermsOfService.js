import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

const TermsOfService = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Terms of Service
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Last updated: {new Date().toLocaleDateString()}
      </Typography>

      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Agreement to Terms
          </Typography>
          <Typography variant="body1" paragraph>
            By accessing and using our website, you accept and agree to be bound by the terms and provision of this agreement.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Use License
          </Typography>
          <Typography variant="body1" paragraph>
            Permission is granted to temporarily use our website for personal, non-commercial transitory viewing only.
          </Typography>
        </Box>

        {/* Add more sections as needed */}
      </Paper>
    </Container>
  );
};

export default TermsOfService;