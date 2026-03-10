# Architecture & Design Decisions

**Project:** Ambar & Larimar Shop
**Last Updated:** 2026-03-09 (Session 6)

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

**Context:** Owner preference — phone number `809-919-4205` and email `sales@ambarlarimarshop.com`.

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

**Context:** Owner wants WhatsApp notifications for new orders to their personal number `809-919-4205`.

**Decision:** Use WhatsApp Business Cloud (official Meta API) with n8n as the automation layer.

**Rationale:**
- Free for first 1,000 business-initiated conversations/month (more than enough at launch)
- Official API — no risk of account bans (unlike unofficial libraries)
- n8n provides visual workflow management and easy credential rotation
- Webhook-triggered: Stripe webhook → n8n → WhatsApp — decoupled from main app

**Architecture:**
- Meta App: "Atlantida Order Notifications" under Emozca LLC business portfolio
- System User: `n8n-bot` (ID: `61582015733803`) with permanent token
- Phone Number ID: `1017967411400401`
- WhatsApp Business Account ID: `2396452047461051`
- n8n Workflow: `zQ1QFgkwEpcP6YZW` (Webhook → WhatsApp node)
- Webhook URL: `https://emozca.app.n8n.cloud/webhook/atlantida-order-webhook`

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
