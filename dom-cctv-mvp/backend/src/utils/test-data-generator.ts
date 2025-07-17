// src/utils/test-data-generator.ts
// Generador de datos de prueba para validación de RUTs y matrículas chilenas

import { faker } from '@faker-js/faker';

/**
 * Algoritmo de cálculo del dígito verificador del RUT chileno
 */
const calculateRUTCheckDigit = (rut: number): string => {
  let sum = 0;
  let multiplier = 2;
  const rutStr = rut.toString();
  
  for (let i = rutStr.length - 1; i >= 0; i--) {
    sum += parseInt(rutStr[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const remainder = sum % 11;
  const checkDigit = 11 - remainder;
  
  if (checkDigit === 11) return '0';
  if (checkDigit === 10) return 'K';
  return checkDigit.toString();
};

/**
 * Generar RUT empresarial chileno válido en rango 76-77 millones
 */
export const generateCompanyRUT = (): string => {
  const number = faker.number.int({ min: 76000000, max: 77999999 });
  const checkDigit = calculateRUTCheckDigit(number);
  return `${number}-${checkDigit}`;
};

/**
 * Generar RUT personal chileno válido
 */
export const generatePersonalRUT = (): string => {
  const number = faker.number.int({ min: 10000000, max: 25999999 });
  const checkDigit = calculateRUTCheckDigit(number);
  return `${number}-${checkDigit}`;
};

/**
 * Generar matrícula chilena válida (formato antiguo ABC123)
 */
export const generateOldFormatLicensePlate = (): string => {
  const letters = faker.string.alpha({ length: 3, casing: 'upper' });
  const numbers = faker.string.numeric(3);
  return `${letters}${numbers}`;
};

/**
 * Generar matrícula chilena válida (formato nuevo ABCD12)
 */
export const generateNewFormatLicensePlate = (): string => {
  const letters = faker.string.alpha({ length: 4, casing: 'upper' });
  const numbers = faker.string.numeric(2);
  return `${letters}${numbers}`;
};

/**
 * Generar matrícula chilena válida (formato mixto)
 */
export const generateChileanLicensePlate = (): string => {
  const useOldFormat = faker.datatype.boolean({ probability: 0.7 });
  return useOldFormat ? generateOldFormatLicensePlate() : generateNewFormatLicensePlate();
};

/**
 * Generar datos de empresa chilena de construcción
 */
export const generateConstructionCompany = () => {
  const companyNames = [
    'Constructora Los Andes',
    'Edificaciones del Sur',
    'Grupo Constructor Patagonia',
    'Ingeniería y Construcción Central',
    'Obras Civiles del Norte',
    'Desarrollo Inmobiliario Cordillera',
    'Construcciones Metropolitanas',
    'Empresa Constructora Valparaíso',
    'Proyectos y Construcciones BioBío',
    'Infraestructura y Obras Ltda',
    'Constructora Magallanes',
    'Obras y Proyectos Austral',
    'Constructora Valle Central',
    'Ingeniería del Pacífico'
  ];
  
  const companyTypes = ['S.A.', 'Ltda.', 'SpA', 'EIRL'];
  
  return {
    rut: generateCompanyRUT(),
    name: `${faker.helpers.arrayElement(companyNames)} ${faker.helpers.arrayElement(companyTypes)}`,
    active: faker.datatype.boolean({ probability: 0.9 }),
  };
};

/**
 * Generar lote de datos de prueba
 */
export const generateTestData = () => {
  console.log('🎲 Generando datos de prueba para validación...\n');
  
  // Generar 10 empresas con RUTs válidos
  console.log('📈 EMPRESAS CON RUTS VÁLIDOS (76-77 millones):');
  console.log('================================================');
  for (let i = 0; i < 10; i++) {
    const company = generateConstructionCompany();
    console.log(`${i + 1}. ${company.name}`);
    console.log(`   RUT: ${company.rut}`);
    console.log(`   Estado: ${company.active ? 'Activa' : 'Inactiva'}`);
    console.log('');
  }
  
  // Generar 20 matrículas válidas
  console.log('🚗 MATRÍCULAS CHILENAS VÁLIDAS:');
  console.log('===============================');
  
  console.log('Formato Antiguo (ABC123):');
  for (let i = 0; i < 10; i++) {
    const plate = generateOldFormatLicensePlate();
    console.log(`   ${i + 1}. ${plate}`);
  }
  
  console.log('\nFormato Nuevo (ABCD12):');
  for (let i = 0; i < 10; i++) {
    const plate = generateNewFormatLicensePlate();
    console.log(`   ${i + 1}. ${plate}`);
  }
  
  // Generar algunos RUTs personales de ejemplo
  console.log('\n👤 RUTS PERSONALES DE EJEMPLO:');
  console.log('==============================');
  for (let i = 0; i < 5; i++) {
    const rut = generatePersonalRUT();
    console.log(`   ${i + 1}. ${rut}`);
  }
  
  console.log('\n✅ Datos de prueba generados exitosamente!');
};

/**
 * Validar formato de RUT chileno
 */
export const validateRUTFormat = (rut: string): boolean => {
  const rutPattern = /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]$|^[0-9]{7,8}-[0-9kK]$/;
  return rutPattern.test(rut);
};

/**
 * Validar formato de matrícula chilena
 */
export const validateLicensePlateFormat = (plate: string): boolean => {
  const oldFormat = /^[A-Z]{3}[0-9]{3}$/;
  const newFormat = /^[A-Z]{4}[0-9]{2}$/;
  return oldFormat.test(plate) || newFormat.test(plate);
};

/**
 * Ejemplos de uso para testing
 */
export const testExamples = {
  validCompanyRUTs: [
    '76123456-7',
    '76789012-3',
    '77456789-0',
    '77012345-6'
  ],
  validPersonalRUTs: [
    '12345678-9',
    '18765432-1',
    '15432109-8',
    '20987654-3'
  ],
  validOldFormatPlates: [
    'ABC123',
    'XYZ789',
    'DEF456',
    'GHI012'
  ],
  validNewFormatPlates: [
    'ABCD12',
    'WXYZ89',
    'EFGH45',
    'IJKL67'
  ],
  invalidRUTs: [
    '12345678-0', // Dígito verificador incorrecto
    '76123456-9', // Dígito verificador incorrecto
    '1234567-8',  // Muy corto
    '123456789-1' // Muy largo
  ],
  invalidPlates: [
    'AB123',     // Muy corto
    'ABCDE12',   // Muy largo
    'ABC12A',    // Formato inválido
    '123ABC'     // Formato inválido
  ]
};

// Ejecutar si se llama directamente
if (require.main === module) {
  generateTestData();
}