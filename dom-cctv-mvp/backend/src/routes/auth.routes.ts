// src/routes/auth.routes.ts
// Rutas de autenticación para MVP DOM CCTV

import { Router } from 'express';
import { 
  login, 
  logout, 
  getProfile, 
  register, 
  changePassword 
} from '../controllers/auth.controller';
import { 
  authenticateToken, 
  requireRole 
} from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Autenticar usuario y obtener token JWT
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/profile
 * @desc    Obtener perfil del usuario autenticado
 * @access  Private
 */
router.get('/profile', authenticateToken, getProfile);

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario
 * @access  Private (Solo administradores)
 */
router.post(
  '/register', 
  authenticateToken, 
  requireRole(['ADMINISTRATOR']),
  register
);

/**
 * @route   POST /api/auth/logout
 * @desc    Cerrar sesión
 * @access  Private
 */
router.post('/logout', authenticateToken, logout);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Cambiar contraseña del usuario
 * @access  Private
 */
router.put(
  '/change-password',
  authenticateToken,
  changePassword
);

export default router;