const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dlk6s7llm";

export function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // If it's already a full Cloudinary URL, transform it
  if (src.includes("res.cloudinary.com")) {
    const parts = src.split("/upload/");
    if (parts.length === 2) {
      const transforms = `w_${width},q_${quality || 80},f_auto`;
      return `${parts[0]}/upload/${transforms}/${parts[1]}`;
    }
  }

  // If it's a Cloudinary public ID
  if (!src.startsWith("http")) {
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},q_${quality || 80},f_auto/${src}`;
  }

  // Fallback: return as-is
  return src;
}

export function getImageUrl(publicIdOrUrl: string, width = 800): string {
  if (!publicIdOrUrl) return "/images/placeholder.jpg";

  if (publicIdOrUrl.startsWith("http")) {
    return publicIdOrUrl;
  }

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},q_auto,f_auto/${publicIdOrUrl}`;
}

/**
 * Add Cloudinary optimizations to an existing Cloudinary URL.
 * If the URL is not from Cloudinary, returns it unchanged.
 */
export function optimizeImage(url: string, width = 800): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;
  return `${parts[0]}/upload/c_limit,w_${width},q_auto,f_auto/${parts[1]}`;
}
