// Einfacher In-Memory-Rate-Limiter gegen Brute-Force auf Login/Registrierung.
// Läuft pro Serverprozess - bei mehreren Instanzen (z. B. Serverless mit
// mehreren Kaltstarts) ist der Schutz entsprechend nicht global konsistent;
// für den produktiven Einsatz sollte ein geteilter Store (z. B. Redis)
// verwendet werden.
type Bucket = { count: number; windowStart: number };

const buckets = new Map<string, Bucket>();

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const bucket = buckets.get(key);
  if (!bucket) return false;
  if (Date.now() - bucket.windowStart > windowMs) return false;
  return bucket.count >= limit;
}

export function recordAttempt(key: string, windowMs: number): void {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now - bucket.windowStart > windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return;
  }
  bucket.count += 1;
}

export function clearAttempts(key: string): void {
  buckets.delete(key);
}
