"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  AdminLang,
  CATEGORY_LABELS,
  STONE_LABELS,
  METAL_LABELS,
  fmtUSD,
} from "@/lib/admin-constants";

interface SpotlightItem {
  id: string;
  sku: string;
  name: string;
  image_main: string;
  stone_type: string;
  metal_type: string;
  category: string;
  primary: number;
  primaryLabel: string;
  primaryFmt: "usd" | "int";
  subline: string;
}

interface DashboardData {
  range: { from: string; to: string };
  kpis: {
    revenue: number;
    grossProfit: number;
    avgMargin: number;
    avgOrder: number;
    paidOrders: number;
    inventoryValue: number;
    potentialRevenue: number;
    totalUnits: number;
    totalProducts: number;
    lowStockCount: number;
    soldOutCount: number;
  };
  breakdowns: {
    stone: Array<{ key: string; margin: number; units: number }>;
    metal: Array<{ key: string; margin: number; units: number }>;
    category: Array<{ key: string; margin: number; units: number }>;
  };
  bestSellers: SpotlightItem[];
  mostProfitable: SpotlightItem[];
  mostViewed: SpotlightItem[];
  alerts: Array<{ id: string; sku: string; name: string; qty: number }>;
  insight: { label: string; body: string } | null;
}

type PresetKey = "7d" | "30d" | "90d" | "this-year" | "all-time" | "custom";

function presetRange(key: PresetKey): { from: string; to: string } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const day = 24 * 60 * 60 * 1000;
  const ymd = (d: Date) => d.toISOString().split("T")[0];
  switch (key) {
    case "7d": return { from: ymd(new Date(today.getTime() - 7 * day)), to: ymd(today) };
    case "30d": return { from: ymd(new Date(today.getTime() - 30 * day)), to: ymd(today) };
    case "90d": return { from: ymd(new Date(today.getTime() - 90 * day)), to: ymd(today) };
    case "this-year": return { from: `${now.getFullYear()}-01-01`, to: ymd(today) };
    case "all-time": return { from: "2020-01-01", to: ymd(today) };
    default: return { from: ymd(new Date(today.getTime() - 30 * day)), to: ymd(today) };
  }
}

function daysBetween(from: string, to: string): number {
  const f = new Date(from); const t = new Date(to);
  return Math.max(1, Math.round((t.getTime() - f.getTime()) / (24 * 60 * 60 * 1000)) + 1);
}

function fmtPretty(from: string, to: string, lang: AdminLang): string {
  const f = new Date(from); const t = new Date(to);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const locale = lang === "es" ? "es-DO" : "en-US";
  const sameYear = f.getFullYear() === t.getFullYear();
  return `${f.toLocaleDateString(locale, opts)} — ${t.toLocaleDateString(locale, { ...opts, year: sameYear ? undefined : "numeric" })}, ${t.getFullYear()}`;
}

const T: Record<AdminLang, Record<string, string>> = {
  en: {
    greeting: "Welcome back",
    sub: "Here's how the shop did in the selected period.",
    revenue: "Revenue",
    inventoryValue: "Inventory Value",
    avgMargin: "Avg Margin",
    avgOrderShort: "avg order value",
    grossProfit: "gross profit",
    paidOrders: "paid orders",
    unitsInStock: "Units in Stock",
    totalProducts: "Total Products",
    lowStock: "Low Stock",
    soldOut: "Sold Out",
    spotlights: "Product Spotlights",
    spotlightsHint: "What's selling, what's printing money, what people want",
    bestSellers: "Best Sellers",
    bestSellersSub: "Most units sold in this period",
    mostProfitable: "Most Profitable",
    mostProfitableSub: "Total gross profit in this period",
    mostViewed: "Most Viewed",
    mostViewedSub: "Pageviews on the live site",
    marginBreakdown: "Margin Breakdown",
    marginBreakdownHint: "Where your gross profit comes from",
    byStone: "By Stone",
    byMetal: "By Metal",
    byCategory: "By Category",
    needsAttention: "Needs your attention",
    needsAttentionHint: "Stock running low or already gone",
    restock: "Restock",
    daysLeft: "left",
    smartInsight: "Smart insight",
    pickRange: "Custom",
    quickPresets: "Quick presets",
    customRange: "Custom range",
    from: "From",
    to: "To",
    cancel: "Cancel",
    apply: "Apply range",
    days: "days",
    today: "Today",
    yesterday: "Yesterday",
    last7: "Last 7 days",
    last30: "Last 30 days",
    last90: "Last 90 days",
    thisMonth: "This month",
    lastMonth: "Last month",
    thisYear: "This year",
    allTime: "All time",
    sold: "sold",
    profit: "profit",
    views: "views",
    loading: "Loading dashboard...",
    noBestSellers: "No paid orders yet in this period.",
    noViews: "No product views recorded yet.",
  },
  es: {
    greeting: "Bienvenido",
    sub: "Asi le fue a la tienda en el periodo seleccionado.",
    revenue: "Ingresos",
    inventoryValue: "Valor Inventario",
    avgMargin: "Margen Prom.",
    avgOrderShort: "ticket promedio",
    grossProfit: "ganancia bruta",
    paidOrders: "pedidos pagados",
    unitsInStock: "Unidades en Stock",
    totalProducts: "Productos Totales",
    lowStock: "Poco Stock",
    soldOut: "Agotados",
    spotlights: "Productos Destacados",
    spotlightsHint: "Que se vende, que da margen, que la gente quiere",
    bestSellers: "Mas Vendidos",
    bestSellersSub: "Mas unidades vendidas en el periodo",
    mostProfitable: "Mas Rentables",
    mostProfitableSub: "Ganancia bruta total en el periodo",
    mostViewed: "Mas Vistos",
    mostViewedSub: "Visitas en el sitio web",
    marginBreakdown: "Margen por Categoria",
    marginBreakdownHint: "De donde viene la ganancia bruta",
    byStone: "Por Piedra",
    byMetal: "Por Metal",
    byCategory: "Por Categoria",
    needsAttention: "Atencion requerida",
    needsAttentionHint: "Stock bajo o agotado",
    restock: "Reabastecer",
    daysLeft: "quedan",
    smartInsight: "Insight",
    pickRange: "Personalizar",
    quickPresets: "Presets",
    customRange: "Rango Personalizado",
    from: "Desde",
    to: "Hasta",
    cancel: "Cancelar",
    apply: "Aplicar",
    days: "dias",
    today: "Hoy",
    yesterday: "Ayer",
    last7: "Ultimos 7 dias",
    last30: "Ultimos 30 dias",
    last90: "Ultimos 90 dias",
    thisMonth: "Este mes",
    lastMonth: "Mes pasado",
    thisYear: "Este ano",
    allTime: "Todo el tiempo",
    sold: "vend.",
    profit: "ganan.",
    views: "vistas",
    loading: "Cargando...",
    noBestSellers: "Sin pedidos en el periodo.",
    noViews: "Sin visitas registradas.",
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DbProduct = Record<string, any>;

// `products` is passed in but we don't use it; the API computes everything from server-side data.
// We accept it for API parity with the old DashboardPanel signature.
export default function DashboardPanel({ products: _products, lang }: { products: DbProduct[]; lang: AdminLang }) {
  const t = T[lang];
  const initial = presetRange("30d");
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [activePreset, setActivePreset] = useState<PresetKey>("30d");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async (f: string, ttill: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/dashboard?from=${f}&to=${ttill}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(from, to);
  }, [from, to, loadData]);

  function applyPreset(key: PresetKey) {
    const r = presetRange(key);
    setFrom(r.from);
    setTo(r.to);
    setActivePreset(key);
    setPickerOpen(false);
  }

  function applyToday() {
    const today = new Date().toISOString().split("T")[0];
    setFrom(today); setTo(today); setActivePreset("custom"); setPickerOpen(false);
  }
  function applyYesterday() {
    const y = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    setFrom(y); setTo(y); setActivePreset("custom"); setPickerOpen(false);
  }
  function applyThisMonth() {
    const n = new Date();
    const start = `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-01`;
    const today = n.toISOString().split("T")[0];
    setFrom(start); setTo(today); setActivePreset("custom"); setPickerOpen(false);
  }
  function applyLastMonth() {
    const n = new Date();
    const lastMonth = new Date(n.getFullYear(), n.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(n.getFullYear(), n.getMonth(), 0);
    setFrom(lastMonth.toISOString().split("T")[0]);
    setTo(lastDayOfLastMonth.toISOString().split("T")[0]);
    setActivePreset("custom"); setPickerOpen(false);
  }
  function applyCustom() {
    setActivePreset("custom");
    setPickerOpen(false);
  }

  const labelFor = useMemo(() => (key: "stone" | "metal" | "category", k: string): string => {
    if (key === "stone") return STONE_LABELS[lang][k] || k;
    if (key === "metal") return METAL_LABELS[lang][k] || k;
    return CATEGORY_LABELS[lang][k] || k;
  }, [lang]);

  if (loading && !data) {
    return <p className="text-center font-ui text-sm text-ocean/40 py-20">{t.loading}</p>;
  }
  if (!data) {
    return <p className="text-center font-ui text-sm text-red-500 py-20">Failed to load dashboard</p>;
  }

  const k = data.kpis;
  const dayCount = daysBetween(from, to);

  return (
    <div className="space-y-10">
      {/* Greeting + period pills */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="font-heading text-3xl text-larimar-deep tracking-[0.06em] m-0 leading-tight">{t.greeting}</h1>
          <p className="font-body italic text-lg text-ocean/65 mt-1">{t.sub}</p>
        </div>
        <div className="relative flex items-center gap-2">
          <PresetPill active={activePreset === "7d"} onClick={() => applyPreset("7d")}>{t.last7}</PresetPill>
          <PresetPill active={activePreset === "30d"} onClick={() => applyPreset("30d")}>{t.last30}</PresetPill>
          <PresetPill active={activePreset === "90d"} onClick={() => applyPreset("90d")}>{t.last90}</PresetPill>
          <PresetPill active={activePreset === "this-year"} onClick={() => applyPreset("this-year")}>{t.thisYear}</PresetPill>
          <PresetPill active={activePreset === "custom"} onClick={() => setPickerOpen(!pickerOpen)}>📅 {t.pickRange}</PresetPill>

          {pickerOpen && (
            <div className="absolute top-12 right-0 z-50 bg-white rounded-xl p-5 w-[380px] shadow-2xl border border-gold/25">
              <p className="font-ui text-[11px] tracking-[0.22em] uppercase text-ocean/55 font-semibold mb-3">{t.quickPresets}</p>
              <div className="grid grid-cols-2 gap-1.5 mb-5">
                <PickerPreset onClick={applyToday}>{t.today}</PickerPreset>
                <PickerPreset onClick={applyYesterday}>{t.yesterday}</PickerPreset>
                <PickerPreset onClick={() => applyPreset("7d")}>{t.last7}</PickerPreset>
                <PickerPreset onClick={() => applyPreset("30d")}>{t.last30}</PickerPreset>
                <PickerPreset onClick={applyThisMonth}>{t.thisMonth}</PickerPreset>
                <PickerPreset onClick={applyLastMonth}>{t.lastMonth}</PickerPreset>
                <PickerPreset onClick={() => applyPreset("90d")}>{t.last90}</PickerPreset>
                <PickerPreset onClick={() => applyPreset("this-year")}>{t.thisYear}</PickerPreset>
                <PickerPreset onClick={() => applyPreset("all-time")}>{t.allTime}</PickerPreset>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-4"></div>

              <p className="font-ui text-[11px] tracking-[0.22em] uppercase text-ocean/55 font-semibold mb-3">{t.customRange}</p>
              <div className="grid grid-cols-[1fr_12px_1fr] gap-2 items-end mb-3">
                <div>
                  <label className="block font-ui text-[10px] tracking-[0.18em] uppercase text-ocean/55 mb-1 font-medium">{t.from}</label>
                  <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-gold/30 rounded font-body text-base text-larimar-deep bg-cream focus:outline-none focus:border-gold focus:bg-white" />
                </div>
                <span className="text-ocean/40 text-center pb-2.5">→</span>
                <div>
                  <label className="block font-ui text-[10px] tracking-[0.18em] uppercase text-ocean/55 mb-1 font-medium">{t.to}</label>
                  <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gold/30 rounded font-body text-base text-larimar-deep bg-cream focus:outline-none focus:border-gold focus:bg-white" />
                </div>
              </div>
              <div className="bg-cream-dark rounded px-3 py-2 mb-4 flex justify-between items-center font-body text-sm text-larimar-deep">
                <span>{fmtPretty(from, to, lang)}</span>
                <span className="font-heading text-gold-deep font-medium">{dayCount} {t.days}</span>
              </div>

              <div className="flex gap-2 justify-end">
                <button onClick={() => setPickerOpen(false)}
                  className="px-5 py-2 font-ui text-xs tracking-[0.18em] uppercase font-semibold text-ocean/55 hover:text-larimar-deep transition-colors">
                  {t.cancel}
                </button>
                <button onClick={applyCustom}
                  className="px-5 py-2 bg-larimar-deep hover:bg-larimar-mid text-cream rounded-full font-ui text-xs tracking-[0.18em] uppercase font-semibold transition-colors">
                  {t.apply}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* HERO ROW */}
      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-4">
        {/* Featured Revenue card */}
        <div className="relative overflow-hidden rounded-2xl p-8 text-cream"
          style={{ background: "linear-gradient(135deg, #0E3A54 0%, #08080E 100%)" }}>
          <div className="absolute top-[-50px] right-[-50px] w-[220px] h-[220px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,184,48,0.18) 0%, transparent 70%)" }} />
          <p className="font-ui text-xs tracking-[0.28em] uppercase font-semibold text-gold-light mb-3">{t.revenue}</p>
          <p className="font-heading text-7xl leading-none"
            style={{ background: "linear-gradient(135deg, #FAF7F0 0%, #EDD8A0 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {fmtUSD(k.revenue)}
          </p>
          <div className="mt-6 pt-5 border-t border-gold-light/20 font-ui text-[13px] text-gold-light/75 tracking-wide">
            <span className="font-semibold text-gold-light">{k.paidOrders}</span> {t.paidOrders} · <span className="font-semibold text-gold-light">{fmtUSD(k.avgOrder)}</span> {t.avgOrderShort} · <span className="font-semibold text-gold-light">{fmtUSD(k.grossProfit)}</span> {t.grossProfit}
          </div>
        </div>

        <HeroCard label={t.inventoryValue} value={fmtUSD(k.inventoryValue)} />
        <HeroCard label={t.avgMargin} value={`${k.avgMargin.toFixed(1)}%`} valueClass="text-green-700" />
      </div>

      {/* MINI KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <MiniKpi icon="📦" label={t.unitsInStock} value={k.totalUnits.toString()} />
        <MiniKpi icon="💎" label={t.totalProducts} value={k.totalProducts.toString()} />
        <MiniKpi icon="⚠️" label={t.lowStock} value={k.lowStockCount.toString()} tone={k.lowStockCount > 0 ? "warn" : undefined} />
        <MiniKpi icon="🚫" label={t.soldOut} value={k.soldOutCount.toString()} tone={k.soldOutCount > 0 ? "bad" : undefined} />
      </div>

      {/* SMART INSIGHT */}
      {data.insight && (
        <div className="rounded-xl p-6 px-7 flex gap-4 items-start"
          style={{ background: "linear-gradient(135deg, #FAF7F0, #f0e9d4)", borderLeft: "4px solid #D06800" }}>
          <span className="text-3xl leading-none flex-shrink-0">💡</span>
          <div className="flex-1">
            <p className="font-ui text-[11px] tracking-[0.2em] uppercase text-ambar font-semibold mb-1.5">{t.smartInsight} · {data.insight.label}</p>
            <p className="font-body text-lg text-larimar-deep leading-relaxed">{data.insight.body}</p>
          </div>
        </div>
      )}

      {/* SPOTLIGHTS */}
      <div>
        <SectionHead title={t.spotlights} hint={t.spotlightsHint} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Spotlight icon="🏆" title={t.bestSellers} sub={t.bestSellersSub} items={data.bestSellers} emptyMessage={t.noBestSellers} />
          <Spotlight icon="💰" title={t.mostProfitable} sub={t.mostProfitableSub} items={data.mostProfitable} emptyMessage={t.noBestSellers} />
          <Spotlight icon="👁️" title={t.mostViewed} sub={t.mostViewedSub} items={data.mostViewed} emptyMessage={t.noViews} />
        </div>
      </div>

      {/* MARGIN BREAKDOWN */}
      <div>
        <SectionHead title={t.marginBreakdown} hint={t.marginBreakdownHint} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Breakdown title={t.byStone} rows={data.breakdowns.stone} labelFor={(k) => labelFor("stone", k)} />
          <Breakdown title={t.byMetal} rows={data.breakdowns.metal} labelFor={(k) => labelFor("metal", k)} />
          <Breakdown title={t.byCategory} rows={data.breakdowns.category} labelFor={(k) => labelFor("category", k)} />
        </div>
      </div>

      {/* ALERTS */}
      {data.alerts.length > 0 && (
        <div className="bg-white rounded-2xl p-7 border border-gold/20">
          <h2 className="font-heading text-2xl tracking-[0.1em] uppercase text-larimar-deep m-0">{t.needsAttention}</h2>
          <p className="font-body italic text-base text-ocean/60 mt-1 mb-5">{t.needsAttentionHint}</p>
          {data.alerts.map((a) => (
            <div key={a.id} className="flex items-center gap-4 py-3.5 border-b border-gold/10 last:border-b-0">
              <span className="text-xl flex-shrink-0">{a.qty === 0 ? "🚫" : "⚠️"}</span>
              <div className="flex-1 font-body text-base text-larimar-deep">
                <span className="font-mono text-xs text-ocean/45 mr-3">{a.sku || "—"}</span>
                {a.name}
              </div>
              <div className={`font-heading text-lg font-medium ${a.qty === 0 ? "text-red-600" : "text-yellow-700"}`}>
                {a.qty} {t.daysLeft}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ----- Sub-components -----

function PresetPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`px-4 py-2 rounded-full font-ui text-xs tracking-[0.12em] font-medium transition-all whitespace-nowrap ${
        active
          ? "bg-larimar-deep text-cream border border-larimar-deep"
          : "bg-transparent text-gold-deep border border-gold/35 hover:bg-gold/10"
      }`}>
      {children}
    </button>
  );
}

function PickerPreset({ onClick, children, selected }: { onClick: () => void; children: React.ReactNode; selected?: boolean }) {
  return (
    <button onClick={onClick}
      className={`text-left px-3.5 py-2.5 rounded font-body text-sm transition-all ${
        selected
          ? "bg-gold/15 border border-gold text-gold-deep font-semibold"
          : "bg-cream border border-transparent text-larimar-deep hover:bg-gold/10"
      }`}>
      {children}
    </button>
  );
}

function HeroCard({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-gold/18 transition-transform hover:-translate-y-0.5">
      <p className="font-ui text-xs tracking-[0.28em] uppercase font-semibold text-gold-deep mb-3">{label}</p>
      <p className={`font-heading text-6xl leading-none text-larimar-deep ${valueClass || ""}`}>{value}</p>
    </div>
  );
}

function MiniKpi({ icon, label, value, tone }: { icon: string; label: string; value: string; tone?: "good" | "warn" | "bad" }) {
  const valueClass =
    tone === "good" ? "text-green-700" :
    tone === "warn" ? "text-yellow-700" :
    tone === "bad" ? "text-red-600" : "text-ocean";
  return (
    <div className="bg-white rounded-xl px-5 py-5 border border-gold/15">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">{icon}</span>
        <p className="font-ui text-[11px] tracking-[0.22em] uppercase font-medium text-ocean/55">{label}</p>
      </div>
      <p className={`font-heading text-3xl leading-tight ${valueClass}`}>{value}</p>
    </div>
  );
}

function SectionHead({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="flex justify-between items-baseline mb-5 pb-3.5 border-b border-gold/25">
      <h2 className="font-heading text-2xl tracking-[0.1em] uppercase text-larimar-deep m-0">{title}</h2>
      <span className="font-body italic text-base text-ocean/60">{hint}</span>
    </div>
  );
}

function Spotlight({ icon, title, sub, items, emptyMessage }: { icon: string; title: string; sub: string; items: SpotlightItem[]; emptyMessage: string }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gold/18">
      <div className="px-6 pt-5 pb-3.5 border-b border-gold/12">
        <span className="text-2xl inline-block p-2 rounded-xl mb-1.5"
          style={{ background: "linear-gradient(135deg, #EDD8A0, #C9A84C)" }}>{icon}</span>
        <p className="font-heading text-[15px] tracking-[0.14em] uppercase font-medium text-larimar-deep mt-1">{title}</p>
        <p className="font-body italic text-sm text-ocean/60">{sub}</p>
      </div>
      {items.length === 0 ? (
        <p className="px-6 py-10 font-body italic text-center text-sm text-ocean/45">{emptyMessage}</p>
      ) : (
        <div>
          {items.slice(0, 5).map((it, i) => <SpotlightRow key={it.id} rank={i + 1} item={it} />)}
        </div>
      )}
    </div>
  );
}

function SpotlightRow({ rank, item }: { rank: number; item: SpotlightItem }) {
  const stoneClass =
    item.stone_type === "amber" ? "from-ambar-light to-ambar-deep" :
    item.stone_type === "blue-amber" ? "from-larimar via-larimar-mid to-larimar-deep" :
    "from-larimar via-larimar-mid to-larimar-deep";
  const stoneLetter = (item.stone_type || "X").charAt(0).toUpperCase();
  const valueText = item.primaryFmt === "usd" ? fmtUSD(item.primary) : item.primary.toString();

  return (
    <div className="flex gap-3.5 items-center px-6 py-3.5 border-b border-gold/8 last:border-b-0 hover:bg-cream-dark/40 transition-colors">
      <span className="font-heading text-xl text-gold w-7 text-center flex-shrink-0">{rank}</span>
      <div className={`w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center font-heading text-xl text-white bg-gradient-to-br ${stoneClass}`}>
        {item.image_main ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image_main} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <span>{stoneLetter}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-body text-base text-larimar-deep leading-tight truncate">{item.name}</p>
        <p className="font-ui text-[11px] tracking-[0.12em] uppercase text-ocean/55 mt-0.5 font-medium truncate">{item.subline}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-heading text-xl text-gold-deep leading-none">{valueText}</p>
        <p className="font-ui text-[11px] text-ocean/50 mt-1 tracking-wide">{item.primaryLabel}</p>
      </div>
    </div>
  );
}

function Breakdown({ title, rows, labelFor }: {
  title: string;
  rows: Array<{ key: string; margin: number; units: number }>;
  labelFor: (k: string) => string;
}) {
  const max = Math.max(...rows.map((r) => r.margin), 1);
  return (
    <div className="bg-white rounded-xl p-6 border border-gold/18">
      <h3 className="font-heading text-[15px] tracking-[0.16em] uppercase font-medium text-larimar-deep m-0 mb-4">{title}</h3>
      {rows.length === 0 ? (
        <p className="font-body text-sm text-ocean/40 italic">—</p>
      ) : (
        rows.slice(0, 6).map((r) => (
          <div key={r.key} className="mb-4 last:mb-0">
            <div className="flex justify-between items-center mb-2">
              <span className="font-body text-base text-larimar-deep">{labelFor(r.key)}</span>
              <span className="font-heading text-lg text-gold-deep font-medium">{r.margin.toFixed(1)}%</span>
            </div>
            <div className="h-2.5 bg-gold/15 rounded-full overflow-hidden">
              <div className="h-full rounded-full"
                style={{
                  width: `${Math.min(100, (r.margin / max) * 100)}%`,
                  background: "linear-gradient(90deg, #EDD8A0, #C9A84C)",
                }}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
