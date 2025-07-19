// src/pages/EventsTestPage.tsx
// Página de prueba para verificar funcionamiento del sistema multi-cámara

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  Button,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { Event } from '@/hooks/useEvents';
import EnhancedEventDetailModal from '@/components/Events/EnhancedEventDetailModal';
import { useVehicleEvents } from '@/hooks/useVehicleEvents';

// Datos de prueba con múltiples cámaras para la misma matrícula
const testEvents: Event[] = [
  {
    id: 'event-abc123-1',
    licensePlate: 'ABC123',
    eventDateTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    cameraName: 'Entrada Principal ANPR',
    videoFilename: 'sample_anpr_video.mp4',
    thumbnailPath: 'thumbnails/thumb_1.jpg',
    hasMetadata: true,
    confidence: 98.5,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    metadata: {
      id: 'meta-1',
      eventId: 'event-abc123-1',
      companyId: 'company-1',
      guideNumber: 'GU-001',
      guideDate: new Date().toISOString(),
      cargoDescription: 'Encofrados metálicos',
      workOrder: 'WO-001',
      receptionistId: 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      company: {
        id: 'company-1',
        name: 'Constructora ABC',
        rut: '12345678-9',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      receptionist: {
        id: 'user-1',
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
      },
    },
  },
  {
    id: 'event-abc123-2',
    licensePlate: 'ABC123',
    eventDateTime: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    cameraName: 'Zona Descarga Norte',
    videoFilename: 'sample_anpr_video.mp4',
    thumbnailPath: 'thumbnails/thumb_2.jpg',
    hasMetadata: false,
    confidence: 96.2,
    createdAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
  },
  {
    id: 'event-abc123-3',
    licensePlate: 'ABC123',
    eventDateTime: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    cameraName: 'Área Conteo 1',
    videoFilename: 'sample_anpr_video.mp4',
    thumbnailPath: 'thumbnails/thumb_3.jpg',
    hasMetadata: false,
    confidence: 94.7,
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
  },
  {
    id: 'event-abc123-4',
    licensePlate: 'ABC123',
    eventDateTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    cameraName: 'Salida Principal ANPR',
    videoFilename: 'sample_anpr_video.mp4',
    thumbnailPath: 'thumbnails/thumb_4.jpg',
    hasMetadata: false,
    confidence: 97.8,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'event-xyz789-1',
    licensePlate: 'XYZ789',
    eventDateTime: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    cameraName: 'Entrada Principal ANPR',
    videoFilename: 'sample_anpr_video.mp4',
    thumbnailPath: 'thumbnails/thumb_5.jpg',
    hasMetadata: false,
    confidence: 93.4,
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
];

/**
 * Página de prueba para verificar el funcionamiento del sistema multi-cámara
 */
const EventsTestPage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  
  const { groupLegacyEventsByLicensePlate } = useVehicleEvents();

  // Función para detectar si un evento puede tener múltiples cámaras
  const getVehicleEventForEvent = (event: Event) => {
    // Buscar otros eventos con la misma matrícula en un rango de tiempo
    const relatedEvents = testEvents.filter(e => 
      e.licensePlate === event.licensePlate &&
      Math.abs(new Date(e.eventDateTime).getTime() - new Date(event.eventDateTime).getTime()) <= 4 * 60 * 60 * 1000
    );
    
    console.log('Eventos relacionados encontrados:', relatedEvents.length, 'para matrícula:', event.licensePlate);
    
    if (relatedEvents.length > 1) {
      const vehicleEvents = groupLegacyEventsByLicensePlate(relatedEvents);
      console.log('VehicleEvents creados:', vehicleEvents.length);
      
      const vehicleEvent = vehicleEvents.find(ve => 
        ve.detections.some(d => d.videoPath === event.videoFilename)
      );
      
      console.log('VehicleEvent seleccionado:', vehicleEvent);
      return vehicleEvent;
    }
    
    return null;
  };

  const handleEventView = (event: Event) => {
    console.log('Abriendo modal para evento:', event.id, event.licensePlate);
    setSelectedEvent(event);
    setDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setDetailModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Prueba - Sistema Multi-Cámara
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Eventos de prueba para verificar selección de cámara en modal
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Instrucciones:</strong> Haz clic en cualquier evento con matrícula "ABC123" para ver el modal con selector de cámara. 
          Este evento tiene 4 detecciones de diferentes cámaras.
        </Typography>
      </Alert>

      <Grid container spacing={2}>
        {testEvents.map((event) => (
          <Grid item xs={12} md={6} key={event.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" color="primary">
                    {event.licensePlate}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {event.confidence}% confianza
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Cámara:</strong> {event.cameraName}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Fecha:</strong> {new Date(event.eventDateTime).toLocaleString('es-CL')}
                </Typography>
                
                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEventView(event)}
                    size="small"
                  >
                    Ver Detalle
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal mejorado */}
      <EnhancedEventDetailModal
        event={selectedEvent}
        vehicleEvent={selectedEvent ? getVehicleEventForEvent(selectedEvent) : null}
        open={detailModalOpen}
        onClose={handleCloseModal}
        onPlayVideo={(event) => {
          console.log('Reproducir video:', event.videoFilename);
          // Aquí se abriría el reproductor de video
        }}
        onViewMetadata={(eventId) => {
          console.log('Ver metadatos:', eventId);
        }}
        onAddMetadata={(eventId) => {
          console.log('Agregar metadatos:', eventId);
        }}
        onCompleteEvent={(eventId) => {
          console.log('Completar evento:', eventId);
        }}
      />
    </Container>
  );
};

export default EventsTestPage;