// src/hooks/useAuth.ts
// Hook personalizado para manejo de autenticación

import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { apiRequest } from '@/services/api';
import { User } from '@/types';
import toast from 'react-hot-toast';

/**
 * Hook personalizado para operaciones de autenticación
 */
export const useAuth = () => {
  const { user, token, isAuthenticated, login, logout, setUser } = useAuthStore();

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      await login(data.email, data.password);
    },
    onError: (error: any) => {
      // El error ya se maneja en el store, pero podemos hacer logging adicional aquí
      console.error('Login error:', error);
    },
  });

  // Mutation para logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        // Intentar notificar al servidor del logout
        await apiRequest.post('/auth/logout');
      } catch (error) {
        // Incluso si falla, hacer logout local
        console.error('Server logout error:', error);
      } finally {
        logout();
      }
    },
  });

  // Query para obtener perfil actual
  const { 
    data: profile, 
    isLoading: isProfileLoading,
    error: profileError,
    refetch: refetchProfile 
  } = useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: async () => {
      const response = await apiRequest.get<{ user: User }>('/auth/profile');
      return response.data.data?.user;
    },
    enabled: !!token && isAuthenticated,
    retry: false,
    onSuccess: (userData) => {
      if (userData) {
        setUser(userData);
      }
    },
    onError: (error: any) => {
      if (error.response?.status === 401) {
        // Token inválido, hacer logout
        logout();
      }
    },
  });

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  // Verificar si el usuario tiene uno de varios roles
  const hasAnyRole = (roles: string[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  // Verificar si es administrador
  const isAdmin = (): boolean => {
    return hasRole('ADMINISTRATOR');
  };

  // Verificar si es operador
  const isOperator = (): boolean => {
    return hasRole('OPERATOR');
  };

  // Obtener nombre completo del usuario
  const getFullName = (): string => {
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`;
  };

  // Obtener iniciales del usuario
  const getInitials = (): string => {
    if (!user) return '';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  return {
    // Estado
    user,
    token,
    isAuthenticated,
    isLoading: loginMutation.isLoading || logoutMutation.isLoading || isProfileLoading,
    profile,
    profileError,
    
    // Mutaciones
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutate,
    
    // Estado de mutaciones
    isLoggingIn: loginMutation.isLoading,
    isLoggingOut: logoutMutation.isLoading,
    loginError: loginMutation.error,
    
    // Utilidades
    hasRole,
    hasAnyRole,
    isAdmin,
    isOperator,
    getFullName,
    getInitials,
    refetchProfile,
  };
};