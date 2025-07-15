/**
 * Test para MainLayout - verificar nueva opción de menú "Documentar"
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/utils/theme';
import MainLayout from '../MainLayout';

// Mock del hook useAuth
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@test.com',
    },
    logout: jest.fn(),
    getInitials: () => 'JP',
  }),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('MainLayout', () => {
  it('should render all navigation items', () => {
    render(
      <TestWrapper>
        <MainLayout />
      </TestWrapper>
    );

    // Verificar que todas las opciones del menú están presentes
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Eventos')).toBeInTheDocument();
    expect(screen.getByText('Documentar')).toBeInTheDocument();
  });

  it('should have correct navigation structure', () => {
    render(
      <TestWrapper>
        <MainLayout />
      </TestWrapper>
    );

    // Verificar que el título de la aplicación está presente
    expect(screen.getByText('DOM CCTV')).toBeInTheDocument();
    expect(screen.getByText('Sistema de Videovigilancia')).toBeInTheDocument();
  });

  it('should show user information', () => {
    render(
      <TestWrapper>
        <MainLayout />
      </TestWrapper>
    );

    // Verificar información del usuario
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('JP')).toBeInTheDocument(); // Iniciales en avatar
  });

  it('should have document menu item with assignment icon', () => {
    render(
      <TestWrapper>
        <MainLayout />
      </TestWrapper>
    );

    const documentarItem = screen.getByText('Documentar').closest('li');
    expect(documentarItem).toBeInTheDocument();
    
    // Verificar que tiene el ícono correcto (Assignment)
    const listItemButton = documentarItem?.querySelector('[role="button"]');
    expect(listItemButton).toBeInTheDocument();
  });

  it('should show user menu when avatar is clicked', () => {
    render(
      <TestWrapper>
        <MainLayout />
      </TestWrapper>
    );

    // Hacer clic en el avatar
    const avatarButton = screen.getByRole('button', { name: /account of current user/i });
    fireEvent.click(avatarButton);

    // Verificar que se muestra el menú del usuario
    expect(screen.getByText('Mi Perfil')).toBeInTheDocument();
    expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
  });
});