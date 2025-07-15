// src/components/Layout/AuthLayout.tsx
// Layout para páginas de autenticación

import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { 
  Videocam as VideocamIcon,
  Security as SecurityIcon 
} from '@mui/icons-material';

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout para páginas de autenticación (login, registro, etc.)
 */
const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: 'grey.50',
        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container component="main" maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
        <Grid container spacing={4} sx={{ height: '100%' }}>
          {/* Panel izquierdo - Información */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
                color: 'white',
                px: 4,
              }}
            >
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <VideocamIcon sx={{ fontSize: 48, mr: 2 }} />
                  <Typography variant="h3" component="h1" fontWeight="bold">
                    DOM CCTV
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ mb: 3, opacity: 0.9 }}>
                  Sistema de Videovigilancia MVP
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
                  Plataforma avanzada para la gestión y documentación de eventos de 
                  videovigilancia con reconocimiento automático de placas patentes.
                </Typography>
              </Box>

              {/* Características */}
              <Box>
                <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', mb: 2 }}>
                  <CardContent sx={{ color: 'white' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <SecurityIcon sx={{ mr: 2 }} />
                      <Typography variant="h6">
                        Reconocimiento ANPR
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Detección automática de placas patentes chilenas con alta precisión
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', mb: 2 }}>
                  <CardContent sx={{ color: 'white' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <VideocamIcon sx={{ mr: 2 }} />
                      <Typography variant="h6">
                        Reproducción de Video
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Visualización de eventos con controles de zoom hasta 4x
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Grid>

          {/* Panel derecho - Formulario */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Paper
                elevation={6}
                sx={{
                  p: 4,
                  borderRadius: 2,
                  backgroundColor: 'white',
                }}
              >
                {children}
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AuthLayout;