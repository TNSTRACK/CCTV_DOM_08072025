// src/utils/theme.ts
// Configuración del tema Material-UI para DOM CCTV MVP

import { createTheme } from '@mui/material/styles';
import { esES } from '@mui/material/locale';

// PATRÓN: Tema personalizado con colores corporativos modernos
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb', // Azul moderno y vibrante
      light: '#60a5fa',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7c3aed', // Púrpura elegante
      light: '#a78bfa',
      dark: '#5b21b6',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    info: {
      main: '#06b6d4',
      light: '#22d3ee',
      dark: '#0891b2',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    // Colores adicionales para gradientes y efectos
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.6,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    button: {
      textTransform: 'none', // No uppercase por defecto
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    // PATRÓN: Personalización de componentes MUI con diseño moderno
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 20px',
          borderRadius: '12px',
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          color: '#1e293b',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: '12px',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f1f5f9',
          '& .MuiTableCell-head': {
            fontWeight: 700,
            fontSize: '0.875rem',
            color: '#334155',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: 'rgba(248, 250, 252, 0.5)',
          },
          '&:hover': {
            backgroundColor: 'rgba(37, 99, 235, 0.04)',
            transform: 'scale(1.001)',
          },
          transition: 'all 0.15s ease-in-out',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: '8px',
          fontSize: '0.75rem',
        },
        colorSuccess: {
          backgroundColor: '#dcfce7',
          color: '#166534',
        },
        colorError: {
          backgroundColor: '#fef2f2',
          color: '#dc2626',
        },
        colorWarning: {
          backgroundColor: '#fef3c7',
          color: '#d97706',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'medium',
      },
    },
    MuiFormControl: {
      defaultProps: {
        variant: 'outlined',
        size: 'medium',
      },
    },
  },
}, esES); // Localización en español

export default theme;