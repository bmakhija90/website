import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  IconButton,
} from '@mui/material';
import { Facebook, Twitter, Instagram, Email } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              E-Commerce Store
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Your one-stop shop for all your needs. Quality products, great prices, and excellent customer service.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton color="inherit">
                <Facebook />
              </IconButton>
              <IconButton color="inherit">
                <Twitter />
              </IconButton>
              <IconButton color="inherit">
                <Instagram />
              </IconButton>
              <IconButton color="inherit">
                <Email />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                component="button"
                variant="body2"
                color="inherit"
                onClick={() => navigate('/')}
                sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
              >
                Home
              </Link>
              <Link
                component="button"
                variant="body2"
                color="inherit"
                onClick={() => navigate('/cart')}
                sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
              >
                Cart
              </Link>
              <Link
                component="button"
                variant="body2"
                color="inherit"
                onClick={() => navigate('/profile')}
                sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
              >
                My Profile
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Customer Service
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                component="button"
                variant="body2"
                color="inherit"
                onClick={() => navigate('/contact')}
                sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
              >
                Contact Us
              </Link>
              <Link
                component="button"
                variant="body2"
                color="inherit"
                onClick={() => navigate('/shipping')}
                sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
              >
                Shipping Info
              </Link>
              <Link
                component="button"
                variant="body2"
                color="inherit"
                onClick={() => navigate('/faq')}
                sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
              >
                FAQ
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Policies
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                component="button"
                variant="body2"
                color="inherit"
                onClick={() => navigate('/privacy-policy')}
                sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
              >
                Privacy Policy
              </Link>
              <Link
                component="button"
                variant="body2"
                color="inherit"
                onClick={() => navigate('/return-policy')}
                sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
              >
                Return Policy
              </Link>
              <Link
                component="button"
                variant="body2"
                color="inherit"
                onClick={() => navigate('/terms')}
                sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
              >
                Terms of Service
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            borderTop: 1,
            borderColor: 'rgba(255, 255, 255, 0.3)',
            pt: 3,
            mt: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} E-Commerce Store. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;