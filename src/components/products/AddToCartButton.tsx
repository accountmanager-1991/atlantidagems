"use client";

import { useState } from "react";
import { useCartStore, generateOrderMessage } from "@/lib/cart-store";
import { BRAND } from "@/lib/constants";
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

  const orderMessage = generateOrderMessage([
    {
      id: product.id,
      name: product.name,
      price: product.priceRetail,
      image: product.imageMain,
      quantity: 1,
      slug: product.slug,
    },
  ]);

  const mailtoUrl = `mailto:${BRAND.email}?subject=Order%20from%20Ambar%20%26%20Larimar%20Shop&body=${orderMessage}`;

  return (
    <div className="flex flex-col gap-3">
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
      <a
        href={mailtoUrl}
        className="w-full py-4 text-center border border-ambar-light text-ambar hover:bg-ambar-light/10 font-ui text-sm tracking-[0.15em] uppercase transition-colors"
      >
        Order via Email
      </a>
    </div>
  );
}
