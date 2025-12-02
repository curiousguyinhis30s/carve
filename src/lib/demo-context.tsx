'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type DemoMode = 'user' | 'admin' | null

interface DemoContextType {
  demoMode: DemoMode
  isDemoMode: boolean
  isAdmin: boolean
  exitDemoMode: () => void
}

const DemoContext = createContext<DemoContextType>({
  demoMode: null,
  isDemoMode: false,
  isAdmin: false,
  exitDemoMode: () => {},
})

export function DemoProvider({ children }: { children: ReactNode }) {
  const [demoMode, setDemoMode] = useState<DemoMode>(null)

  useEffect(() => {
    // Check localStorage for demo mode on mount
    const storedMode = localStorage.getItem('carve_demo_mode') as DemoMode
    if (storedMode) {
      setDemoMode(storedMode)
    }
  }, [])

  const exitDemoMode = () => {
    localStorage.removeItem('carve_demo_mode')
    setDemoMode(null)
    window.location.href = '/'
  }

  return (
    <DemoContext.Provider
      value={{
        demoMode,
        isDemoMode: demoMode !== null,
        isAdmin: demoMode === 'admin',
        exitDemoMode,
      }}
    >
      {children}
    </DemoContext.Provider>
  )
}

export function useDemo() {
  return useContext(DemoContext)
}

// Demo user data
export const DEMO_USER = {
  id: 'demo-user-id',
  email: 'demo@carve.app',
  user_metadata: {
    name: 'Sarah Chen',
  },
}

export const DEMO_PROFILE = {
  id: 'demo-profile',
  user_id: 'demo-user-id',
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

export const DEMO_ADMIN_USER = {
  id: 'demo-admin-id',
  email: 'admin@acme-inc.com',
  user_metadata: {
    name: 'Alex Thompson',
  },
}

export const DEMO_ADMIN_PROFILE = {
  id: 'demo-admin-profile',
  user_id: 'demo-admin-id',
  username: 'alexthompson',
  name: 'Alex Thompson',
  title: 'CEO & Founder',
  company: 'Acme Inc.',
  bio: 'Leading innovation at Acme Inc. Building the future of digital networking.',
  email: 'alex@acme-inc.com',
  phone: '+1 (555) 987-6543',
  website: 'https://acme-inc.com',
  avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  cover_url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&h=200&fit=crop',
  theme: 'default',
  is_primary: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}
