# Platform Enhancement & Ecosystem Expansion Directive

## Context & Current State
You are an expert AI software architect and senior full-stack developer (Next.js 14 App Router, Supabase, Tailwind CSS, Framer Motion). 

We have built a comprehensive, custom Client Portal and Internal Admin System. Our goal is to transform this platform into a master-class ecosystem that is visually stunning, highly performant, and incredibly intuitive for both our agency admins and our clients.

### What We Have Built So Far:
1. **Ticketing System (Global Action Queue):** Clients submit tickets; admins manage, comment on, and resolve them. Integrated with Slack webhooks for instant notifications.
2. **Project Boards (Task Management):** A robust task management system for admins. Features multiple boards, granular permissions (private, shared with clients), drag-and-drop board reordering, sidebar quick-shortcuts, and public read-only links.
3. **Advanced File Vault:** Secure file storage with folder structures, drag-and-drop uploads, image preview modals, and a 3-tier RLS visibility system (Internal Only, Global/All Clients, Specific Client/Company).
4. **User & Access Management:** Dedicated admin views to create users on-the-fly, assign company tags, and modify roles (Client, Admin, Master Admin). Includes a powerful "View As Client" impersonation feature.
5. **Client Onboarding & PWA:** A secure passphrase-protected onboarding flow (`/msconboarding2026`) that guides clients through creating their account and installing the portal as a Progressive Web App (PWA) on iOS/Android.
6. **UI/UX Foundation:** A dark-themed, modern aesthetic utilizing Tailwind CSS and basic Framer Motion animations.

---

## Your Mission
Your directive is to critically review the entire codebase and architecture, then propose and implement enhancements. We are looking for **"Big Brain" Major Wins** that add massive value to the business, as well as **Minor UI/UX Polish** that elevates the platform to an enterprise-grade standard.

When we ask you to execute on this directive, you should evaluate the codebase, suggest a prioritized roadmap from the ideas below (or your own additions), and execute them masterfully.

### Phase 1: "Big Brain" Major Wins & Platform Ecosystem Growth
*Identify areas where the platform can become a fully self-sufficient agency OS.*

1. **Native PWA Push Notifications & WebSockets:**
   - Upgrade the current Slack-only notification system to include native Web Push API notifications for installed PWAs.
   - Implement Supabase Realtime for live updates (e.g., when an admin replies to a ticket, the client's screen updates instantly without refreshing).
2. **Secure "File Requests" Engine:**
   - Build a feature allowing admins to generate a secure, one-off "File Request" link to send to clients via email or text. Clients can upload requested documents directly into the correct Vault folder without needing to navigate the portal.
3. **Global `Cmd+K` Command Palette:**
   - Implement a fast, keyboard-driven search (using a library like `cmdk`) allowing admins to instantly jump to specific clients, tickets, project boards, or settings.
4. **Integrated Agency Billing / Invoicing (Stripe):**
   - Add a "Billing" tab for clients to view active subscriptions, pay invoices, and update payment methods via Stripe Customer Portal integration.
5. **Activity Feed & Audit Logging:**
   - Create a system-wide audit log for Master Admins to see exactly "Who did what, and when" (e.g., "Admin X downloaded File Y", "Client Z created a ticket").
6. **Email Integration Engine:**
   - Integrate a transactional email provider (like Resend) to automatically email clients when their tickets are updated, when tasks are completed, or when new files are shared.

### Phase 2: Master-Level UI/UX Polish & Minor Enhancements
*Elevate the visual hierarchy, micro-interactions, and usability.*

1. **Rich Text Editing:**
   - Replace basic `<textarea>` inputs for Task descriptions, Ticket details, and Comments with a sleek Rich Text Editor (e.g., TipTap or Novel), supporting markdown, lists, and inline code.
2. **Advanced Micro-Interactions & Framer Motion:**
   - Add skeleton loaders for all data fetching (Task Boards, File Vault, Tickets) to eliminate layout shift.
   - Implement highly polished success states (e.g., a satisfying micro-animation when checking off a task).
   - Smooth out modal enter/exit animations.
3. **Data Visualization & Metrics:**
   - Expand the Admin Dashboard with dynamic charts (using Recharts) showing Ticket resolution times, active projects vs. completed projects, and client engagement metrics.
4. **Custom Avatars & Profile Polish:**
   - Allow users to upload profile pictures to Supabase Storage, replacing the default letter avatars across comments, tasks, and headers.
5. **Drag-and-Drop Task Reordering:**
   - We have drag-and-drop for board selection; extend this capability so admins can reorder individual tasks within a Project Board.

---

## Execution Guidelines
- **Maintain Current Aesthetics:** Keep the sleek, dark-mode, minimal aesthetic. Do not introduce clashing UI libraries; build custom components using Tailwind and our existing Shadcn-like patterns.
- **Security First (RLS):** Every new feature (especially File Requests and Auditing) must have bulletproof Supabase Row Level Security policies. Never bypass RLS in the client.
- **Component Componentization:** If a file (like `admin/page.tsx`) gets too large, refactor it by breaking it down into smaller, highly cohesive components in a `src/components/admin/` directory.
- **Always Wrap Long Text:** Ensure UI resilience. If users input massive unbroken strings, the UI must wrap gracefully (using `break-words whitespace-pre-wrap` or `truncate` appropriately).

**Let's build the ultimate agency operating system.**