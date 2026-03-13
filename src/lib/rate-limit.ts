// Simple in-memory rate limiter for serverless (per-instance)
// For distributed rate limiting, use Upstash Redis

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
function cleanup() {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}

setInterval(cleanup, 60_000);

export function rateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): { success: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: maxAttempts - 1, resetIn: windowMs };
  }

  if (entry.count >= maxAttempts) {
    return {
      success: false,
      remaining: 0,
      resetIn: entry.resetAt - now,
    };
  }

  entry.count++;
  return {
    success: true,
    remaining: maxAttempts - entry.count,
    resetIn: entry.resetAt - now,
  };
}
