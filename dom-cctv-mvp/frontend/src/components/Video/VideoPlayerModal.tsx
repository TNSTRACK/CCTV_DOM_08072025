// src/components/Video/VideoPlayerModal.tsx
// Modal de reproductor de video para vista completa

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  DirectionsCar as CarIcon,
  Schedule as TimeIcon,
  Videocam as CameraIcon,
  Speed as ConfidenceIcon,
} from '@mui/icons-material';
import SimpleVideoPlayer from './SimpleVideoPlayer';
import { Event } from '@/hooks/useEvents';

interface VideoPlayerModalProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
}

/**
 * Modal de reproductor de video con información del evento
 */
const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  event,
  open,
  onClose,
}) => {
  if (!event) return null;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'success';
    if (confidence >= 85) return 'warning';
    return 'error';
  };

  // Base URL para archivos estáticos (sin /api)
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : 'http://localhost:3001';
  
  const videoUrl = `${baseUrl}/uploads/videos/${event.videoFilename}`;
  const thumbnailUrl = event.thumbnailPath ? `${baseUrl}/uploads/${event.thumbnailPath}` : undefined;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '80vh',
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CarIcon color="primary" />
            Reproductor de Video - {event.licensePlate}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {event.cameraName} · {new Date(event.eventDateTime).toLocaleString('es-ES')}
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

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {/* Event Information Bar */}
        <Box sx={{ px: 2, py: 1, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TimeIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {new Date(event.eventDateTime).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CameraIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {event.cameraName}
              </Typography>
            </Box>

            <Chip
              icon={<ConfidenceIcon />}
              label={`Confianza: ${event.confidence}%`}
              color={getConfidenceColor(event.confidence)}
              size="small"
            />

            {event.hasMetadata && (
              <Chip
                label="Documentado"
                color="success"
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        </Box>

        {/* Video Player */}
        <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
          <SimpleVideoPlayer
            src={videoUrl}
            title={`Video de evento - ${event.licensePlate}`}
          />

          <Divider sx={{ my: 2 }} />

          {/* Technical Information */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Información Técnica
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Archivo de Video
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                  {event.videoFilename}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" color="text.secondary">
                  ID del Evento
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                  {event.id}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Creado
                </Typography>
                <Typography variant="body2">
                  {new Date(event.createdAt).toLocaleString('es-ES')}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Última Actualización
                </Typography>
                <Typography variant="body2">
                  {new Date(event.updatedAt).toLocaleString('es-ES')}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!event.hasMetadata}
        >
          Ver Metadatos
        </Button>
        <Button
          variant="contained"
          color="secondary"
        >
          Descargar Video
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VideoPlayerModal;