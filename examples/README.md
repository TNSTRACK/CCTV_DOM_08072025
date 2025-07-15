# README.md - Examples Documentation
## Ejemplos Específicos para Context Engineering

### 📁 Estructura de Ejemplos Actualizados

```
examples/
├── authentication/          # ✅ Autenticación y autorización
│   └── jwt-middleware.ts   # Middleware JWT robusto
├── database/               # ✅ Queries optimizadas
│   └── queries.sql         # Patrones SQL con índices
├── express-setup/          # 🆕 Configuración Express completa
│   ├── app-complete.ts     # Setup completo de Express
│   ├── error-middleware.ts # Manejo de errores centralizado
│   └── logging-middleware.ts # Logging para desarrollo
├── forms/                  # ✅ Formularios React + validación
│   └── metadata-form-component.tsx # Formulario completo
├── hikvision/              # ✅ Integración APIs (para referencia)
│   └── api-integration.ts  # Cliente Hikvision completo
├── mock-data/              # 🆕 Generadores de datos para MVP
│   └── generators.ts       # Datos mock chilenos realistas
├── react-components/       # 🆕 Componentes React para MVP
│   ├── dashboard-simple.tsx # Dashboard básico funcional
│   ├── search-events.tsx   # Búsqueda con filtros
│   └── video-player-simple.tsx # Reproductor básico con zoom
├── tests/                  # ✅ Patrones de testing
│   └── api-test-patterns.test.ts # Tests comprehensivos
├── validation/             # 🆕 Validaciones Zod específicas
│   └── schemas.ts          # Schemas chilenos (RUT, matrículas)
└── video/                  # ✅ Reproductor avanzado
    └── video-player-component.tsx # Reproductor con funciones completas
```

### 🎯 Propósito por Categoría

#### **🔐 Authentication** 
- `jwt-middleware.ts` - **USAR ESTE PATRÓN** para autenticación
- Incluye validación de usuario activo y roles
- Middleware de autorización granular

#### **🗄️ Database**
- `queries.sql` - **CONSULTAS OPTIMIZADAS** para búsquedas <2s
- Índices específicos para performance
- Queries dinámicas con filtros seguros

#### **⚙️ Express Setup**
- `app-complete.ts` - **CONFIGURACIÓN COMPLETA** de Express para MVP
- Security headers, CORS, rate limiting
- Serve estático para videos y thumbnails
- `error-middleware.ts` - **MANEJO DE ERRORES** centralizado
- `logging-middleware.ts` - **LOGGING** para desarrollo y debug

#### **📊 Mock Data**
- `generators.ts` - **DATOS MOCK CHILENOS** realistas
- RUTs válidos con dígito verificador
- Matrículas en formato chileno
- Empresas y eventos de ejemplo para desarrollo

#### **⚛️ React Components**
- `dashboard-simple.tsx` - **DASHBOARD MVP** con métricas básicas
- `search-events.tsx` - **BÚSQUEDA COMPLETA** con filtros y paginación
- `video-player-simple.tsx` - **REPRODUCTOR BÁSICO** con zoom 4x máximo

#### **✅ Validation**
- `schemas.ts` - **VALIDACIONES ZOD** específicas para Chile
- RUT, matrículas, datos de empresas
- Middleware para Express con manejo de errores

### 🚀 Cómo Usar estos Ejemplos

#### **1. Para Backend (Express + Prisma)**
```typescript
// Seguir este patrón en app.ts
import { app } from './examples/express-setup/app-complete';
import { authenticateToken } from './examples/authentication/jwt-middleware';
import { validateRequest } from './examples/validation/schemas';
```

#### **2. Para Frontend (React + MUI)**
```typescript
// Usar estos componentes como base
import { DashboardSimple } from './examples/react-components/dashboard-simple';
import { SearchEvents } from './examples/react-components/search-events';
import { VideoPlayerSimple } from './examples/react-components/video-player-simple';
```

#### **3. Para Datos de Desarrollo**
```typescript
// Seed database con datos chilenos
import { seedDatabase } from './examples/mock-data/generators';
await seedDatabase(prisma);
```

### ⚠️ Diferencias entre Ejemplos

#### **Video Players:**
- `video-player-component.tsx` - **COMPLETO** (zoom 10x, marcadores, capturas)
- `video-player-simple.tsx` - **MVP** (zoom 4x, controles básicos únicamente)

**Para MVP usar el simple**, para FASE 2 usar el completo.

#### **Formularios:**
- `metadata-form-component.tsx` - **COMPLETO** con todas las validaciones
- Para MVP simplificar eliminando campos opcionales

### 🎯 Context Engineering Optimizations

#### **✅ Qué está optimizado:**
1. **Patrones chilenos específicos** (RUT, matrículas)
2. **Datos mock realistas** para desarrollo sin dependencias
3. **Componentes MVP-focused** con scope limitado
4. **Validaciones robustas** con mensajes en español
5. **Performance patterns** para búsquedas <2s

#### **🔧 Para PRPs, referenciar así:**
```markdown
## EXAMPLES TO FOLLOW EXACTLY:

### Backend Patterns:
- `examples/express-setup/app-complete.ts` - Express configuration
- `examples/authentication/jwt-middleware.ts` - Auth patterns  
- `examples/validation/schemas.ts` - Zod validation patterns

### Frontend Patterns:
- `examples/react-components/dashboard-simple.tsx` - Dashboard layout
- `examples/react-components/search-events.tsx` - Search functionality
- `examples/react-components/video-player-simple.tsx` - Video player MVP

### Data Patterns:
- `examples/mock-data/generators.ts` - Chilean mock data
- `examples/database/queries.sql` - Optimized queries
```

### 📋 Checklist para Claude Code

Al usar estos ejemplos en PRPs, verificar que incluye:

- [ ] **Importaciones exactas** de los ejemplos
- [ ] **Patrones de error handling** del error-middleware
- [ ] **Validaciones Zod** específicas para campos chilenos  
- [ ] **Queries SQL optimizadas** con índices correctos
- [ ] **Componentes MUI** con diseño consistente
- [ ] **Mock data** para desarrollo independiente

### 🎯 Success Metrics

Estos ejemplos están diseñados para:
- ✅ **Implementación en una pasada** con Claude Code
- ✅ **Datos mock chilenos** para testing inmediato  
- ✅ **Performance <2s** en búsquedas
- ✅ **UI consistente** con Material Design
- ✅ **Validaciones robustas** con manejo de errores

---

**Ejemplos Context Engineering optimizados para MVP DOM CCTV - Listos para implementación con Claude Code**
