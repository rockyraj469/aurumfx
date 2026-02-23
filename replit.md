# AurumFX - Forex Trading Platform

## Overview

AurumFX is a simulated forex trading platform with a premium dark-themed UI. Users can log in via Replit Auth, view a mock portfolio with a $100,000 starting balance, execute simulated buy/sell trades on currency pairs, and view live-updating market charts. The app features a landing page and an authenticated dashboard with portfolio stats, a trading panel, and trade history.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router) with two main routes: `/` (landing) and `/dashboard`
- **State Management**: TanStack React Query for server state (caching, fetching, mutations)
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives, customized with a deep dark "space" theme and gold accent colors
- **Styling**: Tailwind CSS with CSS variables for theming. Dark mode only — no light mode toggle. Custom fonts: Outfit (display), Space Grotesk (mono/data), Inter (body)
- **Animations**: Framer Motion for page transitions and smooth UI effects
- **Charts**: Recharts for mock market data visualization (AreaChart with simulated live price updates)
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend
- **Framework**: Express.js running on Node with TypeScript (tsx for dev, esbuild for production)
- **API Pattern**: REST API under `/api/` prefix. Route definitions are shared between client and server via `shared/routes.ts` using Zod schemas for validation
- **Authentication**: Replit Auth via OpenID Connect (OIDC). Sessions stored in PostgreSQL via `connect-pg-simple`. Passport.js handles the auth strategy. The auth integration lives in `server/replit_integrations/auth/`
- **Key API Endpoints**:
  - `GET /api/auth/user` — get current authenticated user
  - `GET /api/portfolio` — get or create user portfolio (auto-creates with $100k balance)
  - `GET /api/trades` — list user's trades
  - `POST /api/trades` — create a new trade
  - `GET /api/login` — initiate Replit OIDC login
  - `GET /api/logout` — logout

### Data Layer
- **Database**: PostgreSQL (required, connected via `DATABASE_URL` env var)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-validation integration
- **Schema** (in `shared/schema.ts` and `shared/models/auth.ts`):
  - `users` — id, email, firstName, lastName, profileImageUrl, timestamps (managed by Replit Auth)
  - `sessions` — sid, sess (jsonb), expire (required for Replit Auth session storage)
  - `portfolios` — id, userId (FK to users), balance (numeric, default "100000.00")
  - `trades` — id, userId (FK to users), symbol, type (buy/sell), amount (numeric), price (numeric), status (open/closed), createdAt
- **Migrations**: Use `npm run db:push` (drizzle-kit push) to sync schema to database. Migrations output to `./migrations/`

### Build System
- **Development**: `npm run dev` — runs tsx with Vite dev server middleware (HMR via `/vite-hmr`)
- **Production Build**: `npm run build` — Vite builds client to `dist/public/`, esbuild bundles server to `dist/index.cjs`. Certain server dependencies are bundled (allowlisted in `script/build.ts`) to reduce cold start times
- **Production Start**: `npm start` — runs `node dist/index.cjs`

### Shared Code
The `shared/` directory contains code used by both client and server:
- `schema.ts` — Drizzle table definitions and Zod insert schemas
- `models/auth.ts` — User and session table definitions (required by Replit Auth)
- `routes.ts` — API route path/method/schema definitions used for type-safe API contracts

## External Dependencies

- **PostgreSQL** — Primary database, connected via `DATABASE_URL` environment variable. Required for all data storage and session management
- **Replit Auth (OIDC)** — Authentication provider. Uses `ISSUER_URL` (defaults to `https://replit.com/oidc`), `REPL_ID`, and `SESSION_SECRET` environment variables
- **Google Fonts** — Outfit, Space Grotesk, Inter, DM Sans, Fira Code, Geist Mono, Architects Daughter (loaded via CDN in `index.html` and `index.css`)
- **Replit Vite Plugins** — `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner` (dev-only)