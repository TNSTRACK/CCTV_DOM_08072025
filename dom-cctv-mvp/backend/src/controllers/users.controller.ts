// src/controllers/users.controller.ts
// Controlador de usuarios para MVP DOM CCTV

import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { asyncHandler, createError } from '../middleware/error.middleware';
import { getUsersForReception } from '../services/users.service';

/**
 * Obtener usuarios que pueden ser recepcionistas
 * GET /api/users/receptionists
 */
export const getReceptionists = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const receptionists = await getUsersForReception();
    
    res.json({
      success: true,
      data: receptionists,
    });
  } catch (error) {
    console.error('Error getting receptionists:', error);
    throw createError('Error al obtener recepcionistas', 500);
  }
});