import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, HeadingLevel, AlignmentType, BorderStyle,
  WidthType, ShadingType, TableLayoutType
} from "docx";
import { writeFileSync } from "fs";

const BRAND_BLUE = "1A7A9E";
const BRAND_GOLD = "C9A84C";
const LIGHT_BLUE = "E8F4F8";
const LIGHT_GOLD = "FDF8EE";
const LIGHT_GRAY = "F5F5F5";
const WHITE = "FFFFFF";

const heading1 = (text) => new Paragraph({
  text,
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 400, after: 200 },
  run: { color: BRAND_BLUE, bold: true, size: 32 }
});

const heading2 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 26, color: BRAND_BLUE })],
  spacing: { before: 360, after: 160 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: BRAND_GOLD } }
});

const heading3 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 22, color: "333333" })],
  spacing: { before: 280, after: 120 }
});

const body = (text, options = {}) => new Paragraph({
  children: [new TextRun({ text, size: 20, color: "333333", ...options })],
  spacing: { after: 120 },
  alignment: AlignmentType.JUSTIFIED
});

const bullet = (text, bold_part = null) => new Paragraph({
  children: bold_part
    ? [new TextRun({ text: bold_part + " ", bold: true, size: 20, color: "333333" }),
       new TextRun({ text: text, size: 20, color: "555555" })]
    : [new TextRun({ text, size: 20, color: "555555" })],
  bullet: { level: 0 },
  spacing: { after: 80 }
});

const spacer = () => new Paragraph({ text: "", spacing: { after: 160 } });

const tableCell = (text, { bold = false, bg = WHITE, color = "333333", align = AlignmentType.LEFT, size = 18 } = {}) =>
  new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ text, bold, size, color })],
      alignment: align,
      spacing: { before: 80, after: 80 }
    })],
    shading: { fill: bg, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 }
  });

const headerCell = (text) => tableCell(text, { bold: true, bg: BRAND_BLUE, color: WHITE, align: AlignmentType.CENTER });
const altCell = (text, isAlt) => tableCell(text, { bg: isAlt ? LIGHT_BLUE : WHITE });

// ─── DOCUMENT ───────────────────────────────────────────────────────────────

const doc = new Document({
  creator: "Ambar & Larimar Shop",
  title: "Jewelry Subscription Box — Market Analysis",
  description: "Full market analysis and pricing strategy for Ambar & Larimar Shop subscription service",
  styles: {
    default: {
      document: {
        run: { font: "Calibri", size: 20 }
      }
    }
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 }
      }
    },
    children: [

      // ── COVER ──
      new Paragraph({
        children: [new TextRun({ text: "AMBAR & LARIMAR SHOP", bold: true, size: 48, color: BRAND_BLUE })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 800, after: 160 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Jewelry Subscription Box", size: 36, color: BRAND_GOLD, bold: true })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 160 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Market Analysis & Pricing Strategy", size: 26, color: "666666" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 160 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "March 2026  ·  Confidential", size: 20, color: "999999" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 800 }
      }),

      new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BRAND_GOLD } },
        spacing: { after: 600 }
      }),

      // ── 1. EXECUTIVE SUMMARY ──
      heading2("1. Executive Summary"),
      spacer(),
      body("Ambar & Larimar Shop is uniquely positioned to launch the only authentic Caribbean fine jewelry subscription box in the US, Canadian, and German markets. With 3,000 units of monthly production capacity, vertical supply chain ownership, and exclusive access to two of the world's rarest gemstones — Larimar and Dominican Blue Amber — the subscription model represents a high-margin, recurring revenue opportunity on top of the existing retail shop."),
      spacer(),
      body("This analysis covers production cost structure, ideal customer profiles, competitive landscape, recommended pricing tiers, and projected revenue at 3,000 subscribers."),
      spacer(),

      // ── 2. COST STRUCTURE ──
      heading2("2. Production Cost Structure"),
      spacer(),
      body("The cost per box varies significantly by materials and labor complexity. The table below reflects the realistic range across all four planned monthly options."),
      spacer(),

      new Table({
        layout: TableLayoutType.FIXED,
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [headerCell("Component"), headerCell("Low End"), headerCell("High End"), headerCell("Avg Estimate")] }),
          new TableRow({ children: [altCell("Materials (2–3 pieces)", true), altCell("$6", true), altCell("$15", true), altCell("$10", true)] }),
          new TableRow({ children: [altCell("Labor (2–3 pieces)", false), altCell("$10", false), altCell("$90", false), altCell("$35", false)] }),
          new TableRow({ children: [altCell("Packaging", true), altCell("$3", true), altCell("$8", true), altCell("$5", true)] }),
          new TableRow({ children: [altCell("International Shipping", false), altCell("$10", false), altCell("$22", false), altCell("$15", false)] }),
          new TableRow({
            children: [
              tableCell("TOTAL COGS / BOX", { bold: true, bg: LIGHT_GOLD }),
              tableCell("$29", { bold: true, bg: LIGHT_GOLD }),
              tableCell("$135", { bold: true, bg: LIGHT_GOLD }),
              tableCell("~$65", { bold: true, bg: LIGHT_GOLD })
            ]
          })
        ]
      }),
      spacer(),
      body("⚠  Key Insight: Labor is the largest cost variable ($5–$30 per piece). At 750 boxes per option, a $25 labor difference equals $18,750 per SKU. Standardizing labor cost per tier before setting final prices is critical."),
      spacer(),

      // ── 3. IDEAL CUSTOMER ──
      heading2("3. Ideal Customer Profiles"),
      spacer(),

      heading3("Primary: The Rare Collector"),
      bullet("Women, ages 32–52, located in USA, Canada, and Germany", "Who:"),
      bullet("$75,000–$160,000 household income", "Income:"),
      bullet("Travels, collects meaningful pieces, avoids wearing what everyone else wears", "Personality:"),
      bullet("Owning something genuinely rare with a real origin story", "Motivation:"),
      bullet("\"This stone only exists in one place on Earth\"", "Buying trigger:"),
      spacer(),

      heading3("Secondary: The Gift Buyer"),
      bullet("Men, ages 30–55, buying for wives, mothers, or girlfriends", "Who:"),
      bullet("Wants impressive, thoughtful gifts without jewelry expertise", "Motivation:"),
      bullet("Mother's Day, Valentine's Day, anniversaries, birthdays", "Buying trigger:"),
      bullet("Higher LTV — typically subscribes for 6–12 months as a gift", "Value:"),
      spacer(),

      heading3("The German Market Opportunity"),
      body("German consumers respond strongly to authenticity, Handwerk (craftsmanship), verified origin, and scarcity. The message 'Larimar exists in only one mountain in the Dominican Republic' is a premium positioning statement that resonates deeply with the German luxury goods buyer. Germany should be treated as a separate content market with EUR pricing and origin-focused messaging."),
      spacer(),

      // ── 4. COMPETITIVE LANDSCAPE ──
      heading2("4. Competitive Landscape"),
      spacer(),

      new Table({
        layout: TableLayoutType.FIXED,
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [headerCell("Competitor"), headerCell("Price/mo"), headerCell("Model"), headerCell("Their Weakness")] }),
          new TableRow({ children: [altCell("Rocksbox", true), altCell("$21", true), altCell("Rent (don't own)", true), altCell("No ownership, fashion-level quality", true)] }),
          new TableRow({ children: [altCell("Nadine West", false), altCell("$9–$35", false), altCell("Keep, low-end", false), altCell("Mass-produced, no story", false)] }),
          new TableRow({ children: [altCell("Menagerie", true), altCell("$35–$50", true), altCell("Raw crystals", true), altCell("Not wearable jewelry", true)] }),
          new TableRow({ children: [altCell("Gem & Jewel", false), altCell("$45–$75", false), altCell("Keep, mid-range", false), altCell("No unique stone angle", false)] }),
          new TableRow({
            children: [
              tableCell("Ambar & Larimar Shop", { bold: true, bg: LIGHT_GOLD }),
              tableCell("$69–$119", { bold: true, bg: LIGHT_GOLD }),
              tableCell("Keep, fine jewelry", { bold: true, bg: LIGHT_GOLD }),
              tableCell("None — only authentic Larimar + DR Amber source", { bold: true, bg: LIGHT_GOLD })
            ]
          })
        ]
      }),
      spacer(),
      body("No competitor offers authentic Larimar. Larimar is mined exclusively in Barahona, Dominican Republic, from a single deposit. Combined with Dominican Blue Amber — one of the rarest amber varieties on Earth — this is a moat that cannot be replicated, franchised, or mass-sourced by any competitor."),
      spacer(),

      // ── 5. PRICING PLANS ──
      heading2("5. Recommended Subscription Plans"),
      spacer(),
      body("The four monthly production options map cleanly to four subscription tiers, each targeting a different customer segment and price sensitivity."),
      spacer(),

      heading3("Plan A — Larimar Silver  ·  $69/month"),
      bullet("2 pieces: sterling silver + larimar (earrings + pendant or ring)", "Contents:"),
      bullet("Single stone focus — Larimar as the hero", "Theme:"),
      bullet("$38–$48 estimated COGS → 30–45% gross margin", "Economics:"),
      bullet("Entry-level plan, ideal for new subscribers and gift buyers", "Target:"),
      spacer(),

      heading3("Plan B — Amber Silver  ·  $69/month"),
      bullet("2 pieces: sterling silver + Dominican Blue Amber", "Contents:"),
      bullet("Same price point as Plan A, different stone preference", "Theme:"),
      bullet("$35–$45 estimated COGS → 35–49% gross margin", "Economics:"),
      bullet("For customers who prefer warm tones over ocean blues", "Target:"),
      spacer(),

      heading3("Plan C — Island Mix  ·  $89/month  ★ ANCHOR"),
      bullet("3 pieces: Larimar + Amber combination in sterling silver", "Contents:"),
      bullet("Best value perception — 3 pieces, both stones, under $100", "Theme:"),
      bullet("$52–$68 estimated COGS → 24–42% gross margin", "Economics:"),
      bullet("Primary recommended plan — highest expected conversion", "Target:"),
      spacer(),

      heading3("Plan D — Gold Edition  ·  $119/month"),
      bullet("3 pieces: gold or gold-plated settings, premium stones", "Contents:"),
      bullet("Exclusive box, premium packaging insert, certificate of authenticity", "Theme:"),
      bullet("$65–$95 estimated COGS → 20–45% gross margin", "Economics:"),
      bullet("Luxury segment, collector buyers, corporate gifts", "Target:"),
      spacer(),

      body("💡 Launch Recommendation: Lead with Plans A, C, and D only. Amber-only (Plan B) can be introduced in Month 2 or 3 once the Larimar story is established. Larimar is your headline — anchor all marketing to it first."),
      spacer(),

      // ── 6. REVENUE PROJECTIONS ──
      heading2("6. Revenue Projections at 3,000 Subscribers"),
      spacer(),
      body("Assumed subscriber distribution: 30% Plan A/B, 40% Plan C (Island Mix), 30% Plan D (Gold Edition)."),
      spacer(),

      new Table({
        layout: TableLayoutType.FIXED,
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [headerCell("Metric"), headerCell("Conservative"), headerCell("Target")] }),
          new TableRow({ children: [altCell("Avg revenue / subscriber", true), altCell("$82", true), altCell("$89", true)] }),
          new TableRow({ children: [altCell("Monthly gross revenue", false), altCell("$246,000", false), altCell("$267,000", false)] }),
          new TableRow({ children: [altCell("Est. monthly COGS", true), altCell("$147,000", true), altCell("$165,000", true)] }),
          new TableRow({
            children: [
              tableCell("Gross profit / month", { bold: true, bg: LIGHT_GOLD }),
              tableCell("$99,000", { bold: true, bg: LIGHT_GOLD }),
              tableCell("$102,000", { bold: true, bg: LIGHT_GOLD })
            ]
          }),
          new TableRow({
            children: [
              tableCell("Annual gross profit", { bold: true, bg: LIGHT_GOLD }),
              tableCell("~$1,188,000", { bold: true, bg: LIGHT_GOLD }),
              tableCell("~$1,224,000", { bold: true, bg: LIGHT_GOLD })
            ]
          })
        ]
      }),
      spacer(),
      body("These projections are in addition to regular shop (single-purchase) revenue. The subscription model creates predictable, recurring cash flow that can fund inventory production in advance each month."),
      spacer(),

      // ── 7. KEY RISKS ──
      heading2("7. Key Risks & Mitigation"),
      spacer(),

      heading3("Risk 1 — Subscriber Churn"),
      body("Jewelry subscription boxes average 6–9% monthly churn. At 3,000 subscribers, that is 180–270 cancellations every month. A constant acquisition engine is required just to hold subscriber count flat. Mitigation: launch the n8n social media automation pipeline (2–3 posts/day) and Etsy ads before or at subscription launch."),
      spacer(),

      heading3("Risk 2 — Labor Cost Variance at Scale"),
      body("Your labor cost ranges from $5 to $30 per piece. At 750 boxes per option, a $25 difference per piece equals $18,750 per SKU per month in unplanned cost. Mitigation: define a fixed labor cost per tier before pricing, and enforce it in production contracts with your workshop."),
      spacer(),

      heading3("Risk 3 — International Shipping from DR"),
      body("Shipping direct from DR to USA/Canada/Germany carries customs risk, delay risk, and variable costs. Mitigation: evaluate a US-based fulfillment center (e.g., ShipBob, Pirateship) where you ship bulk inventory monthly and they handle individual subscriber fulfillment. This can reduce per-box shipping from ~$18 to ~$8 and dramatically improve delivery times."),
      spacer(),

      heading3("Risk 4 — Quality Consistency"),
      body("Natural Larimar and Amber have inherent variation. At 3,000 boxes/month, subscribers may receive pieces that look significantly different from marketing photos. Mitigation: establish a clear grading system, photograph actual monthly inventory for marketing, and set subscriber expectations that natural variation is part of the product's authenticity."),
      spacer(),

      // ── 8. GO-TO-MARKET ──
      heading2("8. Go-To-Market Priorities"),
      spacer(),
      bullet("Anchor all messaging on scarcity: 'Only found in one place on Earth'", "1."),
      bullet("Set $89/month Island Mix as the default plan in all marketing", "2."),
      bullet("Build US fulfillment partnership before launch to solve shipping", "3."),
      bullet("Activate n8n social pipeline (Instagram, Pinterest, TikTok) 60 days before launch", "4."),
      bullet("Run Mother's Day and Valentine's Day gift campaigns as primary acquisition events", "5."),
      bullet("Germany: price in EUR (€69/€89/€119), translate origin story, target via Meta and Google", "6."),
      bullet("Add subscription option directly into existing shop site — seamless checkout", "7."),
      spacer(),
      spacer(),

      // ── FOOTER ──
      new Paragraph({
        border: { top: { style: BorderStyle.SINGLE, size: 2, color: BRAND_GOLD } },
        spacing: { before: 400, after: 160 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Ambar & Larimar Shop  ·  Emozca LLC  ·  Confidential  ·  March 2026", size: 16, color: "999999" })],
        alignment: AlignmentType.CENTER
      }),
    ]
  }]
});

const buffer = await Packer.toBuffer(doc);
writeFileSync("Ambar-Larimar-Subscription-Market-Analysis.docx", buffer);
console.log("✅ Document created: Ambar-Larimar-Subscription-Market-Analysis.docx");
