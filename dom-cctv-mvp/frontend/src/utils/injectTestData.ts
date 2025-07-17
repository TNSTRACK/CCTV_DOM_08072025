// src/utils/injectTestData.ts
// Utilidad para inyectar datos de prueba en la página principal

import { Event } from '../types';

// Función para inyectar eventos de prueba multi-cámara en datos reales
export const injectMultiCameraTestData = (realEvents: Event[]): Event[] => {
  const testEvents: Event[] = [
    {
      id: 'test-abc123-1',
      licensePlate: 'ABC123',
      eventDateTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      cameraName: 'Entrada Principal ANPR',
      videoFilename: 'videos/sample_anpr_video.mp4',
      thumbnailPath: 'thumbnails/thumb_1.jpg',
      hasMetadata: true,
      confidence: 98.5,
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      metadata: {
        id: 'meta-1',
        eventId: 'test-abc123-1',
        companyId: 'company-1',
        guideNumber: 'GU-TEST-001',
        guideDate: new Date().toISOString(),
        cargoDescription: 'Encofrados de prueba',
        workOrder: 'WO-TEST-001',
        receptionistId: 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        company: {
          id: 'company-1',
          name: 'Empresa de Prueba',
          rut: '12345678-9',
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        receptionist: {
          id: 'user-1',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
        },
      },
    },
    {
      id: 'test-abc123-2',
      licensePlate: 'ABC123',
      eventDateTime: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
      cameraName: 'Zona Descarga Norte',
      videoFilename: 'videos/sample_anpr_video.mp4',
      thumbnailPath: 'thumbnails/thumb_2.jpg',
      hasMetadata: false,
      confidence: 96.2,
      createdAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    },
    {
      id: 'test-abc123-3',
      licensePlate: 'ABC123',
      eventDateTime: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      cameraName: 'Área Conteo 1',
      videoFilename: 'videos/sample_anpr_video.mp4',
      thumbnailPath: 'thumbnails/thumb_3.jpg',
      hasMetadata: false,
      confidence: 94.7,
      createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    },
    {
      id: 'test-abc123-4',
      licensePlate: 'ABC123',
      eventDateTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      cameraName: 'Salida Principal ANPR',
      videoFilename: 'videos/sample_anpr_video.mp4',
      thumbnailPath: 'thumbnails/thumb_4.jpg',
      hasMetadata: false,
      confidence: 97.8,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: 'test-xyz789-1',
      licensePlate: 'XYZ789',
      eventDateTime: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      cameraName: 'Entrada Principal ANPR',
      videoFilename: 'videos/sample_anpr_video.mp4',
      thumbnailPath: 'thumbnails/thumb_5.jpg',
      hasMetadata: false,
      confidence: 93.4,
      createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    },
    {
      id: 'test-xyz789-2',
      licensePlate: 'XYZ789',
      eventDateTime: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      cameraName: 'Zona Descarga Sur',
      videoFilename: 'videos/sample_anpr_video.mp4',
      thumbnailPath: 'thumbnails/thumb_6.jpg',
      hasMetadata: false,
      confidence: 91.8,
      createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    },
  ];

  // Combinar eventos de prueba con eventos reales
  return [...testEvents, ...realEvents];
};

// Función para verificar si hay eventos multi-cámara en los datos
export const detectMultiCameraEvents = (events: Event[]): { [licensePlate: string]: Event[] } => {
  const grouped: { [licensePlate: string]: Event[] } = {};
  
  events.forEach(event => {
    if (!grouped[event.licensePlate]) {
      grouped[event.licensePlate] = [];
    }
    grouped[event.licensePlate].push(event);
  });

  // Filtrar solo matrículas con múltiples eventos
  const multiCameraEvents: { [licensePlate: string]: Event[] } = {};
  Object.keys(grouped).forEach(licensePlate => {
    if (grouped[licensePlate].length > 1) {
      multiCameraEvents[licensePlate] = grouped[licensePlate];
    }
  });

  return multiCameraEvents;
};