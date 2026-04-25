"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/types/product";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      className={`w-full py-4 font-ui text-sm tracking-[0.15em] uppercase transition-all ${
        added
          ? "bg-green-600 text-white"
          : "bg-gold hover:bg-gold-dark text-dark"
      }`}
    >
      {added ? "Added to Cart" : "Add to Cart"}
    </button>
  );
}
