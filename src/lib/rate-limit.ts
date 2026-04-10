/**
 * In-memory sliding-window rate limiter for auth endpoints.
 *
 * Two layered windows are checked per request:
 *   - short window: 5 requests / 60 seconds  → catches rapid spam / brute force
 *   - long  window: 30 requests / 60 minutes → catches sustained abuse
 *
 * Trade-off: in-memory state means this only works inside a single
 * Vercel function instance. Vercel can spin up many instances under
 * load, so the effective limit is "5 per minute per (IP, instance)".
 * Good enough to stop a casual brute-force attack from a single
 * machine. For a globally consistent limit, swap the Map below for
 * Upstash Redis or Vercel KV — the rest of this file is unchanged.
 */

type Bucket = number[];

const SHORT_WINDOW_MS = 60 * 1000; // 1 minute
const SHORT_WINDOW_MAX = 5;

const LONG_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const LONG_WINDOW_MAX = 30;

const buckets = new Map<string, Bucket>();

// Periodic janitor to evict cold IPs entirely.
let lastSweep = Date.now();
const SWEEP_INTERVAL_MS = 5 * 60 * 1000;

function sweepIfDue(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [ip, bucket] of buckets) {
    const trimmed = bucket.filter(t => now - t < LONG_WINDOW_MS);
    if (trimmed.length === 0) buckets.delete(ip);
    else buckets.set(ip, trimmed);
  }
}

export type RateLimitResult =
  | { ok: true; remainingShort: number; remainingLong: number }
  | { ok: false; retryAfterSeconds: number; reason: 'short' | 'long' };

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  sweepIfDue(now);

  const bucket = buckets.get(ip) ?? [];
  const fresh = bucket.filter(t => now - t < LONG_WINDOW_MS);

  const inShortWindow = fresh.filter(t => now - t < SHORT_WINDOW_MS);

  if (inShortWindow.length >= SHORT_WINDOW_MAX) {
    const oldestInShort = inShortWindow[0];
    const retryAfterMs = SHORT_WINDOW_MS - (now - oldestInShort);
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
      reason: 'short',
    };
  }

  if (fresh.length >= LONG_WINDOW_MAX) {
    const oldest = fresh[0];
    const retryAfterMs = LONG_WINDOW_MS - (now - oldest);
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
      reason: 'long',
    };
  }

  fresh.push(now);
  buckets.set(ip, fresh);

  return {
    ok: true,
    remainingShort: SHORT_WINDOW_MAX - inShortWindow.length - 1,
    remainingLong: LONG_WINDOW_MAX - fresh.length,
  };
}

/** Best-effort client IP extraction from a Next.js Request, behind Vercel's edge proxy. */
export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    // First entry is the original client; later entries are proxies.
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return 'unknown';
}

/** Build a 429 Too Many Requests JSON response with Retry-After header. */
export function rateLimitedResponse(retryAfterSeconds: number): Response {
  return new Response(
    JSON.stringify({
      error: {
        message: `Too many requests. Try again in ${retryAfterSeconds}s.`,
        code: 'rate-limited',
        status: 429,
      },
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfterSeconds),
        'Cache-Control': 'no-store',
      },
    },
  );
}
