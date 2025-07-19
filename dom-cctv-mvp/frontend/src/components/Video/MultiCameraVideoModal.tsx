// src/components/Video/MultiCameraVideoModal.tsx
// Modal de reproductor de video con selector de cámara integrado

import React, { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  DirectionsCar as CarIcon,
  Schedule as TimeIcon,
  Videocam as CameraIcon,
  Speed as ConfidenceIcon,
  SwitchVideo as SwitchIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import SimpleVideoPlayer from './SimpleVideoPlayer';
import { Event } from '@/hooks/useEvents';
import { VehicleEvent, Detection } from '../../types';

interface MultiCameraVideoModalProps {
  event: Event | null;
  vehicleEvent?: VehicleEvent | null;
  open: boolean;
  onClose: () => void;
  initialDetectionId?: string;
  selectedDetectionId?: string; // Nueva prop para sincronización en tiempo real
}

/**
 * Modal de reproductor de video con selector de cámara integrado
 */
const MultiCameraVideoModal: React.FC<MultiCameraVideoModalProps> = ({
  event,
  vehicleEvent,
  open,
  onClose,
  initialDetectionId,
  selectedDetectionId,
}) => {
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);
  const [videoKey, setVideoKey] = useState(0); // Para forzar re-render del video

  // Determinar si es evento multi-cámara
  const isMultiCamera = vehicleEvent && vehicleEvent.detections.length > 1;
  const currentEvent = vehicleEvent || event;

  // Inicializar detección seleccionada
  useEffect(() => {
    if (vehicleEvent && vehicleEvent.detections.length > 0) {
      // Si hay ID inicial específico, buscar esa detección
      if (initialDetectionId) {
        const detection = vehicleEvent.detections.find(d => d.id === initialDetectionId);
        if (detection) {
          setSelectedDetection(detection);
          return;
        }
      }
      
      // Si no, usar la primera detección
      setSelectedDetection(vehicleEvent.detections[0]);
    } else if (event) {
      // Para eventos legacy, crear detección falsa
      const legacyDetection: Detection = {
        id: `legacy-${event.id}`,
        cameraName: event.cameraName,
        timestamp: event.eventDateTime,
        videoPath: event.videoFilename,
        thumbnailPath: event.thumbnailPath,
        confidence: event.confidence,
      };
      setSelectedDetection(legacyDetection);
    }
  }, [vehicleEvent, event, initialDetectionId]);

  // Escuchar cambios en selectedDetectionId desde el modal padre
  useEffect(() => {
    if (selectedDetectionId && vehicleEvent) {
      const detection = vehicleEvent.detections.find(d => d.id === selectedDetectionId);
      if (detection && detection.id !== selectedDetection?.id) {
        setSelectedDetection(detection);
        setVideoKey(prev => prev + 1); // Forzar re-render del video
      }
    }
  }, [selectedDetectionId, vehicleEvent]);

  // Cambiar cámara seleccionada
  const handleCameraChange = (detectionId: string) => {
    const detection = vehicleEvent?.detections.find(d => d.id === detectionId);
    if (detection) {
      setSelectedDetection(detection);
      setVideoKey(prev => prev + 1); // Forzar re-render del video
    }
  };

  if (!currentEvent || !selectedDetection) return null;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'success';
    if (confidence >= 85) return 'warning';
    return 'error';
  };

  // Base URL para archivos estáticos
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : 'http://localhost:3001';
  
  const videoUrl = `${baseUrl}/uploads/${selectedDetection.videoPath}`;
  const thumbnailUrl = selectedDetection.thumbnailPath ? `${baseUrl}/uploads/${selectedDetection.thumbnailPath}` : undefined;
  
  // Debug log (removed to prevent infinite loops)

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

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
            Reproductor de Video - {isMultiCamera ? (vehicleEvent?.licensePlate) : event?.licensePlate}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isMultiCamera ? `Evento Multi-Cámara • ${vehicleEvent?.detections.length} detecciones` : 'Evento Individual'}
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
        {/* Selector de Cámara */}
        {isMultiCamera && (
          <Paper sx={{ m: 2, p: 2, bgcolor: 'primary.50', borderLeft: 4, borderColor: 'primary.main' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <SwitchIcon color="primary" />
              <Typography variant="subtitle2" color="primary" fontWeight="bold">
                Seleccionar Cámara
              </Typography>
            </Box>
            
            <FormControl fullWidth size="small">
              <InputLabel>Cámara</InputLabel>
              <Select
                value={selectedDetection.id}
                onChange={(e) => handleCameraChange(e.target.value)}
                label="Cámara"
              >
                {vehicleEvent?.detections.map((detection, index) => (
                  <MenuItem key={detection.id} value={detection.id}>
                    <Box display="flex" alignItems="center" gap={1} width="100%">
                      <CameraIcon fontSize="small" />
                      <Box>
                        <Typography variant="body2">
                          {index + 1}. {detection.cameraName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDateTime(detection.timestamp)} • {detection.confidence.toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {/* Línea de tiempo mini */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                Línea de Tiempo:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                {vehicleEvent?.detections
                  .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                  .map((detection, index) => (
                    <Chip
                      key={detection.id}
                      label={`${index + 1}`}
                      size="small"
                      variant={selectedDetection.id === detection.id ? "filled" : "outlined"}
                      color={selectedDetection.id === detection.id ? "primary" : "default"}
                      onClick={() => handleCameraChange(detection.id)}
                      clickable
                      sx={{ minWidth: 32 }}
                    />
                  ))}
              </Box>
            </Box>
          </Paper>
        )}

        {/* Información del evento actual */}
        <Box sx={{ px: 2, py: 1, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TimeIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {formatDateTime(selectedDetection.timestamp)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CameraIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {selectedDetection.cameraName}
              </Typography>
            </Box>

            <Chip
              icon={<ConfidenceIcon />}
              label={`Confianza: ${selectedDetection.confidence.toFixed(1)}%`}
              color={getConfidenceColor(selectedDetection.confidence)}
              size="small"
            />

            {(vehicleEvent?.hasMetadata || event?.hasMetadata) && (
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
            key={videoKey} // Forzar re-render al cambiar cámara
            src={videoUrl}
            title={`${selectedDetection.cameraName} - ${isMultiCamera ? vehicleEvent?.licensePlate : event?.licensePlate}`}
          />

          <Divider sx={{ my: 2 }} />

          {/* Información técnica */}
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
                  {selectedDetection.videoPath}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" color="text.secondary">
                  ID de Detección
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                  {selectedDetection.id}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Tipo de Evento
                </Typography>
                <Typography variant="body2">
                  {isMultiCamera ? 'Multi-Cámara' : 'Individual'}
                </Typography>
              </Box>
              
              {isMultiCamera && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Duración Total
                  </Typography>
                  <Typography variant="body2">
                    {vehicleEvent?.endTime ? (
                      (() => {
                        const duration = new Date(vehicleEvent.endTime).getTime() - new Date(vehicleEvent.startTime).getTime();
                        const minutes = Math.floor(duration / (1000 * 60));
                        return `${minutes} minutos`;
                      })()
                    ) : 'En progreso'}
                  </Typography>
                </Box>
              )}
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
          disabled={!(vehicleEvent?.hasMetadata || event?.hasMetadata)}
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

export default MultiCameraVideoModal;