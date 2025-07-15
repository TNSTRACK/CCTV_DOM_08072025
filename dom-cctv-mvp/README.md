# DOM CCTV MVP - Sistema de Videovigilancia

Sistema MVP completo para gestión y documentación de eventos de videovigilancia con reconocimiento automático de placas patentes (ANPR).

## 🚀 Características

- **Autenticación JWT** con roles (Administrador/Operador)
- **Búsqueda de eventos** por matrícula, fecha y cámara
- **Reproductor de video** con zoom 2x-4x
- **Documentación de metadatos** para eventos
- **Dashboard con estadísticas** en tiempo real
- **Validación de datos chilenos** (RUT, placas patentes)
- **Interfaz responsive** con Material-UI

## 🏗️ Arquitectura

```
dom-cctv-mvp/
├── backend/          # API REST con Express.js + Prisma + MySQL
├── frontend/         # React + TypeScript + Material-UI
└── README.md         # Este archivo
```

## 📋 Requisitos Previos

- Node.js 18+ y npm 8+
- MySQL 8.0+
- Git

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
cd dom-cctv-mvp
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones de base de datos

# Generar cliente Prisma
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# Seed base de datos con datos de prueba
npm run db:seed
```

### 3. Configurar Frontend

```bash
cd ../frontend

# Instalar dependencias
npm install
```

## 🚀 Ejecutar en Desarrollo

### Terminal 1 - Backend
```bash
cd backend
npm run dev
# Servidor en http://localhost:3001
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# Aplicación en http://localhost:5173
```

## 🔐 Credenciales de Demo

- **Email:** admin@domcctv.cl
- **Contraseña:** password123

## 📊 Base de Datos

El sistema incluye datos de prueba:
- 50 eventos ANPR con placas chilenas
- 5 empresas con RUTs válidos
- 8 usuarios (1 admin + 7 operadores)
- Metadatos asociados para 70% de los eventos

## 🎯 Flujo de Usuario

1. **Login** → Dashboard con estadísticas
2. **Buscar eventos** por matrícula/fecha
3. **Ver video** con controles de zoom
4. **Documentar evento** con formulario de metadatos
5. **Guardar** y marcar como documentado

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📦 Build para Producción

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## 🔧 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Perfil del usuario
- `POST /api/auth/logout` - Cerrar sesión

### Eventos
- `GET /api/events` - Buscar eventos con filtros
- `GET /api/events/:id` - Detalle de evento
- `GET /api/events/:id/video` - Info del video
- `GET /api/events/stats` - Estadísticas

### Metadatos
- `POST /api/events/:id/metadata` - Crear metadatos
- `PUT /api/events/:id/metadata` - Actualizar metadatos
- `GET /api/events/:id/metadata` - Obtener metadatos

### Empresas
- `GET /api/companies` - Lista de empresas activas
- `GET /api/companies/search` - Buscar empresas

## 🌐 Variables de Entorno

### Backend (.env)
```env
DATABASE_URL="mysql://user:password@localhost:3306/dom_cctv_mvp"
JWT_SECRET="your-secret-key-32-chars"
PORT=3001
NODE_ENV=development
```

### Frontend (Vite maneja automáticamente el proxy)
```env
VITE_API_URL=/api
```

## 📁 Estructura del Proyecto

### Backend
```
backend/src/
├── controllers/      # Controladores de API
├── middleware/       # Middleware (auth, logging, errors)
├── routes/          # Definiciones de rutas
├── services/        # Lógica de negocio
├── utils/           # Utilidades y validación
└── app.ts          # Configuración principal
```

### Frontend
```
frontend/src/
├── components/      # Componentes React reutilizables
├── pages/          # Páginas principales
├── hooks/          # Custom hooks
├── services/       # Clientes API
├── stores/         # Estado global (Zustand)
├── types/          # Tipos TypeScript
└── utils/          # Utilidades
```

## 🐛 Troubleshooting

### Base de datos
```bash
# Reiniciar base de datos
npm run db:reset
npm run db:seed
```

### Limpiar caché
```bash
# Backend
rm -rf node_modules package-lock.json
npm install

# Frontend
rm -rf node_modules package-lock.json
npm install
```

### Verificar conexión
```bash
# Health check del backend
curl http://localhost:3001/health
```

## 📋 TODO para Producción

- [ ] Configurar HTTPS
- [ ] Implementar rate limiting por usuario
- [ ] Agregar logs estructurados
- [ ] Configurar monitoreo de errores
- [ ] Implementar backup automatizado
- [ ] Agregar tests de integración E2E
- [ ] Configurar CI/CD
- [ ] Optimizar queries de base de datos
- [ ] Implementar paginación server-side

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

MIT License - ver archivo `LICENSE` para detalles.

---

**DOM CCTV MVP** - Sistema de videovigilancia desarrollado para gestión eficiente de eventos ANPR.