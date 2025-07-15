// src/pages/LoginPage.tsx
// Página de inicio de sesión

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Alert,
  Link,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { LoginFormData } from '@/types';

// PATRÓN: Schema de validación con Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email es requerido')
    .email('Formato de email inválido'),
  password: z
    .string()
    .min(1, 'Contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Página de inicio de sesión
 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoggingIn, loginError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login({ email: data.email, password: data.password });
      navigate('/dashboard');
    } catch (error) {
      // El error ya se maneja en el hook useAuth
      console.error('Login failed:', error);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Iniciar Sesión
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ingresa tus credenciales para acceder al sistema
        </Typography>
      </Box>

      {/* Mostrar error de autenticación */}
      {loginError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {loginError?.response?.data?.error || 'Error al iniciar sesión'}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Campo Email */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Email"
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                disabled={isLoggingIn}
              />
            )}
          />

          {/* Campo Contraseña */}
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                disabled={isLoggingIn}
              />
            )}
          />

          {/* Recordarme */}
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    checked={field.value}
                    disabled={isLoggingIn}
                  />
                }
                label="Recordarme"
              />
            )}
          />

          {/* Botón de login */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            startIcon={<LoginIcon />}
            loading={isLoggingIn}
            disabled={!isValid || isLoggingIn}
            sx={{ mt: 2, py: 1.5 }}
          >
            {isLoggingIn ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </Box>
      </form>

      {/* Información de credenciales de demo */}
      <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          Credenciales del Sistema:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Administrador:</strong><br />
          Email: admin@domcctv.cl<br />
          Contraseña: password123<br /><br />
          <strong>Operador:</strong><br />
          Email: operator@domcctv.cl<br />
          Contraseña: password123
        </Typography>
      </Box>

      {/* Links adicionales */}
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          ¿Problemas para acceder?{' '}
          <Link href="#" underline="hover">
            Contactar soporte
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;