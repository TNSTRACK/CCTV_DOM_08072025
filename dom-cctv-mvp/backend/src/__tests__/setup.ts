// src/__tests__/setup.ts
// Configuración global para tests del backend DOM CCTV MVP

import { PrismaClient } from '@prisma/client';

// Mock de Prisma Client para evitar conexiones reales en tests
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    company: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    event: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
      groupBy: jest.fn(),
    },
    metadataEntry: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    $disconnect: jest.fn(),
  })),
}));

// Mock de bcryptjs para evitar hashing real en tests
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

// Mock de jsonwebtoken para evitar tokens reales en tests
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

// Configuración de timeout para tests
jest.setTimeout(30000);

// Variables de entorno para tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.DATABASE_URL = 'mysql://test:test@localhost:3306/test_db';

// Limpiar todos los mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
});

// Configurar console.error para mostrar errores en tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

// Helpers para tests
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  password: 'hashedpassword',
  firstName: 'Test',
  lastName: 'User',
  role: 'ADMINISTRATOR' as const,
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockCompany = {
  id: 'test-company-id',
  rut: '12345678-9',
  name: 'Test Company',
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockEvent = {
  id: 'test-event-id',
  licensePlate: 'ABC123',
  eventDateTime: new Date(),
  cameraName: 'Test Camera',
  videoFilename: 'test-video.mp4',
  thumbnailPath: 'test-thumbnail.jpg',
  hasMetadata: false,
  confidence: 95.0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockMetadata = {
  id: 'test-metadata-id',
  eventId: 'test-event-id',
  companyId: 'test-company-id',
  guideNumber: 'G-2025-001',
  guideDate: new Date(),
  cargoDescription: 'Test cargo description',
  workOrder: 'WO-2025-001',
  receptionistId: 'test-user-id',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock de Express Request y Response
export const mockRequest = (overrides = {}) => ({
  body: {},
  params: {},
  query: {},
  headers: {},
  user: mockUser,
  validatedData: {},
  validatedQuery: {},
  ...overrides,
});

export const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

export const mockNext = jest.fn();

// Helper para crear errores de Zod
export const createZodError = (field: string, message: string) => {
  const error = new Error('Validation error');
  error.name = 'ZodError';
  (error as any).errors = [
    {
      path: [field],
      message,
      code: 'custom',
    },
  ];
  return error;
};