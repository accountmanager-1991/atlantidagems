export type AdminLang = "en" | "es";

export const CATEGORIES = ["earrings", "pendants", "necklaces", "rings", "bracelets"] as const;
export const STONE_TYPES = ["larimar", "amber", "blue-amber"] as const;
export const METAL_TYPES = ["sterling-silver", "gold", "gold-plated"] as const;
export const STOCK_STATUSES = ["in-stock", "low-stock", "sold-out", "made-to-order"] as const;

export const CATEGORY_LABELS: Record<AdminLang, Record<string, string>> = {
  en: { earrings: "Earrings", pendants: "Pendants", necklaces: "Necklaces", rings: "Rings", bracelets: "Bracelets" },
  es: { earrings: "Aretes", pendants: "Dijes", necklaces: "Collares", rings: "Anillos", bracelets: "Pulseras" },
};

export const STONE_LABELS: Record<AdminLang, Record<string, string>> = {
  en: { larimar: "Larimar", amber: "Amber", "blue-amber": "Blue Amber" },
  es: { larimar: "Larimar", amber: "Ambar", "blue-amber": "Ambar Azul" },
};

export const METAL_LABELS: Record<AdminLang, Record<string, string>> = {
  en: { "sterling-silver": "Sterling Silver", gold: "Gold", "gold-plated": "Gold Plated" },
  es: { "sterling-silver": "Plata 925", gold: "Oro", "gold-plated": "Banado en Oro" },
};

export const STOCK_LABELS: Record<AdminLang, Record<string, string>> = {
  en: { "in-stock": "In Stock", "low-stock": "Low Stock", "sold-out": "Sold Out", "made-to-order": "Made to Order" },
  es: { "in-stock": "En Stock", "low-stock": "Poco Stock", "sold-out": "Agotado", "made-to-order": "Bajo Pedido" },
};

export const LOW_STOCK_THRESHOLD = 3;

export function totalCost(p: Record<string, unknown>): number {
  return (
    Number(p.material_cost || 0) +
    Number(p.labor_cost || 0) +
    Number(p.packaging_cost || 0) +
    Number(p.shipping_cost || 0)
  );
}

export function marginPct(retail: number, cost: number): number {
  if (!retail || retail <= 0) return 0;
  return ((retail - cost) / retail) * 100;
}

export function fmtUSD(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
