'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, CreditCard, ArrowLeft, User, Shield, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('Welcome back!')
      router.push('/dashboard')
      router.refresh()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      toast.error(error.message)
    }
  }

  const handleDemoUserLogin = () => {
    // Set demo mode in localStorage and redirect to demo dashboard
    localStorage.setItem('carve_demo_mode', 'user')
    toast.success('Welcome to demo mode!')
    router.push('/demo-dashboard')
  }

  const handleDemoAdminLogin = () => {
    // Set demo admin mode in localStorage and redirect to demo admin
    localStorage.setItem('carve_demo_mode', 'admin')
    toast.success('Welcome, Demo Admin!')
    router.push('/demo-admin')
  }

  return (
    <div className="min-h-screen bg-[var(--cream)] flex">
      {/* Left: Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[var(--coral)] flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-[var(--ink)]">Carve</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-[var(--ink)] mb-2">Welcome back</h1>
            <p className="text-[var(--ink-muted)] mb-8">
              Sign in to your account to continue
            </p>

            {/* Demo Accounts Section */}
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-[var(--coral)]/5 to-[var(--coral)]/10 border border-[var(--coral)]/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[var(--coral)]" />
                <span className="text-sm font-medium text-[var(--ink)]">Try Demo Accounts</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-auto py-3 border-[var(--coral)]/30 hover:bg-[var(--coral)]/10 hover:border-[var(--coral)]"
                  onClick={handleDemoUserLogin}
                  disabled={loading}
                >
                  <div className="flex flex-col items-center gap-1">
                    <User className="w-5 h-5 text-[var(--coral)]" />
                    <span className="text-xs font-medium text-[var(--ink)]">Demo User</span>
                    <span className="text-[10px] text-[var(--ink-muted)]">Explore dashboard</span>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-3 border-[var(--coral)]/30 hover:bg-[var(--coral)]/10 hover:border-[var(--coral)]"
                  onClick={handleDemoAdminLogin}
                  disabled={loading}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Shield className="w-5 h-5 text-[var(--coral)]" />
                    <span className="text-xs font-medium text-[var(--ink)]">Demo Admin</span>
                    <span className="text-[10px] text-[var(--ink-muted)]">Team management</span>
                  </div>
                </Button>
              </div>
            </div>

            {/* Google Login */}
            <Button
              variant="outline"
              className="w-full h-12 border-[var(--stone)] text-[var(--ink)]"
              onClick={handleGoogleLogin}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[var(--sand)]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[var(--cream)] px-4 text-[var(--ink-faint)]">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[var(--ink)]">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 bg-white border-[var(--stone)] focus:border-[var(--coral)] focus:ring-[var(--coral)]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[var(--ink)]">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-[var(--coral)] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 bg-white border-[var(--stone)] focus:border-[var(--coral)] focus:ring-[var(--coral)]"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-[var(--coral)] hover:bg-[var(--coral-dark)] text-white rounded-xl"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-[var(--ink-muted)]">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-[var(--coral)] font-medium hover:underline">
                Sign up free
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right: Visual */}
      <div className="hidden lg:flex lg:flex-1 bg-[var(--ink)] items-center justify-center p-12">
        <div className="max-w-md text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            {/* Card Preview */}
            <div className="bg-white rounded-3xl p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--coral)] to-[var(--coral-light)] flex items-center justify-center text-white text-xl font-bold mb-4">
                YN
              </div>
              <h3 className="text-xl font-bold text-[var(--ink)]">Your Name</h3>
              <p className="text-[var(--ink-muted)] text-sm">Your Title</p>
              <div className="mt-4 space-y-2">
                <div className="h-10 rounded-lg bg-[var(--cream)]" />
                <div className="h-10 rounded-lg bg-[var(--cream)]" />
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 bg-[var(--coral)] text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              Tap to share
            </div>
          </motion.div>

          <h2 className="mt-12 text-2xl font-bold text-white">
            Your digital identity,
            <br />
            beautifully crafted
          </h2>
          <p className="mt-4 text-white/60">
            Create stunning business cards that make lasting impressions.
          </p>
        </div>
      </div>
    </div>
  )
}
