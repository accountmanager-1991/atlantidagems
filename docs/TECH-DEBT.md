# Technical Debt Tracker

**Project:** Ambar & Larimar Shop
**Last Updated:** 2026-03-12 (Session 13)

---

## Active Tech Debt

### ~~TD001: No email delivery (Resend not configured)~~ — RESOLVED 2026-03-12
**Was:** Resend not configured, no emails sending.
**Fix:** Replaced Resend with GoHighLevel (GHL) contact upserts. Contact form uses "contact-form" tag, wholesale uses "wholesale-inquiry" tag. `resend` package removed.

---

### TD002: Mock data fallback still active

**Severity:** Low
**Impact:** Site shows 8 placeholder products when Neon DB returns 0 visible products. Now that real products exist, mock data should only show if DB is down.
**Fix:** Consider removing mock fallback or only using it when `DATABASE_URL` is not set (not when query returns empty).
**Files:** `src/lib/products.ts` (getMockProducts function, getAllProducts logic)

---

---

### TD004: Admin panel has no CSRF protection

**Severity:** Low (single-user admin)
**Impact:** Cookie-based auth without CSRF tokens. Low risk since only owner uses it.
**Fix:** Add CSRF token to admin API routes if multi-user admin is ever needed.
**Files:** `src/app/api/admin/*/route.ts`

---

### ~~TD005: No rate limiting on admin login or forms~~ — RESOLVED 2026-03-12
**Was:** Brute-force possible on admin login, forms could be spammed.
**Fix:** Added `src/lib/rate-limit.ts` — in-memory per-IP rate limiter (5 attempts/15min). Applied to admin login (429 + Retry-After), contact form, wholesale form.

---

---

### TD008: Unused Vercel Blob stores

**Severity:** Low
**Impact:** Three Vercel Blob stores were created during troubleshooting (`ambar-images`, `atlantidagems-images` x2) but are not connected or used.
**Fix:** Delete unused blob stores from Vercel dashboard: https://vercel.com/eddy-ozorias-projects/ambarlarimarshop/stores
**Files:** None (Vercel dashboard only)

---

### TD009: `.env.local` cloud name mismatch

**Severity:** Low
**Impact:** Local `.env.local` has `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dlk6s7llm` but this var is no longer used by the upload route (cloud name is hardcoded in upload route). Not a bug, but inconsistent.
**Fix:** Either remove Cloudinary env vars from `.env.local` (since upload uses hardcoded values) or make the upload route read from env vars again.
**Files:** `.env.local`, `src/app/api/admin/upload/route.ts`

---

---

### TD012: No inventory/stock management

**Severity:** Medium
**Impact:** Stock status is stored in DB but never decremented on purchase. Risk of overselling if manual inventory updates are forgotten.
**Fix:** Decrement stock quantity in Stripe webhook after successful payment. Add stock check before checkout.
**Files:** `src/app/api/webhook/stripe/route.ts`, `src/app/api/checkout/route.ts`, `src/lib/db.ts`

---

### TD013: Order items stored as JSON string

**Severity:** Low
**Impact:** `items_json TEXT` column stores order items as a JSON string. Can't query items directly, no foreign keys, no normalization.
**Fix:** Create proper `order_items` table with foreign keys to orders and products.
**Files:** `src/lib/db.ts`, `src/app/api/checkout/route.ts`, `src/app/api/orders/[id]/route.ts`

---

### TD014: No retry logic for email/webhook notifications

**Severity:** Medium
**Impact:** If Resend email or n8n webhook fails, it's silently swallowed via `Promise.allSettled()`. Customer might not receive confirmation.
**Fix:** Implement retry with exponential backoff, or use a queue system.
**Files:** `src/app/api/webhook/stripe/route.ts`, `src/app/api/admin/orders/[id]/route.ts`

---

---

## Resolved Tech Debt

### TD-R015: TD010 — Admin session stores raw password in cookie — RESOLVED 2026-03-10
**Was:** `admin-auth.ts` set the actual `ADMIN_PASSWORD` as the cookie value. Cookie theft = full admin access.
**Fix:** Rewrote to HMAC-SHA256 signed session tokens with nonce. Timing-safe comparison. Cookie now stores `nonce.signature`, not the password.

---

### TD-R016: TD011 — Order tracking has no access control — RESOLVED 2026-03-10
**Was:** `/api/orders/[id]` was public. Anyone with a UUID could view order details.
**Fix:** Added `access_token` column to orders table. Checkout generates `crypto.randomBytes(16)` token, stored in DB and included in tracking URLs. API requires `?token=` param and verifies against DB.

---

### TD-R017: TD015 — No analytics — RESOLVED 2026-03-10
**Was:** No traffic or conversion tracking.
**Fix:** Added `@vercel/analytics` and `@vercel/speed-insights` to `layout.tsx`.

---

### TD-R018: TD016 — No JSON-LD structured data — RESOLVED 2026-03-10
**Was:** Product pages had no structured data for Google rich snippets.
**Fix:** Added `<script type="application/ld+json">` with schema.org Product type to `src/app/shop/[slug]/page.tsx`.

---

### TD-R019: TD003 — No image optimization pipeline — RESOLVED 2026-03-10
**Was:** Cloudinary images served as-uploaded, no resizing/WebP.
**Fix:** Added `optimizeImage()` in `src/lib/cloudinary.ts` using URL transforms (`c_limit,w_{width},q_auto,f_auto`). Applied to ProductCard (400px), ProductGallery main (800px) and thumbnails (200px).

---

### TD-R020: TD006 — Google Sheets fallback code still present — RESOLVED 2026-03-10
**Was:** Dead code: `src/lib/google-sheets.ts` + `googleapis` npm package.
**Fix:** Deleted `google-sheets.ts`, removed `googleapis` from package.json, cleaned imports in `products.ts`.

---

### TD-R021: TD007 — Unused Cloudinary SDK dependency — RESOLVED 2026-03-10
**Was:** `cloudinary` npm package installed but unused (switched to REST API in Session 4).
**Fix:** Removed `cloudinary` from package.json.

---

### TD-R009: No sitemap, robots.txt, OG image, or error pages — RESOLVED 2026-03-09
**Was:** `next-sitemap` installed but not configured. No robots.txt. No OG image for social shares. Using default Next.js error pages.
**Fix:** Added `src/app/sitemap.ts` (dynamic), `src/app/robots.ts`, `src/app/opengraph-image.tsx` (edge), `src/app/error.tsx`, `src/app/not-found.tsx`. Added `metadataBase` and twitter card to `layout.tsx`.

---

### TD-R010: No server-side input validation — RESOLVED 2026-03-09
**Was:** Contact, wholesale, and checkout forms had no server-side validation. Only client-side HTML5 `required`.
**Fix:** Added email regex, type/length checks, required field enforcement, and JSON parse error handling to all 3 API routes.

---

### TD-R011: Email templates vulnerable to XSS — RESOLVED 2026-03-09
**Was:** User-provided data (names, emails, addresses, product names, image URLs) injected raw into HTML email templates.
**Fix:** Added `escapeHtml()` utility and applied to all user data in `customerConfirmationEmail()`, `ownerOrderNotificationEmail()`, and `shippingConfirmationEmail()`.

---

### TD-R012: Checkout continued if DB order creation failed — RESOLVED 2026-03-09
**Was:** If `INSERT INTO orders` threw an error, the catch block logged it and continued to create a Stripe session. Payment could succeed with no order record.
**Fix:** Checkout now returns 500 "Unable to create order" if DB save fails. Stripe session is only created after successful DB insert.

---

### TD-R013: No database indexes — RESOLVED 2026-03-09
**Was:** Products and orders tables had no indexes on frequently queried columns (slug, email, status, created_at).
**Fix:** Added 7 `CREATE INDEX IF NOT EXISTS` statements to `initDatabase()`. Need to run `/api/admin/setup` on production to apply.

---

### TD-R014: Hardcoded n8n API key in deploy script — RESOLVED 2026-03-09
**Was:** `n8n-workflows/deploy-whatsapp-notifications.js` had a JWT API key hardcoded in source.
**Fix:** Changed to read from `N8N_API_KEY` environment variable. Exits with error if not set.

---

### TD-R001: Global CSS overriding Tailwind heading colors — RESOLVED 2026-03-09
**Was:** `h1-h6 { color: var(--color-ocean) }` blocked Tailwind classes on dark backgrounds.
**Fix:** Removed color from global heading rule in `globals.css`.

---

### TD-R002: Cloudinary SDK failing on Vercel serverless — RESOLVED 2026-03-09
**Was:** `cloudinary` npm SDK threw `[object Object]` errors in Vercel serverless functions.
**Fix:** Replaced SDK with direct REST API call using unsigned upload preset. See Decision D004.

---

### TD-R003: Cloudinary credentials mismatch — RESOLVED 2026-03-09
**Was:** Cloud name `atlantidagems` didn't match API key `135121233917946` (key belonged to cloud `dlk6s7llm`).
**Fix:** Switched to unsigned upload (no API key needed). Cloud name hardcoded to `dlk6s7llm`.

---

### TD-R004: Product images not visible on public pages — RESOLVED 2026-03-09
**Was:** Product detail page and shop grid showed placeholder gradients instead of real images.
**Fix:** Created `ProductGallery.tsx` client component, updated `ProductCard.tsx`, added `revalidatePath()` calls.

---

### TD-R005: Upload button not triggering file picker — RESOLVED 2026-03-09
**Was:** Clicking "Upload" in admin panel did nothing.
**Fix:** Replaced with programmatic file picker: `document.createElement("input")` + `.click()`.

---

### TD-R006: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` missing from Vercel — RESOLVED 2026-03-09
**Was:** Upload API returned "Unknown API key" on production.
**Fix:** Added the env var to Vercel. (Later became moot with hardcoded unsigned upload.)

---

### TD-R007: Admin password with `@` symbol not saving to Vercel — RESOLVED 2026-03-09
**Was:** `echo "@Emiliano2024" | vercel env add` mangled the `@` symbol.
**Fix:** Used `printf '%s'` instead.

---

### TD-R008: Database `channel_binding=require` not supported — RESOLVED 2026-03-09
**Was:** Neon connection string parameter incompatible with serverless HTTP driver.
**Fix:** Removed `&channel_binding=require` from Vercel DATABASE_URL.
