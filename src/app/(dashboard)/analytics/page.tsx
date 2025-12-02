'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Loader2,
  Eye,
  CreditCard,
  Users,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import type { Profile, ProfileView } from '@/types/database'

interface AnalyticsData {
  totalViews: number
  totalTaps: number
  totalContacts: number
  viewsChange: number
  tapsChange: number
  contactsChange: number
  recentViews: ProfileView[]
  deviceBreakdown: {
    mobile: number
    desktop: number
    tablet: number
  }
  topReferrers: {
    source: string
    count: number
  }[]
  viewsByDay: {
    date: string
    views: number
  }[]
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [timeRange, setTimeRange] = useState('7d')
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    totalTaps: 0,
    totalContacts: 0,
    viewsChange: 0,
    tapsChange: 0,
    contactsChange: 0,
    recentViews: [],
    deviceBreakdown: { mobile: 0, desktop: 0, tablet: 0 },
    topReferrers: [],
    viewsByDay: [],
  })

  const supabase = createClient()

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: profileData } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_primary', true)
        .single()

      if (profileData) {
        const p = profileData as Profile
        setProfile(p)

        // Calculate date range
        const now = new Date()
        const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
        const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
        const previousStartDate = new Date(startDate.getTime() - daysAgo * 24 * 60 * 60 * 1000)

        // Get current period views
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: currentViews, count: currentViewCount } = await (supabase as any)
          .from('profile_views')
          .select('*', { count: 'exact' })
          .eq('profile_id', p.id)
          .gte('created_at', startDate.toISOString())

        // Get previous period views for comparison
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { count: previousViewCount } = await (supabase as any)
          .from('profile_views')
          .select('*', { count: 'exact' })
          .eq('profile_id', p.id)
          .gte('created_at', previousStartDate.toISOString())
          .lt('created_at', startDate.toISOString())

        // Get lead captures
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { count: currentContactCount } = await (supabase as any)
          .from('lead_captures')
          .select('*', { count: 'exact' })
          .eq('profile_id', p.id)
          .gte('created_at', startDate.toISOString())

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { count: previousContactCount } = await (supabase as any)
          .from('lead_captures')
          .select('*', { count: 'exact' })
          .eq('profile_id', p.id)
          .gte('created_at', previousStartDate.toISOString())
          .lt('created_at', startDate.toISOString())

        // Calculate changes
        const viewsChange = previousViewCount
          ? ((currentViewCount - previousViewCount) / previousViewCount) * 100
          : 0
        const contactsChange = previousContactCount
          ? ((currentContactCount - previousContactCount) / previousContactCount) * 100
          : 0

        // Process device breakdown
        const views = currentViews || []
        const deviceBreakdown = views.reduce(
          (acc: { mobile: number; desktop: number; tablet: number }, view: ProfileView) => {
            const device = view.device?.toLowerCase() || 'desktop'
            if (device.includes('mobile') || device.includes('iphone') || device.includes('android')) {
              acc.mobile++
            } else if (device.includes('tablet') || device.includes('ipad')) {
              acc.tablet++
            } else {
              acc.desktop++
            }
            return acc
          },
          { mobile: 0, desktop: 0, tablet: 0 }
        )

        // Process referrers
        const referrerCounts: Record<string, number> = {}
        views.forEach((view: ProfileView) => {
          const referrer = view.referrer || 'Direct'
          try {
            const url = new URL(referrer)
            const domain = url.hostname.replace('www.', '')
            referrerCounts[domain] = (referrerCounts[domain] || 0) + 1
          } catch {
            referrerCounts[referrer] = (referrerCounts[referrer] || 0) + 1
          }
        })

        const topReferrers = Object.entries(referrerCounts)
          .map(([source, count]) => ({ source, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)

        // Views by day
        const viewsByDay: Record<string, number> = {}
        for (let i = 0; i < daysAgo; i++) {
          const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
          const dateStr = date.toISOString().split('T')[0]
          viewsByDay[dateStr] = 0
        }
        views.forEach((view: ProfileView) => {
          const dateStr = new Date(view.created_at).toISOString().split('T')[0]
          if (viewsByDay[dateStr] !== undefined) {
            viewsByDay[dateStr]++
          }
        })

        setAnalytics({
          totalViews: currentViewCount || 0,
          totalTaps: 0,
          totalContacts: currentContactCount || 0,
          viewsChange,
          tapsChange: 0,
          contactsChange,
          recentViews: views.slice(0, 10),
          deviceBreakdown,
          topReferrers,
          viewsByDay: Object.entries(viewsByDay)
            .map(([date, views]) => ({ date, views }))
            .reverse(),
        })
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatChange = (change: number) => {
    if (change > 0) {
      return (
        <span className="flex items-center text-green-500 text-sm font-medium">
          <ArrowUpRight className="h-4 w-4" />
          +{change.toFixed(1)}%
        </span>
      )
    } else if (change < 0) {
      return (
        <span className="flex items-center text-red-500 text-sm font-medium">
          <ArrowDownRight className="h-4 w-4" />
          {change.toFixed(1)}%
        </span>
      )
    }
    return <span className="text-white/40 text-sm">--</span>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--coral)]" />
      </div>
    )
  }

  const totalDevices = analytics.deviceBreakdown.mobile + analytics.deviceBreakdown.desktop + analytics.deviceBreakdown.tablet
  const mobilePercent = totalDevices ? (analytics.deviceBreakdown.mobile / totalDevices) * 100 : 0
  const desktopPercent = totalDevices ? (analytics.deviceBreakdown.desktop / totalDevices) * 100 : 0
  const tabletPercent = totalDevices ? (analytics.deviceBreakdown.tablet / totalDevices) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-white/60">Track your profile performance</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1A1A1A] border-white/10">
            <SelectItem value="7d" className="text-white">Last 7 days</SelectItem>
            <SelectItem value="30d" className="text-white">Last 30 days</SelectItem>
            <SelectItem value="90d" className="text-white">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Profile Views</p>
                <p className="text-3xl font-bold text-white">{analytics.totalViews.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-[var(--coral)]/20 rounded-xl">
                <Eye className="h-6 w-6 text-[var(--coral)]" />
              </div>
            </div>
            <div className="mt-2">
              {formatChange(analytics.viewsChange)}
              <span className="text-white/40 text-xs ml-1">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Card Taps</p>
                <p className="text-3xl font-bold text-white">{analytics.totalTaps.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <CreditCard className="h-6 w-6 text-purple-400" />
              </div>
            </div>
            <div className="mt-2">
              {formatChange(analytics.tapsChange)}
              <span className="text-white/40 text-xs ml-1">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Contacts Saved</p>
                <p className="text-3xl font-bold text-white">{analytics.totalContacts.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Users className="h-6 w-6 text-green-400" />
              </div>
            </div>
            <div className="mt-2">
              {formatChange(analytics.contactsChange)}
              <span className="text-white/40 text-xs ml-1">vs previous period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Views Over Time */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[var(--coral)]" />
              Views Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.viewsByDay.length > 0 ? (
              <div className="h-[200px] flex items-end gap-1">
                {analytics.viewsByDay.map((day, index) => {
                  const maxViews = Math.max(...analytics.viewsByDay.map(d => d.views), 1)
                  const height = (day.views / maxViews) * 100
                  return (
                    <div
                      key={index}
                      className="flex-1 bg-[var(--coral)] rounded-t hover:bg-[var(--coral-light)] transition-colors cursor-pointer group relative"
                      style={{ height: `${Math.max(height, 4)}%` }}
                    >
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-[#1A1A1A] text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-white/10">
                        {day.date}: {day.views} views
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-white/40">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-[var(--coral)]" />
              Device Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-white/60" />
                    <span className="text-sm text-white">Mobile</span>
                  </div>
                  <span className="text-sm text-white/60">{mobilePercent.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--coral)] rounded-full transition-all"
                    style={{ width: `${mobilePercent}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-white/60" />
                    <span className="text-sm text-white">Desktop</span>
                  </div>
                  <span className="text-sm text-white/60">{desktopPercent.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all"
                    style={{ width: `${desktopPercent}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-white/60" />
                    <span className="text-sm text-white">Tablet</span>
                  </div>
                  <span className="text-sm text-white/60">{tabletPercent.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${tabletPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Referrers */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-[var(--coral)]" />
            Top Referrers
          </CardTitle>
          <CardDescription className="text-white/60">
            Where your traffic is coming from
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.topReferrers.length > 0 ? (
            <div className="space-y-3">
              {analytics.topReferrers.map((referrer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-white/40 w-6">{index + 1}.</span>
                    <span className="text-sm font-medium text-white">{referrer.source}</span>
                  </div>
                  <span className="text-sm text-white/60">{referrer.count} views</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/40">
              <Globe className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No referrer data yet</p>
              <p className="text-sm">Share your profile to see where traffic comes from</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Views */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
          <CardDescription className="text-white/60">
            Latest profile views
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.recentViews.length > 0 ? (
            <div className="space-y-2">
              {analytics.recentViews.map((view, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--coral)]/10 rounded-lg">
                      <Eye className="h-4 w-4 text-[var(--coral)]" />
                    </div>
                    <div>
                      <p className="text-sm text-white">Profile viewed</p>
                      <p className="text-xs text-white/50">
                        {view.device || 'Unknown device'} • {view.referrer || 'Direct'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-white/50">
                    {new Date(view.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/40">
              <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No views yet</p>
              <p className="text-sm">Share your profile to start tracking analytics</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
