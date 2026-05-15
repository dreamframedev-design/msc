# Setup steps for the platform

The code is fully built — but several features need you to provision external resources before they activate. Until then everything no-ops gracefully (setup card, silent skip, etc.).

Everything below is one-time setup. After it's done, you don't touch it again.

---

## ✅ Already done

You ran `master_activity_log.sql` → audit log is live.
You ran `master_web_push.sql` + `fix_web_push_update_policy.sql` → push table is live.
You generated VAPID keys → push from server is signed.

---

## 1. Slack slash command (`/msc client: task`)

**The goal:** your boss types `/msc CELLTAXIS: fix the homepage hero !urgent` in Slack and a task appears in the **Slack Inbox** board in the admin portal.

### What you do

**a. In Slack — add a slash command to your app.**

Go to <https://api.slack.com/apps> → click your existing MSC app (the same one with your webhook) → **Slash Commands** → **Create New Command**.

Fill in:
- **Command:** `/msc`
- **Request URL:** `https://yourdomain.com/api/slack/command` (must be public; for local testing use ngrok)
- **Short description:** `Create a task in the MSC admin portal`
- **Usage hint:** `<client>: <task description> [!urgent|!high|!ticket]`

Save. Reinstall the app to your workspace if it asks.

**b. Get your Slack signing secret.**

In the same app config → **Basic Information** → scroll to **App Credentials** → copy **Signing Secret**.

**c. Add env vars** to `.env.local` (and to your Vercel project env for production):

```
SLACK_SIGNING_SECRET=<paste it here>

# Required so the Slack route can write tasks bypassing RLS:
SUPABASE_SERVICE_ROLE_KEY=<from Supabase Dashboard → Project Settings → API → service_role>

# Optional — UUID of the admin user that "owns" Slack-created tasks.
# If unset, the route picks the first admin/superadmin it finds.
# SLACK_INBOX_CREATED_BY=
```

**d. Restart your dev server** (or redeploy on Vercel).

### How to use it

```
/msc CELLTAXIS: fix the homepage hero
/msc CELLTAXIS: critical bug on checkout !urgent
/msc CELLTAXIS: rebuild contact page !high
/msc CELLTAXIS: please update the team page !ticket
/msc help
```

- Default: creates an **internal task** on the auto-created "Slack Inbox" board.
- `!urgent` / `!high`: sets priority on the resulting ticket (only matters with `!ticket`).
- `!ticket`: makes it a client-facing ticket instead of an internal task.
- The board "Slack Inbox" auto-creates on first use.

Slack will reply ephemerally (only your boss sees it) with a confirmation and an "Open in Admin" button that deep-links to /admin.

---

## 2. AI ticket assist (Suggest reply + Summarize thread)

**The goal:** when you open a ticket or task chat in /admin, two buttons appear above the reply input:
- **✨ Suggest reply** — drafts a reply based on the conversation, fills the input. You edit + send.
- **✨ Summarize thread** — pops a modal with TL;DR + key points + next step.

### What you do

Pick one path:

#### Path A — Vercel AI Gateway (recommended if you're deploying to Vercel)

Get a Gateway key: <https://vercel.com/dashboard/ai-gateway>.

Add to `.env.local`:

```
AI_API_KEY=<your Vercel AI Gateway key>
AI_BASE_URL=https://gateway.ai.vercel.app/v1
AI_MODEL=openai/gpt-4o-mini
```

#### Path B — OpenAI directly

Get a key: <https://platform.openai.com/api-keys>.

Add to `.env.local`:

```
AI_API_KEY=sk-...
AI_MODEL=gpt-4o-mini
```

(Omit `AI_BASE_URL` — it defaults to OpenAI.)

#### Path C — Anthropic (uses OpenAI-compat endpoint)

```
AI_API_KEY=sk-ant-...
AI_BASE_URL=https://api.anthropic.com/v1/openai
AI_MODEL=claude-3-5-sonnet-20241022
```

Restart dev server. Open any ticket → two new buttons appear above the input. That's it.

---

## 3. Optional Slack production URL

So the "Open in Admin" / "View" buttons in Slack messages point to production instead of localhost:

```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## All the env vars in one place

Copy this template into `.env.local` (skip the ones you don't need):

```
# Supabase (you already have these)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Push (already set)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_CONTACT_EMAIL=mailto:you@example.com

# Required for Slack /msc and full push fan-out:
SUPABASE_SERVICE_ROLE_KEY=

# Slack
SLACK_WEBHOOK_URL=
SLACK_SIGNING_SECRET=
# SLACK_INBOX_CREATED_BY=  (optional, defaults to first admin)

# AI assist
AI_API_KEY=
# AI_BASE_URL=https://gateway.ai.vercel.app/v1
# AI_MODEL=openai/gpt-4o-mini

# Production base URL (used by Slack and push notification links)
NEXT_PUBLIC_SITE_URL=
```
