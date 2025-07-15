// examples/express-setup/app-complete.ts
// Configuración completa de Express para MVP DOM CCTV

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import path from 'path';

// Middleware imports
import { authenticateToken, requireRole } from '../authentication/jwt-middleware';
import { errorHandler } from './error-middleware';
import { requestLogger } from './logging-middleware';

// Route imports
import authRoutes from './routes/auth.routes';
import eventsRoutes from './routes/events.routes';
import usersRoutes from './routes/users.routes';
import companiesRoutes from './routes/companies.routes';

const app = express();
export const prisma = new PrismaClient();

// PATRÓN: Configuración de seguridad básica para MVP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:"],
      mediaSrc: ["'self'", "blob:"],
      scriptSrc: ["'self'"],
    },
  },
}));

// PATRÓN: CORS para desarrollo (configurar para producción)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// PATRÓN: Rate limiting para prevenir abuso
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP por ventana
  message: {
    error: 'Demasiadas solicitudes, intente más tarde',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// PATRÓN: Middleware básico
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);

// PATRÓN: Servir archivos estáticos (videos, thumbnails)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), {
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
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message,
    });
  }
});

// PATRÓN: Rutas de API con prefijo consistente
app.use('/api/auth', authRoutes);
app.use('/api/events', authenticateToken, eventsRoutes);
app.use('/api/users', authenticateToken, requireRole(['ADMINISTRATOR']), usersRoutes);
app.use('/api/companies', authenticateToken, companiesRoutes);

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

export default app;
