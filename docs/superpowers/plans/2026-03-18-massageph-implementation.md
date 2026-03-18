# MassagePH Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a massage shop listing directory for the Philippines with an admin CRUD panel and a public customer browsing site.

**Architecture:** Next.js 14+ App Router with TypeScript. PostgreSQL via Prisma ORM. NextAuth.js for admin auth. AWS S3 + CloudFront for images. Google Maps JavaScript API for location display and pin picking. Server components by default, client components only where interactivity is needed.

**Tech Stack:** Next.js 14+, TypeScript, Tailwind CSS, PostgreSQL, Prisma, NextAuth.js, AWS S3, Google Maps JS API, Vitest, React Testing Library, Playwright, ESLint, Prettier, husky, lint-staged

**Spec:** `docs/superpowers/specs/2026-03-18-massageph-design.md`

---

## Phase 1: Project Setup & Foundation

### Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `next.config.ts`, `.eslintrc.json`, `.prettierrc`, `src/app/layout.tsx`, `src/app/page.tsx`
- Create: `.env.example`, `.env.local`

- [ ] **Step 1: Create Next.js project with TypeScript and Tailwind**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```

Accept defaults. This scaffolds the project in the current directory.

- [ ] **Step 2: Verify dev server starts**

```bash
npm run dev
```

Open `http://localhost:3000` — should see the default Next.js page. Stop the server.

- [ ] **Step 3: Create `.env.example`**

Create `.env.example` at project root with all required keys (no values):

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
SESSION_MAX_AGE=86400
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
AWS_S3_REGION=
CLOUDFRONT_DOMAIN=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

- [ ] **Step 4: Create `.env.local`**

Create `.env.local` with actual local development values. Ensure `.env.local` is in `.gitignore` (Next.js adds it by default).

```env
DATABASE_URL=postgresql://user:password@localhost:5432/massageph
NEXTAUTH_SECRET=dev-secret-change-in-production
NEXTAUTH_URL=http://localhost:3000
SESSION_MAX_AGE=86400
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=your-bucket
AWS_S3_REGION=ap-southeast-1
CLOUDFRONT_DOMAIN=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: initialize Next.js project with TypeScript and Tailwind"
```

---

### Task 2: Configure Code Quality Tools

**Files:**
- Modify: `.eslintrc.json`
- Create: `.prettierrc`
- Create: `.lintstagedrc.json`
- Modify: `package.json` (add husky + lint-staged)

- [ ] **Step 1: Install Prettier and lint-staged**

```bash
npm install -D prettier eslint-config-prettier lint-staged
```

- [ ] **Step 2: Create `.prettierrc`**

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100
}
```

- [ ] **Step 3: Update `.eslintrc.json` to include Prettier**

Add `"prettier"` to the `extends` array after any existing configs.

- [ ] **Step 4: Create `.lintstagedrc.json`**

```json
{
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,css}": ["prettier --write"]
}
```

- [ ] **Step 5: Install and configure husky**

```bash
npx husky init
echo "npx lint-staged" > .husky/pre-commit
```

- [ ] **Step 6: Verify lint and format commands work**

```bash
npm run lint
npx prettier --check "src/**/*.{ts,tsx}"
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: configure ESLint, Prettier, husky, and lint-staged"
```

---

### Task 3: Configure Testing Tools

**Files:**
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `src/__tests__/setup.ts`
- Modify: `package.json` (scripts)

- [ ] **Step 1: Install Vitest and React Testing Library**

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 2: Create `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

- [ ] **Step 3: Create `src/__tests__/setup.ts`**

```typescript
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 4: Install Playwright**

```bash
npm install -D @playwright/test
npx playwright install --with-deps chromium
```

- [ ] **Step 5: Create `playwright.config.ts`**

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

- [ ] **Step 6: Create `e2e/` directory with a placeholder test**

Create `e2e/smoke.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/MassagePH/i);
});
```

- [ ] **Step 7: Add test scripts to `package.json`**

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

- [ ] **Step 8: Run Vitest to confirm it works (no tests yet, should pass)**

```bash
npm run test
```

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: configure Vitest, React Testing Library, and Playwright"
```

---

### Task 4: Set Up Prisma and Database Schema

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/lib/db.ts`
- Modify: `package.json` (prisma scripts)

- [ ] **Step 1: Install Prisma**

```bash
npm install prisma @prisma/client
npx prisma init
```

- [ ] **Step 2: Write the Prisma schema**

Replace `prisma/schema.prisma` with:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Listing {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  category    String
  region      String
  city        String
  address     String
  latitude    Float?
  longitude   Float?
  description String    @db.Text
  tags        String[]
  images      String[]
  isActive    Boolean   @default(true) @map("is_active")
  services    Service[]
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  @@index([region])
  @@index([city])
  @@index([category])
  @@index([isActive])
  @@index([region, city, category, isActive])
  @@map("listings")
}

model Service {
  id           String   @id @default(cuid())
  name         String
  price        Decimal  @db.Decimal(10, 2)
  duration     Int
  discount     Decimal? @db.Decimal(10, 2)
  discountType String?  @map("discount_type")
  description  String?
  listing      Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)
  listingId    String   @map("listing_id")

  @@index([listingId])
  @@map("services")
}

model AdminUser {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String   @map("password_hash")
  name         String
  role         String   @default("admin")
  createdAt    DateTime @default(now()) @map("created_at")

  @@map("admin_users")
}
```

- [ ] **Step 3: Create Prisma client singleton**

Create `src/lib/db.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

- [ ] **Step 4: Run initial migration**

Ensure your local PostgreSQL is running and `DATABASE_URL` in `.env.local` is correct.

```bash
npx prisma migrate dev --name init
```

Expected: Migration created and applied. Prisma client generated.

- [ ] **Step 5: Verify Prisma Studio works**

```bash
npx prisma studio
```

Should open browser showing empty tables: listings, services, admin_users. Close it.

- [ ] **Step 6: Commit**

```bash
git add prisma/schema.prisma prisma/migrations src/lib/db.ts
git commit -m "feat: add Prisma schema with Listing, Service, and AdminUser models"
```

---

### Task 5: Create Constants, Types, and Reference Data

**Files:**
- Create: `src/lib/constants.ts`
- Create: `src/types/index.ts`
- Create: `src/lib/data/regions-cities.json`

- [ ] **Step 1: Create constants file**

Create `src/lib/constants.ts`:

```typescript
export const CUSTOMER_PAGE_SIZE = 12;
export const ADMIN_PAGE_SIZE = 20;

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const RATE_LIMIT_PUBLIC = 100; // requests per minute
export const RATE_LIMIT_ADMIN = 60;
export const RATE_LIMIT_UPLOAD = 20;

export const PREDEFINED_CATEGORIES = [
  'Thai Massage',
  'Chinese Massage',
  'Swedish Massage',
  'Shiatsu',
  'Hilot (Filipino Traditional)',
  'Deep Tissue',
  'Aromatherapy',
  'Hot Stone',
  'Sports Massage',
  'Reflexology',
  'Prenatal Massage',
  'Combination / Multi-style',
] as const;

export const PREDEFINED_TAGS = [
  '24/7',
  'Pet Friendly',
  'Parking Available',
  'WiFi Available',
  'Home Service',
  'Couple Massage',
  'Senior Discount',
  'Student Discount',
  'Walk-In Welcome',
  'By Appointment Only',
  'Male Therapist',
  'Female Therapist',
  'Wheelchair Accessible',
  'Credit Card Accepted',
  'GCash Accepted',
] as const;
```

- [ ] **Step 2: Create shared types**

Create `src/types/index.ts`:

```typescript
import { Listing, Service, AdminUser } from '@prisma/client';

export type ListingWithServices = Listing & {
  services: Service[];
};

export type PublicListing = Omit<ListingWithServices, 'createdAt' | 'updatedAt'>;

export type ListingCardData = Pick<Listing, 'slug' | 'name' | 'category' | 'city' | 'images'> & {
  startingPrice: number;
};

export type ApiResponse<T = unknown> = {
  data?: T;
  error?: string | Record<string, string>;
  message?: string;
};

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
```

- [ ] **Step 3: Create regions-cities reference data**

Create `src/lib/data/regions-cities.json`:

```json
{
  "regions": [
    {
      "code": "NCR",
      "name": "National Capital Region",
      "cities": ["Quezon City", "Manila", "Makati", "Taguig", "Pasig", "Mandaluyong", "San Juan", "Pasay", "Parañaque", "Las Piñas", "Muntinlupa", "Marikina", "Caloocan", "Malabon", "Navotas", "Valenzuela"]
    },
    {
      "code": "Region I",
      "name": "Ilocos Region",
      "cities": ["San Fernando", "Laoag", "Dagupan", "Vigan", "Alaminos", "Urdaneta", "San Carlos"]
    },
    {
      "code": "Region III",
      "name": "Central Luzon",
      "cities": ["San Fernando", "Angeles", "Olongapo", "Malolos", "Meycauayan", "San Jose del Monte", "Cabanatuan", "Tarlac City"]
    },
    {
      "code": "Region IV-A",
      "name": "CALABARZON",
      "cities": ["Antipolo", "Calamba", "Lucena", "Batangas City", "Lipa", "San Pablo", "Santa Rosa", "Biñan", "Dasmariñas", "Bacoor", "Imus", "General Trias", "Cavite City"]
    },
    {
      "code": "Region IV-B",
      "name": "MIMAROPA",
      "cities": ["Puerto Princesa", "Calapan", "Roxas"]
    },
    {
      "code": "Region V",
      "name": "Bicol Region",
      "cities": ["Legazpi", "Naga", "Sorsogon City", "Masbate City", "Iriga", "Tabaco"]
    },
    {
      "code": "Region VI",
      "name": "Western Visayas",
      "cities": ["Iloilo City", "Bacolod", "Roxas City", "Kabankalan", "Silay"]
    },
    {
      "code": "Region VII",
      "name": "Central Visayas",
      "cities": ["Cebu City", "Lapu-Lapu", "Mandaue", "Tagbilaran", "Dumaguete", "Toledo", "Talisay"]
    },
    {
      "code": "Region VIII",
      "name": "Eastern Visayas",
      "cities": ["Tacloban", "Ormoc", "Calbayog", "Catbalogan"]
    },
    {
      "code": "Region IX",
      "name": "Zamboanga Peninsula",
      "cities": ["Zamboanga City", "Pagadian", "Dipolog", "Dapitan"]
    },
    {
      "code": "Region X",
      "name": "Northern Mindanao",
      "cities": ["Cagayan de Oro", "Iligan", "Ozamiz", "Malaybalay", "Valencia"]
    },
    {
      "code": "Region XI",
      "name": "Davao Region",
      "cities": ["Davao City", "Tagum", "Digos", "Panabo", "Samal"]
    },
    {
      "code": "Region XII",
      "name": "SOCCSKSARGEN",
      "cities": ["General Santos", "Koronadal", "Cotabato City", "Kidapawan", "Tacurong"]
    },
    {
      "code": "Region XIII",
      "name": "Caraga",
      "cities": ["Butuan", "Surigao City", "Bislig", "Bayugan"]
    },
    {
      "code": "CAR",
      "name": "Cordillera Administrative Region",
      "cities": ["Baguio", "Tabuk", "La Trinidad"]
    },
    {
      "code": "BARMM",
      "name": "Bangsamoro Autonomous Region",
      "cities": ["Cotabato City", "Marawi", "Lamitan", "Jolo"]
    }
  ]
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/constants.ts src/types/index.ts src/lib/data/regions-cities.json
git commit -m "feat: add constants, shared types, and Philippine regions reference data"
```

---

### Task 6: Set Up Zod Validation Schemas

**Files:**
- Create: `src/lib/validators/listing.ts`
- Create: `src/lib/validators/auth.ts`
- Create: `src/lib/validators/index.ts`
- Create: `src/lib/validators/listing.test.ts`
- Create: `src/lib/validators/auth.test.ts`

- [ ] **Step 1: Install Zod**

```bash
npm install zod
```

- [ ] **Step 2: Write failing tests for listing validators**

Create `src/lib/validators/listing.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { ServiceSchema, ListingCreateSchema } from './listing';

describe('ServiceSchema', () => {
  it('validates a valid service', () => {
    const result = ServiceSchema.safeParse({
      name: 'Full Body Massage',
      price: 500,
      duration: 60,
    });
    expect(result.success).toBe(true);
  });

  it('validates a service with percentage discount', () => {
    const result = ServiceSchema.safeParse({
      name: 'Full Body Massage',
      price: 500,
      duration: 60,
      discount: 10,
      discountType: 'percentage',
    });
    expect(result.success).toBe(true);
  });

  it('validates a service with fixed discount', () => {
    const result = ServiceSchema.safeParse({
      name: 'Full Body Massage',
      price: 500,
      duration: 60,
      discount: 100,
      discountType: 'fixed',
    });
    expect(result.success).toBe(true);
  });

  it('rejects service with discount but no discount type', () => {
    const result = ServiceSchema.safeParse({
      name: 'Full Body Massage',
      price: 500,
      duration: 60,
      discount: 10,
    });
    expect(result.success).toBe(false);
  });

  it('rejects service with negative price', () => {
    const result = ServiceSchema.safeParse({
      name: 'Full Body Massage',
      price: -100,
      duration: 60,
    });
    expect(result.success).toBe(false);
  });

  it('rejects service with empty name', () => {
    const result = ServiceSchema.safeParse({
      name: '',
      price: 500,
      duration: 60,
    });
    expect(result.success).toBe(false);
  });
});

describe('ListingCreateSchema', () => {
  const validListing = {
    name: 'Zen Spa',
    category: 'Thai Massage',
    region: 'NCR',
    city: 'Makati',
    address: '123 Main St',
    description: 'A great spa experience.',
    images: ['https://example.com/img1.jpg'],
    services: [{ name: 'Full Body', price: 500, duration: 60 }],
  };

  it('validates a complete valid listing', () => {
    const result = ListingCreateSchema.safeParse(validListing);
    expect(result.success).toBe(true);
  });

  it('accepts optional fields', () => {
    const result = ListingCreateSchema.safeParse({
      ...validListing,
      latitude: 14.5547,
      longitude: 121.0244,
      tags: ['24/7', 'WiFi Available'],
      isActive: false,
    });
    expect(result.success).toBe(true);
  });

  it('rejects listing with no services', () => {
    const result = ListingCreateSchema.safeParse({
      ...validListing,
      services: [],
    });
    expect(result.success).toBe(false);
  });

  it('rejects listing with no images', () => {
    const result = ListingCreateSchema.safeParse({
      ...validListing,
      images: [],
    });
    expect(result.success).toBe(false);
  });

  it('rejects listing with missing required fields', () => {
    const result = ListingCreateSchema.safeParse({
      name: 'Zen Spa',
    });
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
npm run test -- src/lib/validators/listing.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 4: Implement listing validators**

Create `src/lib/validators/listing.ts`:

```typescript
import { z } from 'zod';

export const ServiceSchema = z
  .object({
    name: z.string().min(1, 'Service name is required'),
    price: z.number().positive('Price must be positive'),
    duration: z.number().int().positive('Duration must be a positive integer'),
    discount: z.number().positive().nullable().optional(),
    discountType: z.enum(['percentage', 'fixed']).nullable().optional(),
    description: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.discount && !data.discountType) return false;
      if (data.discountType && !data.discount) return false;
      return true;
    },
    { message: 'Discount requires both amount and type' }
  );

export const ListingCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  region: z.string().min(1, 'Region is required'),
  city: z.string().min(1, 'City is required'),
  address: z.string().min(1, 'Address is required'),
  description: z.string().min(1, 'Description is required'),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  tags: z.array(z.string()).optional().default([]),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  services: z.array(ServiceSchema).min(1, 'At least one service is required'),
  isActive: z.boolean().optional().default(true),
});

export const ListingUpdateSchema = ListingCreateSchema;

export type ListingCreateInput = z.infer<typeof ListingCreateSchema>;
export type ListingUpdateInput = z.infer<typeof ListingUpdateSchema>;
export type ServiceInput = z.infer<typeof ServiceSchema>;
```

- [ ] **Step 5: Run listing validator tests**

```bash
npm run test -- src/lib/validators/listing.test.ts
```

Expected: All tests PASS.

- [ ] **Step 6: Write failing tests for auth validators**

Create `src/lib/validators/auth.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { LoginSchema, ChangePasswordSchema } from './auth';

describe('LoginSchema', () => {
  it('validates valid credentials', () => {
    const result = LoginSchema.safeParse({
      email: 'admin@massageph.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = LoginSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty password', () => {
    const result = LoginSchema.safeParse({
      email: 'admin@massageph.com',
      password: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('ChangePasswordSchema', () => {
  it('validates valid password change', () => {
    const result = ChangePasswordSchema.safeParse({
      currentPassword: 'oldpassword',
      newPassword: 'newpassword123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects new password under 8 characters', () => {
    const result = ChangePasswordSchema.safeParse({
      currentPassword: 'oldpassword',
      newPassword: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty current password', () => {
    const result = ChangePasswordSchema.safeParse({
      currentPassword: '',
      newPassword: 'newpassword123',
    });
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 7: Run auth tests to verify they fail**

```bash
npm run test -- src/lib/validators/auth.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 8: Implement auth validators**

Create `src/lib/validators/auth.ts`:

```typescript
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
```

- [ ] **Step 9: Create validators barrel export**

Create `src/lib/validators/index.ts`:

```typescript
export { ServiceSchema, ListingCreateSchema, ListingUpdateSchema } from './listing';
export type { ListingCreateInput, ListingUpdateInput, ServiceInput } from './listing';

export { LoginSchema, ChangePasswordSchema } from './auth';
export type { LoginInput, ChangePasswordInput } from './auth';
```

- [ ] **Step 10: Run all validator tests**

```bash
npm run test -- src/lib/validators/
```

Expected: All tests PASS.

- [ ] **Step 11: Commit**

```bash
git add src/lib/validators/
git commit -m "feat: add Zod validation schemas for listings, services, and auth"
```

---

### Task 7: Set Up NextAuth.js Authentication

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Install: `next-auth`, `bcryptjs`

- [ ] **Step 1: Install dependencies**

```bash
npm install next-auth bcryptjs
npm install -D @types/bcryptjs
```

- [ ] **Step 2: Create NextAuth configuration**

Create `src/lib/auth.ts`:

```typescript
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './db';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.adminUser.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400', 10),
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};
```

- [ ] **Step 3: Create NextAuth route handler**

Create `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

- [ ] **Step 4: Extend NextAuth types**

Create `src/types/next-auth.d.ts`:

```typescript
import 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/auth.ts src/app/api/auth/ src/types/next-auth.d.ts
git commit -m "feat: configure NextAuth.js with credentials provider and JWT strategy"
```

---

### Task 8: Create Seed Script

**Files:**
- Create: `prisma/seed.ts`
- Modify: `package.json` (prisma seed config)

- [ ] **Step 1: Create seed script**

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const passwordHash = await bcrypt.hash('changeme123', 10);
  await prisma.adminUser.upsert({
    where: { email: 'admin@massageph.com' },
    update: {},
    create: {
      email: 'admin@massageph.com',
      passwordHash,
      name: 'Admin',
      role: 'admin',
    },
  });

  console.log('Admin user created: admin@massageph.com / changeme123');

  // Create sample listings
  const listings = [
    {
      name: 'Zen Thai Spa',
      slug: 'zen-thai-spa',
      category: 'Thai Massage',
      region: 'NCR',
      city: 'Makati',
      address: '123 Ayala Avenue, Makati City',
      latitude: 14.5547,
      longitude: 121.0244,
      description: 'Premium Thai massage experience in the heart of Makati. Open daily from 10AM to 10PM. Contact: 0917-123-4567.',
      tags: ['Parking Available', 'WiFi Available', 'Credit Card Accepted', 'GCash Accepted'],
      images: ['https://placehold.co/800x600/e2e8f0/64748b?text=Zen+Thai+Spa'],
      isActive: true,
      services: [
        { name: 'Traditional Thai Massage', price: 500, duration: 60 },
        { name: 'Thai Oil Massage', price: 700, duration: 90, discount: 10, discountType: 'percentage' },
        { name: 'Foot Reflexology', price: 350, duration: 30 },
      ],
    },
    {
      name: 'Hilot Healing Hands',
      slug: 'hilot-healing-hands',
      category: 'Hilot (Filipino Traditional)',
      region: 'NCR',
      city: 'Quezon City',
      address: '456 Commonwealth Ave, Quezon City',
      latitude: 14.6760,
      longitude: 121.0437,
      description: 'Authentic Filipino Hilot massage using traditional techniques. Walk-ins welcome! Call us at 0918-765-4321.',
      tags: ['Walk-In Welcome', 'Home Service', 'Senior Discount', 'GCash Accepted'],
      images: ['https://placehold.co/800x600/e2e8f0/64748b?text=Hilot+Healing+Hands'],
      isActive: true,
      services: [
        { name: 'Traditional Hilot', price: 400, duration: 60 },
        { name: 'Hilot with Banana Leaves', price: 600, duration: 90, discount: 50, discountType: 'fixed' },
      ],
    },
    {
      name: 'Cebu Shiatsu Center',
      slug: 'cebu-shiatsu-center',
      category: 'Shiatsu',
      region: 'Region VII',
      city: 'Cebu City',
      address: '789 Osmena Blvd, Cebu City',
      latitude: 10.3157,
      longitude: 123.8854,
      description: 'Japanese-style Shiatsu massage in Cebu. By appointment only. Open Mon-Sat 9AM-8PM. Contact: 0919-888-7777.',
      tags: ['By Appointment Only', 'Parking Available', 'Couple Massage'],
      images: ['https://placehold.co/800x600/e2e8f0/64748b?text=Cebu+Shiatsu+Center'],
      isActive: true,
      services: [
        { name: 'Full Body Shiatsu', price: 600, duration: 60 },
        { name: 'Couples Shiatsu', price: 1100, duration: 60 },
        { name: 'Back & Shoulder Focus', price: 400, duration: 30 },
      ],
    },
    {
      name: 'Swedish Touch Calamba',
      slug: 'swedish-touch-calamba',
      category: 'Swedish Massage',
      region: 'Region IV-A',
      city: 'Calamba',
      address: '321 National Highway, Calamba, Laguna',
      latitude: 14.2114,
      longitude: 121.1653,
      description: 'Relaxing Swedish massage in a peaceful setting. Open 24/7. Contact: 0920-555-1234.',
      tags: ['24/7', 'WiFi Available', 'Female Therapist', 'Male Therapist'],
      images: ['https://placehold.co/800x600/e2e8f0/64748b?text=Swedish+Touch+Calamba'],
      isActive: true,
      services: [
        { name: 'Classic Swedish Massage', price: 550, duration: 60 },
        { name: 'Deep Tissue Swedish', price: 750, duration: 90, discount: 15, discountType: 'percentage' },
        { name: 'Hot Stone Add-on', price: 200, duration: 30 },
      ],
    },
    {
      name: 'Davao Deep Tissue Studio',
      slug: 'davao-deep-tissue-studio',
      category: 'Deep Tissue',
      region: 'Region XI',
      city: 'Davao City',
      address: '567 Quirino Ave, Davao City',
      latitude: 7.0731,
      longitude: 125.6128,
      description: 'Specializing in deep tissue and sports massage. Perfect for athletes and active individuals. Contact: 0921-333-9999.',
      tags: ['Walk-In Welcome', 'Parking Available', 'Student Discount', 'Wheelchair Accessible'],
      images: ['https://placehold.co/800x600/e2e8f0/64748b?text=Davao+Deep+Tissue'],
      isActive: true,
      services: [
        { name: 'Deep Tissue Full Body', price: 650, duration: 60 },
        { name: 'Sports Recovery Massage', price: 800, duration: 90, discount: 100, discountType: 'fixed' },
        { name: 'Targeted Muscle Release', price: 400, duration: 30 },
        { name: 'Pre-Game Warm-Up Massage', price: 350, duration: 20 },
      ],
    },
    {
      name: 'Closed For Renovation Spa',
      slug: 'closed-for-renovation-spa',
      category: 'Aromatherapy',
      region: 'NCR',
      city: 'Taguig',
      address: '100 BGC, Taguig City',
      description: 'Currently closed for renovation. Will reopen soon!',
      tags: ['Credit Card Accepted'],
      images: ['https://placehold.co/800x600/e2e8f0/64748b?text=Closed+For+Renovation'],
      isActive: false,
      services: [
        { name: 'Aromatherapy Massage', price: 800, duration: 60 },
      ],
    },
  ];

  for (const { services, ...listingData } of listings) {
    await prisma.listing.upsert({
      where: { slug: listingData.slug },
      update: {},
      create: {
        ...listingData,
        services: {
          create: services.map((s) => ({
            name: s.name,
            price: s.price,
            duration: s.duration,
            discount: s.discount ?? null,
            discountType: s.discountType ?? null,
          })),
        },
      },
    });
  }

  console.log(`Seeded ${listings.length} listings`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

- [ ] **Step 2: Add prisma seed config to `package.json`**

Add to `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

- [ ] **Step 3: Install ts-node for seed script**

```bash
npm install -D ts-node
```

- [ ] **Step 4: Run seed**

```bash
npx prisma db seed
```

Expected: "Admin user created" and "Seeded 6 listings" messages.

- [ ] **Step 5: Verify in Prisma Studio**

```bash
npx prisma studio
```

Check that admin_users has 1 entry, listings has 6 entries, services has associated entries. Close studio.

- [ ] **Step 6: Commit**

```bash
git add prisma/seed.ts package.json
git commit -m "feat: add database seed script with admin user and sample listings"
```

---

## Phase 2: UI Primitives & Shared Components

### Task 9: Create Reusable UI Components

**Files:**
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/modal.tsx`
- Create: `src/components/ui/pagination.tsx`
- Create: `src/components/ui/toast.tsx`
- Create: `src/components/ui/skeleton.tsx`
- Create: `src/components/ui/table.tsx`

- [ ] **Step 1: Create Button component**

Create `src/components/ui/button.tsx`:

```tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, children, className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {loading && (
          <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

- [ ] **Step 2: Create Input component**

Create `src/components/ui/input.tsx`:

```tsx
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="space-y-1">
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-describedby={error ? `${inputId}-error` : undefined}
          aria-invalid={!!error}
          className={`block w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

- [ ] **Step 3: Create Modal component**

Create `src/components/ui/modal.tsx`:

```tsx
'use client';

import { ReactNode, useEffect, useRef } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="rounded-lg p-0 shadow-xl backdrop:bg-black/50 max-w-md w-full"
    >
      <div className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">{title}</h2>
        {children}
      </div>
    </dialog>
  );
}
```

- [ ] **Step 4: Create Pagination component**

Create `src/components/ui/pagination.tsx`:

```tsx
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string>;
}

export function Pagination({ currentPage, totalPages, basePath, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    return `${basePath}?${params.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
        >
          Previous
        </Link>
      )}
      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          aria-current={page === currentPage ? 'page' : undefined}
          className={`rounded-lg px-3 py-2 text-sm ${
            page === currentPage
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {page}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
        >
          Next
        </Link>
      )}
    </nav>
  );
}
```

- [ ] **Step 5: Create Toast component**

Create `src/components/ui/toast.tsx`:

```tsx
'use client';

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextIdRef = useRef(0);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = nextIdRef.current++;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const typeStyles: Record<ToastType, string> = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-slate-800',
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-lg px-4 py-3 text-sm text-white shadow-lg ${typeStyles[t.type]}`}
            role="status"
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
```

- [ ] **Step 6: Create Skeleton component**

Create `src/components/ui/skeleton.tsx`:

```tsx
interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
```

- [ ] **Step 7: Create Table component**

Create `src/components/ui/table.tsx`:

```tsx
import { ReactNode } from 'react';

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
}

export function Table<T>({ columns, data, keyExtractor }: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((item) => (
            <tr key={keyExtractor(item)} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                  {col.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 8: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add reusable UI primitives — Button, Input, Modal, Pagination, Toast, Skeleton, Table"
```

---

## Phase 3: S3 Upload Utility

### Task 10: Create S3 Upload Module

**Files:**
- Create: `src/lib/s3.ts`
- Create: `src/lib/s3.test.ts`

- [ ] **Step 1: Install AWS SDK**

```bash
npm install @aws-sdk/client-s3
```

- [ ] **Step 2: Write failing tests for S3 utility**

Create `src/lib/s3.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { generateS3Key, getCloudFrontUrl } from './s3';

describe('generateS3Key', () => {
  it('generates a key with the correct extension for jpeg', () => {
    const key = generateS3Key('image/jpeg');
    expect(key).toMatch(/^listings\/[a-f0-9-]+\.jpg$/);
  });

  it('generates a key with the correct extension for png', () => {
    const key = generateS3Key('image/png');
    expect(key).toMatch(/^listings\/[a-f0-9-]+\.png$/);
  });

  it('generates a key with the correct extension for webp', () => {
    const key = generateS3Key('image/webp');
    expect(key).toMatch(/^listings\/[a-f0-9-]+\.webp$/);
  });

  it('generates unique keys', () => {
    const key1 = generateS3Key('image/jpeg');
    const key2 = generateS3Key('image/jpeg');
    expect(key1).not.toBe(key2);
  });
});

describe('getCloudFrontUrl', () => {
  it('constructs a CloudFront URL from a key', () => {
    const url = getCloudFrontUrl('listings/abc.jpg');
    expect(url).toContain('listings/abc.jpg');
    expect(url).toMatch(/^https:\/\//);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
npm run test -- src/lib/s3.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 4: Implement S3 utility**

Create `src/lib/s3.ts`:

```typescript
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET!;
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN || '';

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export function generateS3Key(mimeType: string): string {
  const ext = MIME_TO_EXT[mimeType] || 'jpg';
  return `listings/${randomUUID()}.${ext}`;
}

export function getCloudFrontUrl(key: string): string {
  if (CLOUDFRONT_DOMAIN) {
    return `https://${CLOUDFRONT_DOMAIN}/${key}`;
  }
  return `https://${BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;
}

export async function uploadToS3(buffer: Buffer, key: string, contentType: string): Promise<string> {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );
  return getCloudFrontUrl(key);
}

export async function deleteFromS3(url: string): Promise<void> {
  const key = extractKeyFromUrl(url);
  if (!key) return;
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );
}

function extractKeyFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname.startsWith('/') ? urlObj.pathname.slice(1) : urlObj.pathname;
    return path || null;
  } catch {
    return null;
  }
}
```

- [ ] **Step 5: Run tests**

```bash
npm run test -- src/lib/s3.test.ts
```

Expected: All tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/s3.ts src/lib/s3.test.ts
git commit -m "feat: add S3 upload/delete utilities with CloudFront URL support"
```

---

### Task 11: Create Slug Generation Utility

**Files:**
- Create: `src/lib/slug.ts`
- Create: `src/lib/slug.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/lib/slug.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { generateSlug } from './slug';

describe('generateSlug', () => {
  it('converts name to lowercase slug', () => {
    expect(generateSlug('Zen Thai Spa')).toBe('zen-thai-spa');
  });

  it('removes special characters', () => {
    expect(generateSlug("Spa & Wellness (Best!!)")).toBe('spa-wellness-best');
  });

  it('collapses multiple hyphens', () => {
    expect(generateSlug('Spa   ---  Wellness')).toBe('spa-wellness');
  });

  it('trims leading and trailing hyphens', () => {
    expect(generateSlug('  --Spa-- ')).toBe('spa');
  });

  it('handles Filipino characters', () => {
    expect(generateSlug('Hilot ni Ñaña')).toBe('hilot-ni-nana');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test -- src/lib/slug.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement slug generation**

Create `src/lib/slug.ts`:

```typescript
export function generateSlug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/[\s-]+/g, '-') // Replace spaces/hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Trim hyphens
}
```

- [ ] **Step 4: Run tests**

```bash
npm run test -- src/lib/slug.test.ts
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/slug.ts src/lib/slug.test.ts
git commit -m "feat: add slug generation utility"
```

---

## Phase 4: Admin Panel — API Routes

### Task 12: Create Admin Image Upload API

**Files:**
- Create: `src/app/api/admin/upload/route.ts`
- Create: `src/lib/auth-guard.ts`

- [ ] **Step 1: Create auth guard helper**

Create `src/lib/auth-guard.ts`:

```typescript
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from './auth';

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), session: null };
  }
  return { error: null, session };
}
```

- [ ] **Step 2: Create upload API route**

Create `src/app/api/admin/upload/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-guard';
import { generateS3Key, uploadToS3 } from '@/lib/s3';
import { MAX_IMAGE_SIZE_BYTES, ACCEPTED_IMAGE_TYPES } from '@/lib/constants';

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Only JPEG, PNG, and WebP are accepted' },
      { status: 415 }
    );
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return NextResponse.json(
      { error: 'File exceeds 5MB limit' },
      { status: 413 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = generateS3Key(file.type);
  const url = await uploadToS3(buffer, key, file.type);

  return NextResponse.json({ data: { url } });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/auth-guard.ts src/app/api/admin/upload/route.ts
git commit -m "feat: add admin image upload API with S3 integration"
```

---

### Task 13: Create Admin Listings CRUD API

**Files:**
- Create: `src/app/api/admin/listings/route.ts`
- Create: `src/app/api/admin/listings/[id]/route.ts`

- [ ] **Step 1: Create admin listings list + create route**

Create `src/app/api/admin/listings/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-guard';
import { prisma } from '@/lib/db';
import { ListingCreateSchema } from '@/lib/validators';
import { generateSlug } from '@/lib/slug';
import { ADMIN_PAGE_SIZE } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const search = searchParams.get('search') || '';

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { region: { contains: search, mode: 'insensitive' as const } },
          { city: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: { services: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * ADMIN_PAGE_SIZE,
      take: ADMIN_PAGE_SIZE,
    }),
    prisma.listing.count({ where }),
  ]);

  return NextResponse.json({
    data: listings,
    total,
    page,
    pageSize: ADMIN_PAGE_SIZE,
    totalPages: Math.ceil(total / ADMIN_PAGE_SIZE),
  });
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const result = ListingCreateSchema.safeParse(body);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    result.error.errors.forEach((err) => {
      const field = err.path.join('.');
      fieldErrors[field] = err.message;
    });
    return NextResponse.json({ error: fieldErrors }, { status: 400 });
  }

  const { services, ...listingData } = result.data;

  // Generate unique slug
  let slug = generateSlug(listingData.name);
  let suffix = 1;
  while (await prisma.listing.findUnique({ where: { slug } })) {
    suffix++;
    slug = `${generateSlug(listingData.name)}-${suffix}`;
  }

  const listing = await prisma.listing.create({
    data: {
      ...listingData,
      slug,
      services: {
        create: services.map((s) => ({
          name: s.name,
          price: s.price,
          duration: s.duration,
          discount: s.discount ?? null,
          discountType: s.discountType ?? null,
          description: s.description ?? null,
        })),
      },
    },
    include: { services: true },
  });

  return NextResponse.json({ data: listing, message: 'Listing created' }, { status: 201 });
}
```

- [ ] **Step 2: Create admin listing update + delete route**

Create `src/app/api/admin/listings/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-guard';
import { prisma } from '@/lib/db';
import { ListingUpdateSchema } from '@/lib/validators';
import { generateSlug } from '@/lib/slug';
import { deleteFromS3 } from '@/lib/s3';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const existing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: { services: true },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const body = await request.json();
  const result = ListingUpdateSchema.safeParse(body);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    result.error.errors.forEach((err) => {
      const field = err.path.join('.');
      fieldErrors[field] = err.message;
    });
    return NextResponse.json({ error: fieldErrors }, { status: 400 });
  }

  const { services, ...listingData } = result.data;

  // Handle slug update if name changed
  let slug = existing.slug;
  if (listingData.name && listingData.name !== existing.name) {
    slug = generateSlug(listingData.name);
    let suffix = 1;
    while (true) {
      const found = await prisma.listing.findUnique({ where: { slug } });
      if (!found || found.id === existing.id) break;
      suffix++;
      slug = `${generateSlug(listingData.name!)}-${suffix}`;
    }
  }

  // Clean up removed images from S3
  if (listingData.images) {
    const removedImages = existing.images.filter((img) => !listingData.images!.includes(img));
    await Promise.all(removedImages.map(deleteFromS3));
  }

  const listing = await prisma.$transaction(async (tx) => {
    // Delete existing services if new ones provided
    if (services) {
      await tx.service.deleteMany({ where: { listingId: existing.id } });
    }

    return tx.listing.update({
      where: { id: params.id },
      data: {
        ...listingData,
        slug,
        ...(services && {
          services: {
            create: services.map((s) => ({
              name: s.name,
              price: s.price,
              duration: s.duration,
              discount: s.discount ?? null,
              discountType: s.discountType ?? null,
              description: s.description ?? null,
            })),
          },
        }),
      },
      include: { services: true },
    });
  });

  return NextResponse.json({ data: listing, message: 'Listing updated' });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const existing = await prisma.listing.findUnique({
    where: { id: params.id },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Delete images from S3
  await Promise.all(existing.images.map(deleteFromS3));

  await prisma.listing.delete({ where: { id: params.id } });

  return NextResponse.json({ message: 'Listing deleted' });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/listings/
git commit -m "feat: add admin listings CRUD API routes"
```

---

### Task 14: Create Admin Change Password API

**Files:**
- Create: `src/app/api/admin/change-password/route.ts`

- [ ] **Step 1: Create change password route**

Create `src/app/api/admin/change-password/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { requireAdmin } from '@/lib/auth-guard';
import { prisma } from '@/lib/db';
import { ChangePasswordSchema } from '@/lib/validators';

export async function PUT(request: NextRequest) {
  const { error, session } = await requireAdmin();
  if (error || !session) return error;

  const body = await request.json();
  const result = ChangePasswordSchema.safeParse(body);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    result.error.errors.forEach((err) => {
      const field = err.path.join('.');
      fieldErrors[field] = err.message;
    });
    return NextResponse.json({ error: fieldErrors }, { status: 400 });
  }

  const user = await prisma.adminUser.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const passwordMatch = await bcrypt.compare(result.data.currentPassword, user.passwordHash);
  if (!passwordMatch) {
    return NextResponse.json(
      { error: { currentPassword: 'Current password is incorrect' } },
      { status: 400 }
    );
  }

  const newHash = await bcrypt.hash(result.data.newPassword, 10);
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { passwordHash: newHash },
  });

  return NextResponse.json({ message: 'Password changed successfully' });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/admin/change-password/route.ts
git commit -m "feat: add admin change password API route"
```

---

## Phase 5: Public API Routes

### Task 15: Create Public Listings API

**Files:**
- Create: `src/app/api/listings/route.ts`
- Create: `src/app/api/listings/[slug]/route.ts`

- [ ] **Step 1: Create public listings list route**

Create `src/app/api/listings/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { CUSTOMER_PAGE_SIZE } from '@/lib/constants';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const region = searchParams.get('region') || undefined;
  const city = searchParams.get('city') || undefined;
  const category = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;

  const where: Prisma.ListingWhereInput = {
    isActive: true,
    ...(region && { region }),
    ...(city && { city }),
    ...(category && { category }),
    ...(search && { name: { contains: search, mode: 'insensitive' } }),
  };

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: { services: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * CUSTOMER_PAGE_SIZE,
      take: CUSTOMER_PAGE_SIZE,
    }),
    prisma.listing.count({ where }),
  ]);

  return NextResponse.json({
    data: listings,
    total,
    page,
    pageSize: CUSTOMER_PAGE_SIZE,
    totalPages: Math.ceil(total / CUSTOMER_PAGE_SIZE),
  });
}
```

- [ ] **Step 2: Create public single listing route**

Create `src/app/api/listings/[slug]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const listing = await prisma.listing.findUnique({
    where: { slug: params.slug, isActive: true },
    include: { services: true },
  });

  if (!listing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ data: listing });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/listings/
git commit -m "feat: add public listings API routes with filtering and pagination"
```

---

## Phase 6: Admin Panel — UI

### Task 16: Create Admin Layout and Login Page

**Files:**
- Create: `src/app/(admin)/layout.tsx`
- Create: `src/app/(admin)/login/page.tsx`
- Create: `src/components/admin/admin-nav.tsx`

- [ ] **Step 1: Create admin navigation component**

Create `src/components/admin/admin-nav.tsx`:

```tsx
'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function AdminNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/dashboard" className="text-lg font-semibold text-slate-900">
            MassagePH Admin
          </Link>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              Account
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                <Link
                  href="/change-password"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Change Password
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Create admin layout (all routes inside require auth)**

Create `src/app/(admin)/layout.tsx`:

```tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { AdminNav } from '@/components/admin/admin-nav';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
```

- [ ] **Step 3: Create login page (outside admin group — no auth required)**

Create `src/app/login/page.tsx`:

```tsx
'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid email or password');
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center text-2xl font-semibold text-slate-900">MassagePH Admin</h1>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <Button type="submit" loading={loading} className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/\(admin\)/ src/components/admin/admin-nav.tsx
git commit -m "feat: add admin layout, login page, and navigation"
```

---

### Task 17: Create Admin Dashboard Page

**Files:**
- Create: `src/app/(admin)/dashboard/page.tsx`

- [ ] **Step 1: Create dashboard page**

Create `src/app/(admin)/dashboard/page.tsx`:

```tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ADMIN_PAGE_SIZE } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { AdminListingsTable } from './admin-listings-table';

interface DashboardPageProps {
  searchParams: { page?: string; search?: string };
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const page = Math.max(1, parseInt(searchParams.page || '1', 10));
  const search = searchParams.search || '';

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { region: { contains: search, mode: 'insensitive' as const } },
          { city: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: { services: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * ADMIN_PAGE_SIZE,
      take: ADMIN_PAGE_SIZE,
    }),
    prisma.listing.count({ where }),
  ]);

  const totalPages = Math.ceil(total / ADMIN_PAGE_SIZE);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">All Listings</h1>
        <Link href="/listings/new">
          <Button>+ Add New Listing</Button>
        </Link>
      </div>

      <form method="GET" action="/dashboard" className="mb-4">
        <input
          name="search"
          type="text"
          placeholder="Search by name, region, or city..."
          defaultValue={search}
          className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>

      {listings.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">
            {search ? `No listings match "${search}"` : 'No listings yet. Create your first listing.'}
          </p>
          {!search && (
            <Link href="/listings/new" className="mt-4 inline-block">
              <Button>Create Listing</Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          <AdminListingsTable listings={listings} />
          <div className="mt-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath="/dashboard"
              searchParams={search ? { search } : {}}
            />
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create admin listings table client component**

Create `src/app/(admin)/dashboard/admin-listings-table.tsx`:

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import type { ListingWithServices } from '@/types';

interface AdminListingsTableProps {
  listings: ListingWithServices[];
}

export function AdminListingsTable({ listings }: AdminListingsTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);

    const res = await fetch(`/api/admin/listings/${deleteId}`, { method: 'DELETE' });

    setDeleting(false);
    setDeleteId(null);

    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">City</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Active</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {listings.map((listing) => (
              <tr key={listing.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900">{listing.name}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">{listing.city}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">{listing.category}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${listing.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {listing.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <Link href={`/listings/${listing.id}/edit`}>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </Link>
                    <Button variant="danger" size="sm" onClick={() => setDeleteId(listing.id)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Listing">
        <p className="mb-4 text-sm text-gray-600">
          Are you sure you want to delete this listing? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/\(admin\)/dashboard/
git commit -m "feat: add admin dashboard with listings table, search, and delete"
```

---

### Task 18: Create Admin Listing Form (Create & Edit)

**Files:**
- Create: `src/app/(admin)/listings/new/page.tsx`
- Create: `src/app/(admin)/listings/[id]/edit/page.tsx`
- Create: `src/components/admin/listing-form.tsx`
- Create: `src/components/admin/service-rows.tsx`
- Create: `src/components/admin/image-uploader.tsx`

This is a large task. Each component is a separate step.

- [ ] **Step 1: Create ServiceRows component**

Create `src/components/admin/service-rows.tsx`:

```tsx
'use client';

import { Button } from '@/components/ui/button';
import type { ServiceInput } from '@/lib/validators';

interface ServiceRowsProps {
  services: ServiceInput[];
  onChange: (services: ServiceInput[]) => void;
  errors?: Record<string, string>;
}

export function ServiceRows({ services, onChange, errors }: ServiceRowsProps) {
  function addService() {
    onChange([...services, { name: '', price: 0, duration: 60 }]);
  }

  function removeService(index: number) {
    onChange(services.filter((_, i) => i !== index));
  }

  function updateService(index: number, field: keyof ServiceInput, value: string | number | null) {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };

    // Clear discount fields if type is set to none
    if (field === 'discountType' && !value) {
      updated[index].discount = null;
      updated[index].discountType = null;
    }

    onChange(updated);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-700">Services & Pricing</h3>
        <Button type="button" variant="secondary" size="sm" onClick={addService}>
          + Add Service
        </Button>
      </div>
      {services.length === 0 && (
        <p className="text-sm text-red-600">At least one service is required</p>
      )}
      {services.map((service, index) => (
        <div key={index} className="grid grid-cols-12 gap-2 rounded-lg border border-gray-200 p-3">
          <div className="col-span-12 sm:col-span-3">
            <label className="block text-xs text-gray-500">Service Name</label>
            <input
              type="text"
              value={service.name}
              onChange={(e) => updateService(index, 'name', e.target.value)}
              className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
              required
            />
          </div>
          <div className="col-span-4 sm:col-span-2">
            <label className="block text-xs text-gray-500">Price (₱)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={service.price}
              onChange={(e) => updateService(index, 'price', parseFloat(e.target.value) || 0)}
              className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
              required
            />
          </div>
          <div className="col-span-4 sm:col-span-2">
            <label className="block text-xs text-gray-500">Duration (min)</label>
            <input
              type="number"
              min="1"
              value={service.duration}
              onChange={(e) => updateService(index, 'duration', parseInt(e.target.value) || 0)}
              className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
              required
            />
          </div>
          <div className="col-span-4 sm:col-span-2">
            <label className="block text-xs text-gray-500">Discount Type</label>
            <select
              value={service.discountType || ''}
              onChange={(e) => updateService(index, 'discountType', e.target.value || null)}
              className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            >
              <option value="">None</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed (₱)</option>
            </select>
          </div>
          <div className="col-span-4 sm:col-span-2">
            <label className="block text-xs text-gray-500">Discount Amount</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={service.discount ?? ''}
              onChange={(e) => updateService(index, 'discount', parseFloat(e.target.value) || null)}
              disabled={!service.discountType}
              className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm disabled:bg-gray-100"
            />
          </div>
          <div className="col-span-10 sm:col-span-11">
            <label className="block text-xs text-gray-500">Description (optional)</label>
            <input
              type="text"
              value={service.description ?? ''}
              onChange={(e) => updateService(index, 'description', e.target.value || null)}
              placeholder="Brief description of this service"
              className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            />
          </div>
          <div className="col-span-2 flex items-end justify-end sm:col-span-1">
            <Button type="button" variant="danger" size="sm" onClick={() => removeService(index)}>
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create ImageUploader component**

Create `src/components/admin/image-uploader.tsx`:

```tsx
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { MAX_IMAGE_SIZE_BYTES, ACCEPTED_IMAGE_TYPES } from '@/lib/constants';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    setError('');
    setUploading(true);

    const newImages = [...images];

    for (const file of Array.from(files)) {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setError('Only JPEG, PNG, and WebP files are accepted');
        continue;
      }
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        setError('File exceeds 5MB limit');
        continue;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        const json = await res.json();
        if (res.ok && json.data?.url) {
          newImages.push(json.data.url);
        } else {
          setError(json.error || 'Upload failed');
        }
      } catch {
        setError('Something went wrong. Please try again.');
      }
    }

    onChange(newImages);
    setUploading(false);
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      handleFiles(e.dataTransfer.files);
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-700">Images</h3>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center hover:border-blue-400"
      >
        <p className="text-sm text-gray-500">
          {uploading ? 'Uploading...' : 'Drag & drop images here, or click to select'}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {images.length === 0 && <p className="text-sm text-red-600">At least one image is required</p>}

      <div className="grid grid-cols-4 gap-3">
        {images.map((url, index) => (
          <div key={url} className="relative group">
            <img
              src={url}
              alt={`Listing image ${index + 1}`}
              className="h-24 w-full rounded-lg border border-gray-200 object-cover"
            />
            {index === 0 && (
              <span className="absolute top-1 left-1 rounded bg-blue-600 px-1.5 py-0.5 text-[10px] text-white">
                Primary
              </span>
            )}
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 rounded-full bg-red-600 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Remove image ${index + 1}`}
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create main ListingForm component**

Create `src/components/admin/listing-form.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ServiceRows } from './service-rows';
import { ImageUploader } from './image-uploader';
import { MapPinPicker } from './map-pin-picker';
import { PREDEFINED_CATEGORIES, PREDEFINED_TAGS } from '@/lib/constants';
import regionsData from '@/lib/data/regions-cities.json';
import type { ListingWithServices } from '@/types';
import type { ServiceInput } from '@/lib/validators';

interface ListingFormProps {
  listing?: ListingWithServices;
}

export function ListingForm({ listing }: ListingFormProps) {
  const router = useRouter();
  const isEdit = !!listing;

  const [name, setName] = useState(listing?.name || '');
  const [category, setCategory] = useState(listing?.category || '');
  const [region, setRegion] = useState(listing?.region || '');
  const [city, setCity] = useState(listing?.city || '');
  const [address, setAddress] = useState(listing?.address || '');
  const [description, setDescription] = useState(listing?.description || '');
  const [isActive, setIsActive] = useState(listing?.isActive ?? true);
  const [latitude, setLatitude] = useState<number | null>(listing?.latitude ?? null);
  const [longitude, setLongitude] = useState<number | null>(listing?.longitude ?? null);
  const [tags, setTags] = useState<string[]>(listing?.tags || []);
  const [images, setImages] = useState<string[]>(listing?.images || []);
  const [services, setServices] = useState<ServiceInput[]>(
    listing?.services.map((s) => ({
      name: s.name,
      price: Number(s.price),
      duration: s.duration,
      discount: s.discount ? Number(s.discount) : null,
      discountType: s.discountType as 'percentage' | 'fixed' | null,
      description: s.description,
    })) || [{ name: '', price: 0, duration: 60 }]
  );

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cities = regionsData.regions.find((r) => r.code === region)?.cities || [];

  function toggleTag(tag: string) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const body = {
      name,
      category,
      region,
      city,
      address,
      description,
      isActive,
      latitude,
      longitude,
      tags,
      images,
      services,
    };

    const url = isEdit ? `/api/admin/listings/${listing!.id}` : '/api/admin/listings';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      if (typeof json.error === 'object') {
        setErrors(json.error);
      } else {
        setErrors({ _form: json.error || 'Something went wrong' });
      }
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
      {errors._form && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {errors._form}
        </p>
      )}

      {/* Basic Info */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-slate-900">Basic Info</h2>
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} required />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select category</option>
            {PREDEFINED_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Region</label>
            <select
              value={region}
              onChange={(e) => { setRegion(e.target.value); setCity(''); }}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select region</option>
              {regionsData.regions.map((r) => (
                <option key={r.code} value={r.code}>{r.code} — {r.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!region}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              required
            >
              <option value="">Select city</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <Input label="Address" value={address} onChange={(e) => setAddress(e.target.value)} error={errors.address} required />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
        </div>

        <div className="flex items-center gap-2">
          <input
            id="isActive"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="text-sm text-slate-700">Active (visible to customers)</label>
        </div>
      </div>

      {/* Location (Map Pin Picker) */}
      <MapPinPicker
        latitude={latitude}
        longitude={longitude}
        onChange={(lat, lng) => { setLatitude(lat); setLongitude(lng); }}
      />

      {/* Tags */}
      <div className="space-y-2">
        <h2 className="text-lg font-medium text-slate-900">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {PREDEFINED_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                tags.includes(tag)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Images */}
      <ImageUploader images={images} onChange={setImages} />

      {/* Services */}
      <ServiceRows services={services} onChange={setServices} errors={errors} />

      {/* Submit */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <Button type="submit" loading={loading}>
          {isEdit ? 'Update Listing' : 'Create Listing'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push('/dashboard')}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
```

- [ ] **Step 4: Create new listing page**

Create `src/app/(admin)/listings/new/page.tsx`:

```tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { ListingForm } from '@/components/admin/listing-form';

export default async function NewListingPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Add New Listing</h1>
      <ListingForm />
    </div>
  );
}
```

- [ ] **Step 5: Create edit listing page**

Create `src/app/(admin)/listings/[id]/edit/page.tsx`:

```tsx
import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ListingForm } from '@/components/admin/listing-form';

interface EditListingPageProps {
  params: { id: string };
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: { services: true },
  });

  if (!listing) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Edit Listing</h1>
      <ListingForm listing={listing} />
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/admin/ src/app/\(admin\)/listings/
git commit -m "feat: add admin listing form with services, images, and tag management"
```

---

### Task 19: Create Admin MapPinPicker Component

**Files:**
- Create: `src/components/admin/map-pin-picker.tsx`

- [ ] **Step 1: Install @googlemaps/js-api-loader**

```bash
npm install @googlemaps/js-api-loader
```

- [ ] **Step 2: Create MapPinPicker component**

Create `src/components/admin/map-pin-picker.tsx`:

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface MapPinPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
}

export function MapPinPicker({ latitude, longitude, onChange }: MapPinPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Default center: Manila, Philippines
  const defaultCenter = { lat: latitude ?? 14.5995, lng: longitude ?? 120.9842 };
  const defaultZoom = latitude ? 15 : 6;

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
    });

    loader.importLibrary('maps').then(() => {
      if (!mapRef.current) return;

      const map = new google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: defaultZoom,
      });

      if (latitude && longitude) {
        markerRef.current = new google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map,
          draggable: true,
        });

        markerRef.current.addListener('dragend', () => {
          const pos = markerRef.current?.getPosition();
          if (pos) onChange(pos.lat(), pos.lng());
        });
      }

      map.addListener('click', (e: google.maps.MapMouseEvent) => {
        const latLng = e.latLng;
        if (!latLng) return;

        if (markerRef.current) {
          markerRef.current.setPosition(latLng);
        } else {
          markerRef.current = new google.maps.Marker({
            position: latLng,
            map,
            draggable: true,
          });

          markerRef.current.addListener('dragend', () => {
            const pos = markerRef.current?.getPosition();
            if (pos) onChange(pos.lat(), pos.lng());
          });
        }

        onChange(latLng.lat(), latLng.lng());
      });

      setMapLoaded(true);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-medium text-slate-900">Location</h2>
      <p className="text-sm text-gray-500">Click on the map to place a pin, or drag the pin to adjust. Coordinates are optional.</p>
      <div ref={mapRef} className="h-72 w-full rounded-lg border border-gray-200" />
      {latitude !== null && longitude !== null && (
        <div className="flex gap-4 text-sm text-gray-600">
          <span>Lat: {latitude.toFixed(6)}</span>
          <span>Lng: {longitude.toFixed(6)}</span>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/map-pin-picker.tsx
git commit -m "feat: add interactive map pin picker for admin listing form"
```

---

### Task 20: Create Rate Limiting Middleware

**Files:**
- Create: `src/lib/rate-limit.ts`
- Create: `src/lib/rate-limit.test.ts`
- Modify: API route files to use rate limiter

- [ ] **Step 1: Write failing test for rate limiter**

Create `src/lib/rate-limit.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { createRateLimiter } from './rate-limit';

describe('createRateLimiter', () => {
  it('allows requests under the limit', () => {
    const limiter = createRateLimiter({ maxRequests: 3, windowMs: 60000 });
    expect(limiter.check('ip1')).toEqual({ allowed: true, remaining: 2 });
    expect(limiter.check('ip1')).toEqual({ allowed: true, remaining: 1 });
    expect(limiter.check('ip1')).toEqual({ allowed: true, remaining: 0 });
  });

  it('blocks requests over the limit', () => {
    const limiter = createRateLimiter({ maxRequests: 2, windowMs: 60000 });
    limiter.check('ip1');
    limiter.check('ip1');
    const result = limiter.check('ip1');
    expect(result.allowed).toBe(false);
  });

  it('tracks different keys independently', () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 60000 });
    expect(limiter.check('ip1').allowed).toBe(true);
    expect(limiter.check('ip2').allowed).toBe(true);
    expect(limiter.check('ip1').allowed).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test -- src/lib/rate-limit.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement rate limiter**

Create `src/lib/rate-limit.ts`:

```typescript
interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs?: number;
}

export function createRateLimiter({ maxRequests, windowMs }: RateLimitOptions) {
  const store = new Map<string, RateLimitEntry>();

  function check(key: string): RateLimitResult {
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || now > entry.resetAt) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, remaining: maxRequests - 1 };
    }

    if (entry.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterMs: entry.resetAt - now,
      };
    }

    entry.count++;
    return { allowed: true, remaining: maxRequests - entry.count };
  }

  // Periodic cleanup of expired entries
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now > entry.resetAt) store.delete(key);
    }
  }, windowMs).unref();

  return { check };
}
```

- [ ] **Step 4: Run tests**

```bash
npm run test -- src/lib/rate-limit.test.ts
```

Expected: All tests PASS.

- [ ] **Step 5: Create rate limit helper for API routes**

Create `src/lib/with-rate-limit.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createRateLimiter } from './rate-limit';
import { RATE_LIMIT_PUBLIC, RATE_LIMIT_ADMIN, RATE_LIMIT_UPLOAD } from './constants';

const publicLimiter = createRateLimiter({ maxRequests: RATE_LIMIT_PUBLIC, windowMs: 60000 });
const adminLimiter = createRateLimiter({ maxRequests: RATE_LIMIT_ADMIN, windowMs: 60000 });
const uploadLimiter = createRateLimiter({ maxRequests: RATE_LIMIT_UPLOAD, windowMs: 60000 });

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
}

export function checkPublicRateLimit(request: NextRequest): NextResponse | null {
  const result = publicLimiter.check(getClientIp(request));
  if (!result.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((result.retryAfterMs || 60000) / 1000)) },
      }
    );
  }
  return null;
}

export function checkAdminRateLimit(request: NextRequest): NextResponse | null {
  const result = adminLimiter.check(getClientIp(request));
  if (!result.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((result.retryAfterMs || 60000) / 1000)) },
      }
    );
  }
  return null;
}

export function checkUploadRateLimit(request: NextRequest): NextResponse | null {
  const result = uploadLimiter.check(getClientIp(request));
  if (!result.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((result.retryAfterMs || 60000) / 1000)) },
      }
    );
  }
  return null;
}
```

- [ ] **Step 6: Add rate limiting to API routes**

Add to the top of each API route handler:

- **Public routes** (`/api/listings/route.ts`, `/api/listings/[slug]/route.ts`): Add `import { checkPublicRateLimit } from '@/lib/with-rate-limit';` and at the start of GET: `const rateLimited = checkPublicRateLimit(request); if (rateLimited) return rateLimited;`
- **Admin routes** (`/api/admin/listings/route.ts`, `/api/admin/listings/[id]/route.ts`, `/api/admin/change-password/route.ts`): Use `checkAdminRateLimit`
- **Upload route** (`/api/admin/upload/route.ts`): Use `checkUploadRateLimit`

- [ ] **Step 7: Commit**

```bash
git add src/lib/rate-limit.ts src/lib/rate-limit.test.ts src/lib/with-rate-limit.ts
git commit -m "feat: add in-memory rate limiting middleware for API routes"
```

---

### Task 21: Create Admin Change Password Page

**Files:**
- Create: `src/app/(admin)/change-password/page.tsx`
- Create: `src/components/admin/change-password-form.tsx`

- [ ] **Step 1: Create ChangePasswordForm component**

Create `src/components/admin/change-password-form.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ChangePasswordForm() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setLoading(true);

    const res = await fetch('/api/admin/change-password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      if (typeof json.error === 'object') {
        setErrors(json.error);
      } else {
        setErrors({ _form: json.error || 'Something went wrong' });
      }
      return;
    }

    setSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      {errors._form && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">{errors._form}</p>
      )}
      {success && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600" role="status">
          Password changed successfully.
        </p>
      )}
      <Input
        label="Current Password"
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        error={errors.currentPassword}
        required
        autoComplete="current-password"
      />
      <Input
        label="New Password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        error={errors.newPassword}
        required
        autoComplete="new-password"
      />
      <Input
        label="Confirm New Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={errors.confirmPassword}
        required
        autoComplete="new-password"
      />
      <div className="flex gap-3">
        <Button type="submit" loading={loading}>Change Password</Button>
        <Button type="button" variant="secondary" onClick={() => router.push('/dashboard')}>Cancel</Button>
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Create change password page**

Create `src/app/(admin)/change-password/page.tsx`:

```tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { ChangePasswordForm } from '@/components/admin/change-password-form';

export default async function ChangePasswordPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Change Password</h1>
      <ChangePasswordForm />
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/\(admin\)/change-password/ src/components/admin/change-password-form.tsx
git commit -m "feat: add admin change password page and form"
```

---

## Phase 7: Customer-Facing UI

### Task 22: Create Customer Layout and Header/Footer

**Files:**
- Create: `src/app/(customer)/layout.tsx`
- Create: `src/components/customer/header.tsx`
- Create: `src/components/customer/footer.tsx`

- [ ] **Step 1: Create Header component**

Create `src/components/customer/header.tsx`:

```tsx
import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-slate-900">
          MassagePH
        </Link>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Create Footer component**

Create `src/components/customer/footer.tsx`:

```tsx
export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
        &copy; {new Date().getFullYear()} MassagePH. All rights reserved.
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Create customer layout**

Create `src/app/(customer)/layout.tsx`:

```tsx
import { Header } from '@/components/customer/header';
import { Footer } from '@/components/customer/footer';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/\(customer\)/layout.tsx src/components/customer/header.tsx src/components/customer/footer.tsx
git commit -m "feat: add customer layout with header and footer"
```

---

### Task 23: Create Customer Browse Page (Homepage)

**Files:**
- Create: `src/app/(customer)/page.tsx`
- Create: `src/components/customer/listing-card.tsx`
- Create: `src/components/customer/filter-drawer.tsx`
- Create: `src/components/customer/search-bar.tsx`
- Create: `src/components/customer/empty-state.tsx`

- [ ] **Step 1: Create ListingCard component**

Create `src/components/customer/listing-card.tsx`:

```tsx
import Link from 'next/link';
import type { ListingWithServices } from '@/types';

interface ListingCardProps {
  listing: ListingWithServices;
}

export function ListingCard({ listing }: ListingCardProps) {
  const startingPrice = listing.services.length > 0
    ? Math.min(...listing.services.map((s) => Number(s.price)))
    : 0;

  return (
    <Link href={`/${listing.slug}`} className="group block">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={listing.images[0] || 'https://placehold.co/800x600/e2e8f0/64748b?text=No+Image'}
            alt={listing.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-slate-900">{listing.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{listing.category}</p>
          <p className="text-sm text-gray-500">{listing.city}</p>
          {startingPrice > 0 && (
            <p className="mt-2 text-sm font-medium text-blue-600">
              From ₱{startingPrice.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Create SearchBar component**

Create `src/components/customer/search-bar.tsx`:

```tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    params.delete('page');
    router.push(`/?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name..."
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Search listings"
      />
    </form>
  );
}
```

- [ ] **Step 3: Create FilterDrawer component**

Create `src/components/customer/filter-drawer.tsx`:

```tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PREDEFINED_CATEGORIES } from '@/lib/constants';
import regionsData from '@/lib/data/regions-cities.json';

export function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRegion = searchParams.get('region') || '';
  const currentCity = searchParams.get('city') || '';
  const currentCategory = searchParams.get('category') || '';

  const cities = regionsData.regions.find((r) => r.code === currentRegion)?.cities || [];

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key === 'region') {
      params.delete('city');
    }
    params.delete('page');
    router.push(`/?${params.toString()}`);
  }

  function clearFilters() {
    router.push('/');
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">Region</label>
        <select
          value={currentRegion}
          onChange={(e) => updateFilter('region', e.target.value)}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All Regions</option>
          {regionsData.regions.map((r) => (
            <option key={r.code} value={r.code}>{r.code} — {r.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">City</label>
        <select
          value={currentCity}
          onChange={(e) => updateFilter('city', e.target.value)}
          disabled={!currentRegion}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
        >
          <option value="">All Cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">Category</label>
        <select
          value={currentCategory}
          onChange={(e) => updateFilter('category', e.target.value)}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All Categories</option>
          {PREDEFINED_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {(currentRegion || currentCity || currentCategory) && (
        <Button variant="secondary" size="sm" onClick={clearFilters} className="w-full">
          Clear Filters
        </Button>
      )}
    </div>
  );
}

export function FilterDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-40 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg md:hidden"
      >
        Filters
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={() => setOpen(false)} className="text-gray-500">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FilterSidebar />
            <div className="mt-6">
              <Button onClick={() => setOpen(false)} className="w-full">Show Results</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 4: Create EmptyState component**

Create `src/components/customer/empty-state.tsx`:

```tsx
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  search?: string;
  onClear?: () => void;
}

export function EmptyState({ search, onClear }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg className="mb-4 h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <h3 className="text-lg font-medium text-gray-900">No listings found</h3>
      <p className="mt-1 text-sm text-gray-500">
        {search
          ? `No listings match "${search}". Try broadening your search.`
          : 'Try adjusting your filters to find what you are looking for.'}
      </p>
      {onClear && (
        <Button variant="secondary" size="sm" onClick={onClear} className="mt-4">
          Clear Filters
        </Button>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Create browse page (homepage)**

Create `src/app/(customer)/page.tsx`:

```tsx
import { Suspense } from 'react';
import { prisma } from '@/lib/db';
import { CUSTOMER_PAGE_SIZE } from '@/lib/constants';
import { ListingCard } from '@/components/customer/listing-card';
import { FilterSidebar, FilterDrawer } from '@/components/customer/filter-drawer';
import { SearchBar } from '@/components/customer/search-bar';
import { EmptyState } from '@/components/customer/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Prisma } from '@prisma/client';
import type { Metadata } from 'next';

interface HomePageProps {
  searchParams: { region?: string; city?: string; category?: string; search?: string; page?: string };
}

export function generateMetadata({ searchParams }: HomePageProps): Metadata {
  const parts = ['MassagePH'];
  if (searchParams.category) parts.push(searchParams.category);
  if (searchParams.city) parts.push(`in ${searchParams.city}`);
  if (searchParams.region) parts.push(`(${searchParams.region})`);

  return {
    title: parts.join(' — '),
    description: 'Find massage shops near you in the Philippines. Browse by location, category, and price.',
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const page = Math.max(1, parseInt(searchParams.page || '1', 10));
  const { region, city, category, search } = searchParams;

  const where: Prisma.ListingWhereInput = {
    isActive: true,
    ...(region && { region }),
    ...(city && { city }),
    ...(category && { category }),
    ...(search && { name: { contains: search, mode: 'insensitive' } }),
  };

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: { services: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * CUSTOMER_PAGE_SIZE,
      take: CUSTOMER_PAGE_SIZE,
    }),
    prisma.listing.count({ where }),
  ]);

  const totalPages = Math.ceil(total / CUSTOMER_PAGE_SIZE);
  const hasFilters = !!(region || city || category || search);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header with search */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Massage Shops</h1>
        <Suspense>
          <SearchBar />
        </Suspense>
      </div>

      <div className="flex gap-8">
        {/* Sidebar — desktop only */}
        <aside className="hidden w-60 shrink-0 md:block">
          <Suspense>
            <FilterSidebar />
          </Suspense>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Result count */}
          <p className="mb-4 text-sm text-gray-500">
            Showing {total} listing{total !== 1 ? 's' : ''}
            {region && ` in ${region}`}
            {city && `, ${city}`}
            {category && ` — ${category}`}
          </p>

          {listings.length === 0 ? (
            <EmptyState search={search} />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  basePath="/"
                  searchParams={Object.fromEntries(
                    Object.entries(searchParams).filter(([k, v]) => k !== 'page' && v)
                  ) as Record<string, string>}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <Suspense>
        <FilterDrawer />
      </Suspense>
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/app/\(customer\)/page.tsx src/components/customer/
git commit -m "feat: add customer browse page with filters, search, pagination, and empty state"
```

---

### Task 24: Create Customer Detail Page

**Files:**
- Create: `src/app/(customer)/[slug]/page.tsx`
- Create: `src/components/customer/image-gallery.tsx`
- Create: `src/components/customer/services-table.tsx`
- Create: `src/components/customer/copy-address.tsx`
- Create: `src/components/customer/map-embed.tsx`

- [ ] **Step 1: Create ImageGallery component**

Create `src/components/customer/image-gallery.tsx`:

```tsx
'use client';

import { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
  name: string;
}

export function ImageGallery({ images, name }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="aspect-[16/9] overflow-hidden rounded-lg">
        <img
          src={images[activeIndex]}
          alt={`${name} — image ${activeIndex + 1}`}
          className="h-full w-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((url, i) => (
            <button
              key={url}
              onClick={() => setActiveIndex(i)}
              className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                i === activeIndex ? 'border-blue-600' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img src={url} alt={`${name} thumbnail ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create ServicesTable component**

Create `src/components/customer/services-table.tsx`:

```tsx
import type { Service } from '@prisma/client';

interface ServicesTableProps {
  services: Service[];
}

function formatDiscount(service: Service): string {
  if (!service.discount || !service.discountType) return '—';
  if (service.discountType === 'percentage') return `${Number(service.discount)}% off`;
  if (service.discountType === 'fixed') return `₱${Number(service.discount).toLocaleString()} off`;
  return '—';
}

export function ServicesTable({ services }: ServicesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Service</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Price</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Duration</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Discount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {services.map((service) => (
            <tr key={service.id}>
              <td className="px-4 py-3 text-sm text-slate-900">
                <div>{service.name}</div>
                {service.description && (
                  <div className="text-xs text-gray-500">{service.description}</div>
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                ₱{Number(service.price).toLocaleString()}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">{service.duration} min</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">{formatDiscount(service)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 3: Create CopyAddress component**

Create `src/components/customer/copy-address.tsx`:

```tsx
'use client';

import { useState } from 'react';

interface CopyAddressProps {
  address: string;
}

export function CopyAddress({ address }: CopyAddressProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="ml-2 inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 transition-colors"
      aria-label="Copy address to clipboard"
    >
      {copied ? (
        <>
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}
```

- [ ] **Step 4: Create MapEmbed component**

Create `src/components/customer/map-embed.tsx`:

```tsx
'use client';

interface MapEmbedProps {
  latitude: number | null;
  longitude: number | null;
  address: string;
  name: string;
}

export function MapEmbed({ latitude, longitude, address, name }: MapEmbedProps) {
  if (!latitude || !longitude) {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    return (
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
      >
        View on Google Maps
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=15`;

  return (
    <div className="aspect-[16/9] overflow-hidden rounded-lg">
      <iframe
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map showing ${name} location`}
      />
    </div>
  );
}
```

- [ ] **Step 5: Create detail page**

Create `src/app/(customer)/[slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ImageGallery } from '@/components/customer/image-gallery';
import { ServicesTable } from '@/components/customer/services-table';
import { CopyAddress } from '@/components/customer/copy-address';
import { MapEmbed } from '@/components/customer/map-embed';
import type { Metadata } from 'next';

interface DetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const listing = await prisma.listing.findUnique({
    where: { slug: params.slug, isActive: true },
  });

  if (!listing) return { title: 'Not Found — MassagePH' };

  return {
    title: `${listing.name} — ${listing.category} in ${listing.city} | MassagePH`,
    description: listing.description.slice(0, 160),
    openGraph: {
      title: `${listing.name} — ${listing.category}`,
      description: listing.description.slice(0, 160),
      images: listing.images[0] ? [listing.images[0]] : [],
    },
  };
}

export default async function DetailPage({ params }: DetailPageProps) {
  const listing = await prisma.listing.findUnique({
    where: { slug: params.slug, isActive: true },
    include: { services: true },
  });

  if (!listing) notFound();

  const fullAddress = `${listing.address}, ${listing.city}, ${listing.region}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Back navigation */}
      <Link href="/" className="mb-4 inline-flex items-center text-sm text-blue-600 hover:underline">
        ← Back to listings
      </Link>

      {/* Image gallery */}
      <div className="mt-4">
        <ImageGallery images={listing.images} name={listing.name} />
      </div>

      {/* Shop info */}
      <div className="mt-6">
        <h1 className="text-3xl font-bold text-slate-900">{listing.name}</h1>
        <span className="mt-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
          {listing.category}
        </span>
        <div className="mt-3 flex items-center text-sm text-gray-600">
          <span>{fullAddress}</span>
          <CopyAddress address={fullAddress} />
        </div>
      </div>

      {/* Tags */}
      {listing.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {listing.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      <div className="mt-6">
        <h2 className="mb-2 text-lg font-semibold text-slate-900">Description</h2>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">{listing.description}</p>
      </div>

      {/* Services table */}
      <div className="mt-6">
        <h2 className="mb-2 text-lg font-semibold text-slate-900">Services & Pricing</h2>
        <ServicesTable services={listing.services} />
      </div>

      {/* Map */}
      <div className="mt-6">
        <h2 className="mb-2 text-lg font-semibold text-slate-900">Location</h2>
        <MapEmbed
          latitude={listing.latitude}
          longitude={listing.longitude}
          address={fullAddress}
          name={listing.name}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/app/\(customer\)/\[slug\]/ src/components/customer/
git commit -m "feat: add customer detail page with gallery, services, copy address, and map"
```

---

## Phase 8: Error Pages and Root Layout

### Task 25: Create Error Pages and Update Root Layout

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/app/not-found.tsx`
- Create: `src/app/error.tsx`

- [ ] **Step 1: Update root layout**

Update `src/app/layout.tsx` to include ToastProvider and metadata:

```tsx
import type { Metadata } from 'next';
import { ToastProvider } from '@/components/ui/toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'MassagePH — Find Massage Shops in the Philippines',
  description: 'Browse and discover massage shops across the Philippines. Filter by region, city, and category.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create 404 page**

Create `src/app/not-found.tsx`:

```tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <h2 className="mt-4 text-xl font-semibold text-slate-900">Page not found</h2>
      <p className="mt-2 text-sm text-gray-500">The page you are looking for does not exist.</p>
      <Link href="/" className="mt-6">
        <Button>Back to listings</Button>
      </Link>
    </div>
  );
}
```

- [ ] **Step 3: Create error page**

Create `src/app/error.tsx`:

```tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-gray-200">500</h1>
      <h2 className="mt-4 text-xl font-semibold text-slate-900">Something went wrong</h2>
      <p className="mt-2 text-sm text-gray-500">An unexpected error occurred. Please try again.</p>
      <div className="mt-6 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link href="/">
          <Button variant="secondary">Back to listings</Button>
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/not-found.tsx src/app/error.tsx
git commit -m "feat: add root layout with ToastProvider, 404 and 500 error pages"
```

---

## Phase 9: CI/CD and Final Polish

### Task 26: Create GitHub Actions CI Workflow

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create CI workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint

  typecheck:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx tsc --noEmit

  test:
    name: Unit Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run test
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "chore: add GitHub Actions CI workflow for lint, type-check, and tests"
```

---

### Task 27: Final Verification

- [ ] **Step 1: Run all linting and type checks**

```bash
npm run lint && npx tsc --noEmit
```

Fix any issues.

- [ ] **Step 2: Run all unit tests**

```bash
npm run test
```

All tests should pass.

- [ ] **Step 3: Run dev server and manually verify**

```bash
npm run dev
```

Verify:
- Customer homepage loads at `http://localhost:3000` with seeded listings
- Filters work (region → city → category)
- Search works
- Detail page loads at `http://localhost:3000/[slug]`
- Copy address button works
- Admin login at `http://localhost:3000/login` with `admin@massageph.com` / `changeme123`
- Admin dashboard shows listings table
- Create new listing form works
- Edit listing form pre-populates
- Delete listing with confirmation works
- Change password works

- [ ] **Step 4: Build production**

```bash
npm run build
```

Should complete without errors.

- [ ] **Step 5: Final commit and push**

```bash
git add -A
git commit -m "chore: fix any remaining lint/type issues"
git push
```
