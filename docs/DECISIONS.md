# Architecture & Design Decisions

**Project:** Ambar & Larimar Shop
**Last Updated:** 2026-04-24 (Session 14)

---

## D021: Brand Identity Redesign — "Caribbean Sun" Concept A + Dual-Theme Kit

**Date:** 2026-04-24
**Status:** Implemented

**Context:** Original "Atlantida Gems" brand was generic. Owner needed an attention-grabbing identity rooted in Dominican Republic + Larimar + Amber, with a complete asset kit ready for every social channel + print, in both light and dark variants.

**Decision:** Adopt **Concept A "Caribbean Sun"** — circular seal with amber sunburst on top, larimar waves below, real DR silhouette at center with three map pins (larimar at Barahona, amber at Puerto Plata, gold star at Santo Domingo), gold horizon line, double gold ring outline. Build the full asset kit as a code-generated system.

### Why Concept A (vs. B "Drop Monogram" or C "Taíno Sun")
- Most attention-grabbing at small sizes (profile pic, favicon)
- Tells the brand origin story in one glance: sun, sea, island, two stones, pinned to where they're mined
- Easy to drop on any background (cream, navy, photos)
- Owner picked it specifically (logged in conversation)

### Why use a real DR outline (not a stylized silhouette)
- Stylized hand-drawn shapes were rejected by owner — "doesn't look like Dominican Republic"
- Sourced traced outline from open-source [mapsicon](https://github.com/djaiss/mapsicon) project (potrace-derived from accurate map data)
- Embedded as nested SVG with `vector-effect="non-scaling-stroke"` so the outline stays crisp at any size

### Why dual-theme (light + dark) for every social asset
- Different platforms have different surrounding UIs
- "Light" (cream background) reads luxury / editorial
- "Dark" (navy radial gradient) reads bolder / premium
- Owner can A/B test which theme converts better per platform

### Why generate everything from code (not Photoshop/Figma)
- Updating a brand color or the logo means re-running scripts, not redoing 60+ hand-edited files
- Adding a new platform / size = 2 lines of config
- Reproducible — anyone can rebuild the kit from `npm install && node scripts/...`
- The brand SOURCE OF TRUTH lives in `globals.css` + `logo-mark.svg` + the script `P` palette object — change one of those, regenerate, done

### Architecture
- `brand-kit/01-LOGOS/final-2026-04/` — master SVGs + 23 PNG sizes
- `brand-kit/02-SOCIAL-2026-04/` — banners + IG templates (light + dark)
- `brand-kit/03-BUSINESS-CARD-2026-04/` — print-ready cards (300 DPI, bleed, crop marks)
- `brand-kit/00-BRAND-GUIDE/` — 8-page PDF brand book
- `brand-kit/google-drive-ready/` — per-platform folders ready to drag into Drive
- `brand-kit/LOGO-EVERYWHERE/` — consolidated folder with per-use-case named copies (Instagram, FB, Etsy, favicons, app icons, watermarks, etc.) — every file you'd need across the brand's lifetime, drag-and-drop ready

### 5 generator scripts (in `scripts/`)
- `export-logo-pngs.mjs` — every standard PNG size + favicons from the master SVG
- `generate-social-kit.mjs` — banners + IG templates + Etsy assets, light + dark
- `generate-business-card.mjs` — print-ready cards with crop marks
- `generate-brand-guide-pdf.mjs` — 8-page brand book using pdfkit
- `organize-kit-for-drive.mjs` — rebuilds Drive-ready per-platform folders
- `build-logo-everywhere.mjs` — consolidated "every place you need the logo" folder

### Tooling
- `sharp` (devDep) — SVG → PNG rasterization, used by the four PNG-emitting scripts
- `pdfkit` (devDep) — PDF generation for the brand guide
- Both work cross-platform; sharp is libvips-based, pdfkit is pure JS

### Trade-offs
- pdfkit can't load Google Fonts (Cinzel/Cormorant) at runtime, so the brand guide PDF substitutes Helvetica-Bold/Times. Visual approximation, not pixel-perfect type. If pixel-perfect typography is needed, switch to puppeteer (heavier — downloads Chromium).
- Old `brand-kit/01-LOGOS/{dark-background, white-background, icon-only}/` folders left in place to avoid breaking external references (social-banners.html, prior brand kit zips). Will clean up in a future session if no inbound links surface.

### Site alignment (this release also)
- Header + Footer now use the new logo mark (`/images/logos/logo-mark-2026-04.svg`)
- Favicon + Apple touch icon + 192px PWA icon wired into `metadata.icons` in `layout.tsx`
- OpenGraph image rebuilt with the logo + brand colors (was text-only)
- Tailwind palette gained `--color-gold-deep` (#8A6418) for parity with the brand kit
- Brand-aligned preview pages (`/logo-concepts.html`, `/logo-kit.html`, `/social-kit.html`) load the actual brand fonts via Google Fonts and use a shared `public/brand-preview.css`

---

## D020: Inventory + P&L Module — SKU, Cost Breakdown, Stock Decrement

**Date:** 2026-04-24
**Status:** Implemented

**Context:** Owner needed operational visibility: inventory on hand, margin per product, and auto-decrement on sales. Pre-existing schema had `stock_status` tag but no numeric count, and no cost fields — so no real profit tracking was possible.

**Decision:** Add a 4-field cost breakdown (material, labor, packaging, shipping) per product, a numeric `stock_quantity` column, an auto-generated SKU system, a dedicated Inventory tab, and a Dashboard tab with live KPIs. Auto-decrement stock in the Stripe webhook.

**SKU format:** `AL-{STONE}{METAL}-{CAT}-{NNN}`
- Stones: `LAR` (larimar), `AMB` (amber), `BAM` (blue-amber)
- Metals: `SS` (sterling-silver), `GO` (gold), `GP` (gold-plated)
- Categories: `EAR`, `PND`, `NCK`, `RNG`, `BRC`
- Sequence: zero-padded 3-digit counter per prefix (e.g. `AL-LARSS-PND-001`)

**Why 4 cost fields (not 1):** Jewelry margins depend heavily on labor and shipping (especially DR → US). A single lump-sum "cost" field hides variance and makes it impossible to diagnose why certain SKUs underperform. Keeping them separate lets the owner see "packaging cost is eating margin on the $69 tier" at a glance.

**Why keep 4 image columns (not normalize to a `product_images` table):** Schema change would break cached queries and the shop UI. 4 images is still the product-page cap. Revisit only if the owner needs 5+.

**Architecture:**
- `src/lib/sku.ts` — codes + `generateSku()` queries DB for max existing, increments
- `src/lib/admin-constants.ts` — shared categories, labels, `totalCost()`, `marginPct()`, `fmtUSD()` helpers
- `src/components/admin/InventoryManager.tsx` — sortable table, CSV export, row totals
- `src/components/admin/DashboardPanel.tsx` — KPIs, margin breakdowns (weighted by revenue), 7d/30d gross profit using line-item COGS lookup
- `src/app/api/webhook/stripe/route.ts` — decrements `stock_quantity` per line item, auto-sets `stock_status` to `low-stock` (<=3) or `sold-out` (0)
- DB migration: `ALTER TABLE products ADD COLUMN IF NOT EXISTS` for all 6 new columns + unique SKU index (partial, excluding empty)

**Stock decrement behavior:** `GREATEST(0, stock_quantity - qty)` prevents negative stock. Status transitions are conservative — only downgrades to `low-stock` / `sold-out`, never upgrades (so a manual `made-to-order` or manually-set status isn't clobbered).

**Trade-offs:**
- No per-order COGS snapshot — if a product's cost fields change later, historical profit numbers will drift. Acceptable for now; revisit if accounting needs immutable ledger.
- In-memory margin calculation, not denormalized — slight CPU cost per render, but keeps the data model simple and avoids cache invalidation.
- SKU is not regenerated on category/stone/metal change — owner must click Regenerate manually. Intentional, because changing stone type after a SKU is printed on a hang tag would be a real-world data integrity hit.

---

## D019: Session 13 Security Hardening — Rate Limiting, Headers, GHL Migration

**Date:** 2026-03-12
**Status:** Implemented

**Context:** Full security audit before accepting real orders. Identified 3 critical issues: no rate limiting, revalidate auth bypass, no security headers. Also identified Resend as dead code.

**Decision:** Fix all 3 critical issues + remove Resend + add security headers.

**Changes:**
1. **Rate limiting** — `src/lib/rate-limit.ts` (in-memory Map, per-IP, auto-cleanup) on admin login, contact form, wholesale form (5 attempts / 15 minutes)
2. **Revalidate auth bypass** — added null check for `REVALIDATE_SECRET` in `/api/revalidate`
3. **Security headers** — `next.config.ts` adds X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy
4. **Resend removed** — `npm uninstall resend`, contact + wholesale routes rewritten to use GHL upsert API
5. **Pinterest domain verification** — `p:domain_verify` meta tag in layout.tsx

**Rate limiter design:**
- In-memory Map (not Redis) — suitable for Vercel serverless cold starts
- Auto-cleanup: entries expire after window passes
- Returns `{ success, remaining, resetIn }` for informative error responses
- Admin login shows remaining attempts on failure, returns 429 with Retry-After header when exhausted

---

## D018: Subscription Box — Pricing Strategy & Plan Structure

**Date:** 2026-03-11
**Status:** Analysis Complete — Pending Implementation

**Context:** Owner wants to add a monthly jewelry subscription box (Larimar + Amber) alongside the existing retail shop.

**Decision:** 4-tier subscription model. Launch with Plans A, C, D. Add Plan B in Month 2+.

| Plan | Name | Price | Contents | Est. COGS | Margin |
|------|------|-------|----------|-----------|--------|
| A | Larimar Silver | $69/mo | 2 pcs: silver + larimar | $38–48 | 30–45% |
| B | Amber Silver | $69/mo | 2 pcs: silver + amber | $35–45 | 35–49% |
| C | Island Mix ★ | $89/mo | 3 pcs: larimar + amber silver | $52–68 | 24–42% |
| D | Gold Edition | $119/mo | 3 pcs: gold/plated, premium | $65–95 | 20–45% |

**Revenue target:** 3,000 subscribers across USA, Canada, Germany → ~$99K–$102K gross profit/month.

**Competitive moat:** Only authentic Larimar + DR Blue Amber subscription box in the world. No direct competitor.

**Key risks to resolve before building:**
1. Standardize labor cost per tier (range is $5–$30/piece — must lock this before pricing)
2. US fulfillment center (ShipBob/Pirateship) to cut shipping from ~$18 to ~$8/box
3. Churn mitigation — need social automation live before launch (6–9% monthly churn expected)

**Target customers:**
- Primary: Women 32–52, $75K–$160K HH income, "Rare Collector" — wants unique pieces with origin story
- Secondary: Gift buyers (men 30–55) for Mother's Day, Valentine's, anniversaries
- Germany: Premium positioning, price in EUR (€69/€89/€119), origin-story-first messaging

**Reference docs:** `Ambar-Larimar-Subscription-Market-Analysis.docx`, `Ambar-Larimar-Analisis-de-Mercado-ES.docx`
**Generation scripts:** `scripts/generate-market-analysis.mjs`, `scripts/generate-market-analysis-es.mjs`

---

## D001: Next.js over Shopify for initial storefront

**Date:** 2026-03-09
**Status:** Accepted

**Context:** Owner originally planned Shopify but needed immediate web presence before LLC.

**Decision:** Build custom Next.js site with App Router, deployed on Vercel.

**Rationale:**
- No LLC/EIN needed for a contact-based checkout
- Full design control (luxury brand needs pixel-perfect design)
- Free hosting on Vercel
- Can add Stripe later when LLC is ready

**Trade-offs:** More dev work vs Shopify's built-in features (inventory, payments).

---

## D002: Product data — Neon Postgres as primary, Google Sheets fallback, mock data safety net

**Date:** 2026-03-09
**Status:** Accepted

**Context:** Need product data management without complex CMS.

**Decision:** Three-tier data fallback:
1. Neon Postgres (primary) — via `@neondatabase/serverless`
2. Google Sheets (legacy fallback)
3. Mock data (development/safety net)

**Rationale:**
- Neon is free, serverless, and supports SQL
- Google Sheets was original plan but Neon is more robust
- Mock data ensures site never breaks even if both fail

---

## D003: Contact-based checkout (email) instead of Stripe

**Date:** 2026-03-09
**Status:** Active (Phase 1)

**Context:** No LLC/EIN yet — can't set up Stripe.

**Decision:** Cart checkout sends order via email (`mailto:`) to `sales@ambarlarimarshop.com`.

**Rationale:**
- Legal compliance — no payment processing without business entity
- Still captures orders and customer intent
- Easy to upgrade to Stripe later (env var toggle: `NEXT_PUBLIC_CHECKOUT_MODE`)

**Future:** Switch to `stripe` mode once LLC + EIN are active.

---

## D004: Cloudinary unsigned upload via REST API

**Date:** 2026-03-09
**Status:** Accepted (revised from SDK approach)

**Context:** Need image upload for admin product management.

**Decision:** Use Cloudinary with **unsigned upload preset** via direct REST API call (no SDK).

**Rationale:**
- Cloudinary SDK (`cloudinary` npm package) throws opaque `[object Object]` errors on Vercel serverless
- REST API with unsigned preset is more reliable and has zero dependencies
- Only needs cloud name + preset name (no API key/secret for uploads)
- Free tier: 25GB storage, 25GB bandwidth/month

**Implementation:**
- Upload preset: `atlantida_unsigned` (created via Cloudinary API)
- Cloud name: `dlk6s7llm`
- Endpoint: `POST https://api.cloudinary.com/v1_1/dlk6s7llm/image/upload`
- Images stored in `atlantidagems/products/` folder

**Lesson learned:** The Cloudinary Node.js SDK does not work reliably in Vercel serverless functions. Always prefer REST API calls for third-party services in serverless environments.

---

## D005: Cookie-based admin auth (simple password)

**Date:** 2026-03-09
**Status:** Accepted

**Context:** Need admin access without full auth system.

**Decision:** Single password stored in `ADMIN_PASSWORD` env var, session stored in HTTP-only cookie.

**Rationale:**
- Single admin user (the owner)
- No need for user accounts, OAuth, or database sessions
- Simple to implement and maintain
- Secure enough for a single-user admin panel

**Trade-offs:** Not suitable for multi-user admin. Upgrade to NextAuth if needed.

---

## D006: WhatsApp replaced with Phone + Email

**Date:** 2026-03-09
**Status:** Accepted

**Context:** Owner preference — phone and email as primary contact methods.

**Decision:** Replaced all WhatsApp references across ~15 files with phone/email.

**Rationale:** Owner's preferred communication channels.

---

## D007: Hero split layout (70/30)

**Date:** 2026-03-09
**Status:** Accepted

**Context:** Hero needed solid background for text readability over product images.

**Decision:** 70% navy text area / 30% image slideshow, with separate mobile layout (stacked).

**Rationale:**
- Overlay text on images was unreadable
- Split layout gives clean, luxury feel
- 70/30 balances text prominence with visual appeal

---

## D008: Global CSS heading color removed

**Date:** 2026-03-09
**Status:** Accepted

**Context:** Global `h1-h6 { color: var(--color-ocean) }` was overriding Tailwind utility classes like `text-cream` and `text-white`.

**Decision:** Removed color from global heading rule. Headings now inherit from body, and Tailwind classes work correctly.

**Impact:** Fixed unreadable headings on dark backgrounds (wholesale page, etc.)

---

## D009: Auto-revalidation on admin product changes

**Date:** 2026-03-09
**Status:** Accepted

**Context:** Static pages (`/shop`, `/shop/[slug]`, `/api/products`) were cached with `revalidate = 300` (5 min). After saving a product in admin, changes were invisible to visitors for up to 5 minutes.

**Decision:** Admin API routes (POST, PUT, DELETE) call `revalidatePath()` for all affected pages after database writes.

**Rationale:**
- Immediate feedback — owner saves product and can verify on public site instantly
- No separate "publish" step needed
- `revalidatePath()` is built into Next.js, zero overhead

**Files:** `src/app/api/admin/products/route.ts`, `src/app/api/admin/products/[id]/route.ts`

---

## D010: Programmatic file picker instead of hidden input

**Date:** 2026-03-09
**Status:** Accepted

**Context:** The standard pattern of `<label><input type="file" className="hidden"></label>` was not triggering the file picker dialog in some browsers/contexts.

**Decision:** Upload button uses `document.createElement("input")` with `.click()` to open file picker programmatically.

**Rationale:**
- More reliable across browsers and rendering contexts
- Avoids CSS `display:none` / `hidden` issues with file inputs
- Same UX — user clicks button, picker opens

**Files:** `src/components/admin/AdminDashboard.tsx`

---

## D011: AI-generated multilingual descriptions

**Date:** 2026-03-09
**Status:** Accepted

**Context:** Products need descriptions in English, Spanish, and German. Writing manually in 3 languages is slow.

**Decision:** One-click AI generation using Anthropic Claude Haiku API. Single API call returns all 3 languages (short + full descriptions = 6 fields).

**Rationale:**
- Claude Haiku is fast and cheap (~$0.001 per generation)
- One click fills 6 description fields
- Owner can review and edit before saving
- Prompt includes product details (name, category, stone, metal, weight, dimensions)

**Files:** `src/app/api/admin/generate/route.ts`, `src/components/admin/AdminDashboard.tsx`

---

## D012: Stripe Checkout over Shopify/Azul

**Date:** 2026-03-09
**Status:** Accepted

**Context:** Owner asked about payment processing — options included Shopify (full migration), Azul (DR local processor), or Stripe.

**Decision:** Use Stripe Checkout (hosted payment page) integrated into existing Next.js site.

**Rationale:**
- USD-native — no currency conversion issues
- International customers supported out of the box
- Apple Pay, Google Pay, cards, and more payment methods
- Hosted checkout = PCI compliance handled by Stripe
- No need to migrate entire site to Shopify
- Azul is DR-focused and would require DOP→USD conversion

**Trade-offs:** Requires US LLC/EIN (in progress). Stripe fees: 2.9% + $0.30 per transaction.

---

## D013: Lazy Stripe SDK initialization

**Date:** 2026-03-09
**Status:** Accepted

**Context:** `export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "")` fails at build time on Vercel because env vars aren't available during `next build`.

**Decision:** Use `getStripe()` function with lazy initialization — creates Stripe instance on first API call, not at import time.

**Rationale:**
- Build succeeds even without `STRIPE_SECRET_KEY` configured
- Stripe instance is only created when an API route actually needs it
- Throws clear error if key is missing at runtime (not a cryptic build error)
- Same pattern can be used for any SDK that needs env vars

**Files:** `src/lib/stripe.ts`, `src/app/api/checkout/route.ts`, `src/app/api/webhook/stripe/route.ts`

---

## D014: Northwest Registered Agent for LLC formation

**Date:** 2026-03-09
**Status:** In Progress

**Context:** Owner needs Wyoming LLC + EIN to activate Stripe, Etsy, and full payment processing. Owner is Dominican Republic citizen with no SSN.

**Decision:** Use Northwest Registered Agent for LLC formation (~$279 total: $125 registered agent + $50 EIN service + ~$103.75 WY state fee).

**Rationale:**
- ~$120 cheaper than doola ($400.75) for equivalent service
- Includes registered agent (required by law)
- EIN service handles IRS paperwork ($50 add-on)
- Good reputation, established company
- Alternative: DIY EIN via Form SS-4 fax to IRS (free but requires fax)

**Entity details:**
- LLC Name: Emozca LLC (Wyoming)
- DBA/Brand: Ambar & Larimar Shop / Atlantida Gems
- Can operate under any brand name without formal DBA filing in most cases

---

## D015: WhatsApp Business Cloud (Meta API) via n8n for order notifications

**Date:** 2026-03-09
**Status:** Accepted

**Context:** Owner wants WhatsApp notifications for new orders to their personal number.

**Decision:** Use WhatsApp Business Cloud (official Meta API) with n8n as the automation layer.

**Rationale:**
- Free for first 1,000 business-initiated conversations/month (more than enough at launch)
- Official API — no risk of account bans (unlike unofficial libraries)
- n8n provides visual workflow management and easy credential rotation
- Webhook-triggered: Stripe webhook → n8n → WhatsApp — decoupled from main app

**Architecture:**
- Meta App: "Atlantida Order Notifications" under Emozca LLC business portfolio
- System User: `n8n-bot` with permanent token *(IDs in Meta Business Settings)*
- Phone Number ID: *(see Meta Business Settings → WhatsApp)*
- WhatsApp Business Account ID: *(see Meta Business Settings)*
- n8n Workflow: *(see n8n dashboard)*
- Webhook URL: *(stored in Vercel env `N8N_ORDER_WEBHOOK_URL`)*

**Key Lesson:** When configuring n8n WhatsApp credentials with a system user token, the system user must have the WhatsApp Business Account assigned as an asset (with "Full control"), not just the app. Without this, the token will show "Invalid access token" even if correctly generated.

**Trade-offs:** Requires Meta Business verification for production. Test phone number works for initial setup.

---

## D016: Order tracking system with carrier-specific URLs

**Date:** 2026-03-09
**Status:** Accepted

**Context:** Customers need to track their shipments after purchase.

**Decision:** Built-in order tracking page at `/order/[id]` with visual progress bar and carrier-specific tracking links.

**Rationale:**
- No external dependency (no ShipStation, AfterShip, etc.)
- Visual progress: Order Placed → Payment Confirmed → Shipped → Delivered
- Admin adds tracking number + carrier in Orders tab → customer gets email + WhatsApp with tracking link
- Supports USPS, UPS, FedEx, DHL, and custom URLs
- Public API at `/api/orders/[id]` — no auth required, excludes sensitive data

**Files:**
- `src/app/order/[id]/page.tsx` — customer tracking page
- `src/app/api/orders/[id]/route.ts` — public order API
- `src/app/api/admin/orders/[id]/route.ts` — admin order update (triggers shipping notifications)
- `src/lib/email-templates.ts` — `getTrackingUrl()` helper + `shippingConfirmationEmail()`
- `src/components/admin/OrdersManager.tsx` — admin UI for order management

---

## D017: Phase 1 security hardening — checkout, validation, escaping

**Date:** 2026-03-09
**Status:** Accepted

**Context:** Full site audit revealed critical security gaps before launch: checkout continued if DB failed, no server-side input validation, raw user data in email HTML, no SEO infrastructure, no error pages.

**Decision:** Implement pre-launch hardening as Phase 1 before any other feature work.

**Changes made:**
1. **Checkout fails if DB fails** — order must save before Stripe session is created
2. **Server-side validation** — email regex, string type/length checks, required field enforcement on all 3 form endpoints (checkout, contact, wholesale)
3. **HTML escaping in emails** — `escapeHtml()` function applied to all user-provided data in email templates to prevent XSS
4. **SEO** — dynamic sitemap (static + product pages), robots.txt (blocks admin/API), OpenGraph image (dynamic edge-rendered), metadataBase, twitter card
5. **Error pages** — branded error.tsx and not-found.tsx
6. **Database indexes** — 7 indexes on frequently queried columns
7. **Credential cleanup** — removed hardcoded n8n API key from deploy script

**Rationale:**
- Security and SEO must be in place before any real customers use the site
- Input validation prevents injection and abuse
- HTML escaping prevents email-based XSS
- Sitemap/robots/OG image are essential for search visibility and social sharing
- Indexes prevent performance degradation as data grows

**Files:**
- `src/app/api/checkout/route.ts` — validation + DB failure handling
- `src/app/api/contact/route.ts` — input validation
- `src/app/api/wholesale-inquiry/route.ts` — input validation
- `src/lib/email-templates.ts` — `escapeHtml()` utility
- `src/app/sitemap.ts`, `src/app/robots.ts` — SEO
- `src/app/opengraph-image.tsx` — OG image
- `src/app/error.tsx`, `src/app/not-found.tsx` — error pages
- `src/lib/db.ts` — indexes in `initDatabase()`
- `src/app/layout.tsx` — metadataBase, twitter card
