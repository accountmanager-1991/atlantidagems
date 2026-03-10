"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useApp } from "@/components/providers/AppProvider";

function SuccessContent() {
  const { t } = useApp();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || "";

  return (
    <div className="py-20 sm:py-28">
      <div className="mx-auto max-w-lg px-4 text-center">
        {/* Checkmark icon */}
        <div className="mx-auto w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mb-8">
          <svg
            className="h-10 w-10 text-gold"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl tracking-[0.1em] text-ocean mb-4">
          {t.checkout?.successTitle || "Thank You!"}
        </h1>
        <div className="gold-divider w-24 mx-auto mb-8" />

        {orderId && (
          <div className="bg-cream rounded-lg p-4 mb-6">
            <p className="font-ui text-xs tracking-[0.2em] text-ocean/40 mb-1">
              ORDER ID
            </p>
            <p className="font-heading text-lg text-ocean tracking-wider">
              {orderId.slice(0, 8).toUpperCase()}
            </p>
          </div>
        )}

        <p className="font-body text-lg text-ocean/70 mb-4">
          {t.checkout?.successMsg ||
            "Your order has been received. We'll send you a confirmation email shortly."}
        </p>
        <p className="font-body text-ocean/50 mb-10">
          {t.checkout?.successNote ||
            "Your handcrafted jewelry will be carefully packaged and shipped within 2-3 business days."}
        </p>

        <div className="space-y-3">
          {orderId && (
            <Link
              href={`/order/${orderId}`}
              className="block w-full bg-ocean hover:bg-ocean/90 text-cream py-4 font-ui text-sm tracking-[0.15em] uppercase transition-colors"
            >
              Track Your Order
            </Link>
          )}
          <Link
            href="/shop"
            className="block w-full bg-gold hover:bg-gold-dark text-dark py-4 font-ui text-sm tracking-[0.15em] uppercase transition-colors"
          >
            {t.cart.continueShopping}
          </Link>
          <Link
            href="/contact"
            className="block w-full py-4 border border-gold text-ocean hover:bg-gold/10 font-ui text-sm tracking-[0.15em] uppercase transition-colors"
          >
            {t.contact.title}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center">
          <div className="animate-pulse font-body text-ocean/50">
            Loading...
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
