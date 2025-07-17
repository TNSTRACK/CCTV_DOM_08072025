// src/services/companies.service.ts
// Servicio de lógica de negocio para empresas

import { PrismaClient } from '@prisma/client';
import { CompanyData } from '../utils/validation';

const prisma = new PrismaClient();

/**
 * Obtener todas las empresas activas para dropdowns
 */
export const getActiveCompanies = async () => {
  console.log('🔍 [getActiveCompanies] Consultando empresas activas en BD...');
  
  const companies = await prisma.company.findMany({
    where: { active: true },
    select: {
      id: true,
      rut: true,
      name: true,
    },
    orderBy: { name: 'asc' },
  });
  
  console.log(`📊 [getActiveCompanies] Encontradas ${companies.length} empresas activas`);
  console.log('📋 [getActiveCompanies] Empresas:', companies.map(c => ({ id: c.id, name: c.name, rut: c.rut })));
  
  return companies;
};

/**
 * Obtener empresa por ID
 */
export const getCompanyById = async (companyId: string) => {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      metadata: {
        include: {
          event: {
            select: {
              id: true,
              licensePlate: true,
              eventDateTime: true,
              cameraName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10, // Últimos 10 eventos documentados
      },
    },
  });

  if (!company) {
    throw new Error('Empresa no encontrada');
  }

  return company;
};

/**
 * Crear nueva empresa (solo administradores)
 */
export const createCompany = async (companyData: CompanyData) => {
  // Verificar si el RUT ya existe
  const existingCompany = await prisma.company.findUnique({
    where: { rut: companyData.rut },
  });

  if (existingCompany) {
    throw new Error('Ya existe una empresa con este RUT');
  }

  const company = await prisma.company.create({
    data: companyData,
  });

  return company;
};

/**
 * Actualizar empresa existente
 */
export const updateCompany = async (companyId: string, companyData: Partial<CompanyData>) => {
  // Verificar que la empresa existe
  const existingCompany = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!existingCompany) {
    throw new Error('Empresa no encontrada');
  }

  // Si se está actualizando el RUT, verificar que no esté duplicado
  if (companyData.rut && companyData.rut !== existingCompany.rut) {
    const duplicateRUT = await prisma.company.findUnique({
      where: { rut: companyData.rut },
    });

    if (duplicateRUT) {
      throw new Error('Ya existe una empresa con este RUT');
    }
  }

  const updatedCompany = await prisma.company.update({
    where: { id: companyId },
    data: companyData,
  });

  return updatedCompany;
};

/**
 * Desactivar empresa (no eliminar para mantener relaciones)
 */
export const deactivateCompany = async (companyId: string) => {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    throw new Error('Empresa no encontrada');
  }

  const deactivated = await prisma.company.update({
    where: { id: companyId },
    data: { active: false },
  });

  return deactivated;
};

/**
 * Obtener estadísticas de empresas
 */
export const getCompaniesStats = async () => {
  const [
    totalCompanies,
    activeCompanies,
    companiesWithEvents,
    topCompaniesByEvents,
  ] = await Promise.all([
    prisma.company.count(),
    
    prisma.company.count({
      where: { active: true },
    }),
    
    prisma.company.count({
      where: {
        metadata: {
          some: {},
        },
      },
    }),
    
    prisma.company.findMany({
      where: { active: true },
      include: {
        _count: {
          select: { metadata: true },
        },
      },
      orderBy: {
        metadata: {
          _count: 'desc',
        },
      },
      take: 5,
    }),
  ]);

  return {
    totalCompanies,
    activeCompanies,
    companiesWithEvents,
    topCompaniesByEvents: topCompaniesByEvents.map(company => ({
      id: company.id,
      name: company.name,
      rut: company.rut,
      eventsCount: company._count.metadata,
    })),
  };
};

/**
 * Buscar empresas por nombre o RUT
 */
export const searchCompanies = async (query: string) => {
  return await prisma.company.findMany({
    where: {
      AND: [
        { active: true },
        {
          OR: [
            {
              name: {
                contains: query,
              },
            },
            {
              rut: {
                contains: query,
              },
            },
          ],
        },
      ],
    },
    select: {
      id: true,
      rut: true,
      name: true,
      _count: {
        select: { metadata: true },
      },
    },
    orderBy: { name: 'asc' },
    take: 20, // Limitar resultados de búsqueda
  });
};