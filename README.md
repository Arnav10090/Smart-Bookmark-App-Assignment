# Smart Bookmark App

A real-time bookmark manager built with Next.js and Supabase.

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

### Problem 1: Realtime Updates Not Working
**Issue:** Realtime subscriptions weren't triggering.
**Solution:** Enabled Realtime on the bookmarks table using `ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;`

### Problem 2: Row Level Security
**Issue:** Users could see other users' bookmarks.
**Solution:** Implemented RLS policies filtering by `auth.uid() = user_id`.

## Features
- Google OAuth authentication
- Private bookmarks per user
- Real-time updates without page refresh
- Add/delete bookmarks
- Responsive design

## Tech Stack
- Next.js 16 (App Router)
- Supabase (Auth, Database, Realtime)
- Tailwind CSS