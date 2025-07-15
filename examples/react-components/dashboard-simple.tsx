// examples/react-components/dashboard-simple.tsx
// Dashboard básico para MVP con eventos recientes

import React from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  Chip,
  Box,
  Button
} from '@mui/material';
import { 
  VideoLibrary, 
  Description, 
  TrendingUp,
  Search
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalEvents: number;
  eventsWithMetadata: number;
  todayEvents: number;
  recentEvents: Array<{
    id: string;
    licensePlate: string;
    eventDateTime: string;
    cameraName: string;
    hasMetadata: boolean;
  }>;
}

export const DashboardSimple: React.FC = () => {
  const navigate = useNavigate();

  // PATRÓN: Query para estadísticas del dashboard
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: () => fetch('/api/dashboard/stats').then(res => res.json()),
    refetchInterval: 30000, // Actualizar cada 30 segundos
  });

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Cargando dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* PATRÓN: Header con título y acción principal */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Dashboard DOM CCTV
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Search />}
          onClick={() => navigate('/events/search')}
        >
          Buscar Eventos
        </Button>
      </Box>

      {/* PATRÓN: Cards de métricas principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <VideoLibrary color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Eventos Hoy</Typography>
              </Box>
              <Typography variant="h3" color="primary">
                {stats?.todayEvents || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUp color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Eventos</Typography>
              </Box>
              <Typography variant="h3" color="secondary">
                {stats?.totalEvents || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Description color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Con Metadatos</Typography>
              </Box>
              <Typography variant="h3" color="success.main">
                {stats?.eventsWithMetadata || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6">% Completado</Typography>
              </Box>
              <Typography variant="h3" color="info.main">
                {stats?.totalEvents 
                  ? Math.round((stats.eventsWithMetadata / stats.totalEvents) * 100)
                  : 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* PATRÓN: Lista de eventos recientes */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Eventos Recientes
              </Typography>
              <List>
                {stats?.recentEvents?.slice(0, 10).map((event) => (
                  <ListItem 
                    key={event.id}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'action.hover' }
                    }}
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" component="span">
                            {event.licensePlate}
                          </Typography>
                          <Chip 
                            label={event.hasMetadata ? 'Documentado' : 'Pendiente'}
                            color={event.hasMetadata ? 'success' : 'warning'}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(event.eventDateTime).toLocaleString('es-CL')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Cámara: {event.cameraName}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              
              {stats?.recentEvents?.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No hay eventos recientes
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* PATRÓN: Panel lateral con acciones rápidas */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Acciones Rápidas
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => navigate('/events/search')}
                >
                  Buscar por Matrícula
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => navigate('/events/search?filter=pending')}
                >
                  Ver Eventos Pendientes
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => navigate('/events/search?filter=today')}
                >
                  Eventos de Hoy
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
