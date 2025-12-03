'use client'

import { useState } from 'react'
import { useDemo, DEMO_TEAM_MEMBERS } from '@/contexts/demo-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Users,
  TrendingUp,
  MousePointerClick,
  Eye,
  CreditCard,
  Settings,
  Plus,
  Check,
  Palette,
  Layout,
  Save,
  Mail,
  Phone,
  Globe,
  Building,
  Briefcase,
  FileText,
} from 'lucide-react'
import { toast } from 'sonner'

// Card templates
const CARD_TEMPLATES = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and professional',
    preview: {
      bg: '#FFFFFF',
      accent: '#0A0A0A',
      text: '#0A0A0A',
    },
  },
  {
    id: 'dark-modern',
    name: 'Dark Modern',
    description: 'Bold dark theme',
    preview: {
      bg: '#0A0A0A',
      accent: '#FF6B5B',
      text: '#FFFFFF',
    },
  },
  {
    id: 'gradient-coral',
    name: 'Coral Gradient',
    description: 'Vibrant and energetic',
    preview: {
      bg: 'linear-gradient(135deg, #FF6B5B 0%, #FF8F85 100%)',
      accent: '#FFFFFF',
      text: '#FFFFFF',
    },
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Calm and trustworthy',
    preview: {
      bg: '#1E3A5F',
      accent: '#4AA8D8',
      text: '#FFFFFF',
    },
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    description: 'Eco-friendly look',
    preview: {
      bg: '#1A3A2F',
      accent: '#4ADE80',
      text: '#FFFFFF',
    },
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    description: 'Premium and elegant',
    preview: {
      bg: '#2D1B4E',
      accent: '#A78BFA',
      text: '#FFFFFF',
    },
  },
]

// Display settings fields
const DISPLAY_FIELDS = [
  { id: 'name', label: 'Full Name', icon: Users, description: 'Show name on profile' },
  { id: 'title', label: 'Job Title', icon: Briefcase, description: 'Show job title' },
  { id: 'company', label: 'Company', icon: Building, description: 'Show company name' },
  { id: 'bio', label: 'Bio', icon: FileText, description: 'Show bio/description' },
  { id: 'email', label: 'Email', icon: Mail, description: 'Show email address' },
  { id: 'phone', label: 'Phone', icon: Phone, description: 'Show phone number' },
  { id: 'website', label: 'Website', icon: Globe, description: 'Show website link' },
  { id: 'social_links', label: 'Social Links', icon: Globe, description: 'Show social media links' },
  { id: 'qr_code', label: 'QR Code', icon: CreditCard, description: 'Show QR code on card back' },
]

export default function DemoAdminPage() {
  const { demoUser, demoProfile } = useDemo()

  // Display settings state
  const [displaySettings, setDisplaySettings] = useState<Record<string, boolean>>({
    name: true,
    title: true,
    company: true,
    bio: true,
    email: true,
    phone: true,
    website: true,
    social_links: true,
    qr_code: true,
  })

  // Selected template for team
  const [selectedTemplate, setSelectedTemplate] = useState('dark-modern')

  // Team card assignment
  const [teamCards, setTeamCards] = useState<Record<string, string>>({
    'team-1': 'dark-modern',
    'team-2': 'minimal',
    'team-3': 'coral-gradient',
    'team-4': 'ocean-blue',
    'team-5': 'forest-green',
  })

  const handleToggleField = (fieldId: string) => {
    setDisplaySettings(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }))
    toast.success(`${fieldId.replace('_', ' ')} ${displaySettings[fieldId] ? 'hidden' : 'visible'}`)
  }

  const handleSaveSettings = () => {
    toast.success('Display settings saved!', {
      description: 'Changes applied to all team cards (demo mode)',
    })
  }

  const handleApplyTemplateToAll = () => {
    const newTeamCards: Record<string, string> = {}
    DEMO_TEAM_MEMBERS.forEach(member => {
      newTeamCards[member.id] = selectedTemplate
    })
    setTeamCards(newTeamCards)
    toast.success('Template applied to all team members!')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Stats
  const totalViews = DEMO_TEAM_MEMBERS.reduce((sum, m) => sum + m.profile_views, 0)
  const totalTaps = DEMO_TEAM_MEMBERS.reduce((sum, m) => sum + m.card_taps, 0)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Team Overview</h1>
          <p className="text-white/60">Manage your team&apos;s digital business cards</p>
        </div>
        <Button
          onClick={handleSaveSettings}
          className="bg-[var(--coral)] hover:bg-[var(--coral-dark)] text-white"
        >
          <Save className="mr-2 h-4 w-4" />
          Save All Settings
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{DEMO_TEAM_MEMBERS.length}</p>
                <p className="text-sm text-white/60">Team Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{totalViews}</p>
                <p className="text-sm text-white/60">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[var(--coral)]/10">
                <MousePointerClick className="h-6 w-6 text-[var(--coral)]" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{totalTaps}</p>
                <p className="text-sm text-white/60">Card Taps</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/10">
                <CreditCard className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{DEMO_TEAM_MEMBERS.filter(m => m.status === 'active').length}</p>
                <p className="text-sm text-white/60">Active Cards</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Display Settings */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--coral)]/10">
                <Settings className="h-5 w-5 text-[var(--coral)]" />
              </div>
              <div>
                <CardTitle className="text-white">Display Settings</CardTitle>
                <CardDescription className="text-white/60">
                  Control what information appears on team profiles
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {DISPLAY_FIELDS.map((field) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition"
                >
                  <div className="flex items-center gap-3">
                    <field.icon className="h-5 w-5 text-white/60" />
                    <div>
                      <p className="font-medium text-white">{field.label}</p>
                      <p className="text-sm text-white/40">{field.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={displaySettings[field.id]}
                    onCheckedChange={() => handleToggleField(field.id)}
                    className="data-[state=checked]:bg-[var(--coral)]"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Card Templates */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Palette className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Card Templates</CardTitle>
                  <CardDescription className="text-white/60">
                    Default templates for team cards
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={handleApplyTemplateToAll}
              >
                Apply to All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {CARD_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-4 rounded-xl border-2 text-left transition ${
                    selectedTemplate === template.id
                      ? 'border-[var(--coral)] bg-[var(--coral)]/5'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  {/* Template Preview */}
                  <div
                    className="h-16 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: template.preview.bg,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: template.preview.accent }}
                      />
                      <div className="space-y-1">
                        <div
                          className="w-12 h-2 rounded"
                          style={{ backgroundColor: template.preview.text, opacity: 0.8 }}
                        />
                        <div
                          className="w-8 h-1.5 rounded"
                          style={{ backgroundColor: template.preview.text, opacity: 0.5 }}
                        />
                      </div>
                    </div>
                    {selectedTemplate === template.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--coral)] flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="font-medium text-white text-sm">{template.name}</p>
                  <p className="text-xs text-white/50">{template.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-white">Team Members</CardTitle>
                <CardDescription className="text-white/60">
                  Manage individual team member cards
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {DEMO_TEAM_MEMBERS.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar_url} />
                    <AvatarFallback className="bg-[var(--coral)] text-white">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white">{member.name}</p>
                      <Badge
                        variant={member.status === 'active' ? 'default' : 'secondary'}
                        className={
                          member.status === 'active'
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }
                      >
                        {member.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/60">{member.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-white">{member.profile_views}</p>
                    <p className="text-xs text-white/40">Views</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-white">{member.card_taps}</p>
                    <p className="text-xs text-white/40">Taps</p>
                  </div>
                  <Select
                    value={teamCards[member.id] || selectedTemplate}
                    onValueChange={(value) => {
                      setTeamCards(prev => ({ ...prev, [member.id]: value }))
                      toast.success(`Template updated for ${member.name}`)
                    }}
                  >
                    <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Template" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-white/10">
                      {CARD_TEMPLATES.map((template) => (
                        <SelectItem key={template.id} value={template.id} className="text-white">
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
