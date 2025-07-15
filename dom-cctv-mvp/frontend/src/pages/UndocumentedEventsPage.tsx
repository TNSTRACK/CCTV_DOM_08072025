// src/pages/UndocumentedEventsPage.tsx
// Página para documentar eventos pendientes (sin metadatos)

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  Fab,
  Tooltip,
  Chip,
  Paper,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  ArrowBack as BackIcon,
  Assignment as DocumentIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useEvents, EventSearchParams, Event } from '@/hooks/useEvents';
import EventsTable from '@/components/Events/EventsTable';
import EventDetailModal from '@/components/Events/EventDetailModal';
import VideoPlayerModal from '@/components/Video/VideoPlayerModal';
import DocumentEventModal from '@/components/Events/DocumentEventModal';
import toast from 'react-hot-toast';

/**
 * Página para documentar eventos pendientes (sin metadatos)
 */
const UndocumentedEventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoEvent, setVideoEvent] = useState<Event | null>(null);
  const [documentModalOpen, setDocumentModalOpen] = useState(false);
  const [documentEvent, setDocumentEvent] = useState<Event | null>(null);

  // Filtros para eventos sin documentar
  const [filters, setFilters] = useState<EventSearchParams>({
    page: 1,
    limit: 25,
    hasMetadata: false, // Solo eventos sin metadatos
    sortBy: 'eventDateTime',
    sortOrder: 'desc',
  });

  // Query para obtener eventos sin documentar
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useEvents(filters);

  const handleFiltersChange = (newFilters: EventSearchParams) => {
    setFilters({
      ...newFilters,
      hasMetadata: false, // Mantener siempre el filtro de sin metadatos
    });
  };

  const handleEventView = (event: Event) => {
    // En lugar de abrir el modal de detalles, abrir el modal de documentación
    setDocumentEvent(event);
    setDocumentModalOpen(true);
  };

  const handleEventPlay = (event: Event) => {
    setVideoEvent(event);
    setVideoModalOpen(true);
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Eventos actualizados');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const getStatsText = () => {
    if (!data) return '';
    
    const { totalCount, currentPage, totalPages } = data;
    return `${totalCount} evento${totalCount !== 1 ? 's' : ''} sin documentar (Página ${currentPage} de ${totalPages})`;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Tooltip title="Volver al Dashboard">
            <Fab
              size="small"
              color="default"
              onClick={handleBackToDashboard}
              sx={{ boxShadow: 1 }}
            >
              <BackIcon />
            </Fab>
          </Tooltip>
          
          <Typography variant="h4" component="h1" fontWeight="bold">
            Documentar Eventos
          </Typography>
        </Box>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Eventos ANPR pendientes de documentación - Agregar metadatos a eventos sin procesar
        </Typography>

        {/* Status Banner */}
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <DocumentIcon />
            <Box>
              <Typography variant="body2" fontWeight="bold">
                Eventos sin documentar
              </Typography>
              <Typography variant="caption">
                Estos eventos necesitan información adicional como empresa, guía de despacho y descripción de carga
              </Typography>
            </Box>
            {data && (
              <Chip
                label={`${data.totalCount} pendientes`}
                color="warning"
                variant="filled"
                sx={{ ml: 'auto', fontWeight: 'bold' }}
              />
            )}
          </Box>
        </Paper>
        
        {data && (
          <Typography variant="body2" color="text.secondary">
            {getStatsText()}
          </Typography>
        )}
      </Box>

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error al cargar los eventos: {(error as any)?.message || 'Error desconocido'}
        </Alert>
      )}

      {/* Instructions */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Instrucciones:</strong> Haz clic en "Ver detalles" para documentar un evento. 
          Completa el formulario con la información de la empresa, número de guía, descripción de carga y demás datos requeridos.
        </Typography>
      </Alert>

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

      {/* Document Event Modal */}
      <DocumentEventModal
        event={documentEvent}
        open={documentModalOpen}
        onClose={() => {
          setDocumentModalOpen(false);
          setDocumentEvent(null);
        }}
        onDocumentSaved={(event) => {
          // Refrescar la lista para remover el evento documentado
          refetch();
          toast.success(`Evento ${event.licensePlate} documentado exitosamente`);
        }}
      />

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
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
      </Box>
    </Container>
  );
};

export default UndocumentedEventsPage;