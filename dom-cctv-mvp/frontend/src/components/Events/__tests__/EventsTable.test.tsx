/**
 * Test para el componente EventsTable con funcionalidad de ordenamiento
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/utils/theme';
import EventsTable from '../EventsTable';
import { EventsResponse, EventSearchParams } from '@/hooks/useEvents';

// Mock data
const mockData: EventsResponse = {
  events: [
    {
      id: '1',
      licensePlate: 'ABC123',
      eventDateTime: '2025-07-14T10:00:00Z',
      cameraName: 'Cam 1',
      videoFilename: 'video1.mp4',
      hasMetadata: true,
      confidence: 95,
      createdAt: '2025-07-14T10:00:00Z',
      updatedAt: '2025-07-14T10:00:00Z',
    },
    {
      id: '2',
      licensePlate: 'DEF456',
      eventDateTime: '2025-07-14T11:00:00Z',
      cameraName: 'Cam 2',
      videoFilename: 'video2.mp4',
      hasMetadata: false,
      confidence: 87,
      createdAt: '2025-07-14T11:00:00Z',
      updatedAt: '2025-07-14T11:00:00Z',
    },
  ],
  totalCount: 2,
  currentPage: 1,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

const mockFilters: EventSearchParams = {
  page: 1,
  limit: 25,
};

const mockOnFiltersChange = jest.fn();

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
);

describe('EventsTable', () => {
  beforeEach(() => {
    mockOnFiltersChange.mockClear();
  });

  it('should render table with events', () => {
    render(
      <TestWrapper>
        <EventsTable
          data={mockData}
          filters={mockFilters}
          onFiltersChange={mockOnFiltersChange}
        />
      </TestWrapper>
    );

    expect(screen.getByText('ABC123')).toBeInTheDocument();
    expect(screen.getByText('DEF456')).toBeInTheDocument();
  });

  it('should handle license plate sorting', () => {
    render(
      <TestWrapper>
        <EventsTable
          data={mockData}
          filters={mockFilters}
          onFiltersChange={mockOnFiltersChange}
        />
      </TestWrapper>
    );

    const licensePlateHeader = screen.getByText('Matrícula').closest('th');
    expect(licensePlateHeader).toBeInTheDocument();

    fireEvent.click(licensePlateHeader!);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      sortBy: 'licensePlate',
      sortOrder: 'asc',
      page: 1,
    });
  });

  it('should handle date sorting', () => {
    render(
      <TestWrapper>
        <EventsTable
          data={mockData}
          filters={mockFilters}
          onFiltersChange={mockOnFiltersChange}
        />
      </TestWrapper>
    );

    const dateHeader = screen.getByText('Fecha/Hora').closest('th');
    expect(dateHeader).toBeInTheDocument();

    fireEvent.click(dateHeader!);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      sortBy: 'eventDateTime',
      sortOrder: 'asc',
      page: 1,
    });
  });

  it('should toggle sort order when clicking same column', () => {
    const filtersWithSort: EventSearchParams = {
      ...mockFilters,
      sortBy: 'licensePlate',
      sortOrder: 'asc',
    };

    render(
      <TestWrapper>
        <EventsTable
          data={mockData}
          filters={filtersWithSort}
          onFiltersChange={mockOnFiltersChange}
        />
      </TestWrapper>
    );

    const licensePlateHeader = screen.getByText('Matrícula').closest('th');
    fireEvent.click(licensePlateHeader!);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...filtersWithSort,
      sortBy: 'licensePlate',
      sortOrder: 'desc',
      page: 1,
    });
  });

  it('should show loading state', () => {
    render(
      <TestWrapper>
        <EventsTable
          data={undefined}
          filters={mockFilters}
          onFiltersChange={mockOnFiltersChange}
          isLoading={true}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Cargando eventos...')).toBeInTheDocument();
  });

  it('should show empty state when no events', () => {
    const emptyData: EventsResponse = {
      ...mockData,
      events: [],
      totalCount: 0,
    };

    render(
      <TestWrapper>
        <EventsTable
          data={emptyData}
          filters={mockFilters}
          onFiltersChange={mockOnFiltersChange}
        />
      </TestWrapper>
    );

    expect(screen.getByText('No se encontraron eventos con los filtros aplicados')).toBeInTheDocument();
  });
});