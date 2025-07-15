// src/components/Events/EventsTable.tsx
// Tabla de eventos con funcionalidades avanzadas

import React from 'react';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Avatar,
  Typography,
  Box,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  PlayArrow as PlayIcon,
  Description as MetadataIcon,
  DirectionsCar as CarIcon,
  Videocam as CameraIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  UnfoldMore as UnfoldMoreIcon,
} from '@mui/icons-material';
import { Event, EventsResponse, EventSearchParams } from '@/hooks/useEvents';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface EventsTableProps {
  data?: EventsResponse;
  filters: EventSearchParams;
  onFiltersChange: (filters: EventSearchParams) => void;
  onEventView?: (event: Event) => void;
  onEventPlay?: (event: Event) => void;
  isLoading?: boolean;
  error?: any;
}

/**
 * Tabla completa de eventos con paginación y acciones
 */
const EventsTable: React.FC<EventsTableProps> = ({
  data,
  filters,
  onFiltersChange,
  onEventView,
  onEventPlay,
  isLoading = false,
  error,
}) => {
  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: es,
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'success';
    if (confidence >= 85) return 'warning';
    return 'error';
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    onFiltersChange({
      ...filters,
      page: newPage + 1, // Material-UI usa índice 0, backend usa índice 1
    });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      page: 1,
      limit: parseInt(event.target.value, 10),
    });
  };

  const handleSort = (sortBy: 'licensePlate' | 'eventDateTime') => {
    const currentSortBy = filters.sortBy;
    const currentSortOrder = filters.sortOrder;
    
    let newSortOrder: 'asc' | 'desc' = 'asc';
    
    if (currentSortBy === sortBy && currentSortOrder === 'asc') {
      newSortOrder = 'desc';
    }
    
    onFiltersChange({
      ...filters,
      sortBy,
      sortOrder: newSortOrder,
      page: 1, // Reset to first page when sorting
    });
  };

  const getSortIcon = (column: 'licensePlate' | 'eventDateTime') => {
    if (filters.sortBy !== column) {
      return <UnfoldMoreIcon sx={{ fontSize: 16, color: 'text.secondary' }} />;
    }
    
    return filters.sortOrder === 'asc' ? 
      <ArrowUpIcon sx={{ fontSize: 16, color: 'primary.main' }} /> : 
      <ArrowDownIcon sx={{ fontSize: 16, color: 'primary.main' }} />;
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Error al cargar los eventos: {error.message || 'Error desconocido'}
      </Alert>
    );
  }

  return (
    <Card sx={{ 
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      border: '1px solid #e2e8f0',
    }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ 
                pl: 3,
                borderBottom: '2px solid #e2e8f0',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(37, 99, 235, 0.04)',
                },
                transition: 'background-color 0.2s ease-in-out',
              }}
              onClick={() => handleSort('licensePlate')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="inherit" component="span">
                    Matrícula
                  </Typography>
                  {getSortIcon('licensePlate')}
                </Box>
              </TableCell>
              <TableCell sx={{ 
                borderBottom: '2px solid #e2e8f0',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(37, 99, 235, 0.04)',
                },
                transition: 'background-color 0.2s ease-in-out',
              }}
              onClick={() => handleSort('eventDateTime')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="inherit" component="span">
                    Fecha/Hora
                  </Typography>
                  {getSortIcon('eventDateTime')}
                </Box>
              </TableCell>
              <TableCell sx={{ borderBottom: '2px solid #e2e8f0' }}>
                Cámara
              </TableCell>
              <TableCell sx={{ borderBottom: '2px solid #e2e8f0' }}>
                Confianza
              </TableCell>
              <TableCell sx={{ borderBottom: '2px solid #e2e8f0' }}>
                Estado
              </TableCell>
              <TableCell align="center" sx={{ 
                pr: 3,
                borderBottom: '2px solid #e2e8f0',
              }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Cargando eventos...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : !data?.events || data.events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No se encontraron eventos con los filtros aplicados
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.events.map((event) => (
                <TableRow 
                  key={event.id} 
                  hover
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(37, 99, 235, 0.04)',
                      '& .MuiAvatar-root': {
                        transform: 'scale(1.05)',
                      },
                    },
                  }}
                >
                  {/* License Plate */}
                  <TableCell sx={{ pl: 3, borderBottom: 'none' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ 
                        width: 40, 
                        height: 40, 
                        bgcolor: 'primary.main',
                        background: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)',
                        transition: 'transform 0.2s ease-in-out',
                      }}>
                        <CarIcon fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                          {event.licensePlate}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          #{event.id.slice(-8)}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Date/Time */}
                  <TableCell sx={{ borderBottom: 'none' }}>
                    <Box>
                      <Typography variant="body2" fontWeight="500">
                        {new Date(event.eventDateTime).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(event.eventDateTime).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })} · {formatTimeAgo(event.eventDateTime)}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Camera */}
                  <TableCell sx={{ borderBottom: 'none' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        bgcolor: 'rgba(37, 99, 235, 0.1)',
                      }}>
                        <CameraIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                      </Box>
                      <Typography variant="body2" fontWeight="500">
                        {event.cameraName}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Confidence */}
                  <TableCell sx={{ borderBottom: 'none' }}>
                    <Chip
                      label={`${event.confidence}%`}
                      color={getConfidenceColor(event.confidence)}
                      size="small"
                      sx={{ 
                        fontWeight: 700,
                        borderRadius: '12px',
                        height: '28px',
                        fontSize: '0.75rem',
                        minWidth: '60px',
                      }}
                    />
                  </TableCell>

                  {/* Status */}
                  <TableCell sx={{ borderBottom: 'none' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {event.hasMetadata ? (
                        <Chip
                          icon={<MetadataIcon sx={{ fontSize: '16px !important' }} />}
                          label="Documentado"
                          color="success"
                          size="small"
                          variant="filled"
                          sx={{
                            borderRadius: '12px',
                            height: '28px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        />
                      ) : (
                        <Chip
                          label="Sin documentar"
                          color="default"
                          size="small"
                          variant="outlined"
                          sx={{
                            borderRadius: '12px',
                            height: '28px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            borderColor: '#cbd5e1',
                            color: '#64748b',
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="center" sx={{ pr: 3, borderBottom: 'none' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Tooltip title="Ver detalles">
                        <IconButton
                          size="small"
                          onClick={() => onEventView?.(event)}
                          sx={{
                            color: 'primary.main',
                            bgcolor: 'rgba(37, 99, 235, 0.08)',
                            '&:hover': {
                              bgcolor: 'rgba(37, 99, 235, 0.16)',
                              transform: 'scale(1.05)',
                            },
                            transition: 'all 0.2s ease-in-out',
                          }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Reproducir video">
                        <IconButton
                          size="small"
                          onClick={() => onEventPlay?.(event)}
                          sx={{
                            color: 'secondary.main',
                            bgcolor: 'rgba(124, 58, 237, 0.08)',
                            '&:hover': {
                              bgcolor: 'rgba(124, 58, 237, 0.16)',
                              transform: 'scale(1.05)',
                            },
                            transition: 'all 0.2s ease-in-out',
                          }}
                        >
                          <PlayIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {data && data.totalCount > 0 && (
        <TablePagination
          component="div"
          count={data.totalCount}
          page={(filters.page || 1) - 1} // Material-UI usa índice 0
          onPageChange={handleChangePage}
          rowsPerPage={filters.limit || 25}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
          labelRowsPerPage="Eventos por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
          showFirstButton
          showLastButton
        />
      )}
    </Card>
  );
};

export default EventsTable;