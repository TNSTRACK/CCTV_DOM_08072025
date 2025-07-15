# Technical Architecture Document - DOM CCTV
## Context Engineering Implementation Guide

### **Metadatos del Documento**
- **Versión:** 1.0 - Context Engineering Ready
- **Fecha:** 07/07/2025
- **Metodología:** Context Engineering Optimized
- **Basado en:** PRD DOM CCTV v2.0
- **Target:** Desarrollo con Claude Code + AI Tools

---

## 🏗️ **1. ARQUITECTURA GENERAL DEL SISTEMA**

### **1.1 Stack Tecnológico Definitivo**

```typescript
// Technology Stack - Production Ready
interface TechStack {
  backend: {
    runtime: 'Node.js 18 LTS';
    language: 'TypeScript 5.0+';
    framework: 'Express.js 4.18+';
    orm: 'Prisma 5.0+';
    validation: 'Zod 3.21+';
    auth: 'jsonwebtoken + bcrypt';
  };
  
  frontend: {
    framework: 'React 18.2+';
    language: 'TypeScript 5.0+';
    bundler: 'Vite 4.4+';
    ui: 'Material-UI (MUI) 5.14+';
    stateManagement: 'Zustand 4.4+';
    serverState: 'TanStack Query 4.32+';
    forms: 'React Hook Form 7.45+';
  };
  
  database: {
    primary: 'MySQL 8.0+';
    orm: 'Prisma Client';
    cache: 'Redis 7.0+ (production)';
    search: 'MySQL Full-Text Search';
  };
  
  external: {
    cctv: 'Hikvision APIs (HikCentral + ISAPI)';
    streaming: 'RTSP + HTTP Proxy';
    storage: 'Local NFS + Cloud Backup';
  };
  
  deployment: {
    containerization: 'Docker + Docker Compose';
    webServer: 'Nginx (reverse proxy)';
    ssl: 'Let\'s Encrypt';
    monitoring: 'PM2 + Custom Dashboards';
  };
}
```

### **1.2 Arquitectura por Capas**

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[React + Material UI]
        State[Zustand + TanStack Query]
    end
    
    subgraph "API Gateway Layer"
        Nginx[Nginx Reverse Proxy]
        Auth[JWT Middleware]
    end
    
    subgraph "Application Layer"
        API[Express.js REST API]
        Services[Business Logic Services]
        Controllers[Route Controllers]
    end
    
    subgraph "Integration Layer"
        HikAPI[Hikvision API Client]
        VideoProxy[Video Stream Proxy]
    end
    
    subgraph "Data Layer"
        Prisma[Prisma ORM]
        MySQL[MySQL 8.0 Partitioned]
        Redis[Redis Cache]
    end
    
    subgraph "External Systems"
        HikCentral[HikCentral Professional]
        Cameras[IP Cameras ISAPI]
        Storage[Video File Storage]
    end
    
    UI --> Nginx
    Nginx --> Auth
    Auth --> API
    API --> Services
    Services --> Controllers
    Services --> HikAPI
    Services --> VideoProxy
    Services --> Prisma
    Prisma --> MySQL
    Services --> Redis
    HikAPI --> HikCentral
    VideoProxy --> Cameras
    VideoProxy --> Storage
```

---

## 🔧 **2. BACKEND ARCHITECTURE DETALLADA**

### **2.1 Estructura de Directorios**

```
backend/
├── src/
│   ├── controllers/           # Route handlers (thin layer)
│   │   ├── auth.controller.ts
│   │   ├── events.controller.ts
│   │   ├── companies.controller.ts
│   │   ├── users.controller.ts
│   │   └── videos.controller.ts
│   │
│   ├── services/              # Business logic (thick layer)
│   │   ├── auth.service.ts
│   │   ├── events.service.ts
│   │   ├── companies.service.ts
│   │   ├── users.service.ts
│   │   ├── videos.service.ts
│   │   └── reports.service.ts
│   │
│   ├── integrations/          # External API clients
│   │   ├── hikvision/
│   │   │   ├── hikcentral.client.ts
│   │   │   ├── isapi.client.ts
│   │   │   ├── stream.proxy.ts
│   │   │   └── types.ts
│   │   └── storage/
│   │       ├── local.storage.ts
│   │       └── cloud.storage.ts
│   │
│   ├── middleware/            # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── logging.middleware.ts
│   │   └── rateLimit.middleware.ts
│   │
│   ├── models/               # Prisma models & schemas
│   │   ├── database.ts       # Prisma client instance
│   │   ├── schemas/          # Zod validation schemas
│   │   │   ├── auth.schemas.ts
│   │   │   ├── events.schemas.ts
│   │   │   └── companies.schemas.ts
│   │   └── types/            # Generated Prisma types
│   │
│   ├── routes/               # Express routes
│   │   ├── index.ts          # Main router
│   │   ├── auth.routes.ts
│   │   ├── events.routes.ts
│   │   ├── companies.routes.ts
│   │   ├── users.routes.ts
│   │   └── videos.routes.ts
│   │
│   ├── utils/                # Utilities & helpers
│   │   ├── logger.ts
│   │   ├── constants.ts
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   └── encryption.ts
│   │
│   ├── types/                # TypeScript definitions
│   │   ├── express.d.ts      # Express type extensions
│   │   ├── hikvision.types.ts
│   │   └── api.types.ts
│   │
│   ├── config/               # Configuration
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   ├── hikvision.ts
│   │   └── environment.ts
│   │
│   └── app.ts                # Express app setup
│
├── prisma/                   # Database
│   ├── schema.prisma         # Database schema
│   ├── migrations/           # Migration files
│   ├── seeds/               # Database seeding
│   └── indexes.sql          # Custom indexes
│
├── tests/                    # Testing
│   ├── unit/                # Unit tests
│   ├── integration/         # Integration tests
│   ├── fixtures/            # Test data
│   └── setup.ts             # Test configuration
│
├── docs/                     # Documentation
│   ├── api/                 # API documentation
│   └── deployment/          # Deployment guides
│
├── scripts/                  # Utility scripts
│   ├── migration.js
│   ├── backup.js
│   └── monitoring.js
│
├── Dockerfile               # Container definition
├── docker-compose.yml       # Development environment
├── package.json
├── tsconfig.json
└── .env.example             # Environment template
```

### **2.2 Prisma Database Schema Implementación**

```prisma
// prisma/schema.prisma - Production Ready
generator client {
  provider = "prisma-client-js"
  output   = "../src/types/generated"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// ============================================
// CORE ENTITIES - FASE 1
// ============================================

model Company {
  id                String   @id @default(uuid()) @db.VarChar(36)
  rut               String   @unique @db.VarChar(12) // RUT chileno formato: 12345678-9
  name              String   @db.VarChar(200)
  businessName      String?  @db.VarChar(200)
  
  // Contact Information
  address           String   @db.VarChar(300)
  city              String   @db.VarChar(100)
  region            String   @db.VarChar(100)
  phone             String   @db.VarChar(20)
  email             String   @db.VarChar(100)
  
  // Primary Contact (JSON)
  primaryContact    Json     // {name, position, phone, email}
  
  // Status
  isActive          Boolean  @default(true)
  
  // FASE 2 - Advanced Config
  advancedConfigId  String?  @unique @db.VarChar(36)
  advancedConfig    CompanyAdvancedConfig? @relation(fields: [advancedConfigId], references: [id])
  
  // Relationships
  events            Event[]
  users             User[]
  
  // Audit
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  createdBy         String   @db.VarChar(36)
  createdByUser     User     @relation("CompanyCreator", fields: [createdBy], references: [id])
  
  // Indexes for performance
  @@index([isActive])
  @@index([name])
  @@index([rut])
  @@map("companies")
}

model User {
  id                    String    @id @default(uuid()) @db.VarChar(36)
  email                 String    @unique @db.VarChar(100)
  password              String    @db.VarChar(255) // bcrypt hash
  
  // Personal Information
  firstName             String    @db.VarChar(50)
  lastName              String    @db.VarChar(50)
  phone                 String?   @db.VarChar(20)
  
  // Role & Permissions
  role                  UserRole
  
  // Company Association
  companyId             String?   @db.VarChar(36)
  company               Company?  @relation(fields: [companyId], references: [id])
  department            String?   @db.VarChar(100)
  position              String?   @db.VarChar(100)
  
  // Security & Status
  isActive              Boolean   @default(true)
  emailVerified         Boolean   @default(false)
  lastLogin             DateTime?
  failedLoginAttempts   Int       @default(0)
  lockedUntil           DateTime?
  
  // Preferences
  preferencesId         String?   @unique @db.VarChar(36)
  preferences           UserPreferences? @relation(fields: [preferencesId], references: [id])
  
  // FASE 2 - Advanced Profile
  advancedProfileId     String?   @unique @db.VarChar(36)
  advancedProfile       UserAdvancedProfile? @relation(fields: [advancedProfileId], references: [id])
  
  // Relationships
  permissions           UserPermission[]
  createdEvents         Event[]   @relation("EventCreator")
  createdMetadata       BasicEventMetadata[]
  createdCompanies      Company[] @relation("CompanyCreator")
  auditLogs             AuditLog[]
  
  // Audit
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  createdBy             String?   @db.VarChar(36)
  
  // Constraints - Unique name per company
  @@unique([firstName, lastName, companyId], name: "unique_name_per_company")
  @@index([email])
  @@index([companyId, isActive])
  @@index([role, isActive])
  @@map("users")
}

model Event {
  id                String   @id @default(uuid()) @db.VarChar(36)
  licensePlate      String   @db.VarChar(10) // Chilean format: ABC123 or ABCD12
  eventDateTime     DateTime
  confidence        Float    @db.Float // ANPR confidence 0-100
  
  // Company Association
  companyId         String   @db.VarChar(36)
  company           Company  @relation(fields: [companyId], references: [id])
  
  // ANPR Data (JSON for flexibility)
  primaryCamera     Json     // {id, image, confidence, plateReading}
  secondaryCamera   Json?    // Optional secondary camera
  
  // Status & Flags
  status            EventStatus
  hasBasicMetadata  Boolean  @default(false)
  readyForPhase2    Boolean  @default(false)
  
  // Video Files (JSON array of video file objects)
  documentaryVideos Json     // [{cameraId, filename, duration, size}]
  thumbnailPath     String?  @db.VarChar(500)
  
  // Relationships
  basicMetadata     BasicEventMetadata?
  discrepancies     ReturnDiscrepancy[] // FASE 2
  inventoryCount    DetailedInventoryCount? // FASE 2
  
  // Audit
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  processedAt       DateTime?
  createdBy         String   @db.VarChar(36)
  createdByUser     User     @relation("EventCreator", fields: [createdBy], references: [id])
  
  // Critical indexes for <2s searches
  @@index([licensePlate])
  @@index([companyId, eventDateTime])
  @@index([status, hasBasicMetadata])
  @@index([companyId, licensePlate, eventDateTime], name: "search_combined")
  @@map("events")
}

model BasicEventMetadata {
  id                String   @id @default(uuid()) @db.VarChar(36)
  eventId           String   @unique @db.VarChar(36)
  event             Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  
  // Company Reference (redundant for performance)
  companyId         String   @db.VarChar(36)
  
  // Return Information (JSON for flexibility)
  basicReturnInfo   Json     // {guideNumber?, guideDate?, originProject?, cargoDescription?, observations?}
  
  // Registration Info
  registeredBy      Json     // {userId, timestamp}
  
  // Ready for FASE 2
  readyForDetailedProcessing Boolean @default(false)
  
  // Audit
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  lastModifiedBy    String?  @db.VarChar(36)
  createdBy         String   @db.VarChar(36)
  createdByUser     User     @relation(fields: [createdBy], references: [id])
  
  // Index for guide number searches
  @@index([companyId])
  @@map("basic_event_metadata")
}

model UserPermission {
  id         String     @id @default(uuid()) @db.VarChar(36)
  userId     String     @db.VarChar(36)
  user       User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  permission Permission
  grantedAt  DateTime   @default(now())
  grantedBy  String     @db.VarChar(36)
  expiresAt  DateTime?
  
  // Fast permission checks
  @@index([userId, permission])
  @@map("user_permissions")
}

model UserPreferences {
  id              String       @id @default(uuid()) @db.VarChar(36)
  userId          String       @db.VarChar(36)
  user            User?
  
  language        Language     @default(ES)
  timezone        String       @default("America/Santiago") @db.VarChar(50)
  theme           Theme        @default(LIGHT)
  
  // UI Preferences
  defaultPageSize Int          @default(25)
  videoQuality    VideoQuality @default(HIGH)
  autoPlay        Boolean      @default(false)
  
  updatedAt       DateTime     @updatedAt
  
  @@map("user_preferences")
}

model AuditLog {
  id           String       @id @default(uuid()) @db.VarChar(36)
  userId       String       @db.VarChar(36)
  user         User         @relation(fields: [userId], references: [id])
  
  action       AuditAction
  resourceType ResourceType
  resourceId   String       @db.VarChar(36)
  
  // Context
  ipAddress    String       @db.VarChar(45) // IPv6 support
  userAgent    String       @db.Text
  timestamp    DateTime     @default(now())
  
  // Action Data (JSON for flexibility)
  beforeState  Json?        // Previous state for updates
  afterState   Json?        // New state for updates
  
  // Metadata
  companyId    String?      @db.VarChar(36) // For company filtering
  sessionId    String       @db.VarChar(255)
  
  // Partitioned by month for performance
  @@index([timestamp])
  @@index([userId, timestamp])
  @@index([action, timestamp])
  @@map("audit_logs")
}


// ============================================
// ENUMS
// ============================================

enum UserRole {
  ADMINISTRATOR
  SUPERVISOR
  OPERATOR
  CLIENT_USER
}

enum Permission {
  // Events
  READ_EVENTS
  WRITE_BASIC_METADATA
  EDIT_OWN_METADATA
  DELETE_EVENTS
  
  // Videos
  VIEW_VIDEOS
  DOWNLOAD_VIDEOS
  EXPORT_VIDEO_SEGMENTS
  
  // Search
  SEARCH_ALL_COMPANIES
  SEARCH_OWN_COMPANY
  ADVANCED_SEARCH
  
  // Administration
  MANAGE_USERS
  MANAGE_COMPANIES
  SYSTEM_CONFIG
  VIEW_AUDIT_LOGS
  
  // Reports
  GENERATE_BASIC_REPORTS
  GENERATE_DETAILED_REPORTS
  EXPORT_DATA
  SCHEDULE_REPORTS
}

enum EventStatus {
  DETECTED
  DOCUMENTED
  VALIDATED
  ARCHIVED
}

enum Language {
  ES
  EN
}

enum Theme {
  LIGHT
  DARK
  AUTO
}

enum VideoQuality {
  HIGH
  MEDIUM
  LOW
  AUTO
}

enum AuditAction {
  LOGIN
  LOGOUT
  VIEW_EVENT
  UPDATE_METADATA
  DOWNLOAD_VIDEO
  SEARCH_EVENTS
  EXPORT_DATA
  CREATE_USER
  MODIFY_PERMISSIONS
}

enum ResourceType {
  USER
  COMPANY
  EVENT
  VIDEO
  REPORT
}

### **2.3 Hikvision Integration Architecture**

```typescript
// src/integrations/hikvision/hikcentral.client.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { logger } from '../../utils/logger';

interface HikCentralConfig {
  baseUrl: string;
  username: string;
  password: string;
  timeout: number;
}

interface AuthResponse {
  accessToken: string;
  tokenType: string;
  refreshToken: string;
  expiresIn: number;
}

interface ANPREvent {
  plateNumber: string;
  confidence: number;
  captureTime: string;
  cameraIndexCode: string;
  picUri: string;
}

export class HikCentralClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;
  private refreshToken: string | null = null;

  constructor(private config: HikCentralConfig) {
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Request interceptor for automatic token injection
    this.client.interceptors.request.use(async (config) => {
      const token = await this.getValidToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor for automatic token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && !error.config._retry) {
          error.config._retry = true;
          await this.authenticate();
          return this.client.request(error.config);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Authenticate with HikCentral and get access token
   */
  async authenticate(): Promise<string> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.client.post('/oauth/token', {
        grant_type: 'password',
        username: this.config.username,
        password: this.config.password,
        scope: 'read write'
      });

      const { accessToken, expiresIn, refreshToken } = response.data;
      
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.tokenExpiry = new Date(Date.now() + (expiresIn * 1000) - 60000); // 1 minute buffer

      logger.info('HikCentral authentication successful');
      return accessToken;

    } catch (error) {
      logger.error('HikCentral authentication failed:', error);
      throw new Error('Failed to authenticate with HikCentral');
    }
  }

  /**
   * Get valid token, refresh if necessary
   */
  private async getValidToken(): Promise<string | null> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    if (this.refreshToken) {
      try {
        await this.refreshAccessToken();
        return this.accessToken;
      } catch (error) {
        logger.warn('Token refresh failed, re-authenticating');
      }
    }

    return await this.authenticate();
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshAccessToken(): Promise<void> {
    const response: AxiosResponse<AuthResponse> = await this.client.post('/oauth/token', {
      grant_type: 'refresh_token',
      refresh_token: this.refreshToken
    });

    const { accessToken, expiresIn, refreshToken } = response.data;
    
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.tokenExpiry = new Date(Date.now() + (expiresIn * 1000) - 60000);
  }

  /**
   * Subscribe to ANPR events
   */
  async subscribeToANPREvents(callback: (event: ANPREvent) => void): Promise<void> {
    try {
      const response = await this.client.post('/event/subscription', {
        eventTypes: ['anpr'],
        eventLevels: ['normal', 'major'],
        eventSources: ['camera'],
        callbackUrl: process.env.ANPR_CALLBACK_URL
      });

      logger.info('ANPR event subscription created:', response.data);
    } catch (error) {
      logger.error('Failed to subscribe to ANPR events:', error);
      throw error;
    }
  }

  /**
   * Get cameras list
   */
  async getCameras(): Promise<any[]> {
    try {
      const response = await this.client.get('/resource/camera/search', {
        params: {
          pageNo: 1,
          pageSize: 1000
        }
      });

      return response.data.list || [];
    } catch (error) {
      logger.error('Failed to get cameras:', error);
      throw error;
    }
  }

  /**
   * Get live stream URL for camera
   */
  async getLiveStreamUrl(cameraId: string, streamType: 'main' | 'sub' = 'main'): Promise<string> {
    try {
      const response = await this.client.post('/video/url', {
        cameraIndexCode: cameraId,
        streamType,
        protocol: 'rtsp',
        transmode: 1
      });

      return response.data.url;
    } catch (error) {
      logger.error('Failed to get live stream URL:', error);
      throw error;
    }
  }

  /**
   * Get playback URL for recorded video
   */
  async getPlaybackUrl(cameraId: string, startTime: string, endTime: string): Promise<string> {
    try {
      const response = await this.client.post('/video/playback/url', {
        cameraIndexCode: cameraId,
        startTime,
        endTime,
        protocol: 'rtsp'
      });

      return response.data.url;
    } catch (error) {
      logger.error('Failed to get playback URL:', error);
      throw error;
    }
  }

  /**
   * Download video segment
   */
  async downloadVideo(cameraId: string, startTime: string, endTime: string): Promise<Buffer> {
    try {
      const response = await this.client.post('/video/download', {
        cameraIndexCode: cameraId,
        startTime,
        endTime,
        downloadSpeed: 4 // 4x speed
      }, {
        responseType: 'arraybuffer'
      });

      return Buffer.from(response.data);
    } catch (error) {
      logger.error('Failed to download video:', error);
      throw error;
    }
  }

  /**
   * Search ANPR events
   */
  async searchANPREvents(params: {
    startTime: string;
    endTime: string;
    cameraIds?: string[];
    plateNumber?: string;
    pageNo?: number;
    pageSize?: number;
  }): Promise<ANPREvent[]> {
    try {
      const response = await this.client.post('/event/anpr/search', {
        startTime: params.startTime,
        endTime: params.endTime,
        cameraIndexCodes: params.cameraIds,
        plateNumber: params.plateNumber,
        pageNo: params.pageNo || 1,
        pageSize: params.pageSize || 100
      });

      return response.data.list || [];
    } catch (error) {
      logger.error('Failed to search ANPR events:', error);
      throw error;
    }
  }
}
```

### **2.4 ISAPI Direct Client**

```typescript
// src/integrations/hikvision/isapi.client.ts
import axios, { AxiosInstance } from 'axios';
import { createHash } from 'crypto';

interface ISAPIConfig {
  ip: string;
  port: number;
  username: string;
  password: string;
  timeout: number;
}

export class ISAPIClient {
  private client: AxiosInstance;
  private digestAuth: string | null = null;

  constructor(private config: ISAPIConfig) {
    this.client = axios.create({
      baseURL: `http://${config.ip}:${config.port}/ISAPI`,
      timeout: config.timeout,
      auth: {
        username: config.username,
        password: config.password
      }
    });
  }

  /**
   * Get device information
   */
  async getDeviceInfo(): Promise<any> {
    try {
      const response = await this.client.get('/System/deviceInfo');
      return response.data;
    } catch (error) {
      logger.error('Failed to get device info:', error);
      throw error;
    }
  }

  /**
   * Get camera capabilities
   */
  async getCameraCapabilities(): Promise<any> {
    try {
      const response = await this.client.get('/System/Video/inputs/channels/1/capabilities');
      return response.data;
    } catch (error) {
      logger.error('Failed to get camera capabilities:', error);
      throw error;
    }
  }

  /**
   * Capture still image
   */
  async captureImage(channelId: number = 1): Promise<Buffer> {
    try {
      const response = await this.client.get(`/Streaming/channels/${channelId}01/picture`, {
        responseType: 'arraybuffer'
      });

      return Buffer.from(response.data);
    } catch (error) {
      logger.error('Failed to capture image:', error);
      throw error;
    }
  }

  /**
   * Start PTZ control
   */
  async startPTZ(channelId: number, command: string, speed: number): Promise<void> {
    try {
      await this.client.put(`/PTZCtrl/channels/${channelId}/continuous`, {
        PTZData: {
          pan: command.includes('LEFT') ? -speed : command.includes('RIGHT') ? speed : 0,
          tilt: command.includes('UP') ? speed : command.includes('DOWN') ? -speed : 0,
          zoom: command.includes('ZOOM_IN') ? speed : command.includes('ZOOM_OUT') ? -speed : 0
        }
      });
    } catch (error) {
      logger.error('Failed to start PTZ:', error);
      throw error;
    }
  }

  /**
   * Stop PTZ control
   */
  async stopPTZ(channelId: number): Promise<void> {
    try {
      await this.client.put(`/PTZCtrl/channels/${channelId}/continuous`, {
        PTZData: {
          pan: 0,
          tilt: 0,
          zoom: 0
        }
      });
    } catch (error) {
      logger.error('Failed to stop PTZ:', error);
      throw error;
    }
  }
}
```

### **2.5 Video Stream Proxy**

```typescript
// src/integrations/hikvision/stream.proxy.ts
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import ffmpeg from 'fluent-ffmpeg';
import { logger } from '../../utils/logger';

export class VideoStreamProxy {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // RTSP to HTTP proxy for live streams
    this.app.use('/live/:cameraId', this.createLiveStreamProxy());
    
    // HLS stream endpoint
    this.app.use('/hls/:cameraId', this.createHLSStreamProxy());
    
    // Video download endpoint
    this.app.get('/download/:cameraId', this.handleVideoDownload.bind(this));
    
    // Thumbnail generation
    this.app.get('/thumbnail/:cameraId', this.handleThumbnailGeneration.bind(this));
  }

  private createLiveStreamProxy() {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const { cameraId } = req.params;
      
      try {
        // Get RTSP URL from HikCentral
        const hikCentral = new HikCentralClient(/* config */);
        const rtspUrl = await hikCentral.getLiveStreamUrl(cameraId);
        
        // Set up FFmpeg stream conversion
        const ffmpegCommand = ffmpeg(rtspUrl)
          .inputOptions([
            '-rtsp_transport', 'tcp',
            '-allowed_media_types', 'video'
          ])
          .outputOptions([
            '-f', 'mjpeg',
            '-q:v', '3',
            '-r', '25'
          ])
          .on('start', () => {
            logger.info(`Started live stream for camera ${cameraId}`);
          })
          .on('error', (err) => {
            logger.error(`Live stream error for camera ${cameraId}:`, err);
            res.status(500).send('Stream error');
          });

        res.setHeader('Content-Type', 'multipart/x-mixed-replace; boundary=ffmpeg');
        ffmpegCommand.pipe(res);

      } catch (error) {
        logger.error('Failed to create live stream proxy:', error);
        res.status(500).send('Failed to start stream');
      }
    };
  }

  private createHLSStreamProxy() {
    return async (req: express.Request, res: express.Response) => {
      const { cameraId } = req.params;
      const { segment } = req.query;

      try {
        if (segment) {
          // Serve HLS segment
          const segmentPath = `/tmp/hls/${cameraId}/${segment}`;
          res.sendFile(segmentPath);
        } else {
          // Serve HLS playlist
          const playlistPath = `/tmp/hls/${cameraId}/playlist.m3u8`;
          res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
          res.sendFile(playlistPath);
        }
      } catch (error) {
        logger.error('HLS proxy error:', error);
        res.status(500).send('HLS error');
      }
    };
  }

  private async handleVideoDownload(req: express.Request, res: express.Response): Promise<void> {
    const { cameraId } = req.params;
    const { startTime, endTime, quality = 'high' } = req.query as any;

    try {
      const hikCentral = new HikCentralClient(/* config */);
      const playbackUrl = await hikCentral.getPlaybackUrl(cameraId, startTime, endTime);

      const qualityMap = {
        high: { bitrate: '4000k', resolution: '1920x1080' },
        medium: { bitrate: '2000k', resolution: '1280x720' },
        low: { bitrate: '800k', resolution: '854x480' }
      };

      const settings = qualityMap[quality as keyof typeof qualityMap] || qualityMap.high;

      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Content-Disposition', `attachment; filename="video_${cameraId}_${Date.now()}.mp4"`);

      ffmpeg(playbackUrl)
        .outputOptions([
          '-f', 'mp4',
          '-movflags', 'frag_keyframe+empty_moov',
          '-b:v', settings.bitrate,
          '-s', settings.resolution,
          '-c:v', 'libx264',
          '-preset', 'fast'
        ])
        .on('start', () => {
          logger.info(`Started video download for camera ${cameraId}`);
        })
        .on('progress', (progress) => {
          logger.debug(`Download progress: ${progress.percent}%`);
        })
        .on('error', (err) => {
          logger.error('Video download error:', err);
          res.status(500).end();
        })
        .pipe(res);

    } catch (error) {
      logger.error('Failed to handle video download:', error);
      res.status(500).send('Download failed');
    }
  }

  private async handleThumbnailGeneration(req: express.Request, res: express.Response): Promise<void> {
    const { cameraId } = req.params;
    const { timestamp } = req.query as any;

    try {
      const hikCentral = new HikCentralClient(/* config */);
      const playbackUrl = await hikCentral.getPlaybackUrl(cameraId, timestamp, timestamp);

      res.setHeader('Content-Type', 'image/jpeg');

      ffmpeg(playbackUrl)
        .seekInput(0)
        .frames(1)
        .outputOptions([
          '-f', 'image2',
          '-q:v', '2'
        ])
        .on('error', (err) => {
          logger.error('Thumbnail generation error:', err);
          res.status(500).end();
        })
        .pipe(res);

    } catch (error) {
      logger.error('Failed to generate thumbnail:', error);
      res.status(500).send('Thumbnail generation failed');
    }
  }

  public getApp(): express.Application {
    return this.app;
  }
}
```


## 🎨 **3. FRONTEND ARCHITECTURE DETALLADA**

### **3.1 Estructura de Directorios Frontend**

```
frontend/
├── src/
│   ├── components/           # Reusable components
│   │   ├── common/          # Generic components
│   │   │   ├── Layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Layout.tsx
│   │   │   ├── Forms/
│   │   │   │   ├── FormField.tsx
│   │   │   │   ├── FormSelect.tsx
│   │   │   │   ├── FormDatePicker.tsx
│   │   │   │   └── FormValidation.tsx
│   │   │   ├── UI/
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   ├── ErrorBoundary.tsx
│   │   │   │   ├── ConfirmDialog.tsx
│   │   │   │   └── NotificationSnackbar.tsx
│   │   │   └── DataDisplay/
│   │   │       ├── DataTable.tsx
│   │   │       ├── Pagination.tsx
│   │   │       ├── SearchBar.tsx
│   │   │       └── FilterPanel.tsx
│   │   │
│   │   ├── video/           # Video-specific components
│   │   │   ├── VideoPlayer/
│   │   │   │   ├── VideoPlayer.tsx
│   │   │   │   ├── VideoControls.tsx
│   │   │   │   ├── ZoomControls.tsx
│   │   │   │   ├── Timeline.tsx
│   │   │   │   └── VideoGrid.tsx
│   │   │   ├── VideoThumbnail.tsx
│   │   │   ├── CameraSelector.tsx
│   │   │   └── VideoDownload.tsx
│   │   │
│   │   ├── events/          # Event-specific components
│   │   │   ├── EventList.tsx
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventDetails.tsx
│   │   │   ├── EventSearch.tsx
│   │   │   └── EventFilters.tsx
│   │   │
│   │   ├── metadata/        # Metadata forms
│   │   │   ├── BasicMetadataForm.tsx
│   │   │   ├── CompanySelector.tsx
│   │   │   ├── ReturnInfoForm.tsx
│   │   │   └── ObservationsForm.tsx
│   │   │
│   │   └── dashboard/       # Dashboard components
│   │       ├── DashboardSummary.tsx
│   │       ├── RecentEvents.tsx
│   │       ├── MetricsCards.tsx
│   │       └── QuickActions.tsx
│   │
│   ├── pages/               # Page components
│   │   ├── Auth/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── ForgotPassword.tsx
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── OperatorDashboard.tsx
│   │   │   ├── ClientDashboard.tsx
│   │   │   └── AdminDashboard.tsx
│   │   ├── Events/
│   │   │   ├── EventsList.tsx
│   │   │   ├── EventDetails.tsx
│   │   │   ├── EventVideo.tsx
│   │   │   └── EventMetadata.tsx
│   │   ├── Companies/
│   │   │   ├── CompaniesList.tsx
│   │   │   ├── CompanyDetails.tsx
│   │   │   └── CompanyForm.tsx
│   │   ├── Users/
│   │   │   ├── UsersList.tsx
│   │   │   ├── UserDetails.tsx
│   │   │   └── UserForm.tsx
│   │   ├── Reports/
│   │   │   ├── ReportsList.tsx
│   │   │   ├── ReportBuilder.tsx
│   │   │   └── ReportViewer.tsx
│   │   └── Settings/
│   │       ├── UserSettings.tsx
│   │       ├── SystemSettings.tsx
│   │       └── Integration.tsx
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useEvents.ts
│   │   ├── useCompanies.ts
│   │   ├── useVideo.ts
│   │   ├── useSearch.ts
│   │   ├── usePermissions.ts
│   │   ├── useLocalStorage.ts
│   │   └── useDebounce.ts
│   │
│   ├── services/            # API communication
│   │   ├── api.ts           # Axios instance
│   │   ├── auth.service.ts
│   │   ├── events.service.ts
│   │   ├── companies.service.ts
│   │   ├── users.service.ts
│   │   ├── videos.service.ts
│   │   └── reports.service.ts
│   │
│   ├── store/               # Zustand stores
│   │   ├── auth.store.ts
│   │   ├── events.store.ts
│   │   ├── ui.store.ts
│   │   ├── video.store.ts
│   │   └── notifications.store.ts
│   │
│   ├── types/               # TypeScript definitions
│   │   ├── api.types.ts
│   │   ├── auth.types.ts
│   │   ├── events.types.ts
│   │   ├── video.types.ts
│   │   └── ui.types.ts
│   │
│   ├── utils/               # Utility functions
│   │   ├── constants.ts
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   ├── permissions.ts
│   │   ├── api-helpers.ts
│   │   └── date-helpers.ts
│   │
│   ├── styles/              # Styling
│   │   ├── theme.ts         # MUI theme
│   │   ├── globals.css
│   │   └── components.css
│   │
│   └── assets/              # Static assets
│       ├── images/
│       ├── icons/
│       └── videos/
│
├── public/                  # Public assets
├── package.json
├── vite.config.ts
├── tsconfig.json
└── .env.example
```

### **3.2 Material Design v5 Theme Implementation**

```typescript
// src/styles/theme.ts
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { esES } from '@mui/material/locale';

const baseThemeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#1976d2',      // DOM brand blue
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#9c27b0',      // Purple accent
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#ffffff'
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828'
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100'
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b'
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20'
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff'
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.125rem',
      fontWeight: 300,
      lineHeight: 1.167
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 400,
      lineHeight: 1.2
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.167
    },
    h4: {
      fontSize: '1.125rem',
      fontWeight: 400,
      lineHeight: 1.235
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.334
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.6
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.75,
      textTransform: 'uppercase' as const
    }
  },
  shape: {
    borderRadius: 8
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 24px'
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16
        }
      }
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid rgba(224, 224, 224, 1)'
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f5f5f5',
            borderBottom: '2px solid rgba(224, 224, 224, 1)'
          }
        }
      }
    }
  }
};

// Light theme
export const lightTheme = createTheme(baseThemeOptions, esES);

// Dark theme
export const darkTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    ...baseThemeOptions.palette,
    mode: 'dark',
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5'
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e'
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)'
    }
  }
}, esES);
```

### **3.3 Video Player Component con Zoom 10x**

### **3.4 Custom Hook para Video Player**

### **3.5 Zustand Store para Estado Global**


### **3.6 TanStack Query para Server State**


## 🚀 **4. DEPLOYMENT & DEVOPS CONFIGURATION**

### **4.1 Docker Configuration**

```dockerfile
# Dockerfile - Multi-stage build
# Backend Stage
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# Copy package files
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy source
COPY backend/ ./

# Build TypeScript
RUN npm run build

# Frontend Stage  
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy package files
COPY frontend/package*.json ./
RUN npm ci

# Copy source
COPY frontend/ ./

# Build production bundle
RUN npm run build

# Production Stage
FROM node:18-alpine AS production

# Install ffmpeg for video processing
RUN apk add --no-cache ffmpeg

WORKDIR /app

# Copy backend built files
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/package.json ./

# Copy frontend built files
COPY --from=frontend-builder /app/frontend/dist ./public

# Copy Prisma files
COPY backend/prisma ./prisma

# Create uploads directory
RUN mkdir -p uploads/videos uploads/thumbnails uploads/temp

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml - Development Environment
version: '3.8'

services:
  # MySQL Database
  mysql:
    image: mysql:8.0
    container_name: dom_cctv_mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./backend/prisma/init.sql:/docker-entrypoint-initdb.d/init.sql
    command: --default-authentication-plugin=mysql_native_password
    restart: unless-stopped
    networks:
      - dom_cctv_network

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: dom_cctv_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - dom_cctv_network

  # Backend API
  backend:
    build:
      context: .
      dockerfile: Dockerfile
      target: backend-builder
    container_name: dom_cctv_backend
    environment:
      NODE_ENV: development
      DATABASE_URL: mysql://${DB_USER}:${DB_PASSWORD}@mysql:3306/${DB_NAME}
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      HIKVISION_BASE_URL: ${HIKVISION_BASE_URL}
      HIKVISION_USERNAME: ${HIKVISION_USERNAME}
      HIKVISION_PASSWORD: ${HIKVISION_PASSWORD}
    ports:
      - "3000:3000"

      
### **6.2 Input Validation & Sanitization**


### **6.3 Security Headers & CORS**

## 📚 **7. TESTING STRATEGY IMPLEMENTATION**

### **7.1 Backend Unit Tests**


### **4.2 Nginx Configuration**


### **4.3 Environment Variables Configuration**

```bash
# .env.example
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dom_cctv
DB_USER=dom_user
DB_PASSWORD=secure_password_here
DB_ROOT_PASSWORD=root_password_here
DATABASE_URL="mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URL="redis://${REDIS_HOST}:${REDIS_PORT}"

# JWT Configuration
JWT_SECRET=your_very_secure_jwt_secret_here_at_least_32_characters
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Hikvision Integration
HIKVISION_BASE_URL=https://your-hikvision-server.com
HIKVISION_USERNAME=your_hikvision_user
HIKVISION_PASSWORD=your_hikvision_password
HIKVISION_TIMEOUT=30000

# Video Configuration
VIDEO_STORAGE_PATH=/app/uploads/videos
THUMBNAIL_STORAGE_PATH=/app/uploads/thumbnails
MAX_VIDEO_SIZE=500MB
SUPPORTED_VIDEO_FORMATS=mp4,avi,mov,mkv

# ANPR Configuration
ANPR_CONFIDENCE_THRESHOLD=85
ANPR_CALLBACK_URL=http://your-domain.com/api/webhooks/anpr
AUTO_SYNC_INTERVAL=300000

# Security Configuration
BCRYPT_ROUNDS=12
SESSION_SECRET=your_session_secret_here
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@dom-cctv.com

# File Upload Configuration
MAX_FILE_SIZE=50MB
ALLOWED_IMAGE_TYPES=jpg,jpeg,png,gif
TEMP_UPLOAD_PATH=/app/uploads/temp

# Logging Configuration
LOG_LEVEL=info
LOG_FILE_PATH=/app/logs
LOG_MAX_SIZE=10MB
LOG_MAX_FILES=5

# Performance Configuration
CACHE_TTL=3600
DB_POOL_MIN=2
DB_POOL_MAX=10
COMPRESSION_ENABLED=true

# Development Configuration
NODE_ENV=development
PORT=3000
HOST=0.0.0.0

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
VITE_VIDEO_STREAM_URL=http://localhost:3000/api/video
VITE_UPLOAD_MAX_SIZE=50MB
VITE_SENTRY_DSN=your_sentry_dsn_here

# Monitoring Configuration
ENABLE_METRICS=true
METRICS_PORT=9090
HEALTH_CHECK_INTERVAL=30000

# Backup Configuration
BACKUP_ENABLED=true
BACKUP_SCHEDULE="0 2 * * *"
BACKUP_RETENTION_DAYS=30
BACKUP_STORAGE_PATH=/app/backups
```

### **4.4 CI/CD Pipeline Configuration**

```yaml
# .github/workflows/deploy.yml
name: DOM CCTV Deployment

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io
  IMAGE_NAME: dom-cctv

jobs:
  # Testing Job
  test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: test_dom_cctv
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3
        ports:
          - 3306:3306

      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd="redis-cli ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3
        ports:
          - 6379:6379

    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        cache-dependency-path: |
          backend/package-lock.json
          frontend/package-lock.json

    # Backend Tests
    - name: Install Backend Dependencies
      working-directory: ./backend
      run: npm ci

    - name: Run Database Migrations
      working-directory: ./backend
      run: |
        npx prisma generate
        npx prisma db push
      env:
        DATABASE_URL: mysql://root:root@localhost:3306/test_dom_cctv

    - name: Run Backend Tests
      working-directory: ./backend
      run: npm test
      env:
        NODE_ENV: test
        DATABASE_URL: mysql://root:root@localhost:3306/test_dom_cctv
        REDIS_URL: redis://localhost:6379
        JWT_SECRET: test_secret

    # Frontend Tests
    - name: Install Frontend Dependencies
      working-directory: ./frontend
      run: npm ci

    - name: Run Frontend Tests
      working-directory: ./frontend
      run: npm test

    - name: Build Frontend
      working-directory: ./frontend
      run: npm run build

    # Code Quality
    - name: Run ESLint
      working-directory: ./backend
      run: npm run lint

    - name: Run TypeScript Check
      working-directory: ./backend
      run: npm run type-check

  # Security Scan
  security:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Run Security Audit
      run: |
        cd backend && npm audit --audit-level moderate
        cd ../frontend && npm audit --audit-level moderate

    - name: Run Snyk Security Scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  # Build and Push Docker Image
  build:
    needs: [test, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - uses: actions/checkout@v4

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Log in to Container Registry
      uses: docker/login-action@v3
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: ${{ env.REGISTRY }}/${{ github.repository }}/${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=sha,prefix={{branch}}-
          type=raw,value=latest,enable={{is_default_branch}}

    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

  # Deploy to Production
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production

    steps:
    - name: Deploy to Server
      uses: appleboy/ssh-action@v1.0.0
      with:
        host: ${{ secrets.PRODUCTION_HOST }}
        username: ${{ secrets.PRODUCTION_USER }}
        key: ${{ secrets.PRODUCTION_SSH_KEY }}
        script: |
          cd /opt/dom-cctv
          docker-compose down
          docker-compose pull
          docker-compose up -d
          docker system prune -f

    - name: Health Check
      run: |
        sleep 30
        curl -f ${{ secrets.PRODUCTION_URL }}/health || exit 1

  # Deploy to Staging
  deploy-staging:
    needs: [test, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging

    steps:
    - name: Deploy to Staging Server
      uses: appleboy/ssh-action@v1.0.0
      with:
        host: ${{ secrets.STAGING_HOST }}
        username: ${{ secrets.STAGING_USER }}
        key: ${{ secrets.STAGING_SSH_KEY }}
        script: |
          cd /opt/dom-cctv-staging
          git pull origin develop
          docker-compose down
          docker-compose build
          docker-compose up -d
```

---

## 📊 **5. MONITORING & OBSERVABILITY**

### **5.1 Application Monitoring Setup**

```typescript
// src/utils/monitoring.ts
import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

interface MetricsData {
  timestamp: number;
  method: string;
  route: string;
  statusCode: number;
  responseTime: number;
  userAgent?: string;
  ip?: string;
  userId?: string;
  companyId?: string;
}

class MetricsCollector {
  private metrics: MetricsData[] = [];
  private readonly maxMetrics = 1000;

  collect(data: MetricsData): void {
    this.metrics.push(data);
    
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  getMetrics(): MetricsData[] {
    return [...this.metrics];
  }

  getAverageResponseTime(route?: string): number {
    const filteredMetrics = route 
      ? this.metrics.filter(m => m.route === route)
      : this.metrics;

    if (filteredMetrics.length === 0) return 0;

    const total = filteredMetrics.reduce((sum, m) => sum + m.responseTime, 0);
    return total / filteredMetrics.length;
  }

  getErrorRate(timeWindow: number = 3600000): number {
    const now = Date.now();
    const recent = this.metrics.filter(m => now - m.timestamp < timeWindow);
    
    if (recent.length === 0) return 0;

    const errors = recent.filter(m => m.statusCode >= 400);
    return (errors.length / recent.length) * 100;
  }

  getThroughput(timeWindow: number = 3600000): number {
    const now = Date.now();
    const recent = this.metrics.filter(m => now - m.timestamp < timeWindow);
    
    return recent.length / (timeWindow / 1000); // requests per second
  }
}

export const metricsCollector = new MetricsCollector();

// Middleware to collect metrics
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    
    metricsCollector.collect({
      timestamp: startTime,
      method: req.method,
      route: req.route?.path || req.path,
      statusCode: res.statusCode,
      responseTime,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: (req as any).user?.id,
      companyId: (req as any).user?.companyId
    });

    // Log slow requests
    if (responseTime > 2000) {
      logger.warn('Slow request detected:', {
        method: req.method,
        route: req.path,
        responseTime,
        userId: (req as any).user?.id
      });
    }
  });

  next();
};

// Health check endpoint
export const healthCheck = (req: Request, res: Response): void => {
  const metrics = metricsCollector.getMetrics();
  const avgResponseTime = metricsCollector.getAverageResponseTime();
  const errorRate = metricsCollector.getErrorRate();
  const throughput = metricsCollector.getThroughput();

  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    metrics: {
      averageResponseTime: Math.round(avgResponseTime),
      errorRate: Math.round(errorRate * 100) / 100,
      throughput: Math.round(throughput * 100) / 100,
      totalRequests: metrics.length
    },
    database: {
      connected: true, // Should check actual DB connection
      responseTime: 0  // Should measure actual DB query time
    },
    external: {
      hikvision: {
        connected: true, // Should check actual Hikvision connection
        lastSync: new Date().toISOString()
      }
    }
  };

  // Determine overall health status
  if (avgResponseTime > 5000 || errorRate > 10) {
    health.status = 'degraded';
  }

  if (avgResponseTime > 10000 || errorRate > 25) {
    health.status = 'unhealthy';
  }

  res.status(health.status === 'healthy' ? 200 : 503).json(health);
};
```

### **5.2 Business Metrics Dashboard**


## 🔐 **6. SECURITY IMPLEMENTATION**

### **6.1 Authentication & Authorization**