'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import BookmarkList from './BookmarkList'
import AddBookmarkForm from './AddBookmarkForm'

export default function BookmarkApp({ user }) {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  const handleRealtimeEvent = useCallback((payload) => {
    try {
      console.log('Real-time event received:', payload)
      
      // Validate payload structure
      if (!payload || !payload.eventType) {
        console.error('Invalid payload structure:', payload)
        return
      }
      
      if (payload.eventType === 'INSERT') {
        if (!payload.new || !payload.new.id) {
          console.error('INSERT event missing new record:', payload)
          return
        }
        
        // Filter by user_id in the handler
        if (payload.new.user_id !== user.id) {
          console.log('Ignoring INSERT for different user')
          return
        }
        
        // Add duplicate prevention
        setBookmarks((current) => {
          if (current.some(b => b.id === payload.new.id)) {
            console.log('Duplicate bookmark detected, skipping INSERT')
            return current
          }
          return [payload.new, ...current]
        })
      } else if (payload.eventType === 'DELETE') {
        if (!payload.old || !payload.old.id) {
          console.error('DELETE event missing old record:', payload)
          return
        }
        
        // Filter by user_id in the handler
        if (payload.old.user_id !== user.id) {
          console.log('Ignoring DELETE for different user')
          return
        }
        
        setBookmarks((current) =>
          current.filter((bookmark) => bookmark.id !== payload.old.id)
        )
      }
    } catch (error) {
      console.error('Error processing real-time event:', error, payload)
    }
  }, [user.id])

  const addBookmarkToList = useCallback((bookmark) => {
    setBookmarks((current) => {
      if (current.some(b => b.id === bookmark.id)) {
        return current
      }
      return [bookmark, ...current]
    })
  }, [])

  const removeBookmarkFromList = useCallback((bookmarkId) => {
    setBookmarks((current) => current.filter((bookmark) => bookmark.id !== bookmarkId))
  }, [])

  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error) {
      setBookmarks(data || [])
    }
    setLoading(false)
  }

  // Fetch bookmarks on mount
  useEffect(() => {
    fetchBookmarks()
    
    console.log('Setting up real-time subscription for user:', user.id)
    
    // Set up realtime subscription with unique channel name per tab
    const channel = supabase
      .channel(`bookmarks-${user.id}-${crypto.randomUUID()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
        },
        handleRealtimeEvent
      )
      .subscribe((status) => {
        console.log('Subscription status:', status)
        if (status === 'SUBSCRIBED') {
          console.log('✓ Real-time subscription active')
        } else if (status === 'CHANNEL_ERROR') {
          console.error('✗ Real-time subscription failed')
          console.error('Check: 1) Real-time enabled on table, 2) RLS policies, 3) Network connection')
        } else if (status === 'TIMED_OUT') {
          console.error('✗ Real-time subscription timed out')
        }
      })

    return () => {
      console.log('Cleaning up real-time subscription')
      supabase.removeChannel(channel)
    }
  }, [user.id, supabase, handleRealtimeEvent])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Bookmarks</h1>
              <p className="text-gray-500 text-sm mt-0.5">Welcome, {user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Add Bookmark Form */}
        <AddBookmarkForm userId={user.id} onBookmarkAdded={addBookmarkToList} />

        {/* Bookmark List */}
        <BookmarkList bookmarks={bookmarks} loading={loading} onBookmarkDeleted={removeBookmarkFromList} />
      </div>
    </div>
  )
}