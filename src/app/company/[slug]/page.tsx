'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { QRCodeSVG } from 'qrcode.react'
import {
  Building2,
  MapPin,
  Globe,
  Users,
  Mail,
  Phone,
  ExternalLink,
  Linkedin,
  Twitter,
  CreditCard,
  ArrowRight,
  ChevronRight,
  Briefcase,
} from 'lucide-react'

// Mock company data
const company = {
  name: 'Acme Inc.',
  slug: 'acme-inc',
  tagline: 'Building the future of digital networking',
  description: 'Acme Inc. is a leading technology company specializing in innovative SaaS solutions. We help businesses transform their digital presence and connect with customers in meaningful ways.',
  logo: null,
  coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop',
  industry: 'Technology',
  size: '50-200 employees',
  founded: '2018',
  location: 'San Francisco, CA',
  website: 'https://acme.com',
  primaryColor: '#FF5A5F',
  socialLinks: {
    linkedin: 'https://linkedin.com/company/acme',
    twitter: 'https://twitter.com/acme',
  },
  contact: {
    email: 'hello@acme.com',
    phone: '+1 (555) 123-4567',
  },
}

const teamMembers = [
  {
    id: 1,
    name: 'Sarah Chen',
    title: 'CEO & Founder',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    username: 'sarahchen',
  },
  {
    id: 2,
    name: 'Michael Ross',
    title: 'CTO',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    username: 'michaelross',
  },
  {
    id: 3,
    name: 'Emily Davis',
    title: 'Head of Design',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
    username: 'emilydavis',
  },
  {
    id: 4,
    name: 'James Wilson',
    title: 'VP of Sales',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    username: 'jameswilson',
  },
  {
    id: 5,
    name: 'Lisa Park',
    title: 'Product Manager',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face',
    username: 'lisapark',
  },
  {
    id: 6,
    name: 'David Kim',
    title: 'Engineering Lead',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    username: 'davidkim',
  },
]

export default function CompanyProfilePage({
  params,
}: {
  params: { slug: string }
}) {
  const [showQR, setShowQR] = useState(false)
  const pageUrl = `https://carve.app/company/${params.slug}`

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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowQR(!showQR)}
          >
            Share
          </Button>
        </div>
      </header>

      {/* QR Code Modal */}
      {showQR && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowQR(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 text-center max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-[var(--ink)] mb-4">
              Scan to view company profile
            </h3>
            <div className="bg-white p-4 rounded-xl inline-block">
              <QRCodeSVG
                value={pageUrl}
                size={200}
                level="H"
                fgColor="#1E1E2F"
                bgColor="#FFFFFF"
              />
            </div>
            <p className="text-sm text-[var(--ink-muted)] mt-4">{pageUrl}</p>
          </motion.div>
        </div>
      )}

      {/* Cover Image */}
      <div className="pt-14">
        <div className="relative h-48 md:h-64 overflow-hidden">
          <img
            src={company.coverImage}
            alt={company.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      </div>

      {/* Company Info */}
      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl border border-[var(--stone)] shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Logo */}
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
                style={{ backgroundColor: company.primaryColor }}
              >
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <Building2 className="w-12 h-12 text-white" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[var(--ink)]">
                      {company.name}
                    </h1>
                    <p className="text-[var(--ink-muted)] mt-1">{company.tagline}</p>
                    <div className="flex flex-wrap gap-3 mt-3">
                      <span className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-muted)]">
                        <Briefcase className="w-4 h-4" />
                        {company.industry}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-muted)]">
                        <Users className="w-4 h-4" />
                        {company.size}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-muted)]">
                        <MapPin className="w-4 h-4" />
                        {company.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {company.website && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={company.website} target="_blank">
                          <Globe className="w-4 h-4 mr-2" />
                          Website
                        </Link>
                      </Button>
                    )}
                    {company.socialLinks.linkedin && (
                      <Button variant="outline" size="icon" asChild>
                        <Link href={company.socialLinks.linkedin} target="_blank">
                          <Linkedin className="w-4 h-4" />
                        </Link>
                      </Button>
                    )}
                    {company.socialLinks.twitter && (
                      <Button variant="outline" size="icon" asChild>
                        <Link href={company.socialLinks.twitter} target="_blank">
                          <Twitter className="w-4 h-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>

                <p className="text-[var(--ink-light)] mt-4 leading-relaxed">
                  {company.description}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Bar */}
          <div className="px-6 md:px-8 py-4 bg-[var(--cream)] border-t border-[var(--stone)] flex flex-wrap gap-4">
            {company.contact.email && (
              <Link
                href={`mailto:${company.contact.email}`}
                className="inline-flex items-center gap-2 text-sm text-[var(--ink-muted)] hover:text-[var(--ink)]"
              >
                <Mail className="w-4 h-4" />
                {company.contact.email}
              </Link>
            )}
            {company.contact.phone && (
              <Link
                href={`tel:${company.contact.phone}`}
                className="inline-flex items-center gap-2 text-sm text-[var(--ink-muted)] hover:text-[var(--ink)]"
              >
                <Phone className="w-4 h-4" />
                {company.contact.phone}
              </Link>
            )}
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[var(--ink)]">Our Team</h2>
            <span className="text-sm text-[var(--ink-muted)]">
              {teamMembers.length} members
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/${member.username}`}
                  className="block bg-white rounded-xl border border-[var(--stone)] p-4 text-center hover:shadow-lg hover:border-[var(--coral)]/30 transition-all group"
                >
                  <div className="relative mx-auto w-16 h-16 mb-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                    <div
                      className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center"
                      style={{ backgroundColor: company.primaryColor }}
                    >
                      <Building2 className="w-2.5 h-2.5 text-white" />
                    </div>
                  </div>
                  <p className="font-medium text-[var(--ink)] text-sm truncate">
                    {member.name}
                  </p>
                  <p className="text-xs text-[var(--ink-muted)] truncate">
                    {member.title}
                  </p>
                  <div className="mt-2 flex items-center justify-center gap-1 text-xs text-[var(--coral)] opacity-0 group-hover:opacity-100 transition-opacity">
                    View Profile
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mb-12 p-6 rounded-2xl bg-[var(--ink)] text-white text-center">
          <h3 className="text-lg font-semibold mb-2">
            Interested in working with us?
          </h3>
          <p className="text-white/70 mb-4">
            Get in touch or visit our website to learn more.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              asChild
              className="bg-[var(--coral)] hover:bg-[var(--coral-dark)]"
            >
              <Link href={`mailto:${company.contact.email}`}>
                <Mail className="w-4 h-4 mr-2" />
                Contact Us
              </Link>
            </Button>
            <Button variant="outline" asChild className="border-white/20 text-white hover:bg-white/10">
              <Link href={company.website} target="_blank">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Website
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-[var(--stone)] bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--ink-muted)]">
            <CreditCard className="w-4 h-4" />
            Powered by Carve
          </Link>
        </div>
      </footer>
    </div>
  )
}
