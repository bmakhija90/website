import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';

const Banner = () => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        color: 'white',
        py: 8,
        mb: 4,
        textAlign: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Our Store
        </Typography>
        <Typography variant="h6" component="p" gutterBottom>
          Discover amazing products at great prices
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          sx={{ mt: 2 }}
        >
          Shop Now
        </Button>
      </Container>
    </Box>
  );
};

export default Banner;