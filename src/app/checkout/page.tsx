"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { useApp } from "@/components/providers/AppProvider";

const COUNTRIES = [
  "United States", "Canada", "United Kingdom", "Germany", "France", "Spain",
  "Italy", "Netherlands", "Australia", "Japan", "Dominican Republic", "Mexico",
  "Brazil", "Colombia", "Puerto Rico", "Other",
];

export default function CheckoutPage() {
  const { t } = useApp();
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());
  const clearCart = useCartStore((s) => s.clearCart);
  const shippingCost = total >= 250 ? 0 : 19.99;
  const grandTotal = total + shippingCost;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          shipping: form,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      if (data.url) {
        // Redirect to Stripe Checkout
        clearCart();
        window.location.href = data.url;
      } else {
        setError("Could not create checkout session. Please contact us.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto max-w-md px-4">
          <h1 className="font-heading text-3xl tracking-[0.1em] text-ocean mb-4">
            {t.cart.empty}
          </h1>
          <Link
            href="/shop"
            className="inline-block bg-gold hover:bg-gold-dark text-dark px-10 py-4 font-ui text-sm tracking-[0.15em] uppercase transition-colors"
          >
            {t.cart.continueShopping}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl sm:text-4xl tracking-[0.1em] text-ocean">
            {t.checkout?.title || "Checkout"}
          </h1>
          <div className="gold-divider w-24 mx-auto mt-6" />
        </div>

        <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Shipping Form - Left Side */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-sm">
              <h2 className="font-heading text-xl tracking-[0.1em] text-ocean mb-6">
                {t.checkout?.shippingInfo || "Shipping Information"}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-ui text-xs text-ocean/60 uppercase tracking-wider mb-2">
                    {t.form.firstName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    className="w-full px-4 py-3 border border-gold/20 rounded-sm font-body text-ocean focus:outline-none focus:border-gold bg-cream"
                  />
                </div>
                <div>
                  <label className="block font-ui text-xs text-ocean/60 uppercase tracking-wider mb-2">
                    {t.form.lastName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    className="w-full px-4 py-3 border border-gold/20 rounded-sm font-body text-ocean focus:outline-none focus:border-gold bg-cream"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block font-ui text-xs text-ocean/60 uppercase tracking-wider mb-2">
                    {t.form.email} *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="w-full px-4 py-3 border border-gold/20 rounded-sm font-body text-ocean focus:outline-none focus:border-gold bg-cream"
                  />
                </div>
                <div>
                  <label className="block font-ui text-xs text-ocean/60 uppercase tracking-wider mb-2">
                    {t.form.phone}
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="w-full px-4 py-3 border border-gold/20 rounded-sm font-body text-ocean focus:outline-none focus:border-gold bg-cream"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block font-ui text-xs text-ocean/60 uppercase tracking-wider mb-2">
                  {t.checkout?.address || "Street Address"} *
                </label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="w-full px-4 py-3 border border-gold/20 rounded-sm font-body text-ocean focus:outline-none focus:border-gold bg-cream"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block font-ui text-xs text-ocean/60 uppercase tracking-wider mb-2">
                    {t.checkout?.city || "City"} *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="w-full px-4 py-3 border border-gold/20 rounded-sm font-body text-ocean focus:outline-none focus:border-gold bg-cream"
                  />
                </div>
                <div>
                  <label className="block font-ui text-xs text-ocean/60 uppercase tracking-wider mb-2">
                    {t.checkout?.state || "State / Province"} *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    className="w-full px-4 py-3 border border-gold/20 rounded-sm font-body text-ocean focus:outline-none focus:border-gold bg-cream"
                  />
                </div>
                <div>
                  <label className="block font-ui text-xs text-ocean/60 uppercase tracking-wider mb-2">
                    {t.checkout?.zip || "ZIP / Postal Code"} *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.zip}
                    onChange={(e) => updateField("zip", e.target.value)}
                    className="w-full px-4 py-3 border border-gold/20 rounded-sm font-body text-ocean focus:outline-none focus:border-gold bg-cream"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block font-ui text-xs text-ocean/60 uppercase tracking-wider mb-2">
                  {t.checkout?.country || "Country"} *
                </label>
                <select
                  required
                  value={form.country}
                  onChange={(e) => updateField("country", e.target.value)}
                  className="w-full px-4 py-3 border border-gold/20 rounded-sm font-body text-ocean focus:outline-none focus:border-gold bg-cream"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 sm:p-8 rounded-sm sticky top-24">
              <h2 className="font-heading text-xl tracking-[0.1em] text-ocean mb-6">
                {t.checkout?.orderSummary || "Order Summary"}
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-cream-dark rounded-sm flex-shrink-0 overflow-hidden">
                      {item.image && item.image !== "" ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gold/30 text-xs font-ui">IMG</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-ocean line-clamp-1">{item.name}</p>
                      <p className="font-ui text-xs text-ocean/60">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-ui text-sm text-ocean">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="gold-divider my-4" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-ui text-sm text-ocean/60">{t.cart.subtotal}</span>
                  <span className="font-ui text-sm text-ocean">{formatPrice(total)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-ui text-sm text-ocean/60">
                    {t.checkout?.shipping || "Shipping"}
                  </span>
                  {shippingCost === 0 ? (
                    <span className="font-ui text-sm text-gold font-medium">FREE</span>
                  ) : (
                    <span className="font-ui text-sm text-ocean/60">$19.99 USD</span>
                  )}
                </div>
              </div>

              <div className="gold-divider my-4" />

              <div className="flex justify-between mb-6">
                <span className="font-heading text-lg tracking-[0.1em] text-ocean uppercase">
                  Total
                </span>
                <span className="font-heading text-2xl text-gold">
                  {formatPrice(grandTotal)} USD
                </span>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm">
                  <p className="font-ui text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ambar-light hover:bg-ambar text-navy py-4 font-ui text-sm tracking-[0.15em] uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? (t.checkout?.processing || "Processing...")
                  : (t.checkout?.payNow || "Pay Now — Secure Checkout")}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-ocean/40">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <span className="font-ui text-xs">
                  {t.checkout?.secureNote || "Secured by Stripe. We never store your card details."}
                </span>
              </div>

              <Link
                href="/cart"
                className="block text-center mt-3 font-ui text-xs text-ocean/40 hover:text-gold transition-colors"
              >
                ← {t.checkout?.backToCart || "Back to Cart"}
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
