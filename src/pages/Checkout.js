import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
  Card,
  CardContent,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';
import { Add, Remove, ExpandMore, LocalShipping, Payment, Assignment, ShoppingBag } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';

const Checkout = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [expanded, setExpanded] = useState('orderSummary');
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    postcode: '',
    city: '',
    county: '',
    country: 'United Kingdom',
  });
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
  });

  useEffect(() => {
    // Redirect to auth modal if not authenticated
    if (!isAuthenticated) {
      setAuthModalOpen(true);
    }

    // Redirect to cart if cart is empty
    if (cart.items.length === 0 && isAuthenticated) {
      navigate('/cart');
    }
  }, [isAuthenticated, cart.items.length, navigate]);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const subtotal = getCartTotal();
  const shippingCost = deliveryMethod === 'express' ? 5 : 0;
  const vat = subtotal * 0.20;
  const total = subtotal + shippingCost + vat;

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    // User is now authenticated, proceed with checkout
  };

  const ukCounties = [
    'Avon', 'Bedfordshire', 'Berkshire', 'Buckinghamshire', 'Cambridgeshire',
    'Cheshire', 'Cornwall', 'Cumbria', 'Derbyshire', 'Devon', 'Dorset',
    'Durham', 'East Sussex', 'Essex', 'Gloucestershire', 'Hampshire',
    'Herefordshire', 'Hertfordshire', 'Kent', 'Lancashire', 'Leicestershire',
    'Lincolnshire', 'London', 'Merseyside', 'Middlesex', 'Norfolk',
    'Northamptonshire', 'Northumberland', 'North Yorkshire', 'Nottinghamshire',
    'Oxfordshire', 'Rutland', 'Shropshire', 'Somerset', 'South Yorkshire',
    'Staffordshire', 'Suffolk', 'Surrey', 'Tyne and Wear', 'Warwickshire',
    'West Midlands', 'West Sussex', 'West Yorkshire', 'Wiltshire', 'Worcestershire'
  ];

  const handleContinueToDelivery = () => {
    setExpanded('delivery');
  };

  const handleContinueToPayment = () => {
    // Basic validation
    if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.address1 || 
        !shippingInfo.postcode || !shippingInfo.city || !contactInfo.email) {
      alert('Please fill in all required fields.');
      return;
    }
    setExpanded('payment');
  };

  const handleBackToOrderSummary = () => {
    setExpanded('orderSummary');
  };

  const handleBackToDelivery = () => {
    setExpanded('delivery');
  };

  const handlePlaceOrder = async () => {
    // Here you would integrate with your order API
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and show success message
      clearCart();
      alert('Order placed successfully!');
      navigate('/');
    } catch (error) {
      alert('Failed to place order. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <AuthModal 
        open={authModalOpen} 
        onClose={() => {
          setAuthModalOpen(false);
          navigate('/cart'); // Go back to cart if auth modal closed
        }}
      />
    );
  }

  if (cart.items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Your cart is empty
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Checkout
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column - All Accordions (Full width for accordions) */}
        <Grid item xs={12}>
          {/* Order Summary Accordion */}
          <Paper sx={{ p: 4, mb: 3 }}>
            <Stepper activeStep={expanded === 'orderSummary' ? 0 : expanded === 'delivery' ? 1 : 2} sx={{ mb: 4 }}>
              <Step>
                <StepLabel>Order Summary</StepLabel>
              </Step>
              <Step>
                <StepLabel>Delivery Details</StepLabel>
              </Step>
              <Step>
                <StepLabel>Payment</StepLabel>
              </Step>
            </Stepper>

            {/* Order Summary Section */}
            {expanded === 'orderSummary' && (
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Review Your Order
                </Typography>
                
                <Grid container spacing={4} sx={{ mt: 2 }}>
                  {/* Cart Items - Left Side */}
                  <Grid item xs={12} md={8}>
                    {cart.items.map((item) => (
                      <Card key={item.id} sx={{ mb: 2, border: '1px solid', borderColor: 'grey.200' }}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{
                                width: 80,
                                height: 80,
                                objectFit: 'cover',
                                borderRadius: 4
                              }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {item.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {item.description}
                              </Typography>
                              
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Colour: {item.color || 'Black'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Size: {item.size || 'UK 10'}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" color="primary" fontWeight="bold">
                                  £{item.price.toFixed(2)}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  >
                                    <Remove fontSize="small" />
                                  </IconButton>
                                  <Typography variant="body2" sx={{ minWidth: 30, textAlign: 'center' }}>
                                    {item.quantity}
                                  </Typography>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  >
                                    <Add fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Grid>

                  {/* Price Summary - Right Side */}
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, bgcolor: 'grey.50', position: 'sticky', top: 100 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Price Summary
                      </Typography>
                      
                      <Box sx={{ space: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Subtotal</Typography>
                          <Typography variant="body2">£{subtotal.toFixed(2)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">
                            Delivery
                          </Typography>
                          <Typography variant="body2" color={shippingCost === 0 ? 'success.main' : 'text.primary'}>
                            {shippingCost === 0 ? 'FREE' : `£${shippingCost.toFixed(2)}`}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">VAT (20%)</Typography>
                          <Typography variant="body2">£{vat.toFixed(2)}</Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="h6" fontWeight="bold">Total</Typography>
                          <Typography variant="h6" fontWeight="bold">£{total.toFixed(2)}</Typography>
                        </Box>
                      </Box>

                      <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={handleContinueToDelivery}
                          fullWidth
                        >
                          Continue to Delivery
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Delivery Details Section */}
            {expanded === 'delivery' && (
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Delivery Information
                </Typography>
                
                <Grid container spacing={4} sx={{ mt: 2 }}>
                  {/* Contact and Address Information - Left Side */}
                  <Grid item xs={12} md={8}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                      *Indicates required field
                    </Typography>

                    {/* Contact Information */}
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>Contact Information</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            fullWidth
                            label="Email Address"
                            type="email"
                            value={contactInfo.email}
                            onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Phone Number (Optional)"
                            type="tel"
                            value={contactInfo.phone}
                            onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                            variant="outlined"
                            size="small"
                            placeholder="+44 20 7946 0958"
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Delivery Address */}
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>Delivery Address</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            fullWidth
                            label="First Name"
                            value={shippingInfo.firstName}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            fullWidth
                            label="Last Name"
                            value={shippingInfo.lastName}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <TextField
                            required
                            fullWidth
                            label="Address Line 1"
                            value={shippingInfo.address1}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, address1: e.target.value })}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Address Line 2"
                            value={shippingInfo.address2}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, address2: e.target.value })}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            fullWidth
                            label="Town/City"
                            value={shippingInfo.city}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <InputLabel>County</InputLabel>
                            <Select
                              value={shippingInfo.county}
                              label="County"
                              onChange={(e) => setShippingInfo({ ...shippingInfo, county: e.target.value })}
                            >
                              <MenuItem value=""><em>Select county</em></MenuItem>
                              {ukCounties.map((county) => (
                                <MenuItem key={county} value={county}>{county}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            fullWidth
                            label="Postcode"
                            value={shippingInfo.postcode}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, postcode: e.target.value })}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Country"
                            value={shippingInfo.country}
                            disabled
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Delivery Method */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>Delivery Method</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Card 
                            sx={{ 
                              p: 2, 
                              border: deliveryMethod === 'standard' ? '2px solid' : '1px solid',
                              borderColor: deliveryMethod === 'standard' ? 'primary.main' : 'grey.300',
                              cursor: 'pointer'
                            }}
                            onClick={() => setDeliveryMethod('standard')}
                          >
                            <Typography variant="subtitle1" fontWeight="bold">
                              Standard Delivery
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              2-3 business days
                            </Typography>
                            <Typography variant="h6" color="success.main" sx={{ mt: 1 }}>
                              FREE
                            </Typography>
                          </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Card 
                            sx={{ 
                              p: 2,
                              border: deliveryMethod === 'express' ? '2px solid' : '1px solid',
                              borderColor: deliveryMethod === 'express' ? 'primary.main' : 'grey.300',
                              cursor: 'pointer'
                            }}
                            onClick={() => setDeliveryMethod('express')}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                Express Delivery
                              </Typography>
                              <Box sx={{ 
                                bgcolor: 'primary.main', 
                                color: 'white', 
                                px: 1, 
                                py: 0.5, 
                                borderRadius: 1,
                                fontSize: '0.75rem'
                              }}>
                                +£5.00
                              </Box>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              Next working day
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Order before 3pm for next day delivery
                            </Typography>
                            <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                              £5.00
                            </Typography>
                          </Card>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>

                  {/* Order Summary - Right Side */}
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, bgcolor: 'grey.50', position: 'sticky', top: 100 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Order Summary
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        {cart.items.slice(0, 3).map((item) => (
                          <Box key={item.id} sx={{ display: 'flex', gap: 2, mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{
                                width: 50,
                                height: 50,
                                objectFit: 'cover',
                                borderRadius: 4
                              }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" fontWeight="medium">
                                {item.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Qty: {item.quantity} • £{item.price.toFixed(2)}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                        {cart.items.length > 3 && (
                          <Typography variant="caption" color="text.secondary">
                            +{cart.items.length - 3} more items
                          </Typography>
                        )}
                      </Box>

                      <Box sx={{ space: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Subtotal</Typography>
                          <Typography variant="body2">£{subtotal.toFixed(2)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">
                            Delivery {deliveryMethod === 'express' && '(Express)'}
                          </Typography>
                          <Typography variant="body2" color={shippingCost === 0 ? 'success.main' : 'text.primary'}>
                            {shippingCost === 0 ? 'FREE' : `£${shippingCost.toFixed(2)}`}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">VAT (20%)</Typography>
                          <Typography variant="body2">£{vat.toFixed(2)}</Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="h6" fontWeight="bold">Total</Typography>
                          <Typography variant="h6" fontWeight="bold">£{total.toFixed(2)}</Typography>
                        </Box>
                      </Box>

                      <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Button
                          variant="outlined"
                          sx={{ mr: 1, mb: 1 }}
                          onClick={handleBackToOrderSummary}
                          fullWidth
                        >
                          Back to Order Summary
                        </Button>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={handleContinueToPayment}
                          fullWidth
                        >
                          Continue to Payment
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Payment Section */}
            {expanded === 'payment' && (
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Payment Method
                </Typography>
                
                <Grid container spacing={4} sx={{ mt: 2 }}>
                  <Grid item xs={12} md={8}>
                    <Alert severity="info" sx={{ mb: 3 }}>
                      This is a demo checkout. No real payments will be processed.
                    </Alert>

                    <Paper sx={{ p: 3, mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Select Payment Method
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Button variant="outlined" size="large">
                          Credit/Debit Card
                        </Button>
                        <Button variant="outlined" size="large">
                          PayPal
                        </Button>
                        <Button variant="outlined" size="large">
                          Klarna
                        </Button>
                      </Box>
                    </Paper>

                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={handleBackToDelivery}
                      >
                        Back to Delivery
                      </Button>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={handlePlaceOrder}
                        sx={{ bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }}
                      >
                        Place Order - £{total.toFixed(2)}
                      </Button>
                    </Box>
                  </Grid>

                  {/* Final Order Summary - Right Side */}
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, bgcolor: 'grey.50', position: 'sticky', top: 100 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Final Order Summary
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" fontWeight="bold" gutterBottom>
                          Delivery Address:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {shippingInfo.firstName} {shippingInfo.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {shippingInfo.address1}
                        </Typography>
                        {shippingInfo.address2 && (
                          <Typography variant="body2" color="text.secondary">
                            {shippingInfo.address2}
                          </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">
                          {shippingInfo.city}, {shippingInfo.postcode}
                        </Typography>
                      </Box>

                      <Box sx={{ space: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Items ({cart.items.length})</Typography>
                          <Typography variant="body2">£{subtotal.toFixed(2)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Delivery</Typography>
                          <Typography variant="body2">{shippingCost === 0 ? 'FREE' : `£${shippingCost.toFixed(2)}`}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">VAT</Typography>
                          <Typography variant="body2">£{vat.toFixed(2)}</Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="h6" fontWeight="bold">Total</Typography>
                          <Typography variant="h6" fontWeight="bold">£{total.toFixed(2)}</Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;