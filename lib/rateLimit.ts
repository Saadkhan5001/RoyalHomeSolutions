/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * Deliberately dependency-free and process-local. On a single long-running
 * Node server this is a hard limit. On serverless (Vercel) each instance keeps
 * its own counters, so the effective limit is per-instance rather than global —
 * enough to stop a naive script hammering one connection, not a distributed
 * flood. Swap the store for Redis/Upstash if that ever matters.
 */

interface Bucket {
  /** Request timestamps (ms) inside the current window, oldest first. */
  hits: number[];
}

const buckets = new Map<string, Bucket>();

/** Above this many tracked keys we sweep out empty buckets. */
const SWEEP_THRESHOLD = 5_000;

export interface RateLimitResult {
  allowed: boolean;
  /** Requests still available in the current window. */
  remaining: number;
  /** Seconds until the oldest hit falls out of the window. */
  retryAfterSeconds: number;
}

// Array.from rather than `for...of` over the Map: tsconfig has no `target`, so
// it defaults to ES5 and direct Map iteration needs downlevelIteration.
function sweep(now: number, windowMs: number): void {
  Array.from(buckets.entries()).forEach(([key, bucket]) => {
    const live = bucket.hits.filter((t: number) => now - t < windowMs);
    if (live.length === 0) buckets.delete(key);
    else bucket.hits = live;
  });
}

/**
 * Reports whether `key` is currently under its limit, without counting the
 * request. Call this early to reject a flood cheaply.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();

  if (buckets.size > SWEEP_THRESHOLD) sweep(now, windowMs);

  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);
  buckets.set(key, bucket);

  if (bucket.hits.length >= limit) {
    // Measured from the oldest live hit, so a blocked caller can't extend
    // their own lockout by continuing to hammer the endpoint.
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((windowMs - (now - bucket.hits[0])) / 1000),
      ),
    };
  }

  return {
    allowed: true,
    remaining: limit - bucket.hits.length,
    retryAfterSeconds: 0,
  };
}

/**
 * Counts one request against `key`.
 *
 * Deliberately separate from `checkRateLimit` so routes only spend quota on
 * requests that reach the expensive work. A visitor who mistypes their email
 * twice would otherwise burn their allowance on validation errors and be
 * locked out of their first correct attempt.
 */
export function recordRateLimitHit(key: string, windowMs: number): void {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t: number) => now - t < windowMs);
  bucket.hits.push(now);
  buckets.set(key, bucket);
}

/**
 * Coarse per-IP request ceiling, counted on every request that reaches a route.
 *
 * Deliberately separate from the per-route submission allowance, and much more
 * generous. The two answer different questions:
 *
 *   - submission bucket (tight): "has this person already sent us five leads?"
 *     Charged only for a valid, human submission, so a visitor fixing a typo —
 *     or someone sharing an office/CGNAT address with a bot — never burns it.
 *   - abuse bucket (loose): "is this address hammering us?" Charged for every
 *     request, so malformed and bot-shaped traffic still costs something.
 *
 * Keeping them apart is the whole point: five bad requests from a shared IP
 * must not lock out a real customer behind the same NAT, and with Turnstile as
 * the primary control they no longer need to. Same in-memory store, no new
 * infrastructure.
 */
export function checkAndRecordAbuse(
  route: string,
  ip: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const key = `abuse:${route}:${ip}`;
  const result = checkRateLimit(key, limit, windowMs);
  // Recorded even for requests that go on to be rejected — that is the point.
  if (result.allowed) recordRateLimitHit(key, windowMs);
  return result;
}

/**
 * Best-effort client IP. Behind Vercel/most proxies the real client is the
 * first entry in `x-forwarded-for`; everything after it is proxy hops.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0].trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Test hook — clears all tracked buckets. */
export function resetRateLimits(): void {
  buckets.clear();
}
