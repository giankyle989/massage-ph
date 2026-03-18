# MassagePH — Design Specification

| Field          | Detail             |
|----------------|--------------------|
| **Version**    | 1.0                |
| **Created**    | 2026-03-18         |
| **Status**     | Draft              |
| **PRD**        | `docs/PRD.md`      |

---

## 1. Overview

MassagePH is a massage shop listing directory for the Philippines with two interfaces:
- **Customer Site** — public browsing, search, filtering, and detail pages
- **Admin Panel** — CRUD management of listings (protected)

This spec defines the architecture, UI design, data model, and API surface for the MVP.

---

## 2. Tech Stack

| Layer           | Technology                        |
|-----------------|-----------------------------------|
| Framework       | Next.js 14+ (App Router)         |
| Language        | TypeScript (strict mode)          |
| Styling         | Tailwind CSS                      |
| Database        | PostgreSQL                        |
| ORM             | Prisma                            |
| Auth            | NextAuth.js (Auth.js)             |
| Image Storage   | AWS S3                            |
| Maps            | Google Maps JavaScript API        |
| Testing         | Vitest + React Testing Library + Playwright |
| Code Quality    | ESLint + Prettier + husky + lint-staged |
| Package Manager | npm                               |
| Node            | 20.x LTS                         |

---

## 3. Visual Design Direction

**Clean & Modern** — crisp whites, subtle grays and blues, sharp sans-serif typography. Professional directory aesthetic similar to Yelp or Google Maps listings. No heavy textures or decorative elements.

- **Primary palette**: White backgrounds, gray-50/100 for cards and sections, slate-700/900 for text
- **Accent color**: Blue-600 for interactive elements (links, buttons, selected states)
- **Typography**: System sans-serif stack (`font-family: system-ui, -apple-system, sans-serif`)
- **Cards**: White with 1px border (gray-200), 8px border-radius, subtle shadow on hover
- **Tags/pills**: Gray-100 background, gray-600 text, rounded

---

## 4. Project Structure

```
src/
  app/
    (admin)/
      login/page.tsx
      dashboard/page.tsx
      listings/new/page.tsx
      listings/[id]/edit/page.tsx
      change-password/page.tsx # Admin change password form
      layout.tsx              # Admin layout with auth check, nav, logout
    (customer)/
      page.tsx                # Browse/listing directory (homepage)
      [slug]/page.tsx         # Listing detail page
      layout.tsx              # Customer layout with header, footer
    api/
      auth/[...nextauth]/route.ts
      listings/route.ts       # GET public listings (filtered, paginated)
      listings/[slug]/route.ts # GET single listing
      admin/listings/route.ts  # POST create listing
      admin/listings/[id]/route.ts # PUT update, DELETE listing
      admin/upload/route.ts    # POST image upload to S3
      admin/change-password/route.ts # PUT change admin password
    layout.tsx                # Root layout
  components/
    ui/                       # Reusable primitives (Button, Input, Modal, Table, Pagination, Toast, Skeleton)
    admin/                    # AdminNav, ListingForm, ServiceRows, MapPinPicker, ImageUploader, ChangePasswordForm
    customer/                 # Header, Footer, ListingCard, FilterDrawer, SearchBar, ImageGallery, ServicesTable, MapEmbed, CopyAddress, EmptyState
  lib/
    db.ts                     # Prisma client singleton
    auth.ts                   # NextAuth config
    s3.ts                     # S3 upload utilities
    constants.ts              # Named constants (page sizes, rate limits)
    validators/               # Zod schemas (listing, service, auth, change-password)
    data/
      regions-cities.json     # Philippine regions & cities (PSGC source)
  types/                      # Shared TypeScript types
prisma/
  schema.prisma
  seed.ts
public/                       # Static assets (logo, favicon)
docs/                         # Documentation
```

---

## 5. Customer-Facing Pages

### 5.1 Browse Page (Homepage)

**Layout**: Sidebar on the left (240px), card grid on the right filling remaining width.

**Header**:
- Logo/brand name on the left
- Search bar on the right — searches listings by name

**Sidebar Filters**:
- **Region**: Dropdown or list of Philippine regions. Selecting a region filters the city options.
- **City**: Dropdown filtered to cities within the selected region. Disabled until a region is selected.
- **Category**: Dropdown or list of massage categories (Thai, Shiatsu, Swedish, etc.)
- **Clear Filters** button to reset all
- Filters update the URL query params and trigger a server-side re-fetch

**Listing Cards** (grid: 3 columns desktop, 2 tablet, 1 mobile):
- Primary image (first in images array)
- Shop name
- Category
- City
- Starting price (lowest service price, formatted as "From ₱XXX")
- Click navigates to `/[slug]`

**Pagination**: Numbered pages at the bottom (1, 2, 3... Next). Server-side pagination via `?page=N` query param. 12 listings per page.

**Result count**: Display above the grid (e.g., "Showing 24 listings" or "Showing 8 listings in NCR").

**Empty state**: When filters/search return zero results, display a centered empty state with an icon, "No listings found" message, and a "Clear Filters" button.

**Responsive behavior**: On mobile (below 768px), the sidebar is hidden. A fixed "Filters" button opens a slide-out drawer from the left containing all filter options. The drawer has a "Show Results" button at the bottom to apply and close.

### 5.2 Detail Page (`/[slug]`)

**Sections (top to bottom)**:

1. **Back navigation**: "← Back to listings" link at top
2. **Image gallery**: Hero image (large, full-width of content area) with thumbnail row below. Click thumbnail to swap hero. Click hero to open lightbox (stretch goal — not MVP-blocking).
3. **Shop info**:
   - Name (h1)
   - Category pill
   - Full address (region, city, street) with a "Copy" button — copies to clipboard, shows "Copied!" toast
4. **Tags**: Row of pills (e.g., "24/7", "Parking", "WiFi")
5. **Description**: Rich text or plain text block with contact info, hours, special notes
6. **Services & Pricing table**:
   - Columns: Service Name, Price (₱), Duration (min), Discount
   - Discount display: "10% off" for percentage, "₱100 off" for fixed, "—" if none
7. **Location**: Embedded Google Map with pin at the shop's coordinates. If no coordinates, show a "View on Google Maps" link using the address.

**Responsive**: Single-column layout on mobile. Image gallery stacks. Table scrolls horizontally if needed.

---

## 6. Admin Panel

### 6.1 Authentication

- **Login page** (`/login`): Email + password form. On success, redirect to `/dashboard`.
- **Session management**: NextAuth.js with credentials provider. JWT strategy. Session duration configurable via `SESSION_MAX_AGE` env var (default: 24 hours).
- **Password hashing**: bcrypt with minimum 10 salt rounds.
- **Route protection**: Admin layout checks session server-side. Unauthenticated users redirect to `/login`.
- **Logout**: Button in admin nav, clears session.
- **Change password**: Accessible from admin nav dropdown. Form requires current password + new password + confirm new password. Validated server-side (current password must match). No email-based reset in MVP.
- **Admin creation**: Admins are created exclusively via `prisma/seed.ts` in MVP. No self-registration or admin-managed user creation.

### 6.2 Dashboard (`/dashboard`)

- **Listings table**: Paginated, columns: Name, City, Category, Active (boolean badge), Actions (Edit, Delete)
- **Empty state**: When no listings exist, show "No listings yet. Create your first listing." with a CTA button
- **Search**: Single text input that matches against name, region, and city simultaneously
- **Actions per row**: Edit (pencil icon → navigates to edit form), Delete (trash icon → confirmation modal)
- **"Add New Listing" button**: Navigates to `/listings/new`
- **Pagination**: Numbered pages, 20 listings per page

### 6.3 Listing Form (Create & Edit)

Single form page used for both create (`/listings/new`) and edit (`/listings/[id]/edit`). Edit form pre-populates all fields.

**Form sections**:

1. **Basic Info**
   - Name (text input, required)
   - Category (select dropdown from predefined list, required)
   - Region (select dropdown, required) — selecting updates city options
   - City (select dropdown, required) — filtered by selected region
   - Address (text input, required)
   - Description (textarea, required)
   - Is Active (toggle, default: true)

2. **Location (Map Pin Picker)**
   - Embedded Google Map (interactive)
   - Admin clicks on map to place/move a pin
   - Lat/lng fields auto-populate from pin position
   - Optional: search box within map to jump to an address
   - If no pin placed, coordinates are null (map on detail page falls back to address link)

3. **Images**
   - Drag-and-drop upload area
   - Files upload to AWS S3, URLs stored in listing
   - Preview thumbnails after upload
   - Reorder by drag (first image = primary/hero)
   - Delete individual images
   - At least one image required

4. **Services & Pricing**
   - Dynamic rows, each with: Service Name, Price (₱), Duration (min), Discount Amount, Discount Type (percentage/fixed/none)
   - "Add Service" button appends a new row
   - Remove button per row
   - At least one service required

5. **Tags**
   - Multi-select from predefined tag list (see PRD Appendix A)
   - Freeform text input to add custom tags
   - Tags displayed as removable pills

**Validation**: Zod schema validated client-side on submit and server-side on API. Inline error messages per field.

**Submit**: POST (create) or PUT (edit) to admin API. On success, redirect to dashboard with success toast.

---

## 7. Data Model

### 7.1 Prisma Schema

```
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

### 7.2 Location Reference

Static JSON file (`src/lib/data/regions-cities.json`) with Philippine regions and their cities. Used to populate filter dropdowns on both admin and customer sides. Sourced from PSGC.

---

## 8. API Design

All responses follow the shape: `{ data?, error?, message? }`

### 8.1 Public Endpoints

| Method | Path                    | Description                  | Query Params                              |
|--------|-------------------------|------------------------------|-------------------------------------------|
| GET    | `/api/listings`         | List listings (paginated)    | `region`, `city`, `category`, `search`, `page` |
| GET    | `/api/listings/[slug]`  | Get single listing by slug   | —                                         |

- Listings endpoint returns only `isActive: true` listings
- Default page size: 12
- Search is case-insensitive, matches against listing name
- Filters are AND-combined

### 8.2 Protected Admin Endpoints

All require valid NextAuth session. Return 401 if unauthenticated.

| Method | Path                          | Description          | Body / Params           |
|--------|-------------------------------|----------------------|-------------------------|
| GET    | `/api/admin/listings`         | List all listings (incl. inactive) | `search`, `page` |
| POST   | `/api/admin/listings`         | Create listing       | Listing + services JSON |
| PUT    | `/api/admin/listings/[id]`    | Update listing       | Listing + services JSON |
| DELETE | `/api/admin/listings/[id]`    | Delete listing       | —                       |
| POST   | `/api/admin/upload`           | Upload image to S3   | FormData (file)         |
| PUT    | `/api/admin/change-password`  | Change admin password | `{ currentPassword, newPassword }` |

- Create/update endpoints auto-generate slug from name (with deduplication suffix if needed)
- Update replaces services array entirely (delete existing, insert new). **Known limitation**: service IDs change on every edit. If a future feature references service IDs (e.g., bookings), this strategy should be revisited in favor of upsert.
- Upload returns the S3 URL of the uploaded file
- Max image file size: 5MB
- Accepted formats: JPEG, PNG, WebP

### 8.3 Validation

Zod schemas for:
- `ListingCreateSchema` / `ListingUpdateSchema` — validates all listing fields + nested services
- `ServiceSchema` — validates individual service entries
- `LoginSchema` — validates email + password
- `ChangePasswordSchema` — validates currentPassword + newPassword (min 8 chars)

---

## 9. Key Implementation Details

### 9.1 Slug Generation
- Auto-generated from listing name: lowercase, replace spaces/special chars with hyphens
- If slug already exists, append `-2`, `-3`, etc.

### 9.2 Image Upload Flow
1. Admin selects/drops files in the form
2. Client-side: validate file type and size
3. Upload to `/api/admin/upload` (multipart form data)
4. Server: upload to S3, return URL
5. URL stored in the form state, submitted with the listing

### 9.3 Google Maps Integration
- **Customer detail page**: Static embed or JS API showing a pin. Read-only.
- **Admin form**: Interactive JS API map. Click to place pin. Coordinates populate lat/lng fields.
- **API key**: Restricted to Maps JavaScript API, HTTP referrer restricted.
- **Fallback**: If no coordinates, show "View on Google Maps" link with address-based URL.

### 9.4 Filter Behavior
- Region → City is a dependent dropdown (selecting region filters available cities)
- All filters update URL query params (enables shareable filtered URLs and browser back/forward)
- Server components re-fetch with new params on each filter change
- Empty filter state shows all active listings

### 9.5 SEO
- Customer pages are server-rendered (RSC)
- Dynamic metadata per listing detail page (title, description, og:image)
- Listings browse page metadata updates with filter context

### 9.6 Security
- All string inputs sanitized for XSS (description field is plain text only — no HTML allowed)
- Prisma parameterized queries prevent SQL injection
- Zod validation at all API boundaries for structural integrity
- Admin API endpoints require valid NextAuth session

### 9.7 Accessibility (WCAG 2.1 AA)
- All images must have descriptive alt text
- All form inputs must have associated labels
- Interactive elements must be keyboard-navigable
- Color contrast must meet AA ratio (4.5:1 for normal text, 3:1 for large text)
- Focus indicators visible on all interactive elements

### 9.8 Rate Limiting & CORS
- Public API endpoints: rate-limit at 100 requests/minute per IP to prevent abuse
- Image upload endpoint: rate-limit at 20 requests/minute per session
- CORS: allow only the app's own origin (`NEXTAUTH_URL`). No wildcard origins.

### 9.9 S3 Image Cleanup
- When images are removed from a listing (via edit), delete the corresponding S3 objects
- When a listing is deleted, delete all associated S3 images
- Consider a periodic cleanup job to remove orphaned S3 objects not referenced by any listing

### 9.10 Pagination Constants
- Customer browse page: 12 listings per page (`CUSTOMER_PAGE_SIZE`)
- Admin dashboard: 20 listings per page (`ADMIN_PAGE_SIZE`)
- Extract as named constants in `src/lib/constants.ts` — do not use magic numbers

### 9.11 Performance Targets
- Listing browse page loads in < 2 seconds on 4G (SSR + pagination keeps payload small)
- Google Map loads within 3 seconds (lazy-loaded on detail page)
- Architecture supports 10,000 listings and 50,000 daily page views (Prisma indexed queries, S3 + CDN for images)
- 99.5% uptime target (Vercel hosting SLA)

### 9.12 Error Handling

**Error pages:**
- **404 page** (`not-found.tsx`): Shown for invalid listing slugs or unknown routes. Displays "Page not found" with a "Back to listings" link.
- **500 page** (`error.tsx`): Generic server error page with "Try again" and "Back to listings" links.
- **Admin 401**: Unauthenticated admin requests redirect to `/login` with a flash message.

**API error responses:**
All API errors follow the standard response shape `{ error, message }`:
- `400` — Validation error. Body includes field-level errors: `{ error: { field: "message" } }`.
- `401` — Unauthenticated. Body: `{ error: "Unauthorized" }`.
- `404` — Resource not found. Body: `{ error: "Not found" }`.
- `413` — File too large (image upload). Body: `{ error: "File exceeds 5MB limit" }`.
- `415` — Unsupported file type. Body: `{ error: "Only JPEG, PNG, and WebP are accepted" }`.
- `429` — Rate limited. Body: `{ error: "Too many requests" }`.
- `500` — Server error. Body: `{ error: "Internal server error" }`.

**Client-side error UX:**
- Form validation: inline error messages below each field (red text, aria-describedby for accessibility).
- Server errors on form submit: toast notification with error message.
- Image upload failures: toast notification; form remains functional without the failed image.
- Network/timeout errors: toast notification: "Something went wrong. Please try again."

### 9.13 Loading States

- **Listing card grid**: Skeleton cards (gray placeholder for image + 3 animated text lines) matching grid layout. Show 12 skeletons (matching page size).
- **Detail page**: Skeleton placeholders for hero image area, info block, tags row, services table, and map area.
- **Admin table**: Skeleton rows matching table column structure.
- **Image upload**: Progress indicator per file during upload.
- **Form submission**: Submit button shows loading spinner and is disabled during request.

### 9.14 S3 & Image Strategy

- **Bucket**: Public S3 bucket with CloudFront CDN in front for caching and performance.
- **Upload flow**: Client → `/api/admin/upload` → S3. CloudFront URL returned and stored in listing.
- **Cleanup on edit**: When images are removed from a listing during edit, delete the corresponding S3 objects.
- **Cleanup on delete**: When a listing is deleted, delete all associated S3 images.
- **Orphan cleanup**: Consider a periodic cleanup job (future) to remove S3 objects not referenced by any listing.
- **CDN caching**: Set `Cache-Control: public, max-age=31536000, immutable` on S3 objects. Use unique filenames (UUID-based) so cache is never stale.

### 9.15 Rate Limiting

- **Implementation**: In-memory rate limiter middleware (e.g., `next-rate-limit` or custom token bucket).
- **Public API endpoints**: 100 requests/minute per IP.
- **Image upload endpoint**: 20 requests/minute per session.
- **Admin API endpoints**: 60 requests/minute per session.
- **Limitation**: In-memory store means limits are per-instance (Vercel serverless). Sufficient for MVP scale. Upgrade to Redis if traffic exceeds expectations.
- **Response**: Return `429 Too Many Requests` with `Retry-After` header.

### 9.16 CSRF Protection

- NextAuth.js provides built-in CSRF tokens for its own endpoints (login/logout).
- Admin API mutation endpoints (POST, PUT, DELETE) are protected by requiring a valid NextAuth session (JWT in HTTP-only cookie). Since the app uses same-origin API routes, the combination of SameSite cookies + session validation provides adequate CSRF protection for MVP.
- CORS is restricted to the app's own origin (`NEXTAUTH_URL`). No wildcard origins.

### 9.17 Service Description Field

The `description` field on the `Service` model is optional metadata for the admin's reference and is displayed on the customer detail page as a subtitle below the service name in the services table. If empty, only the service name is shown.

### 9.18 Seed Data

The `prisma/seed.ts` script creates initial data for development and first deployment:

| Data                 | Details                                                              |
|----------------------|----------------------------------------------------------------------|
| Admin user           | Email: `admin@massageph.com`, Password: `changeme123`, Role: `admin`. Must be changed on first real deployment. |
| Sample listings      | 5–10 listings across at least 3 regions (NCR, Region IV-A, Region VII) with varied categories, 2–5 tags per listing from the predefined list, and a mix of `isActive` states (mostly true, 1–2 false). |
| Services per listing | 2–4 services each with a mix of discount types (percentage, fixed, none). |
| Images               | Use placeholder image URLs (e.g., `https://placehold.co/800x600`). Real S3 uploads not required for seed. |

### 9.19 Admin Role Clarification

The schema includes a `role` field on `AdminUser` with a default of `"admin"`. In MVP, there is no functional difference between roles — all authenticated admins have the same permissions. The field exists for future expansion (e.g., superadmin-only features like user management). The seed script creates admins with role `"admin"`.

---

## 10. Decisions on PRD Open Questions

| # | Question | Decision |
|---|----------|----------|
| 1 | Multiple admin roles? | Single "admin" role for MVP. Schema supports `role` field for future expansion. |
| 2 | Gallery or single hero? | Hero image + thumbnail row below. |
| 3 | Dynamic city filter? | Yes — city dropdown filters based on selected region. |
| 4 | Domain/branding? | Deferred — not a technical decision. |
| 5 | Coordinate entry method? | Interactive map pin picker in admin form. |
| 6 | Is_featured flag? | Not in MVP. Can be added later as a boolean field. |

---

## 11. Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | Yes |
| `NEXTAUTH_URL` | App base URL | Yes |
| `SESSION_MAX_AGE` | Session duration in seconds (default: 86400) | No |
| `AWS_ACCESS_KEY_ID` | AWS credentials for S3 | Yes |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials for S3 | Yes |
| `AWS_S3_BUCKET` | S3 bucket name for image uploads | Yes |
| `AWS_S3_REGION` | S3 bucket region | Yes |
| `GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key | Yes |

---

## 12. Deployment & Infrastructure

### 12.1 Environments

| Environment | Purpose | URL | Database |
|-------------|---------|-----|----------|
| **Local** | Development | `http://localhost:3000` | Local PostgreSQL or AWS RDS dev instance |
| **Preview** | Per-PR review | Auto-generated by Vercel (e.g., `project-git-branch.vercel.app`) | RDS dev/staging instance (shared) |
| **Production** | Live site | Custom domain (TBD) via Vercel | AWS RDS production instance |

No dedicated staging environment. Vercel preview deploys serve as ad-hoc staging for PR review.

### 12.2 Hosting

| Service | Provider | Details |
|---------|----------|---------|
| **App** | Vercel | Next.js deployment, automatic preview deploys on PR, production deploy on merge to `main`. |
| **Database** | AWS RDS (PostgreSQL) | Single RDS instance for production. Separate dev instance for local/preview environments. |
| **Image Storage** | AWS S3 | Public bucket, region matching RDS for low latency. |
| **CDN** | AWS CloudFront | Distribution in front of S3 bucket. Cache images with `Cache-Control: public, max-age=31536000, immutable`. |
| **DNS** | TBD | Domain and DNS provider deferred (see PRD Open Question #4). |

### 12.3 AWS RDS Configuration

| Setting | Value |
|---------|-------|
| Engine | PostgreSQL 16 |
| Instance class | `db.t3.micro` (MVP — scale up as needed) |
| Storage | 20 GB gp3 (auto-scaling enabled) |
| Multi-AZ | No (MVP) — enable for production reliability later |
| Backups | Automated daily backups, 7-day retention |
| Encryption | Enabled at rest (AWS-managed key) |
| Public access | No — use VPC security group rules. Vercel connects via public endpoint with IP allowlisting or SSL-only. |
| Connection pooling | Use Prisma's built-in connection pooling (`connection_limit` in `DATABASE_URL`). If connection limits become an issue, add PgBouncer or Prisma Accelerate. |

### 12.4 CI/CD Pipeline

**Vercel** handles builds and deploys automatically. **GitHub Actions** runs quality gates on every PR.

```
PR opened/updated
  ├─ GitHub Actions (parallel):
  │   ├─ Lint (eslint)
  │   ├─ Type check (tsc --noEmit)
  │   ├─ Unit/integration tests (vitest)
  │   └─ E2E tests (playwright) — against preview deploy
  └─ Vercel:
      └─ Build & deploy preview

Merge to main
  └─ Vercel:
      └─ Build & deploy to production
```

**GitHub Actions workflow** (`.github/workflows/ci.yml`):
- Triggered on: `pull_request` to `main`
- Steps: checkout → install deps (`npm ci`) → lint → type-check → test (vitest) → e2e (playwright, after Vercel preview is ready)
- All checks must pass before PR can be merged (branch protection rule on `main`)

**Branch protection on `main`:**
- Require PR reviews (1 reviewer)
- Require status checks to pass (lint, type-check, test)
- No direct pushes to `main`

### 12.5 Environment Variable Management

| Context | Where env vars are set |
|---------|----------------------|
| **Local** | `.env.local` file (git-ignored) |
| **Vercel preview** | Vercel project settings → Environment Variables (scope: Preview) |
| **Vercel production** | Vercel project settings → Environment Variables (scope: Production) |

- `.env.example` committed to repo with all required keys (no values) as a reference.
- Production secrets (`NEXTAUTH_SECRET`, AWS credentials) are set only in Vercel's dashboard — never committed.
- Preview deploys share the dev RDS instance and a separate S3 bucket/prefix to avoid polluting production data.

### 12.6 Database Migrations in Production

- Run `npx prisma migrate deploy` as part of the Vercel build command: `npx prisma migrate deploy && next build`.
- This applies any pending migrations before the new build goes live.
- Never run `prisma migrate dev` in production — it resets data.
- Seed script (`prisma db seed`) is run manually on first production deployment only.

### 12.7 CloudFront CDN Setup

| Setting | Value |
|---------|-------|
| Origin | S3 bucket (public access) |
| Price class | Use only North America, Europe, and Asia (covers Philippines) |
| Default TTL | 86400 seconds (1 day) — overridden by S3 object `Cache-Control` headers |
| Viewer protocol | Redirect HTTP to HTTPS |
| Compression | Enable automatic gzip/brotli |

Image URLs stored in listings use the CloudFront distribution domain (e.g., `https://d1234.cloudfront.net/image-uuid.jpg`), not the raw S3 URL.
