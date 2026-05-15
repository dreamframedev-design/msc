import { NextResponse } from "next/server";
import { chat } from "@/lib/ai";
import { requireAdmin, authErrorResponse, checkRateLimit, rateLimitResponse } from "@/lib/api-auth";

export const runtime = "nodejs";

type Body = {
  subject?: string;
  description?: string;
  thread?: { author: string; content: string; role?: "client" | "admin" }[];
};

export async function POST(req: Request) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return authErrorResponse(auth);

  const limit = checkRateLimit(`ai-summarize:${auth.user.id}`, 10, 10);
  if (!limit.allowed) return rateLimitResponse(limit.retryAfterSec);

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const subject = body.subject || "(no subject)";
  const description = body.description || "";
  const thread = body.thread || [];

  const transcript = thread
    .map((m) => `${m.role === "admin" ? "MSC" : "Client"} (${m.author}): ${m.content}`)
    .join("\n");

  const sys = `You summarize support ticket threads for an internal team.
Output exactly three sections, no preamble:

**TL;DR:** one sentence capturing the core ask or status.
**Key points:** bullet list, 2-5 items, factual.
**Next step:** one sentence — what should MSC do next?

Be concise. No filler. If the thread is short, still produce the three sections.`;

  const user = `Subject: ${subject}

Description: ${description || "(none)"}

${transcript ? `Conversation:\n${transcript}` : "(no messages yet)"}

Summarize.`;

  const result = await chat({
    messages: [
      { role: "system", content: sys },
      { role: "user", content: user },
    ],
    temperature: 0.3,
    maxTokens: 350,
  });

  if (!result.ok) {
    if (result.reason === "no-key") {
      return NextResponse.json(
        { error: "AI not configured. Set AI_API_KEY (and optionally AI_BASE_URL / AI_MODEL) in env." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: `AI error (${result.reason})`, detail: result.detail, status: result.status },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, summary: result.text, model: result.model });
}
