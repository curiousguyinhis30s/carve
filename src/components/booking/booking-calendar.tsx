'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar as CalendarIcon,
  Video,
  Phone,
  MapPin,
  Check,
  X,
  User,
  Mail,
  MessageSquare,
} from 'lucide-react'

interface BookingCalendarProps {
  hostName: string
  hostAvatar?: string
  hostTitle?: string
  meetingTypes?: {
    id: string
    name: string
    duration: number
    icon: 'video' | 'phone' | 'location'
    description?: string
  }[]
  availability?: {
    [day: string]: string[] // day of week -> available time slots
  }
  onBookingComplete?: (booking: BookingDetails) => void
  accentColor?: string
}

interface BookingDetails {
  date: Date
  time: string
  meetingType: string
  duration: number
  name: string
  email: string
  notes?: string
}

const DEFAULT_MEETING_TYPES = [
  {
    id: 'quick',
    name: 'Quick Chat',
    duration: 15,
    icon: 'video' as const,
    description: 'A brief introduction call',
  },
  {
    id: 'consultation',
    name: 'Consultation',
    duration: 30,
    icon: 'video' as const,
    description: 'Discuss your project in detail',
  },
  {
    id: 'deep-dive',
    name: 'Deep Dive',
    duration: 60,
    icon: 'video' as const,
    description: 'Comprehensive strategy session',
  },
]

const DEFAULT_AVAILABILITY: { [key: string]: string[] } = {
  Monday: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'],
  Tuesday: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'],
  Wednesday: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'],
  Thursday: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'],
  Friday: ['09:00', '09:30', '10:00', '10:30', '11:00'],
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const MEETING_ICONS = {
  video: Video,
  phone: Phone,
  location: MapPin,
}

export function BookingCalendar({
  hostName,
  hostAvatar,
  hostTitle,
  meetingTypes = DEFAULT_MEETING_TYPES,
  availability = DEFAULT_AVAILABILITY,
  onBookingComplete,
  accentColor = '#FF5A5F',
}: BookingCalendarProps) {
  const [step, setStep] = useState<'type' | 'date' | 'time' | 'details' | 'confirmed'>('type')
  const [selectedMeeting, setSelectedMeeting] = useState<typeof meetingTypes[0] | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    notes: '',
  })

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPadding = firstDay.getDay()
    const days: (Date | null)[] = []

    // Add padding for days before month starts
    for (let i = 0; i < startPadding; i++) {
      days.push(null)
    }

    // Add actual days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }, [currentMonth])

  // Check if a date is available
  const isDateAvailable = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date < today) return false
    const dayName = FULL_DAYS[date.getDay()]
    return availability[dayName] && availability[dayName].length > 0
  }

  // Get available times for selected date
  const availableTimes = useMemo(() => {
    if (!selectedDate) return []
    const dayName = FULL_DAYS[selectedDate.getDay()]
    return availability[dayName] || []
  }, [selectedDate, availability])

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handlePrevMonth = () => {
    const today = new Date()
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    if (prevMonth >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(prevMonth)
    }
  }

  const handleSubmit = () => {
    if (!selectedMeeting || !selectedDate || !selectedTime) return

    const booking: BookingDetails = {
      date: selectedDate,
      time: selectedTime,
      meetingType: selectedMeeting.name,
      duration: selectedMeeting.duration,
      name: formData.name,
      email: formData.email,
      notes: formData.notes,
    }

    onBookingComplete?.(booking)
    setStep('confirmed')
  }

  const formatDate = (date: Date) => {
    return `${FULL_DAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        {hostAvatar && (
          <img
            src={hostAvatar}
            alt={hostName}
            className="w-16 h-16 rounded-full mx-auto mb-3 object-cover border-2"
            style={{ borderColor: accentColor }}
          />
        )}
        <h2 className="text-xl font-bold text-[var(--ink)]">Book a meeting with {hostName}</h2>
        {hostTitle && <p className="text-sm text-[var(--ink-muted)]">{hostTitle}</p>}
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {['type', 'date', 'time', 'details'].map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step === s
                  ? 'text-white'
                  : ['type', 'date', 'time', 'details'].indexOf(step) > i
                  ? 'bg-green-500 text-white'
                  : 'bg-[var(--stone)] text-[var(--ink-muted)]'
              }`}
              style={step === s ? { backgroundColor: accentColor } : {}}
            >
              {['type', 'date', 'time', 'details'].indexOf(step) > i ? (
                <Check className="w-4 h-4" />
              ) : (
                i + 1
              )}
            </div>
            {i < 3 && (
              <div
                className={`w-12 h-0.5 mx-1 ${
                  ['type', 'date', 'time', 'details'].indexOf(step) > i
                    ? 'bg-green-500'
                    : 'bg-[var(--stone)]'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Select Meeting Type */}
        {step === 'type' && (
          <motion.div
            key="type"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-3"
          >
            <h3 className="font-semibold text-[var(--ink)] mb-4">Select meeting type</h3>
            {meetingTypes.map((meeting) => {
              const Icon = MEETING_ICONS[meeting.icon]
              return (
                <button
                  key={meeting.id}
                  onClick={() => {
                    setSelectedMeeting(meeting)
                    setStep('date')
                  }}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                    selectedMeeting?.id === meeting.id
                      ? 'border-[var(--coral)] bg-[var(--coral)]/5'
                      : 'border-[var(--stone)] hover:border-[var(--ink)]/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${accentColor}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: accentColor }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-[var(--ink)]">{meeting.name}</h4>
                        <span className="text-sm text-[var(--ink-muted)] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {meeting.duration} min
                        </span>
                      </div>
                      {meeting.description && (
                        <p className="text-sm text-[var(--ink-muted)] mt-1">
                          {meeting.description}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </motion.div>
        )}

        {/* Step 2: Select Date */}
        {step === 'date' && (
          <motion.div
            key="date"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setStep('type')}
                className="text-sm text-[var(--ink-muted)] hover:text-[var(--ink)] flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <h3 className="font-semibold text-[var(--ink)]">Select a date</h3>
              <div className="w-12" />
            </div>

            {/* Selected Meeting Info */}
            {selectedMeeting && (
              <div
                className="p-3 rounded-lg mb-4 flex items-center gap-3"
                style={{ backgroundColor: `${accentColor}10` }}
              >
                <CalendarIcon className="w-4 h-4" style={{ color: accentColor }} />
                <span className="text-sm font-medium text-[var(--ink)]">
                  {selectedMeeting.name} ({selectedMeeting.duration} min)
                </span>
              </div>
            )}

            {/* Calendar */}
            <div className="bg-white rounded-xl border border-[var(--stone)] p-4">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-lg hover:bg-[var(--cream)] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-[var(--ink-muted)]" />
                </button>
                <h4 className="font-semibold text-[var(--ink)]">
                  {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h4>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-lg hover:bg-[var(--cream)] transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-[var(--ink-muted)]" />
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-[var(--ink-muted)] py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, index) => {
                  const available = isDateAvailable(date)
                  const isSelected =
                    date &&
                    selectedDate &&
                    date.toDateString() === selectedDate.toDateString()
                  const isToday =
                    date && date.toDateString() === new Date().toDateString()

                  return (
                    <button
                      key={index}
                      disabled={!available}
                      onClick={() => {
                        if (date && available) {
                          setSelectedDate(date)
                          setStep('time')
                        }
                      }}
                      className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                        !date
                          ? ''
                          : !available
                          ? 'text-[var(--stone)] cursor-not-allowed'
                          : isSelected
                          ? 'text-white'
                          : isToday
                          ? 'bg-[var(--cream)] text-[var(--ink)] hover:opacity-80'
                          : 'text-[var(--ink)] hover:bg-[var(--cream)]'
                      }`}
                      style={isSelected ? { backgroundColor: accentColor } : {}}
                    >
                      {date?.getDate()}
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Select Time */}
        {step === 'time' && selectedDate && (
          <motion.div
            key="time"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setStep('date')}
                className="text-sm text-[var(--ink-muted)] hover:text-[var(--ink)] flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <h3 className="font-semibold text-[var(--ink)]">Select a time</h3>
              <div className="w-12" />
            </div>

            {/* Selected Info */}
            <div
              className="p-3 rounded-lg mb-4"
              style={{ backgroundColor: `${accentColor}10` }}
            >
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-4 h-4" style={{ color: accentColor }} />
                <span className="text-sm font-medium text-[var(--ink)]">
                  {formatDate(selectedDate)}
                </span>
              </div>
            </div>

            {/* Time Slots */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => {
                    setSelectedTime(time)
                    setStep('details')
                  }}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    selectedTime === time
                      ? 'text-white'
                      : 'bg-[var(--cream)] text-[var(--ink)] hover:bg-[var(--ink)]/5'
                  }`}
                  style={selectedTime === time ? { backgroundColor: accentColor } : {}}
                >
                  {time}
                </button>
              ))}
            </div>

            {availableTimes.length === 0 && (
              <div className="text-center py-8 text-[var(--ink-muted)]">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No available times for this date</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 4: Enter Details */}
        {step === 'details' && selectedDate && selectedTime && (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setStep('time')}
                className="text-sm text-[var(--ink-muted)] hover:text-[var(--ink)] flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <h3 className="font-semibold text-[var(--ink)]">Enter your details</h3>
              <div className="w-12" />
            </div>

            {/* Summary */}
            <div
              className="p-4 rounded-xl mb-6 space-y-2"
              style={{ backgroundColor: `${accentColor}10` }}
            >
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="w-4 h-4" style={{ color: accentColor }} />
                <span className="text-[var(--ink)]">{formatDate(selectedDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" style={{ color: accentColor }} />
                <span className="text-[var(--ink)]">
                  {selectedTime} ({selectedMeeting?.duration} min)
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Video className="w-4 h-4" style={{ color: accentColor }} />
                <span className="text-[var(--ink)]">{selectedMeeting?.name}</span>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <Label className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Your Name
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Smith"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Notes (optional)
                </Label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="What would you like to discuss?"
                  rows={3}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-[var(--stone)] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--coral)]/20"
                />
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!formData.name || !formData.email}
              className="w-full mt-6 h-12"
              style={{ backgroundColor: accentColor }}
            >
              Confirm Booking
            </Button>
          </motion.div>
        )}

        {/* Step 5: Confirmation */}
        {step === 'confirmed' && selectedDate && selectedTime && (
          <motion.div
            key="confirmed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${accentColor}15` }}
            >
              <Check className="w-8 h-8" style={{ color: accentColor }} />
            </div>
            <h3 className="text-xl font-bold text-[var(--ink)] mb-2">Booking Confirmed!</h3>
            <p className="text-[var(--ink-muted)] mb-6">
              A confirmation email has been sent to {formData.email}
            </p>

            <div className="bg-[var(--cream)] rounded-xl p-4 text-left max-w-sm mx-auto space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="w-4 h-4 text-[var(--ink-muted)]" />
                <span className="text-[var(--ink)]">{formatDate(selectedDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-[var(--ink-muted)]" />
                <span className="text-[var(--ink)]">
                  {selectedTime} ({selectedMeeting?.duration} min)
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Video className="w-4 h-4 text-[var(--ink-muted)]" />
                <span className="text-[var(--ink)]">{selectedMeeting?.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-[var(--ink-muted)]" />
                <span className="text-[var(--ink)]">{hostName}</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="mt-6"
              onClick={() => {
                // Add to calendar functionality
                const event = {
                  title: `Meeting with ${hostName} - ${selectedMeeting?.name}`,
                  start: selectedDate,
                  duration: selectedMeeting?.duration,
                }
                // Generate ICS file
                const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${selectedDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DURATION:PT${selectedMeeting?.duration}M
SUMMARY:${event.title}
END:VEVENT
END:VCALENDAR`
                const blob = new Blob([icsContent], { type: 'text/calendar' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'meeting.ics'
                a.click()
              }}
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Add to Calendar
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
