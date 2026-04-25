"use client";

import { useEffect } from "react";

// Records one view per session per product. Fires once on mount.
// SessionStorage dedup so reloading the same product doesn't double-count.
export default function TrackProductView({ productId }: { productId: string }) {
  useEffect(() => {
    if (!productId) return;
    const key = `viewed_${productId}`;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch(`/api/track-view/${encodeURIComponent(productId)}`, {
      method: "POST",
      keepalive: true,
    }).catch(() => { /* silent — view tracking is best-effort */ });
  }, [productId]);
  return null;
}
