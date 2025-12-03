'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useDemo } from '@/contexts/demo-context'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import {
  LayoutDashboard,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  ExternalLink,
  Users,
  UsersRound,
  Wallet,
  Plug,
  Briefcase,
  Shield,
  Mail,
  Webhook,
  Sparkles,
} from 'lucide-react'

const userNavItems = [
  { href: '/demo-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/demo-dashboard/cards', label: 'Cards', icon: CreditCard },
  { href: '/demo-dashboard/portfolio', label: 'Portfolio', icon: Briefcase, badge: 'New' },
  { href: '/demo-dashboard/contacts', label: 'Contacts', icon: Users },
  { href: '/demo-dashboard/analytics', label: 'Analytics', icon: BarChart3 },
]

const adminNavItems = [
  { href: '/demo-admin', label: 'Team Overview', icon: LayoutDashboard },
  { href: '/demo-admin/members', label: 'Team Members', icon: UsersRound },
  { href: '/demo-admin/analytics', label: 'Team Analytics', icon: BarChart3 },
  { href: '/demo-admin/templates', label: 'Email Templates', icon: Mail },
  { href: '/demo-admin/webhooks', label: 'Webhooks', icon: Webhook, badge: 'Pro' },
  { href: '/demo-admin/billing', label: 'Billing', icon: Wallet },
  { href: '/demo-admin/integrations', label: 'Integrations', icon: Plug, badge: 'Pro' },
  { href: '/demo-admin/settings', label: 'Settings', icon: Settings },
]

export function DemoNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { demoRole, demoUser, demoProfile, disableDemoMode } = useDemo()

  const navItems = demoRole === 'admin' ? adminNavItems : userNavItems

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--coral)] flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Carve</span>
        </Link>
      </div>

      {/* Demo Badge */}
      <div className="px-4 py-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--coral)]/10 border border-[var(--coral)]/20">
          <Sparkles className="w-4 h-4 text-[var(--coral)]" />
          <span className="text-xs font-medium text-[var(--coral)]">
            Demo Mode: {demoRole === 'admin' ? 'Admin' : 'User'}
          </span>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={demoUser?.avatar_url || ''} />
            <AvatarFallback className="bg-[var(--coral)] text-white">
              {getInitials(demoUser?.name || 'U')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {demoUser?.name || 'Demo User'}
            </p>
            <p className="text-xs text-white/50 truncate">
              @{demoProfile?.username || 'demouser'}
            </p>
          </div>
        </div>
        {demoProfile && (
          <Link
            href={`/demo`}
            className="mt-3 flex items-center justify-center gap-2 text-xs text-[var(--coral)] hover:text-[var(--coral-light)] transition"
          >
            <ExternalLink className="h-3 w-3" />
            View Public Profile
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                isActive
                  ? 'bg-[var(--coral)] text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="flex-1">{item.label}</span>
              {'badge' in item && item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[var(--coral)]/20 text-[var(--coral)]'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Switch Demo Role */}
      <div className="p-4 border-t border-white/10">
        <Link
          href={demoRole === 'admin' ? '/demo-dashboard' : '/demo-admin'}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-colors"
          onClick={() => {
            localStorage.setItem('carve_demo_mode', demoRole === 'admin' ? 'user' : 'admin')
            window.location.href = demoRole === 'admin' ? '/demo-dashboard' : '/demo-admin'
          }}
        >
          {demoRole === 'admin' ? <Users className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
          <span>Switch to {demoRole === 'admin' ? 'User' : 'Admin'} Demo</span>
        </Link>
      </div>

      {/* Exit Demo */}
      <div className="p-4 border-t border-white/10">
        <Button
          variant="ghost"
          className="w-full justify-start text-white/60 hover:text-white hover:bg-white/5"
          onClick={disableDemoMode}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Exit Demo Mode
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[var(--ink)]/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--coral)] flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Carve</span>
            <Badge variant="outline" className="text-[var(--coral)] border-[var(--coral)]/30 text-[10px]">
              Demo
            </Badge>
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 bg-[var(--ink)] border-white/10">
              <div className="flex flex-col h-full">
                <NavContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-72 bg-[var(--ink)] border-r border-white/10">
        <NavContent />
      </aside>

      {/* Mobile spacer */}
      <div className="lg:hidden h-16" />
    </>
  )
}
