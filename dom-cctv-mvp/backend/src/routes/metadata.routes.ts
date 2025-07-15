// src/routes/metadata.routes.ts
// Rutas de metadatos para MVP DOM CCTV

import { Router } from 'express';
import {
  addMetadata,
  updateEventMetadata,
  getMetadata,
  removeMetadata,
  getStats,
} from '../controllers/metadata.controller';
import { requireRole } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   GET /api/metadata/stats
 * @desc    Obtener estadísticas de metadatos
 * @access  Private (Admin y Operator)
 */
router.get('/stats', getStats);

/**
 * @route   POST /api/events/:eventId/metadata
 * @desc    Crear metadatos para un evento
 * @access  Private (Admin y Operator)
 */
router.post(
  '/events/:eventId/metadata',
  addMetadata
);

/**
 * @route   GET /api/events/:eventId/metadata
 * @desc    Obtener metadatos de un evento
 * @access  Private (Admin y Operator)
 */
router.get('/events/:eventId/metadata', getMetadata);

/**
 * @route   PUT /api/events/:eventId/metadata
 * @desc    Actualizar metadatos de un evento
 * @access  Private (Admin y Operator)
 */
router.put(
  '/events/:eventId/metadata',
  updateEventMetadata
);

/**
 * @route   DELETE /api/events/:eventId/metadata
 * @desc    Eliminar metadatos de un evento
 * @access  Private (Solo Administradores)
 */
router.delete(
  '/events/:eventId/metadata',
  requireRole(['ADMINISTRATOR']),
  removeMetadata
);

export default router;