// src/services/metadata.service.ts
// Servicio de lógica de negocio para metadatos

import { PrismaClient } from '@prisma/client';
import { MetadataData } from '../utils/validation';
import { markEventAsDocumented } from './events.service';

const prisma = new PrismaClient();

/**
 * Crear entrada de metadatos para un evento
 */
export const createMetadata = async (
  eventId: string,
  metadataData: MetadataData,
  receptionistId: string
) => {
  // Verificar que el evento existe y no tiene metadatos
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { metadata: true },
  });

  if (!event) {
    throw new Error('Evento no encontrado');
  }

  if (event.metadata) {
    throw new Error('El evento ya tiene metadatos asociados');
  }

  // Verificar que la empresa existe
  const company = await prisma.company.findUnique({
    where: { id: metadataData.companyId },
  });

  if (!company) {
    throw new Error('Empresa no encontrada');
  }

  // Crear metadatos en una transacción
  const result = await prisma.$transaction(async (tx) => {
    // Crear entrada de metadatos
    const metadata = await tx.metadataEntry.create({
      data: {
        eventId,
        companyId: metadataData.companyId,
        guideNumber: metadataData.guideNumber,
        guideDate: metadataData.guideDate,
        cargoDescription: metadataData.cargoDescription,
        workOrder: metadataData.workOrder,
        receptionistId,
      },
      include: {
        company: true,
        receptionist: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        event: true,
      },
    });

    // Marcar evento como documentado
    await tx.event.update({
      where: { id: eventId },
      data: { hasMetadata: true },
    });

    return metadata;
  });

  return result;
};

/**
 * Actualizar metadatos existentes
 */
export const updateMetadata = async (
  eventId: string,
  metadataData: Partial<MetadataData>,
  receptionistId: string
) => {
  // Verificar que los metadatos existen
  const existingMetadata = await prisma.metadataEntry.findUnique({
    where: { eventId },
    include: {
      event: true,
      company: true,
    },
  });

  if (!existingMetadata) {
    throw new Error('Metadatos no encontrados');
  }

  // Si se está cambiando la empresa, verificar que existe
  if (metadataData.companyId && metadataData.companyId !== existingMetadata.companyId) {
    const company = await prisma.company.findUnique({
      where: { id: metadataData.companyId },
    });

    if (!company) {
      throw new Error('Empresa no encontrada');
    }
  }

  // Actualizar metadatos
  const updated = await prisma.metadataEntry.update({
    where: { eventId },
    data: {
      ...metadataData,
      // Actualizar el recepcionista que modificó
      receptionistId,
      updatedAt: new Date(),
    },
    include: {
      company: true,
      receptionist: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      event: true,
    },
  });

  return updated;
};

/**
 * Obtener metadatos por ID de evento
 */
export const getMetadataByEventId = async (eventId: string) => {
  const metadata = await prisma.metadataEntry.findUnique({
    where: { eventId },
    include: {
      company: true,
      receptionist: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      event: {
        select: {
          id: true,
          licensePlate: true,
          eventDateTime: true,
          cameraName: true,
          confidence: true,
        },
      },
    },
  });

  if (!metadata) {
    throw new Error('Metadatos no encontrados');
  }

  return metadata;
};

/**
 * Eliminar metadatos (marcar evento como no documentado)
 */
export const deleteMetadata = async (eventId: string) => {
  // Verificar que los metadatos existen
  const existingMetadata = await prisma.metadataEntry.findUnique({
    where: { eventId },
  });

  if (!existingMetadata) {
    throw new Error('Metadatos no encontrados');
  }

  // Eliminar metadatos y actualizar evento en transacción
  await prisma.$transaction(async (tx) => {
    await tx.metadataEntry.delete({
      where: { eventId },
    });

    await tx.event.update({
      where: { id: eventId },
      data: { hasMetadata: false },
    });
  });

  return { success: true };
};

/**
 * Obtener estadísticas de metadatos
 */
export const getMetadataStats = async () => {
  const [
    totalMetadata,
    metadataToday,
    companiesWithMetadata,
    topReceptionists,
  ] = await Promise.all([
    prisma.metadataEntry.count(),
    
    prisma.metadataEntry.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    
    prisma.metadataEntry.groupBy({
      by: ['companyId'],
      _count: { companyId: true },
    }).then(results => results.length),
    
    prisma.metadataEntry.groupBy({
      by: ['receptionistId'],
      _count: { receptionistId: true },
      orderBy: { _count: { receptionistId: 'desc' } },
      take: 5,
    }),
  ]);

  // Obtener nombres de los recepcionistas más activos
  const receptionistIds = topReceptionists.map(r => r.receptionistId);
  const receptionists = await prisma.user.findMany({
    where: { id: { in: receptionistIds } },
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  });

  const topReceptionistsWithNames = topReceptionists.map(stat => {
    const receptionist = receptionists.find(r => r.id === stat.receptionistId);
    return {
      id: stat.receptionistId,
      name: receptionist ? `${receptionist.firstName} ${receptionist.lastName}` : 'Usuario Desconocido',
      count: stat._count.receptionistId,
    };
  });

  return {
    totalMetadata,
    metadataToday,
    companiesWithMetadata,
    topReceptionists: topReceptionistsWithNames,
  };
};