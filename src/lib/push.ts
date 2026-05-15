import { supabase } from "@/lib/supabase";
import { authFetch } from "@/lib/auth-fetch";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

export type SubscribeResult =
  | { ok: true; renewed: boolean }
  | { ok: false; reason: "unsupported" | "permission-denied" | "no-vapid" | "no-user" | "error"; detail?: string };

/**
 * Subscribe the current user to Web Push notifications.
 * Requires NEXT_PUBLIC_VAPID_PUBLIC_KEY in env.
 * Caller should have already obtained user permission via Notification.requestPermission().
 */
export async function subscribeToPush(): Promise<SubscribeResult> {
  if (typeof window === "undefined") return { ok: false, reason: "unsupported" };
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return { ok: false, reason: "unsupported" };
  }
  if (Notification.permission !== "granted") {
    return { ok: false, reason: "permission-denied" };
  }
  const vapid = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!vapid) return { ok: false, reason: "no-vapid" };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "no-user" };

  try {
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    let renewed = false;
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapid) as BufferSource,
      });
    } else {
      renewed = true;
    }

    const json: any = sub.toJSON();
    const endpoint: string = json.endpoint;
    const p256dh: string = json.keys?.p256dh;
    const auth: string = json.keys?.auth;
    if (!endpoint || !p256dh || !auth) {
      return { ok: false, reason: "error", detail: "missing-subscription-keys" };
    }

    // Upsert by (user_id, endpoint)
    const { error } = await supabase.from("web_push_subscriptions").upsert(
      {
        user_id: user.id,
        endpoint,
        p256dh,
        auth,
        user_agent: navigator.userAgent,
        last_used_at: new Date().toISOString(),
      },
      { onConflict: "user_id,endpoint" }
    );

    if (error) return { ok: false, reason: "error", detail: error.message };
    return { ok: true, renewed };
  } catch (e: any) {
    return { ok: false, reason: "error", detail: e?.message ?? "unknown" };
  }
}

export async function unsubscribeFromPush(): Promise<void> {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();
  if (!sub) return;
  const endpoint = sub.endpoint;
  await sub.unsubscribe();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase
      .from("web_push_subscriptions")
      .delete()
      .eq("user_id", user.id)
      .eq("endpoint", endpoint);
  }
}

/**
 * Dispatches a push to a user by id via the /api/push route.
 * Safe to call even if push isn't configured — the route no-ops.
 */
export async function sendPush(
  userId: string,
  payload: { title: string; body?: string; url?: string }
): Promise<void> {
  try {
    await authFetch("/api/push", {
      method: "POST",
      body: JSON.stringify({ user_id: userId, ...payload }),
    });
  } catch {
    // fire-and-forget
  }
}

export async function sendPushToRoles(
  roles: ("admin" | "superadmin")[],
  payload: { title: string; body?: string; url?: string }
): Promise<void> {
  try {
    await authFetch("/api/push", {
      method: "POST",
      body: JSON.stringify({ roles, ...payload }),
    });
  } catch {
    // fire-and-forget
  }
}
