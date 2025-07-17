// src/controllers/auth.controller.ts
// Controlador de autenticación para MVP DOM CCTV

import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest, generateToken } from '../middleware/auth.middleware';
import { securityLogger } from '../middleware/logging.middleware';
import { asyncHandler, createError } from '../middleware/error.middleware';
import { 
  LoginData, 
  RegisterData, 
  loginSchema, 
  registerSchema,
  passwordChangeSchema,
  validateRequest
} from '../utils/validation';

const prisma = new PrismaClient();

/**
 * Autenticar usuario y generar token JWT
 * POST /api/auth/login
 * PATRÓN: Validación con Zod schema para credenciales
 */
export const login = [
  validateRequest(loginSchema),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { email, password } = req.validatedData as LoginData;

  // Buscar usuario por email
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: {
      id: true,
      email: true,
      password: true,
      firstName: true,
      lastName: true,
      role: true,
      active: true,
    },
  });

  if (!user) {
    securityLogger('login_failed', { 
      email, 
      reason: 'user_not_found' 
    }, req);
    
    throw createError('Credenciales inválidas', 401);
  }

  if (!user.active) {
    securityLogger('login_failed', { 
      email, 
      userId: user.id,
      reason: 'user_inactive' 
    }, req);
    
    throw createError('Usuario inactivo', 401);
  }

  // Verificar contraseña
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    securityLogger('login_failed', { 
      email, 
      userId: user.id,
      reason: 'invalid_password' 
    }, req);
    
    throw createError('Credenciales inválidas', 401);
  }

  // Generar token JWT
  const token = generateToken(user.id);

  securityLogger('login_success', { 
    userId: user.id,
    email: user.email,
    role: user.role 
  }, req);

  res.json({
    success: true,
    message: 'Login exitoso',
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    },
  });
  })
];

/**
 * Obtener perfil del usuario autenticado
 * GET /api/auth/profile
 */
export const getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw createError('Usuario no autenticado', 401);
  }

  // Buscar datos completos del usuario
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw createError('Usuario no encontrado', 404);
  }

  res.json({
    success: true,
    data: { user },
  });
});

/**
 * Registrar nuevo usuario (solo para administradores)
 * POST /api/auth/register
 * PATRÓN: Validación con Zod schema para datos de registro
 */
export const register = [
  validateRequest(registerSchema),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { email, password, firstName, lastName, role }: RegisterData = req.validatedData as RegisterData;

  // Verificar si el email ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    throw createError('El email ya está registrado', 409);
  }

  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear usuario
  const newUser = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      role,
      active: true,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      active: true,
      createdAt: true,
    },
  });

  securityLogger('user_registered', { 
    newUserId: newUser.id,
    newUserEmail: newUser.email,
    newUserRole: newUser.role,
    registeredBy: req.user?.id 
  }, req);

  res.status(201).json({
    success: true,
    message: 'Usuario registrado exitosamente',
    data: { user: newUser },
  });
  })
];

/**
 * Refresh token
 * POST /api/auth/refresh
 */
export const refreshToken = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw createError('Usuario no autenticado', 401);
  }

  // Verificar que el usuario sigue activo
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      active: true,
    },
  });

  if (!user || !user.active) {
    throw createError('Usuario inválido o inactivo', 401);
  }

  // Generar nuevo token
  const newToken = generateToken(user.id);

  securityLogger('token_refreshed', { 
    userId: user.id 
  }, req);

  res.json({
    success: true,
    message: 'Token renovado exitosamente',
    data: {
      token: newToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    },
  });
});

/**
 * Logout (para futuras funcionalidades con blacklist de tokens)
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // En un MVP simple, el logout es manejado en el frontend
  // removiendo el token del localStorage
  
  securityLogger('logout', { 
    userId: req.user?.id 
  }, req);

  res.json({
    success: true,
    message: 'Logout exitoso',
  });
});

/**
 * Cambiar contraseña del usuario autenticado
 * PUT /api/auth/change-password
 * PATRÓN: Validación con Zod schema para cambio de contraseña
 */
export const changePassword = [
  validateRequest(passwordChangeSchema),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw createError('Usuario no autenticado', 401);
    }

    const { currentPassword, newPassword } = req.validatedData as any;

  // Obtener usuario con contraseña actual
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      password: true,
    },
  });

  if (!user) {
    throw createError('Usuario no encontrado', 404);
  }

  // Verificar contraseña actual
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isCurrentPasswordValid) {
    securityLogger('password_change_failed', { 
      userId: user.id,
      reason: 'invalid_current_password' 
    }, req);
    
    throw createError('Contraseña actual incorrecta', 400);
  }

  // Hash de la nueva contraseña
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  // Actualizar contraseña
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedNewPassword },
  });

  securityLogger('password_changed', { 
    userId: user.id 
  }, req);

  res.json({
    success: true,
    message: 'Contraseña actualizada exitosamente',
  });
  })
];