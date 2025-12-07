# O&U Gadgets - Mobile Specs Catalogue

## Overview

O&U Gadgets is a responsive React-based web application that serves as a comprehensive mobile phone specifications catalogue. The platform enables users to browse, compare, and purchase smartphones at competitive prices, with full transparency on market pricing vs. O&U pricing. The application features a complete product catalogue, detailed specification pages, price comparison tools, and an admin dashboard for product management.

The project is built as a full-stack application with a Vite-powered React frontend and Express.js backend, designed for easy deployment on platforms like Replit, Netlify, or Vercel.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tool**
- **React 18** with **Vite** as the build tool for fast development and optimized production builds
- **TypeScript** for type safety across the application
- **Wouter** as a lightweight alternative to React Router for client-side routing

**UI Framework**
- **Tailwind CSS v4** for utility-first styling with custom theme configuration
- **shadcn/ui** component library (New York variant) for consistent, accessible UI components
- **Radix UI** primitives providing unstyled, accessible component foundations
- **Lucide React** for iconography

**State Management**
- **Zustand** with persistence middleware for global state management
- Local storage persistence for shopping cart, compare list, and authentication state
- **TanStack Query (React Query)** for server state management and data fetching

**Key Design Decisions**
- Mobile-first responsive design approach
- Component-driven architecture with reusable UI components in `/client/src/components`
- Lazy loading for images to improve initial load performance
- Client-side filtering and sorting for instant user feedback

**Routing Structure**
- `/` - Home page with hero section and featured phones
- `/catalog` - Full product grid with search, filters, and sorting
- `/phone/:id` - Detailed product specification page
- `/compare` - Side-by-side phone comparison view
- `/about` - Company information and warranty policy
- `/login` - Admin authentication
- `/admin/*` - Protected admin dashboard routes

### Backend Architecture

**Server Framework**
- **Express.js** as the HTTP server framework
- **Node.js** runtime environment
- Development server includes Vite middleware for HMR (Hot Module Replacement)

**API Design**
- RESTful API endpoints under `/api` prefix
- Phone CRUD endpoints:
  - `GET /api/phones` - List all phones
  - `GET /api/phones/:id` - Get single phone by ID
  - `POST /api/phones` - Create new phone (protected)
  - `PUT /api/phones/:id` - Update phone (protected)
  - `DELETE /api/phones/:id` - Delete phone (protected)
- Admin profile management endpoints:
  - `GET /api/admin/profile` - Retrieve admin profile (excludes password)
  - `PATCH /api/admin/profile` - Update profile (name, email, phone)
  - `POST /api/admin/change-password` - Change password with verification
  - `POST /api/admin/avatar` - Upload avatar image (max 5MB, jpeg/png/gif/webp)
- Authentication endpoints:
  - `POST /api/auth/login` - Admin login
  - `POST /api/auth/logout` - Admin logout
  - `GET /api/auth/status` - Check authentication status
- File upload handling for avatar images via Multer
- Static file serving for uploaded content at `/uploads`

**Authentication & Authorization**
- Simple session-based authentication for admin users
- In-memory storage implementation (MemStorage) for development
- Password hashing with **bcryptjs** (10 salt rounds)
- Password verification using bcrypt.compare
- Protected route middleware for admin-only endpoints

**Build & Deployment**
- Custom build script using esbuild for server bundling
- Vite build for client-side assets
- Production-ready bundle with optimized dependencies
- Static file serving from `/dist/public` in production

### Data Storage Solutions

**Current Implementation**
- **External Neon PostgreSQL database** for persistent data storage
- **Drizzle ORM** for type-safe database queries and schema management
- All phone data served via backend API endpoints from PostgreSQL
- TanStack Query (React Query) for all data fetching with proper loading states
- Zustand for authentication state management only
- File system storage for uploaded avatars in `/uploads/avatars`

**Database Configuration**
- Connection configured in `server/db.ts`
- Prioritizes `NEON_DATABASE_URL` environment variable (external Neon database)
- Falls back to `DATABASE_URL` if `NEON_DATABASE_URL` is not set
- Schema defined in `/shared/schema.ts` with two tables:
  - `users` - Basic user authentication
  - `admin_users` - Admin user profiles with roles, avatars, and metadata
- Migration/schema push via `drizzle-kit` using: `DATABASE_URL=$NEON_DATABASE_URL npm run db:push`

**Data Models**
- **Phone**: Product information including specs, pricing, images, and condition
- **AdminUser**: Admin account with role-based permissions (admin/manager/staff)
- **User**: Basic authentication user model

**Database Seeding**
- Seed script at `server/seed.ts` creates initial admin user
- Default admin credentials: username `oanduadmin`, password `admin@ougadgets.com`
- Run with: `npx tsx server/seed.ts`

### External Dependencies

**Third-Party Services**
- **Google Fonts** - Outfit (headings) and Inter (body text) font families
- **Unsplash** - Placeholder product images in sample data
- **YouTube** - Embedded inspection videos for products

**Development Tools**
- **Replit-specific plugins**:
  - `@replit/vite-plugin-runtime-error-modal` - Development error overlay
  - `@replit/vite-plugin-cartographer` - Code navigation
  - `@replit/vite-plugin-dev-banner` - Development environment indicator

**Key Libraries**
- **Form Handling**: React Hook Form with Zod validation via `@hookform/resolvers`
- **File Uploads**: Multer for multipart/form-data handling
- **Session Management**: `connect-pg-simple` for PostgreSQL-backed sessions (when enabled)
- **Date Utilities**: `date-fns` for date formatting and manipulation
- **Validation**: Zod for runtime type validation and schema definitions

**Payment Integration (Placeholder)**
- Payment flow UI implemented but not connected to actual payment gateway
- Designed to integrate with services like Stripe or Paystack in the future

**Communication Channels**
- **WhatsApp** deep linking for customer chat
- **Phone** calling via `tel:` links
- Contact information configurable in admin settings