# CalorieAI - Smart Food Tracking Application

## Overview

CalorieAI is an AI-powered calorie tracking web application that allows users to log meals by either uploading food photos or describing meals in text. The application uses Google's Gemini AI to analyze images and text descriptions, automatically extracting nutritional information including calories, protein, carbs, and fat content. Users can track their daily calorie intake against a goal, view macronutrient breakdowns, and maintain a log of all food entries.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript
- Single-page application (SPA) using Vite as the build tool
- Wouter for client-side routing (lightweight alternative to React Router)
- Mobile-first responsive design approach

**State Management**:
- TanStack Query (React Query) for server state management and data fetching
- Local React state for UI-specific state
- No global state management library needed due to simple application structure

**UI Component System**:
- shadcn/ui components based on Radix UI primitives
- Tailwind CSS for styling with custom design system
- Dark mode by default with "New York" style variant
- Design follows patterns from popular health/fitness apps (MyFitnessPal, Cronometer, Samsung Health)

**Key Design Decisions**:
- Component aliases configured for clean imports (`@/components`, `@/lib`, etc.)
- Reusable UI components in `/client/src/components/ui`
- Feature-specific components in `/client/src/components`
- Monospace fonts for numerical data (calories, macros) for better readability
- Touch-optimized interaction targets for mobile use

### Backend Architecture

**Framework**: Express.js with TypeScript
- RESTful API design
- Module type: ESM (ES Modules)
- Middleware pattern for request processing and logging

**File Upload Handling**:
- Multer middleware for multipart form data processing
- Local file storage in `/uploads` directory
- File type validation (images only: jpeg, jpg, png, webp)
- 10MB file size limit
- Unique filename generation using timestamp and random string

**API Endpoints**:
- `GET /api/food-entries` - Retrieve all food entries
- `POST /api/food-entries` - Create new food entry
- `POST /api/analyze-photo` - Analyze food image with AI
- `POST /api/analyze-text` - Analyze text description with AI
- `DELETE /api/food-entries/:id` - Delete specific entry

**Development Workflow**:
- Vite dev server integration in development mode
- Custom logging for API requests with response preview
- Hot module replacement (HMR) for frontend changes

### Data Storage

**Current Implementation**: In-memory storage
- `MemStorage` class implementing `IStorage` interface
- Data stored in Map structure (key-value pairs)
- Data persists only during server runtime
- Suitable for development and prototyping

**Database Schema** (Drizzle ORM ready):
- PostgreSQL dialect configured
- Food entries table with fields:
  - id (UUID, auto-generated)
  - name, description (text)
  - calories, protein, carbs, fat (integers)
  - imageUrl (text)
  - entryType ('photo' or 'text')
  - mealType ('breakfast', 'lunch', 'dinner', 'snack')
  - timestamp (auto-generated)

**Migration Path**:
- Schema defined in `/shared/schema.ts` using Drizzle ORM
- Ready to connect to Neon Database (serverless PostgreSQL)
- Migration files output to `/migrations` directory
- Environment variable `DATABASE_URL` required for production database

**Design Rationale**:
- In-memory storage allows rapid development without database setup
- Interface pattern enables easy swap to database implementation
- Drizzle ORM chosen for type-safe database queries and automatic TypeScript types
- Zod integration for runtime validation matching database schema

### External Dependencies

**AI Service**:
- **Google Gemini AI** (`@google/genai` package)
  - Model: `gemini-2.5-flash` for fast image and text analysis
  - API key required via `GEMINI_API_KEY` environment variable
  - Structured JSON output using response schemas
  - Analyzes food images to extract: name, description, calories, macros, confidence score
  - Processes text descriptions of meals for nutritional estimation
  - **Known Limitation**: Free tier may experience 503 "model overloaded" errors during peak usage. The app handles these gracefully with error toasts and allows users to retry.

**Database** (configured but not active):
- **Neon Database** - Serverless PostgreSQL
  - Package: `@neondatabase/serverless`
  - Connection pooling support with `connect-pg-simple` for session storage
  - Requires `DATABASE_URL` environment variable

**UI Library**:
- **Radix UI** - Headless accessible components
  - Complete set of primitives (dialogs, dropdowns, tooltips, etc.)
  - Provides accessibility features out of the box
  - Customized via Tailwind CSS classes

**Styling & Utilities**:
- **Tailwind CSS** - Utility-first CSS framework
  - Custom color system with HSL variables
  - Extended border radius and spacing scales
  - Dark mode support via class strategy
- **class-variance-authority** - Component variant management
- **clsx** & **tailwind-merge** - Conditional className utilities

**Form Handling**:
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **@hookform/resolvers** - Zod integration for form validation

**Date Utilities**:
- **date-fns** - Date formatting and manipulation (e.g., "5 minutes ago" timestamps)

**Development Tools**:
- **TypeScript** - Type safety across client and server
- **Vite** - Frontend build tool and dev server
- **esbuild** - Backend bundling for production
- **tsx** - TypeScript execution for development

**Replit-Specific**:
- Runtime error overlay plugin
- Cartographer plugin for code navigation
- Dev banner for development environment indication

### Authentication & Authorization

**Current State**: No authentication implemented
- All API endpoints are publicly accessible
- No user accounts or session management
- Single-user application design

**Future Considerations**:
- Session infrastructure configured (connect-pg-simple package installed)
- Could add user authentication with session storage in PostgreSQL
- Multitenancy would require adding userId to food entries schema