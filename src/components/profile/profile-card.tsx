'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
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
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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
      } catch {
        // Share cancelled
      }
    } else {
      await navigator.clipboard.writeText(profileUrl)
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
        if (link.url.startsWith('/')) return link.url
        return link.url.startsWith('http') ? link.url : `https://${link.url}`
    }
  }

  const isInternalLink = (url: string) => url.startsWith('/')

  // Separate social links from action links
  const socialLinks = links.filter(l => ['linkedin', 'twitter', 'instagram', 'facebook', 'youtube', 'github'].includes(l.type))
  const actionLinks = links.filter(l => !['linkedin', 'twitter', 'instagram', 'facebook', 'youtube', 'github'].includes(l.type))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full max-w-sm mx-auto"
    >
      {/* Clean Card Container */}
      <div className="bg-white rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
        {/* Profile Image - Circular, Centered */}
        <div className="pt-10 pb-6 px-6 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="relative inline-block"
          >
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="w-28 h-28 rounded-full object-cover ring-4 ring-gray-50"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center ring-4 ring-gray-50">
                <span className="text-3xl font-semibold text-white">
                  {getInitials(profile.name)}
                </span>
              </div>
            )}
          </motion.div>

          {/* Name & Title */}
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-5 text-2xl font-semibold text-gray-900 tracking-tight"
          >
            {profile.name}
          </motion.h1>

          {profile.title && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-1 text-sm text-gray-500"
            >
              {profile.title}
              {profile.company && (
                <span className="text-gray-400"> · {profile.company}</span>
              )}
            </motion.p>
          )}

          {/* Bio */}
          {profile.bio && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-4 text-sm text-gray-500 leading-relaxed max-w-xs mx-auto"
            >
              {profile.bio}
            </motion.p>
          )}
        </div>

        {/* Primary Actions - Clean Row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-6 pb-6"
        >
          <div className="flex gap-2">
            <Button
              onClick={handleSaveContact}
              className="flex-1 h-11 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium text-sm"
            >
              <Download className="mr-2 h-4 w-4" />
              Save Contact
            </Button>

            <Dialog open={showQR} onOpenChange={setShowQR}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 w-11 p-0 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl"
                >
                  <QrCode className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border-gray-200 max-w-xs rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-gray-900 text-center font-semibold">Scan to Connect</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center p-6">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <QRCodeSVG
                      value={profileUrl}
                      size={160}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                </div>
                <p className="text-center text-gray-400 text-sm pb-2">
                  Scan to view {profile.name}&apos;s profile
                </p>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              onClick={handleShare}
              className="h-11 w-11 p-0 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Social Icons - Minimal Row */}
        {socialLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="px-6 pb-6"
          >
            <div className="flex justify-center gap-1">
              {socialLinks.map((link, index) => {
                const Icon = LINK_ICONS[link.type] || LinkIcon
                return (
                  <motion.a
                    key={link.id}
                    href={getLinkHref(link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35 + index * 0.03 }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Action Links - Clean List */}
        {actionLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="border-t border-gray-100"
          >
            {actionLinks.map((link, index) => {
              const Icon = LINK_ICONS[link.type] || LinkIcon
              const href = getLinkHref(link)
              const isInternal = isInternalLink(link.url)
              const shouldOpenInNewTab = !isInternal && link.type !== 'email' && link.type !== 'phone'

              return (
                <motion.a
                  key={link.id}
                  href={href}
                  target={shouldOpenInNewTab ? '_blank' : undefined}
                  rel={shouldOpenInNewTab ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <Icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <span className="text-gray-900 font-medium text-sm flex-1">{link.label}</span>
                  <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-400 transition-colors" />
                </motion.a>
              )
            })}
          </motion.div>
        )}

        {/* Footer - Subtle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="py-4 text-center bg-gray-50"
        >
          <a
            href="/"
            className="text-gray-400 text-xs hover:text-gray-500 transition-colors"
          >
            Powered by Carve
          </a>
        </motion.div>
      </div>
    </motion.div>
  )
}
