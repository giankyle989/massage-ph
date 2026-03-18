# MassagePH — Project Guidelines

## Project Overview

MassagePH is a massage shop listing directory for the Philippines. It has two interfaces:
- **Admin Panel** — CRUD management of listings (protected)
- **Customer Site** — public browsing, search, filtering, and detail pages

PRD: `docs/PRD.md`

## Tech Stack

| Layer           | Technology                              |
|-----------------|-----------------------------------------|
| Framework       | Next.js 14+ (App Router)               |
| Language        | TypeScript (strict mode)                |
| Styling         | Tailwind CSS                            |
| Database        | PostgreSQL                              |
| ORM             | Prisma                                  |
| Auth            | NextAuth.js (Auth.js)                   |
| Image Storage   | AWS S3                                  |
| Maps            | Google Maps JavaScript API              |
| Package Manager | npm                                     |
| Node Version    | 20.x LTS                               |

## Testing

| Type        | Tool                    |
|-------------|-------------------------|
| Unit        | Vitest + React Testing Library |
| Integration | Vitest                  |
| E2E         | Playwright              |

- Test files: colocate as `*.test.ts` / `*.test.tsx` next to source, or under `__tests__/` directories
- E2E tests: `e2e/` directory at project root

## Code Quality

- ESLint + Prettier enforced via husky + lint-staged on pre-commit
- TypeScript strict mode — no `any` unless absolutely necessary
- All new code must pass lint and type checks before commit

## Project Structure (App Router)

```
src/
  app/
    (admin)/        # Admin routes (protected layout)
    (customer)/     # Customer-facing routes (public layout)
    api/            # API route handlers
    layout.tsx      # Root layout
  components/
    ui/             # Reusable UI primitives (Button, Input, Modal, Table, Pagination, Toast, Skeleton)
    admin/          # Admin-specific components (AdminNav, ListingForm, ServiceRows, MapPinPicker, ImageUploader, ChangePasswordForm)
    customer/       # Customer-specific components (Header, Footer, ListingCard, FilterDrawer, SearchBar, ImageGallery, ServicesTable, MapEmbed, CopyAddress, EmptyState)
  lib/
    db.ts           # Prisma client singleton
    auth.ts         # NextAuth config
    s3.ts           # S3 upload utilities
    constants.ts    # Named constants (page sizes, limits)
    validators/     # Zod schemas for validation
    data/
      regions-cities.json  # Philippine regions & cities (PSGC)
  types/            # Shared TypeScript types
prisma/
  schema.prisma     # Database schema
  seed.ts           # Seed script
public/             # Static assets (logo, favicon)
.env.example        # Required env vars (no values) — committed
docs/               # Documentation and specs
```

## Conventions

### Naming
- **Files/folders:** kebab-case (`listing-card.tsx`, `use-listings.ts`)
- **Components:** PascalCase (`ListingCard`, `SearchBar`)
- **Functions/variables:** camelCase
- **Database tables/columns:** snake_case (Prisma maps to camelCase)
- **Environment variables:** SCREAMING_SNAKE_CASE

### Components
- Use server components by default; add `"use client"` only when needed
- Keep components small and focused — one responsibility per component
- Colocate component-specific types in the same file

### Data Fetching
- Server components fetch data directly via Prisma
- Client components use API routes when needed
- Validate all inputs with Zod at API boundaries

### API Routes
- Use Next.js Route Handlers (`route.ts`)
- Return consistent JSON shape: `{ data, error, message }`
- Protect admin endpoints with NextAuth session checks

### Database
- All schema changes via Prisma migrations
- Never edit migration files after they've been applied
- Use Prisma's relation queries — avoid raw SQL unless necessary
- Add `@@index` annotations for columns used in filters and lookups (region, city, category, isActive)

### Git
- Commit messages: conventional commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`)
- One logical change per commit
- Branch naming: `feat/description`, `fix/description`, `chore/description`

### Environment Variables
- `.env.local` for local development (never committed)
- `.env.example` with all required keys (no values) committed to repo
- Required vars: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET`, `AWS_S3_REGION`, `GOOGLE_MAPS_API_KEY`
- Optional vars: `SESSION_MAX_AGE` (session duration in seconds, default: 86400)

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Run Prettier
npm run test         # Run Vitest
npm run test:e2e     # Run Playwright
npx prisma migrate dev    # Run migrations
npx prisma db seed        # Seed database
npx prisma studio         # Open Prisma Studio
```
