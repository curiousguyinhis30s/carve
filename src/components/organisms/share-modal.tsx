'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Copy,
  Check,
  Mail,
  MessageSquare,
  Twitter,
  Linkedin,
  Facebook,
  Download,
  QrCode,
  Link as LinkIcon,
  Smartphone,
} from 'lucide-react'
import { toast } from 'sonner'

interface ShareModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profileUrl: string
  profileName: string
}

export function ShareModal({ open, onOpenChange, profileUrl, profileName }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [qrColor, setQrColor] = useState('#000000')
  const [qrBgColor, setQrBgColor] = useState('#FFFFFF')

  const handleCopy = async () => {
    await navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    toast.success('Link copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(profileUrl)
    const encodedText = encodeURIComponent(`Check out my digital business card: ${profileName}`)

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      email: `mailto:?subject=${encodeURIComponent(`Connect with ${profileName}`)}&body=${encodedText}%0A%0A${encodedUrl}`,
      sms: `sms:?body=${encodedText}%20${encodedUrl}`,
    }

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
  }

  const handleDownloadQR = () => {
    const svg = document.getElementById('share-qr-code')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = 512
      canvas.height = 512
      ctx?.drawImage(img, 0, 0, 512, 512)
      const pngUrl = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.href = pngUrl
      downloadLink.download = `${profileName.replace(/\s+/g, '-')}-qr-code.png`
      downloadLink.click()
      toast.success('QR code downloaded!')
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Connect with ${profileName}`,
          text: 'Check out my digital business card',
          url: profileUrl,
        })
      } catch (err) {
        // User cancelled or share failed
        console.log('Share cancelled')
      }
    } else {
      handleCopy()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#1A1A1A] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Share Your Profile</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="link" className="mt-4">
          <TabsList className="grid w-full grid-cols-3 bg-white/5">
            <TabsTrigger value="link" className="data-[state=active]:bg-[var(--coral)]">
              <LinkIcon className="h-4 w-4 mr-2" />
              Link
            </TabsTrigger>
            <TabsTrigger value="qr" className="data-[state=active]:bg-[var(--coral)]">
              <QrCode className="h-4 w-4 mr-2" />
              QR Code
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-[var(--coral)]">
              <Smartphone className="h-4 w-4 mr-2" />
              Social
            </TabsTrigger>
          </TabsList>

          {/* Link Tab */}
          <TabsContent value="link" className="space-y-4 mt-4">
            <div className="flex gap-2">
              <Input
                value={profileUrl}
                readOnly
                className="bg-white/5 border-white/10 text-white"
              />
              <Button
                onClick={handleCopy}
                className="bg-[var(--coral)] hover:bg-[var(--coral-dark)] shrink-0"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="pt-4 border-t border-white/10">
              <p className="text-sm text-white/60 mb-3">Quick share</p>
              <div className="grid grid-cols-5 gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShare('email')}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition"
                >
                  <Mail className="h-5 w-5 text-red-400" />
                  <span className="text-xs text-white/60">Email</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShare('sms')}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition"
                >
                  <MessageSquare className="h-5 w-5 text-green-400" />
                  <span className="text-xs text-white/60">SMS</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShare('twitter')}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition"
                >
                  <Twitter className="h-5 w-5 text-blue-400" />
                  <span className="text-xs text-white/60">Twitter</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShare('linkedin')}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition"
                >
                  <Linkedin className="h-5 w-5 text-blue-500" />
                  <span className="text-xs text-white/60">LinkedIn</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShare('facebook')}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition"
                >
                  <Facebook className="h-5 w-5 text-blue-600" />
                  <span className="text-xs text-white/60">Facebook</span>
                </motion.button>
              </div>
            </div>

            {typeof window !== 'undefined' && 'share' in navigator && (
              <Button
                onClick={handleNativeShare}
                className="w-full bg-white/10 hover:bg-white/20 text-white mt-4"
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Share via Device
              </Button>
            )}
          </TabsContent>

          {/* QR Code Tab */}
          <TabsContent value="qr" className="space-y-4 mt-4">
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-6 rounded-2xl bg-white"
              >
                <QRCodeSVG
                  id="share-qr-code"
                  value={profileUrl}
                  size={200}
                  level="H"
                  fgColor={qrColor}
                  bgColor={qrBgColor}
                  includeMargin={false}
                />
              </motion.div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/60">QR Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="w-12 h-10 p-1 bg-transparent border-white/20 cursor-pointer"
                  />
                  <Input
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white/60">Background</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={qrBgColor}
                    onChange={(e) => setQrBgColor(e.target.value)}
                    className="w-12 h-10 p-1 bg-transparent border-white/20 cursor-pointer"
                  />
                  <Input
                    value={qrBgColor}
                    onChange={(e) => setQrBgColor(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleDownloadQR}
                className="flex-1 bg-[var(--coral)] hover:bg-[var(--coral-dark)]"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PNG
              </Button>
              <Button
                variant="outline"
                onClick={handleCopy}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </TabsContent>

          {/* Social Tab */}
          <TabsContent value="social" className="space-y-4 mt-4">
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleShare('linkedin')}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/30 transition"
              >
                <Linkedin className="h-6 w-6 text-[#0A66C2]" />
                <div className="text-left">
                  <p className="font-medium text-white">Share on LinkedIn</p>
                  <p className="text-sm text-white/60">Share with your professional network</p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleShare('twitter')}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border border-[#1DA1F2]/30 transition"
              >
                <Twitter className="h-6 w-6 text-[#1DA1F2]" />
                <div className="text-left">
                  <p className="font-medium text-white">Share on Twitter</p>
                  <p className="text-sm text-white/60">Tweet your digital card</p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleShare('facebook')}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 transition"
              >
                <Facebook className="h-6 w-6 text-[#1877F2]" />
                <div className="text-left">
                  <p className="font-medium text-white">Share on Facebook</p>
                  <p className="text-sm text-white/60">Share with friends and family</p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleShare('email')}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition"
              >
                <Mail className="h-6 w-6 text-red-400" />
                <div className="text-left">
                  <p className="font-medium text-white">Send via Email</p>
                  <p className="text-sm text-white/60">Open in your email client</p>
                </div>
              </motion.button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
