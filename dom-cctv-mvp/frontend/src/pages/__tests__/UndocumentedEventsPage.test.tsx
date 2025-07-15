/**
 * Test para UndocumentedEventsPage
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/utils/theme';
import UndocumentedEventsPage from '../UndocumentedEventsPage';

// Mock del hook useEvents
jest.mock('@/hooks/useEvents', () => ({
  useEvents: () => ({
    data: {
      events: [
        {
          id: '1',
          licensePlate: 'ABC123',
          eventDateTime: '2025-07-14T10:00:00Z',
          cameraName: 'Cam 1',
          videoFilename: 'video1.mp4',
          hasMetadata: false,
          confidence: 95,
          createdAt: '2025-07-14T10:00:00Z',
          updatedAt: '2025-07-14T10:00:00Z',
        }
      ],
      totalCount: 1,
      currentPage: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  }),
}));

// Mock de react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
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

describe('UndocumentedEventsPage', () => {
  it('should render page header correctly', () => {
    render(
      <TestWrapper>
        <UndocumentedEventsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Documentar Eventos')).toBeInTheDocument();
    expect(screen.getByText(/Eventos ANPR pendientes de documentación/)).toBeInTheDocument();
  });

  it('should show undocumented events banner', () => {
    render(
      <TestWrapper>
        <UndocumentedEventsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Eventos sin documentar')).toBeInTheDocument();
    expect(screen.getByText(/Estos eventos necesitan información adicional/)).toBeInTheDocument();
    expect(screen.getByText('1 pendientes')).toBeInTheDocument();
  });

  it('should show instructions alert', () => {
    render(
      <TestWrapper>
        <UndocumentedEventsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Instrucciones:')).toBeInTheDocument();
    expect(screen.getByText(/Haz clic en "Ver detalles" para documentar un evento/)).toBeInTheDocument();
  });

  it('should display events table with undocumented events', () => {
    render(
      <TestWrapper>
        <UndocumentedEventsPage />
      </TestWrapper>
    );

    expect(screen.getByText('ABC123')).toBeInTheDocument();
    expect(screen.getByText('Cam 1')).toBeInTheDocument();
  });

  it('should have back to dashboard button', () => {
    render(
      <TestWrapper>
        <UndocumentedEventsPage />
      </TestWrapper>
    );

    const backButton = screen.getByRole('button', { name: /volver al dashboard/i });
    expect(backButton).toBeInTheDocument();
  });

  it('should have refresh button', () => {
    render(
      <TestWrapper>
        <UndocumentedEventsPage />
      </TestWrapper>
    );

    const refreshButton = screen.getByRole('button', { name: /actualizar eventos/i });
    expect(refreshButton).toBeInTheDocument();
  });
});