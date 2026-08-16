import Link from "next/link";
import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { STONE_LABELS, METAL_LABELS } from "@/lib/constants";
import PreviewTile from "@/components/products/PreviewTile";

export const metadata: Metadata = {
  title: "Layout A — Specimen Catalogue",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * LAYOUT A — MUSEUM SPECIMEN CATALOGUE
 *
 * Type-led rows separated by hairlines instead of a card grid. Each piece is a
 * numbered specimen with its real provenance data (origin, weight, dimensions),
 * which the current layout collects but never shows.
 *
 * Chosen shape because the brand is literally "by Ambar Mine Museum", and
 * because a type-led layout still reads as finished while photography is
 * missing — a photo grid does not.
 */
export default async function SpecimenLayout() {
  const products = (await getAllProducts()).filter((p) => p.visible);

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-10 sm:py-24">
        {/* header — left aligned, no centred title, no pill row */}
        <div className="flex flex-col gap-6 border-b border-ocean/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-ui text-[10px] uppercase tracking-[0.4em] text-gold">
              Catalogue
            </p>
            <h1 className="mt-3 font-heading text-4xl text-ocean sm:text-5xl">
              The Collection
            </h1>
          </div>
          <nav className="flex flex-wrap gap-x-7 gap-y-2 font-ui text-[11px] uppercase tracking-[0.2em]">
            <span className="text-ocean underline decoration-gold decoration-2 underline-offset-8">
              All
            </span>
            <span className="text-ocean/45">Larimar</span>
            <span className="text-ocean/45">Amber</span>
            <span className="text-ocean/45">Blue Amber</span>
            <span className="text-ocean/45">Newest</span>
          </nav>
        </div>

        <p className="mt-6 font-ui text-[11px] uppercase tracking-[0.25em] text-ocean/40">
          {products.length} specimens
        </p>

        {/* specimen rows */}
        <ol className="mt-4">
          {products.map((p, i) => (
            <li
              key={p.id}
              className="group grid grid-cols-[2.5rem_5.5rem_1fr] items-center gap-5 border-b border-ocean/12 py-6 transition-colors hover:bg-white/60 sm:grid-cols-[3.5rem_7rem_1fr_auto] sm:gap-8"
            >
              <span className="self-start pt-1 font-ui text-[11px] tracking-[0.18em] text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>

              <Link
                href={`/shop/${p.slug}`}
                className="aspect-square w-full overflow-hidden rounded-sm"
              >
                <PreviewTile product={p} label={false} />
              </Link>

              <div className="min-w-0">
                <Link href={`/shop/${p.slug}`}>
                  <h2 className="font-heading text-lg uppercase tracking-wide text-ocean transition-colors group-hover:text-gold sm:text-xl">
                    {p.name}
                  </h2>
                </Link>
                <p className="mt-1.5 font-body text-[15px] text-ocean/60">
                  {STONE_LABELS[p.stoneType]} &middot; {METAL_LABELS[p.metalType]}
                </p>
                {/* provenance — data the old layout collected but never showed */}
                <p className="mt-2 font-ui text-[10px] uppercase tracking-[0.16em] text-ocean/40">
                  {[
                    p.stoneOrigin,
                    p.weightGrams ? `${p.weightGrams} g` : null,
                    p.dimensions || null,
                  ]
                    .filter(Boolean)
                    .join("  ·  ")}
                </p>
                {(p.newArrival || p.stockStatus !== "in-stock") && (
                  <p className="mt-2 font-ui text-[10px] uppercase tracking-[0.2em]">
                    {p.newArrival && <span className="text-gold">New</span>}
                    {p.newArrival && p.stockStatus !== "in-stock" && (
                      <span className="text-ocean/25"> / </span>
                    )}
                    {p.stockStatus === "sold-out" && (
                      <span className="text-ocean/50">Sold out</span>
                    )}
                    {p.stockStatus === "low-stock" && (
                      <span className="text-ambar">Low stock</span>
                    )}
                  </p>
                )}
              </div>

              <div className="col-start-3 flex items-center gap-5 sm:col-start-4 sm:justify-end">
                <span className="font-body text-xl text-ocean">
                  {formatPrice(p.priceRetail)}
                </span>
                {p.stockStatus !== "sold-out" && (
                  <button className="border border-ocean/25 px-4 py-2 font-ui text-[10px] uppercase tracking-[0.2em] text-ocean transition-colors hover:border-gold hover:bg-gold hover:text-white">
                    Add
                  </button>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
