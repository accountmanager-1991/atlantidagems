import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType } from "docx";
import { writeFileSync } from "fs";

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({ heading: level, spacing: { before: 400, after: 200 }, children: [new TextRun({ text, bold: true })] });
}

function p(text, bold = false) {
  return new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text, bold })] });
}

function row(field, value) {
  const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
  const borders = { top: border, bottom: border, left: border, right: border };
  return new TableRow({
    children: [
      new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: field, bold: true, size: 20 })] })] }),
      new TableCell({ borders, width: { size: 7000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: value, size: 20 })] })] }),
    ],
  });
}

function table(rows) {
  return new Table({ width: { size: 9500, type: WidthType.DXA }, rows: rows.map(([f, v]) => row(f, v)) });
}

const doc = new Document({
  sections: [{
    properties: {},
    children: [
      heading("Ambar & Larimar Shop — Social Media Profile Kit"),
      p("Complete profile information for all social media platforms"),
      p(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`),
      p(""),

      // Universal Brand Info
      heading("Universal Brand Info", HeadingLevel.HEADING_2),
      table([
        ["Business Name", "Ambar & Larimar Shop"],
        ["Legal Name", "Emozca LLC"],
        ["Website", "https://ambarlarimarshop.com"],
        ["Shop URL", "https://ambarlarimarshop.com/shop"],
        ["Email", "sales@ambarlarimarshop.com"],
        ["Phone", "+1 (809) 919-4205"],
        ["Location", "Dominican Republic"],
        ["Category", "Jewelry / Gemstones / Handcrafted Jewelry"],
        ["Founded", "2026"],
        ["Tagline", "The rarest stones on Earth."],
      ]),
      p(""),

      // Instagram
      heading("Instagram", HeadingLevel.HEADING_2),
      table([
        ["Username", "@ambarlarimarshop"],
        ["Name", "Ambar & Larimar Shop"],
        ["Bio Line 1", "💎 The rarest stones on Earth."],
        ["Bio Line 2", "🇩🇴 Larimar & Dominican Amber in silver & gold"],
        ["Bio Line 3", "✨ Handcrafted in the Dominican Republic"],
        ["Bio Line 4", "🛒 Shop our collection ↓"],
        ["Website", "https://ambarlarimarshop.com/shop"],
        ["Category", "Jewelry/Watches"],
        ["Contact Email", "sales@ambarlarimarshop.com"],
        ["Phone", "+18099194205"],
        ["Action Button", "Shop Now → https://ambarlarimarshop.com/shop"],
        ["Profile Photo", "Logo icon (from brand-kit/)"],
        ["Highlights", "Larimar, Amber, New Arrivals, Reviews, Behind the Scenes, Wholesale"],
      ]),
      p(""),

      // Facebook
      heading("Facebook Page", HeadingLevel.HEADING_2),
      table([
        ["Page Name", "Ambar & Larimar Shop"],
        ["Username", "@ambarlarimarshop"],
        ["Category", "Jewelry Store"],
        ["Sub-category", "Handmade Jewelry"],
        ["About (Short)", "The rarest stones on Earth. Authentic Larimar & Dominican Amber jewelry, handcrafted in silver and gold. Shipped worldwide from the Dominican Republic."],
        ["About (Long)", "Ambar & Larimar Shop is a fine Caribbean jewelry brand specializing in two of the world's rarest gemstones: Larimar — a volcanic blue stone found only in the Dominican Republic — and Dominican Blue Amber, among the clearest and most prized amber in the world. Every piece is handcrafted by artisans in the DR, set in sterling silver or gold. We ship worldwide with tracked shipping. Wholesale inquiries welcome."],
        ["Website", "https://ambarlarimarshop.com"],
        ["Email", "sales@ambarlarimarshop.com"],
        ["Phone", "+1 (809) 919-4205"],
        ["Hours", "Mon-Sat 9am-6pm (AST)"],
        ["Location", "Dominican Republic"],
        ["Price Range", "$$"],
        ["CTA Button", "Shop Now → https://ambarlarimarshop.com/shop"],
        ["Profile Photo", "Logo icon"],
        ["Cover Photo", "Hero image or product flat lay"],
      ]),
      p(""),

      // TikTok
      heading("TikTok", HeadingLevel.HEADING_2),
      table([
        ["Username", "@ambarlarimarshop"],
        ["Name", "Ambar & Larimar Shop 💎"],
        ["Bio Line 1", "The rarest stones on Earth 🌊"],
        ["Bio Line 2", "Larimar & Amber jewelry from the DR 🇩🇴"],
        ["Bio Line 3", "Handcrafted in silver & gold ✨"],
        ["Bio Line 4", "Shop below ↓"],
        ["Website", "https://ambarlarimarshop.com/shop"],
        ["Category", "Shopping"],
        ["Email", "sales@ambarlarimarshop.com"],
        ["Profile Photo", "Logo icon"],
      ]),
      p(""),

      // Pinterest
      heading("Pinterest", HeadingLevel.HEADING_2),
      table([
        ["Business Name", "Ambar & Larimar Shop"],
        ["Username", "ambarlarimarshop"],
        ["About", "Authentic Larimar & Dominican Amber jewelry handcrafted in silver and gold. The rarest stones on Earth, from the Dominican Republic to your collection. Shop earrings, pendants, necklaces, rings, and bracelets."],
        ["Website", "https://ambarlarimarshop.com (claim it!)"],
        ["Profile Photo", "Logo icon"],
        ["Board 1", "Larimar Jewelry — all larimar pieces"],
        ["Board 2", "Dominican Amber Jewelry — all amber pieces"],
        ["Board 3", "Caribbean Jewelry Inspiration — lifestyle/mood board"],
        ["Board 4", "Gift Ideas — curated gift sets"],
        ["Board 5", "Wholesale Collections — bulk/wholesale photos"],
      ]),
      p(""),

      // Twitter/X
      heading("Twitter / X", HeadingLevel.HEADING_2),
      table([
        ["Display Name", "Ambar & Larimar Shop"],
        ["Username", "@ambarlarimar"],
        ["Bio", "The rarest stones on Earth. 💎 Authentic Larimar & Dominican Amber jewelry, handcrafted in silver & gold. 🇩🇴 Shop → ambarlarimarshop.com"],
        ["Website", "https://ambarlarimarshop.com"],
        ["Location", "Dominican Republic"],
        ["Profile Photo", "Logo icon"],
        ["Header Image", "Product flat lay or hero image"],
      ]),
      p(""),

      // Google Business
      heading("Google Business Profile", HeadingLevel.HEADING_2),
      table([
        ["Business Name", "Ambar & Larimar Shop"],
        ["Category", "Jewelry Store, Online Jewelry Store"],
        ["Description", "Ambar & Larimar Shop is a fine Caribbean jewelry brand specializing in two of the world's rarest gemstones: Larimar and Dominican Blue Amber. Every piece is handcrafted by artisans in the Dominican Republic, set in sterling silver or gold. We ship worldwide with tracked shipping. Free shipping on orders over $250."],
        ["Website", "https://ambarlarimarshop.com"],
        ["Phone", "+1 (809) 919-4205"],
        ["Email", "sales@ambarlarimarshop.com"],
        ["Service Areas", "United States, Canada, Germany, Worldwide"],
        ["Hours", "Mon-Sat 9am-6pm AST"],
        ["Attributes", "Online store, Ships internationally"],
      ]),
      p(""),

      // Etsy
      heading("Etsy (When Ready)", HeadingLevel.HEADING_2),
      table([
        ["Shop Name", "AmbarLarimarShop"],
        ["Shop Title", "Authentic Larimar & Dominican Amber Jewelry — Handcrafted in Silver & Gold"],
        ["About", "We are a family-owned jewelry workshop in the Dominican Republic, crafting pieces with two of the rarest gemstones on Earth: Larimar — a blue volcanic stone found nowhere else — and Dominican Blue Amber, prized for its clarity and golden glow. Every piece is handcrafted by local artisans and set in sterling silver or gold. From our workshop to your collection."],
        ["Shop Announcement", "Welcome! Free shipping on orders over $250. Every piece comes with a Certificate of Authenticity."],
        ["Shop Members", "Owner & Curator"],
        ["Location", "Dominican Republic"],
        ["Shipping", "$19.99 flat rate, free over $250"],
      ]),
      p(""),

      // Hashtag Strategy
      heading("Hashtag Strategy", HeadingLevel.HEADING_2),
      p("Always use (on every post):", true),
      p("#ambarlarimarshop #larimar #larimarjewelry #dominicanamber #caribbeanjewelry #rarestones #handcraftedjewelry"),
      p(""),
      p("Rotate (mix 15-20 per post):", true),
      p("#silverrings #gemstonejewelry #dominicanrepublic #tropicaljewelry #islandjewelry #bluestonejewelry #amberjewelry #sterlingsilver #jewelrylover #uniquejewelry #artisanjewelry #bohojewelry #beachjewelry #luxuryjewelry #finejewelry #jewelryaddict #giftsforher #mothersday #handmadejewelry #madeindr"),
    ],
  }],
});

const buffer = await Packer.toBuffer(doc);
writeFileSync("Ambar-Larimar-Social-Media-Profiles.docx", buffer);
console.log("✅ Created: Ambar-Larimar-Social-Media-Profiles.docx");
