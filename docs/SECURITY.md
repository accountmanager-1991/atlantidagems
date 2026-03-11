# Security Policy — Ambar & Larimar Shop
**Last Updated:** 2026-03-11
**Status:** Active

---

## 1. Secrets & Credentials

### Rules (no exceptions)
- **Never paste API keys, passwords, or tokens into AI chat sessions**
- **Never commit `.env` or `.env.local` to git** — covered by `.gitignore: .env*`
- **Never hardcode credentials in source files** — always use `process.env.*`
- If a secret is accidentally exposed to AI or in a chat: **rotate it immediately**

### Current Credentials — Stored in Vercel Only
| Variable | Service | Notes |
|----------|---------|-------|
| `ADMIN_PASSWORD` | Site admin login | HMAC-SHA256 signed session |
| `DATABASE_URL` | Neon Postgres | Pooler URL, no `channel_binding` |
| `STRIPE_SECRET_KEY` | Stripe | Pending activation |
| `STRIPE_WEBHOOK_SECRET` | Stripe | Pending activation |
| `ANTHROPIC_API_KEY` | Claude Haiku | AI descriptions |
| `GHL_PRIVATE_KEY` | GoHighLevel | Rotate — was shared in chat 03/11/2026 |
| `GHL_LOCATION_ID` | GoHighLevel | Sub-account location |
| `N8N_ORDER_WEBHOOK_URL` | n8n | WhatsApp notifications |
| `NEXT_PUBLIC_BASE_URL` | App | Set when custom domain ready |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary | Public — not secret |

### Rotation Schedule
**Next rotation due: 2026-06-11** (90 days from formation)

Keys to rotate:
- [ ] `ADMIN_PASSWORD`
- [ ] `GHL_PRIVATE_KEY` ← **URGENT: rotate now** (shared in chat 03/11/2026)
- [ ] `STRIPE_SECRET_KEY` (when activated)
- [ ] `ANTHROPIC_API_KEY`
- [ ] n8n WhatsApp system user token (shared in Session 6)
- [ ] `DATABASE_URL` (Neon — rotate from Neon dashboard)

---

## 2. Incident Response — Exposed Secret

If a secret is exposed (shared in chat, committed to git, etc.):

1. **Rotate the key immediately** — do not wait
2. Update the new value in Vercel env vars
3. Redeploy on Vercel to pick up new key
4. Update `.env.local` if used locally
5. Note the incident in this file with date

### Known Exposures
| Date | Key | Action Taken |
|------|-----|-------------|
| 2026-03-11 | `GHL_PRIVATE_KEY` | Shared in chat — **ROTATE NOW** |
| 2026-03-09 | n8n WhatsApp system user token | Shared in Session 6 chat — rotate |

---

## 3. Codebase Security — Current Status

**Last audit: 2026-03-11 — PASSED**

| Check | Status |
|-------|--------|
| No hardcoded secrets | ✅ Pass |
| `.gitignore` covers all `.env*` | ✅ Pass |
| No `.env` files tracked by git | ✅ Pass |
| All API routes authenticated | ✅ Pass |
| Input validation on all forms | ✅ Pass |
| Parameterized DB queries (no SQL injection) | ✅ Pass |
| Admin auth uses HMAC-SHA256 + timing-safe compare | ✅ Pass |
| Stripe webhook signature verified | ✅ Pass |
| HTML escaping on all user data in emails | ✅ Pass |
| Order tracking requires access token | ✅ Pass |

---

## 4. AI Agent Security Rules

When working with Claude Code or any AI agent:

- **Never share raw `.env` file contents** — share variable names only, never values
- **Never paste credentials** into the chat for any reason
- If you need Claude to understand env var structure, say "I have STRIPE_SECRET_KEY configured" — do not paste the value
- Claude should never be given access to `~/.ssh`, `~/.aws`, or system keychains
- Treat all AI session logs as potentially readable — write accordingly

---

## 5. n8n Workflow Security

n8n workflows process external data (webhooks, emails). Risks:

- **Prompt injection:** Malicious content in order data could attempt to manipulate AI nodes
- **Mitigation:** Never pass raw webhook payloads directly to AI nodes — extract and validate specific fields first

Current n8n workflows:
- `zQ1QFgkwEpcP6YZW` — WhatsApp order notifications (Webhook → WhatsApp)
- Low risk (no AI nodes), but validate all incoming data

---

## 6. GitHub Repo — Public

The repo at `github.com/accountmanager-1991/atlantidagems` is **public**.

Before every `git push`:
- [ ] No `.env` files staged
- [ ] No hardcoded credentials in changed files
- [ ] No customer data or PII in code

GitHub secret scanning is active — you will be alerted if a secret is pushed.

---

## 7. Production vs Development

| Environment | Stripe | Notes |
|------------|--------|-------|
| Development | Test mode keys only | Never use live keys locally |
| Production (Vercel) | Live keys | Only after Stripe verification |

Never use `STRIPE_SECRET_KEY=sk_live_...` in `.env.local`.

---

## 8. Dependency Security

All 17 dependencies audited 2026-03-11 — all legitimate, no suspicious packages.

Run periodically:
```bash
npm audit
```

Note: `resend` package still installed but unused (GHL replaced it). Remove when confirmed stable:
```bash
npm uninstall resend
```

---

## 9. Single Provider Risk

Current AI dependency: **Anthropic Claude Haiku** (description generation only).
- Low risk — feature is optional, admin-only, gracefully skipped if key missing
- If Anthropic changes pricing/availability: wrap call in `src/app/api/admin/generate/route.ts` with provider abstraction

---

## 10. Future Security Items (When Relevant)

| Item | Trigger |
|------|---------|
| Rate limiting on login + forms | Before high traffic / launch (TD005) |
| Separate dev/prod GHL accounts | When consulting business grows |
| Secrets scanning pre-commit hook | When team grows beyond 1 developer |
| WAF / DDoS protection | When revenue justifies it |
| Audit logging for admin actions | Phase 3 growth feature |
