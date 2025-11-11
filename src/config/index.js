const config = {
  // API Configuration
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  IMAGE_BASE_URL: process.env.REACT_APP_IMAGE_BASE_URL || 'http://localhost:5000/',
  
  // Stripe Configuration
  STRIPE_PUBLISHABLE_KEY: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_test_key_here',
  
  // Environment
  ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT || 'development',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  
  // Feature Flags
  FEATURES: {
    ENABLE_STRIPE: process.env.REACT_APP_ENABLE_STRIPE !== 'false',
    ENABLE_ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  }
};

// Validation
if (!config.STRIPE_PUBLISHABLE_KEY) {
  console.warn('Stripe publishable key is not set. Payment functionality will be disabled.');
}

if (!config.API_BASE_URL) {
  console.error('API_BASE_URL is not configured. The app may not function correctly.');
}

export default config;