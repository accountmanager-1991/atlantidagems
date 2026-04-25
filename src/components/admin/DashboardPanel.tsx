"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AdminLang,
  CATEGORY_LABELS,
  STONE_LABELS,
  METAL_LABELS,
  LOW_STOCK_THRESHOLD,
  totalCost,
  marginPct,
  fmtUSD,
} from "@/lib/admin-constants";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DbProduct = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DbOrder = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EnrichedProduct = Record<string, any> & {
  _cost: number;
  _retail: number;
  _qty: number;
  _margin: number;
  _value: number;
};

const T: Record<AdminLang, Record<string, string>> = {
  en: {
    title: "Dashboard",
    subtitle: "Live business metrics",
    totalProducts: "Total Products",
    totalUnits: "Units in Stock",
    inventoryValue: "Inventory Value",
    potentialRevenue: "Potential Revenue",
    avgMargin: "Avg Margin %",
    lowStock: "Low Stock",
    outOfStock: "Out of Stock",
    paidOrders: "Paid Orders",
    revenue7d: "Revenue (7d)",
    revenue30d: "Revenue (30d)",
    grossProfit7d: "Gross Profit (7d)",
    grossProfit30d: "Gross Profit (30d)",
    marginByStone: "Margin by Stone",
    marginByMetal: "Margin by Metal",
    marginByCategory: "Margin by Category",
    topMargin: "Top 5 Margin",
    bottomMargin: "Lowest 5 Margin",
    lowStockAlerts: "Low Stock Alerts",
    allGood: "All products are well stocked.",
    loading: "Loading orders...",
    noOrdersYet: "No paid orders yet.",
  },
  es: {
    title: "Panel",
    subtitle: "Metricas del negocio en vivo",
    totalProducts: "Productos Totales",
    totalUnits: "Unidades en Stock",
    inventoryValue: "Valor Inventario",
    potentialRevenue: "Ingreso Potencial",
    avgMargin: "Margen Prom. %",
    lowStock: "Poco Stock",
    outOfStock: "Agotados",
    paidOrders: "Pedidos Pagados",
    revenue7d: "Ingresos (7d)",
    revenue30d: "Ingresos (30d)",
    grossProfit7d: "Ganancia Bruta (7d)",
    grossProfit30d: "Ganancia Bruta (30d)",
    marginByStone: "Margen por Piedra",
    marginByMetal: "Margen por Metal",
    marginByCategory: "Margen por Categoria",
    topMargin: "Top 5 Margen",
    bottomMargin: "Menor Margen (5)",
    lowStockAlerts: "Alertas Poco Stock",
    allGood: "Todos los productos bien surtidos.",
    loading: "Cargando pedidos...",
    noOrdersYet: "Sin pedidos pagados aun.",
  },
};

export default function DashboardPanel({ products, lang }: { products: DbProduct[]; lang: AdminLang }) {
  const t = T[lang];
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [nowTs, setNowTs] = useState(() => Date.now());

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(Array.isArray(data) ? data : []);
        }
      } catch {
        /* silent */
      }
      setOrdersLoading(false);
      setNowTs(Date.now());
    })();
  }, []);

  const kpis = useMemo(() => {
    const enriched: EnrichedProduct[] = products.map((p) => {
      const cost = totalCost(p);
      const retail = Number(p.price_retail || 0);
      const qty = Number(p.stock_quantity || 0);
      return { ...p, _cost: cost, _retail: retail, _qty: qty, _margin: marginPct(retail, cost), _value: qty * cost };
    });
    const units = enriched.reduce((s, p) => s + p._qty, 0);
    const invValue = enriched.reduce((s, p) => s + p._value, 0);
    const potentialRevenue = enriched.reduce((s, p) => s + p._retail * p._qty, 0);
    const weightedMarginNum = enriched.reduce((s, p) => s + p._margin * p._retail * p._qty, 0);
    const weightedMarginDen = enriched.reduce((s, p) => s + p._retail * p._qty, 0);
    const avgMargin = weightedMarginDen > 0 ? weightedMarginNum / weightedMarginDen : 0;
    const low = enriched.filter((p) => p._qty > 0 && p._qty <= LOW_STOCK_THRESHOLD);
    const out = enriched.filter((p) => p._qty === 0);
    return { enriched, units, invValue, potentialRevenue, avgMargin, low, out };
  }, [products]);

  const orderStats = useMemo(() => {
    const paid = orders.filter((o) => o.status === "paid" || o.status === "shipped" || o.status === "delivered");
    const d7 = nowTs - 7 * 24 * 60 * 60 * 1000;
    const d30 = nowTs - 30 * 24 * 60 * 60 * 1000;
    const r7 = paid.filter((o) => new Date(o.paid_at || o.created_at).getTime() >= d7);
    const r30 = paid.filter((o) => new Date(o.paid_at || o.created_at).getTime() >= d30);
    const costById = new Map<string, number>();
    for (const p of products) costById.set(p.id, totalCost(p));
    const revenueOf = (os: DbOrder[]) => os.reduce((s, o) => s + Number(o.total || 0), 0);
    const profitOf = (os: DbOrder[]) => os.reduce((s, o) => {
      const items = safeJson<Array<{ id: string; quantity: number; price: number }>>(o.items_json, []);
      const cogs = items.reduce((c, it) => c + (costById.get(it.id) || 0) * Number(it.quantity || 0), 0);
      return s + (Number(o.total || 0) - Number(o.shipping_cost || 0) - cogs);
    }, 0);
    return {
      paidCount: paid.length,
      revenue7d: revenueOf(r7),
      revenue30d: revenueOf(r30),
      profit7d: profitOf(r7),
      profit30d: profitOf(r30),
    };
  }, [orders, products, nowTs]);

  const marginBy = (key: "stone_type" | "metal_type" | "category") => {
    const groups = new Map<string, { totalRetail: number; totalCost: number; units: number }>();
    for (const p of kpis.enriched) {
      const k = p[key] || "—";
      const g = groups.get(k) || { totalRetail: 0, totalCost: 0, units: 0 };
      g.totalRetail += p._retail * p._qty;
      g.totalCost += p._cost * p._qty;
      g.units += p._qty;
      groups.set(k, g);
    }
    return [...groups.entries()]
      .map(([k, v]) => ({
        key: k,
        margin: v.totalRetail > 0 ? ((v.totalRetail - v.totalCost) / v.totalRetail) * 100 : 0,
        units: v.units,
        revenue: v.totalRetail,
      }))
      .sort((a, b) => b.margin - a.margin);
  };

  const topMargin = useMemo(() =>
    [...kpis.enriched].filter((p) => p._retail > 0).sort((a, b) => b._margin - a._margin).slice(0, 5),
    [kpis.enriched],
  );
  const bottomMargin = useMemo(() =>
    [...kpis.enriched].filter((p) => p._retail > 0).sort((a, b) => a._margin - b._margin).slice(0, 5),
    [kpis.enriched],
  );

  const labelFor = (key: string, k: string): string => {
    if (key === "stone_type") return STONE_LABELS[lang][k] || k;
    if (key === "metal_type") return METAL_LABELS[lang][k] || k;
    return CATEGORY_LABELS[lang][k] || k;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-xl tracking-[0.08em] text-ocean">{t.title}</h2>
        <p className="font-ui text-xs text-ocean/40 mt-1">{t.subtitle}</p>
      </div>

      {/* Inventory KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label={t.totalProducts} value={products.length.toString()} />
        <Kpi label={t.totalUnits} value={kpis.units.toString()} />
        <Kpi label={t.inventoryValue} value={fmtUSD(kpis.invValue)} />
        <Kpi label={t.potentialRevenue} value={fmtUSD(kpis.potentialRevenue)} />
        <Kpi label={t.avgMargin} value={`${kpis.avgMargin.toFixed(1)}%`} tone={kpis.avgMargin >= 50 ? "good" : kpis.avgMargin >= 30 ? "warn" : "bad"} />
        <Kpi label={t.lowStock} value={kpis.low.length.toString()} tone={kpis.low.length > 0 ? "warn" : undefined} />
        <Kpi label={t.outOfStock} value={kpis.out.length.toString()} tone={kpis.out.length > 0 ? "bad" : undefined} />
        <Kpi label={t.paidOrders} value={ordersLoading ? "…" : orderStats.paidCount.toString()} />
      </div>

      {/* Order / Revenue */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label={t.revenue7d} value={fmtUSD(orderStats.revenue7d)} />
        <Kpi label={t.revenue30d} value={fmtUSD(orderStats.revenue30d)} />
        <Kpi label={t.grossProfit7d} value={fmtUSD(orderStats.profit7d)} tone="good" />
        <Kpi label={t.grossProfit30d} value={fmtUSD(orderStats.profit30d)} tone="good" />
      </div>

      {/* Margin breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Breakdown title={t.marginByStone} rows={marginBy("stone_type")} labelFor={(k) => labelFor("stone_type", k)} />
        <Breakdown title={t.marginByMetal} rows={marginBy("metal_type")} labelFor={(k) => labelFor("metal_type", k)} />
        <Breakdown title={t.marginByCategory} rows={marginBy("category")} labelFor={(k) => labelFor("category", k)} />
      </div>

      {/* Top / Bottom margin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MarginList title={t.topMargin} products={topMargin} lang={lang} />
        <MarginList title={t.bottomMargin} products={bottomMargin} lang={lang} />
      </div>

      {/* Low stock alerts */}
      <div className="bg-white rounded-lg border border-gold/10 p-5">
        <h3 className="font-heading text-sm tracking-wider text-ocean mb-3 uppercase">{t.lowStockAlerts}</h3>
        {kpis.low.length === 0 && kpis.out.length === 0 ? (
          <p className="font-ui text-sm text-ocean/40">{t.allGood}</p>
        ) : (
          <ul className="space-y-2">
            {[...kpis.out, ...kpis.low].map((p) => (
              <li key={p.id} className="flex items-center justify-between font-ui text-sm">
                <span className="flex items-center gap-3">
                  <span className="font-mono text-xs text-ocean/50">{p.sku || "—"}</span>
                  <span className="text-ocean">{p.name}</span>
                </span>
                <span className={`px-2 py-0.5 rounded font-ui text-xs ${p._qty === 0 ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {p._qty} in stock
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Kpi({ label, value, tone }: { label: string; value: string; tone?: "good" | "warn" | "bad" }) {
  const toneClass =
    tone === "good" ? "text-green-700" :
    tone === "warn" ? "text-yellow-700" :
    tone === "bad" ? "text-red-600" : "text-ocean";
  return (
    <div className="bg-white rounded-lg border border-gold/10 p-4">
      <p className="font-ui text-[10px] text-ocean/50 uppercase tracking-wider">{label}</p>
      <p className={`font-heading text-2xl mt-1 ${toneClass}`}>{value}</p>
    </div>
  );
}

function Breakdown({ title, rows, labelFor }: { title: string; rows: Array<{ key: string; margin: number; units: number; revenue: number }>; labelFor: (k: string) => string }) {
  const max = Math.max(...rows.map((r) => r.margin), 1);
  return (
    <div className="bg-white rounded-lg border border-gold/10 p-5">
      <h3 className="font-heading text-sm tracking-wider text-ocean mb-3 uppercase">{title}</h3>
      {rows.length === 0 ? (
        <p className="font-ui text-xs text-ocean/40">—</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.key}>
              <div className="flex justify-between font-ui text-xs mb-1">
                <span className="text-ocean">{labelFor(r.key)}</span>
                <span className="text-ocean/60">{r.margin.toFixed(1)}% · {r.units} u</span>
              </div>
              <div className="h-2 bg-cream-dark rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${r.margin >= 50 ? "bg-green-500" : r.margin >= 30 ? "bg-yellow-500" : "bg-red-500"}`}
                  style={{ width: `${Math.min(100, (r.margin / max) * 100)}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MarginList({ title, products, lang }: { title: string; products: any[]; lang: AdminLang }) {
  return (
    <div className="bg-white rounded-lg border border-gold/10 p-5">
      <h3 className="font-heading text-sm tracking-wider text-ocean mb-3 uppercase">{title}</h3>
      {products.length === 0 ? (
        <p className="font-ui text-xs text-ocean/40">—</p>
      ) : (
        <ul className="space-y-2">
          {products.map((p) => (
            <li key={p.id} className="flex items-center justify-between font-ui text-sm">
              <span className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-xs text-ocean/50 flex-shrink-0">{p.sku || "—"}</span>
                <span className="text-ocean truncate">{p.name}</span>
                <span className="text-ocean/40 text-xs flex-shrink-0">· {CATEGORY_LABELS[lang][p.category] || p.category}</span>
              </span>
              <span className={`font-medium ${p._margin >= 50 ? "text-green-700" : p._margin >= 30 ? "text-yellow-700" : "text-red-600"}`}>
                {p._margin.toFixed(1)}%
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function safeJson<T>(s: unknown, fallback: T): T {
  if (typeof s !== "string") return fallback;
  try { return JSON.parse(s) as T; } catch { return fallback; }
}
