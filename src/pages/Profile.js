import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  CircularProgress,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  ExpandMore,
  Edit,
  Delete,
  Add,
  LocationOn,
  ShoppingBag,
  LocalShipping,
  CheckCircle,
  Schedule,
  Person,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import config from '../config';

const Profile = () => {
  const { user, token, updateUserProfile } = useAuth();
  const [expanded, setExpanded] = useState('addresses');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    id: '',
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatarUrl: '',
    memberSince: '',
    addresses: [],
    orders: []
  });

  const [newAddress, setNewAddress] = useState({
    type: 'Home',
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    county: '',
    postcode: '',
    country: 'United Kingdom',
    isDefault: false
  });

  // Debug: log user object
  useEffect(() => {
    console.log('Profile component - User from AuthContext:', user);
    fetchUserProfile(user.userId);
  }, [user]);

  /*
  useEffect(() => {
    if (user && token) {
      const userId = user.userId || user.id;
      if (userId) {
        console.log('Fetching profile for userId:', userId);
        fetchUserProfile(userId);
      } else {
        console.log('No user ID available in user object');
        setLoading(false);
      }
    } else {
      console.log('No user or token available');
      setLoading(false);
    }
  }, [user, token]);
*/
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchUserProfile = async (userId) => {
    try {
      setLoading(true);
      console.log('Fetching profile from API for user:', userId);
      
      const response = await axios.get(`${config.API_BASE_URL}/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Profile API response:', response.data);
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      showSnackbar('Failed to load profile data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      setUpdating(true);
      const userId = user.userId || user.id;
      const response = await axios.put(
        `${config.API_BASE_URL}/profile/${userId}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(response.data);
      updateUserProfile(response.data);
      showSnackbar('Profile updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Failed to update profile:', error);
      showSnackbar('Failed to update profile', 'error');
      return { success: false, error: error.response?.data?.message || 'Update failed' };
    } finally {
      setUpdating(false);
    }
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSave = async () => {
    const result = await updateProfile({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phone: profile.phone
    });
    
    if (result.success) {
      setIsEditing(false);
    }
  };

  const handleChange = (field) => (event) => {
    setProfile(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleAddAddress = async () => {
    try {
      setUpdating(true);
      const userId = user.userId || user.id;
      const response = await axios.post(
        `${config.API_BASE_URL}/profile/${userId}/addresses`,
        newAddress,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(response.data);
      setNewAddress({
        type: 'Home',
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        county: '',
        postcode: '',
        country: 'United Kingdom',
        isDefault: false
      });
      showSnackbar('Address added successfully');
    } catch (error) {
      console.error('Failed to add address:', error);
      showSnackbar('Failed to add address', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      setUpdating(true);
      const userId = user.userId || user.id;
      const response = await axios.delete(
        `${config.API_BASE_URL}/profile/${userId}/addresses/${addressId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(response.data);
      showSnackbar('Address deleted successfully');
    } catch (error) {
      console.error('Failed to delete address:', error);
      showSnackbar('Failed to delete address', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      setUpdating(true);
      const userId = user.userId || user.id;
      const response = await axios.put(
        `${config.API_BASE_URL}/profile/${userId}/addresses/${addressId}/default`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(response.data);
      showSnackbar('Default address updated');
    } catch (error) {
      console.error('Failed to set default address:', error);
      showSnackbar('Failed to set default address', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'shipped': return 'primary';
      case 'processing': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle color="success" />;
      case 'shipped': return <LocalShipping color="primary" />;
      case 'processing': return <Schedule color="warning" />;
      default: return <Schedule />;
    }
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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your profile...
        </Typography>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Alert severity="error">
          User not found. Please log in again.
        </Alert>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Reload Page
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header with User Avatar */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Avatar
          sx={{
            width: 120,
            height: 120,
            mx: 'auto',
            mb: 3,
            border: '4px solid',
            borderColor: 'primary.main',
          }}
        >
          <Person sx={{ fontSize: 60 }} />
        </Avatar>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          {profile.firstName} {profile.lastName}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {profile.email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Member since {new Date(profile.memberSince).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long'
          })}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column - Personal Information */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Personal Information
              </Typography>
              <Button
                startIcon={<Edit />}
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                variant={isEditing ? "contained" : "outlined"}
                size="small"
                disabled={updating}
              >
                {updating ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={profile.firstName}
                  onChange={handleChange('firstName')}
                  disabled={!isEditing || updating}
                  margin="normal"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={profile.lastName}
                  onChange={handleChange('lastName')}
                  disabled={!isEditing || updating}
                  margin="normal"
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  value={profile.email}
                  onChange={handleChange('email')}
                  disabled={!isEditing || updating}
                  margin="normal"
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={profile.phone}
                  onChange={handleChange('phone')}
                  disabled={!isEditing || updating}
                  margin="normal"
                  size="small"
                />
              </Grid>
            </Grid>

            {!isEditing && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {profile.orders?.length || 0} orders completed
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {profile.addresses?.length || 0} saved addresses
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Column - Full Width Accordion Sections */}
        <Grid item xs={12} md={8}>
          {/* Saved Addresses Accordion */}
          <Accordion 
            expanded={expanded === 'addresses'} 
            onChange={handleAccordionChange('addresses')}
            sx={{ mb: 3 }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationOn color="primary" />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Saved Addresses
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage your delivery addresses ({profile.addresses?.length || 0} saved)
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {/* Add New Address Form */}
              <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom>Add New Address</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={newAddress.firstName}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, firstName: e.target.value }))}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={newAddress.lastName}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, lastName: e.target.value }))}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address Line 1"
                      value={newAddress.address1}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, address1: e.target.value }))}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address Line 2"
                      value={newAddress.address2}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, address2: e.target.value }))}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>County</InputLabel>
                      <Select
                        value={newAddress.county}
                        label="County"
                        onChange={(e) => setNewAddress(prev => ({ ...prev, county: e.target.value }))}
                      >
                        <MenuItem value=""><em>Select County</em></MenuItem>
                        {ukCounties.map((county) => (
                          <MenuItem key={county} value={county}>{county}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Postcode"
                      value={newAddress.postcode}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, postcode: e.target.value }))}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Country"
                      value={newAddress.country}
                      disabled
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Button
                        startIcon={<Add />}
                        variant="contained"
                        onClick={handleAddAddress}
                        disabled={updating}
                      >
                        {updating ? 'Adding...' : 'Add Address'}
                      </Button>
                      <Typography variant="body2" color="text.secondary">
                        {newAddress.isDefault && 'This address will be set as default'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {/* Address List */}
              <Grid container spacing={3}>
                {profile.addresses?.map((address) => (
                  <Grid item xs={12} md={6} key={address.id}>
                    <Card 
                      sx={{ 
                        border: address.isDefault ? '2px solid' : '1px solid',
                        borderColor: address.isDefault ? 'primary.main' : 'grey.300',
                        position: 'relative',
                        height: '100%'
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Chip 
                            label={address.type} 
                            size="small" 
                            color={address.isDefault ? "primary" : "default"}
                            variant={address.isDefault ? "filled" : "outlined"}
                          />
                          <Box>
                            <IconButton 
                              size="small" 
                              onClick={() => handleSetDefaultAddress(address.id)}
                              disabled={address.isDefault || updating}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => handleDeleteAddress(address.id)}
                              color="error"
                              disabled={updating}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>

                        <Typography variant="body1" fontWeight="bold" gutterBottom>
                          {address.firstName} {address.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {address.address1}
                        </Typography>
                        {address.address2 && (
                          <Typography variant="body2" color="text.secondary">
                            {address.address2}
                          </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">
                          {address.city}, {address.county}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {address.postcode}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {address.country}
                        </Typography>

                        {address.isDefault && (
                          <Chip 
                            label="Default Address" 
                            size="small" 
                            color="primary"
                            sx={{ mt: 1 }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {(!profile.addresses || profile.addresses.length === 0) && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <LocationOn sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No saved addresses
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Add your first address to make checkout faster
                  </Typography>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>

          {/* Order History Accordion */}
          <Accordion 
            expanded={expanded === 'orders'} 
            onChange={handleAccordionChange('orders')}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ShoppingBag color="primary" />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Order History & Tracking
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    View your current and past orders ({profile.orders?.length || 0} total)
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {(!profile.orders || profile.orders.length === 0) ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <ShoppingBag sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No orders yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start shopping to see your order history here
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {/* Current Orders (Processing & Shipped) */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'primary.main' }}>
                      Current Orders
                    </Typography>
                    {profile.orders.filter(order => order.status !== 'delivered').length === 0 ? (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        No current orders - all orders have been delivered
                      </Typography>
                    ) : (
                      profile.orders
                        .filter(order => order.status !== 'delivered')
                        .map((order) => (
                          <OrderCard 
                            key={order.id} 
                            order={order} 
                            getStatusColor={getStatusColor}
                            getStatusIcon={getStatusIcon}
                          />
                        ))
                    )}
                  </Box>

                  {/* Past Orders (Delivered) */}
                  {profile.orders.filter(order => order.status === 'delivered').length > 0 && (
                    <Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'success.main' }}>
                        Order History
                      </Typography>
                      {profile.orders
                        .filter(order => order.status === 'delivered')
                        .map((order) => (
                          <OrderCard 
                            key={order.id} 
                            order={order} 
                            getStatusColor={getStatusColor}
                            getStatusIcon={getStatusIcon}
                          />
                        ))}
                    </Box>
                  )}
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

// Order Card Component
const OrderCard = ({ order, getStatusColor, getStatusIcon }) => (
  <Card sx={{ mb: 3, border: '1px solid', borderColor: 'grey.200' }}>
    <CardContent>
      {/* Order Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Order #{order.orderId}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Placed on {new Date(order.date).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {getStatusIcon(order.status)}
          <Chip 
            label={order.status.charAt(0).toUpperCase() + order.status.slice(1)} 
            color={getStatusColor(order.status)}
            size="small"
          />
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Order Items */}
      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
        Items:
      </Typography>
      <List dense>
        {order.items.map((item, itemIndex) => (
          <ListItem key={itemIndex}>
            <ListItemIcon>
              <ShoppingBag color="action" />
            </ListItemIcon>
            <ListItemText
              primary={item.name}
              secondary={`Qty: ${item.quantity} • £${item.price}`}
            />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      {/* Order Footer */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Delivery Address:
          </Typography>
          <Typography variant="body2">
            {order.deliveryAddress}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
              Total: £{order.total}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' }, flexWrap: 'wrap' }}>
              {order.trackingNumber && (
                <Button variant="outlined" size="small">
                  Track Order
                </Button>
              )}
              {order.status === 'delivered' && (
                <Button variant="outlined" size="small">
                  Reorder
                </Button>
              )}
              <Button variant="outlined" size="small">
                View Details
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Order Progress - Current Order Status */}
      {order.status !== 'delivered' && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Current Status:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            {getStatusIcon(order.status)}
            <Typography variant="body2">
              {order.status === 'processing' && 'Your order is being processed and will be shipped soon'}
              {order.status === 'shipped' && `Shipped on ${new Date(order.date).toLocaleDateString()} - Track with: ${order.trackingNumber}`}
              {order.status === 'delivered' && 'Delivered successfully'}
            </Typography>
          </Box>
        </>
      )}
    </CardContent>
  </Card>
);

export default Profile;