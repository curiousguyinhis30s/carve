'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDemo } from '@/contexts/demo-context'
import { DemoNav } from '@/components/organisms/demo-nav'
import { Loader2 } from 'lucide-react'

export default function DemoAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isDemoMode, isInitialized, enableDemoMode } = useDemo()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!isInitialized) return

    if (!isDemoMode) {
      // Auto-enable demo mode for admin if accessing this route directly
      enableDemoMode('admin').then(() => {
        setIsReady(true)
      })
    } else {
      setIsReady(true)
    }
  }, [isInitialized, isDemoMode, enableDemoMode, router])

  if (!isInitialized || !isReady) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--coral)]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <DemoNav />
      <main className="lg:pl-72">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
