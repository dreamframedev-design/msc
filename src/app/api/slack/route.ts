import { NextResponse } from 'next/server';
import { requireUser, authErrorResponse, checkRateLimit, rateLimitResponse } from "@/lib/api-auth";

export const runtime = "nodejs";

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || "";

type SlackEvent =
  | {
      kind: "ticket.created";
      ticketId: string;
      title: string;
      description: string;
      priority: string;
      clientEmail: string;
    }
  | {
      kind: "ticket.commented";
      ticketId: string;
      title: string;
      author: string;
      preview: string;
      clientEmail?: string;
    }
  | {
      kind: "ticket.status";
      ticketId: string;
      title: string;
      author: string;
      newStatus: string;
    };

function resolveSiteUrl(req: Request): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (env) return env.replace(/\/$/, "");
  try {
    const u = new URL(req.url);
    return `${u.protocol}//${u.host}`;
  } catch {
    return "http://localhost:3000";
  }
}

function buildBlocks(event: SlackEvent, adminUrl: string) {
  if (event.kind === "ticket.created") {
    const emoji = event.priority === "Urgent" ? "🚨" : event.priority === "High" ? "⚠️" : "📥";
    return [
      {
        type: "header",
        text: { type: "plain_text", text: `${emoji} New Support Ticket: ${event.priority} Priority`, emoji: true },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Client:*\n${event.clientEmail}` },
          { type: "mrkdwn", text: `*Subject:*\n${event.title}` },
        ],
      },
      { type: "section", text: { type: "mrkdwn", text: `*Description:*\n${event.description}` } },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "View in Admin Portal", emoji: true },
            url: adminUrl,
            style: "primary",
          },
        ],
      },
    ];
  }

  if (event.kind === "ticket.commented") {
    return [
      {
        type: "header",
        text: { type: "plain_text", text: `💬 New reply on ticket`, emoji: true },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Subject:*\n${event.title}` },
          { type: "mrkdwn", text: `*From:*\n${event.author}` },
        ],
      },
      { type: "section", text: { type: "mrkdwn", text: `*Preview:*\n${event.preview}` } },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "Open Ticket", emoji: true },
            url: adminUrl,
            style: "primary",
          },
        ],
      },
    ];
  }

  // ticket.status
  const map: Record<string, string> = {
    pending: "↩️ Reopened",
    in_progress: "▶️ Started",
    completed: "✅ Resolved",
    review: "👀 Up for review",
  };
  const verb = map[event.newStatus] ?? `Status changed to ${event.newStatus}`;
  return [
    {
      type: "header",
      text: { type: "plain_text", text: `${verb}: ${event.title}`, emoji: true },
    },
    {
      type: "context",
      elements: [{ type: "mrkdwn", text: `By *${event.author}*` }],
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "Open Ticket", emoji: true },
          url: adminUrl,
        },
      ],
    },
  ];
}

export async function POST(req: Request) {
  const auth = await requireUser(req);
  if (!auth.ok) return authErrorResponse(auth);

  const limit = checkRateLimit(`slack-notify:${auth.user.id}`, 30, 30);
  if (!limit.allowed) return rateLimitResponse(limit.retryAfterSec);

  if (!SLACK_WEBHOOK_URL) {
    // Quietly succeed when not configured so callers don't error.
    return NextResponse.json({ success: true, skipped: "slack-not-configured" });
  }

  try {
    const payload = (await req.json()) as Partial<SlackEvent> & Record<string, unknown>;
    const siteUrl = resolveSiteUrl(req);
    const adminUrl = `${siteUrl}/admin`;

    // Backwards-compat with the original ticket-creation payload that didn't include a `kind`.
    const event: SlackEvent =
      (payload as any).kind
        ? (payload as SlackEvent)
        : {
            kind: "ticket.created",
            ticketId: String(payload.ticketId ?? ""),
            title: String(payload.title ?? "Untitled"),
            description: String(payload.description ?? ""),
            priority: String(payload.priority ?? "Normal"),
            clientEmail: String(payload.clientEmail ?? "Unknown"),
          };

    const blocks = buildBlocks(event, adminUrl);

    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blocks }),
    });

    if (!response.ok) {
      throw new Error(`Slack API responded with ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Slack notification error:", error);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
