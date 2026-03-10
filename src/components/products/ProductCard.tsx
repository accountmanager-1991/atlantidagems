"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { STONE_LABELS, METAL_LABELS } from "@/lib/constants";
import type { Product } from "@/types/product";
import { useCartStore } from "@/lib/cart-store";
import { optimizeImage } from "@/lib/cloudinary";

interface ProductCardProps {
  product: Product;
  showWholesalePrice?: boolean;
}

export default function ProductCard({
  product,
  showWholesalePrice = false,
}: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="group relative bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.newArrival && (
          <span className="bg-gold text-dark font-ui text-[10px] tracking-wider uppercase px-2 py-1">
            New
          </span>
        )}
        {product.stockStatus === "low-stock" && (
          <span className="bg-ocean text-cream font-ui text-[10px] tracking-wider uppercase px-2 py-1">
            Low Stock
          </span>
        )}
        {product.stockStatus === "sold-out" && (
          <span className="bg-dark text-cream font-ui text-[10px] tracking-wider uppercase px-2 py-1">
            Sold Out
          </span>
        )}
      </div>

      {/* Image */}
      <Link href={`/shop/${product.slug}`}>
        <div className="aspect-square bg-cream-dark flex items-center justify-center overflow-hidden">
          {product.imageMain && product.imageMain !== "/images/placeholder.jpg" ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={optimizeImage(product.imageMain, 400)}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-larimar/10 to-ocean/10 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500">
              <span className="font-heading text-gold/20 text-sm tracking-widest uppercase">
                {STONE_LABELS[product.stoneType]}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-body text-base text-ocean group-hover:text-gold transition-colors line-clamp-2 normal-case">
            {product.name}
          </h3>
        </Link>
        <p className="font-ui text-xs text-ocean/50 mt-1">
          {STONE_LABELS[product.stoneType]} &middot;{" "}
          {METAL_LABELS[product.metalType]}
        </p>
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="font-heading text-lg text-gold tracking-wide normal-case">
              {formatPrice(
                showWholesalePrice
                  ? product.priceWholesale
                  : product.priceRetail
              )}
            </span>
            {showWholesalePrice && (
              <span className="font-ui text-xs text-ocean/40 ml-2">
                min. {product.minWholesaleQty} pcs
              </span>
            )}
          </div>
          {product.stockStatus !== "sold-out" && (
            <button
              onClick={() => addItem(product)}
              className="p-2 border border-gold/30 rounded hover:bg-gold hover:text-dark text-gold transition-all"
              aria-label={`Add ${product.name} to cart`}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
