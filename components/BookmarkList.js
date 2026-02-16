'use client'

import { createClient } from '@/lib/supabase/client'

export default function BookmarkList({ bookmarks, loading, onBookmarkDeleted }) {
  const supabase = createClient()

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this bookmark?')) {
      return
    }

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error deleting bookmark: ' + error.message)
      console.error('Delete error:', error)
    } else {
      console.log('Bookmark deleted successfully:', id)
      
      // Immediately update the UI in the current tab
      if (onBookmarkDeleted) {
        onBookmarkDeleted(id)
      }
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-gray-100">
        <p className="text-gray-400">Loading bookmarks...</p>
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-gray-100">
        <p className="text-gray-400">No bookmarks yet. Add your first one!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">
        Your Bookmarks ({bookmarks.length})
      </h2>
      <div className="space-y-3">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50/80 transition-colors duration-150"
          >
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{bookmark.title}</h3>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 hover:underline text-sm"
              >
                {bookmark.url}
              </a>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(bookmark.created_at).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleDelete(bookmark.id)}
              className="ml-4 text-gray-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 cursor-pointer"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}