// src/services/events.service.ts
// Servicio de lógica de negocio para eventos ANPR

import { PrismaClient } from '@prisma/client';
import { EventSearchData } from '../utils/validation';

const prisma = new PrismaClient();

export interface SearchResponse {
  events: any[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface EventStats {
  totalEvents: number;
  eventsToday: number;
  eventsWithMetadata: number;
  averageConfidence: number;
  topCameras: Array<{ name: string; count: number }>;
}

/**
 * Buscar eventos con filtros y paginación
 */
export const searchEvents = async (filters: EventSearchData): Promise<SearchResponse> => {
  // PATRÓN: Construir WHERE clause dinámico
  const whereClause: any = {};

  if (filters.licensePlate) {
    whereClause.licensePlate = {
      contains: filters.licensePlate.toUpperCase(),
    };
  }

  if (filters.startDate && filters.endDate) {
    whereClause.eventDateTime = {
      gte: filters.startDate,
      lte: filters.endDate,
    };
  } else if (filters.startDate) {
    whereClause.eventDateTime = {
      gte: filters.startDate,
    };
  } else if (filters.endDate) {
    whereClause.eventDateTime = {
      lte: filters.endDate,
    };
  }

  if (filters.cameraName) {
    whereClause.cameraName = {
      contains: filters.cameraName,
      mode: 'insensitive',
    };
  }

  if (filters.companyId) {
    whereClause.metadata = {
      companyId: filters.companyId,
    };
  }

  if (typeof filters.hasMetadata === 'boolean') {
    whereClause.hasMetadata = filters.hasMetadata;
  }

  // PATRÓN: Construir orderBy dinámico
  let orderBy: any = { eventDateTime: 'desc' }; // Default ordering
  
  if (filters.sortBy && filters.sortOrder) {
    if (filters.sortBy === 'licensePlate') {
      orderBy = { licensePlate: filters.sortOrder };
    } else if (filters.sortBy === 'eventDateTime') {
      orderBy = { eventDateTime: filters.sortOrder };
    }
  }

  // PATRÓN: Ejecutar consultas en paralelo para performance
  const [events, totalCount] = await Promise.all([
    prisma.event.findMany({
      where: whereClause,
      include: {
        metadata: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                rut: true,
              },
            },
            receptionist: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: orderBy,
      take: filters.limit,
      skip: (filters.page - 1) * filters.limit,
    }),
    prisma.event.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(totalCount / filters.limit);

  return {
    events,
    totalCount,
    currentPage: filters.page,
    totalPages,
    hasNextPage: filters.page < totalPages,
    hasPreviousPage: filters.page > 1,
  };
};

/**
 * Obtener evento por ID con metadatos completos
 */
export const getEventById = async (eventId: string) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      metadata: {
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
        },
      },
    },
  });

  if (!event) {
    throw new Error('Evento no encontrado');
  }

  return event;
};

/**
 * Obtener estadísticas del dashboard
 */
export const getEventStats = async (): Promise<EventStats> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // PATRÓN: Consultas agregadas en paralelo
  const [
    totalEvents,
    eventsToday,
    eventsWithMetadata,
    avgConfidenceResult,
    topCamerasResult,
  ] = await Promise.all([
    prisma.event.count(),
    
    prisma.event.count({
      where: {
        eventDateTime: {
          gte: today,
          lt: tomorrow,
        },
      },
    }),
    
    prisma.event.count({
      where: { hasMetadata: true },
    }),
    
    prisma.event.aggregate({
      _avg: { confidence: true },
    }),
    
    prisma.event.groupBy({
      by: ['cameraName'],
      _count: { cameraName: true },
      orderBy: { _count: { cameraName: 'desc' } },
      take: 5,
    }),
  ]);

  return {
    totalEvents,
    eventsToday,
    eventsWithMetadata,
    averageConfidence: Math.round((avgConfidenceResult._avg.confidence || 0) * 10) / 10,
    topCameras: topCamerasResult.map(camera => ({
      name: camera.cameraName,
      count: camera._count.cameraName,
    })),
  };
};

/**
 * Obtener eventos recientes para el dashboard
 */
export const getRecentEvents = async (limit: number = 10) => {
  return await prisma.event.findMany({
    take: limit,
    orderBy: { eventDateTime: 'desc' },
    include: {
      metadata: {
        include: {
          company: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
};

/**
 * Marcar evento como documentado cuando se añaden metadatos
 */
export const markEventAsDocumented = async (eventId: string) => {
  return await prisma.event.update({
    where: { id: eventId },
    data: { hasMetadata: true },
  });
};

/**
 * Crear metadatos para un evento
 */
export interface CreateMetadataParams {
  eventId: string;
  companyId: string;
  guideNumber: string;
  guideDate: Date;
  cargoDescription: string;
  workOrder: string;
  receptionistId: string;
}

export const createMetadata = async (params: CreateMetadataParams) => {
  // Verificar que el evento existe
  const event = await prisma.event.findUnique({
    where: { id: params.eventId },
  });

  if (!event) {
    throw new Error('Evento no encontrado');
  }

  // Verificar que el evento no tenga metadatos ya
  const existingMetadata = await prisma.metadataEntry.findUnique({
    where: { eventId: params.eventId },
  });

  if (existingMetadata) {
    throw new Error('Este evento ya tiene metadatos asociados');
  }

  // Crear metadatos en una transacción
  const result = await prisma.$transaction(async (tx) => {
    // Crear metadatos
    const metadata = await tx.metadataEntry.create({
      data: {
        eventId: params.eventId,
        companyId: params.companyId,
        guideNumber: params.guideNumber,
        guideDate: params.guideDate,
        cargoDescription: params.cargoDescription,
        workOrder: params.workOrder,
        receptionistId: params.receptionistId,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            rut: true,
          },
        },
        receptionist: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Marcar evento como documentado
    await tx.event.update({
      where: { id: params.eventId },
      data: { hasMetadata: true },
    });

    return metadata;
  });

  return result;
};

/**
 * Obtener días que tienen eventos en un rango de fechas
 * Para destacar días con eventos en el DatePicker
 */
export const getEventDays = async (startDate: string, endDate: string) => {
  try {
    console.log('Getting event days from:', startDate, 'to:', endDate);
    
    // Obtener todos los eventos en el rango
    const events = await prisma.event.findMany({
      where: {
        eventDateTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        eventDateTime: true,
      },
    });

    console.log('Found events:', events.length);

    // Convertir a formato de fecha (YYYY-MM-DD) y contar eventos por día
    const dayMap = new Map<string, number>();
    
    events.forEach(event => {
      const date = new Date(event.eventDateTime);
      const dateString = date.toISOString().split('T')[0];
      const currentCount = dayMap.get(dateString) || 0;
      dayMap.set(dateString, currentCount + 1);
    });

    // Convertir Map a array de objetos
    const days = Array.from(dayMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    console.log('Event days result:', days);
    return { days };
  } catch (error) {
    console.error('Error in getEventDays:', error);
    throw error;
  }
};