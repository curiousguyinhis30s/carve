import { ProfileCard } from '@/components/profile/profile-card'
import type { Metadata } from 'next'
import type { Profile, ProfileLink } from '@/types/database'

export const metadata: Metadata = {
  title: 'Demo Profile',
  description: 'See how your digital business card will look',
}

// Sample demo profile data
const demoProfile: Profile = {
  id: 'demo-profile',
  user_id: 'demo-user',
  username: 'johndoe',
  name: 'John Doe',
  title: 'Product Designer',
  company: 'Acme Inc.',
  bio: 'Creating beautiful digital experiences. Passionate about UX design, accessibility, and helping teams build products people love.',
  email: 'john@example.com',
  phone: '+1 (555) 123-4567',
  website: 'https://johndoe.design',
  avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  cover_url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&h=200&fit=crop',
  theme: 'default',
  is_primary: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const demoLinks: ProfileLink[] = [
  {
    id: '1',
    profile_id: 'demo-profile',
    type: 'email',
    url: 'mailto:john@example.com',
    label: 'Email Me',
    icon: null,
    order: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    profile_id: 'demo-profile',
    type: 'linkedin',
    url: 'https://linkedin.com/in/johndoe',
    label: 'LinkedIn',
    icon: null,
    order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    profile_id: 'demo-profile',
    type: 'website',
    url: 'https://johndoe.design',
    label: 'Portfolio',
    icon: null,
    order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    profile_id: 'demo-profile',
    type: 'calendly',
    url: 'https://calendly.com/johndoe',
    label: 'Schedule a Call',
    icon: null,
    order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    profile_id: 'demo-profile',
    type: 'twitter',
    url: 'https://twitter.com/johndoe',
    label: 'Twitter',
    icon: null,
    order: 4,
    created_at: new Date().toISOString(),
  },
]

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30 mb-4">
            Demo Profile
          </span>
          <h1 className="text-2xl font-bold text-white mb-2">
            This is how your card will look
          </h1>
          <p className="text-slate-400 text-sm">
            Try tapping the buttons to see the interactions
          </p>
        </div>
        <ProfileCard profile={demoProfile} links={demoLinks} />
      </div>
    </main>
  )
}
