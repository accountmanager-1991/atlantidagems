# Session Status

**Project:** Ambar & Larimar Shop (formerly Atlantida Gems)
**Last Updated:** 2026-03-09
**Session:** 7

---

## Current Focus

**What I'm working on right now:**
> Phase 1 pre-launch hardening complete. Full site audit done. Security fixes, SEO, and error pages deployed. GitHub repo created. Ready for Phase 2 (LLC → Stripe → launch).

**Why this matters:**
> Site is now production-hardened: input validation, HTML escaping, DB failure handling, sitemap, robots.txt, OG image, error pages, DB indexes. Next step is LLC/EIN → Stripe activation → go live.

---

## Completed This Session (Session 7)

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
| n8n WhatsApp workflow | Done | Deployed via API — Webhook → WhatsApp Notification (ID: `zQ1QFgkwEpcP6YZW`) |
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
| Vercel (hosting) | Active | ambarlarimarshop.vercel.app |
| GitHub | Active | github.com/accountmanager-1991/atlantidagems (public) |
| Neon Postgres | Connected | DATABASE_URL set, products + orders tables, 7 indexes |
| Cloudinary | Connected | Unsigned upload via REST API, cloud: `dlk6s7llm`, preset: `atlantida_unsigned` |
| Admin Auth | Active | Cookie-based, password in env (needs security upgrade — see TD010) |
| Anthropic API | Connected | Claude Haiku for AI descriptions (EN/ES/DE) |
| Resend (email) | Not configured | Need RESEND_API_KEY for order notifications + contact forms |
| Stripe | Code ready | Needs `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_BASE_URL` on Vercel |
| WhatsApp Business Cloud | Configured | Meta App "Atlantida Order Notifications", system user `n8n-bot`, permanent token |
| n8n (WhatsApp workflow) | Deployed (not activated) | Workflow `zQ1QFgkwEpcP6YZW` — needs credential selection + activation in n8n UI |
| Custom domain | Not configured | Need to add in Vercel |
| LLC (Wyoming) | In progress | Northwest Registered Agent — Emozca LLC |

---

## Next Up — Phase 2 (Launch Blockers)

1. **Complete LLC formation** — Northwest Registered Agent (Emozca LLC, Wyoming)
2. **Get EIN** — Fax Form SS-4 to IRS (or Northwest $50 add-on)
3. **Activate Stripe** — Create account with LLC/EIN, add env vars to Vercel
4. **Configure Resend** — Sign up at resend.com, add `RESEND_API_KEY` to Vercel
5. **Set `NEXT_PUBLIC_BASE_URL`** — Set to real domain on Vercel
6. **Custom domain** — Point domain to Vercel
7. **Activate n8n WhatsApp workflow** — Open workflow in n8n, select WhatsApp credential, activate
8. **Run `/api/admin/setup`** on production — Creates new DB indexes
9. **Add Google Analytics / Vercel Analytics** — Track traffic + conversions
10. **Test full order flow** — End-to-end: checkout → Stripe → DB → emails → WhatsApp → tracking

## Next Up — Phase 3 (Growth Features)

1. **JSON-LD structured data** — Product schema for Google rich snippets (`schema-dts` already installed)
2. **Image optimization** — Cloudinary transforms (`f_auto,q_auto,w_800`) on product images
3. **Inventory management** — Decrement stock on purchase
4. **Admin session security** — Hashed session tokens instead of raw password in cookie (TD010)
5. **Order access control** — Verify ownership before showing order details (TD011)
6. **Rate limiting** — Vercel Edge Middleware on admin login + form endpoints (TD005)
7. **Newsletter signup** — Email capture + GoHighLevel integration
8. **n8n social media automation** — Auto-posting pipeline (2-3x/day)
9. **Product search** — Search bar on shop page
10. **Product reviews/testimonials** — Social proof for high-value items
11. **Abandoned cart recovery** — Follow-up mechanism for incomplete checkouts
12. **Remove dead code** — Google Sheets integration (TD006), Cloudinary SDK (TD007)
13. **Add real products** — Upload photos, set prices, generate AI descriptions

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
| 2nd | Google Sheets | Fallback (not configured, dead code — TD006) |
| 3rd | Mock data | Safety net (8 placeholder products) |

---

## Env Vars Needed for Full Activation

| Variable | Where | Status | Notes |
|----------|-------|--------|-------|
| `STRIPE_SECRET_KEY` | Vercel | Pending | From Stripe Dashboard after LLC/EIN |
| `STRIPE_WEBHOOK_SECRET` | Vercel | Pending | From Stripe Dashboard webhook config |
| `NEXT_PUBLIC_BASE_URL` | Vercel | Pending | `https://ambarlarimarshop.com` (or Vercel URL) |
| `RESEND_API_KEY` | Vercel | Pending | For order notification emails |
| `N8N_ORDER_WEBHOOK_URL` | Vercel | **Done** | `https://emozca.app.n8n.cloud/webhook/atlantida-order-webhook` |

---

## Known Issues / Bugs

| Issue | Severity | Status | Notes |
|-------|----------|--------|-------|
| Admin stores raw password in cookie | High | TD010 | Needs hashed session tokens |
| Order tracking has no access control | High | TD011 | Anyone with UUID can view any order |
| No rate limiting on login/forms | Medium | TD005 | Brute-force and spam possible |
| Resend not configured | Medium | Pending | Order + contact emails won't send |
| No custom domain | Medium | Pending | Using Vercel subdomain |
| Mock data shows alongside real products | Low | By design | Falls back to mock when DB has 0 visible products |
| Featured Pieces empty on homepage | Low | Expected | No products have `featured=true` — toggle in admin |
| Cart images stale if product added before image upload | Low | Known | Clear cart and re-add product to refresh |
| No analytics | Medium | Pending | Can't measure traffic or ad ROI |

---

## WhatsApp Business Cloud Integration

| Detail | Value |
|--------|-------|
| Meta App | Atlantida Order Notifications |
| Business Portfolio | Emozca LLC |
| Phone Number ID | `1017967411400401` |
| WhatsApp Business Account ID | `2396452047461051` |
| System User | `n8n-bot` (ID: `61582015733803`) |
| n8n Instance | `emozca.app.n8n.cloud` |
| n8n Workflow ID | `zQ1QFgkwEpcP6YZW` |
| Webhook URL | `https://emozca.app.n8n.cloud/webhook/atlantida-order-webhook` |
| Recipient | `18099194205` (owner's WhatsApp) |

---

*Last context save: 2026-03-09 — Session 7, Phase 1 hardening complete + GitHub repo + Vercel deploy.*
