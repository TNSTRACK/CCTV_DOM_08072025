// src/controllers/companies.controller.ts
// Controlador de empresas para MVP DOM CCTV

import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { asyncHandler, createError } from '../middleware/error.middleware';
import { 
  CompanyData, 
  companySchema, 
  validateRequest 
} from '../utils/validation';
import {
  getActiveCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deactivateCompany,
  getCompaniesStats,
  searchCompanies,
} from '../services/companies.service';

/**
 * Obtener todas las empresas activas (para dropdowns)
 * GET /api/companies
 */
export const getCompanies = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  console.log('🔍 [GET /api/companies] Obteniendo empresas activas...');
  
  const companies = await getActiveCompanies();
  
  console.log(`📊 [GET /api/companies] Encontradas ${companies.length} empresas activas`);
  console.log('📋 [GET /api/companies] Empresas:', companies.map(c => ({ id: c.id, name: c.name, rut: c.rut })));

  res.json({
    success: true,
    data: { companies },
  });
});

/**
 * Obtener empresa por ID con eventos recientes
 * GET /api/companies/:id
 */
export const getCompany = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID de empresa requerido', 400);
  }

  try {
    const company = await getCompanyById(id);

    res.json({
      success: true,
      data: { company },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Empresa no encontrada') {
      throw createError('Empresa no encontrada', 404);
    }
    throw error;
  }
});

/**
 * Crear nueva empresa
 * POST /api/companies
 * PATRÓN: Validación con Zod schema para datos de empresa
 */
export const addCompany = [
  validateRequest(companySchema),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const companyData = req.validatedData as CompanyData;

    try {
      const company = await createCompany(companyData);

      res.status(201).json({
        success: true,
        message: 'Empresa creada exitosamente',
        data: { company },
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Ya existe una empresa con este RUT') {
        throw createError('Ya existe una empresa con este RUT', 409);
      }
      throw error;
    }
  })
];

/**
 * Actualizar empresa existente
 * PUT /api/companies/:id
 * PATRÓN: Validación con Zod schema para actualización de empresa
 */
export const updateExistingCompany = [
  validateRequest(companySchema.partial()), // Permite campos opcionales para actualización
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const companyData = req.validatedData as Partial<CompanyData>;

    if (!id) {
      throw createError('ID de empresa requerido', 400);
    }

    try {
      const company = await updateCompany(id, companyData);

      res.json({
        success: true,
        message: 'Empresa actualizada exitosamente',
        data: { company },
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Empresa no encontrada') {
          throw createError('Empresa no encontrada', 404);
        }
        if (error.message === 'Ya existe una empresa con este RUT') {
          throw createError('Ya existe una empresa con este RUT', 409);
        }
      }
      throw error;
    }
  })
];

/**
 * Desactivar empresa
 * DELETE /api/companies/:id
 */
export const removeCompany = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID de empresa requerido', 400);
  }

  try {
    await deactivateCompany(id);

    res.json({
      success: true,
      message: 'Empresa desactivada exitosamente',
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Empresa no encontrada') {
      throw createError('Empresa no encontrada', 404);
    }
    throw error;
  }
});

/**
 * Obtener estadísticas de empresas
 * GET /api/companies/stats
 */
export const getStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const stats = await getCompaniesStats();

  res.json({
    success: true,
    data: { stats },
  });
});

/**
 * Buscar empresas por nombre o RUT
 * GET /api/companies/search
 */
export const searchCompaniesByQuery = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    throw createError('Parámetro de búsqueda "q" requerido', 400);
  }

  if (q.length < 2) {
    throw createError('La búsqueda debe tener al menos 2 caracteres', 400);
  }

  const companies = await searchCompanies(q);

  res.json({
    success: true,
    data: { companies },
  });
});