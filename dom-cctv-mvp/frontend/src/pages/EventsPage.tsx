// src/pages/EventsPage.tsx
// Página completa de gestión de eventos ANPR

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  Fab,
  Tooltip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Download as ExportIcon,
} from '@mui/icons-material';
import { useEvents, EventSearchParams, Event } from '@/hooks/useEvents';
import EventsFilters from '@/components/Events/EventsFilters';
import EventsTable from '@/components/Events/EventsTable';
import EventDetailModal from '@/components/Events/EventDetailModal';
import EnhancedEventDetailModal from '@/components/Events/EnhancedEventDetailModal';
import { useVehicleEvents } from '@/hooks/useVehicleEvents';
import VideoPlayerModal from '@/components/Video/VideoPlayerModal';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { injectMultiCameraTestData, detectMultiCameraEvents } from '@/utils/injectTestData';

/**
 * Página principal de gestión de eventos ANPR
 */
const EventsPage: React.FC = () => {
  const location = useLocation();
  const [filters, setFilters] = useState<EventSearchParams>({
    page: 1,
    limit: 25,
  });

  // Efecto para procesar parámetros de URL (navegación desde Dashboard)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const dateParam = urlParams.get('date');
    
    if (dateParam) {
      // Convertir fecha YYYY-MM-DD a rango de día completo en UTC
      const startDate = new Date(dateParam + 'T00:00:00.000Z');
      const endDate = new Date(dateParam + 'T23:59:59.999Z');
      
      
      setFilters(prev => ({
        ...prev,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        page: 1, // Resetear a primera página
      }));
      
      const selectedDate = startDate;
      
      // Mostrar toast informativo
      toast.success(`Mostrando eventos del ${selectedDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}`);
    }
  }, [location.search]);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoEvent, setVideoEvent] = useState<Event | null>(null);
  
  // Hook para eventos multi-cámara
  const { 
    vehicleEvents, 
    convertLegacyEventToVehicleEvent, 
    groupLegacyEventsByLicensePlate 
  } = useVehicleEvents();

  // Query para obtener eventos
  const {
    data: originalData,
    isLoading,
    error,
    refetch,
  } = useEvents(filters);

  // Inyectar datos de prueba para garantizar eventos multi-cámara
  const data = originalData ? {
    ...originalData,
    events: injectMultiCameraTestData(originalData.events),
  } : null;

  const handleFiltersChange = (newFilters: EventSearchParams) => {
    setFilters(newFilters);
  };

  const handleEventView = (event: Event) => {
    setSelectedEvent(event);
    setDetailModalOpen(true);
  };

  // Función para detectar si un evento puede tener múltiples cámaras
  const getVehicleEventForEvent = (event: Event) => {
    if (!data?.events) return null;
    
    // Los datos ya incluyen eventos de prueba, no necesitamos inyectar de nuevo
    const relatedEvents = data.events.filter(e => 
      e.licensePlate === event.licensePlate &&
      Math.abs(new Date(e.eventDateTime).getTime() - new Date(event.eventDateTime).getTime()) <= 4 * 60 * 60 * 1000 // 4 horas
    );
    
    console.log(`Eventos relacionados para ${event.licensePlate}:`, relatedEvents.length);
    console.log('Eventos relacionados:', relatedEvents.map(e => ({ id: e.id, camera: e.cameraName, time: e.eventDateTime })));
    
    if (relatedEvents.length > 1) {
      // Crear VehicleEvent a partir de eventos relacionados
      const vehicleEvents = groupLegacyEventsByLicensePlate(relatedEvents);
      console.log('VehicleEvents creados:', vehicleEvents.length);
      
      const vehicleEvent = vehicleEvents.find(ve => 
        ve.detections.some(d => d.videoPath === event.videoFilename)
      );
      
      console.log('VehicleEvent encontrado:', vehicleEvent ? 'SÍ' : 'NO');
      console.log('VehicleEvent detalles:', vehicleEvent ? {
        id: vehicleEvent.id,
        licensePlate: vehicleEvent.licensePlate,
        detections: vehicleEvent.detections.length,
        cameras: vehicleEvent.detections.map(d => d.cameraName)
      } : null);
      
      return vehicleEvent;
    }
    
    return null;
  };

  const handleEventPlay = (event: Event) => {
    setVideoEvent(event);
    setVideoModalOpen(true);
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Eventos actualizados');
  };

  const handleExport = () => {
    // TODO: Implementar exportación de datos
    toast.success('Función de exportación en desarrollo');
  };

  const getStatsText = () => {
    if (!data) return '';
    
    const { totalCount, currentPage, totalPages } = data;
    return `${totalCount} evento${totalCount !== 1 ? 's' : ''} encontrado${totalCount !== 1 ? 's' : ''} (Página ${currentPage} de ${totalPages})`;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Gestión de Eventos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Sistema de detección ANPR - Búsqueda y gestión de eventos registrados
        </Typography>
        
        {data && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {getStatsText()}
          </Typography>
        )}
      </Box>

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error al cargar los eventos: {error.message || 'Error desconocido'}
        </Alert>
      )}

      {/* Filters */}
      <EventsFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        isLoading={isLoading}
      />

      {/* Events Table */}
      <EventsTable
        data={data}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onEventView={handleEventView}
        onEventPlay={handleEventPlay}
        isLoading={isLoading}
        error={error}
      />

      {/* Event Detail Modal - Enhanced version */}
      <EnhancedEventDetailModal
        event={selectedEvent}
        vehicleEvent={selectedEvent ? getVehicleEventForEvent(selectedEvent) : null}
        open={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedEvent(null);
        }}
        onPlayVideo={(event) => {
          setDetailModalOpen(false);
          setSelectedEvent(null);
          handleEventPlay(event);
        }}
        onViewMetadata={(eventId) => {
          console.log('Ver metadatos:', eventId);
          // TODO: Implementar modal de metadatos
        }}
        onAddMetadata={(eventId) => {
          console.log('Agregar metadatos:', eventId);
          // TODO: Implementar modal de agregar metadatos
        }}
        onCompleteEvent={(eventId) => {
          console.log('Completar evento:', eventId);
          // TODO: Implementar completar evento
        }}
      />

      {/* Video Player Modal */}
      <VideoPlayerModal
        event={videoEvent}
        open={videoModalOpen}
        onClose={() => {
          setVideoModalOpen(false);
          setVideoEvent(null);
        }}
      />

      {/* Floating Action Buttons */}
      <Box sx={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Tooltip title="Actualizar eventos" placement="left">
          <span>
            <Fab
              color="primary"
              onClick={handleRefresh}
              disabled={isLoading}
              size="medium"
            >
              <RefreshIcon />
            </Fab>
          </span>
        </Tooltip>
        
        <Tooltip title="Exportar eventos" placement="left">
          <Fab
            color="secondary"
            onClick={handleExport}
            size="medium"
          >
            <ExportIcon />
          </Fab>
        </Tooltip>
      </Box>
    </Container>
  );
};

export default EventsPage;