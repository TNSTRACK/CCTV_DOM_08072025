// src/controllers/events.controller.ts
// Controlador de eventos ANPR para MVP DOM CCTV

import { Response } from 'express';
import path from 'path';
import { z } from 'zod';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { asyncHandler, createError } from '../middleware/error.middleware';
import { 
  EventSearchData, 
  CreateMetadataData,
  eventSearchSchema, 
  createMetadataSchema,
  validateQuery,
  validateRequest
} from '../utils/validation';
import {
  searchEvents,
  getEventById,
  getEventStats,
  getRecentEvents,
  getEventDays,
  createMetadata,
} from '../services/events.service';
import { 
  getHikvisionService, 
  convertHikvisionEventToDBFormat,
  type ANPRSearchParams
} from '../services/hikvision.service';

/**
 * Buscar eventos con filtros y paginación
 * GET /api/events
 * PATRÓN: Validación con Zod schema para query parameters
 */
export const getEvents = [
  validateQuery(eventSearchSchema),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const searchParams = req.validatedQuery as EventSearchData;
    
    const results = await searchEvents(searchParams);

    res.json({
      success: true,
      data: results,
    });
  })
];

/**
 * Obtener evento por ID con metadatos completos
 * GET /api/events/:id
 */
export const getEvent = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID de evento requerido', 400);
  }

  try {
    const event = await getEventById(id);
    
    res.json({
      success: true,
      data: { event },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Evento no encontrado') {
      throw createError('Evento no encontrado', 404);
    }
    throw error;
  }
});

/**
 * Obtener URL del video del evento
 * GET /api/events/:id/video
 */
export const getEventVideo = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID de evento requerido', 400);
  }

  try {
    const event = await getEventById(id);
    
    // PATRÓN: Construir URL completa del video
    const videoUrl = `/uploads/videos/${event.videoFilename}`;
    const thumbnailUrl = event.thumbnailPath ? `/uploads/${event.thumbnailPath}` : null;
    
    res.json({
      success: true,
      data: {
        videoUrl,
        thumbnailUrl,
        filename: event.videoFilename,
        eventInfo: {
          id: event.id,
          licensePlate: event.licensePlate,
          eventDateTime: event.eventDateTime,
          cameraName: event.cameraName,
          confidence: event.confidence,
        },
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Evento no encontrado') {
      throw createError('Evento no encontrado', 404);
    }
    throw error;
  }
});

/**
 * Obtener estadísticas del dashboard
 * GET /api/events/stats
 */
export const getStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const stats = await getEventStats();

  res.json({
    success: true,
    data: { stats },
  });
});

/**
 * Obtener eventos recientes para el dashboard
 * GET /api/events/recent
 */
export const getRecent = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  
  if (limit > 50) {
    throw createError('Límite máximo de 50 eventos', 400);
  }

  const events = await getRecentEvents(limit);

  res.json({
    success: true,
    data: { events },
  });
});

/**
 * Obtener días que tienen eventos en un rango de fechas
 * Para destacar días con eventos en el DatePicker
 * GET /api/events/days
 */
export const getEventDaysController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    throw createError('startDate y endDate son requeridos', 400);
  }

  // Validar que las fechas sean válidas
  const start = new Date(startDate as string);
  const end = new Date(endDate as string);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw createError('Fechas inválidas', 400);
  }

  if (start > end) {
    throw createError('La fecha de inicio debe ser anterior a la fecha de fin', 400);
  }

  // Limitar a un rango máximo de 3 meses para evitar sobrecarga
  const maxDays = 90;
  const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff > maxDays) {
    throw createError(`El rango máximo permitido es de ${maxDays} días`, 400);
  }

  const result = await getEventDays(startDate as string, endDate as string);

  res.json({
    success: true,
    data: result,
  });
});

/**
 * Buscar eventos por matrícula (endpoint optimizado)
 * GET /api/events/search/license-plate/:plate
 */
export const searchByLicensePlate = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { plate } = req.params;
  const limit = parseInt(req.query.limit as string) || 25;

  if (!plate) {
    throw createError('Matrícula requerida', 400);
  }

  // Usar el servicio de búsqueda con filtro de matrícula
  const searchParams: EventSearchData = {
    licensePlate: plate,
    page: 1,
    limit: Math.min(limit, 100), // Máximo 100 resultados
    sortBy: 'eventDateTime',
    sortOrder: 'desc',
  };

  const results = await searchEvents(searchParams);

  res.json({
    success: true,
    data: results,
  });
});

/**
 * Obtener eventos sin documentar
 * GET /api/events/undocumented
 */
export const getUndocumented = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 25;

  const searchParams: EventSearchData = {
    hasMetadata: false,
    page,
    limit: Math.min(limit, 100),
    sortBy: 'eventDateTime',
    sortOrder: 'desc',
  };

  const results = await searchEvents(searchParams);

  res.json({
    success: true,
    data: results,
  });
});

/**
 * Sincronizar eventos desde Hikvision API
 * POST /api/events/sync
 */
export const syncHikvisionEvents = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { startDate, endDate, licensePlate } = req.body;

  // Validar fechas requeridas
  if (!startDate || !endDate) {
    throw createError('startDate y endDate son requeridos', 400);
  }

  try {
    const hikvisionService = getHikvisionService();
    
    // Verificar conectividad
    const healthCheck = await hikvisionService.healthCheck();
    if (healthCheck.status !== 'healthy') {
      throw createError(`Hikvision API no disponible: ${healthCheck.message}`, 503);
    }

    const searchParams: ANPRSearchParams = {
      startTime: startDate,
      endTime: endDate,
      licensePlate: licensePlate?.toUpperCase(),
      pageSize: 100,
    };

    const result = await hikvisionService.searchANPREvents(searchParams);
    
    // Convertir eventos de Hikvision a formato de base de datos
    const convertedEvents = result.events.map(convertHikvisionEventToDBFormat);

    res.json({
      success: true,
      data: {
        events: convertedEvents,
        totalCount: result.totalCount,
        syncedAt: new Date().toISOString(),
      },
      message: `${result.events.length} eventos sincronizados desde Hikvision`,
    });
  } catch (error) {
    console.error('Error syncing Hikvision events:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw createError(`Error al sincronizar eventos: ${errorMessage}`, 500);
  }
});

/**
 * Obtener URL de video real desde Hikvision
 * GET /api/events/:id/video/hikvision
 */
export const getHikvisionVideoURL = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID de evento requerido', 400);
  }

  try {
    const event = await getEventById(id);
    
    // Verificar que el evento tenga información de cámara
    if (!event.cameraName) {
      throw createError('Evento sin información de cámara', 400);
    }

    const hikvisionService = getHikvisionService();
    
    // Calcular tiempo de inicio y fin del video (evento ± 30 segundos)
    const eventTime = new Date(event.eventDateTime);
    const startTime = new Date(eventTime.getTime() - 30000).toISOString();
    const endTime = new Date(eventTime.getTime() + 30000).toISOString();

    // Obtener URL del video desde Hikvision
    const videoUrl = await hikvisionService.getVideoPlaybackURL({
      cameraId: event.cameraName, // Usar nombre de cámara como ID
      startTime,
      endTime,
    });

    res.json({
      success: true,
      data: {
        videoUrl,
        startTime,
        endTime,
        eventInfo: {
          id: event.id,
          licensePlate: event.licensePlate,
          eventDateTime: event.eventDateTime,
          cameraName: event.cameraName,
          confidence: event.confidence,
        },
      },
    });
  } catch (error) {
    console.error('Error getting Hikvision video URL:', error);
    if (error instanceof Error && error.message === 'Evento no encontrado') {
      throw createError('Evento no encontrado', 404);
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw createError(`Error al obtener URL de video: ${errorMessage}`, 500);
  }
});

/**
 * Obtener lista de cámaras disponibles en Hikvision
 * GET /api/events/cameras
 */
export const getHikvisionCameras = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const hikvisionService = getHikvisionService();
    
    const cameras = await hikvisionService.getCameraList();

    res.json({
      success: true,
      data: { cameras },
    });
  } catch (error) {
    console.error('Error getting Hikvision cameras:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw createError(`Error al obtener cámaras: ${errorMessage}`, 500);
  }
});

/**
 * Verificar estado de conexión con Hikvision
 * GET /api/events/hikvision/health
 */
export const checkHikvisionHealth = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const hikvisionService = getHikvisionService();
    
    const healthCheck = await hikvisionService.healthCheck();

    res.json({
      success: true,
      data: healthCheck,
    });
  } catch (error) {
    console.error('Error checking Hikvision health:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(503).json({
      success: false,
      data: { status: 'unhealthy', message: errorMessage },
    });
  }
});

/**
 * Crear metadatos para un evento
 * POST /api/events/metadata
 * PATRÓN: Validación con Zod schema para request body
 */
export const createEventMetadata = [
  validateRequest(createMetadataSchema),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const validatedData = req.validatedData as CreateMetadataData;
    
    try {
      const metadata = await createMetadata({
        eventId: validatedData.eventId,
        companyId: validatedData.companyId,
        guideNumber: validatedData.guideNumber,
        guideDate: new Date(validatedData.guideDate),
        cargoDescription: validatedData.cargoDescription,
        workOrder: validatedData.workOrder,
        receptionistId: validatedData.receptionistId,
      });

      res.status(201).json({
        success: true,
        data: metadata,
        message: 'Metadatos creados exitosamente',
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Evento no encontrado')) {
          throw createError('Evento no encontrado', 404);
        }
        if (error.message.includes('ya tiene metadatos')) {
          throw createError('Este evento ya tiene metadatos asociados', 409);
        }
      }
      throw error;
    }
  })
];