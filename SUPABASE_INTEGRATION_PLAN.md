# Supabase Integration Plan for Mighty Spark Communications

This document outlines the "simple, direct, but robust" path to integrating your existing Supabase account to power both the **Client Portal (Tickets)** and the **Internal Admin System (News Articles)**.

By using Supabase for both, you keep everything in one unified system, reducing complexity and maintenance.

## 1. Database Schema Setup

You will need to create two primary tables in your Supabase project. You can run these SQL commands in the Supabase SQL Editor.

### Table: `news_articles`
This table will store the news articles created by the CEO.

```sql
CREATE TABLE news_articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL, -- Can store Markdown or HTML
  image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to articles
CREATE POLICY "Public can view published articles" 
ON news_articles FOR SELECT 
USING (true);

-- Allow only authenticated admins to insert/update/delete
CREATE POLICY "Admins can manage articles" 
ON news_articles FOR ALL 
USING (auth.jwt() ->> 'role' = 'admin');
```

### Table: `client_tickets`
This table will store the website update requests submitted by clients.

```sql
CREATE TABLE client_tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  task_type TEXT NOT NULL,
  priority TEXT NOT NULL,
  url TEXT,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, in_progress, completed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE client_tickets ENABLE ROW LEVEL SECURITY;

-- Clients can only view their own tickets
CREATE POLICY "Clients can view own tickets" 
ON client_tickets FOR SELECT 
USING (auth.uid() = client_id);

-- Clients can create tickets
CREATE POLICY "Clients can create tickets" 
ON client_tickets FOR INSERT 
WITH CHECK (auth.uid() = client_id);

-- Admins can view and update all tickets
CREATE POLICY "Admins can manage all tickets" 
ON client_tickets FOR ALL 
USING (auth.jwt() ->> 'role' = 'admin');
```

## 2. Authentication & Roles

Supabase handles authentication out of the box. To differentiate between a "Client" and an "Admin" (like the CEO):

1. **Clients**: When a client signs up or is invited, they get a standard user account.
2. **Admins**: You can assign an `admin` role to the CEO's account. This is typically done by updating the user's `app_metadata` or `user_metadata` in Supabase, or by creating a separate `user_roles` table.

A simple way using `user_metadata`:
```javascript
// Example of setting admin role (usually done via Supabase dashboard or secure backend)
const { data, error } = await supabase.auth.admin.updateUserById(
  'ceo-user-id',
  { user_metadata: { role: 'admin' } }
)
```

## 3. Connecting the Next.js App to Supabase

1. **Install Supabase Client**:
   ```bash
   npm install @supabase/supabase-js @supabase/ssr
   ```

2. **Environment Variables**:
   Add your Supabase credentials to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Update Data Fetching**:
   - In `src/app/news/page.tsx`, replace the static `articles` array with a Supabase fetch call:
     ```javascript
     const { data: articles } = await supabase.from('news_articles').select('*').order('published_at', { ascending: false });
     ```
   - In `src/components/admin/NewsEditor.tsx`, update the `handleSave` function to insert/update the `news_articles` table.

## 4. Next Steps for Implementation

The UI for both the Client Portal and the Admin News Editor is already built and ready. Once you connect Supabase:
1. Wire up the login form in `/portal` to `supabase.auth.signInWithPassword()`.
2. Wire up the Ticket submission form in `/portal/dashboard` to insert into `client_tickets`.
3. Wire up the News Editor in `/admin/news/create` to insert into `news_articles`.

This approach gives you a highly robust, secure, and scalable backend without the overhead of managing a separate CMS like Sanity alongside your client portal database. Everything lives in one place.