
# Angular Shopping App — Improvement & Data Migration Plan

## 0. Current state (as found)

- **Frontend**: Angular 18+ app (`frontend/`), Tailwind CSS already configured, component-based
  home page (hero, flash-sale, featured-categories, trending-products, brands, why-choose-us,
  customer-reviews, statistics, faq, newsletter, footer, cart-sidebar, navbar).
- **Backend**: Express 5 + Prisma 7 + PostgreSQL (Supabase pooler), already has real routes for
  auth, products, categories, cart, orders, wishlist — this is **already a proper own API**, not
  a thin proxy. JWT auth, validation middleware, rate limiting, helmet, etc. are in place.
- **Database**: Prisma schema already models User, Address, Category, Product, ProductImage,
  Cart/CartItem, Wishlist/WishlistItem, Order/OrderItem, Review. Connected to Supabase Postgres
  via `DATABASE_URL` / `DIRECT_URL` in `backend/.env`.
- **Gap found**: `backend/src/scripts/seedProducts.ts` pulls product data from the public
  FakeStoreAPI at seed time. The user wants data sourced from `https://dummyjson.com/products`
  instead, imported once into Supabase, and the external call then removed.
- **Gap found**: Several homepage sections render from hardcoded arrays inside the component
  files instead of the database: `brands`, `flash-sale`, `featured-categories` (partially),
  `customer-reviews`, `statistics`, `why-choose-us`, `faq`. These need real tables + endpoints.

## 1. Data source decision

- Source API: `https://dummyjson.com/products?limit=0` — 194 products across 24 categories,
  each with brand, price, discountPercentage, stock, rating, tags, images, thumbnail, and
  embedded customer reviews. This is enough real data to back every homepage section (brands,
  categories, flash-sale-via-discountPercentage, reviews, stats) without inventing new content.
- Plan: write a **one-time import script** (replacing `seedProducts.ts`) that fetches this API,
  writes everything into Supabase via Prisma, and is deleted (or kept only as a documented,
  disabled dev utility) once the import has run successfully. After that, the running app never
  calls dummyjson again — everything comes from `/api/*` → Prisma → Supabase.

## 2. Schema additions (Prisma)

Add to `backend/prisma/schema.prisma`:

- `Brand` — `id, name, slug, logoUrl?, isActive, createdAt`. Populated from unique `brand` values
  in dummyjson. `Product.brandId` (optional FK) added.
- `Faq` — `id, question, answer, category?, order, isActive, createdAt`. Seeded with real
  storefront FAQs (shipping, returns, payment, account) since dummyjson has no FAQ data.
- Reuse `Review` for the "Customer Reviews" section — import dummyjson's embedded reviews,
  creating lightweight seed `User` rows (role CUSTOMER, random password hash, flag such as
  `email` derived from `reviewerEmail`) so FK constraints hold and reviews look authentic.
- **No new table for "Statistics" or "Flash Sale"** — these should be *computed*, not stored,
  so they can never drift from real data:
  - Statistics: `SELECT count(*)` on products/categories/orders/users, computed in
    `product`/`category`/`order` services and exposed via one `/api/stats/overview` endpoint.
  - Flash Sale: query `Product where comparePrice > price` (derived from dummyjson's
    `discountPercentage`), ordered by discount %, limited to N — exposed via
    `/api/products/deals` (or a query param on the existing products endpoint).

## 3. Backend work

1. `prisma/schema.prisma`: add `Brand`, `Faq`, `Product.brandId`; run `prisma migrate dev`.
2. New `backend/src/scripts/importDummyJsonProducts.ts` (replaces `seedProducts.ts`):
   fetch dummyjson, upsert categories, brands, products + images, and reviews (with seed users).
   Idempotent (safe to re-run) via `upsert`/slug uniqueness checks.
   Configure with `dotenv/prisma:generate` and run against the existing `DATABASE_URL`
   (existing Supabase credentials in `backend/.env` — no new project needed).
3. New endpoints:
   - `GET /api/brands` — list active brands.
   - `GET /api/faqs` — list active FAQs, ordered.
   - `GET /api/stats/overview` — computed counts (products, categories, orders, happy customers,
     average rating).
   - `GET /api/products/deals` — products with an active discount, for Flash Sale.
   Each gets controller + service + route, following the existing pattern
   (`*.controller.ts` → `*.service.ts` → `*.routes.ts`, wired in `app.ts`).
4. Delete `seedProducts.ts` and any remaining reference to `fakestoreapi.com` once the import
   script has been run successfully against Supabase.

## 4. Frontend work

1. Add `BrandService`, `FaqService`, `StatsService` (mirroring existing `CategoryService` style).
2. Update `trending-products`, `featured-categories` to fully use `ProductService`/`CategoryService`
   (verify no residual hardcoded fallback data).
3. Replace hardcoded arrays with service calls + `async` pipe / signals in:
   - `brands.component.ts` → `BrandService.getBrands()`
   - `flash-sale.component.ts` → `ProductService` deals endpoint
   - `customer-reviews.component.ts` → new `ReviewService.getFeaturedReviews()`
   - `statistics.component.ts` → `StatsService.getOverview()`
   - `faq.component.ts` → `FaqService.getFaqs()`
   - `why-choose-us.component.ts` — this is brand messaging, not data; leave as static content
     unless you want it admin-editable too (optional `SiteContent` key/value table if so).
4. Add loading/error/empty states for each (skeleton shimmer or spinner), since data is now async.

## 5. UI / UX / responsiveness pass

- Audit every page (home, products, product-detail, cart, checkout, login/signup, profile) at
  360px, 768px, 1024px, 1440px. Tailwind is already present — enforce `sm: md: lg: xl:` usage
  consistently instead of fixed widths.
- Navbar: collapsible mobile menu with proper focus trap; sticky header on scroll.
- Product cards: consistent aspect-ratio image containers (currently images come in varied
  sizes from dummyjson) — use `object-cover` + fixed aspect box.
- Forms (login/signup/checkout): inline validation messages, larger tap targets on mobile.
- Dark mode (optional, nice-to-have): Tailwind `dark:` variants, toggle stored in localStorage.
- Accessibility pass: alt text (now real, from imported product titles), color contrast, keyboard
  navigation, `aria-*` on modal/toast/cart-sidebar.
- Skeleton loaders for product grids/sections instead of layout jump.

## 6. "Advanced / powerful" feature ideas (pick what's worth building)

Ranked roughly by value vs. effort given the existing schema:

1. **Product search + filters that hit the DB** (category, price range, rating, in-stock) —
   backend already has query params scaffolded in `ProductService`; wire the UI fully.
2. **Real review submission** — logged-in users can leave a review on a purchased product
   (uses existing `Review` model + `isVerified` flag tied to `OrderItem` history).
3. **Wishlist → Cart flow polish** — already has models/routes; make sure UI round-trips.
4. **Order tracking / order history page** — list past orders with status (model exists).
5. **Admin dashboard** (role `ADMIN` already in schema) — CRUD for products/categories/brands/faqs
   without touching the DB by hand; this is what makes "all data from database" maintainable.
6. **Low-stock / inventory alerts** — `lowStockAlert` field already exists, just unused.
7. **Discount/flash-sale scheduling** — add `saleStartsAt`/`saleEndsAt` to `Product` so Flash
   Sale is time-boxed, not just "has a compare price."
8. **Email notifications** (order confirmation) — nice-to-have, needs an email provider (Resend/
   SMTP), out of scope unless you want it.
9. **Product recommendations** ("related products" by category/brand) using existing data —
   cheap to add, good UX payoff.

## 7. Execution order

1. Confirm this plan.
2. Prisma schema migration (`Brand`, `Faq`, `Product.brandId`) against Supabase.
3. Build + run the dummyjson import script → verify data in Supabase (product/category/brand/
   review counts).
4. Remove `seedProducts.ts` / dummyjson references from the codebase.
5. Add the 4 new backend endpoints.
6. Wire frontend services + replace hardcoded arrays.
7. Responsive/UX pass across all pages.
8. Optional: implement highest-value items from Section 6 (search/filters, reviews, admin
   dashboard) as follow-up, one at a time.

---
**Note on scope**: Step 2 modifies your live Supabase schema and step 3 writes real data into it.
I will confirm with you again right before running the migration/import against Supabase, since
that touches a shared external system, not just local files.
