# Meridian Market

**A production-grade, full-stack e-commerce platform** — real authentication, a real relational database, and a real checkout flow, built end-to-end to demonstrate senior-level engineering practices across the stack.

[![Angular](https://img.shields.io/badge/Angular-18-DD0031?logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture Overview](#architecture-overview)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Database Architecture](#database-architecture)
- [Authentication Flow](#authentication-flow)
- [API Design](#api-design)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Build Instructions](#build-instructions)
- [Deployment](#deployment)
- [Performance Optimizations](#performance-optimizations)
- [Security Features](#security-features)
- [Responsive Design](#responsive-design)
- [Accessibility](#accessibility)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)
- [Developer](#developer)

---

## Overview

Meridian Market is a full-stack online shopping platform spanning fashion, electronics, beauty, groceries, home essentials, and more. It was engineered the way a senior team would actually ship a real storefront — not mocked, not hard-coded, not a static prototype.

Products, categories, brands, reviews, and related commerce data are served in real time through the backend APIs using the project's database. Every account is protected by JWT-based authentication, every cart and wishlist persists server-side once signed in, and every order is placed through a real transactional checkout flow that decrements live inventory.

| | |
|---|---|
| **Frontend** | Angular 18 (standalone components), TypeScript, Tailwind CSS |
| **Backend** | Node.js, Express 5, TypeScript |
| **Database** | PostgreSQL via Prisma ORM 7 (Supabase-hosted) |
| **Auth** | JWT access & refresh tokens in HTTP-only cookies, bcrypt password hashing |
| **Architecture** | REST API, layered backend (routes → controllers → services → Prisma), lazy-loaded Angular routes |

---

## Key Features

| Feature | Description |
|---|---|
| 🔍 **Relevance-ranked search** | Multi-field search across product name, description, SKU, brand, and category with token matching, synonym expansion, and exact/prefix-match ranking — plus a live autocomplete dropdown |
| 🧭 **Category navigation** | Live mega-menu and category rails driven entirely by the database, with a dedicated Categories page |
| 🛒 **Persistent cart** | Server-synced for signed-in users, local-storage-backed for guests, with a slide-in cart drawer |
| ❤️ **Wishlist** | Save-for-later with one-click "Move to Cart" |
| 🧩 **Related products & recently viewed** | Category/brand-aware related-product ranking, plus a client-tracked "recently viewed" rail |
| 📦 **Live order tracking** | Real 4-stage delivery timeline (Placed → Processing → Shipped → Delivered) with generated tracking numbers |
| 🔐 **Secure authentication** | JWT in HTTP-only cookies, bcrypt-hashed passwords, session-derived (never client-trusted) account data |
| 🧑‍💼 **Full profile dashboard** | Editable profile, saved addresses, order history, wishlist, account settings |
| ✉️ **Real contact pipeline** | Contact form backed by a dedicated database table and API endpoint — not a dead-end form |
| 💬 **Reviews & ratings** | Per-product customer reviews with aggregate ratings |
| 🎨 **Polished, resilient UI** | Skeleton loading states, empty states, retry-with-backoff on transient network errors, toast notifications |
| 📱 **Fully responsive** | Mobile slide-in navigation drawer, adaptive grids, touch-friendly controls throughout |

---

## Technology Stack

**Frontend**
- Angular 18 (standalone components, no NgModules)
- TypeScript
- RxJS (reactive state, debounced search, request cancellation via `switchMap`)
- Tailwind CSS
- Angular Router (lazy-loaded, code-split routes)

**Backend**
- Node.js + Express 5
- TypeScript
- Prisma ORM 7 + `@prisma/adapter-pg`
- Zod (request validation)
- JWT (`jsonwebtoken`) + `bcryptjs`
- Helmet, CORS, `express-rate-limit`, `compression`, `morgan`

**Database**
- PostgreSQL (hosted on Supabase)

**Tooling**
- ESLint + Prettier
- `tsx` (backend dev server with hot reload)
- Angular CLI (build, dev server)

---

## Architecture Overview

```mermaid
graph LR
    subgraph Client
        A[Angular 18 SPA]
    end
    subgraph Server
        B[Express 5 REST API]
        C[Zod Validation]
        D[JWT Auth Middleware]
        E[Service Layer]
    end
    subgraph Data
        F[(PostgreSQL / Supabase)]
    end

    A -- HTTPS / JSON --> B
    B --> C --> D --> E
    E -- Prisma ORM --> F
    F -- Prisma ORM --> E
    E --> B
    B -- JSON --> A
```

The system follows a clean three-tier architecture: a fully decoupled Angular SPA, a layered Express API (routing → validation → auth → business logic → data access), and a PostgreSQL database accessed exclusively through Prisma's type-safe query layer.

---

## Backend Architecture

The API follows a **layered, single-responsibility architecture**:

```
Route  →  Controller  →  Service  →  Prisma Client  →  PostgreSQL
```

- **Routes** (`src/routes/`) define endpoints and attach middleware (auth, validation, rate limiting).
- **Controllers** (`src/controllers/`) parse/validate requests and shape HTTP responses — no business logic.
- **Services** (`src/services/`) contain all business logic: search ranking, order transactions, related-product resolution, cart/wishlist merging, etc.
- **Validators** (`src/validators/`) are Zod schemas shared between route-level validation and TypeScript types.
- **Middleware** (`src/middleware/`) handles authentication, centralized error handling, and request validation.

Notable backend design decisions:
- **Relevance-ranked, multi-field search** — search queries are tokenized and matched against name, description, SKU, category, and brand fields (with synonym expansion for common shopper vocabulary), then scored and ranked so exact/prefix name matches always outrank incidental description hits.
- **Transactional order processing** — placing and cancelling orders runs inside a database transaction that atomically adjusts stock, preventing race conditions on inventory.
- **Server-derived security-sensitive fields** — fields like an address's linked account email are always resolved from the authenticated session server-side, never trusted from the request body.
- **Environment-aware rate limiting** — generous limits in development, tightened in production.

---

## Frontend Architecture

- **Standalone components** throughout — no `NgModule` boilerplate, each component declares its own imports.
- **Lazy-loaded routes** (`loadComponent`) so the browser only downloads the code for the page being visited.
- **Reactive, resilient data loading** — HTTP calls use RxJS `retry` with exponential backoff to self-heal from transient network hiccups, and search/autocomplete inputs use `debounceTime` + `switchMap` so rapid typing never produces stale, out-of-order results.
- **Reactive route-param handling** — pages that depend on the URL (search results, product details, profile tabs) subscribe to `ActivatedRoute` param observables rather than reading a one-time snapshot, so in-app navigation between two matches of the same route (e.g. one product's page to a related product's page) always reflects the new data.
- **Global toast & modal services** — a single `ToastService` drives both transient notifications and contextual modals (e.g. a "Sign In Required" prompt shown when a guest tries to add to cart or wishlist).
- **`OnPush` change detection** on data-heavy pages for predictable, efficient rendering.

---

## Database Architecture

Relational schema managed entirely through **Prisma migrations**, hosted on **Supabase PostgreSQL**.

Core entities:

```mermaid
erDiagram
    User ||--o{ Order : places
    User ||--o| Cart : has
    User ||--o| Wishlist : has
    User ||--o{ Address : has
    User ||--o{ Review : writes
    Category ||--o{ Product : contains
    Brand ||--o{ Product : makes
    Product ||--o{ ProductImage : has
    Product ||--o{ Review : receives
    Cart ||--o{ CartItem : contains
    Wishlist ||--o{ WishlistItem : contains
    Order ||--o{ OrderItem : contains
    Product ||--o{ CartItem : referenced_by
    Product ||--o{ OrderItem : referenced_by
```

**Models:** `User`, `Address`, `Category`, `Brand`, `Product`, `ProductImage`, `Cart`, `CartItem`, `Wishlist`, `WishlistItem`, `Order`, `OrderItem`, `Review`, `Faq`, `ContactMessage`.

Key relational design choices:
- Every order line item snapshots price at time of purchase, so historical orders remain accurate even if a product's price later changes.
- Stock adjustments happen inside database transactions to prevent overselling under concurrent checkouts.
- Reviews, orders, and addresses all cascade correctly on their parent relations.

---

## Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Angular Frontend
    participant B as Express API
    participant D as PostgreSQL

    U->>F: Submit login form
    F->>B: POST /api/auth/login
    B->>D: Verify user + bcrypt.compare(password)
    D-->>B: User record
    B->>B: Sign JWT access + refresh tokens
    B-->>F: Set HTTP-only cookies
    F-->>U: Redirect to intended page
    U->>F: Request protected resource
    F->>B: Request with cookies (auto-sent)
    B->>B: Verify JWT middleware
    B-->>F: Authorized response
```

- Passwords are hashed with **bcrypt** — never stored or logged in plain text.
- Access and refresh tokens are issued as **HTTP-only cookies**, not stored in `localStorage`, mitigating XSS token theft.
- Guarded frontend routes (`authGuard`) redirect unauthenticated users to `/login`, preserving a `returnUrl` so they land back where they were after signing in.
- Guest actions that require an account (add to cart, add to wishlist) trigger a contextual sign-in prompt with a `returnUrl` rather than a bare redirect or silent failure.

---

## API Design

RESTful, resource-oriented, and consistently shaped:

```
GET    /api/products                 List products (search, filter, sort, paginate)
GET    /api/products/:id             Get a single product
GET    /api/products/:id/related     Get related products (same brand/category)
GET    /api/products/featured        Featured products (category-diversified)
GET    /api/products/deals           Deal products (ranked by discount)
GET    /api/categories               List categories
GET    /api/brands                   List brands
POST   /api/auth/register            Create account
POST   /api/auth/login               Authenticate
GET    /api/cart                     Get current user's cart
POST   /api/cart/items               Add item to cart
GET    /api/wishlist                 Get current user's wishlist
POST   /api/wishlist/items           Add item to wishlist
GET    /api/orders                   Order history
POST   /api/orders                   Place an order
POST   /api/orders/:id/cancel        Cancel a pending/processing order
GET    /api/addresses                List saved addresses
GET    /api/faq                      List FAQs
POST   /api/contact                  Submit a contact message
```

Every response follows a consistent envelope:

```json
{
  "status": "success",
  "data": { "...": "..." }
}
```

Errors are handled by a centralized error middleware and return a consistent shape with an appropriate HTTP status code.

---

## Project Structure

```
angular-shopping-app/
├── backend/
│   ├── src/
│   │   ├── config/          # Environment & app configuration
│   │   ├── controllers/     # HTTP request/response handling
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── prisma/          # Prisma client instance
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Business logic
│   │   ├── validators/      # Zod request schemas
│   │   ├── types/           # Shared TypeScript types
│   │   └── utils/           # Helpers
│   └── prisma/
│       ├── schema.prisma    # Database schema
│       └── migrations/      # Version-controlled migrations
│
└── frontend/
    └── src/app/
        ├── components/      # Reusable UI (navbar, footer, cart sidebar, product rails…)
        ├── pages/           # Route-level pages (home, products, product-detail, profile…)
        ├── services/        # HTTP clients, state (cart, wishlist, auth, toast…)
        ├── guards/          # Route guards
        ├── interceptors/    # HTTP interceptors
        ├── directives/      # Custom directives (e.g. scroll-reveal)
        └── config/          # App-wide config (brand/contact info)
```

---

## Installation

**Prerequisites:** Node.js 20+, npm, a PostgreSQL database (e.g. a free [Supabase](https://supabase.com/) project).

```bash
git clone <repository-url>
cd angular-shopping-app

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in real values:

```env
# Server
PORT=3000
NODE_ENV=development

# Database (Supabase PostgreSQL) — both REQUIRED when NODE_ENV=production
DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"  # pooled, used at runtime
DIRECT_URL="postgresql://user:password@host:5432/postgres"                   # unpooled, used for migrations

# Auth — REQUIRED when NODE_ENV=production
JWT_SECRET="replace-with-a-long-random-secret"   # e.g. openssl rand -base64 48
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# CORS — comma-separated frontend origin(s) allowed to call this API
ALLOWED_ORIGINS="http://localhost:4200"
```

`PORT`, `JWT_EXPIRES_IN`, and `JWT_REFRESH_EXPIRES_IN` have safe defaults if omitted. `DATABASE_URL`, `DIRECT_URL`, and `JWT_SECRET` are validated at startup and **the process refuses to start in production without them** — this is intentional, not a bug, so a missing secret fails loudly at boot instead of silently running insecurely.

The frontend's API base URL is resolved at **runtime**, not baked into the JS bundle at build time — see `frontend/src/assets/env.js`. This lets one built artifact be pointed at a different backend per deployment without rebuilding (see [Deployment](#deployment)).

---

## Running Locally

```bash
# Terminal 1 — backend (http://localhost:3000)
cd backend
npm run dev

# Terminal 2 — frontend (http://localhost:4200)
cd frontend
npm start
```

Apply database migrations before first run:

```bash
cd backend
npx prisma migrate deploy
```

---

## Build Instructions

```bash
# Backend — type-checks, compiles to dist/, and rewrites path aliases to
# real relative paths (tsc alone does NOT do this — see Deployment notes)
cd backend
npm run build
npm start   # sanity-check: node dist/src/server.js should start cleanly

# Frontend — production build to dist/angular-ecommerce/browser/
cd frontend
npx ng build
```

---

## Deployment

### Backend → Render

A `render.yaml` blueprint is included at the repo root (`rootDir: backend`). In the Render dashboard: **New → Blueprint**, point it at this repo, and set the secrets it lists as `sync: false` (`DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `ALLOWED_ORIGINS`) — or configure the service manually with:

- **Build Command:** `npm ci && npm run build`
- **Start Command:** `npm start`
- **Health Check Path:** `/health`

Two details that matter for staying up long-term, not just building once:
- The build step runs `tsc` **and then `tsc-alias`** — TypeScript's `paths` config (used for the `#/*` import alias) is compile-time-only for type-checking; it does not rewrite emitted `require()` calls. Without `tsc-alias`, the compiled server crashes on startup with `Cannot find module '#/app.js'`. This is wired into `npm run build` already — don't run `tsc` directly in a custom deploy command.
- `app.set('trust proxy', 1)` is set because Render terminates TLS at a proxy in front of the app; without it, `express-rate-limit` misidentifies every client as the proxy's IP.

### Frontend → Vercel

A `vercel.json` is included in `frontend/`. In the Vercel dashboard, set the project's **Root Directory** to `frontend`. It will then run `npm run build` and serve `dist/angular-ecommerce/browser`, with SPA rewrites so deep links (e.g. `/products`) don't 404 on refresh.

To point the deployed frontend at your Render backend, edit `frontend/src/assets/env.js`:

```js
window.__env = {
  API_BASE_URL: 'https://your-backend.onrender.com/api',
};
```

This file is a static asset, not part of the compiled JS bundle — you can update it and redeploy just that one file without rebuilding the whole app if the backend URL ever changes. `vercel.json` explicitly disables caching on it so an update takes effect immediately rather than being served stale from a CDN edge.

On the backend, set `ALLOWED_ORIGINS` to include the deployed Vercel URL, or cross-origin requests will be rejected by CORS.

### Database

Supabase-hosted PostgreSQL. Use the pooled connection string for `DATABASE_URL` and the direct connection string for `DIRECT_URL` (Supabase's connection pooler doesn't support the prepared statements Prisma migrations need).

---

## Performance Optimizations

- Lazy-loaded, code-split Angular routes — each page ships only the JavaScript it needs.
- `OnPush` change detection on data-heavy components.
- Debounced, cancellable search requests (`debounceTime` + `switchMap`) — no wasted requests, no race conditions.
- Server-side pagination and filtering on all product listing endpoints.
- In-memory relevance ranking is only performed on the already-filtered result set, keeping search fast without needing separate search infrastructure.
- Gzip compression and connection pooling on the API.
- Automatic retry with exponential backoff on transient network failures, so brief hiccups self-heal instead of surfacing as errors.

---

## Security Features

- Passwords hashed with **bcrypt**, never stored or logged in plain text.
- JWT access & refresh tokens delivered via **HTTP-only cookies** (not `localStorage`), reducing XSS exposure.
- **Helmet**-hardened HTTP response headers.
- Strict **CORS** policy scoped to the known frontend origin.
- **Rate limiting** on every API route, with a dedicated stricter limit on the unauthenticated contact endpoint.
- All request bodies validated against **Zod** schemas before reaching business logic.
- Security-sensitive fields (e.g. the email linked to a saved address) are always derived server-side from the authenticated session — never trusted from client input.

---

## Responsive Design

Built mobile-first with Tailwind's responsive utilities throughout:
- Dedicated mobile slide-in navigation drawer with a collapsible search bar, distinct from the desktop mega-menu.
- Product grids adapt from a single column on small screens up to four columns on desktop (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`).
- Touch-friendly tap targets on all interactive controls (cart, wishlist, quantity steppers).
- The cart drawer, search suggestions, and account menu all reflow correctly at mobile widths.

---

## Accessibility

- Semantic HTML landmarks (`<main>`, `<nav>`, `<footer>`) throughout.
- `aria-label`s on icon-only controls (cart, wishlist, search, menu toggles).
- Keyboard-operable forms with visible focus states.
- Sufficient color contrast on interactive elements and status badges.
- Descriptive `alt` text on all product imagery.

---

## Screenshots

| Homepage | Featured Categories |
|---|---|
| ![Homepage](./docs/screenshots/01-homepage-hero.jpg) | ![Featured Categories](./docs/screenshots/02-featured-categories.jpg) |

| Flash Sale | Trending Products |
|---|---|
| ![Flash Sale](./docs/screenshots/03-flash-sale.jpg) | ![Trending Products](./docs/screenshots/04-trending-products.jpg) |

| Product Listing | Search Results |
|---|---|
| ![Product Listing](./docs/screenshots/06-product-listing.jpg) | ![Search Results](./docs/screenshots/07-search-results.jpg) |

| Product Details | Cart |
|---|---|
| ![Product Details](./docs/screenshots/08-product-detail.jpg) | ![Cart](./docs/screenshots/09-cart.jpg) |

| Profile Dashboard | Order History |
|---|---|
| ![Profile Dashboard](./docs/screenshots/10-profile-dashboard.jpg) | ![Order History](./docs/screenshots/11-orders.jpg) |

| Wishlist | Footer |
|---|---|
| ![Wishlist](./docs/screenshots/12-wishlist.jpg) | ![Footer](./docs/screenshots/05-footer.jpg) |

---

## Future Improvements

| Status | Item |
|---|---|
| ✅ Shipped | Live 4-stage order tracking with tracking numbers |
| ✅ Shipped | Category rails & dynamic navigation driven by the database |
| ✅ Shipped | Relevance-ranked search with synonym expansion and autocomplete |
| ✅ Shipped | Related products & recently-viewed |
| 🔜 Planned | Admin dashboard for managing products, categories, and orders |
| 🔜 Planned | Transactional email notifications (order confirmation, shipping, delivery) |
| 🔜 Planned | Time-boxed flash sales with countdown-driven visibility |
| 🔜 Planned | Partial-order cancellation (single line item, not the whole order) |

---

## Contributing

This is a personal portfolio project, but issues and pull requests are welcome. Please open an issue describing the change before submitting a large PR.

---

## License

Released under the [MIT License](./LICENSE).

---

## Developer

**Darshan Giri Goswami**
Full Stack Software Developer

Built end-to-end — database schema, API, and UI — as a demonstration of production-grade full-stack engineering. Angular, React, Node.js, Express, Prisma, PostgreSQL, MongoDB, Tailwind CSS.
