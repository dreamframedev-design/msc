import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export const runtime = "nodejs";

const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET || "";

function makeAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

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

function verifySlackSignature(rawBody: string, timestamp: string, signature: string): boolean {
  if (!SLACK_SIGNING_SECRET) return false;
  if (!timestamp || !signature) return false;

  // Reject requests older than 5 minutes (replay protection)
  const ts = parseInt(timestamp, 10);
  if (Number.isNaN(ts)) return false;
  const ageSeconds = Math.abs(Math.floor(Date.now() / 1000) - ts);
  if (ageSeconds > 60 * 5) return false;

  const basestring = `v0:${timestamp}:${rawBody}`;
  const expected =
    "v0=" +
    crypto.createHmac("sha256", SLACK_SIGNING_SECRET).update(basestring).digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

function parseFormBody(raw: string): Record<string, string> {
  const params = new URLSearchParams(raw);
  const obj: Record<string, string> = {};
  params.forEach((v, k) => { obj[k] = v; });
  return obj;
}

type ParsedCommand = {
  client: string;
  task: string;
  priority: "Urgent" | "High" | "Normal";
  asTicket: boolean;
};

function parseCommandText(text: string): ParsedCommand | null {
  const trimmed = (text || "").trim();
  if (!trimmed) return null;

  // Flags: !urgent, !high, !ticket
  let priority: ParsedCommand["priority"] = "Normal";
  let asTicket = false;
  const cleaned = trimmed
    .replace(/!urgent\b/gi, () => { priority = "Urgent"; return ""; })
    .replace(/!high\b/gi, () => { priority = priority === "Urgent" ? "Urgent" : "High"; return ""; })
    .replace(/!ticket\b/gi, () => { asTicket = true; return ""; })
    .replace(/\s+/g, " ")
    .trim();

  // Format: "CLIENT: task description"  OR  "CLIENT, task description"
  const separator = cleaned.indexOf(":");
  if (separator === -1) return null;
  const client = cleaned.slice(0, separator).trim();
  const task = cleaned.slice(separator + 1).trim();
  if (!client || !task) return null;
  return { client, task, priority, asTicket };
}

function ephemeral(text: string, blocks?: any[]) {
  return NextResponse.json({
    response_type: "ephemeral",
    text,
    ...(blocks ? { blocks } : {}),
  });
}

async function ensureSlackInboxBoard(supa: ReturnType<typeof makeAdminClient>, createdBy: string) {
  let board: any = null;
  const { data: existing } = await supa
    .from("task_boards")
    .select("*")
    .eq("title", "Slack Inbox")
    .limit(1);
  if (existing && existing.length > 0) {
    board = existing[0];
  } else {
    const { data: created, error } = await supa
      .from("task_boards")
      .insert({ title: "Slack Inbox", created_by: createdBy, client_tag: null })
      .select()
      .single();
    if (error) throw new Error("Couldn't create Slack Inbox board: " + error.message);
    board = created;
  }

  // Auto-share with every admin/superadmin so they all see Slack-dropped tasks,
  // regardless of who originally created the board. Idempotent: upsert ignores
  // existing (board_id, user_id) pairs.
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { data: users } = await supa.auth.admin.listUsers({ perPage: 200 });
      if (users?.users) {
        const adminIds = users.users
          .filter((u) => {
            const role = (u.user_metadata as any)?.role || (u.app_metadata as any)?.role;
            return role === "admin" || role === "superadmin";
          })
          .map((u) => ({ board_id: board.id, user_id: u.id }));
        if (adminIds.length > 0) {
          await supa
            .from("task_board_members")
            .upsert(adminIds, { onConflict: "board_id,user_id", ignoreDuplicates: true });
        }
      }
    } catch {
      // best-effort — don't fail the whole Slack command if member share fails
    }
  }

  return board;
}

async function findAnyAdminUserId(supa: ReturnType<typeof makeAdminClient>): Promise<string | null> {
  // Prefer SLACK_INBOX_CREATED_BY env if set
  const envUid = process.env.SLACK_INBOX_CREATED_BY;
  if (envUid) return envUid;

  // Otherwise pick the first admin/superadmin from auth.users (requires service role)
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  const { data, error } = await supa.auth.admin.listUsers({ perPage: 200 });
  if (error || !data?.users) return null;
  for (const u of data.users) {
    const role = (u.user_metadata as any)?.role || (u.app_metadata as any)?.role;
    if (role === "admin" || role === "superadmin") return u.id;
  }
  return null;
}

async function findClientUserId(
  supa: ReturnType<typeof makeAdminClient>,
  clientHint: string
): Promise<string | null> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  const { data } = await supa.auth.admin.listUsers({ perPage: 1000 });
  if (!data?.users) return null;
  const q = clientHint.toLowerCase();
  // Try exact email, then company tag, then partial email
  let match = data.users.find((u) => u.email?.toLowerCase() === q);
  if (match) return match.id;
  match = data.users.find((u) => ((u.user_metadata as any)?.company || "").toLowerCase() === q);
  if (match) return match.id;
  match = data.users.find((u) => u.email?.toLowerCase().includes(q));
  return match?.id ?? null;
}

export async function POST(req: Request) {
  if (!SLACK_SIGNING_SECRET) {
    return ephemeral(
      "⚠️ Slack command isn't configured yet. Set `SLACK_SIGNING_SECRET` in the app's env and try again."
    );
  }

  const rawBody = await req.text();
  const ts = req.headers.get("x-slack-request-timestamp") || "";
  const sig = req.headers.get("x-slack-signature") || "";

  if (!verifySlackSignature(rawBody, ts, sig)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const body = parseFormBody(rawBody);
  const text = body.text || "";
  const slackUser = body.user_name || "Slack user";
  const command = body.command || "/msc";

  if (!text.trim() || /^help\b/i.test(text)) {
    return ephemeral(
      `*${command} usage:*\n\`${command} <client>: <task>\` — creates an internal task.\n` +
      `Flags: \`!urgent\`, \`!high\`, \`!ticket\` (make it a client-facing ticket).\n` +
      `Example: \`${command} CELLTAXIS: fix homepage hero image !urgent\``
    );
  }

  const parsed = parseCommandText(text);
  if (!parsed) {
    return ephemeral(
      `Couldn't parse that. Format: \`${command} <client>: <task description>\`\nType \`${command} help\` for more.`
    );
  }

  const supa = makeAdminClient();
  const siteUrl = resolveSiteUrl(req);

  const createdBy = await findAnyAdminUserId(supa);
  if (!createdBy) {
    return ephemeral(
      "❌ No admin user found to attribute this task to. Set `SLACK_INBOX_CREATED_BY` env to your admin user UUID."
    );
  }

  if (parsed.asTicket) {
    // Create a client_tickets row attributed to the matched client (or to the inbox owner if no match)
    const clientUserId = (await findClientUserId(supa, parsed.client)) || createdBy;
    const { data: ticket, error } = await supa
      .from("client_tickets")
      .insert({
        client_id: clientUserId,
        title: parsed.task.slice(0, 120),
        description: `_Created via Slack by ${slackUser}._\n\n${parsed.task}`,
        priority: parsed.priority,
        task_type: "General",
        status: "pending",
      })
      .select()
      .single();

    if (error) return ephemeral("❌ Couldn't create ticket: " + error.message);

    return ephemeral(
      `🎟️ *Ticket created* for *${parsed.client}* (${parsed.priority})`,
      [
        {
          type: "section",
          text: { type: "mrkdwn", text: `*${parsed.task}*` },
        },
        {
          type: "context",
          elements: [
            { type: "mrkdwn", text: `Created by ${slackUser} via \`${command}\` · #${ticket.id.substring(0, 6)}` },
          ],
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: { type: "plain_text", text: "Open in Admin", emoji: true },
              url: `${siteUrl}/admin`,
              style: "primary",
            },
          ],
        },
      ]
    );
  }

  // Default: create an admin_tasks row on the Slack Inbox board
  let board;
  try {
    board = await ensureSlackInboxBoard(supa, createdBy);
  } catch (e: any) {
    return ephemeral("❌ " + (e.message ?? "Couldn't ensure Slack Inbox board"));
  }

  const { data: task, error: taskErr } = await supa
    .from("admin_tasks")
    .insert({
      title: parsed.task,
      client_tag: parsed.client,
      created_by: createdBy,
      board_id: board.id,
      status: "pending",
    })
    .select()
    .single();

  if (taskErr) return ephemeral("❌ Couldn't create task: " + taskErr.message);

  // Best-effort activity log (no-op if table missing)
  try {
    await supa.from("activity_log").insert({
      actor_id: createdBy,
      actor_email: `slack:${slackUser}`,
      action: "task.create",
      target_type: "task",
      target_id: task.id,
      target_label: parsed.task,
      metadata: { source: "slack", client_tag: parsed.client, priority: parsed.priority },
    });
  } catch {
    // ignore
  }

  return ephemeral(
    `✅ *Task created* for *${parsed.client}*${parsed.priority !== "Normal" ? ` (${parsed.priority})` : ""}`,
    [
      { type: "section", text: { type: "mrkdwn", text: `*${parsed.task}*` } },
      {
        type: "context",
        elements: [
          { type: "mrkdwn", text: `Created by ${slackUser} via \`${command}\` · in *Slack Inbox* board` },
        ],
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "Open in Admin", emoji: true },
            url: `${siteUrl}/admin`,
            style: "primary",
          },
        ],
      },
    ]
  );
}
