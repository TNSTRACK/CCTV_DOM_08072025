// src/types/index.ts
// Tipos TypeScript para el frontend del MVP DOM CCTV

export type UserRole = 'ADMINISTRATOR' | 'OPERATOR';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  rut: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  licensePlate: string;
  eventDateTime: string;
  cameraName: string;
  videoFilename: string;
  thumbnailPath?: string;
  hasMetadata: boolean;
  confidence: number;
  createdAt: string;
  updatedAt: string;
  metadata?: MetadataEntry;
}

// Nuevos tipos para eventos multi-cámara
export type VehicleEventStatus = 'ACTIVE' | 'COMPLETED' | 'TIMEOUT';

export interface Detection {
  id: string;
  cameraName: string;
  timestamp: string;
  videoPath: string;
  thumbnailPath?: string;
  confidence: number;
}

export interface VehicleEvent {
  id: string;
  licensePlate: string;
  startTime: string;
  endTime?: string;
  status: VehicleEventStatus;
  hasMetadata: boolean;
  detections: Detection[];
  metadata?: MetadataEntry;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleEventSearchFilters {
  licensePlate?: string;
  startDate?: string;
  endDate?: string;
  status?: VehicleEventStatus;
  hasMetadata?: boolean;
  page?: number;
  limit?: number;
}

export interface VehicleEventStats {
  totalEvents: number;
  activeEvents: number;
  eventsToday: number;
  eventsWithMetadata: number;
  topCameras: Array<{ name: string; count: number }>;
}

export interface MetadataEntry {
  id: string;
  eventId: string;
  companyId: string;
  guideNumber: string;
  guideDate: string;
  cargoDescription: string;
  workOrder: string;
  receptionistId: string;
  createdAt: string;
  updatedAt: string;
  company: Company;
  receptionist: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  event?: Event;
}

// Tipos para formularios
export interface LoginFormData {
  email: string;
  password: string;
}

export interface MetadataFormData {
  companyId: string;
  guideNumber: string;
  guideDate: string;
  cargoDescription: string;
  workOrder: string;
  receptionistId: string;
}

export interface EventSearchFilters {
  licensePlate?: string;
  startDate?: string;
  endDate?: string;
  cameraName?: string;
  companyId?: string;
  hasMetadata?: boolean;
  page?: number;
  limit?: number;
}

// Tipos para respuestas de API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  events: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface EventStats {
  totalEvents: number;
  eventsToday: number;
  eventsWithMetadata: number;
  averageConfidence: number;
  topCameras: Array<{ name: string; count: number }>;
}

export interface VideoInfo {
  videoUrl: string;
  thumbnailUrl?: string;
  filename: string;
  eventInfo: {
    id: string;
    licensePlate: string;
    eventDateTime: string;
    cameraName: string;
    confidence: number;
  };
}

// Tipos para stores Zustand
export interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  refreshToken: () => Promise<string>;
}

export interface UiStore {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// Tipos para Video Player
export interface VideoPlayerProps {
  src: string;
  poster?: string;
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
  autoplay?: boolean;
  controls?: boolean;
  fluid?: boolean;
  responsive?: boolean;
  aspectRatio?: string;
}

export interface ZoomControls {
  zoomLevel: number;
  minZoom: number;
  maxZoom: number;
  zoomStep: number;
}

// Tipos para validación
export interface ValidationError {
  field: string;
  message: string;
}

// Tipos para rutas
export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  protected: boolean;
  roles?: UserRole[];
  title: string;
}

// Tipos para formularios con react-hook-form
export interface FormProps<T> {
  onSubmit: (data: T) => void | Promise<void>;
  defaultValues?: Partial<T>;
  isLoading?: boolean;
  disabled?: boolean;
}

// Constantes de configuración
export const API_BASE_URL = '/api';
export const VIDEO_BASE_URL = '/uploads';

export const USER_ROLES = {
  ADMINISTRATOR: 'ADMINISTRATOR',
  OPERATOR: 'OPERATOR',
} as const;

export const EVENT_STATUS = {
  DOCUMENTED: 'documented',
  PENDING: 'pending',
} as const;

export const CAMERA_LOCATIONS = [
  'Entrada Principal ANPR',
  'Salida Principal ANPR',
  'Zona Descarga Norte',
  'Zona Descarga Sur',
  'Área Conteo 1',
  'Área Conteo 2',
  'Panorámica Patio',
  'Báscula Principal',
  'Almacén Entrada',
  'Almacén Salida',
] as const;