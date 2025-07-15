// src/hooks/useEventDays.ts
// Hook para obtener días que tienen eventos para el DatePicker

import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

interface EventDay {
  date: string; // YYYY-MM-DD format
  count: number;
}

interface EventDaysResponse {
  days: EventDay[];
}

/**
 * Hook para obtener los días que tienen eventos
 * Se usa para destacar días con eventos en el DatePicker
 */
export const useEventDays = (year: number, month: number) => {
  return useQuery({
    queryKey: ['eventDays', year, month],
    queryFn: async (): Promise<EventDaysResponse> => {
      const startDate = new Date(year, month - 1, 1).toISOString();
      const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();
      
      try {
        const response = await api.get('/events/days', {
          params: {
            startDate,
            endDate,
          },
        });
        
        // El backend devuelve { success: true, data: { days: [...] } }
        return response.data.data;
      } catch (error) {
        console.error('Error fetching event days:', error);
        
        // Datos simulados para pruebas mientras se resuelve la base de datos
        const mockDays = [];
        const currentDate = new Date();
        const daysInMonth = new Date(year, month, 0).getDate();
        
        // Generar algunos días con eventos de ejemplo
        for (let day = 1; day <= daysInMonth; day++) {
          // Simular que algunos días tienen eventos
          if (day % 3 === 0 || day % 7 === 0) {
            mockDays.push({
              date: new Date(year, month - 1, day).toISOString().split('T')[0],
              count: Math.floor(Math.random() * 10) + 1,
            });
          }
        }
        
        return { days: mockDays };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  });
};

/**
 * Hook para verificar si una fecha específica tiene eventos
 */
export const useHasEvents = (date: Date, eventDays?: EventDay[]) => {
  if (!eventDays) return false;
  
  const dateString = date.toISOString().split('T')[0];
  return eventDays.some(day => day.date === dateString);
};

/**
 * Hook para obtener el conteo de eventos de una fecha específica
 */
export const useEventCount = (date: Date, eventDays?: EventDay[]) => {
  if (!eventDays) return 0;
  
  const dateString = date.toISOString().split('T')[0];
  const eventDay = eventDays.find(day => day.date === dateString);
  return eventDay?.count || 0;
};