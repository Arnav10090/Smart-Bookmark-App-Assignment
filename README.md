# Smart Bookmark App

A real-time bookmark manager built with Next.js and Supabase.

## Live Demo
[Your Vercel URL]

## Features
- Google OAuth authentication
- Private bookmarks per user
- Real-time updates across tabs
- Add/delete bookmarks
- Responsive design

## Tech Stack
- Next.js 14 (App Router)
- Supabase (Auth, Database, Realtime)
- Tailwind CSS

## Problems & Solutions

### Problem 1: Cookie Handling in Next.js 15
**Issue:** Next.js 15 made cookies() async, causing errors.
**Solution:** Used `await cookies()` in server components and middleware.

### Problem 2: Realtime Updates Not Working
**Issue:** Realtime subscriptions weren't triggering.
**Solution:** Enabled Realtime on the bookmarks table using `ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;`

### Problem 3: Row Level Security
**Issue:** Users could see other users' bookmarks.
**Solution:** Implemented RLS policies filtering by `auth.uid() = user_id`.
# Smart Bookmark App

A real-time bookmark manager built with Next.js and Supabase.

## Live Demo
Replace this with your Vercel or hosting URL if available.

## Features
- Google OAuth authentication
- Private bookmarks per user
- Real-time updates across tabs
- Add/delete bookmarks
- Responsive design

## Tech Stack
- Next.js 16 (App Router)
- Supabase (Auth, Database, Realtime)
- Tailwind CSS

## Problems & Solutions

### Cookie handling in recent Next.js versions
Server-side cookie helpers are async in recent Next.js versions — use `await cookies()` in server components and middleware where needed.

### Realtime updates not appearing across tabs
If cross-tab realtime updates don't appear, ensure the `bookmarks` table is included in the `supabase_realtime` publication (schema-qualified). Example:

```sql
-- Add table to the publication (run once)
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmarks;

-- Verify membership
SELECT schemaname, tablename, pubname
FROM pg_publication_tables
WHERE tablename = 'bookmarks';
```

Wait ~10–60 seconds after making changes in the dashboard or running the SQL for replication to propagate.

Also ensure both tabs are logged in to the same user session (the client filters realtime events by `user.id`).

### Row Level Security
Example RLS policy used by the app:

```sql
CREATE POLICY "Allow logged-in users access to their bookmarks"
  ON public.bookmarks
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### Google OAuth callback
Auth callback is handled in `/auth/callback/route.js` to exchange the code and complete sign-in.

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env.local` and set the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (only if needed server-side)
```

4. Run development server: `npm run dev`

## Database Schema
The app expects the `bookmarks` table to provide defaults for `id` and `created_at`.
```sql
-- Enable required extension (if using pgcrypto)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE public.bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  title text NOT NULL,
  url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

If `gen_random_uuid()` is not available, use `uuid_generate_v4()` and enable the `uuid-ossp` extension instead.

## Realtime troubleshooting checklist
- Verify `public.bookmarks` is part of `supabase_realtime` (see SQL above).
- Open DevTools → Network → WS in the receiving tab and watch incoming messages for `postgres_changes` when you insert/delete in another tab.
- Confirm both tabs show the same `user.id` in the console logs printed by the app.

## Video walkthrough (optional)
The repository contains a short script for a demo video showing authentication, adding/removing bookmarks, and realtime updates. Update or remove the script as needed.

## License
MIT