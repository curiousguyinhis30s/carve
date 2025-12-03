'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useDemo, DEMO_LINKS } from '@/contexts/demo-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfilePreview } from '@/components/organisms/profile-preview'
import { AnalyticsCharts } from '@/components/organisms/analytics-charts'
import { ShareModal } from '@/components/organisms/share-modal'
import { SortableLinks } from '@/components/organisms/sortable-links'
import {
  Save,
  Eye,
  Link as LinkIcon,
  BarChart3,
  User,
  Share2,
  Smartphone,
  Monitor,
  Check,
  Copy,
} from 'lucide-react'
import { toast } from 'sonner'

interface EditableLink {
  id: string
  type: string
  url: string
  label: string
  order: number
}

export default function DemoDashboardPage() {
  const { demoProfile } = useDemo()
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile')
  const [copied, setCopied] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const [formData, setFormData] = useState({
    name: demoProfile?.name || '',
    title: demoProfile?.title || '',
    company: demoProfile?.company || '',
    bio: demoProfile?.bio || '',
    email: demoProfile?.email || '',
    phone: demoProfile?.phone || '',
    website: demoProfile?.website || '',
    avatar_url: demoProfile?.avatar_url || '',
    username: demoProfile?.username || 'demo',
  })

  const [links, setLinks] = useState<EditableLink[]>(
    DEMO_LINKS.map(l => ({
      id: l.id,
      type: l.type,
      url: l.url,
      label: l.label,
      order: l.order,
    }))
  )

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    setHasChanges(true)
  }

  const handleLinksChange = (newLinks: EditableLink[]) => {
    setLinks(newLinks)
    setHasChanges(true)
  }

  const handleSave = () => {
    setHasChanges(false)
    toast.success('Profile saved!', {
      description: 'Changes saved in demo mode (not persisted)',
    })
  }

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(`https://carve.app/${formData.username}`)
    setCopied(true)
    toast.success('URL copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
          <p className="text-white/60">Customize your digital business card</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            className="flex-1 sm:flex-none border-white/20 text-white hover:bg-white/10"
            onClick={() => setShareModalOpen(true)}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button
            onClick={handleSave}
            className={`flex-1 sm:flex-none transition-all ${
              hasChanges
                ? 'bg-[var(--coral)] hover:bg-[var(--coral-dark)]'
                : 'bg-green-600 hover:bg-green-700'
            } text-white`}
            disabled={!hasChanges}
          >
            {hasChanges ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Saved
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Profile URL Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-white/5 border-white/10 mb-6">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <LinkIcon className="h-4 w-4 text-white/60 shrink-0" />
                <span className="text-white/60">Your profile:</span>
                <code className="px-3 py-1.5 bg-white/10 rounded-lg text-[var(--coral)] font-mono text-sm">
                  carve.app/{formData.username}
                </code>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 sm:flex-none text-white/60 hover:text-white"
                  onClick={handleCopyUrl}
                >
                  {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 sm:flex-none text-white/60 hover:text-white"
                  asChild
                >
                  <Link href="/demo" target="_blank">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10 p-1">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-[var(--coral)] data-[state=active]:text-white"
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="links"
            className="data-[state=active]:bg-[var(--coral)] data-[state=active]:text-white"
          >
            <LinkIcon className="h-4 w-4 mr-2" />
            Links
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-[var(--coral)] data-[state=active]:text-white"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Left: Form (3 cols) */}
            <div className="lg:col-span-3 space-y-6">
              {/* Basic Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
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
                      <Avatar className="h-20 w-20 ring-2 ring-white/10">
                        <AvatarImage src={formData.avatar_url} />
                        <AvatarFallback className="bg-[var(--coral)] text-white text-xl">
                          {getInitials(formData.name || 'U')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="avatar_url" className="text-white/80">
                          Avatar URL
                        </Label>
                        <Input
                          id="avatar_url"
                          placeholder="https://example.com/avatar.jpg"
                          value={formData.avatar_url}
                          onChange={(e) => handleFormChange('avatar_url', e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[var(--coral)] focus:ring-[var(--coral)]"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white/80">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="Jane Doe"
                          value={formData.name}
                          onChange={(e) => handleFormChange('name', e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[var(--coral)] focus:ring-[var(--coral)]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-white/80">Username</Label>
                        <Input
                          id="username"
                          placeholder="janedoe"
                          value={formData.username}
                          onChange={(e) => handleFormChange('username', e.target.value.toLowerCase().replace(/\s/g, ''))}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[var(--coral)] focus:ring-[var(--coral)]"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-white/80">Job Title</Label>
                        <Input
                          id="title"
                          placeholder="Product Designer"
                          value={formData.title}
                          onChange={(e) => handleFormChange('title', e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[var(--coral)] focus:ring-[var(--coral)]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-white/80">Company</Label>
                        <Input
                          id="company"
                          placeholder="Acme Inc."
                          value={formData.company}
                          onChange={(e) => handleFormChange('company', e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[var(--coral)] focus:ring-[var(--coral)]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-white/80">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="A short description about yourself..."
                        value={formData.bio}
                        onChange={(e) => handleFormChange('bio', e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-[100px] focus:border-[var(--coral)] focus:ring-[var(--coral)]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Contact Information</CardTitle>
                    <CardDescription className="text-white/60">
                      How people can reach you
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white/80">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="jane@example.com"
                          value={formData.email}
                          onChange={(e) => handleFormChange('email', e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[var(--coral)] focus:ring-[var(--coral)]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-white/80">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={formData.phone}
                          onChange={(e) => handleFormChange('phone', e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[var(--coral)] focus:ring-[var(--coral)]"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-white/80">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        placeholder="https://janedoe.com"
                        value={formData.website}
                        onChange={(e) => handleFormChange('website', e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[var(--coral)] focus:ring-[var(--coral)]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right: Live Preview (2 cols) */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="sticky top-6"
              >
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-base">Live Preview</CardTitle>
                      <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setPreviewDevice('mobile')}
                          className={`h-8 px-2 ${previewDevice === 'mobile' ? 'bg-white/10' : ''}`}
                        >
                          <Smartphone className="h-4 w-4 text-white/70" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setPreviewDevice('desktop')}
                          className={`h-8 px-2 ${previewDevice === 'desktop' ? 'bg-white/10' : ''}`}
                        >
                          <Monitor className="h-4 w-4 text-white/70" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className={`mx-auto transition-all duration-300 ${
                      previewDevice === 'mobile' ? 'max-w-[320px]' : 'max-w-full'
                    }`}>
                      <ProfilePreview
                        profile={formData}
                        links={links}
                        template="dark-modern"
                        onShare={() => setShareModalOpen(true)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </TabsContent>

        {/* Links Tab */}
        <TabsContent value="links">
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Social Links</CardTitle>
                    <CardDescription className="text-white/60">
                      Drag to reorder. Add links to your social profiles and websites.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SortableLinks links={links} onLinksChange={handleLinksChange} />
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Preview */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="sticky top-6"
              >
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-base">Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="max-w-[320px] mx-auto">
                      <ProfilePreview
                        profile={formData}
                        links={links}
                        template="dark-modern"
                        onShare={() => setShareModalOpen(true)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AnalyticsCharts />
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Share Modal */}
      <ShareModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        profileUrl={`https://carve.app/${formData.username}`}
        profileName={formData.name}
      />
    </div>
  )
}
