import axios from 'axios';
import { login, logout } from './AuthContextHelper';

const axiosInstance = axios.create();

// Interceptor de solicitudes
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuestas
axiosInstance.interceptors.response.use(
  (response) => {
    const newToken = response.headers['x-refresh-token'];
    if (newToken) {
      console.log('🔄 Token actualizado correctamente (axios)');
      localStorage.setItem('token', newToken);
      login(newToken); // actualiza AuthContext
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn('🔒 Token expirado (axios), cerrando sesión.');
      localStorage.removeItem('token');
      logout();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
