'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion'
import {
  Smartphone,
  QrCode,
  Users,
  BarChart3,
  Zap,
  ArrowRight,
  Check,
  Menu,
  X,
  Sparkles,
  CreditCard,
  Share2,
  Wifi,
  Globe,
  Star,
  Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

/* ===========================================
   CARVE - Landing Page
   Modern, bold, vibrant design with bento grid
   =========================================== */

// Bento grid features - Clean theme-matching design
const features = [
  {
    icon: Smartphone,
    title: 'Tap to Share',
    description: 'One tap on any smartphone. No app needed for recipients. Works with iPhone and Android devices seamlessly.',
    size: 'large', // 2x2
  },
  {
    icon: QrCode,
    title: 'QR Backup',
    description: 'Universal compatibility with QR codes.',
    size: 'small',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Track views and connections.',
    size: 'small',
  },
  {
    icon: Users,
    title: 'Team Cards',
    description: 'Manage your entire organization from one dashboard. Assign templates, track performance, and maintain brand consistency.',
    size: 'wide', // 2x1
  },
  {
    icon: Zap,
    title: 'Instant Updates',
    description: 'Change your info anytime. Cards sync automatically.',
    size: 'medium',
  },
  {
    icon: Share2,
    title: 'Multi-Profile',
    description: 'Work, personal, side projects - switch seamlessly.',
    size: 'medium',
  },
]

const pricingPlans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'For individuals getting started',
    features: ['1 digital profile', 'QR code sharing', 'Basic analytics', 'vCard download'],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/mo',
    description: 'For professionals who network',
    features: [
      '3 profiles',
      '1 NFC card included',
      'Lead capture forms',
      'Advanced analytics',
      'Custom themes',
      'Priority support',
    ],
    cta: 'Get Pro',
    popular: true,
  },
  {
    name: 'Team',
    price: '$8',
    period: '/user/mo',
    description: 'For growing organizations',
    features: [
      'Unlimited profiles',
      'Team dashboard',
      'CRM integrations',
      'Custom branding',
      'SSO authentication',
      'Bulk card orders',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

const steps = [
  {
    number: '01',
    title: 'Create Your Profile',
    description: 'Add your contact info, social links, and portfolio in minutes.',
  },
  {
    number: '02',
    title: 'Get Your Card',
    description: 'Order a physical NFC card or use digital QR sharing instantly.',
  },
  {
    number: '03',
    title: 'Start Connecting',
    description: 'Tap or scan to share. Recipients save your contact with one click.',
  },
]

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  const heroY = useTransform(scrollY, [0, 500], [0, 50])
  // Removed opacity fade - keeps hero visible while scrolling

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[var(--cream)] overflow-x-hidden">
      {/* ============ HEADER - Modern Glass ============ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/70 backdrop-blur-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border-b border-black/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ rotate: -10, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--coral)] to-[var(--coral-dark)] flex items-center justify-center shadow-lg shadow-[var(--coral)]/25"
              >
                <CreditCard className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold text-[var(--ink)]">Carve</span>
            </Link>

            {/* Desktop Navigation - Pill style */}
            <nav className="hidden md:flex items-center gap-1 px-2 py-1.5 bg-black/5 rounded-full">
              {['Features', 'How it Works', 'Pricing'].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-4 py-2 text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-white/60 rounded-full transition-all text-sm font-medium"
                >
                  {item}
                </Link>
              ))}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="ghost"
                asChild
                className="text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-transparent"
              >
                <Link href="/login">Sign in</Link>
              </Button>
              <Button
                asChild
                className="bg-[var(--ink)] hover:bg-[var(--ink-light)] text-white rounded-full px-6 shadow-lg shadow-black/10"
              >
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-black/5 text-[var(--ink)]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-xl border-t border-black/5"
            >
              <div className="px-6 py-6 space-y-2">
                {['Features', 'How it Works', 'Pricing'].map((item) => (
                  <Link
                    key={item}
                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-[var(--ink)] font-medium hover:bg-black/5 transition"
                  >
                    {item}
                  </Link>
                ))}
                <div className="pt-4 space-y-3">
                  <Button variant="outline" asChild className="w-full h-12 rounded-xl border-black/10">
                    <Link href="/login">Sign in</Link>
                  </Button>
                  <Button asChild className="w-full h-12 rounded-xl bg-[var(--coral)] hover:bg-[var(--coral-dark)]">
                    <Link href="/signup">Get Started Free</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ============ HERO - Bold & Dynamic ============ */}
      <section className="relative min-h-screen flex items-center pt-20 pb-12 overflow-hidden">
        {/* Background - Animated gradient mesh */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-[var(--coral)]/30 to-orange-200/20 rounded-full blur-3xl float" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-purple-200/30 to-pink-200/20 rounded-full blur-3xl float-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--sand)]/50 rounded-full blur-3xl" />
        </div>

        <motion.div
          style={{ y: heroY }}
          className="relative w-full"
        >
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
              {/* Left: Copy - Takes 7 columns */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="lg:col-span-7 text-center lg:text-left"
              >
                {/* Badge */}
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--coral)]/10 border border-[var(--coral)]/20 text-[var(--coral)] text-sm font-semibold mb-6">
                  <Star className="w-4 h-4 fill-current" />
                  #1 Digital Business Card Platform
                </motion.div>

                {/* Headline */}
                <motion.h1 variants={fadeInUp} className="text-[var(--ink)] mb-6">
                  Your network,
                  <br />
                  <span className="relative">
                    <span className="text-gradient">one tap away</span>
                    <motion.svg
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 1, duration: 0.8 }}
                      className="absolute -bottom-2 left-0 w-full"
                      viewBox="0 0 300 12"
                      fill="none"
                    >
                      <motion.path
                        d="M2 10C50 4 100 4 150 6C200 8 250 4 298 8"
                        stroke="var(--coral)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        style={{ pathLength: 0 }}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 1, duration: 0.8 }}
                      />
                    </motion.svg>
                  </span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p variants={fadeInUp} className="text-lg md:text-xl text-[var(--ink-muted)] mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  NFC-powered digital business cards that make lasting impressions.
                  Share your details instantly, update anytime, track everything.
                </motion.p>

                {/* CTAs */}
                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button
                    size="lg"
                    asChild
                    className="group bg-[var(--coral)] hover:bg-[var(--coral-dark)] text-white rounded-full px-8 h-14 text-base shadow-xl shadow-[var(--coral)]/25 hover:shadow-2xl hover:shadow-[var(--coral)]/30 transition-all"
                  >
                    <Link href="/signup">
                      Create Your Card Free
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="rounded-full px-8 h-14 text-base border-2 border-[var(--ink)]/10 text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white hover:border-[var(--ink)] transition-all"
                  >
                    <Link href="/demo">
                      <Wifi className="mr-2 w-5 h-5" />
                      Try Demo Card
                    </Link>
                  </Button>
                </motion.div>

                {/* Trust badges */}
                <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6">
                  <div className="flex items-center gap-2 text-sm text-[var(--ink-muted)]">
                    <Check className="w-5 h-5 text-green-500" />
                    Free forever plan
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--ink-muted)]">
                    <Check className="w-5 h-5 text-green-500" />
                    No app required
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--ink-muted)]">
                    <Check className="w-5 h-5 text-green-500" />
                    5,000+ users
                  </div>
                </motion.div>
              </motion.div>

              {/* Right: Card Preview - Takes 5 columns */}
              <motion.div
                initial={{ opacity: 0, y: 40, rotate: 0 }}
                animate={{ opacity: 1, y: 0, rotate: 3 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-5 relative"
              >
                <div className="relative mx-auto max-w-[320px]">
                  {/* Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--coral)]/30 to-[var(--ink)]/20 rounded-[2rem] blur-2xl scale-110" />

                  {/* Main Card - Clean design with large header image */}
                  <motion.div
                    whileHover={{ scale: 1.02, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="relative bg-white rounded-[2rem] shadow-2xl shadow-black/10 overflow-hidden"
                  >
                    {/* Large Profile Image - Takes 30% of card */}
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face"
                        alt="Sarah Chen"
                        className="w-full h-full object-cover object-top"
                      />
                      {/* Gradient overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                      {/* Company badge overlay */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-sm">
                        <div className="w-5 h-5 rounded bg-[var(--ink)] flex items-center justify-center">
                          <CreditCard className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs font-semibold text-[var(--ink)]">Carve</span>
                      </div>

                      {/* Active status */}
                      <motion.div
                        className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-xs text-[var(--ink-muted)]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Active
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="p-5 text-center">
                      <h3 className="text-xl font-bold text-[var(--ink)]">Sarah Chen</h3>
                      <p className="text-[var(--ink-muted)] text-sm">Product Designer</p>
                      <Link href="/company/acme-inc" className="text-[var(--coral)] text-xs font-medium mt-0.5 hover:underline inline-flex items-center gap-1">
                        Acme Inc.
                        <ArrowRight className="w-3 h-3" />
                      </Link>

                      {/* Links - Compact grid with real destinations */}
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <Link href="/p/sarahchen">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-[var(--cream)] cursor-pointer hover:bg-[var(--sand)] transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-white border border-[var(--stone)] flex items-center justify-center transition-transform group-hover:scale-110">
                              <Globe className="w-4 h-4 text-[var(--ink)]" />
                            </div>
                            <span className="text-[10px] font-medium text-[var(--ink-muted)]">Portfolio</span>
                          </motion.div>
                        </Link>
                        <a href="https://linkedin.com/in/sarahchen" target="_blank" rel="noopener noreferrer">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-[var(--cream)] cursor-pointer hover:bg-[var(--sand)] transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-white border border-[var(--stone)] flex items-center justify-center transition-transform group-hover:scale-110">
                              <Users className="w-4 h-4 text-[var(--ink)]" />
                            </div>
                            <span className="text-[10px] font-medium text-[var(--ink-muted)]">LinkedIn</span>
                          </motion.div>
                        </a>
                        <Link href="/book/sarahchen">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-[var(--cream)] cursor-pointer hover:bg-[var(--sand)] transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-white border border-[var(--stone)] flex items-center justify-center transition-transform group-hover:scale-110">
                              <BarChart3 className="w-4 h-4 text-[var(--ink)]" />
                            </div>
                            <span className="text-[10px] font-medium text-[var(--ink-muted)]">Book Call</span>
                          </motion.div>
                        </Link>
                      </div>

                      <Button className="w-full mt-4 h-11 bg-[var(--ink)] hover:bg-[var(--ink-light)] text-white rounded-xl font-semibold text-sm">
                        Save Contact
                      </Button>
                    </div>
                  </motion.div>

                  {/* Floating badges */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    className="absolute -left-4 top-24 bg-white rounded-xl p-2.5 shadow-xl shadow-black/10"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold text-[var(--ink)]">
                      <Wifi className="w-3.5 h-3.5 text-[var(--coral)]" />
                      NFC Ready
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                    className="absolute -right-3 bottom-24 bg-[var(--coral)] text-white rounded-xl px-3 py-2 shadow-xl shadow-[var(--coral)]/30"
                  >
                    <div className="text-xs font-bold">+127 views</div>
                    <div className="text-[10px] opacity-70">this week</div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============ LOGOS / SOCIAL PROOF ============ */}
      <section className="py-16 border-y border-[var(--sand)] bg-white/50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[var(--ink-faint)] text-sm font-medium mb-10 uppercase tracking-wider">
            Trusted by professionals at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-40 grayscale hover:grayscale-0 hover:opacity-60 transition-all duration-500">
            {['Google', 'Meta', 'Spotify', 'Stripe', 'Shopify', 'Figma'].map((company) => (
              <span key={company} className="text-2xl md:text-3xl font-bold text-[var(--ink)]">
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURES - BENTO GRID ============ */}
      <section id="features" className="py-24 md:py-32">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--sand)] text-[var(--ink-muted)] text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 text-[var(--coral)]" />
              Powerful Features
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-[var(--ink)] mb-4">
              Everything you need to
              <br />
              <span className="text-gradient">network smarter</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[var(--ink-muted)] text-lg max-w-2xl mx-auto">
              Powerful features wrapped in simplicity. No learning curve, just results.
            </motion.p>
          </motion.div>

          {/* Bento Grid Layout - Consistent Clean Design */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {/* Large Card - Tap to Share - Spans 2 columns */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className="lg:col-span-2 group relative overflow-hidden rounded-3xl bg-[var(--ink)] p-8 lg:p-10 min-h-[300px] flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--coral)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[var(--coral)] flex items-center justify-center mb-6">
                  <Smartphone className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">Tap to Share</h3>
                <p className="text-white/70 text-base lg:text-lg leading-relaxed max-w-md">
                  One tap on any smartphone. No app needed for recipients. Works with iPhone and Android devices seamlessly.
                </p>
              </div>
              <div className="relative z-10 flex items-center gap-2 text-white/50 text-sm font-medium">
                <Wifi className="w-4 h-4" />
                NFC Technology
              </div>
            </motion.div>

            {/* Card - QR Backup */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-3xl bg-white border border-[var(--stone)] p-7 min-h-[300px] flex flex-col justify-between"
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--ink)] flex items-center justify-center">
                <QrCode className="w-7 h-7 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-[var(--ink)] mb-2">QR Backup</h4>
                <p className="text-[var(--ink-muted)] leading-relaxed">
                  Universal compatibility for any device. Works even without NFC.
                </p>
              </div>
            </motion.div>

            {/* Card - Analytics */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-3xl bg-white border border-[var(--stone)] p-7 min-h-[220px] flex flex-col justify-between"
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--ink)] flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-[var(--ink)] mb-2">Analytics</h4>
                <p className="text-[var(--ink-muted)]">Track views & connections in real-time</p>
              </div>
            </motion.div>

            {/* Wide Card - Team Cards - Spans 2 columns */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className="lg:col-span-2 group relative overflow-hidden rounded-3xl bg-[var(--ink)] p-7 lg:p-8 min-h-[220px] flex items-center gap-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--coral)] flex items-center justify-center shrink-0">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Team Cards</h4>
                <p className="text-white/70 leading-relaxed max-w-lg">
                  Manage your entire organization from one dashboard. Assign templates, track performance, and maintain brand consistency.
                </p>
              </div>
            </motion.div>

            {/* Row 3 - Three Equal Cards - All same style */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-3xl bg-white border border-[var(--stone)] p-7 min-h-[200px] flex flex-col justify-between"
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--ink)] flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-[var(--ink)] mb-1">Instant Updates</h4>
                <p className="text-[var(--ink-muted)]">Cards sync automatically</p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-3xl bg-white border border-[var(--stone)] p-7 min-h-[200px] flex flex-col justify-between"
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--ink)] flex items-center justify-center">
                <Share2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-[var(--ink)] mb-1">Multi-Profile</h4>
                <p className="text-[var(--ink-muted)]">Work, personal & projects</p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-3xl bg-white border border-[var(--stone)] p-7 min-h-[200px] flex flex-col justify-between"
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--ink)] flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-[var(--ink)] mb-1">Secure & Private</h4>
                <p className="text-[var(--ink-muted)]">You control your data</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============ HOW IT WORKS - SEQUENTIAL ANIMATION ============ */}
      <section id="how-it-works" className="py-24 md:py-32 bg-[var(--cream-dark)]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-[var(--ink)] mb-4">
              Up and running in minutes
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[var(--ink-muted)] text-lg">
              Three simple steps to transform how you connect.
            </motion.p>
          </motion.div>

          {/* Sequential Steps */}
          <div className="relative max-w-4xl mx-auto">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-24 left-[calc(16.67%+40px)] right-[calc(16.67%+40px)] h-0.5 overflow-hidden">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="h-full bg-gradient-to-r from-[var(--coral)] via-[var(--coral)] to-[var(--coral)] origin-left"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.4, // Sequential delay: 0s, 0.4s, 0.8s
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="relative text-center"
                >
                  {/* Step number with pulse animation */}
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.4 + 0.2,
                      type: 'spring',
                      stiffness: 200
                    }}
                    className="relative z-10 inline-flex items-center justify-center w-20 h-20 mb-6"
                  >
                    {/* Pulse ring */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1.4, opacity: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1,
                        delay: index * 0.4 + 0.3,
                        ease: 'easeOut'
                      }}
                      className="absolute inset-0 rounded-2xl bg-[var(--coral)]/20"
                    />
                    <div className="relative w-full h-full rounded-2xl bg-white shadow-xl shadow-[var(--coral)]/15 flex items-center justify-center">
                      <span className="text-3xl font-bold bg-gradient-to-br from-[var(--coral)] to-orange-500 bg-clip-text text-transparent">
                        {step.number}
                      </span>
                    </div>
                  </motion.div>

                  {/* Content with staggered fade */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.4 + 0.4,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    <h4 className="text-[var(--ink)] text-xl font-bold mb-3">{step.title}</h4>
                    <p className="text-[var(--ink-muted)] text-sm leading-relaxed max-w-xs mx-auto">{step.description}</p>
                  </motion.div>

                  {/* Checkmark appearing last */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.4 + 0.7,
                      type: 'spring',
                      stiffness: 300
                    }}
                    className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-medium"
                  >
                    <Check className="w-3.5 h-3.5" />
                    {index === 0 ? '2 minutes' : index === 1 ? '3-5 days' : 'Instant'}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="pricing" className="py-24 md:py-32">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-[var(--ink)] mb-4">
              Simple, honest pricing
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[var(--ink-muted)] text-lg">
              Start free. Upgrade when you need more.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {pricingPlans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={scaleIn}
                whileHover={{ y: -8 }}
                className={`relative p-8 rounded-3xl transition-all duration-300 ${
                  plan.popular
                    ? 'bg-[var(--ink)] text-white shadow-2xl shadow-black/20 scale-[1.02]'
                    : 'bg-white border border-[var(--sand)]'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[var(--coral)] text-white text-xs font-bold shadow-lg shadow-[var(--coral)]/30">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h4 className={`text-lg font-semibold ${plan.popular ? 'text-white' : 'text-[var(--ink)]'}`}>{plan.name}</h4>
                  <div className="mt-3 flex items-baseline">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className={`ml-1 ${plan.popular ? 'text-white/60' : 'text-[var(--ink-muted)]'}`}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className={`mt-2 text-sm ${plan.popular ? 'text-white/60' : 'text-[var(--ink-muted)]'}`}>
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-[var(--coral)]' : 'text-green-500'}`} />
                      <span className={plan.popular ? 'text-white/80' : 'text-[var(--ink-light)]'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={`w-full h-12 rounded-xl font-semibold ${
                    plan.popular
                      ? 'bg-[var(--coral)] hover:bg-[var(--coral-dark)] text-white shadow-lg shadow-[var(--coral)]/30'
                      : 'bg-[var(--cream)] hover:bg-[var(--sand)] text-[var(--ink)]'
                  }`}
                >
                  <Link href="/signup">{plan.cta}</Link>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ TESTIMONIALS - INFINITE SCROLL ============ */}
      <section className="py-24 md:py-32 bg-[var(--cream-dark)] overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--sand)] text-[var(--ink-muted)] text-sm font-medium mb-6">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              Loved by 5,000+ Professionals
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-[var(--ink)] mb-4">
              Real stories from real users
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[var(--ink-muted)] text-lg max-w-2xl mx-auto">
              See why professionals around the world trust Carve for their networking.
            </motion.p>
          </motion.div>
        </div>

        {/* Infinite Scroll Marquee - Row 1 (Left to Right) */}
        <div className="relative mb-6">
          <div className="testimonial-marquee">
            <div className="testimonial-track animate-marquee">
              {[
                {
                  quote: "Finally ditched paper cards. At a conference last week, I shared my Carve with 30+ people in one evening. Already got 3 follow-up meetings scheduled.",
                  author: "Marcus Chen",
                  role: "Startup Founder",
                  company: "Stealth Mode",
                  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
                },
                {
                  quote: "The lead capture forms are a game-changer. I can see exactly who viewed my profile and when. Closed 2 deals this month just from Carve connections.",
                  author: "Sarah Mitchell",
                  role: "Real Estate Agent",
                  company: "Century 21",
                  avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
                },
                {
                  quote: "Our whole team uses Carve now. Love that I can update everyone&apos;s cards from one dashboard. No more outdated info floating around.",
                  author: "James Rodriguez",
                  role: "Operations Manager",
                  company: "Deloitte",
                  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                },
                {
                  quote: "I was skeptical about NFC cards but wow. The reaction when I tap someone&apos;s phone is priceless. It&apos;s a conversation starter on its own.",
                  author: "Aisha Patel",
                  role: "Marketing Director",
                  company: "Shopify",
                  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
                },
                {
                  quote: "Best $12/month I spend. The analytics alone are worth it. I know exactly which networking events are actually driving results for me.",
                  author: "Tom Weber",
                  role: "Sales Executive",
                  company: "HubSpot",
                  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
                },
              ].map((testimonial, i) => (
                <div
                  key={`row1-${i}`}
                  className="testimonial-card bg-white rounded-2xl p-6 shadow-sm border border-[var(--sand)] w-[380px] shrink-0"
                >
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-[var(--ink)] text-sm leading-relaxed mb-4">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-[var(--ink)] text-sm">{testimonial.author}</p>
                      <p className="text-xs text-[var(--ink-muted)]">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {[
                {
                  quote: "Finally ditched paper cards. At a conference last week, I shared my Carve with 30+ people in one evening. Already got 3 follow-up meetings scheduled.",
                  author: "Marcus Chen",
                  role: "Startup Founder",
                  company: "Stealth Mode",
                  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
                },
                {
                  quote: "The lead capture forms are a game-changer. I can see exactly who viewed my profile and when. Closed 2 deals this month just from Carve connections.",
                  author: "Sarah Mitchell",
                  role: "Real Estate Agent",
                  company: "Century 21",
                  avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
                },
                {
                  quote: "Our whole team uses Carve now. Love that I can update everyone&apos;s cards from one dashboard. No more outdated info floating around.",
                  author: "James Rodriguez",
                  role: "Operations Manager",
                  company: "Deloitte",
                  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                },
                {
                  quote: "I was skeptical about NFC cards but wow. The reaction when I tap someone&apos;s phone is priceless. It&apos;s a conversation starter on its own.",
                  author: "Aisha Patel",
                  role: "Marketing Director",
                  company: "Shopify",
                  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
                },
                {
                  quote: "Best $12/month I spend. The analytics alone are worth it. I know exactly which networking events are actually driving results for me.",
                  author: "Tom Weber",
                  role: "Sales Executive",
                  company: "HubSpot",
                  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
                },
              ].map((testimonial, i) => (
                <div
                  key={`row1-dup-${i}`}
                  className="testimonial-card bg-white rounded-2xl p-6 shadow-sm border border-[var(--sand)] w-[380px] shrink-0"
                >
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-[var(--ink)] text-sm leading-relaxed mb-4">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-[var(--ink)] text-sm">{testimonial.author}</p>
                      <p className="text-xs text-[var(--ink-muted)]">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Infinite Scroll Marquee - Row 2 (Right to Left) */}
        <div className="relative">
          <div className="testimonial-marquee">
            <div className="testimonial-track animate-marquee-reverse">
              {[
                {
                  quote: "As a freelance designer, first impressions matter. Carve makes me look way more established than I am. Clients are always impressed.",
                  author: "Nina Kowalski",
                  role: "Brand Designer",
                  company: "Freelance",
                  avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
                },
                {
                  quote: "We replaced 200 paper business cards with 50 Carve NFC cards for our conference booth. Saved money AND got better lead data. No brainer.",
                  author: "Robert Chang",
                  role: "Event Manager",
                  company: "Salesforce",
                  avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
                },
                {
                  quote: "The portfolio feature is underrated. I link my projects right on my card. Potential clients see my work before we even meet.",
                  author: "Elena Vasquez",
                  role: "UX Researcher",
                  company: "Google",
                  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
                },
                {
                  quote: "Support team is incredible. Had an issue with card printing, they shipped replacements same day. That kind of service is rare.",
                  author: "Michael O&apos;Brien",
                  role: "Account Director",
                  company: "WPP",
                  avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face",
                },
                {
                  quote: "Been using Carve for 8 months now. Updated my job title twice, added new certifications - card still works perfectly. That&apos;s the point.",
                  author: "Jennifer Park",
                  role: "Product Manager",
                  company: "Stripe",
                  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
                },
              ].map((testimonial, i) => (
                <div
                  key={`row2-${i}`}
                  className="testimonial-card bg-white rounded-2xl p-6 shadow-sm border border-[var(--sand)] w-[380px] shrink-0"
                >
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-[var(--ink)] text-sm leading-relaxed mb-4">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-[var(--ink)] text-sm">{testimonial.author}</p>
                      <p className="text-xs text-[var(--ink-muted)]">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {[
                {
                  quote: "As a freelance designer, first impressions matter. Carve makes me look way more established than I am. Clients are always impressed.",
                  author: "Nina Kowalski",
                  role: "Brand Designer",
                  company: "Freelance",
                  avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
                },
                {
                  quote: "We replaced 200 paper business cards with 50 Carve NFC cards for our conference booth. Saved money AND got better lead data. No brainer.",
                  author: "Robert Chang",
                  role: "Event Manager",
                  company: "Salesforce",
                  avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
                },
                {
                  quote: "The portfolio feature is underrated. I link my projects right on my card. Potential clients see my work before we even meet.",
                  author: "Elena Vasquez",
                  role: "UX Researcher",
                  company: "Google",
                  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
                },
                {
                  quote: "Support team is incredible. Had an issue with card printing, they shipped replacements same day. That kind of service is rare.",
                  author: "Michael O&apos;Brien",
                  role: "Account Director",
                  company: "WPP",
                  avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face",
                },
                {
                  quote: "Been using Carve for 8 months now. Updated my job title twice, added new certifications - card still works perfectly. That&apos;s the point.",
                  author: "Jennifer Park",
                  role: "Product Manager",
                  company: "Stripe",
                  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
                },
              ].map((testimonial, i) => (
                <div
                  key={`row2-dup-${i}`}
                  className="testimonial-card bg-white rounded-2xl p-6 shadow-sm border border-[var(--sand)] w-[380px] shrink-0"
                >
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-[var(--ink)] text-sm leading-relaxed mb-4">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-[var(--ink)] text-sm">{testimonial.author}</p>
                      <p className="text-xs text-[var(--ink-muted)]">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* ============ TRUSTED BY ============ */}
      <section className="py-16 border-y border-[var(--sand)]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-sm text-[var(--ink-muted)] mb-8 uppercase tracking-wider font-medium">
              Trusted by teams at
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
              {['Stripe', 'Notion', 'Figma', 'Linear', 'Vercel', 'Supabase'].map((company) => (
                <div
                  key={company}
                  className="text-2xl font-bold text-[var(--ink)]/20 hover:text-[var(--ink)]/40 transition-colors cursor-default"
                >
                  {company}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-[var(--ink)] mb-4">
              Frequently asked questions
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[var(--ink-muted)] text-lg">
              Everything you need to know about Carve.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="space-y-4"
          >
            {[
              {
                q: "How does NFC work on phones?",
                a: "NFC (Near Field Communication) is built into most modern smartphones. Simply tap your Carve card to the back of any NFC-enabled phone, and your profile opens instantly in their browser. No app download required for recipients.",
              },
              {
                q: "What if someone's phone doesn't have NFC?",
                a: "Every Carve profile includes a QR code backup. Recipients can scan it with their camera app. We've got you covered for 100% compatibility.",
              },
              {
                q: "Can I update my card after it's printed?",
                a: "Absolutely! Your physical card links to your digital profile. Update your info anytime from your dashboard, and everyone who taps your card sees the latest version instantly.",
              },
              {
                q: "Is my data secure?",
                a: "Yes. We use bank-level encryption and never sell your data. You control exactly what information is visible on your profile, and you can delete your account and all data at any time.",
              },
              {
                q: "Do I need to pay for physical cards?",
                a: "Your first physical card is free on all plans. Additional cards start at $15 each, with bulk discounts for teams. You can also use just the digital profile if you prefer.",
              },
              {
                q: "What integrations do you support?",
                a: "Carve integrates with popular CRMs like HubSpot and Salesforce, plus 5,000+ apps through Zapier. We also offer webhooks for custom integrations.",
              },
            ].map((faq, i) => (
              <motion.details
                key={i}
                variants={fadeInUp}
                className="group bg-white rounded-2xl border border-[var(--sand)] overflow-hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-semibold text-[var(--ink)] pr-4">{faq.q}</span>
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[var(--cream)] flex items-center justify-center group-open:rotate-45 transition-transform">
                    <span className="text-[var(--ink)] text-xl leading-none">+</span>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-[var(--ink-muted)] leading-relaxed">
                  {faq.a}
                </div>
              </motion.details>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ PERSONAL VS ENTERPRISE ============ */}
      <section className="py-24 md:py-32 bg-[var(--cream-dark)]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-[var(--ink)] mb-4">
              Choose your path
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[var(--ink-muted)] text-lg max-w-2xl mx-auto">
              Whether you&apos;re an individual professional or managing a team, we&apos;ve got you covered.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto"
          >
            {/* Personal */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className="bg-white rounded-3xl p-8 border border-[var(--sand)] shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--coral)]/10 flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-[var(--coral)]" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--ink)] mb-3">For Individuals</h3>
              <p className="text-[var(--ink-muted)] mb-6">
                Perfect for freelancers, consultants, and professionals who want to stand out. Create your digital profile, order a card, and start networking smarter.
              </p>
              <ul className="space-y-3 mb-8">
                {['Digital profile & portfolio', 'NFC business card', 'QR code sharing', 'Contact analytics', 'Lead capture forms'].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-[var(--ink-light)]">
                    <Check className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className="w-full h-12 rounded-xl bg-[var(--coral)] hover:bg-[var(--coral-dark)]"
              >
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </motion.div>

            {/* Enterprise */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className="bg-[var(--ink)] rounded-3xl p-8 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--coral)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--coral)] flex items-center justify-center">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[var(--coral)]/20 text-[var(--coral)] text-xs font-semibold">
                    Enterprise
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">For Teams & Organizations</h3>
                <p className="text-white/70 mb-6">
                  Equip your entire team with professional digital cards. Manage branding, track performance, and maintain consistency across your organization.
                </p>
                <ul className="space-y-3 mb-8">
                  {['Team admin dashboard', 'Company profile page', 'Bulk card ordering', 'Custom branding & templates', 'SSO & CRM integrations', 'Analytics & reporting'].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-white/80">
                      <Check className="w-4 h-4 text-[var(--coral)]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3">
                  <Button
                    asChild
                    className="flex-1 h-12 rounded-xl bg-[var(--coral)] hover:bg-[var(--coral-dark)]"
                  >
                    <Link href="/org/new">
                      Set Up Organization
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 rounded-xl border-white/20 text-white hover:bg-white/10"
                  >
                    <Link href="/contact">Contact Sales</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--cream-dark)] to-[var(--cream)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--coral)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-[var(--ink)] mb-6">
              Ready to make an impression?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[var(--ink-muted)] text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of professionals who&apos;ve upgraded their networking game. Start free today.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-[var(--coral)] hover:bg-[var(--coral-dark)] text-white rounded-full px-10 h-14 text-base shadow-xl shadow-[var(--coral)]/25"
              >
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-full px-10 h-14 text-base border-2 border-[var(--ink)]/10 hover:bg-[var(--ink)] hover:text-white hover:border-[var(--ink)]"
              >
                <Link href="/demo">View Demo</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="py-12 border-t border-[var(--sand)] bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--coral)] to-[var(--coral-dark)] flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[var(--ink)]">Carve</span>
            </div>
            <div className="flex gap-8 text-sm text-[var(--ink-muted)]">
              <Link href="/privacy" className="hover:text-[var(--ink)] transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-[var(--ink)] transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-[var(--ink)] transition-colors">
                Contact
              </Link>
            </div>
            <p className="text-sm text-[var(--ink-faint)]">
              &copy; {new Date().getFullYear()} Carve. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
