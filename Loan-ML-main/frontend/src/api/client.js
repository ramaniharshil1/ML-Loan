import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
API.interceptors.request.use(
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

// Response interceptor to handle common errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.status === 422) {
      // Invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => API.post('/api/auth/register', userData),
  login: (credentials) => API.post('/api/auth/login', credentials),
  getMe: () => API.get('/api/auth/me'),
};

// Prediction API calls
export const predictionAPI = {
  predict: (data) => API.post('/api/predict', data),
  getHistory: () => API.get('/api/history'),
  deletePrediction: (id) => API.delete(`/api/history/${id}`),
  getStats: () => API.get('/api/stats'),
};

// Health check
export const healthAPI = {
  check: () => API.get('/'),
};

export default API;
