// src/middleware/logging.middleware.ts
// Middleware de logging para desarrollo y producción

import { Request, Response, NextFunction } from 'express';

interface LogEntry {
  timestamp: string;
  method: string;
  url: string;
  statusCode?: number;
  responseTime?: number;
  userAgent?: string;
  ip: string;
  userId?: string;
}

// PATRÓN: Logger simple para MVP
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  
  // Extender Request para incluir user info
  const authenticatedReq = req as any;
  
  const logEntry: LogEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress || 'unknown',
    userAgent: req.get('User-Agent'),
  };

  // PATRÓN: Hook para capturar response cuando termine
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    
    const completeLogEntry = {
      ...logEntry,
      statusCode: res.statusCode,
      responseTime,
      userId: authenticatedReq.user?.id,
    };

    // PATRÓN: Log diferente según el nivel
    if (res.statusCode >= 400) {
      console.error('❌ ERROR REQUEST:', JSON.stringify(completeLogEntry, null, 2));
    } else if (responseTime > 1000) {
      console.warn('⚠️  SLOW REQUEST:', JSON.stringify(completeLogEntry, null, 2));
    } else if (process.env.NODE_ENV === 'development') {
      console.log('✅ REQUEST:', `${req.method} ${req.originalUrl} - ${res.statusCode} - ${responseTime}ms`);
    }
  });

  next();
};

// PATRÓN: Logger específico para eventos de seguridad
export const securityLogger = (event: string, details: any, req: Request): void => {
  const securityEntry = {
    timestamp: new Date().toISOString(),
    event,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    url: req.originalUrl,
    details,
  };

  console.warn('🔒 SECURITY EVENT:', JSON.stringify(securityEntry, null, 2));
};