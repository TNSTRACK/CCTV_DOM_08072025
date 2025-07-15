// src/hooks/useDashboard.ts
// Hook personalizado para datos del dashboard

import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/services/api';

export interface EventStats {
  totalEvents: number;
  eventsToday: number;
  eventsWithMetadata: number;
  averageConfidence: number;
  topCameras: Array<{ name: string; count: number }>;
}

export interface RecentEvent {
  id: string;
  licensePlate: string;
  eventDateTime: string;
  cameraName: string;
  confidence: number;
  hasMetadata: boolean;
}

/**
 * Hook para obtener estadísticas del dashboard
 */
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const response = await apiRequest.get<{ stats: EventStats }>('/events/stats');
      return response.data.data?.stats;
    },
    refetchInterval: 30000, // Actualizar cada 30 segundos
  });
};

/**
 * Hook para obtener eventos recientes
 */
export const useRecentEvents = (limit: number = 10) => {
  return useQuery({
    queryKey: ['dashboard', 'recent-events', limit],
    queryFn: async () => {
      const response = await apiRequest.get<{ events: RecentEvent[] }>(`/events/recent?limit=${limit}`);
      return response.data.data?.events;
    },
    refetchInterval: 60000, // Actualizar cada minuto
  });
};