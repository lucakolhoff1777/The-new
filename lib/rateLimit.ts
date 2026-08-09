import { Redis } from "@upstash/redis";

// Testmodus-Prinzip wie bei ANTHROPIC_API_KEY/RESEND_API_KEY (siehe
// lib/anthropic.ts, lib/email.ts): ohne angebundenen Redis-Store läuft der
// Limiter In-Memory weiter (nur pro Prozess, kein global konsistenter
// Schutz) statt zu crashen - relevant für lokale Entwicklung und Tests. In
// Produktion mit Upstash-Redis (per Vercel-Marketplace-Integration gesetzte
// KV_REST_API_URL/KV_REST_API_TOKEN) ist der Schutz über alle
// Serverless-Instanzen hinweg konsistent.
const HAS_REDIS = !!(
  (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) &&
  (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN)
);

const redis = HAS_REDIS ? Redis.fromEnv() : null;

type Bucket = { count: number; windowStart: number };
const buckets = new Map<string, Bucket>();

function prefixed(key: string): string {
  return `ratelimit:${key}`;
}

export async function isRateLimited(key: string, limit: number, windowMs: number): Promise<boolean> {
  if (redis) {
    const count = await redis.get<number>(prefixed(key));
    return (count ?? 0) >= limit;
  }
  const bucket = buckets.get(key);
  if (!bucket) return false;
  if (Date.now() - bucket.windowStart > windowMs) return false;
  return bucket.count >= limit;
}

export async function recordAttempt(key: string, windowMs: number): Promise<void> {
  if (redis) {
    const windowSeconds = Math.max(1, Math.ceil(windowMs / 1000));
    const count = await redis.incr(prefixed(key));
    if (count === 1) {
      await redis.expire(prefixed(key), windowSeconds);
    }
    return;
  }
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now - bucket.windowStart > windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return;
  }
  bucket.count += 1;
}

export async function clearAttempts(key: string): Promise<void> {
  if (redis) {
    await redis.del(prefixed(key));
    return;
  }
  buckets.delete(key);
}
