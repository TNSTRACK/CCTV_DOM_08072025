// src/__tests__/validation.test.ts
// Tests para validaciones de datos chilenos - DOM CCTV MVP

import { describe, it, expect } from '@jest/globals';
import { 
  rutSchema, 
  licensePlateSchema, 
  loginSchema, 
  registerSchema, 
  metadataSchema,
  eventSearchSchema,
  companySchema,
  validateRequest,
  validateQuery
} from '../utils/validation';

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

    it('debe rechazar RUT vacío o solo espacios', () => {
      const emptyRUTs = ['', '   ', null, undefined];

      emptyRUTs.forEach(rut => {
        expect(() => rutSchema.parse(rut)).toThrow();
      });
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

    it('debe convertir patente mixta a mayúsculas', () => {
      const result = licensePlateSchema.parse('AbC123');
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
        'ABCD123',    // Muy larga para formato nuevo
        'A1CD12',     // Número en posición de letra
        'ABCD1A',     // Letra en posición de número
        'ABC',        // Muy corta
        'A',          // Extremadamente corta
        ''            // Vacía
      ];

      invalidPlates.forEach(plate => {
        expect(() => licensePlateSchema.parse(plate)).toThrow();
      });
    });

    it('debe rechazar patente con caracteres especiales', () => {
      const invalidChars = [
        'ABC@123',
        'ABC#123',
        'ABC$123',
        'ABC%123',
        'ABC&123',
        'ABC*123',
        'ABC(123)',
        'ABC+123',
        'ABC=123',
        'ABC[123]',
        'ABC{123}',
        'ABC|123',
        'ABC\\123',
        'ABC/123',
        'ABC?123',
        'ABC.123',
        'ABC,123',
        'ABC;123',
        'ABC:123',
        'ABC\'123',
        'ABC"123',
        'ABC<123>',
        'ABC~123',
        'ABC`123'
      ];

      invalidChars.forEach(plate => {
        expect(() => licensePlateSchema.parse(plate)).toThrow();
      });
    });
  });
});

describe('Schema de login', () => {
  it('debe validar datos de login correctos', () => {
    const validLogin = {
      email: 'usuario@ejemplo.com',
      password: 'password123'
    };

    expect(() => loginSchema.parse(validLogin)).not.toThrow();
  });

  it('debe rechazar email inválido', () => {
    const invalidEmails = [
      { email: 'usuario', password: 'password123' },
      { email: '@ejemplo.com', password: 'password123' },
      { email: 'usuario@', password: 'password123' },
      { email: 'usuario@.com', password: 'password123' },
      { email: '', password: 'password123' }
    ];

    invalidEmails.forEach(data => {
      expect(() => loginSchema.parse(data)).toThrow();
    });
  });

  it('debe rechazar contraseña muy corta', () => {
    const invalidPasswords = [
      { email: 'usuario@ejemplo.com', password: '' },
      { email: 'usuario@ejemplo.com', password: '123' },
      { email: 'usuario@ejemplo.com', password: '12345' }
    ];

    invalidPasswords.forEach(data => {
      expect(() => loginSchema.parse(data)).toThrow();
    });
  });
});

describe('Schema de registro', () => {
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

  it('debe rechazar contraseña débil', () => {
    const weakPasswords = [
      { email: 'usuario@ejemplo.com', password: 'password', firstName: 'Juan', lastName: 'Pérez', role: 'OPERATOR' },
      { email: 'usuario@ejemplo.com', password: 'PASSWORD', firstName: 'Juan', lastName: 'Pérez', role: 'OPERATOR' },
      { email: 'usuario@ejemplo.com', password: '12345678', firstName: 'Juan', lastName: 'Pérez', role: 'OPERATOR' },
      { email: 'usuario@ejemplo.com', password: 'Password', firstName: 'Juan', lastName: 'Pérez', role: 'OPERATOR' }
    ];

    weakPasswords.forEach(data => {
      expect(() => registerSchema.parse(data)).toThrow();
    });
  });

  it('debe rechazar rol inválido', () => {
    const invalidRole = {
      email: 'usuario@ejemplo.com',
      password: 'Password123',
      firstName: 'Juan',
      lastName: 'Pérez',
      role: 'INVALID_ROLE'
    };

    expect(() => registerSchema.parse(invalidRole)).toThrow();
  });

  it('debe rechazar nombres muy cortos', () => {
    const shortNames = [
      { email: 'usuario@ejemplo.com', password: 'Password123', firstName: 'J', lastName: 'Pérez', role: 'OPERATOR' },
      { email: 'usuario@ejemplo.com', password: 'Password123', firstName: 'Juan', lastName: 'P', role: 'OPERATOR' }
    ];

    shortNames.forEach(data => {
      expect(() => registerSchema.parse(data)).toThrow();
    });
  });
});

describe('Schema de empresa', () => {
  it('debe validar datos de empresa correctos', () => {
    const validCompany = {
      rut: '12345678-9',
      name: 'Empresa Ejemplo S.A.',
      active: true
    };

    expect(() => companySchema.parse(validCompany)).not.toThrow();
  });

  it('debe usar active=true por defecto', () => {
    const companyWithoutActive = {
      rut: '12345678-9',
      name: 'Empresa Ejemplo S.A.'
    };

    const result = companySchema.parse(companyWithoutActive);
    expect(result.active).toBe(true);
  });

  it('debe rechazar RUT inválido en empresa', () => {
    const invalidRUT = {
      rut: '12345678-8', // Dígito verificador incorrecto
      name: 'Empresa Ejemplo S.A.',
      active: true
    };

    expect(() => companySchema.parse(invalidRUT)).toThrow();
  });
});

describe('Schema de metadatos', () => {
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

  it('debe rechazar descripción muy corta', () => {
    const shortDescription = {
      companyId: 'comp123',
      guideNumber: 'G-2025-001',
      guideDate: '2025-07-15T10:30:00Z',
      cargoDescription: 'Corta',
      workOrder: 'WO-2025-001',
      receptionistId: 'user123'
    };

    expect(() => metadataSchema.parse(shortDescription)).toThrow();
  });

  it('debe rechazar fecha inválida', () => {
    const invalidDate = {
      companyId: 'comp123',
      guideNumber: 'G-2025-001',
      guideDate: 'fecha-invalida',
      cargoDescription: 'Encofrados metálicos para construcción residencial',
      workOrder: 'WO-2025-001',
      receptionistId: 'user123'
    };

    expect(() => metadataSchema.parse(invalidDate)).toThrow();
  });
});

describe('Schema de búsqueda de eventos', () => {
  it('debe validar parámetros de búsqueda correctos', () => {
    const validSearch = {
      licensePlate: 'ABC123',
      startDate: '2025-07-01',
      endDate: '2025-07-15',
      cameraName: 'Entrada Principal',
      companyId: 'comp123',
      hasMetadata: 'true',
      page: '1',
      limit: '25',
      sortBy: 'eventDateTime',
      sortOrder: 'desc'
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

  it('debe transformar hasMetadata string a boolean', () => {
    const searchTrue = eventSearchSchema.parse({ hasMetadata: 'true' });
    const searchFalse = eventSearchSchema.parse({ hasMetadata: 'false' });
    const searchOther = eventSearchSchema.parse({ hasMetadata: 'other' });

    expect(searchTrue.hasMetadata).toBe(true);
    expect(searchFalse.hasMetadata).toBe(false);
    expect(searchOther.hasMetadata).toBe(undefined);
  });

  it('debe rechazar página inválida', () => {
    const invalidPage = { page: '0' };
    expect(() => eventSearchSchema.parse(invalidPage)).toThrow();
  });

  it('debe rechazar límite fuera de rango', () => {
    const invalidLimits = [
      { limit: '0' },
      { limit: '101' },
      { limit: '1000' }
    ];

    invalidLimits.forEach(data => {
      expect(() => eventSearchSchema.parse(data)).toThrow();
    });
  });
});

describe('Middleware de validación', () => {
  it('debe validar request body correctamente', () => {
    const mockReq = {
      body: {
        email: 'usuario@ejemplo.com',
        password: 'password123'
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const mockNext = jest.fn();

    const middleware = validateRequest(loginSchema);
    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.validatedData).toEqual(mockReq.body);
  });

  it('debe rechazar request body inválido', () => {
    const mockReq = {
      body: {
        email: 'email-invalido',
        password: '123'
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const mockNext = jest.fn();

    const middleware = validateRequest(loginSchema);
    middleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      error: 'Datos de entrada inválidos'
    }));
    expect(mockNext).not.toHaveBeenCalled();
  });
});

describe('Casos edge específicos chilenos', () => {
  describe('RUT casos especiales', () => {
    it('debe manejar RUT con ceros iniciales', () => {
      // En la práctica, RUTs con ceros iniciales son válidos
      const rutWithLeadingZeros = '01234567-8';
      expect(() => rutSchema.parse(rutWithLeadingZeros)).not.toThrow();
    });

    it('debe validar RUT mínimo de 7 dígitos', () => {
      const minRUT = '1000000-K';
      expect(() => rutSchema.parse(minRUT)).not.toThrow();
    });

    it('debe validar RUT máximo de 8 dígitos', () => {
      const maxRUT = '99999999-9';
      expect(() => rutSchema.parse(maxRUT)).not.toThrow();
    });
  });

  describe('Patentes casos especiales', () => {
    it('debe validar patente con todas las letras iguales', () => {
      const sameLetters = 'AAA111';
      expect(() => licensePlateSchema.parse(sameLetters)).not.toThrow();
    });

    it('debe validar patente con todos los números iguales', () => {
      const sameNumbers = 'ABC000';
      expect(() => licensePlateSchema.parse(sameNumbers)).not.toThrow();
    });

    it('debe validar patente formato nuevo con letras seguidas', () => {
      const newFormat = 'ABCD00';
      expect(() => licensePlateSchema.parse(newFormat)).not.toThrow();
    });
  });
});