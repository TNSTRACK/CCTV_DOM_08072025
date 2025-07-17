// src/services/hikvision.service.ts
// Servicio para integración con API Hikvision ANPR y Video

import axios, { AxiosInstance } from 'axios';
import { z } from 'zod';

// Configuración del cliente Hikvision
interface HikvisionConfig {
  baseURL: string;
  appKey: string;
  appSecret: string;
  timeout: number;
}

// Schemas de validación para respuestas de Hikvision
const ANPREventSchema = z.object({
  eventId: z.string(),
  licensePlate: z.string(),
  eventTime: z.string(),
  cameraId: z.string(),
  cameraName: z.string(),
  confidence: z.number().min(0).max(100),
  videoPath: z.string().optional(),
  imageUrl: z.string().optional(),
});

const ANPRSearchResponseSchema = z.object({
  data: z.object({
    list: z.array(ANPREventSchema),
    total: z.number(),
  }),
});

const VideoURLResponseSchema = z.object({
  data: z.object({
    url: z.string().url(),
  }),
});

const AuthResponseSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  token_type: z.string(),
});

export type HikvisionANPREvent = z.infer<typeof ANPREventSchema>;

export interface ANPRSearchParams {
  startTime: string;
  endTime: string;
  licensePlate?: string;
  cameraIds?: string[];
  pageNo?: number;
  pageSize?: number;
}

export interface VideoPlaybackParams {
  cameraId: string;
  startTime: string;
  endTime: string;
}

export class HikvisionService {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(private config: HikvisionConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Interceptor para logging de requests
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[Hikvision] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[Hikvision] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Interceptor para logging de responses
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[Hikvision] Response ${response.status} from ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('[Hikvision] Response error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Autenticación con refresh automático de token
   */
  async authenticate(): Promise<string> {
    // Verificar si el token actual es válido
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      console.log('[Hikvision] Authenticating...');
      
      const response = await this.client.post('/artemis/api/v1/oauth/token', {
        grant_type: 'client_credentials',
        scope: 'read write',
      }, {
        auth: {
          username: this.config.appKey,
          password: this.config.appSecret,
        },
      });

      // Validar la respuesta
      const authData = AuthResponseSchema.parse(response.data);
      
      this.accessToken = authData.access_token;
      // Reducir tiempo de expiración en 5 minutos para seguridad
      this.tokenExpiry = new Date(Date.now() + ((authData.expires_in - 300) * 1000));
      
      console.log('[Hikvision] Authentication successful, token expires at:', this.tokenExpiry);
      return this.accessToken;
    } catch (error) {
      console.error('[Hikvision] Authentication failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Hikvision authentication failed: ${errorMessage}`);
    }
  }

  /**
   * Búsqueda de eventos ANPR con validación robusta
   */
  async searchANPREvents(params: ANPRSearchParams): Promise<{ events: HikvisionANPREvent[]; totalCount: number }> {
    const token = await this.authenticate();
    
    try {
      console.log('[Hikvision] Searching ANPR events:', params);
      
      const response = await this.client.post('/artemis/api/v1/events/anpr/search', {
        pageNo: params.pageNo || 1,
        pageSize: Math.min(params.pageSize || 50, 100), // Límite máximo 100
        startTime: params.startTime,
        endTime: params.endTime,
        licensePlate: params.licensePlate?.toUpperCase(),
        cameraIndexCodes: params.cameraIds,
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      // Validar la respuesta
      const validatedResponse = ANPRSearchResponseSchema.parse(response.data);
      
      return {
        events: validatedResponse.data.list,
        totalCount: validatedResponse.data.total,
      };
    } catch (error) {
      console.error('[Hikvision] ANPR search failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`ANPR search failed: ${errorMessage}`);
    }
  }

  /**
   * Obtener URL de video para reproducción
   */
  async getVideoPlaybackURL(params: VideoPlaybackParams): Promise<string> {
    const token = await this.authenticate();
    
    try {
      console.log('[Hikvision] Getting video URL:', params);
      
      const response = await this.client.post('/artemis/api/v1/video/urls', {
        cameraIndexCode: params.cameraId,
        recordType: 0, // Grabación normal
        streamType: 0, // Stream principal
        protocol: 'rtsp', // Protocolo para video
        startTime: params.startTime,
        endTime: params.endTime,
        expireTime: 3600, // URL válida por 1 hora
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      // Validar la respuesta
      const validatedResponse = VideoURLResponseSchema.parse(response.data);
      
      return validatedResponse.data.url;
    } catch (error) {
      console.error('[Hikvision] Video URL retrieval failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Video URL retrieval failed: ${errorMessage}`);
    }
  }

  /**
   * Obtener lista de cámaras disponibles
   */
  async getCameraList(): Promise<Array<{ id: string; name: string; status: string }>> {
    const token = await this.authenticate();
    
    try {
      console.log('[Hikvision] Getting camera list');
      
      const response = await this.client.post('/artemis/api/v1/cameras/search', {
        pageNo: 1,
        pageSize: 100,
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      // Procesar la respuesta (esquema simplificado)
      const cameras = response.data.data?.list || [];
      
      return cameras.map((camera: any) => ({
        id: camera.cameraIndexCode,
        name: camera.cameraName,
        status: camera.status,
      }));
    } catch (error) {
      console.error('[Hikvision] Camera list retrieval failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Camera list retrieval failed: ${errorMessage}`);
    }
  }

  /**
   * Verificar conectividad con el servidor Hikvision
   */
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; message: string }> {
    try {
      await this.authenticate();
      return { status: 'healthy', message: 'Hikvision API is accessible' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { status: 'unhealthy', message: errorMessage };
    }
  }
}

/**
 * Singleton factory para el servicio Hikvision
 */
let hikvisionServiceInstance: HikvisionService | null = null;

export const getHikvisionService = (): HikvisionService => {
  if (!hikvisionServiceInstance) {
    const config: HikvisionConfig = {
      baseURL: process.env.HIKVISION_BASE_URL || 'https://api.hikvision.com',
      appKey: process.env.HIKVISION_APP_KEY || '',
      appSecret: process.env.HIKVISION_APP_SECRET || '',
      timeout: parseInt(process.env.HIKVISION_TIMEOUT || '10000'),
    };

    // Validar configuración
    if (!config.appKey || !config.appSecret) {
      throw new Error('Hikvision API credentials are not configured');
    }

    hikvisionServiceInstance = new HikvisionService(config);
  }

  return hikvisionServiceInstance;
};

/**
 * Convertir evento de Hikvision a formato de base de datos
 */
export const convertHikvisionEventToDBFormat = (hikvisionEvent: HikvisionANPREvent) => {
  return {
    id: hikvisionEvent.eventId,
    licensePlate: hikvisionEvent.licensePlate.toUpperCase(),
    eventDateTime: new Date(hikvisionEvent.eventTime),
    cameraName: hikvisionEvent.cameraName,
    confidence: hikvisionEvent.confidence,
    hasMetadata: false, // Inicialmente sin metadatos
    videoPath: hikvisionEvent.videoPath || null,
    thumbnailPath: hikvisionEvent.imageUrl || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};