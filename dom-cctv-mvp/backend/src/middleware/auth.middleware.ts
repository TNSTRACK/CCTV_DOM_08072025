// src/middleware/auth.middleware.ts
// Patrón estándar para autenticación y autorización

import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { securityLogger } from './logging.middleware';

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'OPERATOR' | 'ADMINISTRATOR';
    firstName: string;
    lastName: string;
  };
  validatedData?: any;
  validatedQuery?: any;
}

// PATRÓN: Middleware de autenticación con validación de usuario activo
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    securityLogger('missing_token', { url: req.originalUrl }, req);
    res.status(401).json({ 
      success: false, 
      error: 'Token de acceso requerido' 
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // PATRÓN: Validación de usuario activo en cada request
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        active: true,
      },
    });

    if (!user || !user.active) {
      securityLogger('invalid_user', { 
        userId: decoded.userId, 
        userExists: !!user,
        userActive: user?.active 
      }, req);
      
      res.status(401).json({ 
        success: false, 
        error: 'Usuario inválido o inactivo' 
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    securityLogger('invalid_token', { 
      error: error instanceof Error ? error.message : 'Unknown authentication error',
      tokenExists: !!token 
    }, req);
    
    res.status(403).json({ 
      success: false, 
      error: 'Token inválido' 
    });
  }
};

// PATRÓN: Middleware de autorización por roles
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      securityLogger('insufficient_permissions', { 
        userId: req.user?.id,
        userRole: req.user?.role,
        requiredRoles: allowedRoles,
        url: req.originalUrl
      }, req);
      
      res.status(403).json({ 
        success: false, 
        error: 'Permisos insuficientes' 
      });
      return;
    }
    next();
  };
};

// PATRÓN: Middleware opcional para rutas que pueden ser públicas o autenticadas
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // No hay token, continúa sin autenticación
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        active: true,
      },
    });

    if (user && user.active) {
      req.user = user;
    }
    
    next();
  } catch (error) {
    // Token inválido, continúa sin autenticación
    next();
  }
};

// PATRÓN: Generador de tokens JWT
export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET no está configurado');
  }
  
  return jwt.sign(
    { userId },
    secret,
    { 
      expiresIn: '24h',
      issuer: 'DOM-CCTV-MVP',
      audience: 'dom-cctv-users'
    }
  );
};

// PATRÓN: Verificador de tokens JWT
export const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET!, {
    issuer: 'DOM-CCTV-MVP',
    audience: 'dom-cctv-users'
  });
};