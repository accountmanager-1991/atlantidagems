# Changelog

All notable changes to the Ambar & Larimar Shop project.

---

## [0.6.0] - 2026-03-09 — Order Management, Notifications & Tracking

### Added
- **Email templates** (`email-templates.ts`) — 3 branded HTML templates: customer confirmation, owner notification (with product images), shipping confirmation (with tracking link)
- **Order management admin tab** — `OrdersManager.tsx` component with order list, detail view, status updates, tracking number input, carrier selection, notes
- **Order tracking page** (`/order/[id]`) — customer-facing progress bar (Placed → Paid → Shipped → Delivered), tracking links per carrier
- **Admin orders API** (`/api/admin/orders`) — GET all orders, PUT update order (status, tracking, carrier, notes, send shipping email)
- **Public order API** (`/api/orders/[id]`) — no-auth endpoint for order tracking (excludes sensitive fields)
- **Email preview** (`/api/admin/preview-email`) — preview all 3 email templates with sample data
- **WhatsApp Business Cloud integration** — Meta Developer Portal app, system user `n8n-bot`, permanent token
- **n8n WhatsApp workflow** — Webhook → WhatsApp Notification, deployed via API (ID: `zQ1QFgkwEpcP6YZW`)
- **Shipping confirmation trigger** — admin checkbox to auto-send shipping email + WhatsApp when adding tracking

### Changed
- **Stripe webhook** rewritten — now sends 3 parallel notifications: customer email, owner email (with images), n8n WhatsApp webhook
- **Success page** — now shows order ID + "Track Your Order" button (reads `order_id` from URL params)
- **Checkout API** — success URL now includes `order_id` parameter
- **AdminDashboard** — added tab navigation (Products / Orders) with `OrdersManager` component
- **Database schema** — added `tracking_number`, `tracking_carrier`, `shipped_at`, `notes` columns to orders table

### Infrastructure
- Deployed n8n workflow via REST API to `emozca.app.n8n.cloud`
- Added `N8N_ORDER_WEBHOOK_URL` to Vercel production env
- WhatsApp Business Cloud API configured (Meta App: "Atlantida Order Notifications")

---

## [0.5.0] - 2026-03-09 — Stripe Checkout & Payment Integration

### Added
- **Stripe Checkout integration** — full hosted payment flow via Stripe Sessions API
- **Checkout page** (`/checkout`) — two-column layout with shipping form + order summary
- **Order confirmation page** (`/checkout/success`) — translated thank-you with continue shopping CTA
- **Stripe webhook** (`/api/webhook/stripe`) — verifies signature, updates order to 'paid', sends email notification
- **Orders database table** — tracks orders with customer info, items, shipping, Stripe IDs, payment status
- **Shipping fee logic** — $19.99 flat rate, free over $250 (constants in `stripe.ts`)
- **Cart item images** — real product thumbnails in cart page and CartDrawer (replaced placeholders)
- **CartDrawer shipping display** — shows subtotal, shipping line, free shipping prompt, total in USD
- **Checkout translations** — 17 new keys in EN/ES/DE for full checkout flow
- **Lazy Stripe initialization** — `getStripe()` pattern prevents build-time errors when no API key

### Changed
- **Cart CTA** — primary button now goes to `/checkout` page; email ordering kept as secondary option
- **CartDrawer CTA** — matches cart page with checkout link + email fallback

### Infrastructure
- Installed `stripe` and `@stripe/stripe-js` npm packages
- New env vars needed: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_BASE_URL`, `RESEND_API_KEY`
- Orders table created via `/api/admin/setup` endpoint

---

## [0.4.0] - 2026-03-09 — Image Uploads, Gallery & Auto-Revalidation

### Added
- **Cloudinary image uploads** working via unsigned upload preset (REST API)
- **Product image gallery** on detail page with left/right arrows, dot indicators, and clickable thumbnails
- **Real images on shop grid** — ProductCard renders uploaded images instead of placeholders
- **Auto-revalidation** — admin save/create/delete automatically refreshes cached public pages
- **AI-generated multilingual descriptions** — one-click generation in EN/ES/DE via Claude Haiku
- **Bilingual admin panel** (English/Spanish) with language toggle saved to localStorage
- **ProductDescription component** — language-aware description switching based on user locale
- **ProductGallery component** — client-side image gallery with state management
- **Upload error alerts** — browser alerts show exact Cloudinary error for debugging

### Changed
- **Upload route** rewritten from Cloudinary SDK to direct REST API call (SDK incompatible with Vercel serverless)
- **Upload button** changed from hidden `<input>` in `<label>` to programmatic file picker (more reliable)
- **Admin save/create/delete** now call `revalidatePath()` for `/shop`, `/api/products`, `/shop/[slug]`, `/`

### Fixed
- **Cloudinary cloud name mismatch** — was `atlantidagems` (assumed), actual is `dlk6s7llm`
- **Cloudinary SDK errors** — `[object Object]` on Vercel serverless; replaced with REST API
- **Missing `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`** on Vercel production env vars
- **Upload button not triggering** file picker dialog in some browsers
- **Product images not showing** on public pages (were showing placeholder gradients)
- **Stale cache after admin saves** — pages now revalidate immediately via `revalidatePath()`

### Infrastructure
- Added Vercel env vars: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `ANTHROPIC_API_KEY`
- Created Cloudinary unsigned upload preset: `atlantida_unsigned` on cloud `dlk6s7llm`

---

## [0.3.0] - 2026-03-09 — Admin Panel & Database

### Added
- **Admin Dashboard** at `/admin` — full product CRUD (add, edit, delete)
- **Neon Postgres** integration as primary product database
- **Cloudinary** image upload for product photos
- **Cookie-based admin authentication** with password from env var
- **Database initialization** endpoint (`/api/admin/setup`)
- **Privacy Policy** page at `/privacy`
- **Terms of Service** page at `/terms`
- Footer links to Privacy Policy and Terms of Service

### Changed
- **Hero section** redesigned: 70/30 split layout (navy text area + image slideshow)
- **Contact info** updated: WhatsApp replaced with phone (`809-919-4205`) and email (`sales@ambarlarimarshop.com`)
- **Cart checkout** changed from WhatsApp to email-based ordering
- **Wholesale form section** redesigned: cream background, side-by-side layout
- **Product data flow**: Neon Postgres → Google Sheets → Mock data (three-tier fallback)

### Fixed
- **Heading readability** on dark backgrounds — removed global CSS color override that blocked Tailwind classes
- **Hero badge text** cutoff ("REPUBLIC" → "DOMINICAN REPUBLIC") — widened text area + reduced letter-spacing

### Infrastructure
- Added Vercel env vars: `DATABASE_URL`, `ADMIN_PASSWORD`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Deployed to production with all new features

---

## [0.2.0] - 2026-03-09 — Full Website Build

### Added
- Complete Next.js App Router website
- Shop page with product grid and filtering
- Product detail pages with image gallery
- Wholesale portal with inquiry form
- Blog with 3 articles (Larimar, Amber, jewelry care)
- Contact page with form
- FAQ page
- Cart with drawer and full page views
- i18n support (English, Spanish, German)
- Google Sheets product data integration
- Responsive design (mobile-first)

---

## [0.1.0] - 2026-03-09 — Project Foundation

### Added
- Business case analysis and financial model
- Brand identity: Atlantida Gems / Ambar & Larimar Shop
- Logo design (Wave x Gem concept)
- Brand assets (SVG, business card, color palette)
- Project documentation (CLAUDE.md, SESSION-STATUS.md, PROJECT-BRIEF.md)
