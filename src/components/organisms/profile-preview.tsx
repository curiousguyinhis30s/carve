'use client'

import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Mail,
  Phone,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
  Github,
  Youtube,
  Facebook,
  ExternalLink,
  Download,
  Share2,
  Copy,
  Check,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface ProfileLink {
  id?: string
  type: string
  url: string
  label: string
  order: number
}

interface ProfileData {
  name: string
  title: string
  company: string
  bio: string
  email: string
  phone: string
  website: string
  avatar_url: string
  username?: string
}

interface ProfilePreviewProps {
  profile: ProfileData
  links: ProfileLink[]
  template?: string
  showQR?: boolean
  onShare?: () => void
}

const TEMPLATE_STYLES: Record<string, { bg: string; accent: string; text: string; card: string }> = {
  'minimal': {
    bg: 'bg-white',
    accent: 'bg-[#0A0A0A]',
    text: 'text-[#0A0A0A]',
    card: 'bg-white border border-gray-200',
  },
  'dark-modern': {
    bg: 'bg-[#0A0A0A]',
    accent: 'bg-[var(--coral)]',
    text: 'text-white',
    card: 'bg-white/5 border border-white/10',
  },
  'gradient-coral': {
    bg: 'bg-gradient-to-br from-[#FF6B5B] to-[#FF8F85]',
    accent: 'bg-white',
    text: 'text-white',
    card: 'bg-white/10 border border-white/20',
  },
  'ocean-blue': {
    bg: 'bg-[#1E3A5F]',
    accent: 'bg-[#4AA8D8]',
    text: 'text-white',
    card: 'bg-white/5 border border-white/10',
  },
  'forest-green': {
    bg: 'bg-[#1A3A2F]',
    accent: 'bg-[#4ADE80]',
    text: 'text-white',
    card: 'bg-white/5 border border-white/10',
  },
  'royal-purple': {
    bg: 'bg-[#2D1B4E]',
    accent: 'bg-[#A78BFA]',
    text: 'text-white',
    card: 'bg-white/5 border border-white/10',
  },
}

const LINK_ICONS: Record<string, React.ElementType> = {
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  github: Github,
  youtube: Youtube,
  facebook: Facebook,
  website: Globe,
  email: Mail,
  phone: Phone,
}

export function ProfilePreview({
  profile,
  links,
  template = 'dark-modern',
  showQR = true,
  onShare,
}: ProfilePreviewProps) {
  const [copied, setCopied] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const styles = TEMPLATE_STYLES[template] || TEMPLATE_STYLES['dark-modern']

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const profileUrl = `https://carve.app/${profile.username || 'demo'}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    toast.success('Link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadVCard = () => {
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.name}
TITLE:${profile.title}
ORG:${profile.company}
EMAIL:${profile.email}
TEL:${profile.phone}
URL:${profile.website}
NOTE:${profile.bio}
END:VCARD`

    const blob = new Blob([vCard], { type: 'text/vcard' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${profile.name.replace(/\s+/g, '_')}.vcf`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Contact downloaded!')
  }

  return (
    <div className="relative w-full max-w-sm mx-auto perspective-1000">
      <motion.div
        className="relative preserve-3d cursor-pointer"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        onClick={() => setFlipped(!flipped)}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of Card */}
        <div
          className={`${styles.bg} ${styles.card} rounded-3xl p-6 shadow-2xl backface-hidden`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Avatar className="h-20 w-20 ring-4 ring-white/20">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className={`${styles.accent} text-white text-xl font-bold`}>
                  {getInitials(profile.name || 'U')}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                className={`${styles.text} hover:bg-white/10`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopy()
                }}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className={`${styles.text} hover:bg-white/10`}
                onClick={(e) => {
                  e.stopPropagation()
                  onShare?.()
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Info */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h2 className={`text-2xl font-bold ${styles.text}`}>{profile.name || 'Your Name'}</h2>
            <p className={`${styles.text} opacity-70`}>{profile.title || 'Your Title'}</p>
            {profile.company && (
              <p className={`${styles.text} opacity-50 text-sm`}>{profile.company}</p>
            )}
          </motion.div>

          {/* Bio */}
          {profile.bio && (
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`text-sm ${styles.text} opacity-60 mb-6 line-clamp-3`}
            >
              {profile.bio}
            </motion.p>
          )}

          {/* Contact Buttons */}
          <div className="flex gap-2 mb-6">
            {profile.email && (
              <Button
                size="sm"
                className={`${styles.accent} text-white flex-1`}
                onClick={(e) => {
                  e.stopPropagation()
                  window.location.href = `mailto:${profile.email}`
                }}
              >
                <Mail className="h-4 w-4 mr-1" />
                Email
              </Button>
            )}
            {profile.phone && (
              <Button
                size="sm"
                variant="outline"
                className={`${styles.text} border-current/20 flex-1`}
                onClick={(e) => {
                  e.stopPropagation()
                  window.location.href = `tel:${profile.phone}`
                }}
              >
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
            )}
          </div>

          {/* Social Links */}
          {links.length > 0 && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              {links.slice(0, 4).map((link, index) => {
                const Icon = LINK_ICONS[link.type] || ExternalLink
                return (
                  <motion.a
                    key={link.id || index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-3 rounded-xl ${styles.card} hover:scale-[1.02] transition-transform`}
                    onClick={(e) => e.stopPropagation()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className={`h-5 w-5 ${styles.text} opacity-70`} />
                    <span className={`flex-1 ${styles.text}`}>
                      {link.label || link.type.charAt(0).toUpperCase() + link.type.slice(1)}
                    </span>
                    <ExternalLink className={`h-4 w-4 ${styles.text} opacity-40`} />
                  </motion.a>
                )
              })}
              {links.length > 4 && (
                <p className={`text-center text-sm ${styles.text} opacity-50`}>
                  +{links.length - 4} more links
                </p>
              )}
            </motion.div>
          )}

          {/* Save Contact Button */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <Button
              className={`w-full ${styles.accent} text-white`}
              onClick={(e) => {
                e.stopPropagation()
                handleDownloadVCard()
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Save Contact
            </Button>
          </motion.div>

          {/* Tap hint */}
          <p className={`text-center text-xs ${styles.text} opacity-30 mt-4`}>
            Tap card to flip
          </p>
        </div>

        {/* Back of Card (QR Code) */}
        <div
          className={`${styles.bg} ${styles.card} rounded-3xl p-6 shadow-2xl absolute inset-0 backface-hidden flex flex-col items-center justify-center`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {showQR && (
            <>
              <div className="bg-white p-4 rounded-2xl mb-4">
                <QRCodeSVG
                  value={profileUrl}
                  size={180}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <p className={`text-lg font-semibold ${styles.text} mb-2`}>Scan to Connect</p>
              <p className={`text-sm ${styles.text} opacity-60 text-center`}>
                {profileUrl}
              </p>
              <Button
                className={`mt-6 ${styles.accent} text-white`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopy()
                }}
              >
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                Copy Link
              </Button>
            </>
          )}
          <p className={`text-center text-xs ${styles.text} opacity-30 mt-4`}>
            Tap to flip back
          </p>
        </div>
      </motion.div>
    </div>
  )
}
