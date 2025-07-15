// src/components/Events/EventsFilters.tsx
// Componente de filtros para búsqueda de eventos

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Chip,
  Typography,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { EventSearchParams } from '@/hooks/useEvents';

interface EventsFiltersProps {
  filters: EventSearchParams;
  onFiltersChange: (filters: EventSearchParams) => void;
  isLoading?: boolean;
}

/**
 * Componente de filtros avanzados para eventos
 */
const EventsFilters: React.FC<EventsFiltersProps> = ({
  filters,
  onFiltersChange,
  isLoading = false,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<EventSearchParams>(filters);

  const handleFilterChange = (key: keyof EventSearchParams, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyFilters = () => {
    onFiltersChange({
      ...localFilters,
      page: 1, // Reset a la primera página al aplicar filtros
    });
  };

  const handleClearFilters = () => {
    const clearedFilters = { page: 1, limit: filters.limit || 25 };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => 
      key !== 'page' && key !== 'limit' && value !== undefined && value !== null && value !== ''
    ).length;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        {/* Header with quick search */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TextField
            placeholder="Buscar por matrícula..."
            value={localFilters.licensePlate || ''}
            onChange={(e) => handleFilterChange('licensePlate', e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
            }}
            sx={{ flex: 1 }}
            size="small"
          />
          
          <Button
            variant="contained"
            onClick={handleApplyFilters}
            disabled={isLoading}
            startIcon={<SearchIcon />}
          >
            Buscar
          </Button>
          
          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{ ml: 1 }}
          >
            <FilterIcon />
            {activeFiltersCount > 0 && (
              <Chip
                label={activeFiltersCount}
                size="small"
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  minWidth: 20,
                  height: 20,
                }}
              />
            )}
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        {/* Advanced filters */}
        <Collapse in={expanded}>
          <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle2" gutterBottom>
              Filtros Avanzados
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {/* Date filters */}
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Fecha desde"
                  value={localFilters.startDate ? new Date(localFilters.startDate) : null}
                  onChange={(date) => handleFilterChange('startDate', date?.toISOString())}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Fecha hasta"
                  value={localFilters.endDate ? new Date(localFilters.endDate) : null}
                  onChange={(date) => handleFilterChange('endDate', date?.toISOString())}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>

              {/* Camera filter */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Cámara"
                  value={localFilters.cameraName || ''}
                  onChange={(e) => handleFilterChange('cameraName', e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="Nombre de cámara"
                />
              </Grid>

              {/* Metadata filter */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Metadatos</InputLabel>
                  <Select
                    value={localFilters.hasMetadata ?? ''}
                    onChange={(e) => handleFilterChange('hasMetadata', e.target.value === '' ? undefined : e.target.value === 'true')}
                    label="Metadatos"
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="true">Con metadatos</MenuItem>
                    <MenuItem value="false">Sin metadatos</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Action buttons */}
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                startIcon={<ClearIcon />}
                disabled={activeFiltersCount === 0}
              >
                Limpiar Filtros
              </Button>
              
              <Button
                variant="contained"
                onClick={handleApplyFilters}
                disabled={isLoading}
                startIcon={<SearchIcon />}
              >
                Aplicar Filtros
              </Button>
            </Box>
          </Box>
        </Collapse>

        {/* Active filters display */}
        {activeFiltersCount > 0 && (
          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              Filtros activos:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {filters.licensePlate && (
                <Chip
                  label={`Matrícula: ${filters.licensePlate}`}
                  size="small"
                  onDelete={() => {
                    const newFilters = { ...filters };
                    delete newFilters.licensePlate;
                    onFiltersChange(newFilters);
                  }}
                />
              )}
              {filters.startDate && (
                <Chip
                  label={`Desde: ${new Date(filters.startDate).toLocaleDateString()}`}
                  size="small"
                  onDelete={() => {
                    const newFilters = { ...filters };
                    delete newFilters.startDate;
                    onFiltersChange(newFilters);
                  }}
                />
              )}
              {filters.endDate && (
                <Chip
                  label={`Hasta: ${new Date(filters.endDate).toLocaleDateString()}`}
                  size="small"
                  onDelete={() => {
                    const newFilters = { ...filters };
                    delete newFilters.endDate;
                    onFiltersChange(newFilters);
                  }}
                />
              )}
              {filters.cameraName && (
                <Chip
                  label={`Cámara: ${filters.cameraName}`}
                  size="small"
                  onDelete={() => {
                    const newFilters = { ...filters };
                    delete newFilters.cameraName;
                    onFiltersChange(newFilters);
                  }}
                />
              )}
              {filters.hasMetadata !== undefined && (
                <Chip
                  label={`Metadatos: ${filters.hasMetadata ? 'Con metadatos' : 'Sin metadatos'}`}
                  size="small"
                  onDelete={() => {
                    const newFilters = { ...filters };
                    delete newFilters.hasMetadata;
                    onFiltersChange(newFilters);
                  }}
                />
              )}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default EventsFilters;