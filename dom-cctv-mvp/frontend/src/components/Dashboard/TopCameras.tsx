// src/components/Dashboard/TopCameras.tsx
// Componente de cámaras más activas

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  CircularProgress,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  Videocam as VideocamIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';

interface TopCamera {
  name: string;
  count: number;
}

interface TopCamerasProps {
  cameras?: TopCamera[];
  isLoading?: boolean;
}

/**
 * Lista de cámaras más activas para el dashboard
 */
const TopCameras: React.FC<TopCamerasProps> = ({
  cameras = [],
  isLoading = false,
}) => {
  const maxCount = Math.max(...cameras.map(c => c.count), 1);

  const getProgressValue = (count: number) => {
    return (count / maxCount) * 100;
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title="Cámaras Más Activas"
        avatar={
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            <TrendingIcon />
          </Avatar>
        }
        action={
          <Typography variant="body2" color="text.secondary">
            Top 5
          </Typography>
        }
      />
      
      <CardContent sx={{ flex: 1, pt: 0, overflow: 'auto' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : cameras.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
            No hay datos de cámaras
          </Typography>
        ) : (
          <List sx={{ p: 0 }}>
            {cameras.map((camera, index) => (
              <ListItem
                key={camera.name}
                sx={{
                  px: 0,
                  py: 2,
                  flexDirection: 'column',
                  alignItems: 'stretch',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100%' }}>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      bgcolor: `hsl(${(index * 60) % 360}, 70%, 50%)`,
                      mr: 1.5,
                      fontSize: '0.75rem',
                    }}
                  >
                    <VideocamIcon fontSize="small" />
                  </Avatar>
                  
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight="medium">
                        {camera.name}
                      </Typography>
                    }
                    sx={{ flex: 1, m: 0 }}
                  />
                  
                  <Typography variant="body2" fontWeight="bold" color="primary.main">
                    {camera.count}
                  </Typography>
                </Box>
                
                <LinearProgress
                  variant="determinate"
                  value={getProgressValue(camera.count)}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      backgroundColor: `hsl(${(index * 60) % 360}, 70%, 50%)`,
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default TopCameras;