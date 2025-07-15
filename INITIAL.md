# INITIAL.md - DOM CCTV MVP
## Context Engineering Optimized for Claude Code Implementation

0. **IMPORTANT**
   - Initial and fundamental step: REVIEW all existing documentation AND DO NOT modify existing documents.
   - I've made progress on what I'm requesting, and that's why it's key that you use what's available to improve it.
   - Therefore, if you see it necessary, given your knowledge, and modifications to existing documents need to be made, create new documents with the same name and add the "New" subtitle to differentiate them.
   
### **FEATURE STATEMENT**
Sistema web MVP para búsqueda y visualización de eventos ANPR simulados con reproductor de video básico y captura de metadatos de devolución de encofrados.

**Core Value Proposition:** Operador busca camión por matrícula → Ve video del evento → Agrega metadatos de devolución

---

## **🎯 MVP SCOPE DEFINITION**

### **Primary User Journey (CRITICAL PATH)**
```
1. ADMINISTRATOR login → Dashboard con eventos mock
2. Buscar evento por matrícula → Lista resultados filtrados  
3. Seleccionar evento → Reproductor video con zoom básico
4. Completar formulario metadatos → Guardar información devolución
5. Ver evento "documentado" en dashboard
```

### **Secondary User Journey (VALIDATION)**
```
1. OPERATOR login → Ve eventos asignados a su turno
2. Mismo flujo de búsqueda/documentación
3. Permisos limitados (no gestión usuarios)
```

---

## **🏗️ TECHNICAL IMPLEMENTATION SCOPE**

### **Backend Requirements (Essential Only)**
- **Framework:** Express.js + TypeScript + Prisma ORM
- **Database:** MySQL con 4 tablas core: users, companies, events, metadata_entries  
- **Auth:** JWT simple con 2 roles (ADMINISTRATOR, OPERATOR)
- **APIs:** 6 endpoints críticos
  - `POST /auth/login` - Autenticación JWT
  - `GET /events` - Buscar eventos con filtros
  - `GET /events/:id` - Detalle evento individual
  - `GET /events/:id/video` - URL video para reproductor
  - `POST /events/:id/metadata` - Crear metadatos
  - `PUT /events/:id/metadata` - Actualizar metadatos

### **Frontend Requirements (Essential Only)**  
- **Framework:** React 18 + TypeScript + Vite
- **UI Library:** Material-UI v5 (componentes básicos únicamente)
- **State:** TanStack Query + Zustand (configuración mínima)
- **Pages:** 4 páginas principales
  - `/login` - Autenticación simple
  - `/dashboard` - Lista eventos recientes (tabla básica)
  - `/events/search` - Búsqueda con filtros matrícula/fecha
  - `/events/:id` - Detalle evento + video + formulario metadatos

### **Video Player (Básico Funcional)**
- **Library:** Video.js (configuración estándar)
- **Features:** Play/pause/seek + zoom 2x-4x únicamente
- **Format:** Reproducir archivos .mp4 estáticos desde `/uploads/videos/`
- **No streams:** Solo archivos pre-grabados, sin RTSP

### **Mock Data System (Development)**
- **Events:** 50 eventos simulados con matrículas chilenas
- **Videos:** 5-10 videos .mp4 de ejemplo (pueden ser genéricos)
- **Companies:** 5 empresas mock con RUTs válidos chilenos
- **Metadata:** Formulario con campos esenciales únicamente

---

## **📋 DATA MODEL (Simplified)**

### **Core Entities (4 tables only)**
```typescript
// User - Solo 2 roles
interface User {
  id: string;
  email: string; 
  password: string; // bcrypt
  firstName: string;
  lastName: string;
  role: 'ADMINISTRATOR' | 'OPERATOR';
  active: boolean;
}

// Company - Datos mínimos
interface Company {
  id: string;
  rut: string; // RUT chileno válido
  name: string;
  active: boolean;
}

// Event - Solo campos esenciales
interface Event {
  id: string;
  licensePlate: string; // Formato chileno: ABC123 o ABCD12
  eventDateTime: Date;
  cameraName: string; // Texto simple, no FK
  videoFilename: string; // Nombre archivo en /uploads/videos/
  thumbnailPath?: string;
  hasMetadata: boolean; // Flag simple
}

// MetadataEntry - Formulario básico
interface MetadataEntry {
  id: string;
  eventId: string; // FK to Event
  companyId: string; // FK to Company  
  guideNumber: string;
  guideDate: Date;
  cargoDescription: string;
  workOrder: string; // Solo una orden, no dos
  receptionistId: string; // FK to User
}
```

---

## **🔧 EXAMPLES TO FOLLOW**

### **Code Patterns (Reference these exactly)**
- `examples/authentication/jwt-middleware.ts` - Auth pattern para Express
- `examples/forms/metadata-form-component.tsx` - Form con validación Zod
- `examples/video/video-player-component.tsx` - Video.js setup básico
- `examples/database/queries.sql` - Prisma query patterns

### **UI Patterns (Material-UI basic)**
- DataTable con paginación simple
- Formulario con validación visual
- Layout con sidebar básico
- Search bar con filtros date/text

---

## **📚 DOCUMENTATION REFERENCES**

### **Essential Libraries (Include in PRP)**
- **Prisma:** https://www.prisma.io/docs/getting-started/quickstart
- **Express + TypeScript:** https://github.com/Microsoft/TypeScript-Node-Starter
- **Material-UI:** https://mui.com/material-ui/getting-started/overview/
- **Video.js:** https://videojs.com/getting-started/
- **React Hook Form + Zod:** https://react-hook-form.com/advanced-usage#SchemaValidation

### **Chilean Specific**
- **RUT Validation:** https://github.com/cgustav/dart_rut_validator
- **License Plates:** https://github.com/Esteam85/patente-chilena-dv

---

## **⚠️ CRITICAL GOTCHAS**

### **Development Specific**
- **Mock Videos:** Use placeholder .mp4 files, Video.js needs real files
- **Chilean RUT:** Must validate format 12345678-9 including check digit
- **Timezone:** Always use America/Santiago for dates
- **License Plates:** Support both formats ABC123 and ABCD12

### **Common Pitfalls**
- **JWT Expiry:** Set long expiry (24h) for development ease
- **Video CORS:** Serve videos from Express static middleware
- **Date Filters:** Use inclusive date ranges (startOfDay/endOfDay)
- **Prisma Relations:** Use explicit FK names, not auto-generated

---

## **✅ SUCCESS CRITERIA (MVP)**

### **Functional (Must Work)**
- [ ] Admin/Operator can login and see different dashboards
- [ ] Search events by license plate returns filtered results
- [ ] Video player loads and plays mock videos with 2x zoom
- [ ] Metadata form saves and shows in event detail
- [ ] Basic permissions: Operator can't access admin functions

### **Performance (Basic)**
- [ ] Search results appear <3 seconds (mock data)
- [ ] Video loads and starts playing <5 seconds
- [ ] Form saves and updates UI <2 seconds
- [ ] Page navigation feels responsive

### **User Experience (Intuitive)**
- [ ] UI is clean and professional (Material-UI default theme)
- [ ] Error messages are clear and helpful
- [ ] Forms validate properly with visual feedback
- [ ] Navigation is intuitive for non-technical users

---

## **🚫 EXPLICITLY EXCLUDED FROM MVP**

### **Advanced Features (Phase 2)**
- CLIENT_USER role and company isolation
- Real Hikvision integration (use mocks)
- Advanced video features (markers, screenshots, frame-by-frame)
- Audit logging and user management
- Reports and dashboard analytics
- Email notifications
- Advanced search filters
- Video streaming (only static files)

### **Infrastructure (Later)**
- Production deployment configuration
- Advanced security measures
- Performance optimization
- Backup and recovery
- Monitoring and alerting
- Load balancing

---

## **🎯 IMPLEMENTATION PRIORITY**

### **Sprint 1 (Foundation)**
1. Database schema + Prisma setup
2. Express API + JWT auth
3. React app + MUI basic layout
4. Mock data generation

### **Sprint 2 (Core Features)**  
1. User authentication (login/logout)
2. Events search API + frontend
3. Basic video player integration
4. Metadata form (create only)

### **Sprint 3 (Polish)**
1. Dashboard with recent events
2. Edit metadata functionality  
3. Basic permissions enforcement
4. UI polish and error handling

---

**Context Engineering Note:** This INITIAL.md provides focused scope for single-pass implementation. All complex features deferred to Phase 2 for iterative development.