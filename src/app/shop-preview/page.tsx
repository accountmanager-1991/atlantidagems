import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop layout options",
  robots: { index: false, follow: false },
};

/**
 * Internal picker for the /shop redesign. noindex; delete this route once a
 * layout is chosen and promoted to /shop.
 */
const OPTIONS = [
  {
    href: "/shop-preview/specimen",
    tag: "A",
    name: "Specimen Catalogue",
    body: "Type-led rows with hairline rules and numbered specimens. Shows the provenance data the current layout collects but never displays — origin, weight, dimensions. Leans into 'by Ambar Mine Museum'.",
    note: "Reads as finished even without photography.",
  },
  {
    href: "/shop-preview/mosaic",
    tag: "B",
    name: "Editorial Mosaic",
    body: "Breaks the uniform grid — pieces get different sizes and vertical offsets so the page reads as a composed spread rather than a repeating card. Off-centre header, heavy negative space.",
    note: "Needs photography to reach its full effect.",
  },
  {
    href: "/shop-preview/lookbook",
    tag: "C",
    name: "Lookbook Rows",
    body: "One piece per full-width row, image and copy alternating sides like a magazine spread. Gives each of the eight pieces real presence.",
    note: "Carried entirely by photography — weakest while images are missing.",
  },
];

export default function ShopPreviewIndex() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-3xl px-6 py-20 sm:px-10">
        <p className="font-ui text-[10px] uppercase tracking-[0.4em] text-gold">
          Internal · not indexed
        </p>
        <h1 className="mt-3 font-heading text-4xl text-ocean">
          Shop layout options
        </h1>
        <p className="mt-5 font-body text-lg leading-relaxed text-ocean/65">
          Three directions, all rendering the real catalogue. Every product
          currently has an empty <code className="font-ui text-sm">image_main</code>,
          so tiles show a stone-toned placeholder — judge the structure, not the
          imagery.
        </p>

        <div className="mt-12 space-y-4">
          {OPTIONS.map((o) => (
            <Link
              key={o.href}
              href={o.href}
              className="group block border border-ocean/15 bg-white/60 p-7 transition-colors hover:border-gold"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-ui text-[11px] tracking-[0.2em] text-gold">
                  {o.tag}
                </span>
                <h2 className="font-heading text-2xl uppercase tracking-wide text-ocean transition-colors group-hover:text-gold">
                  {o.name}
                </h2>
              </div>
              <p className="mt-3 font-body text-lg leading-relaxed text-ocean/65">
                {o.body}
              </p>
              <p className="mt-3 font-ui text-[10px] uppercase tracking-[0.18em] text-ocean/40">
                {o.note}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
