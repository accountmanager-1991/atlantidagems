# Session Status

**Project:** Ambar & Larimar Shop (formerly Atlantida Gems)
**Last Updated:** 2026-04-24
**Session:** 14

---

## Current Focus

**What I'm working on right now:**
> Session 14 — Two major bodies of work shipped together: (1) **Inventory + P&L module** with SKU generator, cost breakdown, stock auto-decrement, Dashboard + Inventory tabs; (2) **Brand identity redesign** to "Caribbean Sun" Concept A with full asset kit (logo system, social banners, IG templates, Etsy assets, business cards, brand guide PDF, Drive-ready folders).

**Why this matters:**
> Owner now has full operational visibility (margin per product, live KPIs, no overselling risk) AND a complete, on-brand visual identity ready to deploy across every social channel and print surface. Site fully aligned with the new brand. TD012 closed. v1.1.0 + v1.2.0 shipped.

---

## Completed This Session (Session 14) — Brand Identity Redesign

| Task | Status | Notes |
|------|--------|-------|
| **Logo design (Concept A "Caribbean Sun")** | Done | Circular seal with amber sunburst + larimar waves + real DR silhouette + map pins |
| Real DR outline embedded | Done | Sourced from open-source mapsicon, traced via potrace, embedded with `vector-effect="non-scaling-stroke"` |
| Master logo SVGs | Done | `brand-kit/01-LOGOS/final-2026-04/logo-mark.svg` + `logo-horizontal.svg` |
| Logo PNG exports (23 sizes) | Done | 32 / 48 / 64 / 128 / 180 / 192 / 256 / 320 / 400 / 512 / 800 / 1024 / 2048 + favicons + horizontal widths |
| Site logo swap (Header/Footer) | Done | `logo-mark-2026-04.svg` in [Header.tsx](src/components/layout/Header.tsx), [Footer.tsx](src/components/layout/Footer.tsx) |
| Favicon system | Done | `favicon-{16,32,48,192}.png` + `apple-touch-icon.png` wired into `metadata.icons` |
| OpenGraph image rebuild | Done | Now includes the logo + brand colors (was text-only) |
| Tailwind palette gold-deep | Done | Added `--color-gold-deep: #8A6418` for parity with brand-kit |
| Social media banners (light + dark) | Done | Facebook, X, LinkedIn, YouTube, Pinterest, Etsy (icon + big + mini + listing template) |
| Instagram product templates (light + dark) | Done | Square 1080×1080, Portrait 1080×1350, Story 1080×1920 with framed center zones |
| Business cards (print-ready) | Done | 3.5"×2", 1/8" bleed, 300 DPI, crop marks, light + dark, front + back |
| Brand Guide PDF | Done | 8 pages: cover, story, logo, palette (12 swatches w/ hex/RGB/CMYK), typography, social specs, print, resources |
| Google-Drive-ready folders | Done | 10 numbered subfolders in `brand-kit/google-drive-ready/` with READMEs per platform |
| **LOGO-EVERYWHERE consolidated folder** | Done | 8 use-case-named subfolders (Master / Profiles / Favicons / App icons / Print / Watermark / Email / Stamps) |
| Brand-aligned preview pages | Done | `public/brand-preview.css` loads Cinzel/Cormorant/Montserrat from Google Fonts; applied to all 3 preview pages |
| `docs/BRAND.md` | Done | Comprehensive brand asset reference |
| `docs/CLAUDE.md` + `docs/PROJECT-BRIEF.md` | Done | Removed broken `brand-assets/atlantida-*` references, point to new brand-kit paths |
| 6 generator scripts in `scripts/` | Done | Reproducible kit — change a color, re-run, done |
| Installed `sharp` + `pdfkit` | Done | DevDeps for SVG→PNG and PDF generation |

## Completed This Session (Session 14) — Inventory + P&L Module

| Task | Status | Notes |
|------|--------|-------|
| Schema migration (6 new columns) | Done | `sku`, `stock_quantity`, `material_cost`, `labor_cost`, `packaging_cost`, `shipping_cost` + unique SKU index |
| SKU auto-generator | Done | `src/lib/sku.ts` — `AL-{STONE}{METAL}-{CAT}-{NNN}` format, DB-aware counter |
| SKU preview endpoint | Done | `/api/admin/sku/preview` for Regenerate button |
| Shared admin constants | Done | `src/lib/admin-constants.ts` — labels, `totalCost()`, `marginPct()`, `fmtUSD()` |
| Products POST — auto-SKU | Done | Generates SKU on create if blank |
| Products PUT — cost fields | Done | All 6 new columns persisted on update |
| Stripe webhook — stock decrement | Done | `GREATEST(0, qty - sold)` + auto low-stock / sold-out |
| InventoryManager component | Done | Sortable table, low-stock filter, CSV export, totals footer |
| DashboardPanel component | Done | 8 KPIs, 4 revenue cards, margin breakdowns (stone/metal/category), top/bottom 5, low-stock alerts |
| Admin edit modal — SKU + stock + costs | Done | SKU field with regenerate, stock qty input, 4 cost fields, live margin card |
| Admin upload UI redesign | Done | Big main preview + 3 thumb column, drag & drop, multi-file picker, hover "★ Set as main", URL inputs in `<details>` |
| 4-tab nav | Done | Dashboard · Products · Inventory · Orders |
| TD012 closed | Done | Auto-decrement implemented |
| Docs updated | Done | CHANGELOG v1.1.0 + v1.2.0, DECISIONS D020 + D021, TECH-DEBT, this file, BRAND.md |

## Post-Session 14 Deployment Checklist

1. **Run `/api/admin/setup`** on production Neon DB to apply the 6 new columns
2. **Backfill SKUs** for existing products (edit each → click Regenerate → save, or write a one-shot script)
3. **Enter cost data** per product (material/labor/packaging/shipping) so margin numbers are real
4. **Enter stock quantities** (numeric) so inventory dashboard shows real inventory

---

## Completed This Session (Session 13)

| Task | Status | Notes |
|------|--------|-------|
| Stripe account approved | Done | Live payments ready as of 2026-03-12 |
| Custom domain decided | Done | `ambarlarimarshop.com` |
| `NEXT_PUBLIC_BASE_URL` set on Vercel | Done | `https://ambarlarimarshop.com` |
| Memory saved (stripe + launch checklist) | Done | 2 memory files created |
| `STRIPE_SECRET_KEY` added to Vercel | Done | Rolled after accidental exposure, new key set |
| `STRIPE_WEBHOOK_SECRET` added to Vercel | Done | Webhook endpoint: `checkout.session.completed` |
| Custom domain connected | Done | DNS pointed from Squarespace to Vercel, SSL active |
| Redeployed to Vercel | Done | `vercel --prod` with all env vars |
| Site live at ambarlarimarshop.com | Done | Verified loading correctly |
| **Security audit** | Done | 3 critical issues found + fixed |
| **Rate limiting** | Done | `src/lib/rate-limit.ts` — in-memory, per-IP, 5 attempts/15min |
| **Admin login rate limiting** | Done | 429 + Retry-After header, remaining attempts shown |
| **Contact form rate limiting** | Done | 5 submissions/15min per IP |
| **Wholesale form rate limiting** | Done | 5 submissions/15min per IP |
| **Revalidate auth bypass fix** | Done | Null check for `REVALIDATE_SECRET` env var |
| **Security headers** | Done | X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy in `next.config.ts` |
| **Remove Resend** | Done | Uninstalled `resend` package, replaced with GHL in contact + wholesale routes |
| **Contact form → GHL** | Done | Upserts contacts with "contact-form" tag + custom fields |
| **Wholesale form → GHL** | Done | Upserts contacts with "wholesale-inquiry" tag + custom fields |
| **Pinterest domain verification** | Done | `p:domain_verify` meta tag in `layout.tsx` |
| **Social media profile kit** | Done | `scripts/generate-social-media-profiles.mjs` → Word doc |
| **Social media banners** | Done | `brand-kit/social-banners.html` — 12 banners for all platforms with download buttons |
| **n8n auto-poster deploy script** | Done | `n8n-workflows/deploy-social-autoposter.js` |
| **Stripe business name** | Done | Changed from "Emozca LLC" to "Ambar & Larimar Shop" |

## Still Pending

1. **Test full order flow** — checkout → Stripe → DB → GHL emails → WhatsApp → tracking
2. **Add real products** — Upload photos, set prices, generate AI descriptions
3. **Activate n8n WhatsApp workflow** — Select credential + activate in n8n UI
4. **Activate n8n social auto-poster** — Fix Anthropic credential, connect Google Drive, test, activate
5. **Rotate exposed credentials** — GHL key + n8n system user token (exposed in past sessions)
6. **Replace homepage placeholder images** — When owner has real product photos

## n8n Auto-Poster (from Session 12 — nearly done)

1. Fix Anthropic credential in n8n: Base URL = `https://api.anthropic.com`
2. Connect Google Drive credential in n8n UI
3. Drop test image in Google Drive `to-post` folder
4. Manual test → activate workflow
5. Workflow: *(open n8n dashboard to find workflow URL)*

## Completed Session 12

| Task | Status | Notes |
|------|--------|-------|
| n8n social media auto-poster workflow | Done | `n8n-workflows/social-media-autoposter.json` — 17 nodes, schedule 3x/day |
| Deploy script | Done | `n8n-workflows/deploy-social-autoposter.js` |
| Meta app setup | Done | "Atlantida Order Notifications" — Instagram + Pages use cases configured |
| Facebook Page ID obtained | Done | Page: "Ambar & Larimar Shop" *(ID in n8n vars)* |
| Instagram User ID confirmed | Done | *(ID in n8n vars)* |
| META_PAGE_ACCESS_TOKEN | Done | System user token via Emozca LLC Business Portfolio |
| Google Drive folders | Done | to-post + posted folders created, IDs added to n8n Variables |
| n8n Variables set | Done | All 5 variables added in n8n Settings → Variables |
| Workflow deployed | Done | *(see n8n dashboard)* |
| Anthropic credential | Blocked | Base URL must be `https://api.anthropic.com` (no trailing slash) |
| Google Drive credential | Pending | Need to connect Google account in n8n |
| Workflow activated | Pending | After credentials fixed |

---

## Completed This Session (Session 11)

| Task | Status | Notes |
|------|--------|-------|
| Subscription box market analysis | Done | Full analysis: costs, customer profiles, competition, 4 pricing tiers, revenue projections |
| Market analysis Word doc (EN) | Done | `Ambar-Larimar-Subscription-Market-Analysis.docx` in project root |
| Market analysis Word doc (ES) | Done | `Ambar-Larimar-Analisis-de-Mercado-ES.docx` in project root |
| Document generation scripts | Done | `scripts/generate-market-analysis.mjs` + `scripts/generate-market-analysis-es.mjs` |
| D018 decision recorded | Done | Subscription box added to DECISIONS.md |

---

## Completed This Session (Session 10)

| Task | Status | Notes |
|------|--------|-------|
| LLC formation | Done | Emozca LLC, Wyoming, filing number 2026-001915620, filed 03/11/2026 |
| EIN obtained | Done | Got EIN online same day — stored securely |
| Stripe account created | Done | Wise USD connected, pending 2-3 day verification |
| IRS 147C letter | Done | Requested via IRS phone, received via HelloFax, uploaded to Stripe |
| Replace Resend with GHL | Done | `src/lib/ghl.ts` — upserts contacts, adds tags, sets custom fields |
| GHL env vars on Vercel | Done | `GHL_PRIVATE_KEY` + `GHL_LOCATION_ID` added |
| 3 GHL email templates | Done | Customer confirmation, owner notification, shipping confirmation |
| Push to GitHub | Done | Commit `2937767` |

## Completed Session 9

| Task | Status | Notes |
|------|--------|-------|
| TD010: Secure admin session | Done | HMAC-SHA256 signed tokens replace raw password in cookie |
| TD011: Order access tokens | Done | `access_token` column, `crypto.randomBytes(16)`, verified on API + UI |
| TD015: Vercel Analytics | Done | `@vercel/analytics` + `@vercel/speed-insights` added to layout |
| TD016: JSON-LD structured data | Done | schema.org Product on `/shop/[slug]` pages |
| TD003: Cloudinary image optimization | Done | `optimizeImage()` with `c_limit,w_{width},q_auto,f_auto` transforms |
| TD006: Remove Google Sheets code | Done | Deleted `google-sheets.ts`, removed `googleapis` package |
| TD007: Remove Cloudinary SDK | Done | Removed unused `cloudinary` package |
| Fix React hydration error #418 | Done | AppProvider always renders Provider wrapper (was Fragment vs Provider mismatch) |
| Deploy to Vercel production | Done | Commits `1ac158a` + `bd0041d` deployed |
| Run `/api/admin/setup` on production | Done | `access_token` column added to orders table |
| Push to GitHub | Done | All changes on `github.com/accountmanager-1991/atlantidagems` |

## Completed Session 8

| Task | Status | Notes |
|------|--------|-------|
| Commit + push Session 7 doc updates | Done | `a932eac` — SESSION-STATUS, DECISIONS, TECH-DEBT, CHANGELOG pushed to GitHub |
| Run `/api/admin/setup` on production | Done | 7 DB indexes created on production Neon Postgres |
| Update MEMORY.md | Done | Added Session 7 info, GitHub repo URL, version v0.7.0, D001-D017 |

## Completed Session 7

| Task | Status | Notes |
|------|--------|-------|
| Full site audit (tech debt + missing features) | Done | 40+ items identified across security, SEO, performance, features |
| Fix checkout DB failure handling | Done | Checkout now fails with 500 if order can't save to DB |
| Add input validation (checkout) | Done | Email regex, shipping field checks, cart item validation |
| Add input validation (contact form) | Done | JSON parse error handling, type checks, length limits, email regex |
| Add input validation (wholesale inquiry) | Done | Required fields, email validation, length limits |
| HTML escaping in email templates | Done | `escapeHtml()` on all user data (names, emails, addresses, images, tracking) |
| Add sitemap.xml | Done | Dynamic sitemap with static pages + DB product slugs |
| Add robots.txt | Done | Blocks `/admin`, `/api/`, `/checkout/success` from crawlers |
| Add error.tsx | Done | Branded error page with "Try Again" button |
| Add not-found.tsx | Done | Branded 404 with "Back to Home" and "Browse Shop" links |
| Add OG image | Done | Dynamic `opengraph-image.tsx` (1200x630, ocean gradient, brand name) |
| Add metadataBase + twitter card | Done | `layout.tsx` updated with `metadataBase`, twitter card config, locale |
| Add database indexes (7) | Done | products.slug, visible, category; orders.email, status, created_at, stripe_session |
| Remove hardcoded n8n API key | Done | Deploy script now reads from `N8N_API_KEY` env var |
| Initialize git repo | Done | `git init`, configured user, initial commit |
| Install GitHub CLI | Done | `winget install GitHub.cli` |
| Create GitHub repo + push | Done | https://github.com/accountmanager-1991/atlantidagems (public) |
| Deploy to Vercel production | Done | https://ambarlarimarshop.vercel.app |

## Completed Session 6

| Task | Status | Notes |
|------|--------|-------|
| Email templates (3 branded) | Done | Customer confirmation, owner notification (with images), shipping confirmation |
| Stripe webhook rewrite | Done | Parallel notifications: customer email + owner email + n8n WhatsApp |
| Order management admin tab | Done | Full OrdersManager component with status updates, tracking, notes |
| Order tracking page | Done | `/order/[id]` — visual progress bar, tracking links, order details |
| Public order API | Done | `/api/orders/[id]` — no auth, excludes sensitive fields |
| Admin orders API | Done | GET all orders + PUT update (status, tracking, carrier, notes) |
| Shipping email trigger | Done | Admin can send shipping confirmation when adding tracking number |
| Order tracking DB columns | Done | `tracking_number`, `tracking_carrier`, `shipped_at`, `notes` on orders table |
| Success page order tracking | Done | Shows order ID + "Track Your Order" button after checkout |
| Email preview endpoint | Done | `/api/admin/preview-email` with sample data for all 3 templates |
| WhatsApp Business Cloud setup | Done | Meta Developer Portal, Emozca LLC portfolio, system user + permanent token |
| n8n WhatsApp workflow | Done | Deployed via API — Webhook → WhatsApp Notification *(ID in n8n dashboard)* |
| N8N_ORDER_WEBHOOK_URL on Vercel | Done | Production env var configured |

## Completed Session 5

| Task | Status | Notes |
|------|--------|-------|
| Stripe Checkout integration | Done | Full hosted checkout with Stripe Sessions API |
| Checkout page with shipping form | Done | Two-column layout: shipping info + order summary |
| Order confirmation page | Done | `/checkout/success` with translated thank-you message |
| Stripe webhook handler | Done | Verifies signature, updates order status, sends email notification |
| Orders database table | Done | Added to `initDatabase()` in `db.ts` |
| Cart → Checkout CTA update | Done | Primary button now goes to `/checkout`, email kept as secondary |
| CartDrawer shipping display | Done | Shows subtotal, shipping ($19.99 or FREE over $250), total in USD |
| Cart item images | Done | Real product thumbnails instead of placeholder `<span>IMG</span>` |
| Checkout translations (EN/ES/DE) | Done | 17 new translation keys for checkout flow |
| Lazy Stripe initialization | Done | `getStripe()` pattern avoids build-time errors when no API key |
| LLC/EIN guidance | Done | Recommended Northwest Registered Agent (~$279 total) |
| Form SS-4 guidance | Done | Walked through every field for foreign national (no SSN) |

## Completed Session 4

| Task | Status | Notes |
|------|--------|-------|
| Fix Cloudinary upload — wrong cloud name | Done | Was `atlantidagems`, actual cloud name is `dlk6s7llm` |
| Fix Cloudinary upload — SDK incompatible | Done | Switched from `cloudinary` SDK to unsigned REST API upload |
| Create unsigned upload preset | Done | Preset `atlantida_unsigned` on cloud `dlk6s7llm` |
| Fix upload button not triggering file picker | Done | Replaced hidden `<input>` in `<label>` with programmatic `document.createElement("input")` |
| Add error alerts to upload flow | Done | Browser `alert()` shows exact Cloudinary error on failure |
| Fix product images not showing on shop/detail pages | Done | ProductCard + ProductGallery now render real `imageMain` |
| Add auto-revalidation on admin save | Done | PUT/POST/DELETE endpoints call `revalidatePath()` |
| Add arrow navigation to product gallery | Done | Left/right arrows (hover), dot indicators, clickable thumbnails |
| Add `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` to Vercel | Done | Was missing from production env vars |
| Add multilingual AI descriptions (EN/ES/DE) | Done | One-click generation via Claude Haiku API |
| Bilingual admin panel (EN/ES) | Done | Full translation with localStorage-persisted language toggle |
| ProductDescription client component | Done | Language-aware description display using `useApp()` locale |
| ProductGallery client component | Done | Image gallery with state management for selected image |

---

## Completed Previously (Sessions 1-3)

| Task | Status | Notes |
|------|--------|-------|
| Business case & financials | Done | Jewelry export wins, $49K/mo base case |
| Brand identity (name, logo, colors) | Done | Atlantida Gems / Ambar & Larimar Shop |
| Next.js website build | Done | Full site: shop, wholesale, blog, contact, FAQ |
| i18n (EN/ES/DE) | Done | Client-side React Context |
| Google Sheets product backend | Done | Fallback data source |
| Cart + checkout (email-based) | Done | Contact mode for pre-LLC phase |
| Hero redesign (split layout 70/30) | Done | Navy text + image slideshow, mobile-responsive |
| WhatsApp → Phone/Email migration | Done | Updated ~15 files |
| Privacy Policy + Terms of Service | Done | `/privacy` and `/terms` pages |
| Admin Dashboard (`/admin`) | Done | Full CRUD with bilingual UI (EN/ES) |
| Neon Postgres setup | Done | DATABASE_URL configured, products table created |
| Vercel env vars | Done | All configured for production |

---

## Infrastructure Status

| Service | Status | Details |
|---------|--------|---------|
| Vercel (hosting) | **Live** | ambarlarimarshop.com + ambarlarimarshop.vercel.app |
| GitHub | Active | github.com/accountmanager-1991/atlantidagems (public) |
| Neon Postgres | Connected | DATABASE_URL set, products + orders tables, 7 indexes |
| Cloudinary | Connected | Unsigned upload via REST API, cloud: `dlk6s7llm`, preset: `atlantida_unsigned` |
| Admin Auth | Active | HMAC-SHA256 signed session tokens (upgraded Session 9) |
| Anthropic API | Connected | Claude Haiku for AI descriptions (EN/ES/DE) |
| GoHighLevel (email) | Active | Replaced Resend — `GHL_PRIVATE_KEY` + `GHL_LOCATION_ID` on Vercel |
| Stripe | **Live** | Keys + webhook configured. Business name: "Ambar & Larimar Shop". Payments: Cards, Apple Pay, Amazon Pay, Cash App, Klarna, Link |
| WhatsApp Business Cloud | Configured | Meta App "Atlantida Order Notifications", system user `n8n-bot`, permanent token |
| n8n (WhatsApp workflow) | Deployed (not activated) | Needs credential selection + activation in n8n UI |
| Custom domain | **Live** | `ambarlarimarshop.com` — DNS via Squarespace, SSL active |
| LLC (Wyoming) | **Complete** | Emozca LLC, filing 2026-001915620, EIN obtained |

---

## Next Up — Phase 2 (Launch Blockers)

1. ~~**Complete LLC formation**~~ — **Done (Session 10)** — Emozca LLC, Wyoming
2. ~~**Get EIN**~~ — **Done (Session 10)** — obtained same day online
3. ~~**Activate Stripe**~~ — **Approved (Session 13, 2026-03-12)** — live payments ready
4. ~~**Configure email**~~ — **Done (Session 10)** — GHL replaces Resend
5. ~~**Set `NEXT_PUBLIC_BASE_URL`**~~ — **Done (Session 13)** — `https://ambarlarimarshop.com`
6. ~~**Add `STRIPE_SECRET_KEY` to Vercel**~~ — **Done (Session 13)** — rolled after chat exposure, new key active
7. ~~**Create Stripe webhook + add `STRIPE_WEBHOOK_SECRET`**~~ — **Done (Session 13)** — `checkout.session.completed`
8. ~~**Custom domain**~~ — **Done (Session 13)** — `ambarlarimarshop.com` DNS via Squarespace → Vercel, SSL active
9. **Activate n8n WhatsApp workflow** — Open workflow in n8n, select WhatsApp credential, activate
10. ~~**Run `/api/admin/setup`** on production~~ — **Done (Session 8)**
11. ~~**Add Google Analytics / Vercel Analytics**~~ — **Done (Session 9)**
12. ~~**Redeploy to Vercel**~~ — **Done (Session 13)** — all env vars set
13. **Test full order flow** — End-to-end: checkout → Stripe → DB → GHL emails → WhatsApp → tracking

## Next Up — Phase 3 (Growth Features)

1. ~~**JSON-LD structured data**~~ — **Done (Session 9)**
2. ~~**Image optimization**~~ — **Done (Session 9)**
3. **Inventory management** — Decrement stock on purchase
4. ~~**Admin session security**~~ — **Done (Session 9)**
5. ~~**Order access control**~~ — **Done (Session 9)**
6. ~~**Rate limiting**~~ — **Done (Session 13)** — In-memory rate limiter on admin login + contact + wholesale (TD005)
7. **Newsletter signup** — Email capture + GoHighLevel integration
8. **n8n social media automation** — Auto-posting pipeline (2-3x/day)
9. **Product search** — Search bar on shop page
10. **Product reviews/testimonials** — Social proof for high-value items
11. **Abandoned cart recovery** — Follow-up mechanism for incomplete checkouts
12. ~~**Remove dead code**~~ — **Done (Session 9)**
13. **Add real products** — Upload photos, set prices, generate AI descriptions
14. **Subscription box** — Analysis done (Session 11). Build subscription plan selector, recurring billing, subscriber dashboard (see D018)

---

## Key Files Reference

### Admin Panel
| File | Purpose |
|------|---------|
| `src/app/admin/page.tsx` | Admin page entry |
| `src/components/admin/AdminDashboard.tsx` | Full CRUD admin UI (~700 lines), bilingual EN/ES |
| `src/lib/db.ts` | Neon Postgres connection + schema + indexes |
| `src/lib/admin-auth.ts` | Cookie-based auth |
| `src/app/api/admin/auth/route.ts` | Login/logout API |
| `src/app/api/admin/products/route.ts` | GET all / POST new product (with revalidation) |
| `src/app/api/admin/products/[id]/route.ts` | PUT update / DELETE product (with revalidation) |
| `src/app/api/admin/setup/route.ts` | Database initialization + indexes |
| `src/app/api/admin/upload/route.ts` | Cloudinary unsigned upload via REST API |
| `src/app/api/admin/generate/route.ts` | AI description generation (EN/ES/DE) |

### Product Display
| File | Purpose |
|------|---------|
| `src/components/products/ProductCard.tsx` | Shop grid card (renders real images) |
| `src/components/products/ProductGallery.tsx` | Detail page gallery (arrows, dots, thumbnails) |
| `src/components/products/ProductDescription.tsx` | Language-aware description (uses locale context) |

### Checkout & Payments
| File | Purpose |
|------|---------|
| `src/lib/stripe.ts` | Stripe config, lazy init, shipping constants |
| `src/app/api/checkout/route.ts` | Creates Stripe sessions, validates input, saves order (fails if DB fails) |
| `src/app/api/webhook/stripe/route.ts` | Stripe webhook — parallel notifications (email + WhatsApp) |
| `src/app/checkout/page.tsx` | Checkout page with shipping form + order summary |
| `src/app/checkout/success/page.tsx` | Order confirmation with tracking link |

### Order Management & Notifications
| File | Purpose |
|------|---------|
| `src/lib/email-templates.ts` | 3 branded HTML email templates (with HTML escaping) |
| `src/components/admin/OrdersManager.tsx` | Admin order management UI (~300 lines) |
| `src/app/api/admin/orders/route.ts` | GET all orders (admin) |
| `src/app/api/admin/orders/[id]/route.ts` | PUT update order (status, tracking, send shipping email) |
| `src/app/api/orders/[id]/route.ts` | Public order tracking API (no auth) |
| `src/app/order/[id]/page.tsx` | Customer order tracking page with progress bar |
| `src/app/api/admin/preview-email/route.ts` | Email template preview with sample data |
| `n8n-workflows/atlantida-order-notifications.json` | n8n workflow definition (Webhook → WhatsApp) |
| `n8n-workflows/deploy-whatsapp-notifications.js` | Deploy script (reads N8N_API_KEY from env) |

### SEO & Error Handling (Session 7)
| File | Purpose |
|------|---------|
| `src/app/sitemap.ts` | Dynamic sitemap with static + product pages |
| `src/app/robots.ts` | Blocks admin/API from crawlers |
| `src/app/opengraph-image.tsx` | Dynamic 1200x630 branded OG image |
| `src/app/error.tsx` | Branded error page with retry |
| `src/app/not-found.tsx` | Branded 404 page |

### Product Data Flow
| Priority | Source | Status |
|----------|--------|--------|
| 1st | Neon Postgres | Active — 1 product with image |
| 2nd | Mock data | Safety net (8 placeholder products) |

---

## Env Vars Needed for Full Activation

| Variable | Where | Status | Notes |
|----------|-------|--------|-------|
| `STRIPE_SECRET_KEY` | Vercel | **Done** | Added Session 13 (rolled after exposure, new key active) |
| `STRIPE_WEBHOOK_SECRET` | Vercel | **Done** | Webhook: `checkout.session.completed` at `ambarlarimarshop.com/api/webhook/stripe` |
| `NEXT_PUBLIC_BASE_URL` | Vercel | **Done** | `https://ambarlarimarshop.com` (set 2026-03-12) |
| `GHL_PRIVATE_KEY` | Vercel | **Done** | GoHighLevel replaces Resend |
| `GHL_LOCATION_ID` | Vercel | **Done** | GoHighLevel location |
| `N8N_ORDER_WEBHOOK_URL` | Vercel | **Done** | *(n8n webhook URL — see Vercel env vars)* |

---

## Known Issues / Bugs

| Issue | Severity | Status | Notes |
|-------|----------|--------|-------|
| ~~No rate limiting on login/forms~~ | ~~Medium~~ | **Resolved** | Rate limiting added (Session 13) — 5 attempts/15min per IP on admin login, contact, wholesale |
| ~~Resend not configured~~ | ~~Medium~~ | **Resolved** | Replaced by GHL (Session 10) |
| ~~No custom domain~~ | ~~Medium~~ | **Resolved** | `ambarlarimarshop.com` connected (Session 13) |
| Mock data shows alongside real products | Low | By design | Falls back to mock when DB has 0 visible products |
| Featured Pieces empty on homepage | Low | Expected | No products have `featured=true` — toggle in admin |
| Cart images stale if product added before image upload | Low | Known | Clear cart and re-add product to refresh |
| ~~No analytics~~ | ~~Medium~~ | **Resolved** | Vercel Analytics + Speed Insights added (Session 9) |

---

## WhatsApp Business Cloud Integration

| Detail | Value |
|--------|-------|
| Meta App | Atlantida Order Notifications |
| Business Portfolio | Emozca LLC |
| Phone Number ID | *(see Vercel env vars / Meta Business Settings)* |
| WhatsApp Business Account ID | *(see Meta Business Settings)* |
| System User | `n8n-bot` *(see Meta Business Settings)* |
| n8n Instance | *(see n8n dashboard)* |
| n8n Workflow ID | *(see n8n dashboard)* |
| Webhook URL | *(stored in Vercel env `N8N_ORDER_WEBHOOK_URL`)* |
| Recipient | *(owner's WhatsApp — see n8n workflow config)* |

---

*Last context save: 2026-03-12 — Session 13. SITE IS LIVE at ambarlarimarshop.com. All launch blockers resolved. Security audit: rate limiting on all forms (5/15min per IP), security headers in next.config.ts, revalidate auth bypass fixed, Resend removed & replaced with GHL on contact + wholesale routes. Pinterest domain verified. Social media profile kit generated as Word doc. Social media banners created for all platforms (brand-kit/social-banners.html) with download buttons. Stripe business name = "Ambar & Larimar Shop". Remaining: add real products, test full order pipeline, activate n8n workflows, rotate exposed credentials.*
