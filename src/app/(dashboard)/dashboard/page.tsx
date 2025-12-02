'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Loader2,
  Save,
  Plus,
  Trash2,
  Eye,
  Link as LinkIcon,
  GripVertical,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Profile } from '@/types/database'
import { LINK_TYPES } from '@/types/database'

interface EditableLink {
  id?: string
  type: string
  url: string
  label: string
  order: number
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [links, setLinks] = useState<EditableLink[]>([])
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    bio: '',
    email: '',
    phone: '',
    website: '',
    avatar_url: '',
  })

  const supabase = createClient()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

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
        setFormData({
          name: p.name || '',
          title: p.title || '',
          company: p.company || '',
          bio: p.bio || '',
          email: p.email || '',
          phone: p.phone || '',
          website: p.website || '',
          avatar_url: p.avatar_url || '',
        })

        // Load links
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: linksData } = await (supabase as any)
          .from('profile_links')
          .select('*')
          .eq('profile_id', p.id)
          .order('order', { ascending: true })

        if (linksData) {
          setLinks(linksData as EditableLink[])
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)

    try {
      // Update profile
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: profileError } = await (supabase as any)
        .from('profiles')
        .update({
          name: formData.name,
          title: formData.title,
          company: formData.company,
          bio: formData.bio,
          email: formData.email,
          phone: formData.phone,
          website: formData.website,
          avatar_url: formData.avatar_url,
        })
        .eq('id', profile.id)

      if (profileError) throw profileError

      // Update links - delete existing and insert new
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('profile_links')
        .delete()
        .eq('profile_id', profile.id)

      if (links.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: linksError } = await (supabase as any)
          .from('profile_links')
          .insert(
            links.map((link, index) => ({
              profile_id: profile.id,
              type: link.type,
              url: link.url,
              label: link.label,
              order: index,
            }))
          )

        if (linksError) throw linksError
      }

      toast.success('Profile saved successfully!')
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const addLink = () => {
    setLinks([
      ...links,
      {
        type: 'website',
        url: '',
        label: '',
        order: links.length,
      },
    ])
  }

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index))
  }

  const updateLink = (index: number, field: keyof EditableLink, value: string) => {
    const newLinks = [...links]
    newLinks[index] = { ...newLinks[index], [field]: value }
    setLinks(newLinks)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--coral)]" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
          <p className="text-white/60">Customize your digital business card</p>
        </div>
        <div className="flex gap-3">
          {profile && (
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              asChild
            >
              <a href={`/${profile.username}`} target="_blank" rel="noopener noreferrer">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </a>
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[var(--coral)] hover:bg-[var(--coral-dark)] text-white"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Profile URL */}
      {profile && (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-white/60" />
                <span className="text-white/60">Your profile URL:</span>
                <code className="px-2 py-1 bg-white/10 rounded text-[var(--coral)]">
                  carve.app/{profile.username}
                </code>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white"
                onClick={() => {
                  navigator.clipboard.writeText(`https://carve.app/${profile.username}`)
                  toast.success('URL copied to clipboard!')
                }}
              >
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Info */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Basic Information</CardTitle>
            <CardDescription className="text-white/60">
              Your name and professional details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={formData.avatar_url} />
                <AvatarFallback className="bg-[var(--coral)] text-white text-xl">
                  {getInitials(formData.name || 'U')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Label htmlFor="avatar_url" className="text-white/80">
                  Avatar URL
                </Label>
                <Input
                  id="avatar_url"
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/80">
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-white/80">
                Job Title
              </Label>
              <Input
                id="title"
                placeholder="Product Designer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-white/80">
                Company
              </Label>
              <Input
                id="company"
                placeholder="Acme Inc."
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-white/80">
                Bio
              </Label>
              <Textarea
                id="bio"
                placeholder="A short description about yourself..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Contact Information</CardTitle>
            <CardDescription className="text-white/60">
              How people can reach you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white/80">
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-white/80">
                Website
              </Label>
              <Input
                id="website"
                type="url"
                placeholder="https://janedoe.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Social Links */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Social Links</CardTitle>
              <CardDescription className="text-white/60">
                Add links to your social profiles and websites
              </CardDescription>
            </div>
            <Button
              onClick={addLink}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Link
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {links.length === 0 ? (
            <div className="text-center py-8 text-white/40">
              <LinkIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No links added yet</p>
              <p className="text-sm">Click &quot;Add Link&quot; to add your social profiles</p>
            </div>
          ) : (
            <div className="space-y-3">
              {links.map((link, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-xl"
                >
                  <GripVertical className="h-5 w-5 text-white/40 cursor-grab" />

                  <Select
                    value={link.type}
                    onValueChange={(value) => updateLink(index, 'type', value)}
                  >
                    <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-white/10">
                      {Object.entries(LINK_TYPES).map(([key, value]) => (
                        <SelectItem key={key} value={key} className="text-white">
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Label (optional)"
                    value={link.label}
                    onChange={(e) => updateLink(index, 'label', e.target.value)}
                    className="w-[150px] bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />

                  <Input
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => updateLink(index, 'url', e.target.value)}
                    className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLink(index)}
                    className="text-white/40 hover:text-red-400 hover:bg-red-400/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">0</p>
              <p className="text-sm text-white/60">Profile Views</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">0</p>
              <p className="text-sm text-white/60">Card Taps</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">0</p>
              <p className="text-sm text-white/60">Contacts Saved</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
