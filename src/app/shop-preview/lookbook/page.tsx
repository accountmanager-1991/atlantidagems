import Link from "next/link";
import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { STONE_LABELS, METAL_LABELS } from "@/lib/constants";
import PreviewTile from "@/components/products/PreviewTile";

export const metadata: Metadata = {
  title: "Layout C — Lookbook",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * LAYOUT C — LOOKBOOK ROWS
 *
 * One piece per full-width row, image and copy alternating sides, like a
 * magazine spread. Works well at this catalogue size (8 pieces) and gives each
 * item real presence.
 *
 * Trade-off: it is carried almost entirely by photography, so it is the layout
 * that suffers most while `image_main` is empty.
 */
export default async function LookbookLayout() {
  const products = (await getAllProducts()).filter((p) => p.visible);

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-24">
        <div className="max-w-2xl">
          <p className="font-ui text-[10px] uppercase tracking-[0.4em] text-gold">
            Lookbook
          </p>
          <h1 className="mt-3 font-heading text-5xl leading-[1.05] text-ocean sm:text-6xl">
            The Collection
          </h1>
          <p className="mt-6 font-body text-xl leading-relaxed text-ocean/60">
            Eight pieces. Each one cut from stone found nowhere else on earth.
          </p>
        </div>

        <div className="mt-20 space-y-24 sm:space-y-32">
          {products.map((p, i) => {
            const flip = i % 2 === 1;
            return (
              <article
                key={p.id}
                className="grid items-center gap-10 sm:grid-cols-2 sm:gap-16"
              >
                <Link
                  href={`/shop/${p.slug}`}
                  className={`group block ${flip ? "sm:order-2" : ""}`}
                >
                  <div className="aspect-[4/5] w-full overflow-hidden rounded-sm">
                    <PreviewTile
                      product={p}
                      className="transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                </Link>

                <div className={flip ? "sm:order-1 sm:text-right" : ""}>
                  <p className="font-heading text-6xl leading-none text-gold/25 sm:text-7xl">
                    {String(i + 1).padStart(2, "0")}
                  </p>

                  <h2 className="mt-5 font-heading text-3xl uppercase leading-tight tracking-wide text-ocean sm:text-4xl">
                    {p.name}
                  </h2>

                  <p className="mt-3 font-ui text-[11px] uppercase tracking-[0.22em] text-ocean/45">
                    {STONE_LABELS[p.stoneType]} &middot;{" "}
                    {METAL_LABELS[p.metalType]}
                  </p>

                  {p.shortDescription && (
                    <p className="mt-5 max-w-md font-body text-lg leading-relaxed text-ocean/65 sm:inline-block">
                      {p.shortDescription}
                    </p>
                  )}

                  <p className="mt-5 font-ui text-[10px] uppercase tracking-[0.16em] text-ocean/35">
                    {[
                      p.stoneOrigin,
                      p.weightGrams ? `${p.weightGrams} g` : null,
                      p.dimensions || null,
                    ]
                      .filter(Boolean)
                      .join("  ·  ")}
                  </p>

                  <div
                    className={`mt-8 flex items-center gap-6 ${
                      flip ? "sm:justify-end" : ""
                    }`}
                  >
                    <span className="font-body text-2xl text-ocean">
                      {formatPrice(p.priceRetail)}
                    </span>
                    {p.stockStatus === "sold-out" ? (
                      <span className="font-ui text-[10px] uppercase tracking-[0.24em] text-ocean/40">
                        Sold out
                      </span>
                    ) : (
                      <button className="border border-ocean px-7 py-3 font-ui text-[10px] uppercase tracking-[0.24em] text-ocean transition-colors hover:bg-ocean hover:text-cream">
                        Add to bag
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
