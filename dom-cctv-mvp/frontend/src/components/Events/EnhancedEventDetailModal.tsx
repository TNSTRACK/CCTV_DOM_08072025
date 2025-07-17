// src/components/Events/EnhancedEventDetailModal.tsx
// Modal mejorado que soporta eventos legacy y multi-cámara

import React, { useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  ButtonGroup,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  DirectionsCar as CarIcon,
  Videocam as CameraIcon,
  Schedule as TimeIcon,
  Speed as ConfidenceIcon,
  Description as MetadataIcon,
  PlayArrow as PlayIcon,
  Timeline as TimelineIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckIcon,
  PendingActions as PendingIcon,
} from '@mui/icons-material';
import { Event } from '@/hooks/useEvents';
import { VehicleEvent, Detection } from '../../types';
import MultiCameraVideoModal from '../Video/MultiCameraVideoModal';

interface EnhancedEventDetailModalProps {
  event: Event | null;
  vehicleEvent?: VehicleEvent | null;
  open: boolean;
  onClose: () => void;
  onPlayVideo?: (event: Event) => void;
  onViewMetadata?: (eventId: string) => void;
  onAddMetadata?: (eventId: string) => void;
  onCompleteEvent?: (eventId: string) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`event-detail-tabpanel-${index}`}
      aria-labelledby={`event-detail-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

/**
 * Modal mejorado con soporte para eventos legacy y multi-cámara
 */
const EnhancedEventDetailModal: React.FC<EnhancedEventDetailModalProps> = ({
  event,
  vehicleEvent,
  open,
  onClose,
  onPlayVideo,
  onViewMetadata,
  onAddMetadata,
  onCompleteEvent,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  
  // Determinar si es un evento multi-cámara o legacy
  const isMultiCamera = vehicleEvent && vehicleEvent.detections.length > 1;
  const currentEvent = vehicleEvent || event;
  
  // Inicializar detección seleccionada
  React.useEffect(() => {
    if (vehicleEvent && vehicleEvent.detections.length > 0) {
      setSelectedDetection(vehicleEvent.detections[0]);
    }
  }, [vehicleEvent]);
  
  // Return early después de todos los hooks
  if (!currentEvent) return null;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'success';
    if (confidence >= 85) return 'warning';
    return 'error';
  };

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
      second: '2-digit',
    });
  };

  const getEventDuration = () => {
    if (!vehicleEvent || !vehicleEvent.endTime) return 'En progreso';
    
    const start = new Date(vehicleEvent.startTime);
    const end = new Date(vehicleEvent.endTime);
    const diffMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} min`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  };

  const handlePlayVideo = () => {
    setVideoModalOpen(true);
  };

  const handleCloseVideoModal = () => {
    setVideoModalOpen(false);
  };

  const renderLegacyEventTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Información Principal
            </Typography>
            <Typography variant="h4" color="primary.main" gutterBottom>
              {event?.licensePlate}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <TimeIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {event && formatDateTime(event.eventDateTime)}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <CameraIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {event?.cameraName}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Confianza y Estado
            </Typography>
            <Box mb={2}>
              <Chip
                label={`${event?.confidence}%`}
                color={getConfidenceColor(event?.confidence || 0)}
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
            <Box>
              {event?.hasMetadata ? (
                <Chip
                  icon={<CheckIcon />}
                  label="Documentado"
                  color="success"
                  variant="outlined"
                />
              ) : (
                <Chip
                  icon={<PendingIcon />}
                  label="Sin documentar"
                  color="warning"
                  variant="outlined"
                />
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderMultiCameraTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Información del Evento
            </Typography>
            <Typography variant="h4" color="primary.main" gutterBottom>
              {vehicleEvent?.licensePlate}
            </Typography>
            
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <TimeIcon fontSize="small" color="action" />
              <Typography variant="body2">
                Inicio: {vehicleEvent && formatDateTime(vehicleEvent.startTime)}
              </Typography>
            </Box>
            
            {vehicleEvent?.endTime && (
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <TimeIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  Fin: {formatDateTime(vehicleEvent.endTime)}
                </Typography>
              </Box>
            )}
            
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <PendingIcon fontSize="small" color="action" />
              <Typography variant="body2">
                Duración: {getEventDuration()}
              </Typography>
            </Box>
            
            <Chip
              label={vehicleEvent && getStatusText(vehicleEvent.status)}
              color={vehicleEvent && getStatusColor(vehicleEvent.status) as any}
              size="small"
            />
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Seleccionar Cámara
            </Typography>
            
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Cámara</InputLabel>
              <Select
                value={selectedDetection?.id || ''}
                onChange={(e) => {
                  const detection = vehicleEvent?.detections.find(d => d.id === e.target.value);
                  setSelectedDetection(detection || null);
                }}
                label="Cámara"
              >
                {vehicleEvent?.detections.map((detection) => (
                  <MenuItem key={detection.id} value={detection.id}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CameraIcon fontSize="small" />
                      {detection.cameraName}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {selectedDetection && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {formatDateTime(selectedDetection.timestamp)}
                </Typography>
                <Chip
                  label={`${selectedDetection.confidence.toFixed(1)}%`}
                  color={getConfidenceColor(selectedDetection.confidence)}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Box>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<PlayIcon />}
                    onClick={handlePlayVideo}
                  >
                    Ver Video
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Línea de Tiempo de Detecciones
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {vehicleEvent?.detections
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
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" component="div">
              {isMultiCamera ? 'Evento Multi-Cámara' : 'Detalle del Evento'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isMultiCamera 
                ? `${vehicleEvent?.detections.length} detecciones de cámaras`
                : `ID: ${event?.id}`
              }
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
          {isMultiCamera ? (
            <>
              <Alert severity="info" sx={{ mb: 2 }}>
                Este evento incluye detecciones de múltiples cámaras. 
                Selecciona una cámara para ver el video correspondiente.
              </Alert>
              {renderMultiCameraTab()}
            </>
          ) : (
            renderLegacyEventTab()
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Cerrar
          </Button>
          
          {isMultiCamera && vehicleEvent ? (
            <>
              {vehicleEvent.hasMetadata ? (
                <Button
                  variant="outlined"
                  color="info"
                  startIcon={<ViewIcon />}
                  onClick={() => onViewMetadata?.(vehicleEvent.id)}
                >
                  Ver Metadatos
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<MetadataIcon />}
                  onClick={() => onAddMetadata?.(vehicleEvent.id)}
                >
                  Agregar Metadatos
                </Button>
              )}
              
              {vehicleEvent.status === 'ACTIVE' && (
                <Button
                  variant="outlined"
                  color="success"
                  startIcon={<CheckIcon />}
                  onClick={() => onCompleteEvent?.(vehicleEvent.id)}
                >
                  Completar Evento
                </Button>
              )}
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayIcon />}
                onClick={handlePlayVideo}
                disabled={!selectedDetection}
              >
                Ver Video
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayIcon />}
                onClick={handlePlayVideo}
              >
                Reproducir Video
              </Button>
              <Button
                variant="outlined"
                color="info"
                disabled={!event?.hasMetadata}
              >
                Ver Metadatos
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Modal de Video Multi-Cámara */}
      <MultiCameraVideoModal
        event={event}
        vehicleEvent={vehicleEvent}
        open={videoModalOpen}
        onClose={handleCloseVideoModal}
        initialDetectionId={selectedDetection?.id}
      />
    </>
  );
};

export default EnhancedEventDetailModal;