// src/routes/companies.routes.ts
// Rutas de empresas para MVP DOM CCTV

import { Router } from 'express';
import {
  getCompanies,
  getCompany,
  addCompany,
  updateExistingCompany,
  removeCompany,
  getStats,
  searchCompaniesByQuery,
} from '../controllers/companies.controller';
import { requireRole } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   GET /api/companies/stats
 * @desc    Obtener estadísticas de empresas
 * @access  Private (Admin)
 */
router.get('/stats', requireRole(['ADMINISTRATOR']), getStats);

/**
 * @route   GET /api/companies/search
 * @desc    Buscar empresas por nombre o RUT
 * @access  Private (Admin y Operator)
 */
router.get('/search', searchCompaniesByQuery);

/**
 * @route   POST /api/companies
 * @desc    Crear nueva empresa
 * @access  Private (Solo Administradores)
 */
router.post(
  '/',
  requireRole(['ADMINISTRATOR']),
  addCompany
);

/**
 * @route   GET /api/companies/:id
 * @desc    Obtener empresa por ID
 * @access  Private (Admin y Operator)
 */
router.get('/:id', getCompany);

/**
 * @route   PUT /api/companies/:id
 * @desc    Actualizar empresa
 * @access  Private (Solo Administradores)
 */
router.put(
  '/:id',
  requireRole(['ADMINISTRATOR']),
  updateExistingCompany
);

/**
 * @route   DELETE /api/companies/:id
 * @desc    Desactivar empresa
 * @access  Private (Solo Administradores)
 */
router.delete('/:id', requireRole(['ADMINISTRATOR']), removeCompany);

/**
 * @route   GET /api/companies
 * @desc    Obtener todas las empresas activas
 * @access  Private (Admin y Operator)
 */
router.get('/', getCompanies);

export default router;