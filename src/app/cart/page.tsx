"use client";

import Link from "next/link";
import { useCartStore, generateOrderMessage } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { BRAND } from "@/lib/constants";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const total = useCartStore((s) => s.total());

  const mailtoUrl = `mailto:${BRAND.email}?subject=Order%20from%20Ambar%20%26%20Larimar%20Shop&body=${generateOrderMessage(items)}`;

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl sm:text-4xl tracking-[0.1em] text-ocean">
            Your Cart
          </h1>
          <div className="gold-divider w-24 mx-auto mt-6" />
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-body text-xl text-ocean/50 mb-6">
              Your cart is empty
            </p>
            <Link
              href="/shop"
              className="inline-block bg-gold hover:bg-gold-dark text-dark px-10 py-4 font-ui text-sm tracking-[0.15em] uppercase transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-6 p-6 bg-white rounded-sm"
                >
                  <div className="w-24 h-24 bg-cream-dark rounded-sm flex-shrink-0 overflow-hidden">
                    {item.image && item.image !== "" ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gold/30 text-xs font-ui">IMG</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Link
                      href={`/shop/${item.slug}`}
                      className="font-body text-lg text-ocean hover:text-gold transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="font-ui text-sm text-gold mt-1">
                      {formatPrice(item.price)} each
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 border border-gold/30 rounded text-ocean hover:bg-gold/10 font-ui text-sm flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="font-ui text-sm text-ocean w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 border border-gold/30 rounded text-ocean hover:bg-gold/10 font-ui text-sm flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-heading text-lg text-ocean ml-auto">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-ocean/30 hover:text-red-500 transition-colors ml-4"
                        aria-label="Remove item"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-10 p-8 bg-white rounded-sm">
              <div className="flex justify-between mb-2">
                <span className="font-ui text-sm text-ocean/60">
                  Subtotal ({items.length}{" "}
                  {items.length === 1 ? "item" : "items"})
                </span>
                <span className="font-heading text-lg text-ocean">
                  {formatPrice(total)} USD
                </span>
              </div>

              <div className="flex justify-between mb-2">
                <span className="font-ui text-sm text-ocean/60">
                  Shipping
                </span>
                {total >= 250 ? (
                  <span className="font-ui text-sm text-gold font-medium">FREE</span>
                ) : (
                  <span className="font-ui text-sm text-ocean/60">$19.99 USD</span>
                )}
              </div>

              {total < 250 && (
                <p className="font-ui text-xs text-gold mt-1 mb-2">
                  Add {formatPrice(250 - total)} more for free shipping!
                </p>
              )}

              <div className="gold-divider my-4" />

              <div className="flex justify-between mb-8">
                <span className="font-heading text-lg tracking-[0.1em] text-ocean uppercase">
                  Total
                </span>
                <span className="font-heading text-2xl text-gold">
                  {formatPrice(total >= 250 ? total : total + 19.99)} USD
                </span>
              </div>

              <div className="space-y-3">
                <Link
                  href="/checkout"
                  className="block w-full bg-ambar-light hover:bg-ambar text-navy text-center py-4 font-ui text-sm tracking-[0.15em] uppercase transition-colors"
                >
                  Proceed to Checkout
                </Link>
                <a
                  href={mailtoUrl}
                  className="block w-full text-center py-4 border border-gold text-ocean hover:bg-gold/10 font-ui text-sm tracking-[0.15em] uppercase transition-colors"
                >
                  Or Order via Email
                </a>
              </div>

              <button
                onClick={clearCart}
                className="w-full mt-4 font-ui text-xs text-ocean/40 hover:text-red-500 transition-colors text-center"
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
