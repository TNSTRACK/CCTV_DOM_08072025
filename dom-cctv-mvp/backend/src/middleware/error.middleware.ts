// src/middleware/error.middleware.ts
// Middleware de manejo de errores centralizado

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

// PATRÓN: Error handler centralizado para MVP
export const errorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  // PATRÓN: Manejo de errores de validación Zod
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: 'Datos de entrada inválidos',
      details: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  // PATRÓN: Manejo de errores de Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        res.status(409).json({
          success: false,
          error: 'Registro duplicado',
          details: `El valor ya existe: ${err.meta?.target}`,
        });
        return;
      
      case 'P2025':
        res.status(404).json({
          success: false,
          error: 'Registro no encontrado',
        });
        return;
      
      case 'P2003':
        res.status(400).json({
          success: false,
          error: 'Violación de clave foránea',
          details: 'El registro referenciado no existe',
        });
        return;
    }
  }

  // PATRÓN: Errores JWT
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      error: 'Token inválido',
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: 'Token expirado',
    });
    return;
  }

  // PATRÓN: Error personalizado con código de estado
  const statusCode = (err as AppError).statusCode || 500;
  const message = statusCode === 500 
    ? 'Error interno del servidor' 
    : err.message;

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err,
    }),
  });
};

// PATRÓN: Wrapper para async route handlers
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// PATRÓN: Creador de errores personalizados
export const createError = (message: string, statusCode: number = 500): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};