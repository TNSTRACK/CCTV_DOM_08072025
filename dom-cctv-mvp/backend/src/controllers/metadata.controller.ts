// src/controllers/metadata.controller.ts
// Controlador de metadatos para MVP DOM CCTV

import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { asyncHandler, createError } from '../middleware/error.middleware';
import { MetadataData } from '../utils/validation';
import {
  createMetadata,
  updateMetadata,
  getMetadataByEventId,
  deleteMetadata,
  getMetadataStats,
} from '../services/metadata.service';

/**
 * Crear metadatos para un evento
 * POST /api/events/:eventId/metadata
 */
export const addMetadata = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { eventId } = req.params;
  const metadataData = req.body;

  if (!eventId) {
    throw createError('ID de evento requerido', 400);
  }

  if (!req.user) {
    throw createError('Usuario no autenticado', 401);
  }

  try {
    const metadata = await createMetadata(eventId, metadataData, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Metadatos creados exitosamente',
      data: { metadata },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Evento no encontrado') {
        throw createError('Evento no encontrado', 404);
      }
      if (error.message === 'El evento ya tiene metadatos asociados') {
        throw createError('El evento ya tiene metadatos asociados', 409);
      }
      if (error.message === 'Empresa no encontrada') {
        throw createError('Empresa no encontrada', 400);
      }
    }
    throw error;
  }
});

/**
 * Actualizar metadatos existentes
 * PUT /api/events/:eventId/metadata
 */
export const updateEventMetadata = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { eventId } = req.params;
  const metadataData = req.body;

  if (!eventId) {
    throw createError('ID de evento requerido', 400);
  }

  if (!req.user) {
    throw createError('Usuario no autenticado', 401);
  }

  try {
    const metadata = await updateMetadata(eventId, metadataData, req.user.id);

    res.json({
      success: true,
      message: 'Metadatos actualizados exitosamente',
      data: { metadata },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Metadatos no encontrados') {
        throw createError('Metadatos no encontrados', 404);
      }
      if (error.message === 'Empresa no encontrada') {
        throw createError('Empresa no encontrada', 400);
      }
    }
    throw error;
  }
});

/**
 * Obtener metadatos por ID de evento
 * GET /api/events/:eventId/metadata
 */
export const getMetadata = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { eventId } = req.params;

  if (!eventId) {
    throw createError('ID de evento requerido', 400);
  }

  try {
    const metadata = await getMetadataByEventId(eventId);

    res.json({
      success: true,
      data: { metadata },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Metadatos no encontrados') {
      throw createError('Metadatos no encontrados', 404);
    }
    throw error;
  }
});

/**
 * Eliminar metadatos de un evento
 * DELETE /api/events/:eventId/metadata
 */
export const removeMetadata = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { eventId } = req.params;

  if (!eventId) {
    throw createError('ID de evento requerido', 400);
  }

  // Solo administradores pueden eliminar metadatos
  if (req.user?.role !== 'ADMINISTRATOR') {
    throw createError('Solo administradores pueden eliminar metadatos', 403);
  }

  try {
    await deleteMetadata(eventId);

    res.json({
      success: true,
      message: 'Metadatos eliminados exitosamente',
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Metadatos no encontrados') {
      throw createError('Metadatos no encontrados', 404);
    }
    throw error;
  }
});

/**
 * Obtener estadísticas de metadatos
 * GET /api/metadata/stats
 */
export const getStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const stats = await getMetadataStats();

  res.json({
    success: true,
    data: { stats },
  });
});