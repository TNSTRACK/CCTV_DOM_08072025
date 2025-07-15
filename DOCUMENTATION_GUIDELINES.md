# Guías de Documentación - DOM CCTV MVP

## 📋 Instrucciones para Futuras Modificaciones

**IMPORTANTE**: Antes de realizar cualquier modificación en el código, LEE estos comentarios cuidadosamente. Después de hacer modificaciones, ACTUALIZA los comentarios correspondientes para mantener la documentación sincronizada.

## 🎯 Propósito del Sistema

Este es un sistema de videovigilancia para documentar y gestionar eventos de reconocimiento automático de matrículas (ANPR) en el proceso de descarga de camiones. Los eventos incluyen:

1. **Estacionamiento**: Detección de llegada y ubicación del camión
2. **Traslado de Carga**: Captura del proceso de descarga
3. **Conteo/Pesaje**: Documentación visual para validación

## 📁 Estructura del Proyecto

```
dom-cctv-mvp/
├── backend/                  # API Node.js/Express
│   ├── src/
│   │   ├── app.ts           # Configuración principal del servidor
│   │   ├── controllers/     # Controladores de rutas API
│   │   ├── middleware/      # Middleware de autenticación, errores, logging
│   │   ├── routes/          # Definición de rutas
│   │   ├── services/        # Lógica de negocio
│   │   └── utils/           # Utilidades y validaciones
│   ├── prisma/              # ORM y esquema de base de datos
│   └── uploads/             # Archivos estáticos (videos, thumbnails)
└── frontend/                # Aplicación React/TypeScript
    ├── src/
    │   ├── components/      # Componentes reutilizables
    │   ├── hooks/           # Custom hooks de React Query
    │   ├── pages/           # Páginas principales
    │   ├── services/        # Cliente API
    │   ├── stores/          # Estados globales (Zustand)
    │   ├── types/           # Definiciones TypeScript
    │   └── utils/           # Utilidades y tema
    └── public/              # Archivos estáticos
```

## 🔧 Estándares de Documentación

### Backend (Node.js/TypeScript)

#### 1. Archivos de Controladores
```typescript
// src/controllers/[nombre].controller.ts
// Descripción breve del controlador

/**
 * Descripción de la función
 * HTTP_METHOD /ruta/endpoint
 */
export const funcionName = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // PATRÓN: Describir el patrón usado (ej. validación, filtros, paginación)
  // Lógica aquí
});
```

#### 2. Servicios
```typescript
// src/services/[nombre].service.ts
// Descripción del servicio y su responsabilidad

/**
 * Descripción de la función del servicio
 */
export const functionName = async (params: Type): Promise<ReturnType> => {
  // PATRÓN: Describir el patrón (ej. consultas en paralelo, transacciones)
  // Lógica aquí
};
```

#### 3. Middleware
```typescript
// src/middleware/[nombre].middleware.ts
// Propósito del middleware

// PATRÓN: Tipo de patrón implementado (autenticación, manejo de errores, etc.)
export const middlewareName = (req, res, next) => {
  // Lógica del middleware
};
```

### Frontend (React/TypeScript)

#### 1. Componentes
```typescript
// src/components/[Categoria]/[Nombre].tsx
// Descripción breve del componente

interface ComponentProps {
  // Props del componente
}

/**
 * Descripción del componente y su propósito
 */
const ComponentName: React.FC<ComponentProps> = ({ props }) => {
  // PATRÓN: Describir patrones usados (hooks, estado, efectos)
  
  return (
    // JSX
  );
};
```

#### 2. Hooks Personalizados
```typescript
// src/hooks/use[Nombre].ts
// Descripción del hook personalizado

/**
 * Hook para [descripción de la funcionalidad]
 */
export const useHookName = (params: Type) => {
  // PATRÓN: Describir el patrón (React Query, estado local, etc.)
  
  return {
    // Valores retornados
  };
};
```

#### 3. Stores (Zustand)
```typescript
// src/stores/[nombre]Store.ts
// Descripción del store y su responsabilidad

// PATRÓN: Store [tipo] con [características]
export const useStoreName = create<StoreType>()(
  persist(
    (set, get) => ({
      // Estado y acciones
    }),
    {
      // Configuración de persistencia
    }
  )
);
```

## 🏗️ Patrones de Arquitectura Documentados

### Backend

1. **PATRÓN: Middleware de autenticación con validación de usuario activo**
   - Ubicación: `src/middleware/auth.middleware.ts`
   - Propósito: Validar tokens JWT y verificar usuario activo en cada request

2. **PATRÓN: Error handler centralizado para MVP**
   - Ubicación: `src/middleware/error.middleware.ts`
   - Propósito: Manejo consistente de errores Prisma, JWT, Zod, etc.

3. **PATRÓN: Wrapper para async route handlers**
   - Ubicación: `src/middleware/error.middleware.ts`
   - Propósito: Capturar errores automáticamente en controladores async

4. **PATRÓN: Consultas en paralelo para performance**
   - Ubicación: `src/services/events.service.ts`
   - Propósito: Ejecutar múltiples consultas simultáneamente

5. **PATRÓN: Construir WHERE clause dinámico**
   - Ubicación: `src/services/events.service.ts`
   - Propósito: Filtros flexibles basados en parámetros opcionales

### Frontend

1. **PATRÓN: Configuración de QueryClient optimizada para MVP**
   - Ubicación: `src/App.tsx`
   - Propósito: Cache y retry policies optimizadas

2. **PATRÓN: Store de autenticación con persistencia**
   - Ubicación: `src/stores/authStore.ts`
   - Propósito: Manejo de estado de autenticación persistente

3. **PATRÓN: Interceptores Axios para autenticación**
   - Ubicación: `src/services/api.ts`
   - Propósito: Manejo automático de tokens y errores de red

4. **PATRÓN: Componente de tabla con paginación y ordenamiento**
   - Ubicación: `src/components/Events/EventsTable.tsx`
   - Propósito: Tabla completa con funcionalidades avanzadas

## 🔄 Proceso de Modificación

### Antes de Modificar:
1. **LEE** todos los comentarios en el archivo que vas a modificar
2. **COMPRENDE** los patrones existentes documentados
3. **IDENTIFICA** las dependencias y efectos secundarios
4. **PLANIFICA** cómo tu cambio afectará otros componentes

### Durante la Modificación:
1. **MANTÉN** la consistencia con los patrones existentes
2. **AGREGA** comentarios para nuevos patrones o lógica compleja
3. **ACTUALIZA** comentarios existentes si cambias la funcionalidad
4. **PRUEBA** que los cambios funcionen según lo esperado

### Después de Modificar:
1. **ACTUALIZA** la documentación afectada
2. **REVISA** que todos los comentarios sigan siendo precisos
3. **AGREGA** nuevos patrones a esta guía si es necesario
4. **DOCUMENTA** cualquier nueva dependencia o configuración

## 📝 Ejemplos de Comentarios Requeridos

### Cuando AGREGAR comentarios:
- **Lógica de negocio compleja**: Explica el "por qué", no solo el "qué"
- **Patrones arquitectónicos**: Documenta el patrón usado y su propósito
- **Integraciones externas**: APIs, servicios, bibliotecas externas
- **Optimizaciones**: Explica por qué se eligió esa implementación
- **Workarounds**: Soluciones temporales o específicas

### Cuando ACTUALIZAR comentarios:
- **Cambios en la lógica**: Si cambias cómo funciona algo
- **Nuevos parámetros**: Si agregas o quitas parámetros de funciones
- **Cambios en el comportamiento**: Si el resultado esperado cambia
- **Deprecaciones**: Si algo se vuelve obsoleto

## 🚨 Alertas Importantes

### ⚠️ NUNCA elimines comentarios sin leer
Los comentarios pueden contener información crítica sobre:
- Problemas conocidos y sus soluciones
- Dependencias específicas de versión
- Configuraciones requeridas para producción
- Limitaciones técnicas importantes

### ⚠️ SIEMPRE actualiza comentarios después de cambios
Comentarios desactualizados son peores que no tener comentarios:
- Confunden a futuros desarrolladores
- Pueden llevar a bugs difíciles de detectar
- Rompen la confianza en la documentación

### ⚠️ CONSIDERA el impacto en otras partes del sistema
Este MVP tiene integraciones específicas:
- **Backend**: APIs de Hikvision, base de datos MySQL, archivos estáticos
- **Frontend**: React Query cache, estados persistentes, rutas protegidas

## 🔗 Referencias Técnicas

### Backend
- **Framework**: Express.js con TypeScript
- **ORM**: Prisma con MySQL
- **Autenticación**: JWT con bcrypt
- **Validación**: Zod schemas
- **Files**: Multer para archivos estáticos

### Frontend
- **Framework**: React 18 con TypeScript
- **UI**: Material-UI (MUI) v5
- **Estado**: Zustand con persistencia
- **Queries**: TanStack React Query
- **Routing**: React Router v6
- **Forms**: React Hook Form con validación

### Integraciones
- **Cámaras**: Hikvision OpenAPI e ISAPI
- **Base de datos**: MySQL 8.0+
- **Almacenamiento**: Local filesystem para videos/thumbnails

---

**Recordatorio Final**: Esta documentación es tan importante como el código mismo. Manténla actualizada y precisa para garantizar un desarrollo eficiente y mantenible del sistema DOM CCTV.