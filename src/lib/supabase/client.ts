import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

// Check if Supabase is properly configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const isConfigured = supabaseUrl.includes('supabase.co') &&
                     !supabaseUrl.includes('placeholder') &&
                     supabaseKey.length > 20

export function createClient() {
  if (!isConfigured) {
    // Return a mock client for demo mode / build time
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: 'Demo mode - use demo buttons' } }),
        signUp: async () => ({ data: { user: null, session: null }, error: { message: 'Demo mode - use demo buttons' } }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => ({ data: null, error: null }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ data: null, error: null }),
        delete: () => ({ data: null, error: null }),
        eq: () => ({ data: null, error: null }),
        single: () => ({ data: null, error: null }),
      }),
    } as unknown as ReturnType<typeof createBrowserClient<Database>>
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseKey)
}
