import { supabase } from "@/lib/supabase";

/**
 * Wraps fetch() with the current Supabase session's access token in the
 * Authorization: Bearer <token> header. Use for calls to our own /api/* routes
 * that require requireUser/requireAdmin.
 */
export async function authFetch(input: string, init?: RequestInit): Promise<Response> {
  const { data: { session } } = await supabase.auth.getSession();
  const headers = new Headers(init?.headers);
  if (session?.access_token) {
    headers.set("Authorization", `Bearer ${session.access_token}`);
  }
  if (!headers.has("Content-Type") && init?.body && typeof init.body === "string") {
    headers.set("Content-Type", "application/json");
  }
  return fetch(input, { ...init, headers });
}
