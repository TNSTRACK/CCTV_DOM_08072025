// src/routes/events.routes.ts
// Rutas de eventos ANPR para MVP DOM CCTV

import { Router } from 'express';
import {
  getEvents,
  getEvent,
  getEventVideo,
  getStats,
  getRecent,
  searchByLicensePlate,
  getUndocumented,
  getEventDaysController,
  createEventMetadata,
  syncHikvisionEvents,
  getHikvisionVideoURL,
  getHikvisionCameras,
  checkHikvisionHealth,
} from '../controllers/events.controller';

const router = Router();

/**
 * @route   GET /api/events/stats
 * @desc    Obtener estadísticas del dashboard
 * @access  Private (Admin y Operator)
 */
router.get('/stats', getStats);

/**
 * @route   GET /api/events/recent
 * @desc    Obtener eventos recientes
 * @access  Private (Admin y Operator)
 */
router.get('/recent', getRecent);

/**
 * @route   GET /api/events/days
 * @desc    Obtener días que tienen eventos en un rango de fechas
 * @access  Private (Admin y Operator)
 */
router.get('/days', getEventDaysController);

/**
 * @route   GET /api/events/undocumented
 * @desc    Obtener eventos sin documentar
 * @access  Private (Admin y Operator)
 */
router.get('/undocumented', getUndocumented);

/**
 * @route   GET /api/events/search/license-plate/:plate
 * @desc    Buscar eventos por matrícula específica
 * @access  Private (Admin y Operator)
 */
router.get('/search/license-plate/:plate', searchByLicensePlate);

/**
 * @route   POST /api/events/metadata
 * @desc    Crear metadatos para un evento
 * @access  Private (Admin y Operator)
 */
router.post('/metadata', createEventMetadata);

/**
 * @route   POST /api/events/sync
 * @desc    Sincronizar eventos desde Hikvision API
 * @access  Private (Admin only)
 */
router.post('/sync', syncHikvisionEvents);

/**
 * @route   GET /api/events/cameras
 * @desc    Obtener lista de cámaras desde Hikvision
 * @access  Private (Admin y Operator)
 */
router.get('/cameras', getHikvisionCameras);

/**
 * @route   GET /api/events/hikvision/health
 * @desc    Verificar estado de conexión con Hikvision
 * @access  Private (Admin y Operator)
 */
router.get('/hikvision/health', checkHikvisionHealth);

/**
 * @route   GET /api/events/:id/video
 * @desc    Obtener información del video del evento
 * @access  Private (Admin y Operator)
 */
router.get('/:id/video', getEventVideo);

/**
 * @route   GET /api/events/:id/video/hikvision
 * @desc    Obtener URL de video real desde Hikvision
 * @access  Private (Admin y Operator)
 */
router.get('/:id/video/hikvision', getHikvisionVideoURL);

/**
 * @route   GET /api/events/:id
 * @desc    Obtener evento por ID
 * @access  Private (Admin y Operator)
 */
router.get('/:id', getEvent);

/**
 * @route   GET /api/events
 * @desc    Buscar eventos con filtros
 * @access  Private (Admin y Operator)
 */
router.get('/', getEvents);

export default router;