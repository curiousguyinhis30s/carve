'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Loader2,
  Save,
  User,
  Bell,
  Shield,
  Trash2,
  Key,
  Mail,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Profile } from '@/types/database'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [notifications, setNotifications] = useState({
    profileViews: true,
    cardTaps: true,
    newContacts: true,
    marketing: false,
  })

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setEmail(user.email || '')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: profileData } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_primary', true)
        .single()

      if (profileData) {
        const p = profileData as Profile
        setProfile(p)
        setUsername(p.username)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUsername = async () => {
    if (!profile || !username) return
    setSaving(true)

    try {
      // Check if username is available
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: existing } = await (supabase as any)
        .from('profiles')
        .select('id')
        .eq('username', username.toLowerCase())
        .neq('id', profile.id)
        .single()

      if (existing) {
        toast.error('Username is already taken')
        return
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('profiles')
        .update({ username: username.toLowerCase() })
        .eq('id', profile.id)

      if (error) throw error

      toast.success('Username updated successfully!')
    } catch (error) {
      console.error('Error updating username:', error)
      toast.error('Failed to update username')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateEmail = async () => {
    if (!email) return
    setSaving(true)

    try {
      const { error } = await supabase.auth.updateUser({ email })

      if (error) throw error

      toast.success('Verification email sent to your new address')
    } catch (error) {
      console.error('Error updating email:', error)
      toast.error('Failed to update email')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) return

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setSaving(true)

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })

      if (error) throw error

      toast.success('Password updated successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.error('Error updating password:', error)
      toast.error('Failed to update password')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      // Delete profile first
      if (profile) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from('profiles')
          .delete()
          .eq('id', profile.id)
      }

      // Sign out
      await supabase.auth.signOut()

      toast.success('Account deleted successfully')
      router.push('/')
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error('Failed to delete account')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--coral)]" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-white/60">Manage your account preferences</p>
      </div>

      {/* Account Settings */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-[var(--coral)]" />
            <CardTitle className="text-white">Account</CardTitle>
          </div>
          <CardDescription className="text-white/60">
            Update your account information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-white/80">
              Username
            </Label>
            <div className="flex gap-2">
              <div className="flex-1 flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-white/10 bg-white/5 text-white/60 text-sm">
                  carve.app/
                </span>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                  className="rounded-l-none bg-white/5 border-white/10 text-white"
                />
              </div>
              <Button
                onClick={handleUpdateUsername}
                disabled={saving || username === profile?.username}
                className="bg-[var(--coral)] hover:bg-[var(--coral-dark)]"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/80">
              Email Address
            </Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
              <Button
                onClick={handleUpdateEmail}
                disabled={saving}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-white/50">
              A verification email will be sent to confirm the change
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[var(--coral)]" />
            <CardTitle className="text-white">Security</CardTitle>
          </div>
          <CardDescription className="text-white/60">
            Manage your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-white/80">
              New Password
            </Label>
            <Input
              id="new-password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-white/80">
              Confirm New Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
            />
          </div>

          <Button
            onClick={handleUpdatePassword}
            disabled={saving || !newPassword || !confirmPassword}
            className="bg-[var(--coral)] hover:bg-[var(--coral-dark)]"
          >
            <Key className="mr-2 h-4 w-4" />
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-[var(--coral)]" />
            <CardTitle className="text-white">Notifications</CardTitle>
          </div>
          <CardDescription className="text-white/60">
            Choose what you want to be notified about
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Profile Views</p>
              <p className="text-xs text-white/50">Get notified when someone views your profile</p>
            </div>
            <Switch
              checked={notifications.profileViews}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, profileViews: checked })
              }
            />
          </div>

          <Separator className="bg-white/10" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Card Taps</p>
              <p className="text-xs text-white/50">Get notified when someone taps your NFC card</p>
            </div>
            <Switch
              checked={notifications.cardTaps}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, cardTaps: checked })
              }
            />
          </div>

          <Separator className="bg-white/10" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">New Contacts</p>
              <p className="text-xs text-white/50">Get notified when someone saves your contact</p>
            </div>
            <Switch
              checked={notifications.newContacts}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, newContacts: checked })
              }
            />
          </div>

          <Separator className="bg-white/10" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Marketing Emails</p>
              <p className="text-xs text-white/50">Receive tips, updates, and promotions</p>
            </div>
            <Switch
              checked={notifications.marketing}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, marketing: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-red-500/5 border-red-500/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            <CardTitle className="text-red-400">Danger Zone</CardTitle>
          </div>
          <CardDescription className="text-white/60">
            Irreversible actions for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#0A0A0A] border-white/10">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-white/60">
                  This action cannot be undone. This will permanently delete your
                  account, all your profiles, cards, and analytics data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
