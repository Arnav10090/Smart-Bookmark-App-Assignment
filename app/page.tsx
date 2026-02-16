import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BookmarkApp from '@/components/BookmarkApp.js'
import LoginButton from '@/components/LoginButton'

export default async function Home() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-md w-full border border-gray-100">
          <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Smart Bookmark App</h1>
          <p className="text-gray-500 mb-8">Save and organize your bookmarks</p>
          <LoginButton />
        </div>
      </div>
    )
  }

  return <BookmarkApp user={user} />
}