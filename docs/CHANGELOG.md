# Changelog

All notable changes to the Ambar & Larimar Shop project.

---

## [1.0.0] - 2026-03-12 — Launch: Security Hardening, Rate Limiting, Social Media Kit

### Security
- **Rate limiting** — new `src/lib/rate-limit.ts` (in-memory, per-IP, 5 attempts/15min)
- **Admin login rate limiting** — 429 + Retry-After header, shows remaining attempts
- **Contact form rate limiting** — 5 submissions/15min per IP
- **Wholesale form rate limiting** — 5 submissions/15min per IP
- **Revalidate auth bypass fix** — null check for `REVALIDATE_SECRET` env var
- **Security headers** — X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy in `next.config.ts`

### Changed
- **Contact form** — removed Resend, replaced with GoHighLevel contact upsert (tag: "contact-form")
- **Wholesale form** — removed Resend, replaced with GoHighLevel contact upsert (tag: "wholesale-inquiry")
- **Removed `resend` package** — fully replaced by GHL across all endpoints

### Added
- **Pinterest domain verification** — `p:domain_verify` meta tag in `layout.tsx`
- **Social media profile kit** — `scripts/generate-social-media-profiles.mjs` generates Word doc with all platform profiles
- **Social media banners** — `brand-kit/social-banners.html` — 12 banners (Facebook, Twitter, Pinterest, Instagram x6, Profile, OG, YouTube) with one-click download buttons
- **n8n auto-poster deploy script** — `n8n-workflows/deploy-social-autoposter.js`
- **n8n auto-poster workflow** — `n8n-workflows/social-media-autoposter.json`

### Infrastructure
- Stripe approved + keys + webhook configured (2026-03-12)
- Custom domain `ambarlarimarshop.com` live (Squarespace DNS → Vercel, SSL active)
- Stripe business name changed to "Ambar & Larimar Shop"
- All Vercel env vars configured

---

## [0.9.0] - 2026-03-11 — Subscription Box Strategy & GHL Email Integration

### Added
- **Subscription box market analysis** — Full pricing strategy, customer profiles, competitive landscape, revenue projections at 3K subscribers (D018)
- **Market analysis documents** — EN + ES Word docs (`Ambar-Larimar-Subscription-Market-Analysis.docx`, `Ambar-Larimar-Analisis-de-Mercado-ES.docx`)
- **Document generation scripts** — `scripts/generate-market-analysis.mjs` + `scripts/generate-market-analysis-es.mjs` (Node.js + `docx` package)
- **GHL email integration** — `src/lib/ghl.ts` replaces Resend; upserts contacts with tags and custom fields
- **3 GHL email templates** — Customer confirmation, owner notification, shipping confirmation created in GHL dashboard

### Business
- LLC: Emozca LLC (Wyoming) — filed 2026-03-11, filing number 2026-001915620
- EIN: Obtained same day (2026-03-11) via IRS online
- Stripe: Account created with Wise USD, pending 2-3 day verification
- IRS 147C letter: Received via HelloFax, uploaded to Stripe

### Infrastructure
- `GHL_PRIVATE_KEY` + `GHL_LOCATION_ID` added to Vercel env vars
- `docx` npm package added as dev dependency for document generation
- Commit: `2937767`

---

## [0.8.0] - 2026-03-10 — Security Upgrades, Image Optimization & Hydration Fix

### Security
- **Admin session tokens** — replaced raw password in cookie with HMAC-SHA256 signed tokens (nonce + signature, timing-safe comparison)
- **Order access tokens** — orders now require `?token=` parameter; tokens generated with `crypto.randomBytes(16)` and stored in DB

### Added
- **Vercel Analytics** (`@vercel/analytics/next`) — traffic + Web Vitals tracking
- **Vercel Speed Insights** (`@vercel/speed-insights/next`) — performance monitoring
- **JSON-LD structured data** — schema.org Product type on `/shop/[slug]` pages (name, price, availability, images, brand)
- **Cloudinary image optimization** — `optimizeImage()` function adds `c_limit,w_{width},q_auto,f_auto` transforms to URLs
- **Order `access_token` DB column** — added via migration in `/api/admin/setup`

### Changed
- **ProductCard** — images optimized to 400px width via Cloudinary transforms
- **ProductGallery** — main image 800px, thumbnails 200px via Cloudinary transforms
- **Checkout API** — generates access token, includes in Stripe success URL and email templates
- **Order tracking** — requires token in URL (`/order/[id]?token=xxx`)
- **Stripe webhook** — passes access token to email templates for tracking links

### Fixed
- **React hydration error #418** — AppProvider always renders `<AppContext.Provider>` wrapper (was conditionally rendering Fragment vs Provider, causing tree structure mismatch)
- **Cloudinary cloud name** in `cloudinary.ts` — corrected from `ambarlarimarshop` to `dlk6s7llm`

### Removed
- **Google Sheets code** — deleted `src/lib/google-sheets.ts`, removed `googleapis` package
- **Cloudinary SDK** — removed unused `cloudinary` package (using REST API since Session 4)

### Infrastructure
- Commits: `1ac158a` (v0.8.0), `bd0041d` (hydration fix)
- Production DB updated via `/api/admin/setup` (access_token column)
- 7 tech debt items resolved (TD003, TD006, TD007, TD010, TD011, TD015, TD016)

---

## [0.7.0] - 2026-03-09 — Security Hardening, SEO & GitHub

### Added
- **Sitemap** (`sitemap.ts`) — dynamic sitemap with static pages + product slugs from DB
- **Robots.txt** (`robots.ts`) — blocks `/admin`, `/api/`, `/checkout/success` from crawlers
- **OpenGraph image** (`opengraph-image.tsx`) — dynamic 1200x630 branded image (ocean gradient, gold accents)
- **Error page** (`error.tsx`) — branded error page with "Try Again" button
- **404 page** (`not-found.tsx`) — branded not-found with "Back to Home" and "Browse Shop" links
- **Database indexes** (7) — products.slug, visible, category; orders.email, status, created_at, stripe_session
- **Twitter card metadata** — `summary_large_image` card in layout.tsx
- **`metadataBase`** in layout — proper base URL for OG image resolution

### Changed
- **Checkout API** — now fails with 500 if DB order creation fails (was silently continuing)
- **Checkout validation** — server-side email regex, shipping field checks, cart item validation
- **Contact form** — JSON parse error handling, type checks, length limits, email regex
- **Wholesale inquiry** — required field validation, email format check, length limits
- **Email templates** — `escapeHtml()` on all user-provided data (XSS prevention)
- **n8n deploy script** — removed hardcoded API key, reads from `N8N_API_KEY` env var

### Infrastructure
- Initialized git repo, pushed to GitHub: `github.com/accountmanager-1991/atlantidagems`
- Installed GitHub CLI via winget
- Deployed to Vercel production

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
