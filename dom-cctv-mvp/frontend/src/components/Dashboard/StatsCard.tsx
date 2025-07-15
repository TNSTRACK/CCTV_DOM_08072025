// src/components/Dashboard/StatsCard.tsx
// Componente de tarjeta de estadísticas

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: SvgIconComponent;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  isLoading?: boolean;
  onIconClick?: () => void;
}

/**
 * Tarjeta de estadísticas para el dashboard
 */
const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'primary',
  isLoading = false,
  onIconClick,
}) => {
  const theme = useTheme();

  const getColor = () => {
    switch (color) {
      case 'primary':
        return theme.palette.primary.main;
      case 'secondary':
        return theme.palette.secondary.main;
      case 'success':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'error':
        return theme.palette.error.main;
      case 'info':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${getColor()}08 0%, ${getColor()}18 100%)`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${getColor()} 0%, ${getColor()}80 100%)`,
        },
        '&:hover': {
          '&::before': {
            height: '6px',
          },
        },
      }}
    >
      <CardContent sx={{ flex: 1, p: 3, position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontSize: '0.75rem',
              }}
            >
              {title}
            </Typography>
            
            {isLoading ? (
              <CircularProgress size={28} sx={{ my: 1.5 }} />
            ) : (
              <Typography 
                variant="h3" 
                component="div" 
                fontWeight="bold" 
                color={getColor()}
                sx={{ 
                  mb: 0.5,
                  fontSize: '2.5rem',
                  lineHeight: 1.2,
                }}
              >
                {value}
              </Typography>
            )}
            
            {subtitle && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mt: 1,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          
          <Box
            onClick={onIconClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '16px',
              background: `linear-gradient(135deg, ${getColor()}20 0%, ${getColor()}30 100%)`,
              ml: 2,
              position: 'relative',
              cursor: onIconClick ? 'pointer' : 'default',
              transition: 'all 0.3s ease-in-out',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                borderRadius: '16px',
                background: `linear-gradient(135deg, ${getColor()}40 0%, ${getColor()}20 100%)`,
                opacity: 0,
                transition: 'opacity 0.3s ease-in-out',
              },
              '&:hover::before': {
                opacity: 1,
              },
              '&:hover': onIconClick ? {
                transform: 'scale(1.05)',
                boxShadow: `0 8px 24px ${getColor()}30`,
              } : {},
              '&:active': onIconClick ? {
                transform: 'scale(0.98)',
              } : {},
            }}
          >
            <Icon sx={{ 
              color: getColor(), 
              fontSize: 28,
              position: 'relative',
              zIndex: 1,
              transition: 'transform 0.2s ease-in-out',
            }} />
          </Box>
        </Box>
        
        {/* Efecto de brillo sutil */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${getColor()}10 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
      </CardContent>
    </Card>
  );
};

export default StatsCard;