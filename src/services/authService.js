import axios from 'axios';
import config from '../config';

export const authService = {
  login: async (email, password) => {
    const response = await axios.post(`${config.API_BASE_URL}/auth/login`, {
      email,
      password
    });
    return response.data;
  },

  register: async (email, password) => {
    const response = await axios.post(`${config.API_BASE_URL}/auth/register`, {
      email,
      password
    });
    return response.data;
  },

  getProfile: async (token) => {
    const response = await axios.get(`${config.API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};