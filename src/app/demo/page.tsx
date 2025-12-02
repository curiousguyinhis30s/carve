import { ProfileCard } from '@/components/organisms/profile-card'
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
  username: 'sarahchen',
  name: 'Sarah Chen',
  title: 'Product Designer',
  company: 'Acme Inc.',
  bio: 'Creating beautiful digital experiences. Passionate about UX design, accessibility, and helping teams build products people love.',
  email: 'sarah@example.com',
  phone: '+1 (555) 123-4567',
  website: 'https://sarahchen.design',
  avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
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
    url: 'mailto:sarah@example.com',
    label: 'Email Me',
    icon: null,
    order: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    profile_id: 'demo-profile',
    type: 'linkedin',
    url: 'https://linkedin.com/in/sarahchen',
    label: 'LinkedIn',
    icon: null,
    order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    profile_id: 'demo-profile',
    type: 'website',
    url: '/p/sarahchen',
    label: 'View Portfolio',
    icon: null,
    order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    profile_id: 'demo-profile',
    type: 'calendly',
    url: '/book/sarahchen',
    label: 'Schedule a Call',
    icon: null,
    order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    profile_id: 'demo-profile',
    type: 'twitter',
    url: 'https://twitter.com/sarahchen',
    label: 'Twitter',
    icon: null,
    order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    profile_id: 'demo-profile',
    type: 'github',
    url: 'https://github.com/sarahchen',
    label: 'GitHub',
    icon: null,
    order: 5,
    created_at: new Date().toISOString(),
  },
]

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-12 max-w-lg">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 bg-gray-900 text-white text-xs font-medium rounded-full mb-4">
            Demo Profile
          </span>
          <h1 className="text-xl font-semibold text-gray-900 mb-1">
            This is how your card will look
          </h1>
          <p className="text-gray-500 text-sm">
            Try tapping the buttons to see the interactions
          </p>
        </div>
        <ProfileCard profile={demoProfile} links={demoLinks} />
      </div>
    </main>
  )
}
