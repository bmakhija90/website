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
  Card,
  CardContent,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Add, Remove, LocalShipping, Payment, CheckCircle } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';
import config from '../config';

const Checkout = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { isAuthenticated, user, token } = useAuth();
  const navigate = useNavigate();
  
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [addressOption, setAddressOption] = useState('new'); // 'new' or 'saved'
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedSavedAddress, setSelectedSavedAddress] = useState('');
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  
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

  const steps = ['Order Summary', 'Delivery Details', 'Payment'];

  useEffect(() => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
    }

    if (cart.items.length === 0 && isAuthenticated) {
      navigate('/cart');
    }

    if (isAuthenticated && user) {
      loadSavedAddresses();
    }
  }, [isAuthenticated, cart.items.length, navigate, user]);

  const loadSavedAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const userId = user?.userId || user?.id;
      if (userId && token) {
        const response = await fetch(`${config.API_BASE_URL}/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const profileData = await response.json();
        setSavedAddresses(profileData.addresses || []);
        
        const defaultAddress = profileData.addresses?.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedSavedAddress(defaultAddress.id);
          setAddressOption('saved');
          populateShippingInfo(defaultAddress);
        }
      }
    } catch (error) {
      console.error('Failed to load saved addresses:', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const populateShippingInfo = (address) => {
    setShippingInfo({
      firstName: address.firstName || '',
      lastName: address.lastName || '',
      address1: address.address1 || '',
      address2: address.address2 || '',
      postcode: address.postcode || '',
      city: address.city || '',
      county: address.county || '',
      country: address.country || 'United Kingdom',
    });
  };

  const handleAddressOptionChange = (event) => {
    const option = event.target.value;
    setAddressOption(option);
    
    if (option === 'saved' && selectedSavedAddress) {
      const selectedAddress = savedAddresses.find(addr => addr.id === selectedSavedAddress);
      if (selectedAddress) {
        populateShippingInfo(selectedAddress);
      }
    } else if (option === 'new') {
      setShippingInfo({
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        postcode: '',
        city: '',
        county: '',
        country: 'United Kingdom',
      });
    }
  };

  const handleSavedAddressChange = (event) => {
    const addressId = event.target.value;
    setSelectedSavedAddress(addressId);
    
    const selectedAddress = savedAddresses.find(addr => addr.id === addressId);
    if (selectedAddress) {
      populateShippingInfo(selectedAddress);
    }
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

  const handleNext = () => {
    if (activeStep === 0) {
      setActiveStep(1);
    } else if (activeStep === 1) {
      if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.address1 || 
          !shippingInfo.postcode || !shippingInfo.city || !contactInfo.email) {
        alert('Please fill in all required fields.');
        return;
      }
      setActiveStep(2);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handlePlaceOrder = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
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
          navigate('/cart');
        }}
      />
    );
  }

  if (cart.items.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Your cart is empty
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
      <Container maxWidth="false">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} sx={{ maxWidth: 1000, mx: 'auto' }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Grid container spacing={2}  direction="row"  sx={{justifyContent: "center"}}> 
          {/* Main Content - Left Side */}
          <Grid item xs={12} lg={6}>
            <Paper sx={{ p: 4, height: 'fit-content' }}>
              {/* Order Summary Step */}
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Review Your Order
                  </Typography>
                  
                  {cart.items.map((item) => (
                    <Card key={item.id} sx={{ mb: 2, border: '1px solid', borderColor: 'grey.200' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: 100,
                              height: 100,
                              objectFit: 'cover',
                              borderRadius: 8
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                              {item.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {item.description}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                              <Chip label={`Colour: ${item.color || 'Black'}`} size="small" variant="outlined" />
                              <Chip label={`Size: ${item.size || 'UK 10'}`} size="small" variant="outlined" />
                            </Box>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="h5" color="primary" fontWeight="bold">
                                £{item.price.toFixed(2)}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                >
                                  <Remove />
                                </IconButton>
                                <Typography variant="h6" sx={{ minWidth: 40, textAlign: 'center' }}>
                                  {item.quantity}
                                </Typography>
                                <IconButton
                                  size="small"
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                >
                                  <Add />
                                </IconButton>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}

              {/* Delivery Details Step */}
              {activeStep === 1 && (
                <Box>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Delivery Information
                  </Typography>

                  {/* Contact Information */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" sx={{ mb: 3 }}>Contact Information</Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          required
                          fullWidth
                          label="Email Address"
                          type="email"
                          value={contactInfo.email}
                          onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                          size="medium"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Phone Number (Optional)"
                          type="tel"
                          value={contactInfo.phone}
                          onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                          size="medium"
                          placeholder="+44 20 7946 0958"
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Address Selection */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" sx={{ mb: 3 }}>Delivery Address</Typography>
                    
                    {/* Address Option Selection */}
                    <FormControl component="fieldset" sx={{ mb: 4 }}>
                      <FormLabel component="legend" sx={{ fontSize: '1.1rem', mb: 2, fontWeight: 'bold' }}>
                        Choose address option
                      </FormLabel>
                      <RadioGroup
                        value={addressOption}
                        onChange={handleAddressOptionChange}
                        sx={{ gap: 2 }}
                      >
                        <Card 
                          sx={{ 
                            p: 3,
                            border: addressOption === 'saved' ? '2px solid' : '1px solid',
                            borderColor: addressOption === 'saved' ? 'primary.main' : 'grey.300',
                            cursor: 'pointer'
                          }}
                          onClick={() => setAddressOption('saved')}
                        >
                          <FormControlLabel 
                            value="saved" 
                            control={<Radio />} 
                            label={
                              <Box>
                                <Typography variant="h6" fontWeight="bold">
                                  Use Saved Address
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Select from your previously saved addresses
                                </Typography>
                              </Box>
                            }
                            disabled={savedAddresses.length === 0}
                            sx={{ width: '100%', m: 0 }}
                          />
                        </Card>
                        
                        <Card 
                          sx={{ 
                            p: 3,
                            border: addressOption === 'new' ? '2px solid' : '1px solid',
                            borderColor: addressOption === 'new' ? 'primary.main' : 'grey.300',
                            cursor: 'pointer'
                          }}
                          onClick={() => setAddressOption('new')}
                        >
                          <FormControlLabel 
                            value="new" 
                            control={<Radio />} 
                            label={
                              <Box>
                                <Typography variant="h6" fontWeight="bold">
                                  Enter New Address
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Add a new delivery address
                                </Typography>
                              </Box>
                            }
                            sx={{ width: '100%', m: 0 }}
                          />
                        </Card>
                      </RadioGroup>
                    </FormControl>

                    {/* Saved Addresses Dropdown */}
                    {addressOption === 'saved' && (
                      <Box sx={{ mb: 4 }}>
                        {loadingAddresses ? (
                          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                          </Box>
                        ) : savedAddresses.length > 0 ? (
                          <FormControl fullWidth size="medium">
                            <InputLabel>Select Saved Address</InputLabel>
                            <Select
                              value={selectedSavedAddress}
                              label="Select Saved Address"
                              onChange={handleSavedAddressChange}
                            >
                              {savedAddresses.map((address) => (
                                <MenuItem key={address.id} value={address.id}>
                                  <Box sx={{ py: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                      <Typography variant="subtitle1" fontWeight="bold">
                                        {address.firstName} {address.lastName}
                                      </Typography>
                                      {address.isDefault && (
                                        <Chip 
                                          label="Default" 
                                          size="small" 
                                          color="primary"
                                        />
                                      )}
                                      <Chip 
                                        label={address.type} 
                                        size="small" 
                                        variant="outlined"
                                      />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                      {address.address1}, {address.address2 && `${address.address2}, `}
                                      {address.city}, {address.county}, {address.postcode}
                                    </Typography>
                                  </Box>
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        ) : (
                          <Alert severity="info">
                            You don't have any saved addresses. Please add an address in your profile or choose "Enter new address".
                          </Alert>
                        )}
                      </Box>
                    )}

                    {/* Address Form */}
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          required
                          fullWidth
                          label="First Name"
                          value={shippingInfo.firstName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                          size="medium"
                          disabled={addressOption === 'saved'}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          required
                          fullWidth
                          label="Last Name"
                          value={shippingInfo.lastName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                          size="medium"
                          disabled={addressOption === 'saved'}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          label="Address Line 1"
                          value={shippingInfo.address1}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, address1: e.target.value })}
                          size="medium"
                          disabled={addressOption === 'saved'}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Address Line 2"
                          value={shippingInfo.address2}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, address2: e.target.value })}
                          size="medium"
                          disabled={addressOption === 'saved'}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          required
                          fullWidth
                          label="Town/City"
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                          size="medium"
                          disabled={addressOption === 'saved'}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="medium">
                          <InputLabel>County</InputLabel>
                          <Select
                            value={shippingInfo.county}
                            label="County"
                            onChange={(e) => setShippingInfo({ ...shippingInfo, county: e.target.value })}
                            disabled={addressOption === 'saved'}
                          >
                            <MenuItem value=""><em>Select county</em></MenuItem>
                            {ukCounties.map((county) => (
                              <MenuItem key={county} value={county}>{county}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          required
                          fullWidth
                          label="Postcode"
                          value={shippingInfo.postcode}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, postcode: e.target.value })}
                          size="medium"
                          disabled={addressOption === 'saved'}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Country"
                          value={shippingInfo.country}
                          disabled
                          size="medium"
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Delivery Method */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" sx={{ mb: 3 }}>Delivery Method</Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Card 
                          sx={{ 
                            p: 3, 
                            border: deliveryMethod === 'standard' ? '2px solid' : '1px solid',
                            borderColor: deliveryMethod === 'standard' ? 'primary.main' : 'grey.300',
                            cursor: 'pointer',
                            height: '100%'
                          }}
                          onClick={() => setDeliveryMethod('standard')}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Radio checked={deliveryMethod === 'standard'} />
                            <Box>
                              <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Standard Delivery
                              </Typography>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                2-3 business days
                              </Typography>
                              <Typography variant="h5" color="success.main" fontWeight="bold">
                                FREE
                              </Typography>
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Card 
                          sx={{ 
                            p: 3,
                            border: deliveryMethod === 'express' ? '2px solid' : '1px solid',
                            borderColor: deliveryMethod === 'express' ? 'primary.main' : 'grey.300',
                            cursor: 'pointer',
                            height: '100%'
                          }}
                          onClick={() => setDeliveryMethod('express')}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Radio checked={deliveryMethod === 'express'} />
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Typography variant="h6" fontWeight="bold">
                                  Express Delivery
                                </Typography>
                                <Chip label="+£5.00" color="primary" size="small" />
                              </Box>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Next working day
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Order before 3pm for next day delivery
                              </Typography>
                              <Typography variant="h5" color="primary" fontWeight="bold">
                                £5.00
                              </Typography>
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              )}

              {/* Payment Step */}
              {activeStep === 2 && (
                <Box>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Payment Method
                  </Typography>
                  
                  <Alert severity="info" sx={{ mb: 4 }}>
                    This is a demo checkout. No real payments will be processed.
                  </Alert>

                  <Paper sx={{ p: 4, mb: 4 }}>
                    <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                      Select Payment Method
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      <Button variant="outlined" size="large" sx={{ minWidth: 200 }}>
                        Credit/Debit Card
                      </Button>
                      <Button variant="outlined" size="large" sx={{ minWidth: 200 }}>
                        PayPal
                      </Button>
                      <Button variant="outlined" size="large" sx={{ minWidth: 200 }}>
                        Klarna
                      </Button>
                    </Box>
                  </Paper>
                </Box>
              )}

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: '1px solid #eee' }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  sx={{ minWidth: 150 }}
                >
                  Back
                </Button>
                
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handlePlaceOrder}
                    sx={{ 
                      minWidth: 200,
                      bgcolor: 'success.main',
                      '&:hover': { bgcolor: 'success.dark' }
                    }}
                    startIcon={<CheckCircle />}
                  >
                    Place Order - £{total.toFixed(2)}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleNext}
                    sx={{ minWidth: 200 }}
                  >
                    Continue to {steps[activeStep + 1]}
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Order Summary Sidebar - Right Side */}
          <Grid item xs={12} lg={6}>
            <Box>
              <Paper sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ pb: 2, borderBottom: '2px solid', borderColor: 'primary.main' }}>
                  Order Summary
                </Typography>
                
                {/* Cart Items Preview */}
                <Box sx={{ mb: 3 }}>
                  {cart.items.slice(0, 3).map((item) => (
                    <Box key={item.id} sx={{ display: 'flex', gap: 2, mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: 'cover',
                          borderRadius: 4
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" fontWeight="medium" gutterBottom>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Qty: {item.quantity} • £{item.price.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                  {cart.items.length > 3 && (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
                      +{cart.items.length - 3} more items
                    </Typography>
                  )}
                </Box>

                {/* Price Breakdown */}
                <Box sx={{ space: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">Subtotal</Typography>
                    <Typography variant="body1">£{subtotal.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      Delivery {deliveryMethod === 'express' && '(Express)'}
                    </Typography>
                    <Typography variant="body1" color={shippingCost === 0 ? 'success.main' : 'text.primary'}>
                      {shippingCost === 0 ? 'FREE' : `£${shippingCost.toFixed(2)}`}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">VAT (20%)</Typography>
                    <Typography variant="body1">£{vat.toFixed(2)}</Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight="bold">Total</Typography>
                    <Typography variant="h6" fontWeight="bold">£{total.toFixed(2)}</Typography>
                  </Box>
                </Box>

                {/* Delivery Address Preview (Steps 2 & 3) */}
                {(activeStep === 1 || activeStep === 2) && (
                  <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #eee' }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
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
                    {addressOption === 'saved' && (
                      <Chip 
                        label="Saved Address" 
                        size="small" 
                        color="primary"
                        variant="outlined"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                )}
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Checkout;