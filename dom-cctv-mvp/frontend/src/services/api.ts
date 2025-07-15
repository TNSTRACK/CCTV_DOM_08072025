// src/services/api.ts
// Cliente API para comunicación con el backend

import axios, { AxiosResponse, AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { ApiResponse } from '@/types';

// PATRÓN: Configuración de cliente Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// PATRÓN: Interceptor para incluir token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// PATRÓN: Interceptor de respuesta para manejo de errores
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  (error: AxiosError<ApiResponse>) => {
    // Manejo de errores de autenticación
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      // Solo mostrar error si no estamos en la página de login
      if (!window.location.pathname.includes('/login')) {
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // Manejo de errores del servidor
    if (error.response?.status >= 500) {
      toast.error('Error del servidor. Por favor, intenta más tarde.');
    }

    // Manejo de errores de red
    if (!error.response) {
      toast.error('Error de conexión. Verifica tu conexión a internet.');
    }

    return Promise.reject(error);
  }
);

// PATRÓN: Funciones helper para requests tipados
export const apiRequest = {
  get: <T = any>(url: string, params?: any): Promise<AxiosResponse<ApiResponse<T>>> =>
    api.get(url, { params }),

  post: <T = any>(url: string, data?: any): Promise<AxiosResponse<ApiResponse<T>>> =>
    api.post(url, data),

  put: <T = any>(url: string, data?: any): Promise<AxiosResponse<ApiResponse<T>>> =>
    api.put(url, data),

  delete: <T = any>(url: string): Promise<AxiosResponse<ApiResponse<T>>> =>
    api.delete(url),
};

export default api;