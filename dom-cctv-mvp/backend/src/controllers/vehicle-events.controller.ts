// src/controllers/vehicle-events.controller.ts
// Controlador para eventos de vehículos con seguimiento multi-cámara

import { Request, Response } from 'express';
import { 
  processVehicleDetection, 
  searchVehicleEvents, 
  getVehicleEventById,
  completeVehicleEvent,
  getVehicleEventStats,
  timeoutInactiveEvents,
  migrateLegacyEvent,
  VehicleEventSearchFilters
} from '../services/vehicle-events.service';

/**
 * Procesar nueva detección de vehículo desde cámara ANPR
 * POST /api/vehicle-events/detections
 */
export const createVehicleDetection = async (req: Request, res: Response) => {
  try {
    const { licensePlate, cameraName, timestamp, videoPath, thumbnailPath, confidence } = req.body;

    if (!licensePlate || !cameraName || !timestamp || !videoPath) {
      return res.status(400).json({
        error: 'Campos requeridos: licensePlate, cameraName, timestamp, videoPath'
      });
    }

    const event = await processVehicleDetection({
      licensePlate,
      cameraName,
      timestamp: new Date(timestamp),
      videoPath,
      thumbnailPath,
      confidence,
    });

    res.status(201).json({
      success: true,
      data: event,
      message: 'Detección procesada exitosamente'
    });
  } catch (error) {
    console.error('Error al procesar detección:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

/**
 * Buscar eventos de vehículos con filtros
 * GET /api/vehicle-events
 */
export const searchVehicleEventsController = async (req: Request, res: Response) => {
  try {
    const filters: VehicleEventSearchFilters = {
      licensePlate: req.query.licensePlate as string,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      status: req.query.status as any,
      hasMetadata: req.query.hasMetadata ? req.query.hasMetadata === 'true' : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    };

    const result = await searchVehicleEvents(filters);

    res.json({
      success: true,
      data: result,
      message: 'Eventos obtenidos exitosamente'
    });
  } catch (error) {
    console.error('Error al buscar eventos:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

/**
 * Obtener evento específico por ID
 * GET /api/vehicle-events/:id
 */
export const getVehicleEventByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const event = await getVehicleEventById(id);

    res.json({
      success: true,
      data: event,
      message: 'Evento obtenido exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener evento:', error);
    
    if (error instanceof Error && error.message === 'Evento no encontrado') {
      return res.status(404).json({
        error: 'Evento no encontrado',
        message: 'El evento especificado no existe'
      });
    }

    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

/**
 * Finalizar evento manualmente
 * PUT /api/vehicle-events/:id/complete
 */
export const completeVehicleEventController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const event = await completeVehicleEvent(id);

    res.json({
      success: true,
      data: event,
      message: 'Evento finalizado exitosamente'
    });
  } catch (error) {
    console.error('Error al finalizar evento:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

/**
 * Obtener estadísticas de eventos
 * GET /api/vehicle-events/stats
 */
export const getVehicleEventStatsController = async (req: Request, res: Response) => {
  try {
    const stats = await getVehicleEventStats();

    res.json({
      success: true,
      data: stats,
      message: 'Estadísticas obtenidas exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

/**
 * Finalizar eventos inactivos por timeout
 * POST /api/vehicle-events/timeout
 */
export const timeoutInactiveEventsController = async (req: Request, res: Response) => {
  try {
    const { timeoutMinutes = 30 } = req.body;

    const count = await timeoutInactiveEvents(timeoutMinutes);

    res.json({
      success: true,
      data: { eventsTimedOut: count },
      message: `${count} eventos finalizados por timeout`
    });
  } catch (error) {
    console.error('Error al finalizar eventos por timeout:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

/**
 * Migrar evento legacy a VehicleEvent
 * POST /api/vehicle-events/migrate/:legacyEventId
 */
export const migrateLegacyEventController = async (req: Request, res: Response) => {
  try {
    const { legacyEventId } = req.params;

    const event = await migrateLegacyEvent(legacyEventId);

    res.json({
      success: true,
      data: event,
      message: 'Evento migrado exitosamente'
    });
  } catch (error) {
    console.error('Error al migrar evento:', error);
    
    if (error instanceof Error && error.message === 'Evento legacy no encontrado') {
      return res.status(404).json({
        error: 'Evento legacy no encontrado',
        message: 'El evento especificado no existe'
      });
    }

    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

/**
 * Obtener video específico de una detección
 * GET /api/vehicle-events/:eventId/detections/:detectionId/video
 */
export const getDetectionVideo = async (req: Request, res: Response) => {
  try {
    const { eventId, detectionId } = req.params;

    const event = await getVehicleEventById(eventId);
    const detection = event.detections.find(d => d.id === detectionId);

    if (!detection) {
      return res.status(404).json({
        error: 'Detección no encontrada',
        message: 'La detección especificada no existe en este evento'
      });
    }

    // Devolver información del video para que el frontend pueda mostrarlo
    res.json({
      success: true,
      data: {
        videoPath: detection.videoPath,
        thumbnailPath: detection.thumbnailPath,
        cameraName: detection.cameraName,
        timestamp: detection.timestamp,
        confidence: detection.confidence,
      },
      message: 'Información de video obtenida exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener video:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

/**
 * Obtener lista de cámaras disponibles para un evento
 * GET /api/vehicle-events/:eventId/cameras
 */
export const getEventCameras = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    const event = await getVehicleEventById(eventId);

    const cameras = event.detections.map(detection => ({
      cameraName: detection.cameraName,
      timestamp: detection.timestamp,
      hasVideo: !!detection.videoPath,
      hasThumbnail: !!detection.thumbnailPath,
      detectionId: detection.id,
    }));

    res.json({
      success: true,
      data: {
        eventId: event.id,
        licensePlate: event.licensePlate,
        cameras,
      },
      message: 'Lista de cámaras obtenida exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener cámaras:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};