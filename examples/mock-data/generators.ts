// examples/mock-data/generators.ts
// Generadores de datos mock para desarrollo MVP

import { faker } from '@faker-js/faker';

// PATRÓN: Generador de RUTs chilenos válidos
export const generateChileanRUT = (): string => {
  const number = faker.number.int({ min: 10000000, max: 99999999 });
  const checkDigit = calculateRUTCheckDigit(number);
  return `${number}-${checkDigit}`;
};

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

// PATRÓN: Generador de matrículas chilenas
export const generateChileanLicensePlate = (): string => {
  const formats = [
    // Formato antiguo: ABC123
    () => {
      const letters = faker.string.alpha({ length: 3, casing: 'upper' });
      const numbers = faker.string.numeric(3);
      return `${letters}${numbers}`;
    },
    // Formato nuevo: ABCD12
    () => {
      const letters = faker.string.alpha({ length: 4, casing: 'upper' });
      const numbers = faker.string.numeric(2);
      return `${letters}${numbers}`;
    }
  ];
  
  return faker.helpers.arrayElement(formats)();
};

// PATRÓN: Datos de empresas mock chilenas
export const generateMockCompanies = (count: number = 5) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `comp_${(index + 1).toString().padStart(3, '0')}`,
    rut: generateChileanRUT(),
    name: `${faker.company.name()} ${faker.helpers.arrayElement(['S.A.', 'Ltda.', 'SpA'])}`,
    active: true,
    createdAt: faker.date.past({ years: 2 }),
    updatedAt: faker.date.recent({ days: 30 }),
  }));
};

// PATRÓN: Datos de usuarios mock
export const generateMockUsers = (companies: any[], count: number = 10) => {
  const roles = ['ADMINISTRATOR', 'OPERATOR'] as const;
  
  return Array.from({ length: count }, (_, index) => {
    const role = index === 0 ? 'ADMINISTRATOR' : faker.helpers.arrayElement(roles);
    const companyId = role === 'ADMINISTRATOR' ? null : faker.helpers.arrayElement(companies).id;
    
    return {
      id: `user_${(index + 1).toString().padStart(3, '0')}`,
      email: faker.internet.email().toLowerCase(),
      password: '$2b$10$rQZ4vJZYvHGHdVHJdVHJdVHJdVHJdVHJ', // "password123" hashed
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      role,
      companyId,
      active: true,
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent({ days: 7 }),
    };
  });
};

// PATRÓN: Nombres de cámaras realistas
const CAMERA_LOCATIONS = [
  'Entrada Principal ANPR',
  'Salida Principal ANPR', 
  'Zona Descarga Norte',
  'Zona Descarga Sur',
  'Área Conteo 1',
  'Área Conteo 2',
  'Panorámica Patio',
  'Báscula Principal',
  'Almacén Entrada',
  'Almacén Salida'
];

// PATRÓN: Eventos ANPR mock con datos realistas
export const generateMockEvents = (count: number = 50) => {
  return Array.from({ length: count }, (_, index) => {
    const eventDate = faker.date.between({ 
      from: new Date('2025-01-01'), 
      to: new Date() 
    });
    
    return {
      id: `event_${(index + 1).toString().padStart(3, '0')}`,
      licensePlate: generateChileanLicensePlate(),
      eventDateTime: eventDate,
      cameraName: faker.helpers.arrayElement(CAMERA_LOCATIONS),
      videoFilename: `video_${Date.now()}_${index}.mp4`,
      thumbnailPath: `thumbnails/thumb_${index}.jpg`,
      hasMetadata: faker.datatype.boolean({ probability: 0.7 }), // 70% con metadatos
      confidence: faker.number.float({ min: 85, max: 99, fractionDigits: 1 }),
      createdAt: eventDate,
      updatedAt: faker.date.recent({ days: 1, refDate: eventDate }),
    };
  });
};

// PATRÓN: Metadatos mock para eventos
export const generateMockMetadata = (events: any[], companies: any[], users: any[]) => {
  return events
    .filter(event => event.hasMetadata)
    .map((event, index) => ({
      id: `meta_${(index + 1).toString().padStart(3, '0')}`,
      eventId: event.id,
      companyId: faker.helpers.arrayElement(companies).id,
      guideNumber: `GD-${faker.string.numeric(6)}`,
      guideDate: faker.date.recent({ days: 30 }),
      cargoDescription: faker.helpers.arrayElement([
        'Encofrados metálicos tipo muro',
        'Placas de encofrado 120x60cm',
        'Puntales telescópicos ajustables',
        'Vigas de arriostramiento H20',
        'Conectores y accesorios diversos',
        'Encofrados especiales para columnas',
        'Sistema de encofrado modular',
        'Elementos de apuntalamiento vertical'
      ]),
      workOrder: `OT-${faker.string.numeric(4)}`,
      receptionistId: faker.helpers.arrayElement(users.filter(u => u.role !== 'ADMINISTRATOR')).id,
      createdAt: event.eventDateTime,
      updatedAt: faker.date.recent({ days: 1 }),
    }));
};

// PATRÓN: Seeder completo para base de datos
export const generateCompleteDataset = () => {
  const companies = generateMockCompanies(5);
  const users = generateMockUsers(companies, 8);
  const events = generateMockEvents(50);
  const metadata = generateMockMetadata(events, companies, users);
  
  return {
    companies,
    users,
    events,
    metadata,
  };
};

// PATRÓN: Usuario administrativo por defecto
export const getDefaultAdminUser = () => ({
  id: 'admin_001',
  email: 'admin@domcctv.cl',
  password: '$2b$10$rQZ4vJZYvHGHdVHJdVHJdVHJdVHJdVHJ', // "password123"
  firstName: 'Administrador',
  lastName: 'Sistema',
  role: 'ADMINISTRATOR' as const,
  companyId: null,
  active: true,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date(),
});

// PATRÓN: Script de seeding para desarrollo
export const seedDatabase = async (prisma: any) => {
  console.log('🌱 Iniciando seeding de base de datos...');
  
  // Limpiar datos existentes
  await prisma.metadataEntry.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();
  
  const dataset = generateCompleteDataset();
  
  // Insertar datos en orden correcto (respetando FKs)
  console.log('📦 Insertando empresas...');
  await prisma.company.createMany({ data: dataset.companies });
  
  console.log('👥 Insertando usuarios...');
  await prisma.user.createMany({ data: [getDefaultAdminUser(), ...dataset.users] });
  
  console.log('📹 Insertando eventos...');
  await prisma.event.createMany({ data: dataset.events });
  
  console.log('📋 Insertando metadatos...');
  await prisma.metadataEntry.createMany({ data: dataset.metadata });
  
  console.log('✅ Seeding completado!');
  console.log(`   - ${dataset.companies.length} empresas`);
  console.log(`   - ${dataset.users.length + 1} usuarios (+ 1 admin)`);
  console.log(`   - ${dataset.events.length} eventos`);
  console.log(`   - ${dataset.metadata.length} metadatos`);
  
  return dataset;
};
