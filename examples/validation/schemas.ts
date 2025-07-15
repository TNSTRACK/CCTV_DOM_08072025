// examples/validation/schemas.ts
// Esquemas de validación Zod para MVP DOM CCTV

import { z } from 'zod';

// PATRÓN: Validación de RUT chileno
const rutRegex = /^\d{7,8}-[0-9K]$/;
export const rutSchema = z.string()
  .regex(rutRegex, 'Formato de RUT inválido (ej: 12345678-9)')
  .refine((rut) => {
    // Validar dígito verificador
    const [number, checkDigit] = rut.split('-');
    return validateRUTCheckDigit(parseInt(number), checkDigit);
  }, 'RUT inválido - dígito verificador incorrecto');

// Función auxiliar para validar RUT
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

// PATRÓN: Validación de matrícula chilena
const licensePlateRegex = /^[A-Z]{3}\d{3}$|^[A-Z]{4}\d{2}$/;
export const licensePlateSchema = z.string()
  .min(5, 'Matrícula muy corta')
  .max(6, 'Matrícula muy larga')
  .regex(licensePlateRegex, 'Formato de matrícula chilena inválido (ej: ABC123 o ABCD12)')
  .transform(str => str.toUpperCase());

// PATRÓN: Schema para autenticación
export const loginSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .min(1, 'Email requerido'),
  password: z.string()
    .min(6, 'Contraseña debe tener al menos 6 caracteres')
    .max(100, 'Contraseña muy larga'),
});

export const registerSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .min(1, 'Email requerido'),
  password: z.string()
    .min(8, 'Contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Contraseña debe contener mayúscula, minúscula y número'),
  firstName: z.string()
    .min(2, 'Nombre debe tener al menos 2 caracteres')
    .max(50, 'Nombre muy largo'),
  lastName: z.string()
    .min(2, 'Apellido debe tener al menos 2 caracteres')
    .max(50, 'Apellido muy largo'),
  role: z.enum(['ADMINISTRATOR', 'OPERATOR'], {
    errorMap: () => ({ message: 'Rol inválido' })
  }),
});

// PATRÓN: Schema para empresas
export const companySchema = z.object({
  rut: rutSchema,
  name: z.string()
    .min(2, 'Nombre de empresa muy corto')
    .max(200, 'Nombre de empresa muy largo'),
  active: z.boolean().default(true),
});

// PATRÓN: Schema para eventos ANPR
export const eventSchema = z.object({
  licensePlate: licensePlateSchema,
  eventDateTime: z.date({
    required_error: 'Fecha y hora requeridas',
    invalid_type_error: 'Fecha y hora inválidas',
  }),
  cameraName: z.string()
    .min(1, 'Nombre de cámara requerido')
    .max(100, 'Nombre de cámara muy largo'),
  videoFilename: z.string()
    .min(1, 'Nombre de archivo requerido')
    .regex(/\.(mp4|avi|mov|mkv)$/i, 'Formato de video inválido'),
  confidence: z.number()
    .min(0, 'Confianza debe ser mayor a 0')
    .max(100, 'Confianza debe ser menor a 100')
    .default(95),
});

// PATRÓN: Schema para metadatos básicos
export const metadataSchema = z.object({
  companyId: z.string()
    .min(1, 'Empresa requerida'),
  guideNumber: z.string()
    .min(1, 'Número de guía requerido')
    .max(50, 'Número de guía muy largo'),
  guideDate: z.date({
    required_error: 'Fecha de guía requerida',
    invalid_type_error: 'Fecha de guía inválida',
  }),
  cargoDescription: z.string()
    .min(10, 'Descripción debe tener al menos 10 caracteres')
    .max(500, 'Descripción muy larga'),
  workOrder: z.string()
    .min(1, 'Orden de trabajo requerida')
    .max(50, 'Orden de trabajo muy larga'),
  receptionistId: z.string()
    .min(1, 'Recepcionista requerido'),
});

// PATRÓN: Schema para búsqueda de eventos
export const eventSearchSchema = z.object({
  licensePlate: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  cameraName: z.string().optional(),
  companyId: z.string().optional(),
  hasMetadata: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(25),
}).refine((data) => {
  // Validar que startDate sea anterior a endDate
  if (data.startDate && data.endDate) {
    return data.startDate <= data.endDate;
  }
  return true;
}, {
  message: 'Fecha de inicio debe ser anterior a fecha de fin',
  path: ['endDate'],
});

// PATRÓN: Schema para actualización de perfil
export const profileUpdateSchema = z.object({
  firstName: z.string()
    .min(2, 'Nombre debe tener al menos 2 caracteres')
    .max(50, 'Nombre muy largo'),
  lastName: z.string()
    .min(2, 'Apellido debe tener al menos 2 caracteres')
    .max(50, 'Apellido muy largo'),
  phone: z.string()
    .regex(/^\+?56[0-9]{8,9}$/, 'Teléfono chileno inválido (ej: +56912345678)')
    .optional(),
});

// PATRÓN: Schema para cambio de contraseña
export const passwordChangeSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Contraseña actual requerida'),
  newPassword: z.string()
    .min(8, 'Nueva contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Nueva contraseña debe contener mayúscula, minúscula y número'),
  confirmPassword: z.string()
    .min(1, 'Confirmación de contraseña requerida'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'La nueva contraseña debe ser diferente a la actual',
  path: ['newPassword'],
});

// PATRÓN: Types TypeScript derivados de schemas
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type CompanyData = z.infer<typeof companySchema>;
export type EventData = z.infer<typeof eventSchema>;
export type MetadataData = z.infer<typeof metadataSchema>;
export type EventSearchData = z.infer<typeof eventSearchSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
export type PasswordChangeData = z.infer<typeof passwordChangeSchema>;

// PATRÓN: Validadores para uso en middleware Express
export const validateRequest = <T>(schema: z.ZodSchema<T>) => {
  return (req: any, res: any, next: any) => {
    try {
      const validatedData = schema.parse(req.body);
      req.validatedData = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Datos de entrada inválidos',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      next(error);
    }
  };
};

// PATRÓN: Validadores para query parameters
export const validateQuery = <T>(schema: z.ZodSchema<T>) => {
  return (req: any, res: any, next: any) => {
    try {
      const validatedQuery = schema.parse(req.query);
      req.validatedQuery = validatedQuery;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Parámetros de consulta inválidos',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      next(error);
    }
  };
};
