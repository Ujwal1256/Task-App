# TaskFlow - Task Management Application

## Overview

TaskFlow is a modern, productivity-focused task management application inspired by Linear and Todoist. It provides a clean, focused interface for tracking tasks with real-time progress visualization. The application features a minimal design aesthetic with subtle animations that enhance usability without causing distraction.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18+** with TypeScript for type-safe component development
- **Vite** as the build tool and development server, configured for fast HMR (Hot Module Replacement)
- **Wouter** for lightweight client-side routing (single-page application with `/` route for TaskBoard)
- **TanStack React Query v5** for server state management, data fetching, and caching

**UI Component System**
- **shadcn/ui** components (New York style) - a collection of accessible, customizable Radix UI primitives
- **Tailwind CSS** for utility-first styling with custom design tokens
- **CSS Variables** for theming support (light/dark mode ready)
- Custom color system using HSL values with alpha channel support for consistent theming

**Design System Decisions**
- Typography: Inter font (Google Fonts) for modern, readable interface
- Spacing: Tailwind units (2, 4, 6, 8, 12, 16) for consistent layout primitives
- Container: Centered, focused width (max-w-2xl) to maintain readability
- Components: Card-based UI with rounded corners, subtle shadows, and hover states
- Progress indicator: Full-width animated progress bar with smooth transitions

**State Management Strategy**
- React Query for server state (tasks fetching, mutations)
- Local React state (useState) for UI interactions and form inputs
- Toast notifications for user feedback on actions

### Backend Architecture

**Server Framework**
- **Express.js** for RESTful API server
- **TypeScript** throughout for type safety
- **HTTP Server** created via Node's `http` module to support both Express and potential WebSocket upgrades

**API Design**
- RESTful endpoints following resource-based URL structure:
  - `GET /api/tasks` - Fetch all tasks
  - `GET /api/tasks/:id` - Fetch single task
  - `POST /api/tasks` - Create new task
  - `PATCH /api/tasks/:id` - Update task (toggle completion)
  - `DELETE /api/tasks/:id` - Delete task
- JSON request/response format
- Zod schema validation for request payloads
- Error handling with appropriate HTTP status codes

**Storage Abstraction**
- `IStorage` interface defines data access contract
- `MemStorage` in-memory implementation for development
- Designed to be swappable with database-backed implementation (PostgreSQL via Drizzle ORM)

**Development Experience**
- Request logging middleware tracking method, path, status, and duration
- Raw body capture for webhook verification support
- Separate Vite middleware integration in development mode
- Static file serving in production from `dist/public`

### Data Storage Solutions

**ORM & Schema Management**
- **Drizzle ORM** configured for PostgreSQL dialect
- Type-safe schema definitions in `shared/schema.ts` using Drizzle's table builders
- **Drizzle Kit** for migrations (output to `./migrations` directory)
- Schema-to-Zod validation via `drizzle-zod` for runtime type checking

**Database Schema**
- **Users Table**: `id` (UUID primary key), `username` (unique), `password`
- **Tasks Table**: `id` (UUID primary key), `title` (text), `completed` (boolean, default false)
- UUID generation via PostgreSQL's `gen_random_uuid()` function

**Current Implementation Note**
- Application uses in-memory storage (`MemStorage`) by default
- Database configuration present but requires `DATABASE_URL` environment variable
- PostgreSQL connection via `pg` driver (included in dependencies)

### Authentication and Authorization

**Current State**
- User schema defined in database but authentication not implemented in routes
- Infrastructure present for future session-based authentication:
  - `express-session` and `connect-pg-simple` dependencies included
  - `passport` and `passport-local` for local authentication strategy

**Planned Architecture**
- Session-based authentication with PostgreSQL session store
- Password hashing (likely bcrypt, based on common patterns)
- Protected routes requiring authentication

### External Dependencies

**UI Component Libraries**
- `@radix-ui/*` - Unstyled, accessible component primitives (accordion, dialog, dropdown, popover, progress, checkbox, etc.)
- `class-variance-authority` - Type-safe component variants
- `clsx` & `tailwind-merge` - Utility class management
- `cmdk` - Command palette component
- `embla-carousel-react` - Carousel/slider functionality
- `lucide-react` - Icon library

**Form Management**
- `react-hook-form` - Form state management
- `@hookform/resolvers` - Schema validation resolvers

**Data Validation**
- `zod` - Runtime type validation and schema definition
- `zod-validation-error` - User-friendly validation error messages

**Date Handling**
- `date-fns` - Date manipulation and formatting utilities

**Database & ORM**
- `drizzle-orm` - TypeScript ORM
- `drizzle-zod` - Drizzle to Zod schema conversion
- `pg` - PostgreSQL client
- `connect-pg-simple` - PostgreSQL session store for express-session

**Development Tools**
- `@replit/vite-plugin-*` - Replit-specific development plugins (runtime error overlay, cartographer, dev banner)
- `tsx` - TypeScript execution for development and build scripts
- `esbuild` - Fast bundler for server code in production

**Build Strategy**
- Client: Vite builds React app to `dist/public`
- Server: esbuild bundles server code to `dist/index.cjs` with selective dependency bundling
- Dependencies allowlist for bundling reduces cold start syscalls (includes drizzle-orm, express, pg, zod, etc.)