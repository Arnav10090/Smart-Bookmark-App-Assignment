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

### Problem 4: Google OAuth Redirect
**Issue:** Auth callback wasn't working after Google login.
**Solution:** Created `/auth/callback/route.js` to handle OAuth code exchange.

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env.local` with Supabase credentials
4. Run development server: `npm run dev`

## Database Schema
```sql
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP
);
```

## License
MIT
```

---

## 🎥 Video Walkthrough Script

### Part 1: Overall Approach (2-3 min)
```
"Hi! Today I'll walk you through my Smart Bookmark App.

My approach was to build this in layers:
1. First, set up authentication with Supabase
2. Then, create the database with proper security
3. Next, build the UI components
4. Finally, add real-time functionality

Let me show you the file structure..."
[Show folder structure]
```

### Part 2: Authentication & Privacy (3-4 min)
```
"For authentication, I used Supabase Auth with Google OAuth only.

[Show lib/supabase/client.js and server.js]
I created two Supabase clients - one for client-side and one for server-side.

[Show middleware.js]
The middleware refreshes the auth session on every request.

[Show LoginButton.js]
When users click login, they're redirected to Google OAuth.

For privacy, I used Row Level Security in Supabase.
[Show SQL policies in README]
These policies ensure users can only see their own bookmarks.
Each query automatically filters by user_id = auth.uid()."
```

### Part 3: Real-time Updates (3-4 min)
```
"Real-time is handled using Supabase Realtime.

[Show BookmarkApp.js - useEffect]
When the component mounts, I subscribe to changes on the bookmarks table,
filtered by the current user's ID.

[Show handleRealtimeEvent function]
When an INSERT event happens, I add the new bookmark to state.
When a DELETE event happens, I filter it out.

This means if I open two tabs... [Demo]
...adding a bookmark in one tab instantly appears in the other!"
```

### Part 4: Demo (2-3 min)
```
"Let me demonstrate:
1. Login with Google [show]
2. Add a bookmark [show]
3. Open second tab [show real-time update]
4. Delete bookmark [show it disappears in both tabs]
5. Logout and login with different account [show data isolation]"