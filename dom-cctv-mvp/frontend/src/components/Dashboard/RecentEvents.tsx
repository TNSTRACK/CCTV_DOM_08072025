// src/components/Dashboard/RecentEvents.tsx
// Componente de eventos recientes

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Chip,
  Box,
  CircularProgress,
  Avatar,
  Divider,
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  Videocam as CameraIcon,
  Description as MetadataIcon,
  Schedule as TimeIcon,
} from '@mui/icons-material';
import { RecentEvent } from '@/hooks/useDashboard';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface RecentEventsProps {
  events?: RecentEvent[];
  isLoading?: boolean;
}

/**
 * Lista de eventos recientes para el dashboard
 */
const RecentEvents: React.FC<RecentEventsProps> = ({
  events = [],
  isLoading = false,
}) => {
  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: es,
      });
    } catch {
      return 'Hace un momento';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'success';
    if (confidence >= 85) return 'warning';
    return 'error';
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title="Eventos Recientes"
        avatar={
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <TimeIcon />
          </Avatar>
        }
        action={
          <Typography variant="body2" color="text.secondary">
            Últimos 10 eventos
          </Typography>
        }
      />
      
      <CardContent sx={{ flex: 1, pt: 0, overflow: 'auto' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : events.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
            No hay eventos recientes
          </Typography>
        ) : (
          <List sx={{ p: 0 }}>
            {events.map((event, index) => (
              <React.Fragment key={event.id}>
                <ListItem
                  sx={{
                    px: 0,
                    py: 1.5,
                    alignItems: 'flex-start',
                  }}
                >
                  <ListItemIcon sx={{ mt: 0.5, minWidth: 40 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'primary.light',
                        fontSize: '0.875rem',
                      }}
                    >
                      <CarIcon fontSize="small" />
                    </Avatar>
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {event.licensePlate}
                        </Typography>
                        <Chip
                          size="small"
                          label={`${event.confidence}%`}
                          color={getConfidenceColor(event.confidence)}
                          sx={{ height: 20, fontSize: '0.75rem' }}
                        />
                        {event.hasMetadata && (
                          <MetadataIcon
                            sx={{
                              fontSize: 16,
                              color: 'success.main',
                              ml: 0.5,
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={`📹 ${event.cameraName} • ${formatTimeAgo(event.eventDateTime)}`}
                  />
                </ListItem>
                
                {index < events.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentEvents;