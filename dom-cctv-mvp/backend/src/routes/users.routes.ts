// src/routes/users.routes.ts
// Rutas para gestión de usuarios

import { Router } from 'express';
import { getReceptionists } from '../controllers/users.controller';

const router = Router();

/**
 * @route   GET /api/users/receptionists
 * @desc    Obtener usuarios que pueden ser recepcionistas
 * @access  Private (Admin y Operator)
 */
router.get('/receptionists', getReceptionists);

export default router;