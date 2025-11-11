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

  // Set up axios interceptor for auth token
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

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/auth/me`);
      console.log('User profile from verifyToken:', response.data);
      setUser(response.data);
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', email);
      
      const response = await axios.post(`${config.API_BASE_URL}/auth/login`, {
        email,
        password
      });

      const { token: newToken, userId, email: userEmail, firstName, lastName } = response.data;
      
      console.log('Login response:', response.data);
      
      // Store token immediately
      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      // Fetch complete user profile using the userId from login response
      if (userId) {
        try {
          const profileResponse = await axios.get(`${config.API_BASE_URL}/profile/${userId}`);
          console.log('User profile from API:', profileResponse.data);
          setUser(profileResponse.data);
        } catch (profileError) {
          console.error('Failed to fetch user profile:', profileError);
          // Fallback: create user object from login response
          setUser({
            id: userId,
            userId: userId,
            email: userEmail,
            firstName: firstName,
            lastName: lastName
          });
        }
      } else {
        console.error('No userId in login response');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login error details:', error.response?.data);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (email, password, firstName, lastName, phone) => {
    try {
      console.log('Attempting registration with:', email);
      
      const response = await axios.post(`${config.API_BASE_URL}/auth/register`, {
        email,
        password,
        firstName,
        lastName,
        phone
      });

      const { token: newToken, userId, email: userEmail } = response.data;
      
      console.log('Registration response:', response.data);
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      // Fetch complete user profile
      if (userId) {
        const profileResponse = await axios.get(`${config.API_BASE_URL}/profile/${userId}`);
        setUser(profileResponse.data);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateUserProfile = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUserProfile,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};