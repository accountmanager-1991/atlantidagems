# Project Brief - Atlantida Gems

**Created:** 2026-03-09

---

## Business Overview

**Company:** Atlantida Gems
**Entity:** Wyoming LLC (to be filed via Northwest Registered Agent)
**Industry:** Jewelry export - gemstones and precious metals
**Location:** Production in Dominican Republic, selling to USA and international markets

### What We Sell
- **Larimar jewelry** - The only place on Earth where Larimar is found (DR). Known as "The Atlantis Stone"
- **Dominican Amber jewelry** - Including rare Dominican Blue Amber
- **Settings:** Sterling silver and gold
- **Products:** Earrings, pendants, necklaces, rings, bracelets

### Why This Business
- Larimar is genuinely rare and exotic to international buyers (scarcity = competitive moat)
- 5x-10x markup: $15-30 production cost retails for $80-250+ in the US
- Low overhead: inventory ships in a box via DHL/FedEx
- Scalable without proportional cost increase
- Owner already has inventory and production relationships in DR
- Owner has strong automation skills (n8n, GoHighLevel, AI)

---

## Brand Identity

| Element | Value |
|---------|-------|
| **Name** | Atlantida Gems |
| **Tagline** | "The rarest stones on Earth." |
| **Sub-taglines** | "Wear the ocean. Own the legend." / "Found only in one place on Earth." / "Rare by nature. Yours forever." |
| **Logo** | Wave x Gem Combined - diamond shape with ocean waves flowing through center |
| **Style** | Luxury/elegant (Tiffany-level clean, not bohemian) |
| **Fonts** | Cinzel (headings), Cormorant Garamond (body), Montserrat (UI) |

### Color Palette

| Color | Hex | Use |
|-------|-----|-----|
| Larimar Blue | `#5BBCD6` | Primary brand color |
| Deep Ocean | `#1A4A6B` | Headers, depth, luxury feel |
| Gold | `#C9A84C` | Accent, premium elements |
| Silver | `#C0C0C0` | Secondary metal color |
| Cream White | `#FAF7F0` | Backgrounds |
| Deep Dark | `#0A0A08` | Text, luxury contrast |

### Brand Assets (2026-04 redesign — Concept A "Caribbean Sun")
- `brand-kit/01-LOGOS/final-2026-04/logo-mark.svg` — Primary seal (circular, used everywhere)
- `brand-kit/01-LOGOS/final-2026-04/logo-horizontal.svg` — Wordmark + seal lockup
- `brand-kit/01-LOGOS/final-2026-04/png/` — 23 PNG sizes (32–2048px) + favicons
- `brand-kit/02-SOCIAL-2026-04/` — Banners (FB/X/LinkedIn/YouTube/Pinterest/Etsy) + IG templates, light + dark
- `brand-kit/03-BUSINESS-CARD-2026-04/` — Print-ready cards (3.5"×2", 1/8" bleed, 300 DPI)
- `brand-kit/00-BRAND-GUIDE/Ambar-Larimar-Brand-Guide.pdf` — Full brand book
- `brand-kit/google-drive-ready/` — Per-platform folders, drag-into-Drive structure
- See `docs/BRAND.md` for the complete asset map and regen commands

---

## Target Markets

### Primary: USA
- $78.4B jewelry market (2024), expected $97.6B by 2030
- Key demographic: Women 25-44, self-purchase trending up
- Target regions: Florida, California, New York (beach towns, spa boutiques, yoga studios)

### Secondary: Germany & Western Europe
- 21.43% of global jewelry market
- Strong demand for ethical, artisan, natural stones
- Premium pricing opportunity

### Tertiary: Canada & Australia
- English-speaking, strong online shopping, similar taste to US

---

## Financial Projections

### Pricing Structure

| Product | Production Cost | Retail Price | Wholesale Price |
|---------|----------------|--------------|-----------------|
| Silver + Larimar earrings | $25-40 | $80-140 | ~$65 |
| Silver + Larimar pendant | $30-55 | $100-200 | ~$65 |
| Silver + Larimar ring | $35-60 | $120-250 | ~$65 |
| Gold + Larimar necklace | $80-120 | $280-500 | ~$150 |
| Amber + Silver earrings | $20-35 | $60-120 | ~$50 |
| Amber + Silver pendant | $25-45 | $80-160 | ~$55 |

### Revenue Scenarios (Monthly at Scale)

| Scenario | Pieces/mo | Net Profit/mo | Annual |
|----------|-----------|---------------|--------|
| Conservative | 300 | $15,950 | $191K |
| Base Case | 450 | $49,021 | $588K |
| Optimistic | 600 | $77,200 | $926K |
| Best Case | 750 | $116,250 | $1.4M |

**Gross margins:** 82-87%
**Breakeven:** 2-3 pieces/month covers all overhead

### Monthly Operating Costs

| Item | Cost |
|------|------|
| Shopify Basic | $39 |
| Domain | ~$1.50 |
| Email marketing (Klaviyo) | $0-20 |
| Canva Pro | $15 |
| n8n (self-hosted) | $0 |
| **Total (no ads)** | **$55-75/mo** |
| Meta/Google ads (when ready) | $300-500/mo |

---

## Sales Channels

| Channel | Pieces/mo | Avg Price | Monthly Revenue |
|---------|-----------|-----------|-----------------|
| Etsy / Shopify (retail) | 200 | $145 | $29,000 |
| Wholesale to boutiques | 150 | $65 | $9,750 |
| Instagram/TikTok direct | 60 | $160 | $9,600 |
| Trade shows / Markets | 40 | $130 | $5,200 |
| **Total** | **450** | | **$53,550** |

---

## Tech Stack

| Tool | Purpose | Status |
|------|---------|--------|
| Shopify | Primary e-commerce store | To set up |
| Etsy | Secondary marketplace | Requires LLC first |
| n8n | Social media automation, order routing, email flows | Available |
| GoHighLevel | CRM, sales funnels, wholesale outreach | Available |
| OpenAI/Anthropic API | AI caption generation, content creation | Available |
| Neon Postgres | Performance tracking, analytics | Available |
| Wise | USD banking (routing + account number) | Active |
| Stripe (via Shopify) | Payment processing | Requires LLC |

---

## Social Media Strategy

### Platforms (Priority Order)
1. **Instagram** - #1 for jewelry, Reels 3x/week
2. **Pinterest** - Underrated for jewelry, cross-post all Reels
3. **Facebook** - Meta Graph API via n8n
4. **TikTok** - Video content, limited API
5. **Etsy** - Auto-listing via API
6. **YouTube** - Shorts
7. **Google Ads** - When ready to scale

### Automation Pipeline (n8n)
```
Upload product photo + info
        |
n8n triggers automatically
        |
AI generates platform-specific captions
        |
Posts scheduled & published to all platforms
        |
Results logged to Neon Postgres
```

### Content Strategy
- Jewelry making process Reels (3x/week)
- Product close-ups (3x/week)
- "Stone meaning" carousels (2x/week)
- Behind-the-scenes DR content (1x/week)
- Daily Story with link to product page
- Posting frequency: 2-3x per day across all platforms

### Instagram Growth Targets

| Month | Followers | Store Visits | Sales from IG |
|-------|-----------|-------------|---------------|
| 1 | 200-500 | 300-600 | 3-8 pieces |
| 2 | 500-1,500 | 800-1,500 | 8-20 pieces |
| 3 | 1,500-4,000 | 2,000-4,000 | 20-45 pieces |
| 6 | 5,000-15,000 | 6,000-12,000 | 60-120 pieces |

---

## Legal Setup (Pending)

| Step | Action | Cost | Status |
|------|--------|------|--------|
| 1 | Wyoming LLC via Northwest Registered Agent | $139 ($39 service + $100 state) | Not started |
| 2 | EIN from IRS (bundled with LLC) | $50 add-on | Not started |
| 3 | Connect Wise USD account | $0 | Wise already active |
| 4 | Open Shopify under US entity | $39/mo | Not started |
| 5 | Set up Stripe via Shopify Payments | Free (% per sale) | Not started |
| | **Total one-time setup** | **~$189** | |

**Timeline:** ~2 weeks from filing to fully operational

---

## Key Business Insights

1. **Photography is non-negotiable** - Professional photos on white/ocean background convert 3-4x better
2. **Authenticity story sells** - 78% of US consumers consider ethical sourcing when buying jewelry
3. **Wholesale = predictable revenue** - 150 boutique pieces/month at $65 = $9,750 recurring
4. **$50/mo ads** - Better spent on Etsy ads than Meta for a new store
5. **Consistency > everything** - 3 Reels/week for 90 days beats any ad spend
6. **Larimar prices rising** - Up 20% from 2020-2024, scarcity increasing

---

## Immediate Next Steps

1. Check domain + Instagram handle availability
2. File Wyoming LLC + EIN via Northwest Registered Agent
3. Build Shopify store with brand identity
4. Set up n8n social media automation workflow
5. Create 30-day Instagram content calendar
6. Begin wholesale outreach to FL/CA/NY boutiques
