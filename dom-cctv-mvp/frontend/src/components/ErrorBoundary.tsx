// src/components/ErrorBoundary.tsx
// Componente para manejo de errores en React

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Button, 
  Box,
  Alert,
  AlertTitle 
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Boundary para capturar errores de React y mostrar UI de fallback
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // En producción, enviar error a servicio de monitoreo
    if (import.meta.env.PROD) {
      // TODO: Enviar a servicio de logging (ej: Sentry)
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box textAlign="center" mb={3}>
              <Typography variant="h4" color="error" gutterBottom>
                ¡Ops! Algo salió mal
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                Ha ocurrido un error inesperado en la aplicación.
              </Typography>
            </Box>

            <Alert severity="error" sx={{ mb: 3 }}>
              <AlertTitle>Error Técnico</AlertTitle>
              {this.state.error?.message || 'Error desconocido'}
            </Alert>

            <Box display="flex" gap={2} justifyContent="center">
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={this.handleReload}
              >
                Recargar Página
              </Button>
              <Button
                variant="outlined"
                onClick={this.handleReset}
              >
                Intentar de Nuevo
              </Button>
            </Box>

            {/* Mostrar detalles del error solo en desarrollo */}
            {import.meta.env.DEV && this.state.error && (
              <Box mt={4}>
                <Typography variant="h6" gutterBottom>
                  Detalles del Error (Solo en Desarrollo):
                </Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'grey.50',
                    maxHeight: 300,
                    overflow: 'auto' 
                  }}
                >
                  <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>
                    {this.state.error.stack}
                  </Typography>
                </Paper>
              </Box>
            )}
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;