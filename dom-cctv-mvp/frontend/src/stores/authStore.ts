// src/stores/authStore.ts
// Store Zustand para manejo de autenticación

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthStore } from '@/types';
import { apiRequest } from '@/services/api';
import toast from 'react-hot-toast';

// PATRÓN: Store de autenticación con persistencia
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          const response = await apiRequest.post('/auth/login', {
            email,
            password,
          });

          if (response.data.success) {
            const { token, user } = response.data.data;
            
            // Guardar en localStorage
            localStorage.setItem('auth_token', token);
            localStorage.setItem('auth_user', JSON.stringify(user));
            
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });

            toast.success(`¡Bienvenido, ${user.firstName}!`);
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.error || 'Error al iniciar sesión';
          toast.error(errorMessage);
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
          
          throw error;
        }
      },

      logout: () => {
        // Limpiar localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });

        toast.success('Sesión cerrada exitosamente');
      },

      setUser: (user: User | null) => {
        set({ 
          user,
          isAuthenticated: !!user,
        });
      },

      setToken: (token: string | null) => {
        set({ token });
        
        if (token) {
          localStorage.setItem('auth_token', token);
        } else {
          localStorage.removeItem('auth_token');
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Validar token al rehidratar
        if (state?.token) {
          const storedUser = localStorage.getItem('auth_user');
          if (storedUser) {
            try {
              const user = JSON.parse(storedUser);
              state.setUser(user);
            } catch (error) {
              console.error('Error parsing stored user:', error);
              state.logout();
            }
          }
        }
      },
    }
  )
);