// src/test/setup.ts
// Configuración global para tests del frontend DOM CCTV MVP

import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock de window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock de ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock de IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock de HTMLMediaElement
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: vi.fn().mockImplementation(() => Promise.resolve()),
});

Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(HTMLMediaElement.prototype, 'load', {
  writable: true,
  value: vi.fn(),
});

// Mock de URL.createObjectURL
Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: vi.fn(() => 'mocked-url'),
});

// Mock de URL.revokeObjectURL
Object.defineProperty(URL, 'revokeObjectURL', {
  writable: true,
  value: vi.fn(),
});

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock de sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock,
});

// Mock de fetch
global.fetch = vi.fn();

// Mock de console methods para tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = vi.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

// Limpiar mocks después de cada test
afterEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
});

// Configuración de timeout para tests
vi.setTimeout(10000);

// Variables de entorno para tests
process.env.VITE_API_URL = 'http://localhost:3001';
process.env.NODE_ENV = 'test';

// Helpers para tests
export const mockLocalStorage = localStorageMock;

export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'ADMINISTRATOR' as const,
};

export const mockCompany = {
  id: 'test-company-id',
  rut: '12345678-9',
  name: 'Test Company',
  active: true,
};

export const mockEvent = {
  id: 'test-event-id',
  licensePlate: 'ABC123',
  eventDateTime: '2025-07-15T10:30:00Z',
  cameraName: 'Test Camera',
  videoFilename: 'test-video.mp4',
  thumbnailPath: 'test-thumbnail.jpg',
  hasMetadata: false,
  confidence: 95.0,
};

export const mockMetadata = {
  id: 'test-metadata-id',
  eventId: 'test-event-id',
  companyId: 'test-company-id',
  guideNumber: 'G-2025-001',
  guideDate: '2025-07-15T10:30:00Z',
  cargoDescription: 'Test cargo description',
  workOrder: 'WO-2025-001',
  receptionistId: 'test-user-id',
};

// Helper para crear mock de React Query
export const createQueryClientMock = () => ({
  getQueryData: vi.fn(),
  setQueryData: vi.fn(),
  invalidateQueries: vi.fn(),
  prefetchQuery: vi.fn(),
  clear: vi.fn(),
  removeQueries: vi.fn(),
  resetQueries: vi.fn(),
  cancelQueries: vi.fn(),
  getDefaultOptions: vi.fn(),
  setDefaultOptions: vi.fn(),
});

// Helper para crear mock de router
export const createMockRouter = (overrides = {}) => ({
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
  route: '/',
  ...overrides,
});

// Helper para crear mock de axios response
export const createMockAxiosResponse = (data: any, status = 200) => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config: {},
});

// Helper para crear mock de error de axios
export const createMockAxiosError = (message: string, status = 400) => ({
  response: {
    data: { message },
    status,
    statusText: 'Bad Request',
    headers: {},
    config: {},
  },
  request: {},
  message,
  config: {},
  isAxiosError: true,
});

// Mock de video.js para tests
vi.mock('video.js', () => ({
  default: vi.fn(() => ({
    ready: vi.fn(),
    src: vi.fn(),
    play: vi.fn(),
    pause: vi.fn(),
    dispose: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    currentTime: vi.fn(),
    duration: vi.fn(),
  })),
}));

// Mock de react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' }),
    useParams: () => ({}),
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
  };
});

// Mock de react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
  Toaster: () => null,
}));

console.log('Test setup loaded successfully');