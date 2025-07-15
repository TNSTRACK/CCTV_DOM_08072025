// src/hooks/useEvents.ts
// Hook personalizado para gestión de eventos ANPR

import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/services/api';

export interface Event {
  id: string;
  licensePlate: string;
  eventDateTime: string;
  cameraName: string;
  videoFilename: string;
  thumbnailPath?: string;
  hasMetadata: boolean;
  confidence: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventSearchParams {
  licensePlate?: string;
  startDate?: string;
  endDate?: string;
  cameraName?: string;
  companyId?: string;
  hasMetadata?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'licensePlate' | 'eventDateTime';
  sortOrder?: 'asc' | 'desc';
}

export interface EventsResponse {
  events: Event[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Hook para obtener eventos con filtros y paginación
 */
export const useEvents = (params: EventSearchParams = {}) => {
  return useQuery({
    queryKey: ['events', params],
    queryFn: async () => {
      // Construir query string
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
      
      const queryString = searchParams.toString();
      
      const response = await apiRequest.get<{ data: EventsResponse }>(`/events?${queryString}`);
      return response.data.data;
    },
    keepPreviousData: true, // Mantener datos anteriores mientras carga nuevos
  });
};

/**
 * Hook para obtener un evento específico por ID
 */
export const useEvent = (eventId: string) => {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const response = await apiRequest.get<{ event: Event }>(`/events/${eventId}`);
      return response.data.data?.event;
    },
    enabled: !!eventId,
  });
};