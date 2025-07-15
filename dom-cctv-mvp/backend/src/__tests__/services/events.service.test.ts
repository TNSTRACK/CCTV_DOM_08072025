// src/__tests__/services/events.service.test.ts
// Tests para el servicio de eventos - DOM CCTV MVP

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { 
  searchEvents, 
  getEventById, 
  getEventStats, 
  getRecentEvents,
  createMetadata
} from '../../services/events.service';
import { mockEvent, mockMetadata, mockCompany, mockUser } from '../setup';

// Mock del PrismaClient
const mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;

describe('Events Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchEvents', () => {
    it('debe buscar eventos sin filtros', async () => {
      const mockEvents = [mockEvent, { ...mockEvent, id: 'event-2' }];
      mockPrisma.event.findMany = jest.fn().mockResolvedValue(mockEvents);
      mockPrisma.event.count = jest.fn().mockResolvedValue(2);

      const result = await searchEvents({
        page: 1,
        limit: 25,
        sortBy: 'eventDateTime',
        sortOrder: 'desc',
      });

      expect(result).toEqual({
        events: mockEvents,
        totalCount: 2,
        currentPage: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      expect(mockPrisma.event.findMany).toHaveBeenCalledWith({
        where: {},
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
        orderBy: { eventDateTime: 'desc' },
        take: 25,
        skip: 0,
      });
    });

    it('debe buscar eventos por matrícula', async () => {
      const mockEvents = [mockEvent];
      mockPrisma.event.findMany = jest.fn().mockResolvedValue(mockEvents);
      mockPrisma.event.count = jest.fn().mockResolvedValue(1);

      const result = await searchEvents({
        licensePlate: 'ABC123',
        page: 1,
        limit: 25,
        sortBy: 'eventDateTime',
        sortOrder: 'desc',
      });

      expect(result.events).toEqual(mockEvents);
      expect(mockPrisma.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            licensePlate: {
              contains: 'ABC123',
            },
          },
        })
      );
    });

    it('debe buscar eventos por rango de fechas', async () => {
      const mockEvents = [mockEvent];
      mockPrisma.event.findMany = jest.fn().mockResolvedValue(mockEvents);
      mockPrisma.event.count = jest.fn().mockResolvedValue(1);

      const startDate = '2025-07-01';
      const endDate = '2025-07-15';

      await searchEvents({
        startDate,
        endDate,
        page: 1,
        limit: 25,
        sortBy: 'eventDateTime',
        sortOrder: 'desc',
      });

      expect(mockPrisma.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            eventDateTime: {
              gte: startDate,
              lte: endDate,
            },
          },
        })
      );
    });

    it('debe buscar eventos por cámara', async () => {
      const mockEvents = [mockEvent];
      mockPrisma.event.findMany = jest.fn().mockResolvedValue(mockEvents);
      mockPrisma.event.count = jest.fn().mockResolvedValue(1);

      await searchEvents({
        cameraName: 'Entrada',
        page: 1,
        limit: 25,
        sortBy: 'eventDateTime',
        sortOrder: 'desc',
      });

      expect(mockPrisma.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            cameraName: {
              contains: 'Entrada',
              mode: 'insensitive',
            },
          },
        })
      );
    });

    it('debe buscar eventos por estado de metadatos', async () => {
      const mockEvents = [mockEvent];
      mockPrisma.event.findMany = jest.fn().mockResolvedValue(mockEvents);
      mockPrisma.event.count = jest.fn().mockResolvedValue(1);

      await searchEvents({
        hasMetadata: true,
        page: 1,
        limit: 25,
        sortBy: 'eventDateTime',
        sortOrder: 'desc',
      });

      expect(mockPrisma.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            hasMetadata: true,
          },
        })
      );
    });

    it('debe manejar paginación correctamente', async () => {
      const mockEvents = [mockEvent];
      mockPrisma.event.findMany = jest.fn().mockResolvedValue(mockEvents);
      mockPrisma.event.count = jest.fn().mockResolvedValue(50);

      const result = await searchEvents({
        page: 2,
        limit: 10,
        sortBy: 'eventDateTime',
        sortOrder: 'desc',
      });

      expect(result.currentPage).toBe(2);
      expect(result.totalPages).toBe(5);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPreviousPage).toBe(true);

      expect(mockPrisma.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
          skip: 10,
        })
      );
    });

    it('debe ordenar por matrícula ascendente', async () => {
      const mockEvents = [mockEvent];
      mockPrisma.event.findMany = jest.fn().mockResolvedValue(mockEvents);
      mockPrisma.event.count = jest.fn().mockResolvedValue(1);

      await searchEvents({
        page: 1,
        limit: 25,
        sortBy: 'licensePlate',
        sortOrder: 'asc',
      });

      expect(mockPrisma.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { licensePlate: 'asc' },
        })
      );
    });
  });

  describe('getEventById', () => {
    it('debe obtener evento por ID con metadatos', async () => {
      const eventWithMetadata = {
        ...mockEvent,
        metadata: {
          ...mockMetadata,
          company: mockCompany,
          receptionist: mockUser,
        },
      };

      mockPrisma.event.findUnique = jest.fn().mockResolvedValue(eventWithMetadata);

      const result = await getEventById('test-event-id');

      expect(result).toEqual(eventWithMetadata);
      expect(mockPrisma.event.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-event-id' },
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
    });

    it('debe lanzar error si evento no existe', async () => {
      mockPrisma.event.findUnique = jest.fn().mockResolvedValue(null);

      await expect(getEventById('nonexistent-id')).rejects.toThrow('Evento no encontrado');
    });
  });

  describe('getEventStats', () => {
    it('debe calcular estadísticas del dashboard', async () => {
      const mockStats = {
        totalEvents: 100,
        eventsToday: 10,
        eventsWithMetadata: 80,
        avgConfidence: 95.5,
        topCameras: [
          { cameraName: 'Entrada Principal', _count: { cameraName: 50 } },
          { cameraName: 'Salida', _count: { cameraName: 30 } },
        ],
      };

      mockPrisma.event.count = jest.fn()
        .mockResolvedValueOnce(100) // totalEvents
        .mockResolvedValueOnce(10)  // eventsToday
        .mockResolvedValueOnce(80); // eventsWithMetadata

      mockPrisma.event.aggregate = jest.fn().mockResolvedValue({
        _avg: { confidence: 95.5 },
      });

      mockPrisma.event.groupBy = jest.fn().mockResolvedValue(mockStats.topCameras);

      const result = await getEventStats();

      expect(result).toEqual({
        totalEvents: 100,
        eventsToday: 10,
        eventsWithMetadata: 80,
        averageConfidence: 95.5,
        topCameras: [
          { name: 'Entrada Principal', count: 50 },
          { name: 'Salida', count: 30 },
        ],
      });

      expect(mockPrisma.event.count).toHaveBeenCalledTimes(3);
      expect(mockPrisma.event.aggregate).toHaveBeenCalledWith({
        _avg: { confidence: true },
      });
      expect(mockPrisma.event.groupBy).toHaveBeenCalledWith({
        by: ['cameraName'],
        _count: { cameraName: true },
        orderBy: { _count: { cameraName: 'desc' } },
        take: 5,
      });
    });

    it('debe manejar caso sin eventos', async () => {
      mockPrisma.event.count = jest.fn().mockResolvedValue(0);
      mockPrisma.event.aggregate = jest.fn().mockResolvedValue({
        _avg: { confidence: null },
      });
      mockPrisma.event.groupBy = jest.fn().mockResolvedValue([]);

      const result = await getEventStats();

      expect(result).toEqual({
        totalEvents: 0,
        eventsToday: 0,
        eventsWithMetadata: 0,
        averageConfidence: 0,
        topCameras: [],
      });
    });
  });

  describe('getRecentEvents', () => {
    it('debe obtener eventos recientes', async () => {
      const mockEvents = [mockEvent, { ...mockEvent, id: 'event-2' }];
      mockPrisma.event.findMany = jest.fn().mockResolvedValue(mockEvents);

      const result = await getRecentEvents(10);

      expect(result).toEqual(mockEvents);
      expect(mockPrisma.event.findMany).toHaveBeenCalledWith({
        orderBy: { eventDateTime: 'desc' },
        take: 10,
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
      });
    });

    it('debe limitar a 50 eventos máximo', async () => {
      const mockEvents = [mockEvent];
      mockPrisma.event.findMany = jest.fn().mockResolvedValue(mockEvents);

      await getRecentEvents(100);

      expect(mockPrisma.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 50,
        })
      );
    });
  });

  describe('createMetadata', () => {
    it('debe crear metadatos para un evento', async () => {
      const eventWithoutMetadata = { ...mockEvent, hasMetadata: false };
      const createdMetadata = { ...mockMetadata };

      mockPrisma.event.findUnique = jest.fn().mockResolvedValue(eventWithoutMetadata);
      mockPrisma.metadataEntry.create = jest.fn().mockResolvedValue(createdMetadata);
      mockPrisma.event.update = jest.fn().mockResolvedValue({
        ...eventWithoutMetadata,
        hasMetadata: true,
      });

      const metadataData = {
        eventId: 'test-event-id',
        companyId: 'test-company-id',
        guideNumber: 'G-2025-001',
        guideDate: new Date(),
        cargoDescription: 'Test cargo',
        workOrder: 'WO-2025-001',
        receptionistId: 'test-user-id',
      };

      const result = await createMetadata(metadataData);

      expect(result).toEqual(createdMetadata);
      expect(mockPrisma.event.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-event-id' },
      });
      expect(mockPrisma.metadataEntry.create).toHaveBeenCalledWith({
        data: metadataData,
      });
      expect(mockPrisma.event.update).toHaveBeenCalledWith({
        where: { id: 'test-event-id' },
        data: { hasMetadata: true },
      });
    });

    it('debe lanzar error si evento no existe', async () => {
      mockPrisma.event.findUnique = jest.fn().mockResolvedValue(null);

      const metadataData = {
        eventId: 'nonexistent-id',
        companyId: 'test-company-id',
        guideNumber: 'G-2025-001',
        guideDate: new Date(),
        cargoDescription: 'Test cargo',
        workOrder: 'WO-2025-001',
        receptionistId: 'test-user-id',
      };

      await expect(createMetadata(metadataData)).rejects.toThrow('Evento no encontrado');
    });

    it('debe lanzar error si evento ya tiene metadatos', async () => {
      const eventWithMetadata = { ...mockEvent, hasMetadata: true };
      mockPrisma.event.findUnique = jest.fn().mockResolvedValue(eventWithMetadata);

      const metadataData = {
        eventId: 'test-event-id',
        companyId: 'test-company-id',
        guideNumber: 'G-2025-001',
        guideDate: new Date(),
        cargoDescription: 'Test cargo',
        workOrder: 'WO-2025-001',
        receptionistId: 'test-user-id',
      };

      await expect(createMetadata(metadataData)).rejects.toThrow('ya tiene metadatos');
    });
  });
});

describe('Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe manejar error de base de datos en searchEvents', async () => {
    mockPrisma.event.findMany = jest.fn().mockRejectedValue(new Error('Database error'));

    await expect(searchEvents({
      page: 1,
      limit: 25,
      sortBy: 'eventDateTime',
      sortOrder: 'desc',
    })).rejects.toThrow('Database error');
  });

  it('debe manejar límite de paginación extremo', async () => {
    const mockEvents = [mockEvent];
    mockPrisma.event.findMany = jest.fn().mockResolvedValue(mockEvents);
    mockPrisma.event.count = jest.fn().mockResolvedValue(1);

    const result = await searchEvents({
      page: 999,
      limit: 1,
      sortBy: 'eventDateTime',
      sortOrder: 'desc',
    });

    expect(result.currentPage).toBe(999);
    expect(result.totalPages).toBe(1);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(true);
  });

  it('debe manejar búsqueda por matrícula vacía', async () => {
    const mockEvents = [mockEvent];
    mockPrisma.event.findMany = jest.fn().mockResolvedValue(mockEvents);
    mockPrisma.event.count = jest.fn().mockResolvedValue(1);

    await searchEvents({
      licensePlate: '',
      page: 1,
      limit: 25,
      sortBy: 'eventDateTime',
      sortOrder: 'desc',
    });

    expect(mockPrisma.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          licensePlate: {
            contains: '',
          },
        },
      })
    );
  });
});