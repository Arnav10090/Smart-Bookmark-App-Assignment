// Test script to verify Supabase real-time configuration
// Run this with: node test-realtime.js

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl)
console.log('Testing real-time connection...\n')

const supabase = createClient(supabaseUrl, supabaseKey)

// Subscribe to all changes on bookmarks table
const channel = supabase
  .channel('test-channel')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'bookmarks',
    },
    (payload) => {
      console.log('✓ Real-time event received!')
      console.log('Event type:', payload.eventType)
      console.log('Payload:', JSON.stringify(payload, null, 2))
    }
  )
  .subscribe((status) => {
    console.log('Subscription status:', status)
    if (status === 'SUBSCRIBED') {
      console.log('✓ Successfully subscribed to real-time events')
      console.log('\nNow try adding a bookmark in your app...')
      console.log('Press Ctrl+C to exit\n')
    } else if (status === 'CHANNEL_ERROR') {
      console.error('✗ Failed to subscribe to real-time events')
      console.error('Possible issues:')
      console.error('1. Real-time replication not enabled on bookmarks table')
      console.error('2. Network/firewall blocking WebSocket connection')
      console.error('3. Invalid Supabase credentials')
      process.exit(1)
    }
  })

// Keep the script running
process.on('SIGINT', () => {
  console.log('\nCleaning up...')
  supabase.removeChannel(channel)
  process.exit(0)
})
