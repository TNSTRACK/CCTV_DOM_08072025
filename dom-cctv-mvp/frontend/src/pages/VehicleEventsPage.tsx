// src/pages/VehicleEventsPage.tsx
// Página principal para gestionar eventos de vehículos multi-cámara

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Divider,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search,
  Clear,
  Refresh,
  ViewModule,
  TableRows,
  Timeline,
  DirectionsCar,
  Schedule,
  Videocam,
  Assignment,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

import VehicleEventCard from '../components/VehicleEvents/VehicleEventCard';
import VehicleEventsTable from '../components/VehicleEvents/VehicleEventsTable';
import { VehicleEvent, VehicleEventSearchFilters, VehicleEventStats } from '../types';

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

/**
 * Página para gestionar eventos de vehículos con seguimiento multi-cámara
 */
const VehicleEventsPage: React.FC = () => {
  const [events, setEvents] = useState<VehicleEvent[]>([]);
  const [stats, setStats] = useState<VehicleEventStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Filtros
  const [filters, setFilters] = useState<VehicleEventSearchFilters>({
    page: 1,
    limit: 20,
  });

  // Cargar eventos
  const loadEvents = async (newFilters?: VehicleEventSearchFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const searchFilters = { ...filters, ...newFilters };
      
      // Simular llamada a API
      // const response = await fetch('/api/vehicle-events?' + new URLSearchParams(searchFilters));
      // const data = await response.json();
      
      // Datos mock para desarrollo
      const mockEvents: VehicleEvent[] = [
        {
          id: 'event-1',
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
          id: 'event-2',
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

      setEvents(mockEvents);
      setStats(mockStats);
      setTotalCount(mockEvents.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadEvents();
  }, []);

  const handleFilterChange = (key: keyof VehicleEventSearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    setCurrentPage(1);
    loadEvents(newFilters);
  };

  const handleClearFilters = () => {
    const newFilters = { page: 1, limit: rowsPerPage };
    setFilters(newFilters);
    setCurrentPage(1);
    loadEvents(newFilters);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    setCurrentPage(page);
    loadEvents(newFilters);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    const newFilters = { ...filters, limit: newRowsPerPage, page: 1 };
    setFilters(newFilters);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
    loadEvents(newFilters);
  };

  const handleViewEvent = (eventId: string) => {
    console.log('Ver evento:', eventId);
    // Navegar a página de detalle del evento
  };

  const handleViewMetadata = (eventId: string) => {
    console.log('Ver metadatos:', eventId);
    // Abrir modal de metadatos
  };

  const handleAddMetadata = (eventId: string) => {
    console.log('Agregar metadatos:', eventId);
    // Abrir modal de agregar metadatos
  };

  const handleCompleteEvent = (eventId: string) => {
    console.log('Completar evento:', eventId);
    // Llamar API para completar evento
  };

  const handleViewVideo = (eventId: string, detectionId: string) => {
    console.log('Ver video:', eventId, detectionId);
    // Abrir modal de video
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box p={3}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Eventos de Vehículos
          </Typography>
          <Box display="flex" gap={1}>
            <Tooltip title="Actualizar">
              <IconButton onClick={() => loadEvents()} disabled={loading}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title={viewMode === 'cards' ? 'Ver tabla' : 'Ver tarjetas'}>
              <IconButton onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}>
                {viewMode === 'cards' ? <TableRows /> : <ViewModule />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Estadísticas */}
        {stats && (
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <DirectionsCar color="primary" />
                    <Box>
                      <Typography variant="h6">{stats.totalEvents}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Eventos
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Timeline color="success" />
                    <Box>
                      <Typography variant="h6">{stats.activeEvents}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Activos
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Schedule color="info" />
                    <Box>
                      <Typography variant="h6">{stats.eventsToday}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Hoy
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Assignment color="warning" />
                    <Box>
                      <Typography variant="h6">{stats.eventsWithMetadata}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Documentados
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Filtros */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Matrícula"
                size="small"
                value={filters.licensePlate || ''}
                onChange={(e) => handleFilterChange('licensePlate', e.target.value)}
                InputProps={{
                  startAdornment: <Search />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <DatePicker
                label="Fecha inicio"
                value={filters.startDate ? new Date(filters.startDate) : null}
                onChange={(date) => handleFilterChange('startDate', date?.toISOString())}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <DatePicker
                label="Fecha fin"
                value={filters.endDate ? new Date(filters.endDate) : null}
                onChange={(date) => handleFilterChange('endDate', date?.toISOString())}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  label="Estado"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="ACTIVE">Activo</MenuItem>
                  <MenuItem value="COMPLETED">Completado</MenuItem>
                  <MenuItem value="TIMEOUT">Timeout</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Metadatos</InputLabel>
                <Select
                  value={filters.hasMetadata !== undefined ? filters.hasMetadata.toString() : ''}
                  onChange={(e) => handleFilterChange('hasMetadata', e.target.value === 'true')}
                  label="Metadatos"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="true">Con metadatos</MenuItem>
                  <MenuItem value="false">Sin metadatos</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={1}>
              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={handleClearFilters}
                size="small"
                fullWidth
              >
                Limpiar
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Contenido principal */}
        <Box>
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {viewMode === 'cards' ? (
                <Box>
                  {events.map((event) => (
                    <VehicleEventCard
                      key={event.id}
                      event={event}
                      onViewMetadata={handleViewMetadata}
                      onAddMetadata={handleAddMetadata}
                      onComplete={handleCompleteEvent}
                    />
                  ))}
                </Box>
              ) : (
                <VehicleEventsTable
                  events={events}
                  totalCount={totalCount}
                  currentPage={currentPage}
                  rowsPerPage={rowsPerPage}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  onViewEvent={handleViewEvent}
                  onViewMetadata={handleViewMetadata}
                  onAddMetadata={handleAddMetadata}
                  onComplete={handleCompleteEvent}
                  onViewVideo={handleViewVideo}
                />
              )}
            </>
          )}
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default VehicleEventsPage;