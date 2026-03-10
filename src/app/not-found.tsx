import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-gold text-6xl font-heading mb-4">404</p>
        <h1 className="text-2xl font-heading text-ocean mb-3">Page Not Found</h1>
        <p className="text-ocean/60 mb-8 font-body text-lg">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-ocean text-cream rounded-lg font-ui text-sm tracking-wide hover:bg-ocean-light transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/shop"
            className="px-6 py-3 border border-gold/30 text-ocean rounded-lg font-ui text-sm tracking-wide hover:border-gold transition-colors"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
