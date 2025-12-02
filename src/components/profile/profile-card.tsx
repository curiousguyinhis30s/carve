'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  Mail,
  Phone,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Github,
  MessageCircle,
  Calendar,
  Link as LinkIcon,
  Download,
  Share2,
  QrCode,
  X,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { downloadVCard } from '@/lib/vcard'
import type { Profile, ProfileLink } from '@/types/database'

interface ProfileCardProps {
  profile: Profile
  links: ProfileLink[]
}

const LINK_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  email: Mail,
  phone: Phone,
  website: Globe,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  github: Github,
  whatsapp: MessageCircle,
  calendly: Calendar,
  custom: LinkIcon,
}

export function ProfileCard({ profile, links }: ProfileCardProps) {
  const [showQR, setShowQR] = useState(false)

  const profileUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/${profile.username}`
    : `/${profile.username}`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile.name,
          text: profile.bio || `Connect with ${profile.name}`,
          url: profileUrl,
        })
      } catch (err) {
        // User cancelled or share failed
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(profileUrl)
      // You could show a toast here
    }
  }

  const handleSaveContact = () => {
    downloadVCard(profile, links)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getLinkHref = (link: ProfileLink) => {
    switch (link.type) {
      case 'email':
        return link.url.startsWith('mailto:') ? link.url : `mailto:${link.url}`
      case 'phone':
        return link.url.startsWith('tel:') ? link.url : `tel:${link.url}`
      case 'whatsapp':
        if (link.url.includes('wa.me')) return link.url
        return `https://wa.me/${link.url.replace(/\D/g, '')}`
      default:
        return link.url.startsWith('http') ? link.url : `https://${link.url}`
    }
  }

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden">
      {/* Cover Image */}
      {profile.cover_url && (
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
          <img
            src={profile.cover_url}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <CardContent className="p-6">
        {/* Avatar & Basic Info */}
        <div className={`flex flex-col items-center ${profile.cover_url ? '-mt-16' : ''}`}>
          <Avatar className="h-24 w-24 border-4 border-slate-900 shadow-xl">
            <AvatarImage src={profile.avatar_url || ''} alt={profile.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>

          <h1 className="mt-4 text-2xl font-bold text-white">{profile.name}</h1>

          {profile.title && (
            <p className="mt-1 text-slate-300">{profile.title}</p>
          )}

          {profile.company && (
            <Badge variant="secondary" className="mt-2 bg-white/10 text-slate-200">
              {profile.company}
            </Badge>
          )}

          {profile.bio && (
            <p className="mt-4 text-center text-slate-400 text-sm max-w-xs">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 justify-center">
          <Button
            onClick={handleSaveContact}
            className="flex-1 max-w-[140px] bg-blue-600 hover:bg-blue-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Save Contact
          </Button>

          <Button
            variant="outline"
            onClick={handleShare}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Share2 className="h-4 w-4" />
          </Button>

          <Dialog open={showQR} onOpenChange={setShowQR}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <QrCode className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">Scan to Connect</DialogTitle>
              </DialogHeader>
              <div className="flex justify-center p-6">
                <div className="bg-white p-4 rounded-xl">
                  <QRCodeSVG
                    value={profileUrl}
                    size={200}
                    level="H"
                    includeMargin={false}
                  />
                </div>
              </div>
              <p className="text-center text-slate-400 text-sm">
                Scan this QR code to view {profile.name}&apos;s profile
              </p>
            </DialogContent>
          </Dialog>
        </div>

        {/* Links */}
        {links.length > 0 && (
          <div className="mt-8 space-y-3">
            {links.map(link => {
              const Icon = LINK_ICONS[link.type] || LinkIcon
              return (
                <a
                  key={link.id}
                  href={getLinkHref(link)}
                  target={link.type === 'email' || link.type === 'phone' ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                >
                  <div className="p-2 rounded-lg bg-white/10">
                    <Icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <span className="text-white font-medium">{link.label}</span>
                </a>
              )
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-slate-500 text-xs">
            Powered by{' '}
            <a href="/" className="text-blue-400 hover:underline">
              Hendshake
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
