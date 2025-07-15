# PRP: DOM CCTV MVP - Sistema Completo de Videovigilancia
## Context-Rich Implementation for Claude Code

**Name:** "DOM CCTV MVP - Complete ANPR Event Documentation System"
**Description:** End-to-end MVP implementation for truck arrival documentation with video playback and metadata management

---

## 🎯 Goal
Build a complete MVP web application for DOM (encofrados rental company) that allows operators to:
1. **Search** truck arrival events by license plate/date
2. **View** videos of truck arrivals with basic zoom functionality  
3. **Document** return events with metadata forms
4. **Manage** the complete workflow from detection to documentation

**End State:** Functional MVP deployed locally with mock data, ready for demonstration to DOM stakeholders.

## 🎯 Why
- **Business Value:** DOM needs to document truck arrivals and cargo returns for encofrados rental business
- **User Impact:** Operators can efficiently track and document 50+ daily truck arrivals
- **Integration:** Foundation for Phase 2 advanced features (real Hikvision integration, detailed inventory)
- **Problems Solved:** Manual paper-based tracking, lack of video evidence, time-consuming documentation

## 📋 What - User-Visible Behavior

### Primary User Flows:
1. **Login Flow:** User enters credentials → Dashboard with recent events
2. **Search Flow:** Filter by license plate/date → Results table → Select event  
3. **Video Flow:** Play video with zoom controls → Basic navigation
4. **Documentation Flow:** Fill metadata form → Save to database → Update event status

### Technical Requirements:
- **Backend:** Express.js + Prisma + MySQL with JWT authentication
- **Frontend:** React + MUI + TanStack Query with responsive design
- **Video:** Basic player supporting .mp4 files with 2x-4x zoom
- **Data:** Mock Chilean data (RUTs, license plates, companies)

### Success Criteria:
- [ ] Complete user journey takes <2 minutes from login to documentation
- [ ] Search returns results in <3 seconds with mock data
- [ ] Video player loads and plays smoothly with zoom functionality
- [ ] Forms validate Chilean data formats (RUT, license plates)
- [ ] Role-based permissions work (Admin vs Operator)

---

## 🗂️ All Needed Context

### Documentation & References
```yaml
# ESSENTIAL LIBRARIES - Include in context window
- url: https://www.prisma.io/docs/getting-started/quickstart
  why: Database ORM setup, schema definition, queries
  critical: Migration commands and relation handling

- url: https://mui.com/material-ui/getting-started/overview/
  why: Component library for consistent UI design
  critical: Theme configuration and form components

- url: https://videojs.com/getting-started/
  why: Video player implementation for MVP scope
  critical: Basic setup without advanced features

- url: https://react-hook-form.com/advanced-usage#SchemaValidation
  why: Form handling with Zod validation
  critical: Error handling and validation patterns

# CHILEAN-SPECIFIC REFERENCES
- url: https://github.com/cgustav/dart_rut_validator
  why: RUT validation algorithm for Chilean tax IDs
  
- url: https://github.com/Esteam85/patente-chilena-dv
  why: Chilean license plate validation patterns

# CODEBASE EXAMPLES - Follow these patterns exactly
- file: examples/express-setup/app-complete.ts
  why: Complete Express setup with security and middleware
  critical: CORS, rate limiting, static file serving

- file: examples/authentication/jwt-middleware.ts
  why: JWT authentication with role-based access
  critical: Token validation and user authorization

- file: examples/react-components/dashboard-simple.tsx
  why: Dashboard layout and metrics display
  critical: Material-UI layout patterns

- file: examples/react-components/search-events.tsx
  why: Search functionality with filters and pagination
  critical: Query handling and result display

- file: examples/react-components/video-player-simple.tsx
  why: Video player with basic zoom (MVP scope)
  critical: Zoom implementation limited to 4x maximum

- file: examples/mock-data/generators.ts
  why: Chilean mock data generation for development
  critical: RUT and license plate format validation

- file: examples/validation/schemas.ts
  why: Zod schemas for Chilean data validation
  critical: RUT and license plate validation functions

- file: examples/forms/metadata-form-component.tsx
  why: Form implementation with validation
  critical: Error handling and submission patterns
```

### Current Codebase Structure
```bash
CCTV_DOM_08072025/
├── docs/                    # Technical documentation 
├── examples/                # Context Engineering patterns
│   ├── authentication/      # JWT middleware patterns
│   ├── express-setup/       # Complete Express configuration
│   ├── react-components/    # MVP UI components  
│   ├── mock-data/          # Chilean data generators
│   ├── validation/         # Zod schemas for Chilean data
│   └── README.md           # Examples documentation
├── PRPs/                   # Product Requirements Prompts
├── .claude/               # Claude Code commands
├── CLAUDE.md              # Global project rules
├── INITIAL.md             # MVP feature specification
└── README.md              # Project overview
```

### Desired Codebase Structure (To Be Created)
```bash
dom-cctv-mvp/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers (6 endpoints)
│   │   ├── middleware/      # Auth, validation, logging
│   │   ├── services/        # Business logic
│   │   ├── routes/          # Express route definitions
│   │   ├── utils/           # Helper functions
│   │   └── app.ts          # Express app configuration
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema (4 tables)
│   │   ├── migrations/     # Database migrations
│   │   └── seed.ts         # Mock data seeding
│   ├── uploads/            # Static video files
│   ├── package.json        # Dependencies
│   └── .env               # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Main application pages (4 pages)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API communication
│   │   ├── stores/        # Zustand state management
│   │   ├── types/         # TypeScript definitions
│   │   ├── utils/         # Utility functions
│   │   └── App.tsx        # Main React application
│   ├── public/            # Static assets
│   ├── package.json       # Dependencies
│   └── vite.config.ts     # Vite configuration
└── README.md              # Setup and running instructions
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: Prisma Client Generation
// Must run `npx prisma generate` after schema changes
// Connection URL must include timezone: ?timezone=America/Santiago

// CRITICAL: Material-UI Theme Provider
// Must wrap App with ThemeProvider and CssBaseline
// Use esES locale for Spanish date/time formatting

// CRITICAL: TanStack Query Setup
// QueryClient must be configured with React.StrictMode compatibility
// Error boundaries required for query failures

// CRITICAL: Video.js Setup
// Requires CSS imports: import 'video.js/dist/video-js.css'
// Video files must be served from Express static middleware

// CRITICAL: Chilean Data Validation
// RUT format: 12345678-9 (8 digits, dash, check digit)
// License plates: ABC123 (old format) or ABCD12 (new format)
// Dates must use America/Santiago timezone

// CRITICAL: JWT Configuration
// Secret must be minimum 32 characters for production security
// Tokens should expire in 24h for development convenience

// GOTCHA: CORS Configuration  
// Frontend runs on :5173, backend on :3001
// Must allow credentials for cookie-based sessions

// GOTCHA: File Upload Handling
// Videos served from /uploads/videos/ via Express static
// Thumbnail images from /uploads/thumbnails/
```

---

## 🏗️ Implementation Blueprint

### Data Models and Database Schema

```prisma
// prisma/schema.prisma - MVP simplified schema
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hash
  firstName String
  lastName  String
  role      UserRole
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relationships
  createdMetadata MetadataEntry[]
  
  @@map("users")
}

model Company {
  id        String   @id @default(cuid())
  rut       String   @unique // Chilean RUT format
  name      String
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relationships
  metadata  MetadataEntry[]
  
  @@map("companies")
}

model Event {
  id            String    @id @default(cuid())
  licensePlate  String    // Chilean license plate
  eventDateTime DateTime
  cameraName    String
  videoFilename String    // Filename in /uploads/videos/
  thumbnailPath String?   // Path to thumbnail image
  hasMetadata   Boolean   @default(false)
  confidence    Float     @default(95.0)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relationships
  metadata      MetadataEntry?
  
  // Indexes for fast search
  @@index([licensePlate])
  @@index([eventDateTime])
  @@map("events")
}

model MetadataEntry {
  id              String   @id @default(cuid())
  eventId         String   @unique
  companyId       String
  guideNumber     String
  guideDate       DateTime
  cargoDescription String
  workOrder       String
  receptionistId  String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relationships
  event           Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  company         Company  @relation(fields: [companyId], references: [id])
  receptionist    User     @relation(fields: [receptionistId], references: [id])
  
  @@map("metadata_entries")
}

enum UserRole {
  ADMINISTRATOR
  OPERATOR
}
```

### Task List - Implementation Order

```yaml
# FOUNDATION TASKS (Sprint 1)

Task 1: Setup Backend Project Structure
CREATE backend/package.json:
  - INCLUDE: express, prisma, bcryptjs, jsonwebtoken, cors, helmet
  - INCLUDE: typescript, ts-node, nodemon for development
  - INCLUDE: zod for validation, @types/* for TypeScript

COPY patterns from: examples/express-setup/app-complete.ts
MODIFY: Simplify to MVP scope (remove advanced features)

Task 2: Database Schema and Prisma Setup  
CREATE backend/prisma/schema.prisma:
  - MIRROR: Data model structure above exactly
  - INCLUDE: Chilean-specific field lengths and formats
  - ADD: Indexes for licensePlate and eventDateTime

RUN: npx prisma migrate dev --name init
RUN: npx prisma generate

Task 3: Mock Data Seeding
COPY: examples/mock-data/generators.ts to backend/prisma/seed.ts
MODIFY: Adapt for Prisma client usage
GENERATE: 50 events, 5 companies, 8 users with realistic Chilean data

Task 4: Express App Configuration
COPY: examples/express-setup/app-complete.ts to backend/src/app.ts
COPY: examples/express-setup/error-middleware.ts
COPY: examples/express-setup/logging-middleware.ts
MODIFY: Configure for MVP scope with video serving

# AUTHENTICATION TASKS (Sprint 1)

Task 5: JWT Authentication Middleware
COPY: examples/authentication/jwt-middleware.ts to backend/src/middleware/
MODIFY: Adapt for simplified User model (no companyId)
TEST: Login/logout flow with mock users

Task 6: Authentication Controllers and Routes
CREATE: backend/src/controllers/auth.controller.ts
IMPLEMENT: POST /auth/login, POST /auth/logout, GET /auth/profile
USE: bcrypt for password hashing, JWT for tokens

# BACKEND API TASKS (Sprint 2)

Task 7: Events API Implementation
CREATE: backend/src/controllers/events.controller.ts
IMPLEMENT: 
  - GET /api/events (with search filters)
  - GET /api/events/:id (single event detail)
  - GET /api/events/:id/video (video URL for player)

CREATE: backend/src/services/events.service.ts
MIRROR: Query patterns from examples/database/queries.sql

Task 8: Metadata API Implementation  
CREATE: backend/src/controllers/metadata.controller.ts
IMPLEMENT:
  - POST /api/events/:id/metadata (create metadata)
  - PUT /api/events/:id/metadata (update metadata)

COPY: Validation patterns from examples/validation/schemas.ts

Task 9: Companies API (Basic)
CREATE: backend/src/controllers/companies.controller.ts
IMPLEMENT: GET /api/companies (for metadata form dropdown)

# FRONTEND FOUNDATION (Sprint 2)

Task 10: React Project Setup
CREATE: frontend/package.json
INCLUDE: react, typescript, vite, @mui/material, @tanstack/react-query, zustand

CREATE: frontend/src/App.tsx
SETUP: Material-UI theme with Chilean locale (esES)
SETUP: QueryClient with error boundaries

Task 11: Authentication Frontend
CREATE: frontend/src/pages/Login.tsx
MIRROR: Form patterns from examples/forms/metadata-form-component.tsx
IMPLEMENT: Login form with validation

CREATE: frontend/src/hooks/useAuth.ts
IMPLEMENT: Login, logout, token management

# CORE FEATURES (Sprint 2)

Task 12: Dashboard Implementation
COPY: examples/react-components/dashboard-simple.tsx
MODIFY: Adapt for MVP data structure
IMPLEMENT: Recent events list, basic statistics

Task 13: Event Search Implementation
COPY: examples/react-components/search-events.tsx  
MODIFY: Adapt for MVP search filters (license plate, date range)
IMPLEMENT: Results table with pagination

Task 14: Video Player Implementation
COPY: examples/react-components/video-player-simple.tsx
SETUP: Video.js with CSS imports
IMPLEMENT: Basic controls with 2x-4x zoom only

Task 15: Metadata Form Implementation
COPY: examples/forms/metadata-form-component.tsx
MODIFY: Simplify to MVP fields only
IMPLEMENT: Chilean data validation (RUT, license plates)

# INTEGRATION AND POLISH (Sprint 3)

Task 16: Event Detail Page
CREATE: frontend/src/pages/EventDetail.tsx
COMBINE: Video player + metadata form
IMPLEMENT: Edit/view modes based on hasMetadata flag

Task 17: Role-Based UI
IMPLEMENT: Conditional rendering based on user role
ADMIN: Can access all events, user management
OPERATOR: Can only document events, no admin functions

Task 18: Error Handling and Loading States
IMPLEMENT: Loading spinners for all API calls
IMPLEMENT: Error messages with retry options
IMPLEMENT: Form validation feedback

Task 19: Static File Serving
SETUP: Express static middleware for /uploads/videos/
CREATE: Mock video files (can use placeholder MP4s)
IMPLEMENT: Thumbnail generation/serving

Task 20: Final Integration Testing
TEST: Complete user journey from login to documentation
TEST: Role permissions and data access restrictions
TEST: Video playback and form submission
```

### Pseudocode for Critical Components

```typescript
// Task 7: Events Search API
async function searchEvents(filters: SearchFilters): Promise<SearchResponse> {
  // PATTERN: Always validate inputs first
  const validated = eventSearchSchema.parse(filters);
  
  // PATTERN: Build dynamic WHERE clause
  const whereClause = {};
  if (validated.licensePlate) {
    whereClause.licensePlate = { contains: validated.licensePlate };
  }
  if (validated.startDate && validated.endDate) {
    whereClause.eventDateTime = {
      gte: validated.startDate,
      lte: validated.endDate
    };
  }
  
  // CRITICAL: Use pagination for performance
  const events = await prisma.event.findMany({
    where: whereClause,
    include: { metadata: { include: { company: true } } },
    orderBy: { eventDateTime: 'desc' },
    take: validated.limit,
    skip: (validated.page - 1) * validated.limit
  });
  
  // PATTERN: Return standardized response
  return {
    events,
    totalCount: await prisma.event.count({ where: whereClause }),
    currentPage: validated.page,
    totalPages: Math.ceil(totalCount / validated.limit)
  };
}

// Task 14: Video Player Component
function VideoPlayerSimple({ src, onTimeUpdate }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // PATTERN: Event listeners for video state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleTimeUpdate = () => onTimeUpdate?.(video.currentTime);
    video.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [onTimeUpdate]);
  
  // CRITICAL: Zoom limited to 4x for MVP
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 4));
  };
  
  return (
    <Box>
      <video 
        ref={videoRef}
        src={src}
        style={{ 
          transform: `scale(${zoomLevel})`,
          maxHeight: '70vh'
        }}
      />
      <Box sx={{ p: 2 }}>
        <IconButton onClick={handleZoomIn} disabled={zoomLevel >= 4}>
          <ZoomIn />
        </IconButton>
        <Typography>{zoomLevel}x</Typography>
      </Box>
    </Box>
  );
}

// Task 15: Metadata Form with Chilean Validation
function MetadataForm({ eventId, onSuccess }) {
  const form = useForm({
    resolver: zodResolver(metadataSchema),
    defaultValues: {
      companyId: '',
      guideNumber: '',
      guideDate: null,
      cargoDescription: '',
      workOrder: '',
      receptionistId: ''
    }
  });
  
  // PATTERN: Mutation with optimistic updates
  const addMetadataMutation = useMutation({
    mutationFn: (data) => 
      fetch(`/api/events/${eventId}/metadata`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      onSuccess();
    }
  });
  
  return (
    <form onSubmit={form.handleSubmit(addMetadataMutation.mutate)}>
      {/* Form fields with Chilean validation */}
    </form>
  );
}
```

### Integration Points

```yaml
DATABASE:
  - migration: "Initial schema with 4 core tables"
  - seed: "50 events + Chilean companies + admin user"
  - indexes: "licensePlate, eventDateTime for fast search"

STATIC FILES:
  - serve: "/uploads/videos/" for video files
  - serve: "/uploads/thumbnails/" for preview images
  - cors: Allow frontend access to video files

AUTHENTICATION:
  - jwt_secret: "Minimum 32 character secret key"
  - expiry: "24h for development convenience"
  - roles: "ADMINISTRATOR, OPERATOR only"

FRONTEND CONFIG:
  - api_base: "http://localhost:3001/api"
  - video_base: "http://localhost:3001/uploads"
  - mui_locale: "esES for Spanish formatting"
```

---

## ✅ Validation Loop

### Level 1: Syntax & Style
```bash
# Backend validation
cd backend
npm run lint          # ESLint check
npm run type-check    # TypeScript check
npx prisma validate   # Schema validation

# Frontend validation  
cd frontend
npm run lint          # ESLint check
npm run type-check    # TypeScript check
npm run build         # Build check

# Expected: No errors. Fix any syntax/type issues first.
```

### Level 2: Unit Tests
```bash
# Backend API tests
cd backend
npm test              # Jest test suite
# Must include:
# - Auth middleware tests
# - Events search API tests  
# - Metadata creation tests
# - Chilean validation tests

# Frontend component tests
cd frontend  
npm test              # Vitest test suite
# Must include:
# - Dashboard component tests
# - Search form tests
# - Video player tests
# - Form validation tests
```

### Level 3: Integration Tests
```bash
# Start backend server
cd backend
npm run dev           # Server on :3001

# Verify endpoints work
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@domcctv.cl","password":"password123"}'
# Expected: {"success":true,"token":"jwt_token_here"}

curl -H "Authorization: Bearer jwt_token" \
  http://localhost:3001/api/events
# Expected: {"success":true,"data":{"events":[...]}}

# Start frontend dev server
cd frontend
npm run dev           # Server on :5173

# Manual test: Complete user journey
# 1. Login with admin@domcctv.cl / password123
# 2. Search for license plate "ABC123"  
# 3. Click event → View video → Add metadata
# 4. Verify metadata saves and event shows as documented
```

### Level 4: Mock Data Validation
```bash
cd backend
npm run seed          # Run Prisma seed

# Verify mock data quality
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.event.findMany({ take: 5 }).then(events => {
  console.log('Sample events:', events);
  console.log('License plates valid:', events.every(e => 
    /^[A-Z]{3}\d{3}$|^[A-Z]{4}\d{2}$/.test(e.licensePlate)
  ));
});
"
# Expected: Valid Chilean license plate formats
```

---

## 🎯 Final Validation Checklist

### Functional Requirements
- [ ] User can login with admin@domcctv.cl and see dashboard
- [ ] Search by license plate returns filtered results in <3 seconds
- [ ] Video player loads mock videos and zoom works (1x-4x)
- [ ] Metadata form validates Chilean RUT and license plates
- [ ] Events show as "Documentado" after metadata is added
- [ ] Role permissions work (OPERATOR vs ADMINISTRATOR)

### Technical Requirements  
- [ ] All TypeScript compiles without errors
- [ ] All tests pass: `npm test` in both backend and frontend
- [ ] No console errors in browser developer tools
- [ ] Database seed generates 50+ events with valid Chilean data
- [ ] API responses follow consistent format with error handling
- [ ] Video files serve correctly from Express static middleware

### User Experience
- [ ] UI follows Material-UI design system consistently
- [ ] Loading states show during API calls
- [ ] Error messages are clear and actionable in Spanish
- [ ] Forms provide immediate validation feedback
- [ ] Navigation is intuitive between pages
- [ ] Responsive design works on desktop and tablet

### Performance  
- [ ] Dashboard loads in <2 seconds
- [ ] Search results appear in <3 seconds with 50 events
- [ ] Video starts playing in <5 seconds
- [ ] Form submission completes in <2 seconds
- [ ] No memory leaks in video player component

---

## 🚫 Anti-Patterns to Avoid

- ❌ **Don't use real Hikvision integration** - Use mocks only for MVP
- ❌ **Don't implement advanced video features** - No markers, screenshots, or frame-by-frame
- ❌ **Don't add CLIENT_USER role** - Only ADMINISTRATOR and OPERATOR for MVP
- ❌ **Don't create complex state management** - Keep Zustand stores simple
- ❌ **Don't skip Chilean data validation** - RUT and license plate formats are critical
- ❌ **Don't use auto-generated Prisma relations** - Use explicit foreign keys
- ❌ **Don't implement real-time features** - No WebSockets or live updates for MVP
- ❌ **Don't optimize prematurely** - Focus on functionality over performance
- ❌ **Don't skip error boundaries** - React components must handle API failures gracefully

---

## 📊 Success Metrics

**Confidence Level: 9/10** - This PRP provides comprehensive context for single-pass implementation with Claude Code.

**Includes:**
✅ Complete technical specifications with exact library versions
✅ Step-by-step implementation tasks in logical order  
✅ Real code examples and patterns to follow exactly
✅ Chilean-specific data validation and formats
✅ Complete validation loops with executable commands
✅ Clear scope boundaries (MVP only, no advanced features)
✅ Integration points and configuration details
✅ Anti-patterns and common pitfalls to avoid

**Ready for:** `/execute-prp` command with high success probability.
