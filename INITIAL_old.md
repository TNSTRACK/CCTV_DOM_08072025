# INITIAL.md Template - DOM CCTV Features

## FEATURE:
DOM CCTV es una plataforma web progresiva que documenta mediante videovigilancia inteligente la llegada y descarga de camiones con encofrados arrendados, utilizando reconocimiento automático de matrículas (ANPR) con tecnología Hikvision para crear un sistema de trazabilidad visual completo. Además, con capacidad de reproductor de video avanzado con zoom de hasta 10x en resolución 6MP, controles de navegación frame-by-frame, marcadores temporales editables y capacidad de captura de pantalla con anotaciones para análisis detallado de descargas de camiones."

## TECHNICAL CONTEXT:

### Backend Requirements:
- [ ] ¿Necesita nuevos endpoints de API?, Sí, dado que es un proyecto nuevo, se debe seguir las directrices del documento que está en la ruta relativa PRPs\prd_dom_cctv.md
- [ ] ¿Requiere cambios en la base de datos? , Sí, dado que es un proyecto nuevo, se debe crear la base de datos según las directrices del documento que está en la ruta relativa PRPs\prd_dom_cctv.md
- [ ] ¿Involucra integración con Hikvision APIs? Sí, , Sí, dado que es un proyecto nuevo, se debe seguir las directrices del documento que está en la ruta relativa PRPs\prd_dom_cctv.md y del documento que está en la ruta relativa docs\Hik-Connect for Teams OpenAPI V2.11.800_Developer Guide_V2.11.800_20250226.pdf que es un pdf al igual que el documento docs\Overview of 3rd Party Integration HIKVISION.pdf
- [ ] ¿Necesita nuevos servicios o middleware? , Sí, dado que es un proyecto nuevo, se debe seguir las directrices del documento que está en la ruta relativa PRPs\prd_dom_cctv.md

### Frontend Requirements:
- [ ] ¿Requiere nuevos componentes React? , Sí, dado que es un proyecto nuevo, se debe seguir las directrices del documento que está en la ruta relativa PRPs\prd_dom_cctv.md
- [ ] ¿Necesita nuevas páginas o rutas? , Sí, dado que es un proyecto nuevo, se debe seguir las directrices del documento que está en la ruta relativa PRPs\prd_dom_cctv.md
- [ ] ¿Involucra gestión de estado compleja? Revisa, las directrices del documento que está en la ruta relativa PRPs\prd_dom_cctv.md
- [ ] ¿Requiere integración con APIs específicas? Sí, las de Hikvision ya explciadas anteriomente documentos en ruta relativa: docs\Hik-Connect for Teams OpenAPI V2.11.800_Developer Guide_V2.11.800_20250226.pdf y docs\Overview of 3rd Party Integration HIKVISION.pdf

### Database Impact:
- [ ] ¿Necesita nuevas tablas o campos? , Sí, dado que es un proyecto nuevo, se debe crear la base de datos según las directrices del documento que está en la ruta relativa PRPs\prd_dom_cctv.md
- [ ] ¿Requiere migración de datos existentes? NO
- [ ] ¿Afecta el rendimiento de consultas? NO
- [ ] ¿Necesita nuevos índices? , Sí, dado que es un proyecto nuevo, se debe crear la base de datos según las directrices del documento que está en la ruta relativa PRPs\prd_dom_cctv.md

## EXAMPLES:
Revisar los siguientes ejemplos en las rutas relativas:
- examples\authentication\jwt-middleware.ts
- examples\database\queries.sql
- examples\forms\metadata-form-component.tsx
- examples\hikvision\api-integration.ts
- examples\tests\api-test-patterns.test.ts
- examples\video\video-player-component.tsx

**Código relacionado a seguir:**
- `examples/video/video-player-component.tsx` - Patrón base para componentes de video
- `examples/hikvision/stream-handling.js` - Manejo de streams RTSP
- `examples/database/queries.sql` - Patrones de consulta optimizadas
- `examples/authentication/role-permissions.ts` - Control de acceso por roles

## DOCUMENTATION:
- docs\Hik-Connect for Teams OpenAPI V2.11.800_Developer Guide_V2.11.800_20250226.pdf
- docs\Overview of 3rd Party Integration HIKVISION.pdf
- https://github.com/Wirasm/PRPs-agentic-eng
- https://github.com/coleam00/context-engineering-intro
- https://www.youtube.com/watch?v=Egeuql3Lrzg&ab_channel=ColeMedin
- https://www.youtube.com/watch?v=KVOZ9s1S9Gk&lc=UgzfwxvFjo6pKEyPo1R4AaABAg&ab_channel=RasmusWiding
- https://docs.anthropic.com/en/docs/claude-code/overview
- https://github.com/cgustav/dart_rut_validator?tab=readme-ov-file
- https://github.com/Esteam85/patente-chilena-dv
- https://mui.com/material-ui/getting-started/

### Hikvision APIs:
- [HikCentral OpenAPI Documentation](https://hikvision.com/api-docs)
- [ISAPI Reference Guide](https://hikvision.com/isapi)
- Configuración específica de cámaras DS-2CD3666G2T-IZSY e iDS-2CD7A46G0/P-IZHS

### Technical Documentation:
- [Video.js Documentation](https://videojs.com/getting-started/) - Para reproducción de video
- [React Player Documentation](https://github.com/cookpete/react-player) - Alternativa de reproductor
- [Prisma Documentation](https://www.prisma.io/docs/) - Para cambios en base de datos
- [Material-UI Documentation](https://mui.com/) - Para componentes de interfaz

### Project Documentation:
- `docs/backend_dom_cctv.md` - Arquitectura backend completa
- `docs/frontend_dom_cctv.md` - Especificaciones frontend
- `docs/database_schema_dom_cctv.md` - Esquema de base de datos
- `docs/prd_dom_cctv.md` - Requerimientos del producto

## USER ROLES AFFECTED:
[Especificar qué roles de usuario usarán esta funcionalidad]

- [ ] **OPERATOR** - Usuarios operativos que consultan videos diariamente
- [ ] **ADMINISTRATOR** - Administradores del sistema con acceso completo
- [ ] **CLIENT_USER** - Personal del cliente que agrega metadatos
- [ ] **SUPERVISOR** - Supervisores que generan reportes

## PERMISSIONS REQUIRED:
[Definir qué permisos necesita la funcionalidad]

- [ ] **READ_EVENTS** - Consultar eventos y videos
- [ ] **WRITE_METADATA** - Agregar/editar metadatos de eventos
- [ ] **MANAGE_USERS** - Administrar usuarios del sistema
- [ ] **GENERATE_REPORTS** - Crear y exportar reportes
- [ ] **SYSTEM_CONFIG** - Configurar parámetros del sistema

## HIKVISION INTEGRATION:
[Especificar qué APIs de Hikvision están involucradas]

### HikCentral APIs:
- [ ] `/artemis/api/v1/events/anpr/search` - Búsqueda de eventos ANPR
- [ ] `/artemis/api/v1/video/urls` - Obtener URLs de video para reproducción
- [ ] `/artemis/api/v1/video/picture` - Captura de imágenes instantáneas
- [ ] `/artemis/api/v1/resource/camera/search` - Información de cámaras

### ISAPI Direct:
- [ ] `/ISAPI/Streaming/channels/1/picture` - Captura directa de imagen
- [ ] `/ISAPI/System/deviceInfo` - Información del dispositivo
- [ ] RTSP streams para reproducción en vivo

## PERFORMANCE REQUIREMENTS:
[Especificar requisitos de rendimiento específicos]

### Response Times:
- API endpoints: < 2 segundos
- Video loading: < 3 segundos
- Search results: < 30 segundos
- Database queries: < 1 segundo

### Concurrent Users:
- Soporte mínimo: 50 usuarios concurrentes
- Video streaming: 10 streams simultáneos
- Search operations: 100 búsquedas/minuto

### Storage Impact:
- Video files: Optimización para archivos 6MP
- Database growth: Estimar impacto en GB/mes
- Backup requirements: Estrategia de archivado

## OTHER CONSIDERATIONS:
[Mencionar aspectos específicos que los asistentes comúnmente olvidan]

### CCTV Specific:
- **Frame Rate Handling:** Videos a 15 FPS requieren navegación precisa
- **Resolution Management:** 6MP requiere optimización de memoria
- **Network Bandwidth:** Streams RTSP pueden saturar red local
- **Storage Archiving:** Videos > 120 días deben archivarse automáticamente

### Security Considerations:
- **ANPR Data:** Matrículas son datos sensibles, requieren encriptación
- **Video Access:** Control granular por empresa para usuarios CLIENT_USER
- **Audit Trail:** Todas las acciones deben quedar registradas
- **Session Management:** Timeouts automáticos para sesiones inactivas

### Integration Pitfalls:
- **Hikvision Timeouts:** APIs pueden tardar hasta 30 segundos
- **Camera Disconnections:** Manejar caídas de red elegantemente
- **Concurrent Access:** Múltiples usuarios viendo mismo video
- **Metadata Sync:** Sincronización con sistemas del cliente puede fallar

### User Experience:
- **Loading States:** Indicadores visuales para operaciones lentas
- **Error Recovery:** Opciones de retry para operaciones fallidas
- **Mobile Compatibility:** Diseño responsive para tablets en terreno
- **Keyboard Shortcuts:** Navegación rápida para operadores expertos

### Technical Debt:
- **Code Duplication:** Reutilizar componentes existentes cuando sea posible
- **Error Handling:** Usar patrones establecidos en el proyecto
- **Testing Requirements:** Unit tests y integration tests obligatorios
- **Documentation:** Actualizar docs técnicas con cambios de API

## SUCCESS CRITERIA:
[Definir métricas específicas de éxito]

### Functional:
- [ ] Feature funciona según especificación
- [ ] Integración con Hikvision estable
- [ ] Rendimiento dentro de límites establecidos
- [ ] Tests automáticos pasando

### User Acceptance:
- [ ] Validación con usuarios reales
- [ ] Tiempo de entrenamiento < 30 minutos
- [ ] Reducción en tiempo de operación existente
- [ ] Satisfacción de usuario > 4/5

### Technical:
- [ ] Code coverage > 80%
- [ ] Performance benchmarks cumplidos
- [ ] Security audit passed
- [ ] Documentation actualizada