"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { fmtUSD } from "@/lib/admin-constants";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DbOrder = Record<string, any>;

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const CARRIERS = ["USPS", "UPS", "FedEx", "DHL", "Other"];

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-cyan-100 text-cyan-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  paid: "Paid · Ready",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function safeJson<T>(s: unknown, fallback: T): T {
  if (typeof s !== "string") return fallback;
  try { return JSON.parse(s) as T; } catch { return fallback; }
}

function relativeTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso).getTime();
  const diff = Date.now() - d;
  const day = 24 * 60 * 60 * 1000;
  if (diff < day) return "Today";
  if (diff < 2 * day) return "Yesterday";
  if (diff < 7 * day) return `${Math.floor(diff / day)}d ago`;
  if (diff < 30 * day) return `${Math.floor(diff / (7 * day))}w ago`;
  return new Date(iso).toLocaleDateString();
}

function countryFromAddress(country: string | null | undefined): string {
  if (!country) return "—";
  const c = country.trim().toUpperCase();
  if (c === "USA" || c === "UNITED STATES" || c === "US") return "USA";
  if (c === "DOMINICAN REPUBLIC" || c === "DR" || c === "DO") return "DR";
  if (c.length <= 3) return c;
  return c.slice(0, 3);
}

export default function OrdersManager() {
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingCarrier, setTrackingCarrier] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === selectedId) || null,
    [orders, selectedId],
  );

  function openOrder(order: DbOrder) {
    setSelectedId(order.id);
    setTrackingNumber(order.tracking_number || "");
    setTrackingCarrier(order.tracking_carrier || "");
    setOrderNotes(order.notes || "");
    setOrderStatus(order.status || "pending");
    setMessage("");
  }

  async function saveOrder() {
    if (!selectedOrder) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: orderStatus,
          tracking_number: trackingNumber,
          tracking_carrier: trackingCarrier,
          notes: orderNotes,
          send_shipping_email:
            sendEmail &&
            orderStatus === "shipped" &&
            trackingNumber &&
            trackingNumber !== selectedOrder.tracking_number,
        }),
      });
      if (res.ok) {
        setMessage("Saved & synced");
        fetchOrders();
      } else {
        setMessage("Failed to update");
      }
    } catch {
      setMessage("Network error");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3500);
    }
  }

  // KPI calculations
  const kpis = useMemo(() => {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const isPaid = (o: DbOrder) => ["paid", "shipped", "delivered"].includes(o.status);
    const pending = orders.filter((o) => o.status === "pending").length;
    const ready = orders.filter((o) => o.status === "paid").length;
    const shipped7d = orders.filter((o) => o.status === "shipped" && o.shipped_at && now - new Date(o.shipped_at).getTime() < 7 * day).length;
    const delivered30d = orders.filter((o) => o.status === "delivered" && o.created_at && now - new Date(o.created_at).getTime() < 30 * day).length;
    const paidOrders30d = orders.filter((o) => isPaid(o) && o.paid_at && now - new Date(o.paid_at).getTime() < 30 * day);
    const revenue30d = paidOrders30d.reduce((s, o) => s + Number(o.total || 0), 0);
    const avgOrder = paidOrders30d.length > 0 ? revenue30d / paidOrders30d.length : 0;
    return { pending, ready, shipped7d, delivered30d, revenue30d, avgOrder };
  }, [orders]);

  // Filtered orders for display
  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  if (loading) {
    return <p className="text-center font-ui text-sm text-ocean/40 py-20">Loading orders...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl tracking-[0.08em] text-ocean">Orders</h2>
          <p className="font-ui text-xs text-ocean/40 mt-1">
            {orders.length} total · {kpis.pending} pending · {kpis.ready} ready to ship
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="font-ui text-xs px-3 py-2 border border-gold/30 rounded text-ocean bg-white">
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid (ready to ship)</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="inline-flex border border-gold/40 rounded overflow-hidden">
            <button onClick={() => setView("grid")}
              className={`px-4 py-2 font-ui text-xs tracking-wider uppercase font-medium transition-colors ${view === "grid" ? "bg-ambar-light text-navy" : "bg-white text-ocean/55 hover:bg-cream-dark"}`}>
              ▦ Grid
            </button>
            <button onClick={() => setView("table")}
              className={`px-4 py-2 font-ui text-xs tracking-wider uppercase font-medium transition-colors ${view === "table" ? "bg-ambar-light text-navy" : "bg-white text-ocean/55 hover:bg-cream-dark"}`}>
              ≡ Table
            </button>
          </div>
          <button onClick={fetchOrders}
            className="px-4 py-2 bg-ocean text-cream rounded font-ui text-xs tracking-wider uppercase hover:bg-ocean/80 transition-colors">
            Refresh
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Kpi label="Pending" value={kpis.pending.toString()} tone={kpis.pending > 0 ? "warn" : undefined} />
        <Kpi label="Ready to Ship" value={kpis.ready.toString()} tone={kpis.ready > 0 ? "warn" : undefined} />
        <Kpi label="Shipped (7d)" value={kpis.shipped7d.toString()} />
        <Kpi label="Delivered (30d)" value={kpis.delivered30d.toString()} tone="good" />
        <Kpi label="Revenue (30d)" value={fmtUSD(kpis.revenue30d)} tone="gold" />
        <Kpi label="Avg Order" value={fmtUSD(kpis.avgOrder)} tone="gold" />
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-gold/10">
          <p className="font-heading text-lg text-ocean">No orders yet</p>
          <p className="font-ui text-sm text-ocean/50 mt-2">Orders appear here once customers complete checkout.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {/* Orders list/grid */}
          <div className={`lg:col-span-2 ${view === "grid" ? "" : ""}`}>
            {view === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredOrders.map((o) => <OrderCard key={o.id} order={o} selected={o.id === selectedId} onClick={() => openOrder(o)} />)}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gold/10 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-cream-dark">
                    <tr>
                      <th className="px-3 py-3 text-left font-ui text-[10px] uppercase tracking-wider text-ocean/55">Order</th>
                      <th className="px-3 py-3 text-left font-ui text-[10px] uppercase tracking-wider text-ocean/55">Customer</th>
                      <th className="px-3 py-3 text-left font-ui text-[10px] uppercase tracking-wider text-ocean/55">Date</th>
                      <th className="px-3 py-3 text-left font-ui text-[10px] uppercase tracking-wider text-ocean/55">Status</th>
                      <th className="px-3 py-3 text-right font-ui text-[10px] uppercase tracking-wider text-ocean/55">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((o) => {
                      const items = safeJson<OrderItem[]>(o.items_json, []);
                      return (
                        <tr key={o.id} onClick={() => openOrder(o)}
                          className={`border-t border-gold/10 cursor-pointer transition-colors ${o.id === selectedId ? "bg-ambar-light/20" : "hover:bg-cream/40"}`}>
                          <td className="px-3 py-3 font-mono text-xs text-ocean/70">#{o.id.slice(0, 8).toUpperCase()}</td>
                          <td className="px-3 py-3">
                            <p className="font-body text-sm text-ocean">{o.customer_name}</p>
                            <p className="font-ui text-xs text-ocean/55">{items.length} item{items.length !== 1 ? "s" : ""}</p>
                          </td>
                          <td className="px-3 py-3 font-ui text-xs text-ocean/60">{relativeTime(o.created_at)}</td>
                          <td className="px-3 py-3">
                            <span className={`inline-block px-2 py-0.5 rounded-full font-ui text-[10px] uppercase tracking-wider font-semibold ${STATUS_BADGE[o.status] || "bg-gray-100 text-gray-600"}`}>
                              {STATUS_LABEL[o.status] || o.status}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-right font-heading text-sm text-gold-deep">${Number(o.total || 0).toFixed(0)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Detail panel — sticky */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6">
              {selectedOrder ? (
                <OrderDetail
                  order={selectedOrder}
                  status={orderStatus} setStatus={setOrderStatus}
                  carrier={trackingCarrier} setCarrier={setTrackingCarrier}
                  trackingNumber={trackingNumber} setTrackingNumber={setTrackingNumber}
                  notes={orderNotes} setNotes={setOrderNotes}
                  sendEmail={sendEmail} setSendEmail={setSendEmail}
                  saving={saving} message={message} onSave={saveOrder}
                />
              ) : (
                <div className="text-center py-16 bg-white rounded-lg border border-gold/10 border-dashed">
                  <p className="font-heading text-sm tracking-wider text-ocean/40 uppercase">Select an order</p>
                  <p className="font-ui text-xs text-ocean/40 mt-2">Click a card to update it</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ----- Sub-components -----

function Kpi({ label, value, tone }: { label: string; value: string; tone?: "good" | "warn" | "bad" | "gold" }) {
  const toneClass =
    tone === "good" ? "text-green-700" :
    tone === "warn" ? "text-yellow-700" :
    tone === "bad" ? "text-red-600" :
    tone === "gold" ? "text-gold-deep" :
    "text-ocean";
  return (
    <div className="bg-white rounded-lg border border-gold/15 p-4">
      <p className="font-ui text-[9px] uppercase tracking-[0.18em] text-ocean/55 font-medium">{label}</p>
      <p className={`font-heading text-2xl mt-1 ${toneClass}`}>{value}</p>
    </div>
  );
}

function OrderCard({ order, selected, onClick }: { order: DbOrder; selected: boolean; onClick: () => void }) {
  const items = safeJson<OrderItem[]>(order.items_json, []);
  const status = order.status || "pending";
  const country = countryFromAddress(order.shipping_country);

  return (
    <button onClick={onClick}
      className={`text-left bg-white rounded-lg border overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md ${selected ? "border-ambar ring-2 ring-ambar-light" : "border-gold/20 hover:border-gold"}`}>
      {/* Top */}
      <div className="px-4 py-3 flex justify-between items-start border-b border-gold/12">
        <span className="font-mono text-[11px] text-ocean/55">#{order.id.slice(0, 8).toUpperCase()}</span>
        <span className={`px-2.5 py-1 rounded-full font-ui text-[10px] uppercase tracking-wider font-semibold ${STATUS_BADGE[status] || "bg-gray-100 text-gray-600"}`}>
          {STATUS_LABEL[status] || status}
        </span>
      </div>
      {/* Customer */}
      <div className="px-4 py-3">
        <p className="font-heading text-base text-ocean tracking-[0.04em] mb-1 truncate">{order.customer_name}</p>
        <div className="font-ui text-[11px] text-ocean/60 flex gap-2 items-center flex-wrap">
          <span className="bg-cream-dark px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider">{country}</span>
          <span className="truncate">{order.shipping_state || order.customer_email}</span>
        </div>
      </div>
      {/* Items thumb strip */}
      <div className="px-4 pb-3 flex items-center gap-2">
        <div className="flex">
          {items.slice(0, 4).map((it, i) => (
            <div key={i} className="w-7 h-7 -ml-1.5 first:ml-0 rounded border-2 border-white bg-cream-dark overflow-hidden flex-shrink-0">
              {it.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[8px] text-ocean/30">·</div>
              )}
            </div>
          ))}
        </div>
        <span className="font-ui text-[11px] text-ocean/55">{items.length} item{items.length !== 1 ? "s" : ""}</span>
      </div>
      {/* Bottom */}
      <div className="px-4 py-2.5 border-t border-gold/12 bg-cream-dark/60 flex justify-between items-center">
        <span className="font-ui text-[10px] text-ocean/55 tracking-wider">{relativeTime(order.created_at)}</span>
        <span className="font-heading text-base text-gold-deep">${Number(order.total || 0).toFixed(0)}</span>
      </div>
      {/* Tracking bar */}
      {order.tracking_number && (
        <div className={`px-4 py-1.5 ${status === "delivered" ? "bg-green-700" : "bg-larimar-deep"} text-cream font-ui text-[10px] tracking-wider flex justify-between items-center`}>
          <span><span className="opacity-70">{order.tracking_carrier || "Tracked"}</span> {order.tracking_number.slice(0, 18)}{order.tracking_number.length > 18 ? "..." : ""}</span>
          <span>{status === "delivered" ? "✓" : "★"}</span>
        </div>
      )}
    </button>
  );
}

function OrderDetail({
  order, status, setStatus, carrier, setCarrier, trackingNumber, setTrackingNumber,
  notes, setNotes, sendEmail, setSendEmail, saving, message, onSave,
}: {
  order: DbOrder;
  status: string; setStatus: (v: string) => void;
  carrier: string; setCarrier: (v: string) => void;
  trackingNumber: string; setTrackingNumber: (v: string) => void;
  notes: string; setNotes: (v: string) => void;
  sendEmail: boolean; setSendEmail: (v: boolean) => void;
  saving: boolean; message: string; onSave: () => void;
}) {
  const items = safeJson<OrderItem[]>(order.items_json, []);
  const trackingChanged = Boolean(trackingNumber && trackingNumber !== order.tracking_number);
  const willSyncShipping = status === "shipped" && trackingChanged;

  return (
    <div className="bg-white rounded-lg border border-gold/25 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gold/15 flex justify-between items-center bg-cream-dark/40">
        <h3 className="font-heading text-sm tracking-[0.15em] uppercase text-ocean">
          #{order.id.slice(0, 8).toUpperCase()}
        </h3>
        <span className={`px-2.5 py-1 rounded-full font-ui text-[10px] uppercase tracking-wider font-semibold ${STATUS_BADGE[order.status] || "bg-gray-100 text-gray-600"}`}>
          {STATUS_LABEL[order.status] || order.status}
        </span>
      </div>

      {/* Customer */}
      <div className="px-5 py-4 border-b border-gold/15">
        <p className="font-ui text-[10px] uppercase tracking-[0.15em] text-ocean/55 mb-2 font-medium">Customer</p>
        <p className="font-body text-base text-ocean">{order.customer_name}</p>
        <a href={`mailto:${order.customer_email}`} className="font-ui text-xs text-larimar-mid hover:underline block mt-1">{order.customer_email}</a>
        {order.customer_phone && <p className="font-ui text-xs text-ocean/70 mt-1">{order.customer_phone}</p>}
        <p className="font-ui text-xs text-ocean/70 mt-2 leading-relaxed">
          {[order.shipping_address, order.shipping_city, order.shipping_state, order.shipping_zip, order.shipping_country].filter(Boolean).join(", ") || "—"}
        </p>
      </div>

      {/* Items */}
      <div className="px-5 py-4 border-b border-gold/15">
        <p className="font-ui text-[10px] uppercase tracking-[0.15em] text-ocean/55 mb-3 font-medium">Items</p>
        <div className="space-y-2">
          {items.map((it, i) => (
            <div key={i} className="flex gap-3 items-center p-2 bg-cream-dark rounded">
              <div className="w-9 h-9 rounded bg-cream overflow-hidden flex-shrink-0">
                {it.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.image} alt="" className="w-full h-full object-cover" />
                ) : null}
              </div>
              <span className="flex-1 font-body text-sm text-ocean truncate">{it.name}</span>
              <span className="font-ui text-xs text-ocean/55">×{it.quantity}</span>
              <span className="font-body text-sm text-gold-deep font-semibold">${(it.price * it.quantity).toFixed(0)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 p-3 bg-cream-dark rounded font-ui text-xs">
          <div className="flex justify-between text-ocean/65 mb-1"><span>Subtotal</span><span>${Number(order.subtotal || 0).toFixed(2)}</span></div>
          <div className="flex justify-between text-ocean/65 mb-1"><span>Shipping</span><span>{Number(order.shipping_cost || 0) === 0 ? "FREE" : `$${Number(order.shipping_cost || 0).toFixed(2)}`}</span></div>
          <div className="flex justify-between font-heading text-base text-ocean pt-2 mt-2 border-t border-gold/30"><span>Total</span><span>${Number(order.total || 0).toFixed(2)} USD</span></div>
        </div>
      </div>

      {/* Update form */}
      <div className="px-5 py-4 bg-cream-dark/30">
        <p className="font-ui text-[10px] uppercase tracking-[0.15em] text-ocean/55 mb-3 font-medium">Update order</p>

        <div className="space-y-3">
          <div>
            <label className="block font-ui text-[10px] uppercase tracking-[0.15em] text-ocean/55 mb-1 font-medium">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="w-full font-ui text-sm border border-gold/30 rounded px-3 py-2 bg-white text-ocean focus:outline-none focus:border-gold">
              <option value="pending">Pending</option>
              <option value="paid">Paid (ready to ship)</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block font-ui text-[10px] uppercase tracking-[0.15em] text-ocean/55 mb-1 font-medium">Carrier</label>
            <select value={carrier} onChange={(e) => setCarrier(e.target.value)}
              className="w-full font-ui text-sm border border-gold/30 rounded px-3 py-2 bg-white text-ocean focus:outline-none focus:border-gold">
              <option value="">Select carrier...</option>
              {CARRIERS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-ui text-[10px] uppercase tracking-[0.15em] text-ocean/55 mb-1 font-medium">Tracking number</label>
            <input type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number..."
              className="w-full font-ui text-sm border border-gold/30 rounded px-3 py-2 bg-white text-ocean focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="block font-ui text-[10px] uppercase tracking-[0.15em] text-ocean/55 mb-1 font-medium">Internal notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
              placeholder="Add notes about this order..."
              className="w-full font-ui text-sm border border-gold/30 rounded px-3 py-2 bg-white text-ocean focus:outline-none focus:border-gold" />
          </div>
        </div>

        {/* Sync indicators */}
        <p className="font-ui text-[10px] uppercase tracking-[0.15em] text-ocean/55 mt-4 mb-2 font-medium">Auto-syncs on save</p>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <SyncCard label="GHL Contact" value={`Tag · ${status}`} active />
          <SyncCard label="GHL Pipeline" value={`Stage · ${status}`} active />
          <SyncCard label="Customer Email" value={willSyncShipping && sendEmail ? "Shipping notice" : "—"} active={willSyncShipping && sendEmail} />
          <SyncCard label="WhatsApp (n8n)" value={willSyncShipping ? "Owner alert" : "—"} active={willSyncShipping} />
        </div>

        {willSyncShipping && (
          <label className="flex items-center gap-2 mb-3 font-ui text-xs text-ocean/70 cursor-pointer">
            <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)}
              className="w-4 h-4 accent-ambar-light" />
            Send shipping confirmation email to customer
          </label>
        )}

        {message && (
          <p className={`font-ui text-xs mb-3 ${message.toLowerCase().includes("fail") || message.toLowerCase().includes("error") ? "text-red-600" : "text-green-700"}`}>
            {message}
          </p>
        )}

        <button onClick={onSave} disabled={saving}
          className="w-full bg-ambar-light hover:bg-ambar text-navy py-3 rounded font-ui text-xs tracking-[0.18em] uppercase font-semibold transition-colors disabled:opacity-50">
          {saving ? "Saving..." : "Save & Sync All"}
        </button>

        <div className="text-center mt-3">
          <a href={`/order/${order.id}${order.access_token ? `?token=${order.access_token}` : ""}`} target="_blank" rel="noopener noreferrer"
            className="font-ui text-[11px] text-larimar-mid hover:underline tracking-wider">
            View customer tracking page →
          </a>
        </div>
      </div>
    </div>
  );
}

function SyncCard({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className={`p-2.5 rounded border-l-2 ${active ? "bg-green-50 border-green-600" : "bg-cream-dark border-gold/40"}`}>
      <p className="font-ui text-[9px] uppercase tracking-[0.12em] text-ocean/55 flex items-center gap-1 font-medium">
        <span className={`inline-block w-1.5 h-1.5 rounded-full ${active ? "bg-green-600" : "bg-ocean/30"}`} />
        {label}
      </p>
      <p className={`font-ui text-[11px] mt-0.5 font-semibold ${active ? "text-green-700" : "text-ocean/55"}`}>{value}</p>
    </div>
  );
}
