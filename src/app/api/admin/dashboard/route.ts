import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";

// Returns all dashboard data for a given date range.
// Query params: ?from=2026-03-01&to=2026-04-25
// Defaults to last 30 days if not provided.
//
// Returned shape:
//   { range, kpis, breakdowns, bestSellers, mostProfitable, mostViewed, alerts, insight }
//
// Best Sellers / Most Profitable are computed by joining paid orders.items_json against products.

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

export async function GET(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const fromParam = url.searchParams.get("from");
  const toParam = url.searchParams.get("to");
  const now = new Date();
  const defaultFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const from = fromParam ? new Date(fromParam) : defaultFrom;
  const to = toParam ? new Date(toParam) : now;
  // Make `to` end-of-day inclusive
  to.setHours(23, 59, 59, 999);

  try {
    const sql = getDb();

    // 1. Fetch products + paid orders within range — single round trip
    const [products, paidOrders] = await Promise.all([
      sql`SELECT * FROM products` as Promise<Row[]>,
      sql`
        SELECT id, customer_email, items_json, total, subtotal, shipping_cost, status, paid_at, created_at
        FROM orders
        WHERE status IN ('paid', 'shipped', 'delivered')
          AND COALESCE(paid_at, created_at) BETWEEN ${from.toISOString()} AND ${to.toISOString()}
      ` as Promise<Row[]>,
    ]);

    // Build a product lookup with computed costs/margin
    const productById = new Map<string, Row>();
    let totalUnits = 0, inventoryValue = 0, potentialRevenue = 0;
    let weightedMarginNum = 0, weightedMarginDen = 0;
    let lowStockCount = 0, soldOutCount = 0;
    const lowStockList: Array<{ id: string; sku: string; name: string; qty: number }> = [];

    for (const p of products) {
      const cost = Number(p.material_cost || 0) + Number(p.labor_cost || 0) + Number(p.packaging_cost || 0) + Number(p.shipping_cost || 0);
      const retail = Number(p.price_retail || 0);
      const qty = Number(p.stock_quantity || 0);
      const margin = retail > 0 ? ((retail - cost) / retail) * 100 : 0;
      productById.set(p.id, { ...p, _cost: cost, _retail: retail, _qty: qty, _margin: margin });
      totalUnits += qty;
      inventoryValue += qty * cost;
      potentialRevenue += qty * retail;
      if (retail > 0 && qty > 0) {
        weightedMarginNum += margin * retail * qty;
        weightedMarginDen += retail * qty;
      }
      if (qty === 0) { soldOutCount++; lowStockList.push({ id: p.id, sku: p.sku || "", name: p.name, qty: 0 }); }
      else if (qty <= 3) { lowStockCount++; lowStockList.push({ id: p.id, sku: p.sku || "", name: p.name, qty }); }
    }
    const avgMargin = weightedMarginDen > 0 ? weightedMarginNum / weightedMarginDen : 0;

    // 2. Aggregate orders for revenue/profit + best sellers + most profitable
    const unitsSold = new Map<string, number>();
    const profitByProduct = new Map<string, number>();
    let revenue = 0;
    let cogs = 0;

    for (const o of paidOrders) {
      revenue += Number(o.total || 0);
      const items: OrderItem[] = safeJson<OrderItem[]>(o.items_json, []);
      for (const it of items) {
        const qty = Number(it.quantity || 0);
        unitsSold.set(it.id, (unitsSold.get(it.id) || 0) + qty);
        const prod = productById.get(it.id);
        if (prod) {
          const itemCogs = prod._cost * qty;
          cogs += itemCogs;
          const profit = (Number(it.price || 0) * qty) - itemCogs;
          profitByProduct.set(it.id, (profitByProduct.get(it.id) || 0) + profit);
        }
      }
    }
    const grossProfit = revenue - cogs - paidOrders.reduce((s, o) => s + Number(o.shipping_cost || 0), 0);

    // 3. Spotlights
    const sortedBySales = [...unitsSold.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
    const bestSellers = sortedBySales.map(([id, units]) => {
      const p = productById.get(id);
      return p ? toSpotlight(p, { primary: units, primaryLabel: "sold" }) : null;
    }).filter(Boolean);

    const sortedByProfit = [...profitByProduct.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
    const mostProfitable = sortedByProfit.map(([id, profit]) => {
      const p = productById.get(id);
      const units = unitsSold.get(id) || 0;
      return p ? toSpotlight(p, { primary: profit, primaryLabel: "profit", primaryFmt: "usd", subline: `${p._margin.toFixed(1)}% margin · ${units} sold` }) : null;
    }).filter(Boolean);

    const sortedByViews = [...productById.values()]
      .filter((p) => Number(p.view_count || 0) > 0)
      .sort((a, b) => Number(b.view_count || 0) - Number(a.view_count || 0))
      .slice(0, 5);
    const mostViewed = sortedByViews.map((p) => {
      const sold = unitsSold.get(p.id) || 0;
      const views = Number(p.view_count || 0);
      const conv = views > 0 ? (sold / views) * 100 : 0;
      return toSpotlight(p, {
        primary: views,
        primaryLabel: "views",
        subline: sold === 0 ? `${views} views · 0 sold` : `${sold} sold · ${conv.toFixed(1)}% conv.`,
      });
    });

    // 4. Margin breakdowns by stone / metal / category — weighted by inventory value
    const breakdowns = {
      stone: groupMargin(productById, "stone_type"),
      metal: groupMargin(productById, "metal_type"),
      category: groupMargin(productById, "category"),
    };

    // 5. Smart insight — pick the most interesting story
    const insight = generateInsight({
      mostViewed: mostViewed[0],
      bestSellers,
      lowStockList,
      soldOutCount,
    });

    // 6. Compose response
    return NextResponse.json({
      range: { from: from.toISOString(), to: to.toISOString() },
      kpis: {
        revenue,
        grossProfit,
        avgMargin,
        avgOrder: paidOrders.length > 0 ? revenue / paidOrders.length : 0,
        paidOrders: paidOrders.length,
        inventoryValue,
        potentialRevenue,
        totalUnits,
        totalProducts: products.length,
        lowStockCount,
        soldOutCount,
      },
      breakdowns,
      bestSellers,
      mostProfitable,
      mostViewed,
      alerts: lowStockList.sort((a, b) => a.qty - b.qty).slice(0, 6),
      insight,
    });
  } catch (err) {
    console.error("Failed to load dashboard:", err);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}

// ---- helpers ----

function safeJson<T>(s: unknown, fallback: T): T {
  if (typeof s !== "string") return fallback;
  try { return JSON.parse(s) as T; } catch { return fallback; }
}

interface SpotlightOpts {
  primary: number;
  primaryLabel: string;
  primaryFmt?: "usd" | "int";
  subline?: string;
}

function toSpotlight(p: Row, opts: SpotlightOpts) {
  return {
    id: p.id,
    sku: p.sku || "",
    name: p.name || "—",
    image_main: p.image_main || "",
    stone_type: p.stone_type || "",
    metal_type: p.metal_type || "",
    category: p.category || "",
    primary: opts.primary,
    primaryLabel: opts.primaryLabel,
    primaryFmt: opts.primaryFmt || "int",
    subline: opts.subline || `${p.category || ""} · ${p.metal_type || ""}`,
  };
}

function groupMargin(productById: Map<string, Row>, key: string): Array<{ key: string; margin: number; units: number }> {
  const groups = new Map<string, { num: number; den: number; units: number }>();
  for (const p of productById.values()) {
    const k = p[key] || "—";
    const g = groups.get(k) || { num: 0, den: 0, units: 0 };
    if (p._retail > 0 && p._qty > 0) {
      g.num += p._margin * p._retail * p._qty;
      g.den += p._retail * p._qty;
    }
    g.units += p._qty;
    groups.set(k, g);
  }
  return [...groups.entries()]
    .map(([k, v]) => ({ key: k, margin: v.den > 0 ? v.num / v.den : 0, units: v.units }))
    .sort((a, b) => b.margin - a.margin);
}

interface InsightInput {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mostViewed?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bestSellers: any[];
  lowStockList: Array<{ id: string; sku: string; name: string; qty: number }>;
  soldOutCount: number;
}

function generateInsight({ mostViewed, lowStockList, soldOutCount }: InsightInput): { label: string; body: string } | null {
  if (mostViewed && mostViewed.primary > 50 && (mostViewed.subline?.includes("0 sold") || mostViewed.subline?.match(/0\.\d+% conv/))) {
    return {
      label: "Conversion opportunity",
      body: `${mostViewed.name} has been viewed ${mostViewed.primary} times but converts poorly. Consider better photos, a price test, or restocking if it's sold out.`,
    };
  }
  if (soldOutCount > 0) {
    const out = lowStockList.find((l) => l.qty === 0);
    if (out) {
      return {
        label: "Stock alert",
        body: `${out.name} is sold out. Restock it — search traffic for this piece is still active.`,
      };
    }
  }
  return null;
}
