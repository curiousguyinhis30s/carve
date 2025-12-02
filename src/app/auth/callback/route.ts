import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check if user has a profile, if not create one
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: profile } = await (supabase as any)
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (!profile) {
          // Create profile for OAuth users
          const username = user.email?.split('@')[0]?.replace(/[^a-z0-9]/g, '') || `user${Date.now()}`
          const name = user.user_metadata?.full_name || user.user_metadata?.name || 'User'

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any).from('profiles').insert({
            user_id: user.id,
            username,
            name,
            avatar_url: user.user_metadata?.avatar_url || null,
            is_primary: true,
          })
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`)
}
