"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-gold text-5xl font-heading mb-4">Oops</p>
        <h1 className="text-2xl font-heading text-ocean mb-3">Something Went Wrong</h1>
        <p className="text-ocean/60 mb-8 font-body text-lg">
          We encountered an unexpected error. Please try again.
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-ocean text-cream rounded-lg font-ui text-sm tracking-wide hover:bg-ocean-light transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
