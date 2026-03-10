"use client";

import { useCartStore, generateOrderMessage } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { BRAND } from "@/lib/constants";
import { useApp } from "@/components/providers/AppProvider";
import Link from "next/link";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { t } = useApp();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const total = useCartStore((s) => s.total());

  if (!open) return null;

  const mailtoUrl = `mailto:${BRAND.email}?subject=Order%20from%20Ambar%20%26%20Larimar%20Shop&body=${generateOrderMessage(items)}`;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-dark/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-cream shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gold/20">
          <h2 className="font-heading text-lg tracking-[0.1em] text-ocean uppercase">
            {t.cart.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-ocean hover:text-gold transition-colors"
            aria-label="Close cart"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg className="h-16 w-16 text-gold/30 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <p className="font-body text-ocean/60 text-lg">{t.cart.empty}</p>
              <Link
                href="/shop"
                onClick={onClose}
                className="mt-4 font-ui text-sm text-gold hover:text-gold-dark transition-colors underline"
              >
                {t.cart.continueShopping}
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-4 border-b border-gold/10"
                >
                  <div className="w-20 h-20 bg-cream-dark rounded flex-shrink-0 overflow-hidden">
                    {item.image && item.image !== "" ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gold/30 text-xs font-ui">IMG</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/shop/${item.slug}`}
                      onClick={onClose}
                      className="font-body text-sm text-ocean hover:text-gold transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <p className="font-ui text-sm text-gold mt-1">
                      {formatPrice(item.price)}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 border border-gold/30 rounded text-ocean hover:bg-gold/10 font-ui text-sm flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="font-ui text-sm text-ocean w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 border border-gold/30 rounded text-ocean hover:bg-gold/10 font-ui text-sm flex items-center justify-center"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-ocean/40 hover:text-red-500 transition-colors"
                        aria-label={t.cart.remove}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gold/20 px-6 py-5">
            <div className="flex justify-between mb-2">
              <span className="font-ui text-sm text-ocean/60">
                {t.cart.subtotal}
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

            <div className="gold-divider my-3" />

            <div className="flex justify-between mb-4">
              <span className="font-heading text-sm tracking-[0.1em] text-ocean uppercase">
                Total
              </span>
              <span className="font-heading text-lg text-gold">
                {formatPrice(total >= 250 ? total : total + 19.99)} USD
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full bg-ambar-light hover:bg-ambar text-navy text-center py-3 rounded font-ui text-sm tracking-wider uppercase transition-colors"
            >
              {t.checkout?.payNow || "Proceed to Checkout"}
            </Link>
            <a
              href={mailtoUrl}
              className="block w-full text-center mt-3 py-3 border border-gold/30 text-ocean hover:bg-gold/10 rounded font-ui text-sm tracking-wider uppercase transition-colors"
            >
              {t.checkout?.orEmail || "Or Order via Email"}
            </a>
          </div>
        )}
      </div>
    </>
  );
}
