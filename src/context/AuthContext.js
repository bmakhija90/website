import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set up axios interceptor for auth token - DO THIS FIRST
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  // Verify token and get user data
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        setToken(storedToken);
        await verifyToken(storedToken);
      } else {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []); // Empty dependency array - run only once on mount

  const verifyToken = async (tokenToVerify = token) => {
    try {
      console.log('🔐 Verifying token...');
      
      if (!tokenToVerify) {
        console.log('❌ No token available for verification');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${config.API_BASE_URL}/auth/me`);
      console.log('✅ Token verified, user data:', response.data);
      
      // Ensure user object has consistent structure
      const userData = response.data;
      setUser({
        ...userData,
        // Ensure we have both id and userId for compatibility
        id: userData.id || userData.userId,
        userId: userData.userId || userData.id
      });
      
    } catch (error) {
      console.error('❌ Token verification failed:', error);
      // Don't logout immediately, check if it's a network error
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login with:', email);
      
      const response = await axios.post(`${config.API_BASE_URL}/auth/login`, {
        email,
        password
      });

      const { token: newToken, user: userData, userId, email: userEmail, firstName, lastName } = response.data;
      
      console.log('✅ Login response:', response.data);
      
      if (!newToken) {
        throw new Error('No token received from server');
      }

      // Store token immediately
      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      // Handle user data - check multiple possible response structures
      let finalUserData = null;

      if (userData) {
        // If server returns complete user object
        finalUserData = {
          ...userData,
          id: userData.id || userData.userId || userId,
          userId: userData.userId || userData.id || userId
        };
      } else if (userId) {
        // If server returns separate fields, create user object
        finalUserData = {
          id: userId,
          userId: userId,
          email: userEmail,
          firstName: firstName,
          lastName: lastName
        };
        
        // Try to fetch complete profile
        try {
          console.log('📡 Fetching complete user profile...');
          const profileResponse = await axios.get(`${config.API_BASE_URL}/profile/${userId}`);
          console.log('✅ User profile fetched:', profileResponse.data);
          finalUserData = {
            ...finalUserData,
            ...profileResponse.data,
            id: profileResponse.data.id || profileResponse.data.userId || userId,
            userId: profileResponse.data.userId || profileResponse.data.id || userId
          };
        } catch (profileError) {
          console.warn('⚠️ Could not fetch complete profile, using basic user info:', profileError);
          // Continue with basic user data
        }
      }

      if (finalUserData) {
        setUser(finalUserData);
        console.log('👤 User set in context:', finalUserData);
      } else {
        console.error('❌ No user data available after login');
        throw new Error('No user data received');
      }
      
      return { success: true };
    } catch (error) {
      console.error('❌ Login error:', error);
      // Clear any partial state on failure
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Login failed' 
      };
    }
  };

  const register = async (email, password, firstName, lastName, phone) => {
    try {
      console.log('👤 Attempting registration with:', email);
      
      const response = await axios.post(`${config.API_BASE_URL}/auth/register`, {
        email,
        password,
        firstName,
        lastName,
        phone
      });

      const { token: newToken, user: userData, userId, email: userEmail } = response.data;
      
      console.log('✅ Registration response:', response.data);
      
      if (!newToken) {
        throw new Error('No token received from server');
      }

      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      // Handle user data
      let finalUserData = null;

      if (userData) {
        finalUserData = {
          ...userData,
          id: userData.id || userData.userId || userId,
          userId: userData.userId || userData.id || userId
        };
      } else if (userId) {
        finalUserData = {
          id: userId,
          userId: userId,
          email: userEmail,
          firstName: firstName,
          lastName: lastName,
          phone: phone
        };
        
        // Try to fetch complete profile
        try {
          const profileResponse = await axios.get(`${config.API_BASE_URL}/profile/${userId}`);
          finalUserData = {
            ...finalUserData,
            ...profileResponse.data,
            id: profileResponse.data.id || profileResponse.data.userId || userId,
            userId: profileResponse.data.userId || profileResponse.data.id || userId
          };
        } catch (profileError) {
          console.warn('⚠️ Could not fetch complete profile after registration:', profileError);
        }
      }

      if (finalUserData) {
        setUser(finalUserData);
      }
      
      return { success: true };
    } catch (error) {
      console.error('❌ Registration error:', error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    console.log('🚪 Logging out...');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateUserProfile = (userData) => {
    console.log('🔄 Updating user profile:', userData);
    setUser(prevUser => ({
      ...prevUser,
      ...userData,
      // Ensure ID consistency
      id: userData.id || userData.userId || prevUser?.id,
      userId: userData.userId || userData.id || prevUser?.userId
    }));
  };

  const refreshUserProfile = async () => {
    if (!user?.id && !user?.userId) {
      console.log('❌ No user ID available for refresh');
      return;
    }

    try {
      const userId = user.userId || user.id;
      console.log('🔄 Refreshing user profile for:', userId);
      
      const response = await axios.get(`${config.API_BASE_URL}/profile/${userId}`);
      updateUserProfile(response.data);
    } catch (error) {
      console.error('❌ Failed to refresh user profile:', error);
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUserProfile,
    refreshUserProfile,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};