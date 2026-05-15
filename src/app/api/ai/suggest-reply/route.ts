import { NextResponse } from "next/server";
import { chat } from "@/lib/ai";
import { requireAdmin, authErrorResponse, checkRateLimit, rateLimitResponse } from "@/lib/api-auth";

export const runtime = "nodejs";

type Body = {
  subject?: string;
  description?: string;
  thread?: { author: string; content: string; role?: "client" | "admin" }[];
  tone?: "professional" | "friendly" | "concise";
  context?: string; // extra company-specific context, optional
};

export async function POST(req: Request) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return authErrorResponse(auth);

  const limit = checkRateLimit(`ai-suggest:${auth.user.id}`, 10, 10);
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
  const tone = body.tone || "professional";

  const transcript = thread
    .map((m) => `${m.role === "admin" ? "MSC" : "Client"} (${m.author}): ${m.content}`)
    .join("\n");

  const sys = `You are drafting a reply on behalf of MSC Support, an agency that builds and maintains websites and digital products for clients.
Write as MSC speaking TO the client. Tone: ${tone}. Be ${tone === "concise" ? "extremely brief — 1-3 sentences" : "warm, clear, and direct — 2-5 sentences"}.
Never invent facts about deadlines, fees, or capabilities. If you don't know something, say you'll check and follow up.
Don't sign the message. Don't add subject lines. Just the reply text.`;

  const user = `Ticket subject: ${subject}

Original ticket description:
${description || "(none)"}

${transcript ? `Conversation so far:\n${transcript}\n` : ""}
Draft a reply now.`;

  const result = await chat({
    messages: [
      { role: "system", content: sys },
      { role: "user", content: user },
    ],
    temperature: 0.6,
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

  return NextResponse.json({ ok: true, reply: result.text, model: result.model });
}
