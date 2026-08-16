import { STONE_LABELS } from "@/lib/constants";
import { optimizeImage } from "@/lib/cloudinary";
import type { Product } from "@/types/product";

/**
 * Image tile used by the /shop-preview layout candidates.
 *
 * The catalogue currently has NO product photography (every `image_main` is an
 * empty string), so the placeholder has to look deliberate rather than broken —
 * otherwise the layouts can't be judged fairly. Each stone gets its own tone,
 * so a grid of placeholders still reads as a collection of different pieces.
 *
 * When real photos land in `image_main` this renders them instead, with no
 * layout change.
 */

const STONE_TONE: Record<string, string> = {
  larimar: "from-[#3AADCC]/25 via-[#1A7A9E]/12 to-[#FAF7F0]",
  "blue-amber": "from-[#1A7A9E]/28 via-[#6B3000]/14 to-[#FAF7F0]",
  amber: "from-[#FFB830]/30 via-[#D06800]/14 to-[#FAF7F0]",
};

export default function PreviewTile({
  product,
  className = "",
  label = true,
}: {
  product: Product;
  className?: string;
  label?: boolean;
}) {
  const hasPhoto =
    product.imageMain && product.imageMain !== "/images/placeholder.jpg";

  if (hasPhoto) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={optimizeImage(product.imageMain, 900)}
        alt={product.name}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  const tone = STONE_TONE[product.stoneType] ?? STONE_TONE.larimar;

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br ${tone} ${className}`}
    >
      {/* faint concentric rings, echoing a polished cabochon */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 42%)",
        }}
      />
      {label && (
        <span className="relative font-ui text-[10px] uppercase tracking-[0.32em] text-ocean/35">
          {STONE_LABELS[product.stoneType] ?? product.stoneType}
        </span>
      )}
    </div>
  );
}
