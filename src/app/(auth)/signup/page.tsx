'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, CreditCard, ArrowLeft, Check } from 'lucide-react'
import { toast } from 'sonner'

const benefits = [
  'Free forever starter plan',
  'NFC & QR code sharing',
  'Real-time analytics',
  'Unlimited updates',
]

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Check if username is available
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: existingProfile } = await (supabase as any)
        .from('profiles')
        .select('username')
        .eq('username', username.toLowerCase())
        .single()

      if (existingProfile) {
        toast.error('Username is already taken')
        setLoading(false)
        return
      }

      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            username: username.toLowerCase(),
          },
        },
      })

      if (error) {
        toast.error(error.message)
        return
      }

      if (data.user) {
        // Create profile
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from('profiles').insert({
          user_id: data.user.id,
          username: username.toLowerCase(),
          name,
          is_primary: true,
        })

        toast.success('Account created! Check your email to verify.')
        router.push('/login')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
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

  return (
    <div className="min-h-screen bg-[var(--cream)] flex">
      {/* Left: Visual */}
      <div className="hidden lg:flex lg:flex-1 bg-[var(--ink)] items-center justify-center p-12">
        <div className="max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Start building your digital presence today
            </h2>
            <p className="text-white/60 mb-8">
              Join thousands of professionals who use Carve to make meaningful connections.
            </p>

            <ul className="space-y-4">
              {benefits.map((benefit, i) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3 text-white/80"
                >
                  <div className="w-6 h-6 rounded-full bg-[var(--coral)] flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  {benefit}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Right: Form */}
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
            <h1 className="text-3xl font-bold text-[var(--ink)] mb-2">Create your account</h1>
            <p className="text-[var(--ink-muted)] mb-8">
              Get started with your digital business card
            </p>

            {/* Google Signup */}
            <Button
              variant="outline"
              className="w-full h-12 border-[var(--stone)] text-[var(--ink)]"
              onClick={handleGoogleSignup}
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

            {/* Signup Form */}
            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[var(--ink)]">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12 bg-white border-[var(--stone)] focus:border-[var(--coral)] focus:ring-[var(--coral)]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-[var(--ink)]">
                  Username
                </Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-[var(--stone)] bg-[var(--sand)] text-[var(--ink-muted)] text-sm">
                    carve.app/
                  </span>
                  <Input
                    id="username"
                    type="text"
                    placeholder="janedoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                    required
                    className="h-12 rounded-l-none bg-white border-[var(--stone)] focus:border-[var(--coral)] focus:ring-[var(--coral)]"
                  />
                </div>
              </div>

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
                <Label htmlFor="password" className="text-[var(--ink)]">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="h-12 bg-white border-[var(--stone)] focus:border-[var(--coral)] focus:ring-[var(--coral)]"
                />
                <p className="text-xs text-[var(--ink-faint)]">Must be at least 8 characters</p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-[var(--coral)] hover:bg-[var(--coral-dark)] text-white rounded-xl"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-[var(--ink-muted)]">
              Already have an account?{' '}
              <Link href="/login" className="text-[var(--coral)] font-medium hover:underline">
                Sign in
              </Link>
            </p>

            <p className="mt-4 text-center text-xs text-[var(--ink-faint)]">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-[var(--coral)] hover:underline">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-[var(--coral)] hover:underline">
                Privacy Policy
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
