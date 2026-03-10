"use client";

import Link from "next/link";
import type { Product } from "@/types/product";
import ProductGrid from "@/components/products/ProductGrid";
import { useApp } from "@/components/providers/AppProvider";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const { t } = useApp();

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="font-ui text-xs tracking-[0.4em] text-gold mb-3 uppercase">
            {t.featured.badge}
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl tracking-[0.1em] text-ocean">
            {t.featured.title}
          </h2>
          <div className="gold-divider w-24 mx-auto mt-6" />
        </div>

        <ProductGrid products={products} />

        <div className="text-center mt-14">
          <Link
            href="/shop"
            className="inline-block border border-gold text-gold hover:bg-gold hover:text-dark px-10 py-4 font-ui text-sm tracking-[0.15em] uppercase transition-all"
          >
            {t.featured.viewAll}
          </Link>
        </div>
      </div>
    </section>
  );
}
