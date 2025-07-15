// src/controllers/events.controller.ts
// Controlador de eventos ANPR para MVP DOM CCTV

import { Response } from 'express';
import path from 'path';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { asyncHandler, createError } from '../middleware/error.middleware';
import { EventSearchData } from '../utils/validation';
import {
  searchEvents,
  getEventById,
  getEventStats,
  getRecentEvents,
  getEventDays,
  createMetadata,
} from '../services/events.service';

/**
 * Buscar eventos con filtros y paginación
 * GET /api/events
 */
export const getEvents = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // Manejar query parameters directamente
  const {
    licensePlate,
    startDate,
    endDate,
    cameraName,
    companyId,
    hasMetadata,
    page = '1',
    limit = '25',
    sortBy,
    sortOrder
  } = req.query;

  const searchParams = {
    licensePlate: licensePlate as string,
    startDate: startDate as string,
    endDate: endDate as string,
    cameraName: cameraName as string,
    companyId: companyId as string,
    hasMetadata: hasMetadata === 'true' ? true : hasMetadata === 'false' ? false : undefined,
    page: parseInt(page as string) || 1,
    limit: parseInt(limit as string) || 25,
    sortBy: (sortBy as 'licensePlate' | 'eventDateTime') || 'eventDateTime',
    sortOrder: (sortOrder as 'asc' | 'desc') || 'desc',
  };
  
  const results = await searchEvents(searchParams);

  res.json({
    success: true,
    data: results,
  });
});

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
 * Crear metadatos para un evento
 * POST /api/events/metadata
 */
export const createEventMetadata = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const {
    eventId,
    companyId,
    guideNumber,
    guideDate,
    cargoDescription,
    workOrder,
    receptionistId,
  } = req.body;

  // Validaciones básicas
  if (!eventId || !companyId || !guideNumber || !guideDate || !cargoDescription || !workOrder || !receptionistId) {
    throw createError('Todos los campos son requeridos', 400);
  }

  try {
    const metadata = await createMetadata({
      eventId,
      companyId,
      guideNumber,
      guideDate: new Date(guideDate),
      cargoDescription,
      workOrder,
      receptionistId,
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
});