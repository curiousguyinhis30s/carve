import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileCard } from '@/components/organisms/profile-card'
import { trackProfileView } from './actions'
import type { Metadata } from 'next'
import type { Profile, ProfileLink } from '@/types/database'

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  const profile = data as Profile | null

  if (!profile) {
    return {
      title: 'Profile Not Found',
    }
  }

  const title = profile.title
    ? `${profile.name} - ${profile.title}`
    : profile.name

  return {
    title,
    description: profile.bio || `Connect with ${profile.name}`,
    openGraph: {
      title,
      description: profile.bio || `Connect with ${profile.name}`,
      images: profile.avatar_url ? [profile.avatar_url] : [],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: profile.bio || `Connect with ${profile.name}`,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  }
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  // Fetch profile
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profileData, error: profileError } = await (supabase as any)
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  const profile = profileData as Profile | null

  if (profileError || !profile) {
    notFound()
  }

  // Fetch profile links
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: linksData } = await (supabase as any)
    .from('profile_links')
    .select('*')
    .eq('profile_id', profile.id)
    .order('order', { ascending: true })

  const links = (linksData as ProfileLink[] | null) || []

  // Track view (non-blocking)
  trackProfileView(profile.id)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <ProfileCard profile={profile} links={links} />
      </div>
    </main>
  )
}
