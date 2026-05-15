# Setup steps for new features

Everything that's been built is in code — but two features need you to provision external resources before they activate. Until then, the UI gracefully no-ops (shows a setup card or silently skips).

## 1. Activity Audit Log (1 minute)

Run [master_activity_log.sql](master_activity_log.sql) in your Supabase SQL editor. After that, the **Activity Feed** admin tab and the **Today** dashboard's "Recent activity" panel will start streaming events. The per-client drawer's Activity tab will populate too.

Until you run it, those views show a setup card and `logActivity()` calls silently no-op.

## 2. Push Notifications (5 minutes, requires VAPID keys)

This is what enables:
- Admins get a phone/desktop push when a client opens or replies to a ticket
- Clients get a phone/desktop push when an admin replies or changes ticket status (works on installed iOS/Android PWAs too)

### Steps

**a. Run the SQL migration** — [master_web_push.sql](master_web_push.sql) in Supabase SQL editor. Creates the `web_push_subscriptions` table with RLS.

**b. Generate VAPID keys.** From any machine with Node.js:

```bash
npx web-push generate-vapid-keys
```

That prints a public key and a private key.

**c. Add three env vars** to your `.env.local` (and to Vercel project env for production):

```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<public key from step b>
VAPID_PRIVATE_KEY=<private key from step b>
VAPID_CONTACT_EMAIL=mailto:you@yourdomain.com
```

**d. (Recommended) Add the Supabase service-role key** so the `/api/push` route can dispatch to all admins on new tickets:

```
SUPABASE_SERVICE_ROLE_KEY=<from Supabase dashboard → Project Settings → API → service_role>
```

Without this, push-to-roles (e.g. notify all admins of a new ticket) won't work — but push-to-a-specific-user (e.g. notify the client when admin replies) still will.

**e. Restart your dev server** (`npm run dev`) so the new env vars load.

**f. Test.** In admin, click "Enable Notifications" in the sidebar. Grant permission. You should get a toast saying "Push notifications enabled." Now have someone create a ticket as a client — you should get a notification on your device.

### How to add the "Enable Notifications" button to the client portal too

Currently only the admin sidebar has it. Easiest place: add a button to the portal Settings tab that calls `subscribeToPush()` from `@/lib/push`. Or have me wire it in next session — say "enable push for clients" and I'll add it.

## 3. Slack Webhook (optional, 2 minutes)

The Slack integration was already in place, just polished. To activate:

```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
NEXT_PUBLIC_SITE_URL=https://yourdomain.com   # for the "View" button link
```

Without `SLACK_WEBHOOK_URL` the route silently no-ops, so nothing breaks if you don't set it.

## What's already working without setup

Everything else ships and runs as-is:
- Cmd+K command palette
- Toast notifications
- UserAvatar (gradient + initials fallback)
- Realtime list updates (tickets, tasks, files, boards)
- Realtime ticket/task comment threads
- Skeleton loaders and empty states
- Drag-to-reorder Global Action Queue and tasks
- Kanban view with drag-between-columns status change
- "Today" landing dashboard
- Per-client deep-dive drawer
- Live ticket search
