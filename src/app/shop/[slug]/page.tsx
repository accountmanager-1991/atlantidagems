import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getProductSlugs } from "@/lib/products";
import { BRAND, STONE_LABELS, METAL_LABELS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "@/components/products/AddToCartButton";
import ProductDescription from "@/components/products/ProductDescription";
import ProductGallery from "@/components/products/ProductGallery";

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.shortDescription,
    openGraph: {
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.shortDescription,
      type: "website",
      siteName: BRAND.name,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const images = [
    product.imageMain,
    product.image2,
    product.image3,
    product.image4,
  ].filter(Boolean);

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 font-ui text-sm text-ocean/50">
          <a href="/shop" className="hover:text-gold transition-colors">
            Shop
          </a>
          <span className="mx-2">/</span>
          <span className="text-ocean">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <ProductGallery
            images={images}
            name={product.name}
            stonePlaceholder={STONE_LABELS[product.stoneType]}
          />

          {/* Product Info */}
          <div>
            {/* Badges */}
            <div className="flex gap-2 mb-4">
              {product.newArrival && (
                <span className="bg-gold text-dark font-ui text-[10px] tracking-wider uppercase px-3 py-1">
                  New Arrival
                </span>
              )}
              {product.stockStatus === "low-stock" && (
                <span className="bg-ocean text-cream font-ui text-[10px] tracking-wider uppercase px-3 py-1">
                  Low Stock
                </span>
              )}
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl tracking-[0.08em] text-ocean mb-2 normal-case">
              {product.name}
            </h1>

            <p className="font-ui text-xs text-ocean/50 mb-6">
              {STONE_LABELS[product.stoneType]} &middot;{" "}
              {METAL_LABELS[product.metalType]}
            </p>

            <p className="font-heading text-3xl text-gold mb-6 normal-case">
              {formatPrice(product.priceRetail)}
            </p>

            <div className="gold-divider mb-6" />

            <ProductDescription
              en={product.description}
              es={product.descriptionEs}
              de={product.descriptionDe}
            />

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <p className="font-ui text-xs text-ocean/40 uppercase tracking-wider">
                  Stone Origin
                </p>
                <p className="font-body text-sm text-ocean mt-1">
                  {product.stoneOrigin}
                </p>
              </div>
              {product.dimensions && (
                <div>
                  <p className="font-ui text-xs text-ocean/40 uppercase tracking-wider">
                    Dimensions
                  </p>
                  <p className="font-body text-sm text-ocean mt-1">
                    {product.dimensions}
                  </p>
                </div>
              )}
              {product.weightGrams > 0 && (
                <div>
                  <p className="font-ui text-xs text-ocean/40 uppercase tracking-wider">
                    Weight
                  </p>
                  <p className="font-body text-sm text-ocean mt-1">
                    {product.weightGrams}g
                  </p>
                </div>
              )}
              <div>
                <p className="font-ui text-xs text-ocean/40 uppercase tracking-wider">
                  Availability
                </p>
                <p className="font-body text-sm text-ocean mt-1 capitalize">
                  {product.stockStatus.replace("-", " ")}
                </p>
              </div>
            </div>

            {/* Add to Cart */}
            {product.stockStatus !== "sold-out" ? (
              <AddToCartButton product={product} />
            ) : (
              <p className="font-ui text-sm text-ocean/50 text-center py-4 border border-ocean/20 rounded">
                This piece is currently sold out. Contact us to be notified
                when it&apos;s back in stock.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
