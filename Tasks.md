# Tasks - DOM CCTV MVP

## En Progreso
- Ninguna tarea en progreso actualmente

## Pendientes - Alta Prioridad
- [ ] Implementar role CLIENT_USER con restricciones por empresa (#gap-006)

## Pendientes - Media Prioridad
- [ ] Mejorar dashboard con auto-refresh cada 30 segundos (#gap-007)
- [ ] Agregar exportación Excel para reportes básicos (#gap-008)
- [ ] Implementar error handling robusto en todos los endpoints (#gap-009)
- [ ] Configurar middleware de logging avanzado (#gap-010)
- [ ] Crear documentación API con OpenAPI/Swagger (#gap-011)

## Pendientes - Baja Prioridad
- [ ] Optimizar componente VideoPlayer para mejor performance (#gap-012)
- [ ] Implementar notificaciones push para eventos críticos (#gap-013)
- [ ] Agregar filtros avanzados en dashboard por empresa (#gap-014)
- [ ] Configurar Docker para desarrollo local (#gap-015)
- [ ] Implementar cache Redis para sesiones (#gap-016)

## Completadas Recientes
- [x] Análisis de gaps entre especificaciones y código actual
- [x] Creación de Planning.md con roadmap Q3 2025
- [x] Evaluación del estado actual del proyecto MVP
- [x] Identificación de 10 gaps críticos principales
- [x] Estimación de esfuerzo para completar MVP (35 días)
- [x] Implementar validación RUT chileno con algoritmo verificador (#gap-001)
- [x] Implementar validación de patentes chilenas (formato antiguo y nuevo) (#gap-001b)
- [x] Crear esquemas Zod completos para todos los endpoints (#gap-002)
- [x] Configurar índices de base de datos para performance <2s (#gap-003)
- [x] Implementar testing básico para funciones críticas (#gap-005)
- [x] Corregir errores TypeScript en controladores
- [x] Verificar funcionamiento del servidor backend
- [x] Desarrollar cliente API Hikvision (ANPR + Video) (#gap-004) - 15 de Julio, 2025
- [x] Implementar sistema de seguimiento de eventos multi-cámara (#gap-017) - 17 de Julio, 2025
  - [x] Crear modal mejorado con selector de cámara
  - [x] Implementar agrupación automática de eventos por matrícula
  - [x] Agregar línea de tiempo de detecciones
  - [x] Crear página de prueba y verificar funcionalidad

## Backlog - Fase 2 (Q4 2025)
- [ ] Sistema de inventario detallado con conteo de encofrados
- [ ] Analytics en tiempo real con dashboards ejecutivos
- [ ] Integraciones con sistemas ERP externos
- [ ] Reportes avanzados y métricas de negocio
- [ ] Catálogo de tipos de encofrados (ScaffoldingItemType)
- [ ] Cálculo automático de discrepancias e inventario
- [ ] Sistema de alertas automáticas por performance
- [ ] Auditoría completa con logs particionados
- [ ] Internacionalización (i18n) español/inglés
- [ ] Modo offline para tablets en terreno

## Dependencias Críticas
- [ ] **#gap-001 → #gap-002**: Validación RUT debe completarse antes de esquemas Zod
- [ ] **#gap-003 → #gap-004**: Índices DB deben estar antes de integración Hikvision
- [ ] **#gap-005 → Producción**: Testing básico es requisito para deployment
- [ ] **#gap-006 → #gap-007**: Role CLIENT_USER necesario para dashboard filtrado

## Blockers Actuales
- **Base de datos:** Necesita configuración de .env para desarrollo local
- **Hikvision API:** Requiere credenciales y documentación de endpoints
- **Testing:** Falta configuración de base de datos de pruebas
- **Performance:** Necesita dataset de prueba con 1000+ eventos

## Notas de Implementación

### Sprint 1 (Semana 1-2): Fundamentos
```markdown
Objetivo: Resolver gaps críticos que bloquean la funcionalidad core
Entregable: Sistema con validaciones chilenas completas
```

### Sprint 2 (Semana 3-4): Integraciones
```markdown
Objetivo: Conectar con APIs externas y mejorar UX
Entregable: Dashboard funcional con datos reales
```

### Sprint 3 (Semana 5-6): Producción
```markdown
Objetivo: Preparar sistema para deployment
Entregable: MVP listo para usuarios finales
```

## Criterios de Terminado (DoD)

### Para tareas de Backend
- [ ] Código implementado con TypeScript estricto
- [ ] Tests unitarios con >80% cobertura
- [ ] Validación de datos con esquemas Zod
- [ ] Error handling implementado
- [ ] Performance verificada (<2 segundos)

### Para tareas de Frontend
- [ ] Componente implementado con Material-UI v5
- [ ] Tests unitarios con Testing Library
- [ ] Responsive design verificado
- [ ] Accesibilidad básica implementada
- [ ] Integración con React Query completada

### Para tareas de Integración
- [ ] API documentada con ejemplos
- [ ] Manejo de errores de red implementado
- [ ] Timeout y retry configurados
- [ ] Logging de requests/responses
- [ ] Validación de respuestas externas

## Métricas de Seguimiento

### Velocidad del Equipo
- **Sprint 1:** Target 5 tareas completadas
- **Sprint 2:** Target 4 tareas completadas
- **Sprint 3:** Target 3 tareas completadas

### Calidad del Código
- **Cobertura de tests:** >80% (actual: 30%)
- **Bugs críticos:** 0 (actual: 0)
- **Performance:** <2s búsquedas (actual: 3-4s)

### Satisfacción del Usuario
- **Tiempo de entrenamiento:** <30 minutos
- **Adopción:** >90% usuarios activos
- **NPS Score:** >4.5/5

---

**Última actualización:** 15 de Julio, 2025  
**Próxima revisión:** 22 de Julio, 2025  
**Responsable:** Equipo DOM CCTV MVP