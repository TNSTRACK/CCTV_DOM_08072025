// src/hooks/useVehicleEvents.ts
// Hook para manejar eventos de vehículos multi-cámara

import { useState, useEffect } from 'react';
import { VehicleEvent, VehicleEventSearchFilters, VehicleEventStats, Event } from '../types';

// Función para convertir evento legacy a VehicleEvent
const convertLegacyEventToVehicleEvent = (event: Event): VehicleEvent => {
  return {
    id: event.id,
    licensePlate: event.licensePlate,
    startTime: event.eventDateTime,
    endTime: event.eventDateTime, // Para eventos legacy, inicio = fin
    status: 'COMPLETED',
    hasMetadata: event.hasMetadata,
    detections: [
      {
        id: `${event.id}-detection-1`,
        cameraName: event.cameraName,
        timestamp: event.eventDateTime,
        videoPath: `videos/${event.videoFilename}`,
        thumbnailPath: event.thumbnailPath,
        confidence: event.confidence,
      },
    ],
    metadata: event.metadata,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };
};

// Función para agrupar eventos legacy por matrícula y crear eventos multi-cámara
const groupLegacyEventsByLicensePlate = (events: Event[]): VehicleEvent[] => {
  const grouped = new Map<string, Event[]>();
  
  // Agrupar por matrícula
  events.forEach(event => {
    const key = event.licensePlate;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(event);
  });
  
  // Convertir grupos a VehicleEvents
  const vehicleEvents: VehicleEvent[] = [];
  
  grouped.forEach((eventGroup, licensePlate) => {
    if (eventGroup.length === 1) {
      // Evento único - convertir directamente
      vehicleEvents.push(convertLegacyEventToVehicleEvent(eventGroup[0]));
    } else {
      // Múltiples eventos - crear evento multi-cámara
      const sortedEvents = eventGroup.sort((a, b) => 
        new Date(a.eventDateTime).getTime() - new Date(b.eventDateTime).getTime()
      );
      
      const firstEvent = sortedEvents[0];
      const lastEvent = sortedEvents[sortedEvents.length - 1];
      
      // Verificar si los eventos están dentro de un rango de tiempo razonable (4 horas)
      const timeDiff = new Date(lastEvent.eventDateTime).getTime() - new Date(firstEvent.eventDateTime).getTime();
      const maxTimeDiff = 4 * 60 * 60 * 1000; // 4 horas en milisegundos
      
      if (timeDiff <= maxTimeDiff) {
        // Crear evento multi-cámara
        const vehicleEvent: VehicleEvent = {
          id: `vehicle-${licensePlate}-${firstEvent.id}`,
          licensePlate,
          startTime: firstEvent.eventDateTime,
          endTime: lastEvent.eventDateTime,
          status: 'COMPLETED',
          hasMetadata: eventGroup.some(e => e.hasMetadata),
          detections: eventGroup.map((event, index) => ({
            id: `${event.id}-detection-${index + 1}`,
            cameraName: event.cameraName,
            timestamp: event.eventDateTime,
            videoPath: `videos/${event.videoFilename}`,
            thumbnailPath: event.thumbnailPath,
            confidence: event.confidence,
          })),
          metadata: eventGroup.find(e => e.hasMetadata)?.metadata,
          createdAt: firstEvent.createdAt,
          updatedAt: lastEvent.updatedAt,
        };
        
        vehicleEvents.push(vehicleEvent);
      } else {
        // Eventos muy separados en tiempo - tratarlos como eventos individuales
        eventGroup.forEach(event => {
          vehicleEvents.push(convertLegacyEventToVehicleEvent(event));
        });
      }
    }
  });
  
  return vehicleEvents.sort((a, b) => 
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );
};

export const useVehicleEvents = (filters: VehicleEventSearchFilters = {}) => {
  const [vehicleEvents, setVehicleEvents] = useState<VehicleEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const loadVehicleEvents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Por ahora, usar datos mock - en el futuro llamar a /api/vehicle-events
      const mockEvents: VehicleEvent[] = [
        {
          id: 'vehicle-event-1',
          licensePlate: 'ABC123',
          startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          status: 'COMPLETED',
          hasMetadata: true,
          detections: [
            {
              id: 'det-1',
              cameraName: 'Entrada Principal ANPR',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              videoPath: 'videos/sample_anpr_video.mp4',
              thumbnailPath: 'thumbnails/thumb_1.jpg',
              confidence: 98.5,
            },
            {
              id: 'det-2',
              cameraName: 'Zona Descarga Norte',
              timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
              videoPath: 'videos/sample_anpr_video.mp4',
              thumbnailPath: 'thumbnails/thumb_2.jpg',
              confidence: 96.2,
            },
            {
              id: 'det-3',
              cameraName: 'Salida Principal ANPR',
              timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
              videoPath: 'videos/sample_anpr_video.mp4',
              thumbnailPath: 'thumbnails/thumb_3.jpg',
              confidence: 97.8,
            },
          ],
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'vehicle-event-2',
          licensePlate: 'XYZ789',
          startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          status: 'ACTIVE',
          hasMetadata: false,
          detections: [
            {
              id: 'det-4',
              cameraName: 'Entrada Principal ANPR',
              timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
              videoPath: 'videos/sample_anpr_video.mp4',
              thumbnailPath: 'thumbnails/thumb_4.jpg',
              confidence: 94.1,
            },
            {
              id: 'det-5',
              cameraName: 'Área Conteo 1',
              timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
              videoPath: 'videos/sample_anpr_video.mp4',
              thumbnailPath: 'thumbnails/thumb_5.jpg',
              confidence: 92.7,
            },
          ],
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        },
      ];

      // Aplicar filtros
      let filteredEvents = mockEvents;
      
      if (filters.licensePlate) {
        filteredEvents = filteredEvents.filter(event => 
          event.licensePlate.toLowerCase().includes(filters.licensePlate!.toLowerCase())
        );
      }
      
      if (filters.status) {
        filteredEvents = filteredEvents.filter(event => event.status === filters.status);
      }
      
      if (filters.hasMetadata !== undefined) {
        filteredEvents = filteredEvents.filter(event => event.hasMetadata === filters.hasMetadata);
      }
      
      if (filters.startDate) {
        filteredEvents = filteredEvents.filter(event => 
          new Date(event.startTime) >= new Date(filters.startDate!)
        );
      }
      
      if (filters.endDate) {
        filteredEvents = filteredEvents.filter(event => 
          new Date(event.startTime) <= new Date(filters.endDate!)
        );
      }

      setVehicleEvents(filteredEvents);
      setTotalCount(filteredEvents.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicleEvents();
  }, [filters]);

  return {
    vehicleEvents,
    loading,
    error,
    totalCount,
    refetch: loadVehicleEvents,
    convertLegacyEventToVehicleEvent,
    groupLegacyEventsByLicensePlate,
  };
};

export const useVehicleEventStats = () => {
  const [stats, setStats] = useState<VehicleEventStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock data
      const mockStats: VehicleEventStats = {
        totalEvents: 156,
        activeEvents: 12,
        eventsToday: 23,
        eventsWithMetadata: 134,
        topCameras: [
          { name: 'Entrada Principal ANPR', count: 89 },
          { name: 'Zona Descarga Norte', count: 67 },
          { name: 'Salida Principal ANPR', count: 78 },
        ],
      };

      setStats(mockStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: loadStats,
  };
};