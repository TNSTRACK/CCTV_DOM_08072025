// src/utils/__tests__/validation.test.ts
// Tests para validaciones del frontend - DOM CCTV MVP

import { describe, it, expect } from 'vitest';
import { 
  rutSchema, 
  licensePlateSchema, 
  loginSchema, 
  registerSchema, 
  metadataSchema,
  eventSearchSchema,
  companySchema,
  validateRUTFormat,
  validateLicensePlateFormat,
  formatRUT,
  formatLicensePlate,
  validateISODate,
  validateDateRange,
  getValidationErrors,
  validateEmail,
  validatePassword
} from '../validation';

describe('Validación de RUT chileno', () => {
  describe('RUTs válidos', () => {
    it('debe validar RUT con formato correcto y dígito verificador válido', () => {
      const validRUTs = [
        '12345678-9', // RUT estándar
        '87654321-0', // RUT con dígito verificador 0
        '11111111-K', // RUT con dígito verificador K
        '1234567-8',  // RUT de 7 dígitos
        '98765432-1'  // Otro RUT válido
      ];

      validRUTs.forEach(rut => {
        expect(() => rutSchema.parse(rut)).not.toThrow();
      });
    });

    it('debe validar RUT con K en minúscula', () => {
      expect(() => rutSchema.parse('11111111-k')).not.toThrow();
    });
  });

  describe('RUTs inválidos', () => {
    it('debe rechazar RUT con formato incorrecto', () => {
      const invalidFormats = [
        '12345678',     // Sin guión
        '12345678-',    // Sin dígito verificador
        '123456789',    // Sin guión y 9 dígitos
        '12-345-678-9', // Formato incorrecto
        '12.345.678-9', // Con puntos
        '1234567a-9',   // Con letras en número
        '12345678-99',  // Dígito verificador de 2 dígitos
        '12345678-A',   // Dígito verificador inválido
        '123456-9'      // Menos de 7 dígitos
      ];

      invalidFormats.forEach(rut => {
        expect(() => rutSchema.parse(rut)).toThrow();
      });
    });

    it('debe rechazar RUT con dígito verificador incorrecto', () => {
      const invalidCheckDigits = [
        '12345678-8', // Dígito verificador incorrecto
        '87654321-1', // Dígito verificador incorrecto
        '11111111-0', // Dígito verificador incorrecto
        '1234567-9'   // Dígito verificador incorrecto
      ];

      invalidCheckDigits.forEach(rut => {
        expect(() => rutSchema.parse(rut)).toThrow();
      });
    });

    it('debe rechazar RUT vacío', () => {
      expect(() => rutSchema.parse('')).toThrow();
    });
  });
});

describe('Validación de patentes chilenas', () => {
  describe('Patentes válidas', () => {
    it('debe validar patente formato antiguo (ABC123)', () => {
      const validOldPlates = [
        'ABC123',
        'XYZ789',
        'DEF456',
        'GHI321'
      ];

      validOldPlates.forEach(plate => {
        expect(() => licensePlateSchema.parse(plate)).not.toThrow();
      });
    });

    it('debe validar patente formato nuevo (ABCD12)', () => {
      const validNewPlates = [
        'ABCD12',
        'XYZW89',
        'DEFG56',
        'HIJK21'
      ];

      validNewPlates.forEach(plate => {
        expect(() => licensePlateSchema.parse(plate)).not.toThrow();
      });
    });

    it('debe convertir patente a mayúsculas', () => {
      const result = licensePlateSchema.parse('abc123');
      expect(result).toBe('ABC123');
    });
  });

  describe('Patentes inválidas', () => {
    it('debe rechazar patente con formato incorrecto', () => {
      const invalidPlates = [
        'AB123',      // Muy corta para formato antiguo
        'ABCDE12',    // Muy larga
        'ABC1234',    // Formato incorrecto
        'A1C123',     // Número en posición de letra
        'ABC12A',     // Letra en posición de número
        '123ABC',     // Formato invertido
        'ABC-123',    // Con guión
        'ABC 123',    // Con espacio
        ''            // Vacía
      ];

      invalidPlates.forEach(plate => {
        expect(() => licensePlateSchema.parse(plate)).toThrow();
      });
    });
  });
});

describe('Helper functions', () => {
  describe('validateRUTFormat', () => {
    it('debe validar RUT correcto', () => {
      expect(validateRUTFormat('12345678-9')).toBe(true);
      expect(validateRUTFormat('11111111-K')).toBe(true);
    });

    it('debe rechazar RUT incorrecto', () => {
      expect(validateRUTFormat('12345678-8')).toBe(false);
      expect(validateRUTFormat('invalid')).toBe(false);
      expect(validateRUTFormat('')).toBe(false);
    });
  });

  describe('validateLicensePlateFormat', () => {
    it('debe validar patente correcta', () => {
      expect(validateLicensePlateFormat('ABC123')).toBe(true);
      expect(validateLicensePlateFormat('ABCD12')).toBe(true);
    });

    it('debe rechazar patente incorrecta', () => {
      expect(validateLicensePlateFormat('AB123')).toBe(false);
      expect(validateLicensePlateFormat('ABCDE12')).toBe(false);
      expect(validateLicensePlateFormat('')).toBe(false);
    });
  });

  describe('formatRUT', () => {
    it('debe formatear RUT correctamente', () => {
      expect(formatRUT('123456789')).toBe('12345678-9');
      expect(formatRUT('11111111K')).toBe('11111111-K');
      expect(formatRUT('1234567k')).toBe('1234567-K');
    });

    it('debe manejar entrada parcial', () => {
      expect(formatRUT('1')).toBe('1');
      expect(formatRUT('12')).toBe('1-2');
      expect(formatRUT('123')).toBe('12-3');
    });

    it('debe remover caracteres no válidos', () => {
      expect(formatRUT('12.345.678-9')).toBe('12345678-9');
      expect(formatRUT('12,345,678-9')).toBe('12345678-9');
      expect(formatRUT('12 345 678-9')).toBe('12345678-9');
    });
  });

  describe('formatLicensePlate', () => {
    it('debe formatear patente correctamente', () => {
      expect(formatLicensePlate('abc123')).toBe('ABC123');
      expect(formatLicensePlate('abcd12')).toBe('ABCD12');
    });

    it('debe remover caracteres no válidos', () => {
      expect(formatLicensePlate('abc-123')).toBe('ABC123');
      expect(formatLicensePlate('abc 123')).toBe('ABC123');
      expect(formatLicensePlate('abc.123')).toBe('ABC123');
    });

    it('debe limitar a 6 caracteres', () => {
      expect(formatLicensePlate('abcdefgh123')).toBe('ABCDEF');
    });
  });

  describe('validateISODate', () => {
    it('debe validar fecha ISO correcta', () => {
      expect(validateISODate('2025-07-15')).toBe(true);
      expect(validateISODate('2025-01-01')).toBe(true);
      expect(validateISODate('2025-12-31')).toBe(true);
    });

    it('debe rechazar fecha inválida', () => {
      expect(validateISODate('invalid-date')).toBe(false);
      expect(validateISODate('2025-13-01')).toBe(false);
      expect(validateISODate('2025-01-32')).toBe(false);
      expect(validateISODate('')).toBe(false);
    });
  });

  describe('validateDateRange', () => {
    it('debe validar rango de fechas correcto', () => {
      expect(validateDateRange('2025-07-01', '2025-07-15')).toBe(true);
      expect(validateDateRange('2025-01-01', '2025-12-31')).toBe(true);
      expect(validateDateRange('2025-07-15', '2025-07-15')).toBe(true); // Mismo día
    });

    it('debe rechazar rango incorrecto', () => {
      expect(validateDateRange('2025-07-15', '2025-07-01')).toBe(false);
      expect(validateDateRange('invalid', '2025-07-15')).toBe(false);
      expect(validateDateRange('2025-07-01', 'invalid')).toBe(false);
    });
  });

  describe('getValidationErrors', () => {
    it('debe extraer errores de validación', () => {
      try {
        loginSchema.parse({ email: 'invalid', password: '123' });
      } catch (error) {
        const errors = getValidationErrors(error);
        expect(errors).toHaveProperty('email');
        expect(errors).toHaveProperty('password');
        expect(errors.email).toContain('inválido');
        expect(errors.password).toContain('6 caracteres');
      }
    });
  });

  describe('validateEmail', () => {
    it('debe validar email correcto', () => {
      const result = validateEmail('usuario@ejemplo.com');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });

    it('debe rechazar email incorrecto', () => {
      const result = validateEmail('invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('inválido');
    });
  });

  describe('validatePassword', () => {
    it('debe validar contraseña correcta', () => {
      const result = validatePassword('Password123');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });

    it('debe rechazar contraseña débil', () => {
      const result = validatePassword('weak');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('8 caracteres');
    });
  });
});

describe('Schemas de formularios', () => {
  describe('loginSchema', () => {
    it('debe validar datos de login correctos', () => {
      const validLogin = {
        email: 'usuario@ejemplo.com',
        password: 'password123'
      };

      expect(() => loginSchema.parse(validLogin)).not.toThrow();
    });

    it('debe rechazar email inválido', () => {
      const invalidLogin = {
        email: 'usuario',
        password: 'password123'
      };

      expect(() => loginSchema.parse(invalidLogin)).toThrow();
    });
  });

  describe('registerSchema', () => {
    it('debe validar datos de registro correctos', () => {
      const validRegister = {
        email: 'usuario@ejemplo.com',
        password: 'Password123',
        firstName: 'Juan',
        lastName: 'Pérez',
        role: 'OPERATOR' as const
      };

      expect(() => registerSchema.parse(validRegister)).not.toThrow();
    });

    it('debe rechazar nombres con números', () => {
      const invalidRegister = {
        email: 'usuario@ejemplo.com',
        password: 'Password123',
        firstName: 'Juan123',
        lastName: 'Pérez',
        role: 'OPERATOR' as const
      };

      expect(() => registerSchema.parse(invalidRegister)).toThrow();
    });
  });

  describe('metadataSchema', () => {
    it('debe validar metadatos correctos', () => {
      const validMetadata = {
        companyId: 'comp123',
        guideNumber: 'G-2025-001',
        guideDate: '2025-07-15T10:30:00Z',
        cargoDescription: 'Encofrados metálicos para construcción residencial',
        workOrder: 'WO-2025-001',
        receptionistId: 'user123'
      };

      expect(() => metadataSchema.parse(validMetadata)).not.toThrow();
    });

    it('debe rechazar guía con caracteres especiales', () => {
      const invalidMetadata = {
        companyId: 'comp123',
        guideNumber: 'G@2025#001',
        guideDate: '2025-07-15T10:30:00Z',
        cargoDescription: 'Encofrados metálicos para construcción residencial',
        workOrder: 'WO-2025-001',
        receptionistId: 'user123'
      };

      expect(() => metadataSchema.parse(invalidMetadata)).toThrow();
    });
  });

  describe('eventSearchSchema', () => {
    it('debe validar parámetros de búsqueda correctos', () => {
      const validSearch = {
        licensePlate: 'ABC123',
        startDate: '2025-07-01',
        endDate: '2025-07-15',
        cameraName: 'Entrada Principal',
        companyId: 'comp123',
        hasMetadata: true,
        page: 1,
        limit: 25,
        sortBy: 'eventDateTime' as const,
        sortOrder: 'desc' as const
      };

      expect(() => eventSearchSchema.parse(validSearch)).not.toThrow();
    });

    it('debe usar valores por defecto', () => {
      const minimalSearch = {};

      const result = eventSearchSchema.parse(minimalSearch);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(25);
      expect(result.sortBy).toBe('eventDateTime');
      expect(result.sortOrder).toBe('desc');
    });
  });

  describe('companySchema', () => {
    it('debe validar datos de empresa correctos', () => {
      const validCompany = {
        rut: '12345678-9',
        name: 'Empresa Ejemplo S.A.',
        active: true
      };

      expect(() => companySchema.parse(validCompany)).not.toThrow();
    });

    it('debe rechazar nombre con caracteres especiales peligrosos', () => {
      const invalidCompany = {
        rut: '12345678-9',
        name: 'Empresa <script>alert("hack")</script>',
        active: true
      };

      expect(() => companySchema.parse(invalidCompany)).toThrow();
    });
  });
});

describe('Casos edge específicos del frontend', () => {
  describe('Formateo automático', () => {
    it('debe formatear RUT mientras se escribe', () => {
      expect(formatRUT('1')).toBe('1');
      expect(formatRUT('12')).toBe('1-2');
      expect(formatRUT('123')).toBe('12-3');
      expect(formatRUT('1234')).toBe('123-4');
      expect(formatRUT('12345')).toBe('1234-5');
      expect(formatRUT('123456')).toBe('12345-6');
      expect(formatRUT('1234567')).toBe('123456-7');
      expect(formatRUT('12345678')).toBe('1234567-8');
      expect(formatRUT('123456789')).toBe('12345678-9');
    });

    it('debe formatear patente mientras se escribe', () => {
      expect(formatLicensePlate('a')).toBe('A');
      expect(formatLicensePlate('ab')).toBe('AB');
      expect(formatLicensePlate('abc')).toBe('ABC');
      expect(formatLicensePlate('abc1')).toBe('ABC1');
      expect(formatLicensePlate('abc12')).toBe('ABC12');
      expect(formatLicensePlate('abc123')).toBe('ABC123');
    });
  });

  describe('Validación en tiempo real', () => {
    it('debe validar RUT en tiempo real', () => {
      expect(validateRUTFormat('12345678-9')).toBe(true);
      expect(validateRUTFormat('1234567-')).toBe(false);
      expect(validateRUTFormat('1234567')).toBe(false);
    });

    it('debe validar patente en tiempo real', () => {
      expect(validateLicensePlateFormat('ABC123')).toBe(true);
      expect(validateLicensePlateFormat('ABCD12')).toBe(true);
      expect(validateLicensePlateFormat('ABC12')).toBe(false);
      expect(validateLicensePlateFormat('ABC')).toBe(false);
    });
  });

  describe('Mensajes de error específicos', () => {
    it('debe generar mensajes de error específicos para email', () => {
      const emptyResult = validateEmail('');
      expect(emptyResult.isValid).toBe(false);
      expect(emptyResult.message).toBe('Email requerido');

      const invalidResult = validateEmail('invalid');
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.message).toBe('Email inválido');
    });

    it('debe generar mensajes de error específicos para contraseña', () => {
      const shortResult = validatePassword('123');
      expect(shortResult.isValid).toBe(false);
      expect(shortResult.message).toContain('8 caracteres');

      const weakResult = validatePassword('password');
      expect(weakResult.isValid).toBe(false);
      expect(weakResult.message).toContain('mayúscula');
    });
  });
});