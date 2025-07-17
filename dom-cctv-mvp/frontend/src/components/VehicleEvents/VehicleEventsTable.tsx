// src/components/VehicleEvents/VehicleEventsTable.tsx
// Tabla para mostrar eventos de vehículos con filtros y paginación

import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  Chip,
  IconButton,
  Typography,
  Tooltip,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Visibility,
  Assignment,
  CheckCircle,
  Videocam,
  MoreVert,
  PlayArrow,
  Schedule,
  DirectionsCar,
} from '@mui/icons-material';
import { VehicleEvent, VehicleEventSearchFilters } from '../../types';

interface VehicleEventsTableProps {
  events: VehicleEvent[];
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onViewEvent?: (eventId: string) => void;
  onViewMetadata?: (eventId: string) => void;
  onAddMetadata?: (eventId: string) => void;
  onComplete?: (eventId: string) => void;
  onViewVideo?: (eventId: string, detectionId: string) => void;
  rowsPerPage?: number;
}

/**
 * Tabla para mostrar eventos de vehículos con acciones
 */
const VehicleEventsTable: React.FC<VehicleEventsTableProps> = ({
  events,
  totalCount,
  currentPage,
  onPageChange,
  onRowsPerPageChange,
  onViewEvent,
  onViewMetadata,
  onAddMetadata,
  onComplete,
  onViewVideo,
  rowsPerPage = 20,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<VehicleEvent | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, vehicleEvent: VehicleEvent) => {
    setAnchorEl(event.currentTarget);
    setSelectedEvent(vehicleEvent);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEvent(null);
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
    });
  };

  const getEventDuration = (event: VehicleEvent) => {
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

  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage + 1); // MUI usa 0-based, backend usa 1-based
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <DirectionsCar fontSize="small" />
                  Matrícula
                </Box>
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <Schedule fontSize="small" />
                  Inicio
                </Box>
              </TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Duración</TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <Videocam fontSize="small" />
                  Cámaras
                </Box>
              </TableCell>
              <TableCell>Metadatos</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {event.licensePlate}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    {formatDateTime(event.startTime)}
                  </Typography>
                  {event.endTime && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      Fin: {formatDateTime(event.endTime)}
                    </Typography>
                  )}
                </TableCell>
                
                <TableCell>
                  <Chip
                    label={getStatusText(event.status)}
                    color={getStatusColor(event.status) as any}
                    size="small"
                  />
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    {getEventDuration(event)}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip
                      label={event.detections.length}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Typography variant="caption" color="text.secondary">
                      cámaras
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell>
                  {event.hasMetadata ? (
                    <Chip
                      label="Documentado"
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  ) : (
                    <Chip
                      label="Pendiente"
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  )}
                </TableCell>
                
                <TableCell>
                  <Box display="flex" alignItems="center">
                    {/* Acciones rápidas */}
                    <Tooltip title="Ver detalles">
                      <IconButton
                        size="small"
                        onClick={() => onViewEvent?.(event.id)}
                        color="primary"
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    
                    {event.hasMetadata ? (
                      <Tooltip title="Ver metadatos">
                        <IconButton
                          size="small"
                          onClick={() => onViewMetadata?.(event.id)}
                          color="info"
                        >
                          <Assignment />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Agregar metadatos">
                        <IconButton
                          size="small"
                          onClick={() => onAddMetadata?.(event.id)}
                          color="warning"
                        >
                          <Assignment />
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    {/* Menú de más acciones */}
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, event)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[10, 20, 50]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={currentPage - 1} // MUI usa 0-based, backend usa 1-based
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />

      {/* Menú contextual */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {selectedEvent && (
          <div>
            <MenuItem onClick={() => {
              onViewEvent?.(selectedEvent.id);
              handleMenuClose();
            }}>
              <ListItemIcon>
                <Visibility fontSize="small" />
              </ListItemIcon>
              <ListItemText>Ver detalles</ListItemText>
            </MenuItem>
            
            {selectedEvent.detections.length > 0 && (
              <MenuItem onClick={() => {
                onViewVideo?.(selectedEvent.id, selectedEvent.detections[0].id);
                handleMenuClose();
              }}>
                <ListItemIcon>
                  <PlayArrow fontSize="small" />
                </ListItemIcon>
                <ListItemText>Ver primer video</ListItemText>
              </MenuItem>
            )}
            
            {selectedEvent.status === 'ACTIVE' && (
              <MenuItem onClick={() => {
                onComplete?.(selectedEvent.id);
                handleMenuClose();
              }}>
                <ListItemIcon>
                  <CheckCircle fontSize="small" />
                </ListItemIcon>
                <ListItemText>Completar evento</ListItemText>
              </MenuItem>
            )}
          </div>
        )}
      </Menu>
    </Paper>
  );
};

export default VehicleEventsTable;