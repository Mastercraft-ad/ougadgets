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
- Admin profile management endpoints:
  - `GET /api/admin/profile` - Retrieve admin profile (excludes password)
  - `PATCH /api/admin/profile` - Update profile (name, email, phone)
  - `POST /api/admin/change-password` - Change password with verification
  - `POST /api/admin/avatar` - Upload avatar image (max 5MB, jpeg/png/gif/webp)
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
- **In-memory storage** (MemStorage) for development and prototyping
- Client-side JSON file (`/client/src/data/phones.json`) as the product database
- Zustand with localStorage persistence for client state
- File system storage for uploaded avatars in `/uploads/avatars`

**Database Schema (Configured but Not Active)**
- **Drizzle ORM** configured with PostgreSQL dialect
- Schema defined in `/shared/schema.ts` with two tables:
  - `users` - Basic user authentication
  - `admin_users` - Admin user profiles with roles, avatars, and metadata
- Migration support via `drizzle-kit` (migrations in `/migrations`)

**Data Models**
- **Phone**: Product information including specs, pricing, images, and condition
- **AdminUser**: Admin account with role-based permissions (admin/manager/staff)
- **User**: Basic authentication user model

**Future-Ready Design**
- The application is structured to easily swap from in-memory storage to PostgreSQL
- Database connection string expected via `DATABASE_URL` environment variable
- Drizzle ORM provides type-safe database queries when PostgreSQL is provisioned

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