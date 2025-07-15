// src/components/Events/EventDetailModal.tsx
// Modal de detalles de evento

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Grid,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  DirectionsCar as CarIcon,
  Videocam as CameraIcon,
  Schedule as TimeIcon,
  Speed as ConfidenceIcon,
  Description as MetadataIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material';
import { Event } from '@/hooks/useEvents';

interface EventDetailModalProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
  onPlayVideo?: (event: Event) => void;
}

/**
 * Modal con detalles completos de un evento
 */
const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  open,
  onClose,
  onPlayVideo,
}) => {
  if (!event) return null;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'success';
    if (confidence >= 85) return 'warning';
    return 'error';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" component="div">
            Detalles del Evento
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ID: {event.id}
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CarIcon color="primary" />
              Información Principal
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Matrícula
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="primary.main">
                {event.licensePlate}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Confianza
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip
                  label={`${event.confidence}%`}
                  color={getConfidenceColor(event.confidence)}
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Fecha y Hora
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <TimeIcon fontSize="small" color="action" />
                {new Date(event.eventDateTime).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(event.eventDateTime).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Cámara
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <CameraIcon fontSize="small" color="action" />
                {event.cameraName}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Technical Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ConfidenceIcon color="secondary" />
              Información Técnica
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Archivo de Video
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, fontFamily: 'monospace' }}>
                {event.videoFilename}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Thumbnail
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, fontFamily: 'monospace' }}>
                {event.thumbnailPath || 'No disponible'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Creado
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {new Date(event.createdAt).toLocaleString('es-ES')}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Última Actualización
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {new Date(event.updatedAt).toLocaleString('es-ES')}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Metadata Status */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MetadataIcon color={event.hasMetadata ? 'success' : 'disabled'} />
              Estado de Documentación
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Box>
              {event.hasMetadata ? (
                <Chip
                  icon={<MetadataIcon />}
                  label="Evento documentado con metadatos"
                  color="success"
                  variant="outlined"
                />
              ) : (
                <Chip
                  label="Evento sin documentar"
                  color="default"
                  variant="outlined"
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<PlayIcon />}
          onClick={() => onPlayVideo?.(event)}
        >
          Reproducir Video
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!event.hasMetadata}
        >
          Ver Metadatos
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDetailModal;