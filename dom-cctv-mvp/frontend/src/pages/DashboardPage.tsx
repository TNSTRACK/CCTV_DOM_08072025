// src/pages/DashboardPage.tsx
// Página del dashboard principal con estadísticas y datos en tiempo real

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  Event as EventIcon,
  Today as TodayIcon,
  Description as MetadataIcon,
  Speed as ConfidenceIcon,
} from '@mui/icons-material';
import StatsCard from '@/components/Dashboard/StatsCard';
import RecentEvents from '@/components/Dashboard/RecentEvents';
import TopCameras from '@/components/Dashboard/TopCameras';
import EventDatePicker from '@/components/Dashboard/EventDatePicker';
import { useDashboardStats, useRecentEvents } from '@/hooks/useDashboard';
import { useNavigate } from 'react-router-dom';

/**
 * Página principal del dashboard con estadísticas y eventos
 */
const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  
  const { 
    data: stats, 
    isLoading: statsLoading, 
    error: statsError 
  } = useDashboardStats();
  
  const { 
    data: recentEvents, 
    isLoading: eventsLoading, 
    error: eventsError 
  } = useRecentEvents(10);

  const handleCalendarClick = () => {
    setDatePickerOpen(true);
  };

  const handleCloseDatePicker = () => {
    setDatePickerOpen(false);
  };

  const handleDocumentEvents = () => {
    navigate('/undocumented-events');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Panel de control del sistema ANPR - Vista general de eventos y estadísticas
        </Typography>
      </Box>

      {/* Error States */}
      {(statsError || eventsError) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error al cargar los datos del dashboard. Por favor, verifica la conexión.
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total de Eventos"
            value={stats?.totalEvents?.toLocaleString() || 0}
            subtitle="Eventos registrados"
            icon={EventIcon}
            color="primary"
            isLoading={statsLoading}
            onIconClick={handleCalendarClick}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Eventos Hoy"
            value={stats?.eventsToday?.toLocaleString() || 0}
            subtitle="Detecciones del día"
            icon={TodayIcon}
            color="success"
            isLoading={statsLoading}
            onIconClick={handleCalendarClick}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Con Metadatos"
            value={stats?.eventsWithMetadata?.toLocaleString() || 0}
            subtitle="Eventos documentados"
            icon={MetadataIcon}
            color="info"
            isLoading={statsLoading}
            onIconClick={handleDocumentEvents}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Confianza Promedio ANPR"
            value={stats?.averageConfidence ? `${stats.averageConfidence}%` : '0%'}
            subtitle="Precisión del sistema ANPR"
            icon={ConfidenceIcon}
            color="warning"
            isLoading={statsLoading}
          />
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Recent Events */}
        <Grid item xs={12} lg={8}>
          {eventsLoading ? (
            <Box sx={{ p: 3 }}>
              <Skeleton variant="rectangular" height={400} />
            </Box>
          ) : (
            <RecentEvents 
              events={recentEvents} 
              isLoading={eventsLoading}
            />
          )}
        </Grid>

        {/* Top Cameras */}
        <Grid item xs={12} lg={4}>
          {statsLoading ? (
            <Box sx={{ p: 3 }}>
              <Skeleton variant="rectangular" height={400} />
            </Box>
          ) : (
            <TopCameras 
              cameras={stats?.topCameras} 
              isLoading={statsLoading}
            />
          )}
        </Grid>
      </Grid>

      {/* Auto-refresh indicator */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Los datos se actualizan automáticamente cada 30 segundos
        </Typography>
      </Box>

      {/* Event Date Picker Modal */}
      <EventDatePicker
        open={datePickerOpen}
        onClose={handleCloseDatePicker}
      />
    </Container>
  );
};

export default DashboardPage;