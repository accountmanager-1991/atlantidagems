# Claude Code Project Instructions

**Project:** Atlantida Gems
**Last Updated:** 2026-03-09

---

## MANDATORY: Agent Startup Protocol

**Read this section FIRST before doing any work.**

### Step 1: Read Context Files

1. **Read this file** (`docs/CLAUDE.md`) - You're doing this now
2. **Read `docs/SESSION-STATUS.md`** - Understand current progress and what's left to do
3. **Read `docs/PROJECT-BRIEF.md`** - Full business context and requirements

### Step 2: Context Window Monitoring

I can see context window usage in system messages. **I will proactively manage context:**

| Context Remaining | Action |
|-------------------|--------|
| **> 50,000 tokens** | Continue working normally |
| **< 50,000 tokens** | WARNING: Alert user, suggest saving state soon |
| **< 20,000 tokens** | STOP: Update `SESSION-STATUS.md` with full current state before continuing |

### Step 3: Session Documentation

**During work:**
- Update `docs/SESSION-STATUS.md` after completing each task
- Document what was done, what was learned, and what remains

**If context gets compacted or you notice missing context:**
1. STOP immediately
2. Summarize what was accomplished and what's left to do
3. Update `docs/SESSION-STATUS.md` with full state
4. Tell the user which agent should be re-engaged

---

## Token-Aware Development Guidelines

### Critical: Avoid Token Limit Issues

#### When Reading Files

1. **Never load entire large files at once** - Use line range parameters:
   ```
   View file with view_range [1, 500]     # First 500 lines
   View file with view_range [500, 1000]  # Next 500 lines
   ```

2. **Use regex search to find specific sections** before loading

3. **Pattern for large files (>1000 lines):**
   - Search for section headers first
   - Read only relevant sections (200-500 lines at a time)
   - Never read more than 750 lines in a single operation

#### When Generating Files

1. **Break large outputs into parts** - Each large document should be written in 3-4 parts
2. **Keep files under 40KB** - Consider splitting into multiple files

---

## Quality Assurance - The ABC Approach

### Step 1: Create Audit Document
- Identify all pages/features to audit
- Document requirements and expected behavior

### Step 2: The ABC Approach
- **Phase A (Identify):** Run through all verification phases, document any issues found
- **Phase B (Review):** Mark issues as CONFIRMED, INVESTIGATE, or FALSE POSITIVE
- **Phase C (Plan):** Triple-check remaining issues, create implementation plan

### Step 3: Implement
- Execute approved fixes systematically
- Verify each fix works
- Update SESSION-STATUS.md

**Key Principle:** No implementation begins until Phase C document is reviewed and approved.

---

## Critical Gotchas Documentation Format

When solving bugs, document them using this format:

```markdown
### [Problem Name] - SOLVED [DATE]

> **One-line rule/solution summary**

#### The Problem
[Describe what broke, error messages, why it was confusing]

#### Root Cause
[Technical explanation of why it happened]

#### The Solution
[Code examples with inline comments explaining the fix]

#### Files Affected
- `path/to/file1.ts` - What was changed

#### DO NOT:
- [Anti-pattern 1 to avoid]
```

---

## Project Context Files

### Always Read First (Every Session)
1. **docs/CLAUDE.md** (this file) - Development guidelines
2. **docs/SESSION-STATUS.md** - Current work state and next steps

### Reference When Needed
| File | Purpose |
|------|---------|
| `docs/PROJECT-BRIEF.md` | Full business context, brand identity, financials |
| `brand-assets/atlantida-logo.svg` | Master vector logo |
| `brand-assets/atlantida-brand-kit.html` | Complete visual brand reference |
| `brand-assets/atlantida-business-card.pdf` | Print-ready business card |
| `brand-assets/atlantida-color-palette.pdf` | Color system reference |

---

## Tech Stack Quick Reference

| Category | Technology | Notes |
|----------|------------|-------|
| E-commerce | Shopify | Primary storefront (retail + wholesale) |
| Automation | n8n | Social media posting, order routing, email flows |
| CRM/Marketing | GoHighLevel | Sales funnels, email follow-ups, wholesale outreach |
| AI | OpenAI / Anthropic | Caption generation, content creation |
| Database | Neon Postgres | Performance tracking, analytics |
| Payments | Shopify Payments (Stripe) | Connected via Wise USD account |
| Banking | Wise | USD account for receiving payments |
| Business Entity | Wyoming LLC | US entity for Etsy/Shopify/Stripe access |

---

## Common Commands

```bash
# Development (Shopify CLI)
shopify theme dev          # Local theme development
shopify theme push         # Deploy theme changes

# n8n workflows
# Managed via n8n UI - workflows for social media automation
```

---

## Brand Identity Quick Reference

| Element | Value |
|---------|-------|
| Brand Name | Atlantida Gems |
| Tagline | "The rarest stones on Earth." |
| Logo | Wave x Gem Combined (Concept 5) |
| Primary Color | Larimar Blue `#5BBCD6` |
| Secondary | Deep Ocean `#1A4A6B` |
| Accent | Gold `#C9A84C` |
| Neutral | Silver `#C0C0C0` |
| Background | Cream `#FAF7F0` |
| Dark | `#0A0A08` |
| Fonts | Cinzel (headings), Cormorant Garamond (body), Montserrat (UI) |

---

## Session Continuity

**Quick Reference:**
1. Read `docs/CLAUDE.md` (this file)
2. Read `docs/SESSION-STATUS.md` for current state
3. Read `docs/PROJECT-BRIEF.md` for business context
4. Monitor context window (warn at <50k, stop at <20k tokens)
5. Update `SESSION-STATUS.md` after each completed task

---

## Critical Gotchas - Project Specific

### Cloudinary SDK fails on Vercel Serverless — SOLVED 2026-03-09

> **Never use the `cloudinary` npm SDK in Vercel serverless functions. Use REST API with unsigned upload preset instead.**

#### The Problem
Cloudinary SDK threw `[object Object]` errors in Vercel serverless. Error was not an `Error` instance, so `error.message` was undefined.

#### Root Cause
The `cloudinary` Node.js SDK uses internal HTTP modules that don't work correctly in Vercel's serverless/edge runtime.

#### The Solution
Use Cloudinary's REST API directly with an unsigned upload preset:
```typescript
// Create preset once via API, then use it forever
const uploadForm = new FormData();
uploadForm.append("file", base64DataUri);
uploadForm.append("upload_preset", "atlantida_unsigned");
const res = await fetch(`https://api.cloudinary.com/v1_1/dlk6s7llm/image/upload`, {
  method: "POST", body: uploadForm
});
```

#### DO NOT:
- Use `import { v2 as cloudinary } from "cloudinary"` in API routes
- Assume the SDK works just because it installs without errors

---

### Cloudinary Cloud Name ≠ Account Name — SOLVED 2026-03-09

> **Always verify cloud name from Cloudinary Dashboard > Product Environment. It's often an auto-generated string like `dlk6s7llm`, NOT your account name.**

#### The Problem
Used `atlantidagems` as cloud name (assumed from account). API returned "Unknown API key" and "Invalid api_key".

#### Root Cause
Cloudinary auto-generates cloud names (e.g., `dlk6s7llm`). API keys are tied to the cloud name, not the account name.

#### DO NOT:
- Guess the cloud name from the account/product name
- Assume cloud name matches what you named the account

---

### n8n WhatsApp Credential "Invalid access token" — SOLVED 2026-03-09

> **When using a Meta system user token in n8n WhatsApp credentials, the system user must have the WhatsApp Business Account assigned as an asset with "Full control", not just the app.**

#### The Problem
Created system user `n8n-bot`, generated permanent token, but n8n showed "Couldn't connect" / "Invalid access token" when saving the WhatsApp credential.

#### Root Cause
The system user only had the App assigned as an asset, but NOT the WhatsApp Business Account. The token needs account-level access to call WhatsApp APIs.

#### The Solution
1. Go to Meta Business Settings → System Users → select `n8n-bot`
2. Click "Add Assets" → select "WhatsApp accounts" (not Apps)
3. Assign "Test WhatsApp Business Account" with **Full control**
4. Regenerate the token with `whatsapp_business_messaging` + `whatsapp_business_management` permissions
5. Use the new token in n8n

#### DO NOT:
- Only assign the App as an asset — you also need the WhatsApp Business Account
- Reuse a token generated before assigning the WhatsApp account — regenerate after

---

### Async `isAdmin()` must be awaited — SOLVED 2026-03-09

> **`isAdmin()` in `admin-auth.ts` returns `Promise<boolean>`, not `boolean`. Always use `await isAdmin()`.**

#### The Problem
`if (!isAdmin())` always evaluated to `false` because `Promise` is truthy. Admin routes were either always accessible or always blocked depending on the negation.

#### The Solution
```typescript
if (!(await isAdmin())) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

---

### Vercel Env Vars: Add ALL at Once — SOLVED 2026-03-09

> **When configuring a service, grep the codebase for ALL `process.env.` references and add them all to Vercel at once.**

#### The Problem
Added `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` but forgot `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`. Upload silently failed.

#### DO NOT:
- Add env vars one at a time as you discover them
- Assume "it works locally" means all vars are on Vercel

---

### Vercel `echo` Mangles Special Characters — SOLVED 2026-03-09

> **Use `printf '%s' 'value' | vercel env add` instead of `echo` when piping values with `@`, `!`, `$`, or other special characters.**

#### The Problem
`echo "@Emiliano2024" | vercel env add ADMIN_PASSWORD` stripped the `@` symbol.

---

### Static Pages Don't Update After Admin Changes — SOLVED 2026-03-09

> **Always call `revalidatePath()` in admin API routes after database writes.**

#### The Problem
Admin saved product with image, but `/shop` and `/shop/[slug]` showed stale cached data for up to 5 minutes.

#### The Solution
```typescript
// In PUT/POST/DELETE handlers:
revalidatePath("/shop");
revalidatePath("/api/products");
revalidatePath(`/shop/${slug}`);
revalidatePath("/");
```

---

### Hidden File Input in Label Not Triggering — SOLVED 2026-03-09

> **Use programmatic `document.createElement("input").click()` instead of hidden file inputs inside labels.**

#### The Problem
`<label><input type="file" className="hidden"></label>` did not open the file picker dialog.

#### The Solution
```typescript
onClick={() => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = (e) => { /* handle file */ };
  input.click();
}}
```
