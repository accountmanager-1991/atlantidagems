"use client";

import { useState, useEffect, use } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  customerName: string;
  status: string;
  trackingNumber: string;
  trackingCarrier: string;
  items: OrderItem[];
  subtotal: string;
  shippingCost: string;
  total: string;
  shippedAt: string | null;
  paidAt: string | null;
  createdAt: string;
}

const STATUS_STEPS = ["pending", "paid", "shipped", "delivered"];

const STATUS_LABELS: Record<string, string> = {
  pending: "Order Placed",
  paid: "Payment Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
};

function getTrackingUrl(carrier: string, tracking: string): string {
  const c = carrier.toLowerCase();
  if (c.includes("usps"))
    return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${tracking}`;
  if (c.includes("ups"))
    return `https://www.ups.com/track?tracknum=${tracking}`;
  if (c.includes("fedex"))
    return `https://www.fedex.com/fedextrack/?trknbr=${tracking}`;
  if (c.includes("dhl"))
    return `https://www.dhl.com/us-en/home/tracking.html?tracking-id=${tracking}`;
  return "";
}

export default function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setError("Access token required. Please use the link from your confirmation email.");
      setLoading(false);
      return;
    }
    fetch(`/api/orders/${id}?token=${encodeURIComponent(token)}`)
      .then((r) => {
        if (r.status === 403) throw new Error("Invalid access token.");
        if (!r.ok) throw new Error("Order not found");
        return r.json();
      })
      .then(setOrder)
      .catch((e) => setError(e.message || "Order not found. Please check your order ID."))
      .finally(() => setLoading(false));
  }, [id, token]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-pulse font-body text-ocean/50">
          Loading order...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="py-20 sm:py-28">
        <div className="mx-auto max-w-lg px-4 text-center">
          <h1 className="font-heading text-3xl tracking-[0.1em] text-ocean mb-4">
            Order Not Found
          </h1>
          <p className="font-body text-ocean/60 mb-8">{error}</p>
          <Link
            href="/shop"
            className="inline-block bg-gold hover:bg-gold-dark text-dark py-3 px-8 font-ui text-sm tracking-[0.15em] uppercase transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const currentStep = STATUS_STEPS.indexOf(order.status);
  const trackingUrl = order.trackingNumber
    ? getTrackingUrl(order.trackingCarrier, order.trackingNumber)
    : "";

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl sm:text-4xl tracking-[0.1em] text-ocean mb-2">
            Order Status
          </h1>
          <div className="gold-divider w-24 mx-auto mb-4" />
          <p className="font-body text-ocean/50 text-sm">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            {/* Progress line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-ocean/10" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-gold transition-all duration-500"
              style={{
                width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%`,
              }}
            />

            {STATUS_STEPS.map((step, i) => {
              const isActive = i <= currentStep;
              const isCurrent = i === currentStep;
              return (
                <div
                  key={step}
                  className="relative z-10 flex flex-col items-center"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-ui transition-colors ${
                      isActive
                        ? "bg-gold text-dark"
                        : "bg-cream border-2 border-ocean/20 text-ocean/30"
                    } ${isCurrent ? "ring-4 ring-gold/20" : ""}`}
                  >
                    {isActive ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-ui tracking-wider ${
                      isActive ? "text-ocean" : "text-ocean/30"
                    }`}
                  >
                    {STATUS_LABELS[step]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tracking Number */}
        {order.trackingNumber && (
          <div className="bg-cream rounded-lg p-6 mb-8 text-center border border-gold/20">
            <p className="font-ui text-xs tracking-[0.2em] text-ocean/50 mb-2">
              TRACKING NUMBER
            </p>
            <p className="font-heading text-xl text-ocean tracking-wider mb-1">
              {order.trackingNumber}
            </p>
            <p className="font-body text-ocean/50 text-sm mb-4">
              {order.trackingCarrier || "Standard Shipping"}
            </p>
            {trackingUrl && (
              <a
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gold hover:bg-gold-dark text-dark py-3 px-8 font-ui text-sm tracking-[0.15em] uppercase transition-colors"
              >
                Track Package
              </a>
            )}
          </div>
        )}

        {/* Order Details */}
        <div className="bg-white border border-ocean/10 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-ocean/10">
            <h2 className="font-heading text-lg tracking-[0.1em] text-ocean">
              Order Details
            </h2>
          </div>

          {/* Items */}
          <div className="divide-y divide-ocean/5">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-16 h-16 bg-cream rounded-lg" />
                )}
                <div className="flex-1">
                  <p className="font-body text-ocean">{item.name}</p>
                  <p className="font-body text-ocean/50 text-sm">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-body text-ocean">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="p-6 bg-cream/50 space-y-2">
            <div className="flex justify-between font-body text-ocean/60">
              <span>Subtotal</span>
              <span>${parseFloat(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-body text-ocean/60">
              <span>Shipping</span>
              <span>
                {parseFloat(order.shippingCost) === 0
                  ? "FREE"
                  : `$${parseFloat(order.shippingCost).toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between font-heading text-lg text-ocean pt-2 border-t border-gold/30">
              <span>Total</span>
              <span>${parseFloat(order.total).toFixed(2)} USD</span>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-cream/50 rounded-lg p-4">
            <p className="font-ui text-xs tracking-wider text-ocean/40 mb-1">
              ORDERED
            </p>
            <p className="font-body text-ocean text-sm">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          {order.paidAt && (
            <div className="bg-cream/50 rounded-lg p-4">
              <p className="font-ui text-xs tracking-wider text-ocean/40 mb-1">
                PAID
              </p>
              <p className="font-body text-ocean text-sm">
                {new Date(order.paidAt).toLocaleDateString()}
              </p>
            </div>
          )}
          {order.shippedAt && (
            <div className="bg-cream/50 rounded-lg p-4">
              <p className="font-ui text-xs tracking-wider text-ocean/40 mb-1">
                SHIPPED
              </p>
              <p className="font-body text-ocean text-sm">
                {new Date(order.shippedAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            href="/shop"
            className="font-ui text-sm text-gold hover:text-gold-dark tracking-wider transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
