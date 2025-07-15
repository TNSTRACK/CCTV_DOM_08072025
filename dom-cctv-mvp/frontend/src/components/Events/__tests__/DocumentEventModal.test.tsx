/**
 * Test para DocumentEventModal
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { theme } from '@/utils/theme';
import DocumentEventModal from '../DocumentEventModal';
import { Event } from '@/hooks/useEvents';

// Mock de los hooks
jest.mock('@/hooks/useMetadata', () => ({
  useCreateMetadata: () => ({
    mutateAsync: jest.fn().mockResolvedValue({}),
    isPending: false,
  }),
  useCompanies: () => ({
    data: [
      { id: '1', name: 'Test Company', rut: '12345678-9' },
    ],
  }),
  useReceptionists: () => ({
    data: [
      { id: '1', firstName: 'Test', lastName: 'User' },
    ],
  }),
}));

// Mock de react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

const mockEvent: Event = {
  id: '1',
  licensePlate: 'ABC123',
  eventDateTime: '2025-07-14T10:00:00Z',
  cameraName: 'Test Camera',
  videoFilename: 'test.mp4',
  hasMetadata: false,
  confidence: 95,
  createdAt: '2025-07-14T10:00:00Z',
  updatedAt: '2025-07-14T10:00:00Z',
};

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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
};

describe('DocumentEventModal', () => {
  const mockOnClose = jest.fn();
  const mockOnDocumentSaved = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render modal when open', () => {
    render(
      <TestWrapper>
        <DocumentEventModal
          event={mockEvent}
          open={true}
          onClose={mockOnClose}
          onDocumentSaved={mockOnDocumentSaved}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Documentar Evento')).toBeInTheDocument();
    expect(screen.getByText('ABC123')).toBeInTheDocument();
    expect(screen.getByText('Test Camera')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(
      <TestWrapper>
        <DocumentEventModal
          event={mockEvent}
          open={false}
          onClose={mockOnClose}
          onDocumentSaved={mockOnDocumentSaved}
        />
      </TestWrapper>
    );

    expect(screen.queryByText('Documentar Evento')).not.toBeInTheDocument();
  });

  it('should show all required form fields', () => {
    render(
      <TestWrapper>
        <DocumentEventModal
          event={mockEvent}
          open={true}
          onClose={mockOnClose}
          onDocumentSaved={mockOnDocumentSaved}
        />
      </TestWrapper>
    );

    expect(screen.getByLabelText(/empresa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/recepcionista/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/número de guía/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fecha de guía/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/orden de trabajo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descripción de carga/i)).toBeInTheDocument();
  });

  it('should show validation errors for empty required fields', async () => {
    render(
      <TestWrapper>
        <DocumentEventModal
          event={mockEvent}
          open={true}
          onClose={mockOnClose}
          onDocumentSaved={mockOnDocumentSaved}
        />
      </TestWrapper>
    );

    const submitButton = screen.getByText('Documentar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Empresa es requerida')).toBeInTheDocument();
      expect(screen.getByText('Número de guía es requerido')).toBeInTheDocument();
      expect(screen.getByText('Descripción de carga es requerida')).toBeInTheDocument();
      expect(screen.getByText('Orden de trabajo es requerida')).toBeInTheDocument();
      expect(screen.getByText('Recepcionista es requerido')).toBeInTheDocument();
    });
  });

  it('should call onClose when cancel button is clicked', () => {
    render(
      <TestWrapper>
        <DocumentEventModal
          event={mockEvent}
          open={true}
          onClose={mockOnClose}
          onDocumentSaved={mockOnDocumentSaved}
        />
      </TestWrapper>
    );

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should show event information correctly', () => {
    render(
      <TestWrapper>
        <DocumentEventModal
          event={mockEvent}
          open={true}
          onClose={mockOnClose}
          onDocumentSaved={mockOnDocumentSaved}
        />
      </TestWrapper>
    );

    expect(screen.getByText('ABC123')).toBeInTheDocument();
    expect(screen.getByText(/Test Camera/)).toBeInTheDocument();
    expect(screen.getByText(/95% confianza/)).toBeInTheDocument();
  });
});