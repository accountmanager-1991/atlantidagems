"use client";

import { useState, useEffect, useCallback } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DbOrder = Record<string, any>;

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-purple-100 text-purple-800",
  cancelled: "bg-red-100 text-red-800",
};

const CARRIERS = ["USPS", "UPS", "FedEx", "DHL", "Other"];

export default function OrdersManager() {
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<DbOrder | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingCarrier, setTrackingCarrier] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
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

  function openOrder(order: DbOrder) {
    setSelectedOrder(order);
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
        setMessage("Order updated successfully!");
        fetchOrders();
        // Update selected order locally
        setSelectedOrder((prev) =>
          prev
            ? {
                ...prev,
                status: orderStatus,
                tracking_number: trackingNumber,
                tracking_carrier: trackingCarrier,
                notes: orderNotes,
              }
            : null
        );
      } else {
        setMessage("Failed to update order");
      }
    } catch {
      setMessage("Error saving order");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">Loading orders...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          Orders ({orders.length})
        </h2>
        <button
          onClick={fetchOrders}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No orders yet</p>
          <p className="text-gray-400 text-sm mt-2">
            Orders will appear here once customers complete checkout.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto">
            {orders.map((order) => {
              const items: OrderItem[] = JSON.parse(
                order.items_json || "[]"
              );
              const isSelected = selectedOrder?.id === order.id;

              return (
                <button
                  key={order.id}
                  onClick={() => openOrder(order)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-gray-400">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="font-medium text-gray-800 text-sm">
                    {order.customer_name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {items.length} item{items.length !== 1 ? "s" : ""} · $
                    {parseFloat(order.total || "0").toFixed(2)} USD
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(order.created_at).toLocaleDateString()}{" "}
                    {new Date(order.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Order Detail */}
          <div className="lg:col-span-2">
            {selectedOrder ? (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-gray-800">
                      Order #{selectedOrder.id.slice(0, 8).toUpperCase()}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        STATUS_COLORS[selectedOrder.status] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="p-6 border-b border-gray-100">
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Customer
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-400">Name:</span>{" "}
                      <span className="text-gray-800">
                        {selectedOrder.customer_name}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Email:</span>{" "}
                      <a
                        href={`mailto:${selectedOrder.customer_email}`}
                        className="text-blue-600"
                      >
                        {selectedOrder.customer_email}
                      </a>
                    </div>
                    <div>
                      <span className="text-gray-400">Phone:</span>{" "}
                      <span className="text-gray-800">
                        {selectedOrder.customer_phone || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Country:</span>{" "}
                      <span className="text-gray-800">
                        {selectedOrder.shipping_country || "—"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 text-sm">
                    <span className="text-gray-400">Address:</span>{" "}
                    <span className="text-gray-800">
                      {[
                        selectedOrder.shipping_address,
                        selectedOrder.shipping_city,
                        selectedOrder.shipping_state,
                        selectedOrder.shipping_zip,
                        selectedOrder.shipping_country,
                      ]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="p-6 border-b border-gray-100">
                  <h4 className="font-semibold text-gray-700 mb-3">Items</h4>
                  <div className="space-y-3">
                    {(
                      JSON.parse(
                        selectedOrder.items_json || "[]"
                      ) as OrderItem[]
                    ).map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded bg-gray-100" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-800">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-1 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span>
                        $
                        {parseFloat(selectedOrder.subtotal || "0").toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Shipping</span>
                      <span>
                        {parseFloat(selectedOrder.shipping_cost || "0") === 0
                          ? "FREE"
                          : `$${parseFloat(selectedOrder.shipping_cost || "0").toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-800 text-base pt-2">
                      <span>Total</span>
                      <span>
                        ${parseFloat(selectedOrder.total || "0").toFixed(2)} USD
                      </span>
                    </div>
                  </div>
                </div>

                {/* Update Order */}
                <div className="p-6 bg-gray-50">
                  <h4 className="font-semibold text-gray-700 mb-4">
                    Update Order
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {/* Status */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Status
                      </label>
                      <select
                        value={orderStatus}
                        onChange={(e) => setOrderStatus(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* Carrier */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Carrier
                      </label>
                      <select
                        value={trackingCarrier}
                        onChange={(e) => setTrackingCarrier(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      >
                        <option value="">Select carrier...</option>
                        {CARRIERS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Tracking Number */}
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Tracking Number
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number..."
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>

                  {/* Notes */}
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Internal Notes
                    </label>
                    <textarea
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="Add notes about this order..."
                      rows={2}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>

                  {/* Send email checkbox */}
                  {trackingNumber &&
                    trackingNumber !== selectedOrder.tracking_number && (
                      <label className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={sendEmail}
                          onChange={(e) => setSendEmail(e.target.checked)}
                          className="rounded"
                        />
                        Send shipping confirmation email to customer
                      </label>
                    )}

                  {message && (
                    <p
                      className={`text-sm mb-4 ${message.includes("success") ? "text-green-600" : "text-red-600"}`}
                    >
                      {message}
                    </p>
                  )}

                  <button
                    onClick={saveOrder}
                    disabled={saving}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded font-medium text-sm disabled:opacity-50 transition-colors"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>

                  {/* Order tracking link */}
                  <div className="mt-4 text-center">
                    <a
                      href={`/order/${selectedOrder.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:text-blue-700"
                    >
                      View customer tracking page →
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-lg">
                <p className="text-gray-400 text-lg">
                  Select an order to view details
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
