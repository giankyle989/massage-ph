# Product Requirements Document (PRD)

## MassagePH — Massage Shop Listing Web App

| Field              | Detail                          |
|--------------------|---------------------------------|
| **Document Owner** | MassagePH Team                  |
| **Version**        | 1.0                             |
| **Created**        | March 18, 2026                  |
| **Last Updated**   | March 18, 2026                  |
| **Status**         | Draft                           |

---

## 1. Executive Summary

MassagePH is a web application that serves as a centralized directory and listing platform for massage shops across the Philippines. The platform has two distinct interfaces: an **Admin Panel** for managing listings and a **Customer-Facing Site** for browsing, searching, and discovering massage shops. The app aims to make it easy for customers to find massage services near them by location, category, and other filters — while giving administrators full CRUD (Create, Read, Update, Delete) control over listings.

---

## 2. Problem Statement

Currently, finding massage shops in the Philippines is fragmented. Customers rely on social media, word-of-mouth, or generic search engines — none of which offer structured filtering by region, city, massage type, pricing, or amenities. There is no dedicated, Philippines-focused platform that aggregates massage shop information in a searchable, well-organized directory.

**Pain points:**

- Customers have no single source of truth for discovering massage shops filtered by location and type.
- There is no easy way to compare prices, durations, discounts, and amenities across shops.
- Massage shop owners lack a simple, structured way to present their services online.

---

## 3. Goals & Objectives

| # | Objective                                                                                 | Success Metric                                       |
|---|-------------------------------------------------------------------------------------------|------------------------------------------------------|
| 1 | Provide a comprehensive, searchable directory of massage shops in the Philippines         | 100+ listings within 3 months of launch              |
| 2 | Allow customers to filter and discover shops by region, city, category, and name          | >60% of sessions use at least one filter             |
| 3 | Give admins full control over listing management via a secure panel                       | Admin can perform all CRUD operations without issues  |
| 4 | Display rich, detailed listing pages that help customers make informed decisions          | Avg. time on listing detail page > 45 seconds        |
| 5 | Show shop location on an embedded map so customers can navigate easily                    | Map loads successfully on >95% of detail page views  |

---

## 4. Target Users

### 4.1 Customer (End User)

- **Demographics:** Adults (18–60) in the Philippines looking for massage services.
- **Behavior:** Searches for massage shops by location or type; values convenience, pricing transparency, and proximity.
- **Needs:** Quick discovery, reliable information, easy-to-read pricing, map-based navigation, and the ability to contact the shop.

### 4.2 Admin (Listing Manager)

- **Demographics:** Platform administrator(s) or massage shop owners granted access.
- **Behavior:** Logs in to create, update, or remove listings on behalf of massage shops.
- **Needs:** Secure access, intuitive forms for managing listing data, image uploads, and visibility into all existing listings.

---

## 5. Scope

### 5.1 In Scope (MVP)

- Admin authentication (login/logout) with protected routes.
- Full CRUD for massage shop listings (Admin).
- Public customer-facing listing directory with search and filters.
- Detailed listing page with all structured information and embedded Google Map.
- Copy-to-clipboard for shop address.
- Responsive design (mobile and desktop).

### 5.2 Out of Scope (Future Phases)

- Online booking / appointment scheduling.
- Customer accounts, registration, or login.
- Payment processing.
- Ratings, reviews, and user-generated content.
- Push notifications or email alerts.
- Multi-language support.
- Shop owner self-registration portal.
- Analytics dashboard for admins.

---

## 6. Feature Requirements

### 6.1 Admin Side

#### 6.1.1 Authentication & Authorization

| ID    | Requirement                                                                            | Priority |
|-------|----------------------------------------------------------------------------------------|----------|
| A-001 | Admin can log in with email/username and password.                                     | P0       |
| A-002 | Admin can log out, which clears the session/token.                                     | P0       |
| A-003 | All admin pages are protected; unauthenticated users are redirected to the login page. | P0       |
| A-004 | Session/token expires after a configurable period of inactivity (default: 24 hours).   | P1       |
| A-005 | Password is stored securely using hashing (e.g., bcrypt).                              | P0       |
| A-006 | Admin can change their own password from the admin panel (requires current password).  | P1       |

#### 6.1.2 Listing Management

| ID    | Requirement                                                                                         | Priority |
|-------|-----------------------------------------------------------------------------------------------------|----------|
| A-010 | Admin can view a paginated table/list of all massage shop listings.                                 | P0       |
| A-011 | Admin can search/filter listings within the admin panel by name, region, or city.                   | P1       |
| A-012 | Admin can create a new listing by filling out a structured form (see Data Model, Section 7).        | P0       |
| A-013 | Admin can edit any existing listing. The form is pre-populated with current data.                   | P0       |
| A-014 | Admin can delete a listing with a confirmation prompt.                                              | P0       |
| A-015 | Admin can upload one or more images for a listing. Images are stored in cloud storage or on-server. | P0       |
| A-016 | Admin can add, edit, and remove service items (price, duration, discount) per listing.              | P0       |
| A-017 | Admin can assign multiple tags to a listing from a predefined or freeform tag input.                | P0       |
| A-018 | Form validation prevents submission of incomplete or malformed data.                                | P0       |
| A-019 | Admin accounts are created via database seed script. No self-registration or admin-created accounts in MVP. | P0       |

---

### 6.2 Customer Side

#### 6.2.1 Listing Browse & Search

| ID    | Requirement                                                                            | Priority |
|-------|----------------------------------------------------------------------------------------|----------|
| C-001 | Customer can view a public directory of all **active** massage shop listings (card or list layout). Only listings with `is_active: true` are shown. | P0       |
| C-002 | Customer can filter listings by **region** (e.g., NCR, Region III, Region IV-A).       | P0       |
| C-003 | Customer can filter listings by **city** (e.g., Quezon City, Makati, Cebu City).       | P0       |
| C-004 | Customer can filter listings by **category** (e.g., Thai, Chinese, Swedish, Shiatsu).  | P0       |
| C-005 | Filters can be combined (e.g., NCR + Quezon City + Thai).                              | P0       |
| C-006 | Customer can search listings by **name** via a search bar.                             | P0       |
| C-007 | Search and filters work together (e.g., search "Zen" within NCR Thai massage results). | P1       |
| C-008 | Listings are paginated or use infinite scroll to handle large datasets.                | P1       |
| C-009 | Each listing card shows: name, category, city, primary image, and starting price.      | P0       |
| C-010 | When filters return zero results, display an empty state with a message and a "Clear Filters" CTA. | P1       |
| C-011 | Display a result count above the listing grid (e.g., "Showing 24 results in NCR").     | P1       |
| C-012 | Listing cards and detail page sections show skeleton loaders while data is loading.    | P1       |

#### 6.2.2 Listing Detail Page

| ID    | Requirement                                                                                         | Priority |
|-------|-----------------------------------------------------------------------------------------------------|----------|
| C-020 | Clicking a listing card opens a detailed page for that shop.                                        | P0       |
| C-021 | Detail page displays: **name**.                                                                     | P0       |
| C-022 | Detail page displays: **category** (type of massage).                                               | P0       |
| C-023 | Detail page displays: **full address** (region, city, street address).                              | P0       |
| C-024 | Detail page displays: **image(s)** — a hero image or image gallery.                                | P0       |
| C-025 | Detail page displays: **description** (includes contact info, special instructions, etc.).          | P0       |
| C-026 | Detail page displays: **tags** (e.g., "24/7", "Pet Friendly", "Parking Available", "WiFi").        | P0       |
| C-027 | Detail page displays: **services table** with service name, price, duration, and discount (if any). | P0       |
| C-028 | Detail page embeds a **Google Map** showing the shop's exact location via coordinates or address.   | P0       |
| C-029 | Customer can **copy the address** to clipboard with a single click/tap (with visual feedback).      | P0       |
| C-030 | Detail page is responsive and renders well on both mobile and desktop.                              | P0       |
| C-031 | Detail page shows a "Back to listings" navigation element.                                          | P1       |

---

## 7. Data Model

### 7.1 Listing (Massage Shop)

| Field         | Type              | Required | Description                                                     |
|---------------|-------------------|----------|-----------------------------------------------------------------|
| `id`          | UUID / Auto-incr  | Yes      | Unique identifier.                                              |
| `name`        | String            | Yes      | Shop name.                                                      |
| `slug`        | String            | Yes      | URL-friendly version of the name (auto-generated).              |
| `category`    | String / Enum     | Yes      | Type of massage (Thai, Chinese, Swedish, Shiatsu, Hilot, etc.). |
| `region`      | String / Enum     | Yes      | Philippine region (NCR, Region I, Region II, etc.).             |
| `city`        | String            | Yes      | City or municipality.                                           |
| `address`     | String            | Yes      | Full street address.                                            |
| `latitude`    | Float             | No       | GPS latitude for map pin (recommended).                         |
| `longitude`   | Float             | No       | GPS longitude for map pin (recommended).                        |
| `description` | Text (rich/plain) | Yes      | Detailed description, contact info, operating hours, etc.       |
| `tags`        | String[]          | No       | Array of tags: "24/7", "Pet Friendly", "Parking", "WiFi", etc. |
| `images`      | String[]          | Yes      | Array of image URLs. First image is the primary/hero image.     |
| `services`    | Service[]         | Yes      | Array of service offerings (see 7.2).                           |
| `is_active`   | Boolean           | Yes      | Whether the listing is publicly visible. Default: `true`.       |
| `created_at`  | DateTime          | Yes      | Timestamp of creation.                                          |
| `updated_at`  | DateTime          | Yes      | Timestamp of last update.                                       |

### 7.2 Service (Nested under Listing)

| Field           | Type    | Required | Description                                        |
|-----------------|---------|----------|----------------------------------------------------|
| `id`            | UUID    | Yes      | Unique identifier.                                 |
| `name`          | String  | Yes      | Service name (e.g., "Full Body Thai Massage").     |
| `price`         | Decimal | Yes      | Price in PHP (₱).                                  |
| `duration`      | Integer | Yes      | Duration in minutes (e.g., 60, 90, 120).           |
| `discount`      | Decimal | No       | Discount value (nullable). Interpretation depends on `discount_type`: if `"percentage"`, this is the percent off (e.g., `10` = 10% off); if `"fixed"`, this is the PHP amount off (e.g., `100` = ₱100 off). |
| `discount_type` | Enum    | No       | `"percentage"` or `"fixed"`. Null if no discount.  |
| `description`   | String  | No       | Optional short description of the service.         |

### 7.3 Admin User

| Field           | Type     | Required | Description                  |
|-----------------|----------|----------|------------------------------|
| `id`            | UUID     | Yes      | Unique identifier.           |
| `email`         | String   | Yes      | Login email (unique).        |
| `password_hash` | String   | Yes      | Bcrypt-hashed password.      |
| `name`          | String   | Yes      | Display name.                |
| `role`          | Enum     | Yes      | `"superadmin"` or `"admin"`. |
| `created_at`    | DateTime | Yes      | Timestamp of creation.       |

### 7.4 Philippine Location Reference

| Field    | Type   | Description                               |
|----------|--------|-------------------------------------------|
| `region` | String | Region name (e.g., "NCR", "Region IV-A"). |
| `city`   | String | City or municipality within the region.   |

> This can be a static reference table or a JSON file used to populate region/city dropdowns on both admin and customer sides.

---

## 8. User Flows

### 8.1 Admin: Create a New Listing

```
Login → Dashboard (All Listings) → Click "Add New Listing"
→ Fill form (name, category, region, city, address, coordinates,
   description, tags, images, services/pricing)
→ Submit → Validation passes → Listing saved → Redirect to All Listings
```

### 8.2 Admin: Edit a Listing

```
Login → Dashboard (All Listings) → Click "Edit" on a listing row
→ Pre-populated form → Modify fields → Submit → Listing updated
→ Redirect to All Listings
```

### 8.3 Admin: Delete a Listing

```
Dashboard (All Listings) → Click "Delete" on a listing row
→ Confirmation modal ("Are you sure?") → Confirm → Listing removed
→ List refreshed
```

### 8.4 Customer: Browse & Filter Listings

```
Landing Page → Browse listing cards
→ Select Region tabs (e.g., NCR) → Results filtered
→ Select City tabs (e.g., Quezon City) → Results narrowed
→ Select Category tabs (e.g., Thai) → Results narrowed further
→ (Optional) Type in search bar → Results filtered by name
→ Click a listing card → Navigate to Detail Page
```

### 8.5 Customer: View Listing Detail & Copy Address

```
Listing Detail Page → View name, category, description, images, tags,
services/pricing table → Scroll to map section → View embedded Google Map
→ Click "Copy Address" button → Address copied to clipboard
→ Toast notification: "Address copied!"
```

---

## 9. Non-Functional Requirements

| Category           | Requirement                                                                                |
|--------------------|--------------------------------------------------------------------------------------------|
| **Performance**    | Listing browse page loads in < 2 seconds on a 4G connection.                               |
| **Performance**    | Google Map on detail page loads within 3 seconds.                                          |
| **Security**       | Admin passwords hashed with bcrypt (min 10 salt rounds).                                   |
| **Security**       | Admin routes protected via JWT or session-based auth with HTTP-only cookies.               |
| **Security**       | All API endpoints for write operations require authentication.                             |
| **Security**       | Input sanitization on all forms to prevent XSS and SQL injection.                          |
| **Scalability**    | System should handle up to 10,000 listings and 50,000 daily page views without degradation.|
| **Reliability**    | 99.5% uptime target.                                                                      |
| **SEO**            | Customer-facing pages should be server-rendered or statically generated for indexing. Each listing detail page must include dynamic `<title>`, `meta description`, and Open Graph tags (`og:title`, `og:description`, `og:image`). |
| **Accessibility**  | WCAG 2.1 AA compliance (alt text, keyboard navigation, color contrast).                   |
| **Responsiveness** | Fully responsive design — mobile-first approach for customer-facing pages.                |

### 9.1 Error Handling

| Scenario                    | Behavior                                                                  |
|-----------------------------|---------------------------------------------------------------------------|
| Invalid listing slug (404)  | Customer-facing 404 page with "Back to listings" link.                   |
| Server error (500)          | Generic error page with "Try again" and "Back to listings" links.        |
| API validation error (400)  | Return field-level error messages in `{ error: { field: message } }`.    |
| Unauthorized admin (401)    | Redirect to login page with a flash message.                             |
| Form submission failure     | Inline error messages per field; toast notification for server errors.    |
| Image upload failure        | Toast notification with error message; form remains submittable without the failed image. |
| Network/timeout error       | Toast notification: "Something went wrong. Please try again."            |

### 9.2 Loading & Empty States

| Context                     | Behavior                                                                  |
|-----------------------------|---------------------------------------------------------------------------|
| Listing cards loading       | Skeleton card placeholders (image + 3 text lines) matching grid layout.  |
| Detail page loading         | Skeleton placeholders for hero image, info block, services table, map.   |
| Admin table loading         | Skeleton rows matching table column structure.                            |
| Filter returns zero results | Empty state: illustration/icon, "No listings found" message, "Clear Filters" button. |
| Search returns zero results | Empty state: "No listings match '[query]'" with suggestion to broaden search. |
| Admin dashboard empty       | "No listings yet. Create your first listing." with CTA button.           |

### 9.3 Seed Data Specification

The `prisma/seed.ts` script must create:

| Data                 | Details                                                              |
|----------------------|----------------------------------------------------------------------|
| Admin user           | Email: `admin@massageph.com`, Password: `changeme123`, Role: `admin`. Must be changed on first real deployment. |
| Sample listings      | 5–10 listings across at least 3 regions (NCR, Region IV-A, Region VII) with varied categories. |
| Services per listing | 2–4 services each with a mix of discounts (percentage, fixed, none). |
| Tags per listing     | 2–5 tags from the predefined list.                                   |
| Images               | Use placeholder image URLs (e.g., `https://placehold.co/800x600`). Real S3 uploads not required for seed. |

---

## 10. Technical Recommendations

> _These are suggestions. Finalize based on team expertise and infrastructure._

| Layer            | Recommendation                                                       |
|------------------|----------------------------------------------------------------------|
| **Frontend**     | Next.js 14+ (App Router) — SSR/SSG for SEO, API routes for backend. |
| **Styling**      | Tailwind CSS — utility-first, responsive-friendly.                   |
| **Backend/API**  | Next.js API Routes.                                                  |
| **Database**     | PostgreSQL (relational, strong for structured data and filtering).   |
| **ORM**          | Prisma — type-safe, works well with Next.js and PostgreSQL.          |
| **Auth**         | NextAuth.js (Auth.js) — credentials provider, JWT strategy.          |
| **Image Storage**| AWS S3 (public bucket) + CloudFront CDN.                             |
| **Maps**         | Google Maps JavaScript API.                                          |
| **Hosting**      | Vercel (automatic preview deploys on PR, production deploy on merge to `main`). |
| **Database Host**| AWS RDS (PostgreSQL 16, `db.t3.micro` for MVP).                      |
| **CDN**          | AWS CloudFront (in front of S3 for image delivery).                  |
| **CI/CD**        | Vercel built-in deploys + GitHub Actions for lint/test quality gates. |
| **Search**       | PostgreSQL case-insensitive search on listing name.                  |
| **Rate Limiting**| In-memory rate limiter middleware.                                    |

---

## 11. Google Maps Integration

| Aspect       | Detail                                                                                      |
|--------------|---------------------------------------------------------------------------------------------|
| **API Used** | Google Maps JavaScript API (interactive maps for both customer and admin).                  |
| **Input**    | Latitude/longitude coordinates stored per listing; fallback to address geocoding.           |
| **Display**  | Embedded map on the listing detail page showing a pin at the shop's location.               |
| **API Key**  | Restricted Google Maps API key (HTTP referrer restriction, limited to Maps Embed/JS API).   |
| **Fallback** | If no coordinates are provided, show a static "View on Google Maps" link using the address. |

---

## 12. Philippine Regions & Cities Reference

The app should include a reference dataset for Philippine regions and their cities/municipalities to power the filter dropdowns. Key regions to support at MVP:

| Region Code | Region Name               | Sample Cities                                    |
|-------------|---------------------------|--------------------------------------------------|
| NCR         | National Capital Region   | Quezon City, Manila, Makati, Taguig, Pasig       |
| Region I    | Ilocos Region             | San Fernando, Laoag, Dagupan, Vigan              |
| Region III  | Central Luzon             | San Fernando (Pampanga), Angeles, Olongapo       |
| Region IV-A | CALABARZON               | Antipolo, Calamba, Lucena, Batangas City         |
| Region VII  | Central Visayas           | Cebu City, Lapu-Lapu, Mandaue, Tagbilaran       |
| Region XI   | Davao Region              | Davao City, Tagum, Digos, Panabo                 |

> A full list of 17 regions and their cities should be maintained as a static reference file or database seed. The Philippine Standard Geographic Code (PSGC) is the recommended authoritative data source.

---

## 13. Wireframe Descriptions

### 13.1 Customer — Listings Browse Page

```
┌──────────────────────────────────────────────────────────┐
│  [Logo / MassagePH]                        [Search Bar]  │
├──────────────────────────────────────────────────────────┤
│  Filters: [Region ▼]  [City ▼]  [Category ▼]  [Clear]   │
│  (Mobile: filters behind a "Filters" button → slide-out  │
│   drawer from left)                                       │
├──────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│  │  Image   │  │  Image   │  │  Image   │  │  Image   │  │
│  │  Name    │  │  Name    │  │  Name    │  │  Name    │  │
│  │  Category│  │  Category│  │  Category│  │  Category│  │
│  │  City    │  │  City    │  │  City    │  │  City    │  │
│  │  From ₱XX│  │  From ₱XX│  │  From ₱XX│  │  From ₱XX│  │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘    │
│                                                          │
│  [  1  ] [ 2 ] [ 3 ] [ Next → ]                         │
└──────────────────────────────────────────────────────────┘
```

### 13.2 Customer — Listing Detail Page

```
┌──────────────────────────────────────────────────────────┐
│  ← Back to Listings                                      │
├──────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐    │
│  │              Hero Image / Gallery                 │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  Shop Name                                               │
│  Category: Thai Massage                                  │
│  📍 123 Main St, Quezon City, NCR          [📋 Copy]    │
│                                                          │
│  Tags: [24/7] [Parking] [WiFi] [Pet Friendly]           │
│                                                          │
│  ── Description ──                                       │
│  Lorem ipsum dolor sit amet, contact us at ...           │
│                                                          │
│  ── Services & Pricing ──                                │
│  ┌──────────────┬────────┬──────────┬───────────┐       │
│  │ Service      │ Price  │ Duration │ Discount  │       │
│  ├──────────────┼────────┼──────────┼───────────┤       │
│  │ Full Body    │ ₱500   │ 60 min   │ 10% off   │       │
│  │ Foot Massage │ ₱300   │ 30 min   │ —         │       │
│  │ Hot Stone    │ ₱800   │ 90 min   │ ₱100 off  │       │
│  └──────────────┴────────┴──────────┴───────────┘       │
│                                                          │
│  ── Location ──                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │              Google Map Embed                     │    │
│  └──────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

### 13.3 Admin — Listings Dashboard

```
┌──────────────────────────────────────────────────────────┐
│  [MassagePH Admin]                         [Logout]      │
├──────────────────────────────────────────────────────────┤
│  All Listings                      [+ Add New Listing]   │
│  Search: [____________]                                  │
├──────────────────────────────────────────────────────────┤
│  ┌────────────┬──────────┬──────────┬────────┬───────────┐│
│  │ Name       │ City     │ Category │ Active │ Actions   ││
│  ├────────────┼──────────┼──────────┼────────┼───────────┤│
│  │ Zen Spa    │ Makati   │ Thai     │ ✅     │ ✏️ 🗑️     ││
│  │ Thai Bliss │ QC       │ Shiatsu  │ ✅     │ ✏️ 🗑️     ││
│  │ Hilot Hub  │ Cebu     │ Hilot    │ ❌     │ ✏️ 🗑️     ││
│  └────────────┴──────────┴──────────┴────────┴───────────┘│
│                                                          │
│  [  1  ] [ 2 ] [ 3 ] [ Next → ]                         │
└──────────────────────────────────────────────────────────┘
```

---

## 14. Milestones & Timeline

| Phase   | Milestone                                           | Duration (Est.) |
|---------|-----------------------------------------------------|-----------------|
| Phase 1 | Project setup, database schema, auth system         | 1–2 weeks       |
| Phase 2 | Admin CRUD (listings, services, tags, image upload) | 2–3 weeks       |
| Phase 3 | Customer browse page with search & filters          | 1–2 weeks       |
| Phase 4 | Listing detail page with map & copy address         | 1 week          |
| Phase 5 | Responsive design, polish, SEO optimization         | 1 week          |
| Phase 6 | Testing (unit, integration, UAT)                    | 1–2 weeks       |
| Phase 7 | Deployment & launch                                 | 1 week          |
|         | **Total estimated timeline**                        | **8–12 weeks**  |

---

## 15. Risks & Mitigations

| Risk                                            | Impact | Mitigation                                                             |
|-------------------------------------------------|--------|------------------------------------------------------------------------|
| Google Maps API costs exceed budget             | Medium | Use Embed API (free tier) or set billing alerts and usage caps.        |
| Incomplete or inaccurate listing data at launch | High   | Seed database with verified listings; provide clear admin form UX.     |
| Image upload performance/storage costs          | Medium | Compress images on upload; use CDN; limit file size (max 5MB).        |
| Philippine location data is incomplete          | Low    | Use PSGC (Philippine Standard Geographic Code) as authoritative source.|
| Low initial traffic / discoverability           | Medium | Implement SEO best practices; consider social media marketing.         |

---

## 16. Open Questions

| #  | Question                                                                                        | Owner   | Status   | Decision |
|----|-------------------------------------------------------------------------------------------------|---------|----------|----------|
| 1  | Will there be multiple admin roles with different permission levels, or a single admin role?     | —       | Resolved | Single "admin" role for MVP. Schema keeps `role` field (default: `"admin"`) for future expansion, but no permission differentiation in MVP. Admins are created via seed script only. |
| 2  | Should images support gallery/carousel, or is a single hero image sufficient for MVP?           | —       | Resolved | Hero image + thumbnail row below. Click thumbnail to swap hero. |
| 3  | Should the city dropdown dynamically filter based on selected region?                           | —       | Resolved | Yes — city dropdown filters based on selected region. |
| 4  | Is there a preferred domain name or branding direction?                                         | _[TBD]_ | Open     | Deferred — not a technical decision. |
| 5  | Will latitude/longitude be entered manually, or should the admin form include a map pin picker? | —       | Resolved | Interactive map pin picker in admin form. |
| 6  | Should there be an "is_featured" flag for promoted/highlighted listings on the browse page?      | —       | Resolved | Not in MVP. Can be added later as a boolean field. |

> Decisions documented in `docs/superpowers/specs/2026-03-18-massageph-design.md`, Section 10.

---

## 17. Appendix

### A. Predefined Tag Options (Suggested)

`24/7` · `Pet Friendly` · `Parking Available` · `WiFi Available` · `Home Service` · `Couple Massage` · `Senior Discount` · `Student Discount` · `Walk-In Welcome` · `By Appointment Only` · `Male Therapist` · `Female Therapist` · `Wheelchair Accessible` · `Credit Card Accepted` · `GCash Accepted`

### B. Predefined Category Options (Suggested)

`Thai Massage` · `Chinese Massage` · `Swedish Massage` · `Shiatsu` · `Hilot (Filipino Traditional)` · `Deep Tissue` · `Aromatherapy` · `Hot Stone` · `Sports Massage` · `Reflexology` · `Prenatal Massage` · `Combination / Multi-style`

### C. Discount Display Logic

- If `discount_type` is `"percentage"`: display as "10% off" applied to the base price.
- If `discount_type` is `"fixed"`: display as "₱100 off" deducted from the base price.
- If no discount: display "—" or hide the discount column for that row.
