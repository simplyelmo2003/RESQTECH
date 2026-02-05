import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.token) {
        config.headers.Authorization = `Bearer ${parsedUser.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle global errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: If token is expired or invalid, log out the user
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized or token expired. Logging out...');
      // Imperative logout needs to be handled carefully outside of context directly
      // Potentially dispatch a global event or redirect
      // For now, let's just clear localStorage and reload for simplicity in this example
      localStorage.removeItem('user');
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default api;