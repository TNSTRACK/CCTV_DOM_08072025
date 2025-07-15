// prisma/seed.ts - Mock data seeding for DOM CCTV MVP
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// PATRÓN: Generador de RUTs chilenos válidos
const generateChileanRUT = (): string => {
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
const generateChileanLicensePlate = (): string => {
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
const generateMockCompanies = (count: number = 5) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `comp_${(index + 1).toString().padStart(3, '0')}`,
    rut: generateChileanRUT(),
    name: `${faker.company.name()} ${faker.helpers.arrayElement(['S.A.', 'Ltda.', 'SpA'])}`,
    active: true,
    createdAt: faker.date.past({ years: 2 }),
    updatedAt: faker.date.recent({ days: 30 }),
  }));
};

// PATRÓN: Usuarios específicos del sistema
const getSystemUsers = async () => {
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const operatorPassword = await bcrypt.hash('Operator123!', 10);
  
  return [
    {
      id: 'admin_001',
      email: 'admin@domcctv.cl',
      password: adminPassword,
      firstName: 'Administrador',
      lastName: 'Sistema',
      role: 'ADMINISTRATOR' as const,
      active: true,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date(),
    },
    {
      id: 'operator_001',
      email: 'operator@domcctv.cl',
      password: operatorPassword,
      firstName: 'Operador',
      lastName: 'Sistema',
      role: 'OPERATOR' as const,
      active: true,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date(),
    }
  ];
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
const generateMockEvents = (count: number = 50) => {
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
const generateMockMetadata = (events: any[], companies: any[], users: any[]) => {
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
      receptionistId: users.find(u => u.role === 'OPERATOR')?.id || users[1].id,
      createdAt: event.eventDateTime,
      updatedAt: faker.date.recent({ days: 1 }),
    }));
};


// PATRÓN: Script de seeding principal
async function seedDatabase() {
  console.log('🌱 Iniciando seeding de base de datos...');
  
  try {
    // Limpiar datos existentes
    console.log('🧹 Limpiando datos existentes...');
    await prisma.metadataEntry.deleteMany();
    await prisma.event.deleteMany();
    await prisma.user.deleteMany();
    await prisma.company.deleteMany();
    
    // Generar datos mock
    console.log('🎲 Generando datos mock...');
    const companies = generateMockCompanies(5);
    const systemUsers = await getSystemUsers();
    const events = generateMockEvents(50);
    const metadata = generateMockMetadata(events, companies, systemUsers);
    
    // Insertar datos en orden correcto (respetando FKs)
    console.log('📦 Insertando empresas...');
    await prisma.company.createMany({ data: companies });
    
    console.log('👥 Insertando usuarios...');
    await prisma.user.createMany({ data: systemUsers });
    
    console.log('📹 Insertando eventos...');
    await prisma.event.createMany({ data: events });
    
    console.log('📋 Insertando metadatos...');
    await prisma.metadataEntry.createMany({ data: metadata });
    
    console.log('✅ Seeding completado exitosamente!');
    console.log(`   - ${companies.length} empresas`);
    console.log(`   - ${systemUsers.length} usuarios`);
    console.log(`   - ${events.length} eventos`);
    console.log(`   - ${metadata.length} metadatos`);
    
    // Mostrar credenciales del sistema
    console.log('\n🔐 Credenciales del sistema:');
    console.log('\n  Administrador:');
    console.log('   - Email: admin@domcctv.cl');
    console.log('   - Contraseña: Admin123!');
    console.log('   - Rol: ADMINISTRATOR');
    console.log('\n  Operador:');
    console.log('   - Email: operator@domcctv.cl');
    console.log('   - Contraseña: Operator123!');
    console.log('   - Rol: OPERATOR');
    
  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
    throw error;
  }
}

// Ejecutar seeding si se llama directamente
if (require.main === module) {
  seedDatabase()
    .catch((error) => {
      console.error('❌ Error fatal:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export default seedDatabase;