'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CreditCard, ArrowLeft } from 'lucide-react'
import { BookingCalendar } from '@/components/organisms/booking-calendar'
import { toast } from 'sonner'

// Mock user data - in production this would come from database
const users: Record<string, {
  name: string
  avatar: string
  title: string
  accentColor: string
}> = {
  sarahchen: {
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    title: 'Product Designer',
    accentColor: '#FF5A5F',
  },
  alexthompson: {
    name: 'Alex Thompson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    title: 'CEO & Founder',
    accentColor: '#3B82F6',
  },
}

export default function BookingPage({
  params,
}: {
  params: { username: string }
}) {
  const user = users[params.username] || {
    name: params.username,
    avatar: '',
    title: 'Professional',
    accentColor: '#FF5A5F',
  }

  const handleBookingComplete = (booking: {
    date: Date
    time: string
    meetingType: string
    duration: number
    name: string
    email: string
    notes?: string
  }) => {
    console.log('Booking completed:', booking)
    toast.success('Meeting booked successfully!', {
      description: `You'll receive a confirmation email at ${booking.email}`,
    })
  }

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--stone)]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--coral)] flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[var(--ink)]">Carve</span>
          </Link>
          <Link
            href={`/${params.username}`}
            className="text-sm text-[var(--ink-muted)] hover:text-[var(--ink)] flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to profile
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BookingCalendar
            hostName={user.name}
            hostAvatar={user.avatar}
            hostTitle={user.title}
            accentColor={user.accentColor}
            onBookingComplete={handleBookingComplete}
          />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-[var(--stone)] bg-white mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--ink-muted)] hover:text-[var(--ink)]"
          >
            <CreditCard className="w-4 h-4" />
            Powered by Carve
          </Link>
        </div>
      </footer>
    </div>
  )
}
