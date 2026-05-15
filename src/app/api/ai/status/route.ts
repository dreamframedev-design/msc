import { NextResponse } from "next/server";
import { requireUser, authErrorResponse } from "@/lib/api-auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const auth = await requireUser(req);
  if (!auth.ok) return authErrorResponse(auth);

  const available = !!process.env.AI_API_KEY;
  return NextResponse.json({
    available,
    model: available ? (process.env.AI_MODEL || "gpt-4o-mini") : null,
  });
}
