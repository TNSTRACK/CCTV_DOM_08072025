// src/utils/validation.ts
// Validaciones del lado del cliente para DOM CCTV MVP

import { z } from 'zod';

// PATRÓN: Validación de RUT chileno (sincronizada con backend)
const rutRegex = /^\d{7,8}-[0-9K]$/;
export const rutSchema = z.string()
  .min(1, 'RUT requerido')
  .regex(rutRegex, 'Formato de RUT inválido (ej: 12345678-9)')
  .refine((rut) => {
    // Validar dígito verificador
    const [number, checkDigit] = rut.split('-');
    return validateRUTCheckDigit(parseInt(number), checkDigit);
  }, 'RUT inválido - dígito verificador incorrecto');

// Función auxiliar para validar RUT chileno
function validateRUTCheckDigit(rut: number, expectedDigit: string): boolean {
  let sum = 0;
  let multiplier = 2;
  const rutStr = rut.toString();
  
  for (let i = rutStr.length - 1; i >= 0; i--) {
    sum += parseInt(rutStr[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const remainder = sum % 11;
  const calculatedDigit = 11 - remainder;
  
  let expectedCalculated: string;
  if (calculatedDigit === 11) expectedCalculated = '0';
  else if (calculatedDigit === 10) expectedCalculated = 'K';
  else expectedCalculated = calculatedDigit.toString();
  
  return expectedDigit === expectedCalculated;
}

// PATRÓN: Validación de patente chilena (formato antiguo ABC123 y nuevo ABCD12)
const licensePlateRegex = /^[A-Z]{3}\d{3}$|^[A-Z]{4}\d{2}$/;
export const licensePlateSchema = z.string()
  .min(5, 'Patente muy corta')
  .max(6, 'Patente muy larga')
  .regex(licensePlateRegex, 'Formato de patente chilena inválido (ej: ABC123 o ABCD12)')
  .transform(str => str.toUpperCase());

// PATRÓN: Validación de email
export const emailSchema = z.string()
  .min(1, 'Email requerido')
  .email('Email inválido')
  .max(254, 'Email muy largo');

// PATRÓN: Validación de contraseña segura
export const passwordSchema = z.string()
  .min(8, 'Contraseña debe tener al menos 8 caracteres')
  .max(100, 'Contraseña muy larga')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Contraseña debe contener mayúscula, minúscula y número');

// PATRÓN: Schema para login
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Contraseña requerida'),
});

// PATRÓN: Schema para registro de usuarios
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string()
    .min(2, 'Nombre debe tener al menos 2 caracteres')
    .max(50, 'Nombre muy largo')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nombre solo puede contener letras y espacios'),
  lastName: z.string()
    .min(2, 'Apellido debe tener al menos 2 caracteres')
    .max(50, 'Apellido muy largo')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Apellido solo puede contener letras y espacios'),
  role: z.enum(['ADMINISTRATOR', 'OPERATOR', 'CLIENT_USER'], {
    errorMap: () => ({ message: 'Rol inválido' })
  }),
});

// PATRÓN: Schema para empresas
export const companySchema = z.object({
  rut: rutSchema,
  name: z.string()
    .min(2, 'Nombre de empresa muy corto')
    .max(200, 'Nombre de empresa muy largo')
    .regex(/^[a-zA-ZÀ-ÿ0-9\s\.\-,]+$/, 'Nombre de empresa contiene caracteres inválidos'),
  active: z.boolean().default(true),
});

// PATRÓN: Schema para metadatos de eventos
export const metadataSchema = z.object({
  companyId: z.string().min(1, 'Empresa requerida'),
  guideNumber: z.string()
    .min(1, 'Número de guía requerido')
    .max(50, 'Número de guía muy largo')
    .regex(/^[A-Z0-9\-]+$/, 'Número de guía solo puede contener letras, números y guiones'),
  guideDate: z.string()
    .min(1, 'Fecha de guía requerida')
    .refine((date) => !isNaN(Date.parse(date)), 'Fecha de guía inválida'),
  cargoDescription: z.string()
    .min(10, 'Descripción debe tener al menos 10 caracteres')
    .max(500, 'Descripción muy larga'),
  workOrder: z.string()
    .min(1, 'Orden de trabajo requerida')
    .max(50, 'Orden de trabajo muy larga')
    .regex(/^[A-Z0-9\-]+$/, 'Orden de trabajo solo puede contener letras, números y guiones'),
  receptionistId: z.string().min(1, 'Recepcionista requerido'),
});

// PATRÓN: Schema para búsqueda de eventos
export const eventSearchSchema = z.object({
  licensePlate: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  cameraName: z.string().optional(),
  companyId: z.string().optional(),
  hasMetadata: z.boolean().optional(),
  page: z.number().min(1, 'Página debe ser mayor a 0').default(1),
  limit: z.number().min(1).max(100).default(25),
  sortBy: z.enum(['licensePlate', 'eventDateTime']).default('eventDateTime'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// PATRÓN: Schema para actualización de perfil
export const profileUpdateSchema = z.object({
  firstName: z.string()
    .min(2, 'Nombre debe tener al menos 2 caracteres')
    .max(50, 'Nombre muy largo')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nombre solo puede contener letras y espacios'),
  lastName: z.string()
    .min(2, 'Apellido debe tener al menos 2 caracteres')
    .max(50, 'Apellido muy largo')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Apellido solo puede contener letras y espacios'),
});

// PATRÓN: Schema para cambio de contraseña
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Contraseña actual requerida'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirmación de contraseña requerida'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'La nueva contraseña debe ser diferente a la actual',
  path: ['newPassword'],
});

// PATRÓN: Schema para filtros de fecha
export const dateRangeSchema = z.object({
  startDate: z.string()
    .refine((date) => !isNaN(Date.parse(date)), 'Fecha de inicio inválida')
    .optional(),
  endDate: z.string()
    .refine((date) => !isNaN(Date.parse(date)), 'Fecha de fin inválida')
    .optional(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate);
  }
  return true;
}, {
  message: 'Fecha de inicio debe ser menor o igual a fecha de fin',
  path: ['endDate'],
});

// PATRÓN: Types TypeScript derivados de schemas
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type CompanyData = z.infer<typeof companySchema>;
export type MetadataData = z.infer<typeof metadataSchema>;
export type EventSearchData = z.infer<typeof eventSearchSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
export type PasswordChangeData = z.infer<typeof passwordChangeSchema>;
export type DateRangeData = z.infer<typeof dateRangeSchema>;

// PATRÓN: Función helper para validar RUT con formato visual
export const validateRUTFormat = (rut: string): boolean => {
  try {
    rutSchema.parse(rut);
    return true;
  } catch {
    return false;
  }
};

// PATRÓN: Función helper para validar patente con formato visual
export const validateLicensePlateFormat = (plate: string): boolean => {
  try {
    licensePlateSchema.parse(plate);
    return true;
  } catch {
    return false;
  }
};

// PATRÓN: Función helper para formatear RUT automáticamente
export const formatRUT = (input: string): string => {
  // Remover caracteres no válidos
  const cleaned = input.replace(/[^0-9Kk]/g, '');
  
  // Si tiene menos de 2 caracteres, retornar como está
  if (cleaned.length < 2) return cleaned;
  
  // Separar número y dígito verificador
  const number = cleaned.slice(0, -1);
  const checkDigit = cleaned.slice(-1).toUpperCase();
  
  // Formatear con guión
  return `${number}-${checkDigit}`;
};

// PATRÓN: Función helper para formatear patente automáticamente
export const formatLicensePlate = (input: string): string => {
  // Remover caracteres no válidos y convertir a mayúsculas
  const cleaned = input.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  
  // Limitar a 6 caracteres máximo
  return cleaned.slice(0, 6);
};

// PATRÓN: Función helper para validar fecha en formato ISO
export const validateISODate = (date: string): boolean => {
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === date.slice(0, 10);
};

// PATRÓN: Función helper para validar rango de fechas
export const validateDateRange = (startDate: string, endDate: string): boolean => {
  if (!validateISODate(startDate) || !validateISODate(endDate)) {
    return false;
  }
  
  return new Date(startDate) <= new Date(endDate);
};

// PATRÓN: Función helper para obtener errores de validación en formato amigable
export const getValidationErrors = (error: z.ZodError): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  
  return errors;
};

// PATRÓN: Función helper para validar email con mensaje específico
export const validateEmail = (email: string): { isValid: boolean; message: string } => {
  try {
    emailSchema.parse(email);
    return { isValid: true, message: '' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, message: error.errors[0].message };
    }
    return { isValid: false, message: 'Email inválido' };
  }
};

// PATRÓN: Función helper para validar contraseña con mensaje específico
export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  try {
    passwordSchema.parse(password);
    return { isValid: true, message: '' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, message: error.errors[0].message };
    }
    return { isValid: false, message: 'Contraseña inválida' };
  }
};