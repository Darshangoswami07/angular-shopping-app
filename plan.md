# Angular Shopping App - Enhancement Plan

## Project Overview
A full-stack Angular + Node.js/Express + Prisma/PostgreSQL e-commerce application with authentication, cart, wishlist, orders, and product management.

---

## Current Architecture Summary

### Frontend (Angular 18+)
- **Standalone Components** with lazy-loaded routes
- **Services**: Auth, Cart, Product, Category, Order, Wishlist, Toast
- **State**: RxJS BehaviorSubjects for reactive state
- **Styling**: Tailwind CSS with glassmorphism design
- **Routing**: Lazy-loaded with AuthGuard protection

### Backend (Node.js/Express + TypeScript + Prisma)
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT (access + refresh tokens) with HttpOnly cookies
- **Models**: User, Address, Category, Product, ProductImage, Cart, CartItem, Wishlist, WishlistItem, Order, OrderItem, Review
- **Auth**: Register, Login, Logout, Refresh Token, Forgot/Reset Password, Change Password
- **Orders**: COD only currently, basic order management

---

## Phase 1: Core E-commerce Features (High Priority)

### 1.1 Payment Integration
- [ ] **Stripe Integration**
  - Backend: Stripe Checkout Session creation
  - Frontend: Stripe.js redirect checkout
  - Webhook handling for payment confirmation
  - Update Order model: add `paymentIntentId`, `paymentMethod`
- [ ] **Payment Methods UI** (Checkout page)
  - Radio buttons: COD / Card (Stripe) / PayPal (future)
  - Show payment method selection before "Place Order"
- [ ] **Order Payment Status Flow**
  - PENDING → PROCESSING (after payment) → CONFIRMED
  - Payment failed → Order stays PENDING, allow retry

### 1.2 Order Management Enhancements
- [ ] **Order Confirmation Email** (Backend)
  - Nodemailer/SendGrid integration
  - Order confirmation template with items, totals, shipping address
- [ ] **Order Tracking Page** (Frontend)
  - `/orders/:id` page with timeline (Order Placed → Processing → Shipped → Delivered)
  - Order status badge with color coding
- [ ] **Admin Order Management** (Admin Dashboard)
  - Order list with filters (status, date, payment status)
  - Order detail modal with status update dropdown
  - Bulk status updates
  - Export orders to CSV

### 1.3 Address Management
- [ ] **Backend**: Full Address CRUD API
  - `POST /addresses`, `GET /addresses`, `PUT /addresses/:id`, `DELETE /addresses/:id`
  - Set default address
- [ ] **Frontend**: Address Book in Profile
  - Add/Edit/Delete addresses modal
  - Set default shipping/billing
  - Select saved address at checkout

---

## Phase 2: Product & Catalog Enhancements (High Priority)

### 2.1 Product Variants & Options
- [ ] **Backend Schema Updates** (Prisma)
  ```prisma
  model ProductVariant {
    id         String   @id @default(cuid())
    productId  String
    sku        String   @unique
    name       String   // e.g., "Size: M, Color: Red"
    price      Decimal  @db.Decimal(10,2)
    comparePrice Decimal? @db.Decimal(10,2)
    stock      Int      @default(0)
    attributes Json     // { size: "M", color: "Red" }
    images     ProductImage[]
    product    Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  }
  ```
- [ ] **Frontend**: Variant selector on Product Detail (dropdowns/radio buttons)
- [ ] **Cart**: Store variantId instead of productId

### 2.2 Advanced Product Filtering & Search
- [ ] **Backend**: Enhanced Product Query
  - Price range filter (minPrice, maxPrice)
  - Multiple category filter
  - Attributes filter (size, color, brand)
  - In-stock only filter
  - Rating filter (4+ stars, etc.)
  - Sort: Best Selling, Top Rated, Newest, Price
- [ ] **Frontend**: Enhanced Products Page
  - Sidebar with collapsible filter sections
  - Price range slider
  - Multi-select checkboxes for categories/attributes
  - Active filters chips with "Clear all"
  - URL sync for shareable filtered URLs

### 2.3 Product Reviews & Ratings
- [ ] **Backend**: Review API
  - `POST /products/:id/reviews` (authenticated, verified purchase only)
  - `GET /products/:id/reviews` with pagination
  - `PUT /reviews/:id` (owner only)
  - `DELETE /reviews/:id` (owner/admin)
  - Helpful/Not helpful votes
- [ ] **Frontend**: Product Detail Reviews Section
  - Star rating distribution chart
  - Write review modal (only if purchased)
  - Paginated review list
  - Sort: Most Recent, Highest Rated, Most Helpful

### 2.4 Product Comparison
- [ ] **Frontend**: Compare Page (`/compare`)
  - Add up to 4 products to comparison
  - Side-by-side table: specs, price, ratings, features
  - Remove from comparison
  - Persist in localStorage

---

## Phase 3: User Experience & Engagement (Medium Priority)

### 3.1 Wishlist Enhancements
- [ ] **Share Wishlist**
  - Generate shareable link
  - Public view (read-only)
- [ ] **Wishlist Notifications**
  - Email when wishlist item goes on sale
  - Email when back in stock
  - Price drop alert

### 3.2 Recently Viewed Products
- [ ] **Backend**: Track recently viewed (Redis or DB)
- [ ] **Frontend**: "Recently Viewed" section on Home/Product pages
- [ ] Persist in localStorage (guest) + sync to backend (authenticated)

### 3.3 Guest Checkout
- [ ] **Backend**: Guest order support
  - Create order without user account
  - Email for order confirmation
  - Optional account creation after order
- [ ] **Frontend**: Checkout without login
  - Email field required
  - "Create account after checkout" checkbox

### 3.4 Newsletter & Marketing
- [ ] **Backend**: Newsletter subscription
  - Subscribe/Unsubscribe API
  - Double opt-in email
  - Mailchimp/SendGrid integration
- [ ] **Frontend**: Newsletter popup (exit intent)
  - Inline footer subscription

---

## Phase 4: Admin Dashboard (Medium Priority)

### 4.1 Admin Authentication & Authorization
- [ ] Role-based access (ADMIN, MANAGER, STAFF)
- [ ] Admin-only routes guard

### 4.2 Dashboard Overview
- [ ] Revenue chart (daily/weekly/monthly)
- [ ] Orders count by status
- [ ] Top selling products
- [ ] Low stock alerts
- [ ] Recent orders table

### 4.3 Product Management (Admin)
- [ ] Product CRUD with image upload
- [ ] Bulk import/export (CSV)
- [ ] Variant management UI
- [ ] Category management (drag-drop hierarchy)

### 4.4 User Management (Admin)
- [ ] User list with search/filter
- [ ] View user orders, addresses
- [ ] Impersonate user (support)
- [ ] Ban/activate users

### 4.5 Content Management
- [ ] Banner/Hero slider management
- [ ] FAQ management
- [ ] Static pages (About, Contact, Terms, Privacy)

---

## Phase 5: Technical Improvements (Medium Priority)

### 5.1 Performance Optimization
- [ ] **Frontend**: Image optimization
  - WebP/AVIF with fallbacks
  - Lazy loading with IntersectionObserver
  - Responsive images (srcset)
- [ ] **Frontend**: Code splitting verification
  - Analyze bundle sizes
  - Preload critical routes
- [ ] **Backend**: Query optimization
  - Add database indexes for common queries
  - Redis caching for products/categories
  - Pagination cursor-based for large datasets

### 5.2 Search Enhancement
- [ ] **Backend**: Full-text search
  - PostgreSQL tsvector + GIN index
  - Or integrate Meilisearch/Typesense
- [ ] **Frontend**: Search autocomplete
  - Debounced suggestions
  - Product thumbnails in dropdown
  - Keyboard navigation

### 5.3 Error Handling & Monitoring
- [ ] **Frontend**: Global error boundary
  - User-friendly error pages
  - Sentry/Rollbar integration
- [ ] **Backend**: Structured logging (Pino/Winston)
  - Request logging
  - Error tracking
  - Health check endpoint

### 5.4 Testing
- [ ] **Frontend**: Unit tests (Jest + Testing Library)
  - Services, components, guards
- [ ] **Frontend**: E2E tests (Playwright/Cypress)
  - Critical paths: Login → Add to Cart → Checkout
- [ ] **Backend**: Integration tests
  - API endpoints with test database
  - Auth flows

---

## Phase 6: Advanced Features (Low Priority / Future)

### 6.1 Loyalty & Rewards
- [ ] Points system (earn on purchase, redeem for discounts)
- [ ] Referral program
- [ ] Tiered membership (Silver/Gold/Platinum)

### 6.2 Subscriptions & Recurring Orders
- [ ] Subscribe & Save for consumables
- [ ] Stripe Billing integration

### 6.3 Multi-vendor / Marketplace
- [ ] Vendor dashboard
- [ ] Commission system
- [ ] Vendor payouts

### 6.4 Internationalization (i18n)
- [ ] Multi-language support (Angular i18n)
- [ ] Multi-currency
- [ ] RTL support

### 6.5 PWA Features
- [ ] Service Worker for offline
- [ ] Install prompt
- [ ] Push notifications (order updates)

---

## Database Schema Additions Needed

```prisma
// Add to schema.prisma

model ProductVariant {
  id            String   @id @default(cuid())
  productId     String
  sku           String   @unique
  name          String
  price         Decimal  @db.Decimal(10, 2)
  comparePrice  Decimal? @db.Decimal(10, 2)
  stock         Int      @default(0)
  lowStockAlert Int      @default(5)
  attributes    Json     // { "size": "M", "color": "Red" }
  position      Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  product       Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  images        ProductImage[]
  cartItems     CartItem[]
  orderItems    OrderItem[]
  wishlistItems WishlistItem[]

  @@index([productId])
  @@index([sku])
  @@map("product_variants")
}

model Address {
  // ... existing fields ...
  isDefaultBilling Boolean @default(false) // Add this
}

model Newsletter {
  id        String   @id @default(cuid())
  email     String   @unique
  isActive  Boolean  @default(true)
  subscribedAt DateTime @default(now())
  confirmedAt DateTime?
  @@map("newsletters")
}

model Review {
  // ... existing fields ...
  helpfulCount Int @default(0)
  notHelpfulCount Int @default(0)
  // Add helpful votes relation if needed
}

model ReviewVote {
  id        String   @id @default(cuid())
  reviewId  String
  userId    String
  isHelpful Boolean
  createdAt DateTime @default(now())
  review    Review   @relation(fields: [reviewId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([reviewId, userId])
  @@map("review_votes")
}
```

---

## API Endpoints to Add

### Addresses
```
POST   /api/addresses              # Create address
GET    /api/addresses              # List user addresses
GET    /api/addresses/:id          # Get single address
PUT    /api/addresses/:id          # Update address
DELETE /api/addresses/:id          # Delete address
PUT    /api/addresses/:id/default  # Set as default
```

### Reviews
```
POST   /api/products/:id/reviews        # Create review (verified purchase)
GET    /api/products/:id/reviews        # Get reviews (paginated)
PUT    /api/reviews/:id                 # Update own review
DELETE /api/reviews/:id                 # Delete own review
POST   /api/reviews/:id/helpful         # Vote helpful
```

### Newsletter
```
POST   /api/newsletter/subscribe    # Subscribe
POST   /api/newsletter/unsubscribe  # Unsubscribe
POST   /api/newsletter/confirm      # Confirm subscription (token)
```

### Admin
```
GET    /api/admin/dashboard/stats          # Dashboard stats
GET    /api/admin/orders                   # All orders (paginated, filtered)
PUT    /api/admin/orders/:id/status        # Update order status
GET    /api/admin/products                 # All products (admin view)
POST   /api/admin/products                 # Create product
PUT    /api/admin/products/:id             # Update product
DELETE /api/admin/products/:id             # Delete product
POST   /api/admin/products/import          # CSV import
GET    /api/admin/products/export          # CSV export
GET    /api/admin/users                    # User management
```

---

## Frontend Pages/Components to Add

### New Pages
- `/orders/:id` - Order detail/tracking
- `/compare` - Product comparison
- `/wishlist` - Dedicated wishlist page
- `/addresses` - Address book (or in profile)
- `/search` - Search results page (with autocomplete)
- `/admin/*` - Admin dashboard routes

### New Components
- `ProductVariantSelector` - Size/Color picker
- `ProductReviewForm` - Write review modal
- `ProductReviewList` - Paginated reviews
- `AddressForm` - Add/Edit address modal
- `PaymentMethodSelector` - Checkout payment options
- `OrderTimeline` - Order status tracker
- `FilterSidebar` - Products page filters
- `SearchAutocomplete` - Header search dropdown
- `NewsletterPopup` - Exit intent modal
- `RecentlyViewed` - Carousel component

---

## Priority Matrix

| Priority | Phase | Effort | Impact |
|----------|-------|--------|--------|
| **P0** | Payment Integration | High | Critical for revenue |
| **P0** | Order Tracking/Email | Medium | Customer trust |
| **P1** | Address Management | Medium | Checkout UX |
| **P1** | Product Variants | High | Core catalog |
| **P1** | Advanced Filtering | Medium | Discovery |
| **P1** | Reviews & Ratings | Medium | Social proof |
| **P2** | Admin Dashboard | High | Operations |
| **P2** | Guest Checkout | Medium | Conversion |
| **P2** | Search Enhancement | Medium | Discovery |
| **P3** | Wishlist Sharing | Low | Engagement |
| **P3** | Recently Viewed | Low | Engagement |
| **P3** | Newsletter | Low | Marketing |
| **P4** | Loyalty Program | High | Retention |
| **P4** | PWA | Medium | Mobile UX |
| **P5** | i18n/Multi-currency | High | Global |

---

## Implementation Order Recommendation

### Sprint 1-2 (Weeks 1-4): Payment & Orders
1. Stripe integration (backend + frontend)
2. Order confirmation emails
3. Order tracking page
4. Address management

### Sprint 3-4 (Weeks 5-8): Product Enhancements
1. Product variants schema + API
2. Frontend variant selector
3. Advanced filtering on products page
4. Product reviews system

### Sprint 5-6 (Weeks 9-12): Admin & UX
1. Admin dashboard (orders, products)
2. Guest checkout
3. Search autocomplete
4. Performance optimizations

### Sprint 7+ (Weeks 13+): Growth Features
1. Wishlist sharing/notifications
2. Recently viewed
3. Newsletter
4. Loyalty program
5. PWA

---

## Notes for Implementation

1. **Database Migrations**: Each schema change needs a Prisma migration
2. **Environment Variables**: Add Stripe keys, email service keys, search engine keys
3. **Type Safety**: Update TypeScript interfaces when adding API fields
4. **Testing**: Write tests alongside features, not after
5. **Documentation**: Update API docs (Swagger/OpenAPI) with new endpoints
6. **Feature Flags**: Consider feature flags for gradual rollouts

---

*Last Updated: 2026-07-23*
*Project: angular-shopping-app*