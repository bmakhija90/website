import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ open, onClose }) => {
  const { login, register, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  // Reset form when modal opens/closes or tab changes
  React.useEffect(() => {
    if (open) {
      setFormData({ 
        email: '', 
        password: '', 
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phone: ''
      });
      setError('');
    }
  }, [open, activeTab]);

  // Close modal when authentication is successful
  React.useEffect(() => {
    if (isAuthenticated && open) {
      console.log('Authentication successful, closing modal');
      onClose();
    }
  }, [isAuthenticated, open, onClose]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (activeTab === 1) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      if (!formData.firstName || !formData.lastName) {
        setError('Please fill in your name');
        setLoading(false);
        return;
      }
    }

    try {
      let result;
      if (activeTab === 0) {
        // Login
        result = await login(formData.email, formData.password);
      } else {
        // Register
        result = await register(
          formData.email, 
          formData.password, 
          formData.firstName, 
          formData.lastName, 
          formData.phone
        );
      }

      if (result.success) {
        console.log('Auth successful, waiting for state update...');
        // The useEffect above will handle closing the modal when isAuthenticated becomes true
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {activeTab === 1 && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="firstName"
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="lastName"
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </Grid>
              </Grid>
            )}

            <TextField
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              fullWidth
              variant="outlined"
              size="small"
            />

            <TextField
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              fullWidth
              variant="outlined"
              size="small"
            />

            {activeTab === 1 && (
              <>
                <TextField
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  variant="outlined"
                  size="small"
                />
                <TextField
                  name="phone"
                  label="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Please wait...' : activeTab === 0 ? 'Login' : 'Register'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AuthModal;