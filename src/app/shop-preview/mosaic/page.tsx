import Link from "next/link";
import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { STONE_LABELS } from "@/lib/constants";
import PreviewTile from "@/components/products/PreviewTile";

export const metadata: Metadata = {
  title: "Layout B — Editorial Mosaic",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * LAYOUT B — EDITORIAL MOSAIC
 *
 * Deliberately breaks the uniform grid: pieces get different sizes and vertical
 * offsets, so the page reads as a composed spread rather than a repeating card
 * component. Featured / new arrivals take the large cells.
 *
 * The pattern repeats every 6 items, so it stays composed as the catalogue grows.
 */

// col span, row span, and vertical offset for each position in the 6-cell cycle
const CELLS = [
  { span: "sm:col-span-4 sm:row-span-2", aspect: "aspect-[4/5]", offset: "" },
  { span: "sm:col-span-3", aspect: "aspect-square", offset: "sm:mt-14" },
  { span: "sm:col-span-3", aspect: "aspect-[4/5]", offset: "sm:mt-4" },
  { span: "sm:col-span-3", aspect: "aspect-square", offset: "sm:mt-20" },
  { span: "sm:col-span-4 sm:row-span-2", aspect: "aspect-[4/5]", offset: "sm:mt-8" },
  { span: "sm:col-span-3", aspect: "aspect-square", offset: "" },
];

export default async function MosaicLayout() {
  const products = (await getAllProducts()).filter((p) => p.visible);

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-24">
        {/* off-centre header */}
        <div className="grid gap-6 sm:grid-cols-12 sm:items-end">
          <div className="sm:col-span-7">
            <p className="font-ui text-[10px] uppercase tracking-[0.4em] text-gold">
              Larimar &amp; Amber
            </p>
            <h1 className="mt-3 font-heading text-5xl leading-[1.05] text-ocean sm:text-6xl">
              The
              <br />
              Collection
            </h1>
          </div>
          <div className="sm:col-span-5 sm:pb-3">
            <p className="max-w-xs font-body text-lg leading-relaxed text-ocean/60">
              Found only in the Caribbean. Cut, set and finished by hand in the
              Dominican Republic.
            </p>
            <nav className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-ui text-[11px] lowercase tracking-[0.14em] text-ocean/45">
              <span className="text-ocean">all</span>
              <span>larimar</span>
              <span>amber</span>
              <span>blue amber</span>
            </nav>
          </div>
        </div>

        {/* mosaic */}
        <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-7 sm:gap-x-8">
          {products.map((p, i) => {
            const cell = CELLS[i % CELLS.length];
            return (
              <article key={p.id} className={`${cell.span} ${cell.offset}`}>
                <Link href={`/shop/${p.slug}`} className="group block">
                  <div
                    className={`${cell.aspect} w-full overflow-hidden rounded-sm`}
                  >
                    <PreviewTile
                      product={p}
                      className="transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <h2 className="font-heading text-base uppercase tracking-wide text-ocean transition-colors group-hover:text-gold">
                      {p.name}
                    </h2>
                    <span className="shrink-0 font-body text-lg text-ocean/80">
                      {formatPrice(p.priceRetail)}
                    </span>
                  </div>
                  <p className="mt-1 font-ui text-[10px] uppercase tracking-[0.2em] text-ocean/40">
                    {STONE_LABELS[p.stoneType]}
                    {p.newArrival && <span className="text-gold"> · New</span>}
                    {p.stockStatus === "sold-out" && (
                      <span className="text-ocean/50"> · Sold out</span>
                    )}
                    {p.stockStatus === "low-stock" && (
                      <span className="text-ambar"> · Low stock</span>
                    )}
                  </p>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
