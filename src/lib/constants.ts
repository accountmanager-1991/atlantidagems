export const BRAND = {
  name: "Ambar & Larimar Shop",
  tagline: "The rarest stones on Earth.",
  subtitle: "Fine Caribbean Jewelry · By Ambar Mine Museum",
  description:
    "Fine Caribbean Jewelry — Handcrafted Larimar & Amber jewelry from the Dominican Republic. Rare by nature, yours forever.",
  url: "https://ambarlarimarshop.com",
  email: "sales@ambarlarimarshop.com",
  phone: "809-919-4205",
  instagram: "https://instagram.com/ambarlarimarshop",
  facebook: "https://facebook.com/ambarlarimarshop",
  pinterest: "https://pinterest.com/ambarlarimarshop",
  tiktok: "https://tiktok.com/@ambarlarimarshop",
} as const;

export const COLORS = {
  ambarLight: "#FFB830",
  ambar: "#D06800",
  ambarDeep: "#6B3000",
  larimar: "#3AADCC",
  larimarMid: "#1A7A9E",
  larimarDeep: "#0E3A54",
  gold: "#C9A84C",
  goldLight: "#EDD8A0",
  cream: "#FAF7F0",
  silver: "#C0C0C0",
  navy: "#0C1420",
  midnight: "#08080E",
} as const;

export const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Wholesale", href: "/wholesale" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  earrings: "Earrings",
  pendants: "Pendants",
  necklaces: "Necklaces",
  rings: "Rings",
  bracelets: "Bracelets",
};

export const STONE_LABELS: Record<string, string> = {
  larimar: "Larimar",
  amber: "Amber",
  "blue-amber": "Blue Amber",
};

export const METAL_LABELS: Record<string, string> = {
  "sterling-silver": "Sterling Silver",
  gold: "Gold",
  "gold-plated": "Gold Plated",
};

export const CHECKOUT_MODE = process.env.NEXT_PUBLIC_CHECKOUT_MODE || "contact";
