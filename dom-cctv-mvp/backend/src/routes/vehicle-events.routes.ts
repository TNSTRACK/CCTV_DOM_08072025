// src/routes/vehicle-events.routes.ts
// Rutas para eventos de vehículos con seguimiento multi-cámara

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  createVehicleDetection,
  searchVehicleEventsController,
  getVehicleEventByIdController,
  completeVehicleEventController,
  getVehicleEventStatsController,
  timeoutInactiveEventsController,
  migrateLegacyEventController,
  getDetectionVideo,
  getEventCameras,
} from '../controllers/vehicle-events.controller';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

/**
 * @route   POST /api/vehicle-events/detections
 * @desc    Procesar nueva detección de vehículo desde cámara ANPR
 * @access  Private
 * @body    { licensePlate, cameraName, timestamp, videoPath, thumbnailPath?, confidence? }
 */
router.post('/detections', createVehicleDetection);

/**
 * @route   GET /api/vehicle-events
 * @desc    Buscar eventos de vehículos con filtros
 * @access  Private
 * @query   licensePlate?, startDate?, endDate?, status?, hasMetadata?, page?, limit?
 */
router.get('/', searchVehicleEventsController);

/**
 * @route   GET /api/vehicle-events/stats
 * @desc    Obtener estadísticas de eventos
 * @access  Private
 */
router.get('/stats', getVehicleEventStatsController);

/**
 * @route   POST /api/vehicle-events/timeout
 * @desc    Finalizar eventos inactivos por timeout
 * @access  Private (solo administradores)
 * @body    { timeoutMinutes? }
 */
router.post('/timeout', timeoutInactiveEventsController);

/**
 * @route   GET /api/vehicle-events/:id
 * @desc    Obtener evento específico por ID
 * @access  Private
 */
router.get('/:id', getVehicleEventByIdController);

/**
 * @route   PUT /api/vehicle-events/:id/complete
 * @desc    Finalizar evento manualmente
 * @access  Private
 */
router.put('/:id/complete', completeVehicleEventController);

/**
 * @route   GET /api/vehicle-events/:eventId/cameras
 * @desc    Obtener lista de cámaras disponibles para un evento
 * @access  Private
 */
router.get('/:eventId/cameras', getEventCameras);

/**
 * @route   GET /api/vehicle-events/:eventId/detections/:detectionId/video
 * @desc    Obtener video específico de una detección
 * @access  Private
 */
router.get('/:eventId/detections/:detectionId/video', getDetectionVideo);

/**
 * @route   POST /api/vehicle-events/migrate/:legacyEventId
 * @desc    Migrar evento legacy a VehicleEvent
 * @access  Private (solo administradores)
 */
router.post('/migrate/:legacyEventId', migrateLegacyEventController);

export default router;