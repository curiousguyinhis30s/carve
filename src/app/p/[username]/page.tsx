'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { QRCodeSVG } from 'qrcode.react'
import {
  Mail,
  ExternalLink,
  Globe,
  Linkedin,
  Twitter,
  Github,
  CreditCard,
  ArrowUpRight,
  MapPin,
  Calendar,
  Download,
  Share2,
} from 'lucide-react'

// Mock user data
const user = {
  name: 'Sarah Chen',
  username: 'sarahchen',
  headline: 'Product Designer',
  bio: 'I create digital experiences that users love. With 5+ years of experience in product design, I specialize in creating intuitive interfaces for complex problems.',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
  location: 'San Francisco, CA',
  company: {
    name: 'Acme Inc.',
    slug: 'acme-inc',
  },
  accentColor: '#FF5A5F',
  email: 'sarah@example.com',
  socialLinks: {
    website: 'https://sarahchen.design',
    linkedin: 'https://linkedin.com/in/sarahchen',
    twitter: 'https://twitter.com/sarahchen',
    github: 'https://github.com/sarahchen',
  },
}

const projects = [
  {
    id: '1',
    title: 'E-commerce Redesign',
    description: 'Complete redesign of a major e-commerce platform improving conversion by 40%',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    link: 'https://example.com/project1',
    tags: ['UI/UX', 'E-commerce'],
    year: '2024',
  },
  {
    id: '2',
    title: 'Mobile Banking App',
    description: 'Award-winning mobile banking experience for a leading fintech startup',
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=600&h=400&fit=crop',
    link: 'https://example.com/project2',
    tags: ['Mobile', 'Fintech'],
    year: '2023',
  },
  {
    id: '3',
    title: 'SaaS Dashboard',
    description: 'Analytics dashboard for enterprise SaaS platform with real-time data visualization',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    link: 'https://example.com/project3',
    tags: ['Dashboard', 'SaaS'],
    year: '2023',
  },
  {
    id: '4',
    title: 'Healthcare Platform',
    description: 'Patient management system redesign for improved healthcare delivery',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop',
    link: 'https://example.com/project4',
    tags: ['Healthcare', 'UI/UX'],
    year: '2022',
  },
]

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function PublicPortfolioPage({
  params,
}: {
  params: { username: string }
}) {
  const [showShare, setShowShare] = useState(false)
  const pageUrl = `https://carve.app/p/${params.username}`

  const handleDownloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${user.name}
TITLE:${user.headline}
EMAIL:${user.email}
URL:${user.socialLinks.website}
END:VCARD`

    const blob = new Blob([vcard], { type: 'text/vcard' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${user.name.replace(/\s+/g, '_')}.vcf`
    a.click()
  }

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[var(--stone)]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--coral)] to-[var(--coral-dark)] flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[var(--ink)]">Carve</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadVCard}>
              <Download className="w-4 h-4 mr-2" />
              Save Contact
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowShare(!showShare)}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Share Modal */}
      {showShare && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowShare(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 text-center max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-[var(--ink)] mb-4">
              Share Portfolio
            </h3>
            <div className="bg-white p-4 rounded-xl border border-[var(--stone)] inline-block">
              <QRCodeSVG
                value={pageUrl}
                size={180}
                level="H"
                fgColor="#1E1E2F"
                bgColor="#FFFFFF"
              />
            </div>
            <p className="text-sm text-[var(--ink-muted)] mt-4 break-all">
              {pageUrl}
            </p>
            <Button
              className="mt-4 w-full"
              onClick={() => {
                navigator.clipboard.writeText(pageUrl)
                setShowShare(false)
              }}
            >
              Copy Link
            </Button>
          </motion.div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col md:flex-row gap-8 items-start"
          >
            {/* Avatar & Info */}
            <motion.div variants={fadeInUp} className="shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover shadow-lg"
              />
            </motion.div>

            <div className="flex-1">
              <motion.div variants={fadeInUp}>
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--ink)]">
                  {user.name}
                </h1>
                <p
                  className="text-lg font-medium mt-1"
                  style={{ color: user.accentColor }}
                >
                  {user.headline}
                </p>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap items-center gap-4 mt-4"
              >
                {user.company && (
                  <Link
                    href={`/company/${user.company.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
                  >
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center"
                      style={{ backgroundColor: user.accentColor }}
                    >
                      <CreditCard className="w-3 h-3 text-white" />
                    </div>
                    {user.company.name}
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                )}
                {user.location && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-muted)]">
                    <MapPin className="w-4 h-4" />
                    {user.location}
                  </span>
                )}
              </motion.div>

              <motion.p
                variants={fadeInUp}
                className="text-[var(--ink-light)] mt-4 max-w-2xl leading-relaxed"
              >
                {user.bio}
              </motion.p>

              {/* Social Links */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-2 mt-6"
              >
                {user.socialLinks.website && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={user.socialLinks.website} target="_blank">
                      <Globe className="w-4 h-4 mr-2" />
                      Website
                    </Link>
                  </Button>
                )}
                {user.socialLinks.linkedin && (
                  <Button variant="outline" size="icon" asChild>
                    <Link href={user.socialLinks.linkedin} target="_blank">
                      <Linkedin className="w-4 h-4" />
                    </Link>
                  </Button>
                )}
                {user.socialLinks.twitter && (
                  <Button variant="outline" size="icon" asChild>
                    <Link href={user.socialLinks.twitter} target="_blank">
                      <Twitter className="w-4 h-4" />
                    </Link>
                  </Button>
                )}
                {user.socialLinks.github && (
                  <Button variant="outline" size="icon" asChild>
                    <Link href={user.socialLinks.github} target="_blank">
                      <Github className="w-4 h-4" />
                    </Link>
                  </Button>
                )}
                <Button
                  size="sm"
                  style={{ backgroundColor: user.accentColor }}
                  className="hover:opacity-90"
                  asChild
                >
                  <Link href={`mailto:${user.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Me
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeInUp}
              className="flex items-center justify-between mb-8"
            >
              <h2 className="text-2xl font-bold text-[var(--ink)]">
                Selected Work
              </h2>
              <span className="text-sm text-[var(--ink-muted)]">
                {projects.length} projects
              </span>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  variants={fadeInUp}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Link
                    href={project.link}
                    target="_blank"
                    className="block bg-white rounded-2xl border border-[var(--stone)] overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                          <ExternalLink className="w-4 h-4 text-[var(--ink)]" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-[var(--ink)] group-hover:text-[var(--coral)] transition-colors">
                          {project.title}
                        </h3>
                        <span className="text-xs text-[var(--ink-muted)] shrink-0">
                          {project.year}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--ink-muted)] mt-2 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex gap-2 mt-3">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-full bg-[var(--cream)] text-xs font-medium text-[var(--ink-muted)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[var(--ink)]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Let&apos;s work together
          </h2>
          <p className="text-white/70 mb-8">
            I&apos;m always open to discussing new projects and opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="rounded-full px-8"
              style={{ backgroundColor: user.accentColor }}
              asChild
            >
              <Link href={`mailto:${user.email}`}>
                <Mail className="w-4 h-4 mr-2" />
                Get in Touch
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 border-white/20 text-white hover:bg-white/10"
              onClick={handleDownloadVCard}
            >
              <Download className="w-4 h-4 mr-2" />
              Download vCard
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-[var(--stone)] bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--ink-muted)] hover:text-[var(--ink)]"
          >
            <CreditCard className="w-4 h-4" />
            Create your own portfolio with Carve
          </Link>
        </div>
      </footer>
    </div>
  )
}
