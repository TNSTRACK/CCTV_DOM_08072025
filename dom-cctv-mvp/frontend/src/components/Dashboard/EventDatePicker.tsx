// src/components/Dashboard/EventDatePicker.tsx
// DatePicker especializado para seleccionar días con eventos

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Badge,
  Tooltip,
  IconButton,
  useTheme,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { Close as CloseIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useEventDays, useHasEvents, useEventCount } from '@/hooks/useEventDays';
import dayjs, { Dayjs } from 'dayjs';

interface EventDatePickerProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Componente personalizado para los días del DatePicker
 * Destaca los días que tienen eventos
 */
const EventDay: React.FC<PickersDayProps<Dayjs> & { eventCount?: number }> = ({
  day,
  eventCount,
  outsideCurrentMonth,
  ...props
}) => {
  const theme = useTheme();
  const hasEvents = (eventCount || 0) > 0;

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={hasEvents ? eventCount : undefined}
      sx={{
        '& .MuiBadge-badge': {
          fontSize: '0.625rem',
          height: '16px',
          minWidth: '16px',
          background: 'linear-gradient(45deg, #2563eb 30%, #7c3aed 90%)',
          color: 'white',
          fontWeight: 'bold',
        },
      }}
    >
      <Tooltip
        title={
          hasEvents
            ? `${eventCount} evento${eventCount !== 1 ? 's' : ''}`
            : 'Sin eventos'
        }
        arrow
      >
        <PickersDay
          {...props}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
          sx={{
            position: 'relative',
            fontWeight: hasEvents ? 'bold' : 'normal',
            color: hasEvents
              ? theme.palette.primary.main
              : outsideCurrentMonth
              ? theme.palette.text.disabled
              : theme.palette.text.primary,
            backgroundColor: hasEvents
              ? `${theme.palette.primary.main}08`
              : 'transparent',
            '&:hover': {
              backgroundColor: hasEvents
                ? `${theme.palette.primary.main}16`
                : `${theme.palette.primary.main}08`,
            },
            '&.Mui-selected': {
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            },
            '&::after': hasEvents
              ? {
                  content: '""',
                  position: 'absolute',
                  bottom: '2px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: theme.palette.primary.main,
                }
              : {},
          }}
        />
      </Tooltip>
    </Badge>
  );
};

/**
 * DatePicker especializado para seleccionar días con eventos
 */
const EventDatePicker: React.FC<EventDatePickerProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [calendarMonth, setCalendarMonth] = useState<Dayjs>(dayjs());

  const { data: eventDaysData, isLoading, error } = useEventDays(
    calendarMonth.year(),
    calendarMonth.month() + 1
  );

  // Debug: mostrar datos en consola (temporal)
  React.useEffect(() => {
    if (eventDaysData) {
      console.log('EventDaysData:', eventDaysData);
    }
  }, [eventDaysData]);

  const handleDateSelect = (date: Dayjs | null) => {
    if (!date) return;

    setSelectedDate(date);
    
    // Navegar a la página de eventos con el filtro de fecha
    const dateString = date.format('YYYY-MM-DD');
    navigate(`/events?date=${dateString}`);
    onClose();
  };

  const handleConfirm = () => {
    if (selectedDate) {
      handleDateSelect(selectedDate);
    }
  };

  const renderDay = (props: PickersDayProps<Dayjs>) => {
    const { day } = props;
    const jsDate = day.toDate();
    const eventCount = useEventCount(jsDate, eventDaysData?.days);
    
    return (
      <EventDay
        {...props}
        day={day}
        eventCount={eventCount}
      />
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
          color: 'white',
          mb: 2,
        }}
      >
        <Typography variant="h6" component="span" fontWeight="bold">
          Seleccionar Fecha de Eventos
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Los días con eventos aparecen destacados con un punto azul y contador.
            Selecciona una fecha para ver los eventos de ese día.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <DatePicker
              value={selectedDate}
              onChange={handleDateSelect}
              onMonthChange={setCalendarMonth}
              slots={{
                day: renderDay,
              }}
              loading={isLoading}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined',
                  sx: { mb: 2 },
                },
                calendarHeader: {
                  sx: {
                    '& .MuiPickersCalendarHeader-root': {
                      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                      borderRadius: '8px',
                      mb: 1,
                    },
                  },
                },
              }}
            />
          </Box>

          {/* Leyenda */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 3,
              mt: 2,
              p: 2,
              bgcolor: 'grey.50',
              borderRadius: '8px',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Días con eventos
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: 'grey.300',
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Días sin eventos
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: '8px',
            minWidth: '100px',
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!selectedDate}
          sx={{
            borderRadius: '8px',
            minWidth: '100px',
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1d4ed8 0%, #5b21b6 100%)',
            },
          }}
        >
          Ver Eventos
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDatePicker;