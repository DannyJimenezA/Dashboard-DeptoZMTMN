import axios from 'axios';
import { login, logout } from './AuthContextHelper';

export const setupAxiosInterceptor = () => {
  console.log('🚀 Interceptor de Axios global activado');

  // ✅ Interceptor de solicitud
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        const headers = config.headers as Record<string, string>;
        headers['Authorization'] = `Bearer ${token}`;
        console.log('📤 Token enviado en solicitud:', token);
      } else {
        console.log('⚠️ No se encontró token para esta solicitud');
      }
      return config;
    },
    (error) => {
      console.error('❌ Error en solicitud Axios:', error);
      return Promise.reject(error);
    }
  );

  // ✅ Interceptor de respuesta
  axios.interceptors.response.use(
    (response) => {
      const newToken = response.headers['x-refresh-token'];
      if (newToken) {
        console.log('🔄 Token actualizado correctamente (axios global):', newToken);
        localStorage.setItem('token', newToken);
        login(newToken);
      } else {
        console.log('ℹ️ Sin token nuevo en esta respuesta');
      }
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        console.warn('🔒 Token expirado o inválido (axios global)');
        localStorage.removeItem('token');
        logout();
      } else {
        console.error('❌ Error en respuesta Axios:', error);
      }
      return Promise.reject(error);
    }
  );
};
