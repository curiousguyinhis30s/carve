'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Building2,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  Plus,
  Search,
  MoreHorizontal,
  Mail,
  UserPlus,
  Download,
  ExternalLink,
  Check,
  X,
  Clock,
  Edit2,
  Trash2,
  Shield,
  Sparkles,
  Globe,
  Copy,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

// Mock organization data
const organization = {
  name: 'Acme Inc.',
  slug: 'acme-inc',
  logo: null,
  primaryColor: '#FF5A5F',
  plan: 'Team',
  memberCount: 12,
  cardCount: 15,
  totalViews: 2847,
}

const members = [
  {
    id: 1,
    name: 'Sarah Chen',
    email: 'sarah@acme.com',
    role: 'Admin',
    status: 'active',
    profileViews: 342,
    cardIssued: true,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 2,
    name: 'Michael Ross',
    email: 'michael@acme.com',
    role: 'Member',
    status: 'active',
    profileViews: 218,
    cardIssued: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 3,
    name: 'Emily Davis',
    email: 'emily@acme.com',
    role: 'Member',
    status: 'pending',
    profileViews: 0,
    cardIssued: false,
    avatar: null,
  },
  {
    id: 4,
    name: 'James Wilson',
    email: 'james@acme.com',
    role: 'Member',
    status: 'active',
    profileViews: 156,
    cardIssued: true,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
  },
]

const tabs = [
  { id: 'members', label: 'Team Members', icon: Users },
  { id: 'branding', label: 'Branding', icon: Sparkles },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('members')
  const [searchQuery, setSearchQuery] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')

  const handleInvite = () => {
    if (inviteEmail) {
      toast.success('Invitation sent!', {
        description: `${inviteEmail} will receive an invite shortly.`,
      })
      setInviteEmail('')
    }
  }

  const copyCompanyLink = () => {
    navigator.clipboard.writeText(`https://carve.app/company/${organization.slug}`)
    toast.success('Link copied!')
  }

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[var(--ink)] flex items-center justify-center">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[var(--ink)]">
                {organization.name}
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--coral)]/10 text-[var(--coral)] font-medium">
                {organization.plan}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-[var(--ink-muted)]">
                carve.app/company/{organization.slug}
              </span>
              <button
                onClick={copyCompanyLink}
                className="p-1 hover:bg-[var(--cream)] rounded"
              >
                <Copy className="w-3.5 h-3.5 text-[var(--ink-muted)]" />
              </button>
              <Link
                href={`/company/${organization.slug}`}
                className="p-1 hover:bg-[var(--cream)] rounded"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[var(--ink-muted)]" />
              </Link>
            </div>
          </div>
        </div>
        <Button className="bg-[var(--coral)] hover:bg-[var(--coral-dark)]">
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Members
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Team Members',
            value: organization.memberCount,
            icon: Users,
            change: '+2 this month',
          },
          {
            label: 'Cards Issued',
            value: organization.cardCount,
            icon: CreditCard,
            change: '3 pending',
          },
          {
            label: 'Total Views',
            value: organization.totalViews.toLocaleString(),
            icon: BarChart3,
            change: '+18% vs last month',
          },
          {
            label: 'Company Page Views',
            value: '856',
            icon: Globe,
            change: '+24% vs last month',
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-[var(--stone)] p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[var(--ink-muted)]">{stat.label}</span>
              <stat.icon className="w-4 h-4 text-[var(--ink-muted)]" />
            </div>
            <p className="text-2xl font-bold text-[var(--ink)]">{stat.value}</p>
            <p className="text-xs text-[var(--ink-muted)] mt-1">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--cream)] rounded-xl mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-[var(--ink)] shadow-sm'
                : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Members Tab Content */}
      {activeTab === 'members' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl border border-[var(--stone)] overflow-hidden"
        >
          {/* Search & Filter Bar */}
          <div className="p-4 border-b border-[var(--stone)] flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-muted)]" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Email to invite"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-48"
              />
              <Button onClick={handleInvite} variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Invite
              </Button>
            </div>
          </div>

          {/* Members Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--cream)] text-left">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium text-[var(--ink-muted)] uppercase">
                    Member
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-[var(--ink-muted)] uppercase">
                    Role
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-[var(--ink-muted)] uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-[var(--ink-muted)] uppercase">
                    Profile Views
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-[var(--ink-muted)] uppercase">
                    Card
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-[var(--ink-muted)] uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--stone)]">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-[var(--cream)]/50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[var(--cream)] flex items-center justify-center">
                            <Users className="w-5 h-5 text-[var(--ink-muted)]" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-[var(--ink)]">
                            {member.name}
                          </p>
                          <p className="text-sm text-[var(--ink-muted)]">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          member.role === 'Admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-[var(--cream)] text-[var(--ink-muted)]'
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        {member.status === 'active' ? (
                          <>
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-sm text-green-700">Active</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-sm text-amber-700">Pending</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-medium text-[var(--ink)]">
                        {member.profileViews}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {member.cardIssued ? (
                        <span className="flex items-center gap-1 text-sm text-green-700">
                          <Check className="w-4 h-4" />
                          Issued
                        </span>
                      ) : (
                        <Button variant="outline" size="sm">
                          <CreditCard className="w-3.5 h-3.5 mr-1" />
                          Order
                        </Button>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="w-4 h-4 mr-2" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Branding Tab */}
      {activeTab === 'branding' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <div className="bg-white rounded-2xl border border-[var(--stone)] p-6">
            <h3 className="font-semibold text-[var(--ink)] mb-4">Brand Assets</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[var(--ink-muted)]">
                  Company Logo
                </label>
                <div className="mt-2 w-24 h-24 rounded-xl border-2 border-dashed border-[var(--stone)] flex items-center justify-center cursor-pointer hover:border-[var(--coral)] transition-colors">
                  <Building2 className="w-8 h-8 text-[var(--ink-muted)]" />
                </div>
              </div>
              <div>
                <label className="text-sm text-[var(--ink-muted)]">
                  Brand Color
                </label>
                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="color"
                    value={organization.primaryColor}
                    className="w-12 h-12 rounded-lg border border-[var(--stone)] cursor-pointer"
                  />
                  <Input value={organization.primaryColor} className="w-32" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[var(--stone)] p-6">
            <h3 className="font-semibold text-[var(--ink)] mb-4">Card Preview</h3>
            <div className="bg-[var(--cream)] rounded-xl p-4">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-xs mx-auto">
                <div
                  className="h-20"
                  style={{ backgroundColor: organization.primaryColor }}
                />
                <div className="p-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--cream)] border-4 border-white -mt-12 mx-auto flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-[var(--ink-muted)]" />
                  </div>
                  <p className="mt-2 font-semibold text-[var(--ink)]">
                    Team Member
                  </p>
                  <p className="text-sm text-[var(--ink-muted)]">
                    {organization.name}
                  </p>
                  <Button
                    className="w-full mt-4"
                    style={{ backgroundColor: organization.primaryColor }}
                  >
                    Save Contact
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl border border-[var(--stone)] p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-[var(--ink)]">Team Performance</h3>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
          <div className="h-64 flex items-center justify-center bg-[var(--cream)] rounded-xl">
            <p className="text-[var(--ink-muted)]">Analytics chart placeholder</p>
          </div>
        </motion.div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl border border-[var(--stone)] p-6 space-y-6"
        >
          <div>
            <h3 className="font-semibold text-[var(--ink)] mb-4">
              Organization Settings
            </h3>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="text-sm text-[var(--ink-muted)]">
                  Company Name
                </label>
                <Input value={organization.name} className="mt-1" />
              </div>
              <div>
                <label className="text-sm text-[var(--ink-muted)]">
                  Company URL Slug
                </label>
                <Input value={organization.slug} className="mt-1" />
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-[var(--stone)]">
            <h3 className="font-semibold text-[var(--ink)] mb-4">Danger Zone</h3>
            <Button variant="outline" className="text-red-600 border-red-200">
              Delete Organization
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
