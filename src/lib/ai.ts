// Provider-agnostic OpenAI-compatible chat completions wrapper.
//
// Works with:
//   - OpenAI:        AI_BASE_URL unset, AI_API_KEY = sk-...
//   - Vercel AI Gateway: AI_BASE_URL=https://gateway.ai.vercel.app/v1, AI_API_KEY=<gateway key>
//   - Anthropic via OpenAI-compat:  AI_BASE_URL=https://api.anthropic.com/v1/openai/, AI_API_KEY=sk-ant-...
//   - Together / Groq / etc — any OpenAI-compatible endpoint.

const DEFAULT_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_MODEL = "gpt-4o-mini";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export type ChatOptions = {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
};

export type ChatResult =
  | { ok: true; text: string; model: string }
  | { ok: false; reason: "no-key" | "http" | "parse" | "network"; status?: number; detail?: string };

export async function isAiConfigured(): Promise<boolean> {
  return !!process.env.AI_API_KEY;
}

export async function chat(opts: ChatOptions): Promise<ChatResult> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) return { ok: false, reason: "no-key" };

  const baseUrl = (process.env.AI_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
  const model = process.env.AI_MODEL || DEFAULT_MODEL;

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: opts.messages,
        temperature: opts.temperature ?? 0.4,
        max_tokens: opts.maxTokens ?? 600,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return { ok: false, reason: "http", status: res.status, detail: detail.slice(0, 500) };
    }

    const json = (await res.json().catch(() => null)) as any;
    const text = json?.choices?.[0]?.message?.content;
    if (typeof text !== "string") {
      return { ok: false, reason: "parse", detail: "No content in response" };
    }
    return { ok: true, text: text.trim(), model };
  } catch (e: any) {
    return { ok: false, reason: "network", detail: e?.message ?? "unknown" };
  }
}
