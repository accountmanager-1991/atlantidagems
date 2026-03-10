# Technical Debt Tracker

**Project:** Ambar & Larimar Shop
**Last Updated:** 2026-03-09

---

## Active Tech Debt

### TD001: No email delivery (Resend not configured)

**Severity:** Medium
**Impact:** Contact and wholesale inquiry forms submit but emails don't actually send.
**Fix:** Add `RESEND_API_KEY` to `.env.local` and Vercel. Sign up at resend.com.
**Files:** `src/app/api/contact/route.ts`, `src/app/api/wholesale-inquiry/route.ts`

---

### TD002: Mock data fallback still active

**Severity:** Low
**Impact:** Site shows 8 placeholder products when Neon DB returns 0 visible products. Now that real products exist, mock data should only show if DB is down.
**Fix:** Consider removing mock fallback or only using it when `DATABASE_URL` is not set (not when query returns empty).
**Files:** `src/lib/products.ts` (getMockProducts function, getAllProducts logic)

---

### TD003: No image optimization pipeline

**Severity:** Low
**Impact:** Cloudinary images are served as-uploaded. No automatic resizing/WebP conversion on display.
**Fix:** Add Cloudinary transformation parameters to image URLs (e.g., `c_limit,w_800,f_auto,q_auto`).
**Files:** `src/components/products/ProductCard.tsx`, `src/components/products/ProductGallery.tsx`

---

### TD004: Admin panel has no CSRF protection

**Severity:** Low (single-user admin)
**Impact:** Cookie-based auth without CSRF tokens. Low risk since only owner uses it.
**Fix:** Add CSRF token to admin API routes if multi-user admin is ever needed.
**Files:** `src/app/api/admin/*/route.ts`

---

### TD005: No rate limiting on admin login

**Severity:** Low
**Impact:** Brute-force possible on admin password endpoint.
**Fix:** Add rate limiting via Vercel Edge Middleware or a simple in-memory counter.
**Files:** `src/app/api/admin/auth/route.ts`

---

### TD006: Google Sheets fallback code still present

**Severity:** Low
**Impact:** Dead code — Google Sheets credentials are not configured and likely won't be.
**Fix:** Remove Google Sheets integration (`src/lib/google-sheets.ts`) once Neon is confirmed working long-term.
**Files:** `src/lib/google-sheets.ts`, `src/lib/products.ts` (getSheetData import)

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

## Resolved Tech Debt

### TD-R001: Global CSS overriding Tailwind heading colors — RESOLVED 2026-03-09
**Was:** `h1-h6 { color: var(--color-ocean) }` blocked Tailwind classes on dark backgrounds.
**Fix:** Removed color from global heading rule in `globals.css`.

---

### TD-R002: Cloudinary SDK failing on Vercel serverless — RESOLVED 2026-03-09
**Was:** `cloudinary` npm SDK threw `[object Object]` errors in Vercel serverless functions.
**Fix:** Replaced SDK with direct REST API call using unsigned upload preset. See Decision D004.

---

### TD-R003: Cloudinary credentials mismatch — RESOLVED 2026-03-09
**Was:** Cloud name `atlantidagems` didn't match API key `135121233917946` (key belonged to cloud `dlk6s7llm`). Caused "Unknown API key" and "Invalid api_key" errors.
**Root cause:** Cloudinary account had cloud name `dlk6s7llm` (auto-generated), not `atlantidagems` (assumed name). API keys are tied to specific cloud names/product environments.
**Fix:** Switched to unsigned upload (no API key needed). Cloud name hardcoded to `dlk6s7llm`.
**Lesson:** Always verify cloud name from Cloudinary Dashboard > Product Environment, not just the account name.

---

### TD-R004: Product images not visible on public pages — RESOLVED 2026-03-09
**Was:** Product detail page and shop grid showed placeholder gradients instead of real images.
**Root cause:** Two issues:
1. `ProductCard.tsx` and product detail page had hardcoded placeholder divs, never rendering `<img>` tags
2. Static pages were cached (`revalidate = 300`) and didn't refresh after admin saves
**Fix:**
1. Created `ProductGallery.tsx` client component and updated `ProductCard.tsx` to conditionally render `<img>` when `imageMain` exists
2. Added `revalidatePath()` calls to admin PUT/POST/DELETE endpoints

---

### TD-R005: Upload button not triggering file picker — RESOLVED 2026-03-09
**Was:** Clicking "Upload" in admin panel did nothing — no file picker appeared.
**Root cause:** Hidden `<input type="file">` inside a `<label>` tag was not reliably triggering in all browsers.
**Fix:** Replaced with programmatic file picker: `document.createElement("input")` + `.click()`.

---

### TD-R006: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` missing from Vercel — RESOLVED 2026-03-09
**Was:** Upload API returned "Unknown API key" because Cloudinary wasn't configured with a cloud name on production.
**Root cause:** Only `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` were added to Vercel, but `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` was forgotten.
**Fix:** Added the env var to Vercel production. (Later became moot when switched to hardcoded unsigned upload.)
**Lesson:** When setting up a service, add ALL required env vars at once. Check the code for every `process.env.` reference.

---

### TD-R007: Admin password with `@` symbol not saving to Vercel — RESOLVED 2026-03-09
**Was:** `echo "@Emiliano2024" | vercel env add` mangled the `@` symbol.
**Fix:** Used `printf '%s' '@Emiliano2024' | vercel env add` instead.
**Lesson:** Never use `echo` to pipe values with special characters. Use `printf '%s'` instead.

---

### TD-R008: Database `channel_binding=require` not supported — RESOLVED 2026-03-09
**Was:** Neon connection string included `&channel_binding=require` which `@neondatabase/serverless` HTTP driver doesn't support.
**Fix:** Removed `&channel_binding=require` from the Vercel production DATABASE_URL.
**Lesson:** Neon pooler URLs may include parameters not compatible with the serverless HTTP driver. Always test the connection string.
