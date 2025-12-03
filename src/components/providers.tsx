'use client'

import { DemoProvider } from '@/contexts/demo-context'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return <DemoProvider>{children}</DemoProvider>
}
