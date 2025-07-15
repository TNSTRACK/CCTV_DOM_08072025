// src/App.tsx
// Componente principal de la aplicación DOM CCTV MVP

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Toaster } from 'react-hot-toast';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

// Importar tema y rutas
import theme from './utils/theme';
import AppRoutes from './AppRoutes';
import ErrorBoundary from './components/ErrorBoundary';

// Configurar dayjs para español
dayjs.locale('es');

// PATRÓN: Configuración de QueryClient optimizada para MVP
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      retry: (failureCount, error: any) => {
        // No reintentar en errores de autenticación
        if (error?.response?.status === 401) return false;
        // Máximo 2 reintentos para otros errores
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
    mutations: {
      retry: false,
    },
  },
});

/**
 * Componente principal de la aplicación
 * Configura providers, tema y routing
 */
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LocalizationProvider 
            dateAdapter={AdapterDayjs} 
            adapterLocale="es"
            localeText={{
              // Localización en español para date pickers
              cancelButtonLabel: 'Cancelar',
              clearButtonLabel: 'Limpiar',
              okButtonLabel: 'Confirmar',
              todayButtonLabel: 'Hoy',
              start: 'Inicio',
              end: 'Fin',
            }}
          >
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <AppRoutes />
            </BrowserRouter>
            
            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </LocalizationProvider>
        </ThemeProvider>
        
        {/* React Query DevTools solo en desarrollo */}
        {import.meta.env.DEV && (
          <ReactQueryDevtools 
            initialIsOpen={false} 
            position="bottom-right" 
          />
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;