// src/app.ts
// Configuración completa de Express para MVP DOM CCTV

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Middleware imports
import { errorHandler } from './middleware/error.middleware';
import { requestLogger } from './middleware/logging.middleware';
import { authenticateToken, requireRole } from './middleware/auth.middleware';

// Route imports
import authRoutes from './routes/auth.routes';
import eventsRoutes from './routes/events.routes';
import metadataRoutes from './routes/metadata.routes';
import companiesRoutes from './routes/companies.routes';
import usersRoutes from './routes/users.routes';

const app = express();
export const prisma = new PrismaClient();

// PATRÓN: Configuración de seguridad básica para MVP
// Aplicar helmet solo a rutas que NO sean archivos estáticos
app.use((req, res, next) => {
  // Saltar helmet para archivos estáticos
  if (req.path.startsWith('/uploads/')) {
    return next();
  }
  
  // Aplicar helmet para todas las demás rutas
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "blob:", "http://localhost:3001"],
        mediaSrc: ["'self'", "blob:", "http://localhost:3001"],
        scriptSrc: ["'self'"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })(req, res, next);
});

// PATRÓN: CORS para desarrollo (configurar para producción)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// PATRÓN: Rate limiting para prevenir abuso
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // máximo 100 requests por IP por ventana
  message: {
    error: 'Demasiadas solicitudes, intente más tarde',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// PATRÓN: Middleware básico
app.use(compression());
app.use(express.json({ limit: process.env.UPLOAD_MAX_SIZE || '10mb' }));
app.use(express.urlencoded({ extended: true, limit: process.env.UPLOAD_MAX_SIZE || '10mb' }));
app.use(requestLogger);

// PATRÓN: Servir archivos estáticos (videos, thumbnails)
app.use('/uploads', (req, res, next) => {
  // Configurar headers CORS y multimedia antes de servir archivos
  res.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
  res.set('Access-Control-Allow-Credentials', 'true');
  res.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Range');
  
  // Sobrescribir headers problemáticos de helmet
  res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  res.set('Cross-Origin-Opener-Policy', 'cross-origin');
  
  // Headers específicos para archivos multimedia
  if (req.path.endsWith('.mp4') || req.path.endsWith('.avi') || req.path.endsWith('.webm')) {
    res.set('Accept-Ranges', 'bytes');
    res.set('Content-Type', 'video/mp4');
  }
  if (req.path.endsWith('.jpg') || req.path.endsWith('.jpeg') || req.path.endsWith('.png')) {
    res.set('Content-Type', 'image/jpeg');
  }
  
  next();
}, express.static(path.join(process.cwd(), 'uploads'), {
  maxAge: '1d',
  etag: true,
  lastModified: true,
}));

// PATRÓN: Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Verificar conexión a base de datos
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: 'connected',
      version: process.env.npm_package_version || '1.0.0',
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown database error',
    });
  }
});

// PATRÓN: Rutas de API con prefijo consistente
app.use('/api/auth', authRoutes);
app.use('/api/events', authenticateToken, eventsRoutes);
app.use('/api', authenticateToken, metadataRoutes);
app.use('/api/companies', authenticateToken, companiesRoutes);
app.use('/api/users', authenticateToken, usersRoutes);

// PATRÓN: Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint no encontrado',
    path: req.originalUrl,
  });
});

// PATRÓN: Error handling centralizado
app.use(errorHandler);

// PATRÓN: Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

const PORT = process.env.PORT || 3001;

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor DOM CCTV MVP ejecutándose en puerto ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 CORS habilitado para: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

export default app;