export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  descriptionEs: string;
  shortDescriptionEs: string;
  descriptionDe: string;
  shortDescriptionDe: string;
  priceRetail: number;
  priceWholesale: number;
  minWholesaleQty: number;
  category: ProductCategory;
  stoneType: StoneType;
  metalType: MetalType;
  imageMain: string;
  image2: string;
  image3: string;
  image4: string;
  stockStatus: StockStatus;
  featured: boolean;
  wholesaleEligible: boolean;
  newArrival: boolean;
  weightGrams: number;
  dimensions: string;
  stoneOrigin: string;
  visible: boolean;
  sortOrder: number;
  dateAdded: string;
  seoTitle: string;
  seoDescription: string;
}

export type ProductCategory =
  | "earrings"
  | "pendants"
  | "necklaces"
  | "rings"
  | "bracelets";

export type StoneType = "larimar" | "amber" | "blue-amber";

export type MetalType = "sterling-silver" | "gold" | "gold-plated";

export type StockStatus = "in-stock" | "low-stock" | "sold-out" | "made-to-order";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
}

export interface ProductFilters {
  category?: ProductCategory;
  stoneType?: StoneType;
  metalType?: MetalType;
  priceRange?: [number, number];
  sortBy?: "price-asc" | "price-desc" | "newest" | "name";
}
