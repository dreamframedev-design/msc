import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";
import { requireUser, authErrorResponse, checkRateLimit, rateLimitResponse } from "@/lib/api-auth";

export const runtime = "nodejs";

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
const VAPID_CONTACT = process.env.VAPID_CONTACT_EMAIL || "mailto:admin@example.com";

let vapidConfigured = false;
if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webpush.setVapidDetails(VAPID_CONTACT, VAPID_PUBLIC, VAPID_PRIVATE);
  vapidConfigured = true;
}

type Body = {
  user_id?: string;
  roles?: ("admin" | "superadmin")[];
  title: string;
  body?: string;
  url?: string;
};

function makeAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(req: Request) {
  const auth = await requireUser(req);
  if (!auth.ok) return authErrorResponse(auth);

  // Clients (non-admins) can only target themselves; admins can target anyone or roles.
  const isAdmin = auth.role === "admin" || auth.role === "superadmin";
  const limit = checkRateLimit(`push:${auth.user.id}`, 30, 30);
  if (!limit.allowed) return rateLimitResponse(limit.retryAfterSec);

  if (!vapidConfigured) {
    // No keys configured — succeed silently so callers don't error.
    return NextResponse.json({ success: true, skipped: "vapid-not-configured" });
  }

  let payload: Body;
  try {
    payload = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Enforce target scope for non-admin callers.
  if (!isAdmin) {
    if (payload.roles && payload.roles.length > 0) {
      return NextResponse.json({ error: "Only admins can target roles" }, { status: 403 });
    }
    if (payload.user_id && payload.user_id !== auth.user.id) {
      return NextResponse.json({ error: "Clients can only push to themselves" }, { status: 403 });
    }
  }

  if (!payload.title) {
    return NextResponse.json({ error: "Missing title" }, { status: 400 });
  }
  if (!payload.user_id && (!payload.roles || payload.roles.length === 0)) {
    return NextResponse.json({ error: "Missing user_id or roles" }, { status: 400 });
  }

  const supa = makeAdminClient();
  const targetUserIds: string[] = [];

  if (payload.user_id) {
    targetUserIds.push(payload.user_id);
  }

  if (payload.roles && payload.roles.length > 0) {
    // Look up users matching the requested roles.
    // Requires SUPABASE_SERVICE_ROLE_KEY for auth.admin.listUsers().
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { data, error } = await supa.auth.admin.listUsers({ perPage: 1000 });
      if (!error && data?.users) {
        for (const u of data.users) {
          const role =
            (u.user_metadata as any)?.role || (u.app_metadata as any)?.role;
          if (role && payload.roles.includes(role)) {
            targetUserIds.push(u.id);
          }
        }
      }
    }
  }

  if (targetUserIds.length === 0) {
    return NextResponse.json({ success: true, delivered: 0, note: "no-recipients" });
  }

  const { data: subs, error: subsErr } = await supa
    .from("web_push_subscriptions")
    .select("*")
    .in("user_id", targetUserIds);

  if (subsErr) {
    return NextResponse.json({ error: subsErr.message }, { status: 500 });
  }
  if (!subs || subs.length === 0) {
    return NextResponse.json({ success: true, delivered: 0, note: "no-subscriptions" });
  }

  const notification = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url,
  });

  const results = await Promise.allSettled(
    subs.map((s) =>
      webpush.sendNotification(
        {
          endpoint: s.endpoint,
          keys: { p256dh: s.p256dh, auth: s.auth },
        },
        notification
      )
    )
  );

  // Clean up subscriptions that came back 404/410 (gone).
  const goneIds: string[] = [];
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      const err: any = r.reason;
      const status = err?.statusCode;
      if (status === 404 || status === 410) {
        goneIds.push(subs[i].id);
      }
    }
  });
  if (goneIds.length > 0) {
    await supa.from("web_push_subscriptions").delete().in("id", goneIds);
  }

  const delivered = results.filter((r) => r.status === "fulfilled").length;
  return NextResponse.json({ success: true, delivered, removed_stale: goneIds.length });
}
