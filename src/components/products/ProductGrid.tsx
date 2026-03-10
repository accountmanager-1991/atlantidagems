import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  showWholesalePrice?: boolean;
}

export default function ProductGrid({
  products,
  showWholesalePrice = false,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-body text-lg text-ocean/50">
          No products found matching your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showWholesalePrice={showWholesalePrice}
        />
      ))}
    </div>
  );
}
