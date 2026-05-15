import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export type AuthOk = {
  ok: true;
  user: { id: string; email?: string | null };
  role: string;
};

export type AuthErr = {
  ok: false;
  status: number;
  error: string;
};

function bearer(req: Request): string | null {
  const h = req.headers.get("authorization");
  if (!h) return null;
  if (!h.toLowerCase().startsWith("bearer ")) return null;
  return h.slice(7).trim() || null;
}

/**
 * Verify the request's Authorization: Bearer <supabase-access-token> header.
 * Returns the user and role on success.
 */
export async function requireUser(req: Request): Promise<AuthOk | AuthErr> {
  const token = bearer(req);
  if (!token) return { ok: false, status: 401, error: "Missing bearer token" };

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return { ok: false, status: 500, error: "Supabase env not configured" };

  const supabase = createClient(url, anon, { auth: { persistSession: false } });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return { ok: false, status: 401, error: "Invalid or expired session" };
  }
  const role =
    (data.user.user_metadata as any)?.role ||
    (data.user.app_metadata as any)?.role ||
    "client";
  return { ok: true, user: { id: data.user.id, email: data.user.email }, role };
}

export async function requireAdmin(req: Request): Promise<AuthOk | AuthErr> {
  const r = await requireUser(req);
  if (!r.ok) return r;
  if (r.role !== "admin" && r.role !== "superadmin") {
    return { ok: false, status: 403, error: "Admin only" };
  }
  return r;
}

export function authErrorResponse(err: AuthErr) {
  return NextResponse.json({ error: err.error }, { status: err.status });
}

// ============================================================
// Simple in-memory token-bucket rate limiter.
// Resets on serverless cold starts — fine for small teams.
// For production scale, swap to Upstash Redis with the same API.
// ============================================================

type Bucket = { tokens: number; lastRefillMs: number };
const buckets = new Map<string, Bucket>();

/**
 * Returns true if the call is allowed and consumes a token.
 * Returns false if the bucket is empty (rate-limited).
 *
 * @param key          stable identity (e.g., user_id, ip)
 * @param capacity     max burst
 * @param refillPerMin tokens regenerated per minute
 */
export function rateLimit(key: string, capacity: number, refillPerMin: number): {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
} {
  const now = Date.now();
  const b = buckets.get(key) ?? { tokens: capacity, lastRefillMs: now };
  const minutesElapsed = (now - b.lastRefillMs) / 60_000;
  b.tokens = Math.min(capacity, b.tokens + minutesElapsed * refillPerMin);
  b.lastRefillMs = now;

  if (b.tokens < 1) {
    buckets.set(key, b);
    const tokensNeeded = 1 - b.tokens;
    const retryAfterSec = Math.ceil((tokensNeeded / refillPerMin) * 60);
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  b.tokens -= 1;
  buckets.set(key, b);
  return {
    allowed: true,
    remaining: Math.floor(b.tokens),
    retryAfterSec: 0,
  };
}

export function rateLimitResponse(retryAfterSec: number) {
  return NextResponse.json(
    { error: "Rate limit exceeded", retry_after_seconds: retryAfterSec },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSec) },
    }
  );
}

// Light periodic cleanup so the in-memory map doesn't grow without bound.
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();
function maybeCleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, b] of buckets) {
    if (now - b.lastRefillMs > 60 * 60 * 1000) buckets.delete(key); // 1h idle
  }
}

export function checkRateLimit(
  key: string,
  capacity: number,
  refillPerMin: number
) {
  maybeCleanup();
  return rateLimit(key, capacity, refillPerMin);
}
