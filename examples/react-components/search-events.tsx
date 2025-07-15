// examples/react-components/search-events.tsx
// Componente de búsqueda de eventos para MVP

import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Grid, 
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Chip,
  Pagination,
  IconButton,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Search, Visibility, Description } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';

interface SearchFilters {
  licensePlate?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  page?: number;
  limit?: number;
}

interface EventResult {
  id: string;
  licensePlate: string;
  eventDateTime: string;
  cameraName: string;
  hasMetadata: boolean;
  confidence: number;
  thumbnailPath?: string;
}

interface SearchResponse {
  events: EventResult[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export const SearchEvents: React.FC = () => {
  const navigate = useNavigate();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    page: 1,
    limit: 25,
  });

  // PATRÓN: Formulario de búsqueda con React Hook Form
  const { control, handleSubmit, watch, reset } = useForm<SearchFilters>({
    defaultValues: {
      licensePlate: '',
      startDate: null,
      endDate: null,
    },
  });

  // PATRÓN: Query con filtros dinámicos
  const { data, isLoading, error, refetch } = useQuery<SearchResponse>({
    queryKey: ['events-search', searchFilters],
    queryFn: () => {
      const params = new URLSearchParams();
      
      if (searchFilters.licensePlate) {
        params.append('licensePlate', searchFilters.licensePlate);
      }
      if (searchFilters.startDate) {
        params.append('startDate', searchFilters.startDate.toISOString());
      }
      if (searchFilters.endDate) {
        params.append('endDate', searchFilters.endDate.toISOString());
      }
      params.append('page', (searchFilters.page || 1).toString());
      params.append('limit', (searchFilters.limit || 25).toString());

      return fetch(`/api/events/search?${params.toString()}`)
        .then(res => res.json());
    },
    enabled: false, // Solo ejecutar cuando se haga búsqueda manual
  });

  // PATRÓN: Handler de búsqueda
  const onSearch = (formData: SearchFilters) => {
    setSearchFilters({
      ...formData,
      page: 1,
      limit: 25,
    });
    refetch();
  };

  // PATRÓN: Handler de paginación
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setSearchFilters(prev => ({ ...prev, page: value }));
    refetch();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* PATRÓN: Header con título */}
      <Typography variant="h4" component="h1" gutterBottom>
        Búsqueda de Eventos
      </Typography>

      {/* PATRÓN: Formulario de filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSearch)}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <Controller
                  name="licensePlate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Matrícula"
                      placeholder="Ej: ABC123 o ABCD12"
                      fullWidth
                      size="small"
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Fecha Desde"
                      slotProps={{
                        textField: { 
                          size: 'small',
                          fullWidth: true 
                        }
                      }}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Fecha Hasta"
                      slotProps={{
                        textField: { 
                          size: 'small',
                          fullWidth: true 
                        }
                      }}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} md={2}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Search />}
                    fullWidth
                  >
                    Buscar
                  </Button>
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button
                type="button"
                variant="outlined"
                size="small"
                onClick={() => {
                  reset();
                  setSearchFilters({ page: 1, limit: 25 });
                }}
              >
                Limpiar
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* PATRÓN: Manejo de estados de loading y error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al buscar eventos. Intente nuevamente.
        </Alert>
      )}

      {/* PATRÓN: Tabla de resultados */}
      <Card>
        <CardContent>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Resultados de Búsqueda
            </Typography>
            {data && (
              <Typography variant="body2" color="text.secondary">
                {data.totalCount} eventos encontrados
              </Typography>
            )}
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Matrícula</TableCell>
                  <TableCell>Fecha/Hora</TableCell>
                  <TableCell>Cámara</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Confianza</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography>Buscando eventos...</Typography>
                    </TableCell>
                  </TableRow>
                ) : data?.events?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="text.secondary">
                        No se encontraron eventos con los filtros aplicados
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.events?.map((event) => (
                    <TableRow 
                      key={event.id} 
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {event.licensePlate}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(event.eventDateTime).toLocaleString('es-CL')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {event.cameraName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={event.hasMetadata ? 'Documentado' : 'Pendiente'}
                          color={event.hasMetadata ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {event.confidence}%
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/events/${event.id}`);
                            }}
                          >
                            <Visibility />
                          </IconButton>
                          {!event.hasMetadata && (
                            <IconButton 
                              size="small" 
                              color="secondary"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/events/${event.id}/metadata`);
                              }}
                            >
                              <Description />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* PATRÓN: Paginación */}
          {data && data.totalPages > 1 && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={data.totalPages}
                page={data.currentPage}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
