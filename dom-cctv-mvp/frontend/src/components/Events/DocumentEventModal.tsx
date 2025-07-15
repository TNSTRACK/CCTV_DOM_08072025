// src/components/Events/DocumentEventModal.tsx
// Modal para documentar eventos ANPR con metadatos

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  IconButton,
  Chip,
  Alert,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  DirectionsCar as CarIcon,
  Save as SaveIcon,
  Business as CompanyIcon,
  Assignment as DocumentIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Event } from '@/hooks/useEvents';
import { useCreateMetadata, useCompanies, useReceptionists } from '@/hooks/useMetadata';
import dayjs, { Dayjs } from 'dayjs';
import toast from 'react-hot-toast';

interface DocumentEventModalProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
  onDocumentSaved?: (event: Event) => void;
}

interface MetadataForm {
  companyId: string;
  companyName: string;
  guideNumber: string;
  guideDate: Dayjs | null;
  cargoDescription: string;
  workOrder: string;
  receptionistId: string;
  receptionistName: string;
}

/**
 * Modal para documentar eventos con metadatos adicionales
 */
const DocumentEventModal: React.FC<DocumentEventModalProps> = ({
  event,
  open,
  onClose,
  onDocumentSaved,
}) => {
  const [formData, setFormData] = useState<MetadataForm>({
    companyId: '',
    companyName: '',
    guideNumber: '',
    guideDate: dayjs(),
    cargoDescription: '',
    workOrder: '',
    receptionistId: '',
    receptionistName: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Hooks para datos y mutations
  const createMetadataMutation = useCreateMetadata();
  const { data: companies = [], isLoading: companiesLoading } = useCompanies();
  const { data: receptionists = [], isLoading: receptionistsLoading } = useReceptionists();

  const isSubmitting = createMetadataMutation.isPending || companiesLoading || receptionistsLoading;

  useEffect(() => {
    if (event && open) {
      // Reset form when opening with new event
      setFormData({
        companyId: '',
        companyName: '',
        guideNumber: '',
        guideDate: dayjs(),
        cargoDescription: '',
        workOrder: '',
        receptionistId: '',
        receptionistName: '',
      });
      setErrors({});
    }
  }, [event, open]);

  const handleInputChange = (field: keyof MetadataForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyId) {
      newErrors.companyId = 'Empresa es requerida';
    }
    if (!formData.guideNumber.trim()) {
      newErrors.guideNumber = 'Número de guía es requerido';
    }
    if (!formData.guideDate) {
      newErrors.guideDate = 'Fecha de guía es requerida';
    }
    if (!formData.cargoDescription.trim()) {
      newErrors.cargoDescription = 'Descripción de carga es requerida';
    }
    if (formData.cargoDescription.trim().length < 10) {
      newErrors.cargoDescription = 'Descripción debe tener al menos 10 caracteres';
    }
    if (!formData.workOrder.trim()) {
      newErrors.workOrder = 'Orden de trabajo es requerida';
    }
    if (!formData.receptionistId) {
      newErrors.receptionistId = 'Recepcionista es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !event) return;

    try {
      await createMetadataMutation.mutateAsync({
        eventId: event.id,
        companyId: formData.companyId,
        guideNumber: formData.guideNumber,
        guideDate: formData.guideDate!.toISOString(),
        cargoDescription: formData.cargoDescription,
        workOrder: formData.workOrder,
        receptionistId: formData.receptionistId,
      });
      
      toast.success('Evento documentado exitosamente');
      onDocumentSaved?.(event);
      handleClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Error al documentar evento');
      console.error('Error documenting event:', error);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        companyId: '',
        companyName: '',
        guideNumber: '',
        guideDate: dayjs(),
        cargoDescription: '',
        workOrder: '',
        receptionistId: '',
        receptionistName: '',
      });
      setErrors({});
      onClose();
    }
  };

  if (!event) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '16px',
          maxHeight: '90vh',
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
          mb: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DocumentIcon />
          <Typography variant="h6" fontWeight="bold">
            Documentar Evento
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          disabled={isSubmitting}
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

      <DialogContent sx={{ p: 3 }}>
        {/* Event Information */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: '8px' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Información del Evento
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={<CarIcon />}
              label={event.licensePlate}
              color="primary"
              variant="filled"
            />
            <Typography variant="body2" color="text.secondary">
              📹 {event.cameraName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              🕒 {dayjs(event.eventDateTime).format('DD/MM/YYYY HH:mm:ss')}
            </Typography>
            <Chip
              label={`${event.confidence}% confianza`}
              color="success"
              size="small"
            />
          </Box>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          Complete la información para documentar este evento ANPR. Todos los campos marcados son obligatorios.
        </Alert>

        <Grid container spacing={3}>
          {/* Company Selection */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CompanyIcon color="primary" />
              Información de la Empresa
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={companies}
              getOptionLabel={(option) => `${option.name} (${option.rut})`}
              value={companies.find(c => c.id === formData.companyId) || null}
              onChange={(_, newValue) => {
                handleInputChange('companyId', newValue?.id || '');
                handleInputChange('companyName', newValue?.name || '');
              }}
              loading={companiesLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Empresa *"
                  error={!!errors.companyId}
                  helperText={errors.companyId}
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.receptionistId}>
              <InputLabel>Recepcionista *</InputLabel>
              <Select
                value={formData.receptionistId}
                label="Recepcionista *"
                onChange={(e) => {
                  const receptionist = receptionists.find(r => r.id === e.target.value);
                  handleInputChange('receptionistId', e.target.value);
                  handleInputChange('receptionistName', `${receptionist?.firstName || ''} ${receptionist?.lastName || ''}`.trim());
                }}
              >
                {receptionists.map((receptionist) => (
                  <MenuItem key={receptionist.id} value={receptionist.id}>
                    {receptionist.firstName} {receptionist.lastName}
                  </MenuItem>
                ))}
              </Select>
              {errors.receptionistId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.receptionistId}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Guide Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
              Información de la Guía
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Número de Guía *"
              value={formData.guideNumber}
              onChange={(e) => handleInputChange('guideNumber', e.target.value)}
              error={!!errors.guideNumber}
              helperText={errors.guideNumber}
              fullWidth
              placeholder="Ej: GD-123456"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DateTimePicker
              label="Fecha de Guía *"
              value={formData.guideDate}
              onChange={(newValue) => handleInputChange('guideDate', newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.guideDate,
                  helperText: errors.guideDate,
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Orden de Trabajo *"
              value={formData.workOrder}
              onChange={(e) => handleInputChange('workOrder', e.target.value)}
              error={!!errors.workOrder}
              helperText={errors.workOrder}
              fullWidth
              placeholder="Ej: OT-2025-001"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Descripción de Carga *"
              value={formData.cargoDescription}
              onChange={(e) => handleInputChange('cargoDescription', e.target.value)}
              error={!!errors.cargoDescription}
              helperText={errors.cargoDescription || 'Mínimo 10 caracteres'}
              fullWidth
              multiline
              rows={4}
              placeholder="Describa detalladamente la carga transportada..."
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={handleClose}
          disabled={isSubmitting}
          variant="outlined"
          sx={{ minWidth: '120px' }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          variant="contained"
          startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
          sx={{
            minWidth: '120px',
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1d4ed8 0%, #5b21b6 100%)',
            },
          }}
        >
          {isSubmitting ? 'Guardando...' : 'Documentar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentEventModal;