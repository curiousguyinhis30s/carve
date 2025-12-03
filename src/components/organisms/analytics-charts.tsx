'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, Eye, MousePointerClick, Users, Link as LinkIcon } from 'lucide-react'

// Generate demo analytics data
const generateDemoData = (days: number) => {
  const data = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      views: Math.floor(Math.random() * 30) + 10 + (days - i) * 2,
      taps: Math.floor(Math.random() * 20) + 5 + (days - i),
      contacts: Math.floor(Math.random() * 10) + 2,
    })
  }
  return data
}

const LINK_PERFORMANCE = [
  { name: 'LinkedIn', clicks: 45, color: '#0A66C2' },
  { name: 'Twitter', clicks: 32, color: '#1DA1F2' },
  { name: 'Website', clicks: 28, color: '#FF6B5B' },
  { name: 'Email', clicks: 24, color: '#EA4335' },
  { name: 'GitHub', clicks: 18, color: '#333' },
]

const DEVICE_BREAKDOWN = [
  { name: 'Mobile', value: 65, color: '#FF6B5B' },
  { name: 'Desktop', value: 28, color: '#4AA8D8' },
  { name: 'Tablet', value: 7, color: '#4ADE80' },
]

const SOURCE_BREAKDOWN = [
  { name: 'NFC Tap', value: 45, color: '#FF6B5B' },
  { name: 'QR Scan', value: 30, color: '#A78BFA' },
  { name: 'Direct Link', value: 15, color: '#4AA8D8' },
  { name: 'Social Share', value: 10, color: '#4ADE80' },
]

type TimeRange = '7d' | '30d' | '90d'

export function AnalyticsCharts() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d')

  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
  const data = generateDemoData(days)

  // Calculate totals and trends
  const totalViews = data.reduce((sum, d) => sum + d.views, 0)
  const totalTaps = data.reduce((sum, d) => sum + d.taps, 0)
  const totalContacts = data.reduce((sum, d) => sum + d.contacts, 0)

  // Calculate trends (compare last half to first half)
  const midpoint = Math.floor(data.length / 2)
  const firstHalfViews = data.slice(0, midpoint).reduce((sum, d) => sum + d.views, 0)
  const secondHalfViews = data.slice(midpoint).reduce((sum, d) => sum + d.views, 0)
  const viewsTrend = firstHalfViews > 0 ? ((secondHalfViews - firstHalfViews) / firstHalfViews * 100).toFixed(1) : 0

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex gap-2">
        {(['7d', '30d', '90d'] as TimeRange[]).map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange(range)}
            className={timeRange === range
              ? 'bg-[var(--coral)] hover:bg-[var(--coral-dark)]'
              : 'border-white/20 text-white hover:bg-white/10'
            }
          >
            {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
          </Button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Profile Views</p>
                  <p className="text-2xl font-bold text-white">{totalViews}</p>
                </div>
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Eye className="h-5 w-5 text-blue-400" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-xs">
                {Number(viewsTrend) >= 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                    <span className="text-green-400">+{viewsTrend}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 text-red-400 mr-1" />
                    <span className="text-red-400">{viewsTrend}%</span>
                  </>
                )}
                <span className="text-white/40 ml-1">vs previous period</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Card Taps</p>
                  <p className="text-2xl font-bold text-white">{totalTaps}</p>
                </div>
                <div className="p-2 rounded-lg bg-[var(--coral)]/10">
                  <MousePointerClick className="h-5 w-5 text-[var(--coral)]" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-xs">
                <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                <span className="text-green-400">+12.5%</span>
                <span className="text-white/40 ml-1">vs previous period</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Contacts Saved</p>
                  <p className="text-2xl font-bold text-white">{totalContacts}</p>
                </div>
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Users className="h-5 w-5 text-green-400" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-xs">
                <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                <span className="text-green-400">+8.3%</span>
                <span className="text-white/40 ml-1">vs previous period</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Link Clicks</p>
                  <p className="text-2xl font-bold text-white">
                    {LINK_PERFORMANCE.reduce((sum, l) => sum + l.clicks, 0)}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <LinkIcon className="h-5 w-5 text-purple-400" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-xs">
                <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                <span className="text-green-400">+15.2%</span>
                <span className="text-white/40 ml-1">vs previous period</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Views Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Views & Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4AA8D8" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4AA8D8" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorTaps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF6B5B" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#FF6B5B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                      dataKey="date"
                      stroke="rgba(255,255,255,0.4)"
                      tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                    />
                    <YAxis
                      stroke="rgba(255,255,255,0.4)"
                      tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: 'white' }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="#4AA8D8"
                      fillOpacity={1}
                      fill="url(#colorViews)"
                      name="Views"
                    />
                    <Area
                      type="monotone"
                      dataKey="taps"
                      stroke="#FF6B5B"
                      fillOpacity={1}
                      fill="url(#colorTaps)"
                      name="Taps"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Link Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Link Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={LINK_PERFORMANCE} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                      type="number"
                      stroke="rgba(255,255,255,0.4)"
                      tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke="rgba(255,255,255,0.4)"
                      tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: 'white' }}
                    />
                    <Bar dataKey="clicks" radius={[0, 4, 4, 0]}>
                      {LINK_PERFORMANCE.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Device Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Device Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={DEVICE_BREAKDOWN}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {DEVICE_BREAKDOWN.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: 'white' }}
                    />
                    <Legend
                      formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.8)' }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Traffic Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={SOURCE_BREAKDOWN}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {SOURCE_BREAKDOWN.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: 'white' }}
                    />
                    <Legend
                      formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.8)' }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
