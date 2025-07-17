// src/services/vehicle-events.service.ts
// Servicio para manejar eventos de vehículos con seguimiento multi-cámara

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface VehicleEventData {
  licensePlate: string;
  cameraName: string;
  timestamp: Date;
  videoPath: string;
  thumbnailPath?: string;
  confidence?: number;
}

export interface VehicleEventSearchFilters {
  licensePlate?: string;
  startDate?: Date;
  endDate?: Date;
  status?: 'ACTIVE' | 'COMPLETED' | 'TIMEOUT';
  hasMetadata?: boolean;
  page?: number;
  limit?: number;
}

export interface VehicleEventResponse {
  id: string;
  licensePlate: string;
  startTime: Date;
  endTime?: Date;
  status: string;
  hasMetadata: boolean;
  detections: Detection[];
  metadata?: any;
}

export interface Detection {
  id: string;
  cameraName: string;
  timestamp: Date;
  videoPath: string;
  thumbnailPath?: string;
  confidence: number;
}

/**
 * Procesar nueva detección de vehículo
 * - Si existe evento activo para la matrícula, agregar detección
 * - Si no existe, crear nuevo evento
 */
export const processVehicleDetection = async (data: VehicleEventData): Promise<VehicleEventResponse> => {
  const { licensePlate, cameraName, timestamp, videoPath, thumbnailPath, confidence = 95.0 } = data;

  // Buscar evento activo existente para esta matrícula (últimas 2 horas)
  const twoHoursAgo = new Date(timestamp.getTime() - 2 * 60 * 60 * 1000);
  
  let vehicleEvent = await prisma.vehicleEvent.findFirst({
    where: {
      licensePlate: licensePlate.toUpperCase(),
      status: 'ACTIVE',
      startTime: {
        gte: twoHoursAgo,
      },
    },
    include: {
      detections: {
        orderBy: { timestamp: 'asc' },
      },
      metadata: {
        include: {
          company: true,
          receptionist: true,
        },
      },
    },
  });

  if (vehicleEvent) {
    // Evento existente: agregar nueva detección
    const detection = await prisma.detection.create({
      data: {
        eventId: vehicleEvent.id,
        cameraName,
        timestamp,
        videoPath,
        thumbnailPath,
        confidence,
      },
    });

    // Actualizar endTime del evento
    vehicleEvent = await prisma.vehicleEvent.update({
      where: { id: vehicleEvent.id },
      data: { endTime: timestamp },
      include: {
        detections: {
          orderBy: { timestamp: 'asc' },
        },
        metadata: {
          include: {
            company: true,
            receptionist: true,
          },
        },
      },
    });

    return formatVehicleEventResponse(vehicleEvent);
  } else {
    // Nuevo evento: crear evento y primera detección
    const newVehicleEvent = await prisma.vehicleEvent.create({
      data: {
        licensePlate: licensePlate.toUpperCase(),
        startTime: timestamp,
        endTime: timestamp,
        status: 'ACTIVE',
        detections: {
          create: {
            cameraName,
            timestamp,
            videoPath,
            thumbnailPath,
            confidence,
          },
        },
      },
      include: {
        detections: {
          orderBy: { timestamp: 'asc' },
        },
        metadata: {
          include: {
            company: true,
            receptionist: true,
          },
        },
      },
    });

    return formatVehicleEventResponse(newVehicleEvent);
  }
};

/**
 * Buscar eventos de vehículos con filtros
 */
export const searchVehicleEvents = async (filters: VehicleEventSearchFilters = {}) => {
  const { 
    licensePlate, 
    startDate, 
    endDate, 
    status, 
    hasMetadata,
    page = 1, 
    limit = 20 
  } = filters;

  const whereClause: any = {};

  if (licensePlate) {
    whereClause.licensePlate = {
      contains: licensePlate.toUpperCase(),
    };
  }

  if (startDate || endDate) {
    whereClause.startTime = {};
    if (startDate) whereClause.startTime.gte = startDate;
    if (endDate) whereClause.startTime.lte = endDate;
  }

  if (status) {
    whereClause.status = status;
  }

  if (typeof hasMetadata === 'boolean') {
    whereClause.hasMetadata = hasMetadata;
  }

  const [events, totalCount] = await Promise.all([
    prisma.vehicleEvent.findMany({
      where: whereClause,
      include: {
        detections: {
          orderBy: { timestamp: 'asc' },
        },
        metadata: {
          include: {
            company: true,
            receptionist: true,
          },
        },
      },
      orderBy: { startTime: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.vehicleEvent.count({ where: whereClause }),
  ]);

  return {
    events: events.map(formatVehicleEventResponse),
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
    hasNextPage: page < Math.ceil(totalCount / limit),
    hasPreviousPage: page > 1,
  };
};

/**
 * Obtener evento específico con todas sus detecciones
 */
export const getVehicleEventById = async (eventId: string): Promise<VehicleEventResponse> => {
  const event = await prisma.vehicleEvent.findUnique({
    where: { id: eventId },
    include: {
      detections: {
        orderBy: { timestamp: 'asc' },
      },
      metadata: {
        include: {
          company: true,
          receptionist: true,
        },
      },
    },
  });

  if (!event) {
    throw new Error('Evento no encontrado');
  }

  return formatVehicleEventResponse(event);
};

/**
 * Finalizar evento manualmente
 */
export const completeVehicleEvent = async (eventId: string): Promise<VehicleEventResponse> => {
  const event = await prisma.vehicleEvent.update({
    where: { id: eventId },
    data: { 
      status: 'COMPLETED',
      endTime: new Date(),
    },
    include: {
      detections: {
        orderBy: { timestamp: 'asc' },
      },
      metadata: {
        include: {
          company: true,
          receptionist: true,
        },
      },
    },
  });

  return formatVehicleEventResponse(event);
};

/**
 * Finalizar eventos por timeout (tarea programada)
 */
export const timeoutInactiveEvents = async (timeoutMinutes: number = 30): Promise<number> => {
  const timeoutDate = new Date(Date.now() - timeoutMinutes * 60 * 1000);

  const result = await prisma.vehicleEvent.updateMany({
    where: {
      status: 'ACTIVE',
      endTime: {
        lt: timeoutDate,
      },
    },
    data: {
      status: 'TIMEOUT',
    },
  });

  return result.count;
};

/**
 * Obtener estadísticas de eventos
 */
export const getVehicleEventStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [
    totalEvents,
    activeEvents,
    eventsToday,
    eventsWithMetadata,
    topCameras,
  ] = await Promise.all([
    prisma.vehicleEvent.count(),
    
    prisma.vehicleEvent.count({
      where: { status: 'ACTIVE' },
    }),
    
    prisma.vehicleEvent.count({
      where: {
        startTime: {
          gte: today,
          lt: tomorrow,
        },
      },
    }),
    
    prisma.vehicleEvent.count({
      where: { hasMetadata: true },
    }),
    
    prisma.detection.groupBy({
      by: ['cameraName'],
      _count: { cameraName: true },
      orderBy: { _count: { cameraName: 'desc' } },
      take: 5,
    }),
  ]);

  return {
    totalEvents,
    activeEvents,
    eventsToday,
    eventsWithMetadata,
    topCameras: topCameras.map(camera => ({
      name: camera.cameraName,
      count: camera._count.cameraName,
    })),
  };
};

/**
 * Formatear respuesta del evento
 */
function formatVehicleEventResponse(event: any): VehicleEventResponse {
  return {
    id: event.id,
    licensePlate: event.licensePlate,
    startTime: event.startTime,
    endTime: event.endTime,
    status: event.status,
    hasMetadata: event.hasMetadata,
    detections: event.detections.map((detection: any) => ({
      id: detection.id,
      cameraName: detection.cameraName,
      timestamp: detection.timestamp,
      videoPath: detection.videoPath,
      thumbnailPath: detection.thumbnailPath,
      confidence: detection.confidence,
    })),
    metadata: event.metadata,
  };
}

/**
 * Migrar evento legacy a VehicleEvent
 */
export const migrateLegacyEvent = async (legacyEventId: string): Promise<VehicleEventResponse> => {
  const legacyEvent = await prisma.event.findUnique({
    where: { id: legacyEventId },
    include: { metadata: true },
  });

  if (!legacyEvent) {
    throw new Error('Evento legacy no encontrado');
  }

  // Buscar si ya existe VehicleEvent para esta matrícula
  let vehicleEvent = await prisma.vehicleEvent.findFirst({
    where: {
      licensePlate: legacyEvent.licensePlate,
      startTime: {
        gte: new Date(legacyEvent.eventDateTime.getTime() - 30 * 60 * 1000), // 30 min antes
        lte: new Date(legacyEvent.eventDateTime.getTime() + 30 * 60 * 1000), // 30 min después
      },
    },
  });

  if (!vehicleEvent) {
    // Crear nuevo VehicleEvent
    vehicleEvent = await prisma.vehicleEvent.create({
      data: {
        licensePlate: legacyEvent.licensePlate,
        startTime: legacyEvent.eventDateTime,
        endTime: legacyEvent.eventDateTime,
        status: 'COMPLETED',
        hasMetadata: legacyEvent.hasMetadata,
      },
    });
  }

  // Crear Detection
  await prisma.detection.create({
    data: {
      eventId: vehicleEvent.id,
      cameraName: legacyEvent.cameraName,
      timestamp: legacyEvent.eventDateTime,
      videoPath: legacyEvent.videoFilename,
      thumbnailPath: legacyEvent.thumbnailPath,
      confidence: legacyEvent.confidence,
    },
  });

  return getVehicleEventById(vehicleEvent.id);
};