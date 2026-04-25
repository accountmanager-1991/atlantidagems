"use client";

import { useMemo, useState } from "react";
import {
  AdminLang,
  CATEGORY_LABELS,
  STOCK_LABELS,
  LOW_STOCK_THRESHOLD,
  totalCost,
  marginPct,
  fmtUSD,
} from "@/lib/admin-constants";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DbProduct = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EnrichedProduct = Record<string, any> & {
  _cost: number;
  _retail: number;
  _qty: number;
  _margin: number;
  _value: number;
};

type SortKey = "sku" | "name" | "qty" | "cost" | "retail" | "margin" | "value";
type ViewMode = "grid" | "table";

function stoneClass(stone: string): string {
  if (stone === "amber") return "bg-gradient-to-br from-ambar-light via-ambar to-ambar-deep";
  if (stone === "blue-amber") return "bg-gradient-to-br from-larimar via-larimar-mid to-larimar-deep";
  return "bg-gradient-to-br from-larimar via-larimar-mid to-larimar-deep";
}

const T: Record<AdminLang, Record<string, string>> = {
  en: {
    title: "Inventory",
    subtitle: "Stock levels, costs, and margin by product",
    sku: "SKU",
    product: "Product",
    category: "Category",
    qty: "Qty",
    cost: "Unit Cost",
    retail: "Retail",
    margin: "Margin %",
    value: "Stock Value",
    status: "Status",
    noData: "No products yet — add one from the Products tab.",
    exportCsv: "Export CSV",
    totalUnits: "Total Units",
    inventoryValue: "Inventory Value (at cost)",
    potentialRevenue: "Potential Revenue",
    avgMargin: "Avg Margin",
    lowStockOnly: "Low stock only",
    all: "All",
  },
  es: {
    title: "Inventario",
    subtitle: "Stock, costos y margen por producto",
    sku: "SKU",
    product: "Producto",
    category: "Categoria",
    qty: "Cant.",
    cost: "Costo Unit.",
    retail: "Precio",
    margin: "Margen %",
    value: "Valor Stock",
    status: "Estado",
    noData: "Sin productos — agrega uno desde la pestana Productos.",
    exportCsv: "Exportar CSV",
    totalUnits: "Unidades Totales",
    inventoryValue: "Valor Inventario (al costo)",
    potentialRevenue: "Ingreso Potencial",
    avgMargin: "Margen Promedio",
    lowStockOnly: "Solo poco stock",
    all: "Todos",
  },
};

export default function InventoryManager({ products, lang }: { products: DbProduct[]; lang: AdminLang }) {
  const t = T[lang];
  const [sortKey, setSortKey] = useState<SortKey>("value");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [view, setView] = useState<ViewMode>("grid");

  const rows = useMemo<EnrichedProduct[]>(() => {
    const enriched: EnrichedProduct[] = products.map((p) => {
      const cost = totalCost(p);
      const retail = Number(p.price_retail || 0);
      const qty = Number(p.stock_quantity || 0);
      return {
        ...p,
        _cost: cost,
        _retail: retail,
        _qty: qty,
        _margin: marginPct(retail, cost),
        _value: qty * cost,
      };
    });
    const filtered = lowStockOnly
      ? enriched.filter((p) => p._qty <= LOW_STOCK_THRESHOLD)
      : enriched;
    const sorted = [...filtered].sort((a, b) => {
      const map: Record<SortKey, string | number> = {
        sku: (a.sku || "").localeCompare(b.sku || ""),
        name: (a.name || "").localeCompare(b.name || ""),
        qty: a._qty - b._qty,
        cost: a._cost - b._cost,
        retail: a._retail - b._retail,
        margin: a._margin - b._margin,
        value: a._value - b._value,
      };
      const v = map[sortKey] as number;
      return sortDir === "asc" ? v : -v;
    });
    return sorted;
  }, [products, sortKey, sortDir, lowStockOnly]);

  const totals = useMemo(() => {
    const units = rows.reduce((s, p) => s + p._qty, 0);
    const invValue = rows.reduce((s, p) => s + p._value, 0);
    const potentialRevenue = rows.reduce((s, p) => s + p._retail * p._qty, 0);
    const weightedMarginNum = rows.reduce((s, p) => s + p._margin * p._retail * p._qty, 0);
    const weightedMarginDen = rows.reduce((s, p) => s + p._retail * p._qty, 0);
    const avgMargin = weightedMarginDen > 0 ? weightedMarginNum / weightedMarginDen : 0;
    return { units, invValue, potentialRevenue, avgMargin };
  }, [rows]);

  function toggleSort(k: SortKey) {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(k);
      setSortDir("desc");
    }
  }

  function exportCsv() {
    const header = ["SKU", "Name", "Category", "Stock Qty", "Unit Cost", "Retail", "Margin %", "Stock Value", "Status"];
    const lines = [header.join(",")];
    for (const p of rows) {
      const cells = [
        p.sku || "",
        `"${(p.name || "").replace(/"/g, '""')}"`,
        p.category || "",
        p._qty,
        p._cost.toFixed(2),
        p._retail.toFixed(2),
        p._margin.toFixed(1),
        p._value.toFixed(2),
        p.stock_status || "",
      ];
      lines.push(cells.join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const sortArrow = (k: SortKey) => (sortKey === k ? (sortDir === "asc" ? " ↑" : " ↓") : "");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl tracking-[0.08em] text-ocean">{t.title}</h2>
          <p className="font-ui text-xs text-ocean/40 mt-1">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 font-ui text-xs text-ocean/70 cursor-pointer">
            <input type="checkbox" checked={lowStockOnly} onChange={(e) => setLowStockOnly(e.target.checked)}
              className="w-4 h-4 accent-ambar-light" />
            {t.lowStockOnly}
          </label>
          <div className="inline-flex border border-gold/40 rounded overflow-hidden">
            <button onClick={() => setView("grid")}
              className={`px-4 py-2 font-ui text-xs tracking-wider uppercase font-medium transition-colors ${view === "grid" ? "bg-ambar-light text-navy" : "bg-white text-ocean/55 hover:bg-cream-dark"}`}>
              ▦ {lang === "es" ? "Cuadricula" : "Grid"}
            </button>
            <button onClick={() => setView("table")}
              className={`px-4 py-2 font-ui text-xs tracking-wider uppercase font-medium transition-colors ${view === "table" ? "bg-ambar-light text-navy" : "bg-white text-ocean/55 hover:bg-cream-dark"}`}>
              ≡ {lang === "es" ? "Tabla" : "Table"}
            </button>
          </div>
          <button onClick={exportCsv}
            className="px-4 py-2 bg-ocean text-cream rounded font-ui text-xs tracking-wider uppercase hover:bg-ocean/80 transition-colors">
            {t.exportCsv}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label={t.totalUnits} value={totals.units.toString()} />
        <KpiCard label={t.inventoryValue} value={fmtUSD(totals.invValue)} />
        <KpiCard label={t.potentialRevenue} value={fmtUSD(totals.potentialRevenue)} />
        <KpiCard label={t.avgMargin} value={`${totals.avgMargin.toFixed(1)}%`} tone={totals.avgMargin >= 50 ? "good" : totals.avgMargin >= 30 ? "warn" : "bad"} />
      </div>

      {rows.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-gold/10">
          <p className="font-ui text-sm text-ocean/50">{t.noData}</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {rows.map((p) => {
            const low = p._qty > 0 && p._qty <= LOW_STOCK_THRESHOLD;
            const out = p._qty === 0;
            const cardBg = out ? "bg-red-50/40" : low ? "bg-yellow-50/40" : "bg-white";
            const stoneCls = stoneClass(p.stone_type);
            const marginColor = p._margin >= 50 ? "text-green-700" : p._margin >= 30 ? "text-yellow-700" : "text-red-600";
            const stoneLetter = (p.stone_type || "X").charAt(0).toUpperCase();
            const badgeCls = out
              ? "bg-red-500 text-white"
              : low
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-700";
            const badgeText = out ? STOCK_LABELS[lang]["sold-out"] : low ? STOCK_LABELS[lang]["low-stock"] : STOCK_LABELS[lang]["in-stock"];
            return (
              <div key={p.id} className={`${cardBg} rounded-lg border border-gold/15 overflow-hidden transition-all hover:shadow-md hover:border-gold hover:-translate-y-0.5`}>
                {/* Photo / placeholder */}
                <div className={`aspect-square relative overflow-hidden ${stoneCls}`}>
                  {p.image_main ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image_main} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center font-heading text-7xl text-white/15 font-bold">
                      {stoneLetter}
                    </div>
                  )}
                  <span className={`absolute top-2 right-2 px-2.5 py-1 rounded-full font-ui text-[10px] uppercase tracking-wider font-semibold ${badgeCls}`}>
                    {badgeText}
                  </span>
                  {p.sku && (
                    <span className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/60 text-white font-mono text-[10px]">
                      {p.sku}
                    </span>
                  )}
                </div>
                {/* Card body */}
                <div className="p-3.5">
                  <p className="font-heading text-sm tracking-[0.04em] text-ocean leading-tight mb-1">{p.name || "—"}</p>
                  <p className="font-ui text-[10px] uppercase tracking-[0.18em] text-ocean/55 mb-3">
                    {CATEGORY_LABELS[lang][p.category] || p.category}
                  </p>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-3 pt-3 border-t border-gold/15 font-ui text-[11px]">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.15em] text-ocean/55 font-medium">{t.qty}</p>
                      <p className={`font-body text-sm mt-0.5 ${out ? "text-red-600 font-semibold" : low ? "text-yellow-700 font-semibold" : "text-ocean"}`}>{p._qty}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.15em] text-ocean/55 font-medium">{t.margin}</p>
                      <p className={`font-body text-sm mt-0.5 font-semibold ${marginColor}`}>{p._margin.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.15em] text-ocean/55 font-medium">{t.cost}</p>
                      <p className="font-body text-sm text-ocean mt-0.5">{fmtUSD(p._cost)}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.15em] text-ocean/55 font-medium">{t.retail}</p>
                      <p className="font-body text-sm text-gold-deep mt-0.5 font-semibold">{fmtUSD(p._retail)}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gold/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-dark">
                <tr>
                  <Th onClick={() => toggleSort("sku")}>{t.sku}{sortArrow("sku")}</Th>
                  <Th onClick={() => toggleSort("name")}>{t.product}{sortArrow("name")}</Th>
                  <Th>{t.category}</Th>
                  <Th onClick={() => toggleSort("qty")} align="right">{t.qty}{sortArrow("qty")}</Th>
                  <Th onClick={() => toggleSort("cost")} align="right">{t.cost}{sortArrow("cost")}</Th>
                  <Th onClick={() => toggleSort("retail")} align="right">{t.retail}{sortArrow("retail")}</Th>
                  <Th onClick={() => toggleSort("margin")} align="right">{t.margin}{sortArrow("margin")}</Th>
                  <Th onClick={() => toggleSort("value")} align="right">{t.value}{sortArrow("value")}</Th>
                  <Th>{t.status}</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => {
                  const low = p._qty > 0 && p._qty <= LOW_STOCK_THRESHOLD;
                  const out = p._qty === 0;
                  return (
                    <tr key={p.id} className={`border-t border-gold/10 ${out ? "bg-red-50/40" : low ? "bg-yellow-50/40" : "hover:bg-cream/40"} transition-colors`}>
                      <td className="px-4 py-3 font-mono text-xs text-ocean/70">{p.sku || "—"}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded bg-cream-dark overflow-hidden flex-shrink-0">
                            {p.image_main ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={p.image_main} alt="" className="w-full h-full object-cover" />
                            ) : null}
                          </div>
                          <span className="font-body text-sm text-ocean">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-ui text-xs text-ocean/60">{CATEGORY_LABELS[lang][p.category] || p.category}</td>
                      <td className="px-4 py-3 text-right font-ui text-sm text-ocean font-medium">{p._qty}</td>
                      <td className="px-4 py-3 text-right font-ui text-sm text-ocean/70">{fmtUSD(p._cost)}</td>
                      <td className="px-4 py-3 text-right font-ui text-sm text-gold font-medium">{fmtUSD(p._retail)}</td>
                      <td className={`px-4 py-3 text-right font-ui text-sm font-medium ${p._margin >= 50 ? "text-green-700" : p._margin >= 30 ? "text-yellow-700" : "text-red-600"}`}>
                        {p._margin.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 text-right font-ui text-sm text-ocean font-medium">{fmtUSD(p._value)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded font-ui text-xs ${
                          p.stock_status === "in-stock" ? "bg-green-100 text-green-700" :
                          p.stock_status === "low-stock" ? "bg-yellow-100 text-yellow-700" :
                          p.stock_status === "sold-out" ? "bg-red-100 text-red-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {STOCK_LABELS[lang][p.stock_status] || p.stock_status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-cream-dark/60 border-t-2 border-gold/20">
                <tr>
                  <td colSpan={3} className="px-4 py-3 font-ui text-xs text-ocean/50 uppercase">Totals</td>
                  <td className="px-4 py-3 text-right font-ui text-sm text-ocean font-bold">{totals.units}</td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 text-right font-ui text-sm text-ocean font-bold">{totals.avgMargin.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-right font-ui text-sm text-ocean font-bold">{fmtUSD(totals.invValue)}</td>
                  <td className="px-4 py-3"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Th({ children, onClick, align = "left" }: { children: React.ReactNode; onClick?: () => void; align?: "left" | "right" }) {
  return (
    <th
      onClick={onClick}
      className={`font-ui text-xs text-ocean/50 uppercase tracking-wider px-4 py-3 ${align === "right" ? "text-right" : "text-left"} ${onClick ? "cursor-pointer hover:text-ocean select-none" : ""}`}
    >
      {children}
    </th>
  );
}

function KpiCard({ label, value, tone }: { label: string; value: string; tone?: "good" | "warn" | "bad" }) {
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
