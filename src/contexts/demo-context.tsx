'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

type DemoRole = 'user' | 'admin' | null

interface DemoUser {
  id: string
  email: string
  name: string
  avatar_url: string
}

interface DemoProfile {
  id: string
  user_id: string
  username: string
  name: string
  title: string
  company: string
  bio: string
  email: string
  phone: string
  website: string
  avatar_url: string
  cover_url: string
  theme: string
  is_primary: boolean
}

interface DemoContextType {
  isDemoMode: boolean
  demoRole: DemoRole
  demoUser: DemoUser | null
  demoProfile: DemoProfile | null
  isInitialized: boolean
  enableDemoMode: (role: DemoRole) => Promise<void>
  disableDemoMode: () => void
}

const DEMO_USER_DATA: DemoUser = {
  id: 'demo-user-001',
  email: 'demo@carve.app',
  name: 'Sarah Chen',
  avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
}

const DEMO_ADMIN_DATA: DemoUser = {
  id: 'demo-admin-001',
  email: 'admin@carve.app',
  name: 'Alex Morgan',
  avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
}

const DEMO_USER_PROFILE: DemoProfile = {
  id: 'demo-profile-001',
  user_id: 'demo-user-001',
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
}

const DEMO_ADMIN_PROFILE: DemoProfile = {
  id: 'demo-profile-admin',
  user_id: 'demo-admin-001',
  username: 'alexmorgan',
  name: 'Alex Morgan',
  title: 'Team Lead',
  company: 'Carve HQ',
  bio: 'Managing the Carve team. Helping organizations modernize their networking with digital business cards.',
  email: 'alex@carve.app',
  phone: '+1 (555) 987-6543',
  website: 'https://carve.app',
  avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  cover_url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&h=200&fit=crop',
  theme: 'default',
  is_primary: true,
}

const DemoContext = createContext<DemoContextType | undefined>(undefined)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [demoRole, setDemoRole] = useState<DemoRole>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()

  // Initialize from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('carve_demo_mode')
    if (stored === 'user' || stored === 'admin') {
      setIsDemoMode(true)
      setDemoRole(stored)
    }
    setIsInitialized(true)
  }, [])

  const enableDemoMode = useCallback(async (role: DemoRole): Promise<void> => {
    if (role) {
      localStorage.setItem('carve_demo_mode', role)
      setIsDemoMode(true)
      setDemoRole(role)

      // Small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }, [])

  const disableDemoMode = useCallback(() => {
    localStorage.removeItem('carve_demo_mode')
    setIsDemoMode(false)
    setDemoRole(null)
    router.push('/')
  }, [router])

  const demoUser = demoRole === 'admin' ? DEMO_ADMIN_DATA : demoRole === 'user' ? DEMO_USER_DATA : null
  const demoProfile = demoRole === 'admin' ? DEMO_ADMIN_PROFILE : demoRole === 'user' ? DEMO_USER_PROFILE : null

  return (
    <DemoContext.Provider
      value={{
        isDemoMode,
        demoRole,
        demoUser,
        demoProfile,
        isInitialized,
        enableDemoMode,
        disableDemoMode,
      }}
    >
      {children}
    </DemoContext.Provider>
  )
}

export function useDemo() {
  const context = useContext(DemoContext)
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider')
  }
  return context
}

// Demo links data
export const DEMO_LINKS = [
  {
    id: 'link-1',
    profile_id: 'demo-profile-001',
    type: 'email',
    url: 'mailto:sarah@example.com',
    label: 'Email Me',
    order: 0,
  },
  {
    id: 'link-2',
    profile_id: 'demo-profile-001',
    type: 'linkedin',
    url: 'https://linkedin.com/in/sarahchen',
    label: 'LinkedIn',
    order: 1,
  },
  {
    id: 'link-3',
    profile_id: 'demo-profile-001',
    type: 'website',
    url: 'https://sarahchen.design',
    label: 'Portfolio',
    order: 2,
  },
  {
    id: 'link-4',
    profile_id: 'demo-profile-001',
    type: 'calendly',
    url: '/book/sarahchen',
    label: 'Book a Call',
    order: 3,
  },
  {
    id: 'link-5',
    profile_id: 'demo-profile-001',
    type: 'twitter',
    url: 'https://twitter.com/sarahchen',
    label: 'Twitter',
    order: 4,
  },
]

// Demo team members for admin
export const DEMO_TEAM_MEMBERS = [
  {
    id: 'team-1',
    name: 'Sarah Chen',
    email: 'sarah@acme.com',
    title: 'Product Designer',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    profile_views: 127,
    card_taps: 89,
    status: 'active',
  },
  {
    id: 'team-2',
    name: 'Marcus Johnson',
    email: 'marcus@acme.com',
    title: 'Sales Director',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    profile_views: 234,
    card_taps: 156,
    status: 'active',
  },
  {
    id: 'team-3',
    name: 'Emily Rodriguez',
    email: 'emily@acme.com',
    title: 'Marketing Manager',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
    profile_views: 98,
    card_taps: 67,
    status: 'active',
  },
  {
    id: 'team-4',
    name: 'David Kim',
    email: 'david@acme.com',
    title: 'Engineering Lead',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    profile_views: 76,
    card_taps: 45,
    status: 'active',
  },
  {
    id: 'team-5',
    name: 'Lisa Wang',
    email: 'lisa@acme.com',
    title: 'Customer Success',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    profile_views: 145,
    card_taps: 112,
    status: 'pending',
  },
]
