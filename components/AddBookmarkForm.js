'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AddBookmarkForm({ userId, onBookmarkAdded }) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim() || !url.trim()) {
      alert('Please fill in both fields')
      return
    }

    setLoading(true)

    const { data, error } = await supabase
      .from('bookmarks')
      .insert([
        {
          user_id: userId,
          title: title.trim(),
          url: url.trim(),
        },
      ])
      .select()

    if (error) {
      alert('Error adding bookmark: ' + error.message)
      console.error('Insert error:', error)
    } else {
      console.log('Bookmark inserted successfully:', data)
      setTitle('')
      setUrl('')
      
      // Immediately update the UI in the current tab
      if (data && data[0] && onBookmarkAdded) {
        onBookmarkAdded(data[0])
      }
    }

    setLoading(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">Add New Bookmark</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Google"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none bg-gray-50/50 text-black"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://google.com"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none bg-gray-50/50 text-black"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl disabled:opacity-50 transition-colors duration-200 cursor-pointer"
        >
          {loading ? 'Adding...' : 'Add Bookmark'}
        </button>
      </form>
    </div>
  )
}