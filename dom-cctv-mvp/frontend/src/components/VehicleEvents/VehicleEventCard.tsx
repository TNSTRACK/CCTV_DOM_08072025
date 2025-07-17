// src/components/VehicleEvents/VehicleEventCard.tsx
// Tarjeta para mostrar evento de vehículo con múltiples cámaras

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  Button,
  ButtonGroup,
  IconButton,
  Tooltip,
  Grid,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  Videocam,
  Schedule,
  DirectionsCar,
  Assignment,
  CheckCircle,
  PendingActions,
  Visibility,
} from '@mui/icons-material';
import { VehicleEvent, Detection } from '../../types';
import VideoPlayer from '../Video/VideoPlayer';

interface VehicleEventCardProps {
  event: VehicleEvent;
  onViewMetadata?: (eventId: string) => void;
  onAddMetadata?: (eventId: string) => void;
  onComplete?: (eventId: string) => void;
}

/**
 * Tarjeta que muestra un evento de vehículo con selector de cámara
 * Permite ver videos de diferentes cámaras para el mismo evento
 */
const VehicleEventCard: React.FC<VehicleEventCardProps> = ({
  event,
  onViewMetadata,
  onAddMetadata,
  onComplete,
}) => {
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(
    event.detections[0] || null
  );
  const [videoOpen, setVideoOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'COMPLETED':
        return 'info';
      case 'TIMEOUT':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Activo';
      case 'COMPLETED':
        return 'Completado';
      case 'TIMEOUT':
        return 'Timeout';
      default:
        return status;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventDuration = () => {
    if (!event.endTime) return 'En progreso';
    
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    const diffMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} min`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  };

  return (
    <Card sx={{ mb: 2, boxShadow: 2 }}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <DirectionsCar color="primary" />
            <Typography variant="h6" component="span">
              {event.licensePlate}
            </Typography>
            <Chip
              label={getStatusText(event.status)}
              color={getStatusColor(event.status) as any}
              size="small"
            />
          </Box>
        }
        action={
          <Box display="flex" gap={1}>
            {event.hasMetadata ? (
              <Tooltip title="Ver metadatos">
                <IconButton
                  onClick={() => onViewMetadata?.(event.id)}
                  color="info"
                >
                  <Visibility />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Agregar metadatos">
                <IconButton
                  onClick={() => onAddMetadata?.(event.id)}
                  color="warning"
                >
                  <Assignment />
                </IconButton>
              </Tooltip>
            )}
            
            {event.status === 'ACTIVE' && (
              <Tooltip title="Completar evento">
                <IconButton
                  onClick={() => onComplete?.(event.id)}
                  color="success"
                >
                  <CheckCircle />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        }
      />

      <CardContent>
        <Grid container spacing={2}>
          {/* Información del evento */}
          <Grid item xs={12} md={6}>
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Información del Evento
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <Schedule fontSize="small" color="action" />
                <Typography variant="body2">
                  Inicio: {formatDateTime(event.startTime)}
                </Typography>
              </Box>
              
              {event.endTime && (
                <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                  <Schedule fontSize="small" color="action" />
                  <Typography variant="body2">
                    Fin: {formatDateTime(event.endTime)}
                  </Typography>
                </Box>
              )}
              
              <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                <PendingActions fontSize="small" color="action" />
                <Typography variant="body2">
                  Duración: {getEventDuration()}
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary">
              Cámaras detectadas: {event.detections.length}
            </Typography>
            
            {event.hasMetadata && event.metadata && (
              <Box mt={1}>
                <Typography variant="body2" color="text.secondary">
                  Empresa: {event.metadata.company.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Guía: {event.metadata.guideNumber}
                </Typography>
              </Box>
            )}
          </Grid>

          {/* Selector de cámara y video */}
          <Grid item xs={12} md={6}>
            <Box mb={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Seleccionar Cámara</InputLabel>
                <Select
                  value={selectedDetection?.id || ''}
                  onChange={(e) => {
                    const detection = event.detections.find(d => d.id === e.target.value);
                    setSelectedDetection(detection || null);
                  }}
                  label="Seleccionar Cámara"
                >
                  {event.detections.map((detection) => (
                    <MenuItem key={detection.id} value={detection.id}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Videocam fontSize="small" />
                        {detection.cameraName}
                        <Typography variant="caption" color="text.secondary">
                          ({formatDateTime(detection.timestamp)})
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {selectedDetection && (
              <Box>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Videocam fontSize="small" color="primary" />
                  <Typography variant="subtitle2">
                    {selectedDetection.cameraName}
                  </Typography>
                  <Chip
                    label={`${selectedDetection.confidence.toFixed(1)}%`}
                    size="small"
                    variant="outlined"
                    color="success"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" mb={1}>
                  {formatDateTime(selectedDetection.timestamp)}
                </Typography>
                
                <ButtonGroup size="small" variant="outlined">
                  <Button
                    startIcon={<PlayArrow />}
                    onClick={() => setVideoOpen(true)}
                  >
                    Ver Video
                  </Button>
                  {selectedDetection.thumbnailPath && (
                    <Button
                      startIcon={<Visibility />}
                      onClick={() => {
                        // Mostrar thumbnail en modal
                        window.open(`/uploads/${selectedDetection.thumbnailPath}`, '_blank');
                      }}
                    >
                      Thumbnail
                    </Button>
                  )}
                </ButtonGroup>
              </Box>
            )}
          </Grid>
        </Grid>

        {/* Línea de tiempo de detecciones */}
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" color="text.secondary" mb={1}>
          Línea de Tiempo de Detecciones
        </Typography>
        
        <Box display="flex" flexWrap="wrap" gap={1}>
          {event.detections
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            .map((detection, index) => (
              <Chip
                key={detection.id}
                label={`${index + 1}. ${detection.cameraName}`}
                size="small"
                variant={selectedDetection?.id === detection.id ? "filled" : "outlined"}
                color={selectedDetection?.id === detection.id ? "primary" : "default"}
                onClick={() => setSelectedDetection(detection)}
                clickable
              />
            ))}
        </Box>
      </CardContent>

      {/* Modal de video */}
      {videoOpen && selectedDetection && (
        <VideoPlayer
          open={videoOpen}
          onClose={() => setVideoOpen(false)}
          videoUrl={`/uploads/${selectedDetection.videoPath}`}
          thumbnailUrl={selectedDetection.thumbnailPath ? `/uploads/${selectedDetection.thumbnailPath}` : undefined}
          title={`${event.licensePlate} - ${selectedDetection.cameraName}`}
          subtitle={formatDateTime(selectedDetection.timestamp)}
        />
      )}
    </Card>
  );
};

export default VehicleEventCard;