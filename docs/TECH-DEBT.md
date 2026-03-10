# Technical Debt Tracker

**Project:** Ambar & Larimar Shop
**Last Updated:** 2026-03-09 (Session 7)

---

## Active Tech Debt

### TD001: No email delivery (Resend not configured)

**Severity:** High
**Impact:** All emails are dead — customer order confirmations, owner notifications, shipping confirmations, contact form, wholesale inquiries. Nothing sends.
**Fix:** Sign up at resend.com, add `RESEND_API_KEY` to `.env.local` and Vercel.
**Files:** `src/app/api/contact/route.ts`, `src/app/api/wholesale-inquiry/route.ts`, `src/app/api/webhook/stripe/route.ts`, `src/app/api/admin/orders/[id]/route.ts`

---

### TD002: Mock data fallback still active

**Severity:** Low
**Impact:** Site shows 8 placeholder products when Neon DB returns 0 visible products. Now that real products exist, mock data should only show if DB is down.
**Fix:** Consider removing mock fallback or only using it when `DATABASE_URL` is not set (not when query returns empty).
**Files:** `src/lib/products.ts` (getMockProducts function, getAllProducts logic)

---

### TD003: No image optimization pipeline

**Severity:** Medium
**Impact:** Cloudinary images are served as-uploaded. No automatic resizing/WebP conversion. Cart uses raw `<img>` instead of Next.js `<Image>`.
**Fix:** Add Cloudinary transformation parameters to image URLs (e.g., `c_limit,w_800,f_auto,q_auto`). Switch cart/checkout to use `<Image>` component.
**Files:** `src/components/products/ProductCard.tsx`, `src/components/products/ProductGallery.tsx`, `src/components/cart/CartDrawer.tsx`, `src/app/cart/page.tsx`

---

### TD004: Admin panel has no CSRF protection

**Severity:** Low (single-user admin)
**Impact:** Cookie-based auth without CSRF tokens. Low risk since only owner uses it.
**Fix:** Add CSRF token to admin API routes if multi-user admin is ever needed.
**Files:** `src/app/api/admin/*/route.ts`

---

### TD005: No rate limiting on admin login or forms

**Severity:** Medium
**Impact:** Brute-force possible on admin password endpoint. Contact/wholesale forms can be spammed.
**Fix:** Add rate limiting via Vercel Edge Middleware or a simple in-memory counter.
**Files:** `src/app/api/admin/auth/route.ts`, `src/app/api/contact/route.ts`, `src/app/api/wholesale-inquiry/route.ts`

---

### TD006: Google Sheets fallback code still present

**Severity:** Low
**Impact:** Dead code — Google Sheets credentials are not configured and likely won't be. `googleapis` npm package adds unnecessary bundle size.
**Fix:** Remove `src/lib/google-sheets.ts`, remove `googleapis` from package.json, update `src/lib/products.ts` to remove getSheetData import.
**Files:** `src/lib/google-sheets.ts`, `src/lib/products.ts`, `package.json`

---

### TD007: Unused Cloudinary SDK dependency

**Severity:** Low
**Impact:** `cloudinary` npm package is still installed but no longer used (switched to REST API).
**Fix:** Run `npm uninstall cloudinary` to remove unused dependency.
**Files:** `package.json`

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

### TD010: Admin session stores raw password in cookie

**Severity:** High
**Impact:** `admin-auth.ts` sets the actual `ADMIN_PASSWORD` as the cookie value. If cookie is stolen, attacker gets full admin access without needing the password again.
**Fix:** Generate a cryptographic session token (e.g., `crypto.randomUUID()`), store it server-side or in a signed cookie, and compare tokens instead of passwords.
**Files:** `src/lib/admin-auth.ts`, `src/app/api/admin/auth/route.ts`

---

### TD011: Order tracking has no access control

**Severity:** High
**Impact:** `/api/orders/[id]` and `/order/[id]` are public. Anyone who guesses/brute-forces a UUID can see order details (name, address, items). UUIDs are hard to guess but not a security mechanism.
**Fix:** Add an order-specific access token (sent in confirmation email) or require email verification before showing order details.
**Files:** `src/app/api/orders/[id]/route.ts`, `src/app/order/[id]/page.tsx`, `src/lib/db.ts` (add `access_token` column)

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

### TD015: No analytics

**Severity:** Medium
**Impact:** Can't measure traffic, conversions, or ad ROI. Essential for the $50/mo ad budget strategy.
**Fix:** Add Vercel Analytics (`@vercel/analytics`) or Google Analytics 4. Both are simple to add.
**Files:** `src/app/layout.tsx`, `package.json`

---

### TD016: No JSON-LD structured data for products

**Severity:** Medium
**Impact:** `schema-dts` is installed but unused. Product pages don't have structured data, so Google won't show rich snippets (price, availability, images).
**Fix:** Add `<script type="application/ld+json">` with Product schema to `src/app/shop/[slug]/page.tsx`.
**Files:** `src/app/shop/[slug]/page.tsx`

---

## Resolved Tech Debt

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
