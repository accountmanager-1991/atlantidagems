"use client";

import { useState, useEffect, useMemo } from "react";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFilters from "@/components/products/ProductFilters";
import type { Product } from "@/types/product";
import { useApp } from "@/components/providers/AppProvider";

export default function ShopPage() {
  const { t } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [stone, setStone] = useState("");
  const [metal, setMetal] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Read initial filters from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("stone")) setStone(params.get("stone")!);
    if (params.get("category")) setCategory(params.get("category")!);
    if (params.get("metal")) setMetal(params.get("metal")!);
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];

    if (category) result = result.filter((p) => p.category === category);
    if (stone) result = result.filter((p) => p.stoneType === stone);
    if (metal) result = result.filter((p) => p.metalType === metal);

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.priceRetail - b.priceRetail);
        break;
      case "price-desc":
        result.sort((a, b) => b.priceRetail - a.priceRetail);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        result.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));
        break;
    }

    return result;
  }, [products, category, stone, metal, sortBy]);

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-ui text-xs tracking-[0.4em] text-gold mb-3 uppercase">
            {t.shop.title}
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl tracking-[0.1em] text-ocean">
            {t.shop.title}
          </h1>
          <div className="gold-divider w-24 mx-auto mt-6" />
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <ProductFilters
            selectedCategory={category}
            selectedStone={stone}
            selectedMetal={metal}
            sortBy={sortBy}
            onCategoryChange={setCategory}
            onStoneChange={setStone}
            onMetalChange={setMetal}
            onSortChange={setSortBy}
          />
          <p className="font-ui text-sm text-ocean/50">
            {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
          </p>
        </div>

        {/* Products */}
        {loading ? (
          <div className="text-center py-20">
            <p className="font-body text-lg text-ocean/50">
              Loading...
            </p>
          </div>
        ) : (
          <ProductGrid products={filtered} />
        )}
      </div>
    </div>
  );
}
