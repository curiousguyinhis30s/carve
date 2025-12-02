'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  UsersRound,
  UserPlus,
  Crown,
  Shield,
  User,
  MoreHorizontal,
  Mail,
  CreditCard,
  Settings,
  Trash2,
  Lock,
  Building2,
  Palette,
  Upload,
} from 'lucide-react'
import { toast } from 'sonner'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'member'
  avatar_url: string | null
  cards_assigned: number
  status: 'active' | 'pending'
  joined_at: string
}

// Demo team members
const demoTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@acmeinc.com',
    role: 'owner',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    cards_assigned: 3,
    status: 'active',
    joined_at: '2024-01-15',
  },
  {
    id: '2',
    name: 'Michael Park',
    email: 'michael@acmeinc.com',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    cards_assigned: 2,
    status: 'active',
    joined_at: '2024-02-01',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@acmeinc.com',
    role: 'member',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    cards_assigned: 1,
    status: 'active',
    joined_at: '2024-02-15',
  },
  {
    id: '4',
    name: 'James Wilson',
    email: 'james@acmeinc.com',
    role: 'member',
    avatar_url: null,
    cards_assigned: 0,
    status: 'pending',
    joined_at: '2024-03-01',
  },
]

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(demoTeamMembers)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [brandingDialogOpen, setBrandingDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member')
  const [companyName, setCompanyName] = useState('Acme Inc.')
  const [companyLogo, setCompanyLogo] = useState<string | null>(null)

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-amber-500" />
      case 'admin':
        return <Shield className="w-4 h-4 text-[var(--coral)]" />
      default:
        return <User className="w-4 h-4 text-[var(--ink-muted)]" />
    }
  }

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'admin':
        return 'bg-[var(--coral)]/10 text-[var(--coral)] border-[var(--coral)]/20'
      default:
        return 'bg-[var(--cream)] text-[var(--ink-muted)] border-[var(--stone)]'
    }
  }

  const handleInvite = () => {
    if (!inviteEmail) return

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      avatar_url: null,
      cards_assigned: 0,
      status: 'pending',
      joined_at: new Date().toISOString().split('T')[0],
    }

    setMembers([...members, newMember])
    setInviteEmail('')
    setInviteRole('member')
    setInviteDialogOpen(false)
    toast.success('Invitation sent', {
      description: `Invited ${inviteEmail} as ${inviteRole}`,
    })
  }

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter((m) => m.id !== memberId))
    toast.success('Member removed')
  }

  const handleRoleChange = (memberId: string, newRole: 'admin' | 'member') => {
    setMembers(
      members.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    )
    toast.success('Role updated')
  }

  const activeMembers = members.filter((m) => m.status === 'active').length
  const pendingInvites = members.filter((m) => m.status === 'pending').length
  const totalCards = members.reduce((acc, m) => acc + m.cards_assigned, 0)

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--ink)]">Team</h1>
          <p className="text-[var(--ink-muted)] mt-1">
            Manage your team members and organization settings
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog open={brandingDialogOpen} onOpenChange={setBrandingDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-[var(--stone)]">
                <Building2 className="w-4 h-4 mr-2" />
                Branding
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Organization Branding</DialogTitle>
                <DialogDescription>
                  Customize how your team&apos;s cards appear
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your Company"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl border-2 border-dashed border-[var(--stone)] flex items-center justify-center bg-[var(--cream)]">
                      {companyLogo ? (
                        <img
                          src={companyLogo}
                          alt="Logo"
                          className="w-12 h-12 object-contain"
                        />
                      ) : (
                        <Upload className="w-6 h-6 text-[var(--ink-muted)]" />
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      Upload Logo
                    </Button>
                  </div>
                  <p className="text-xs text-[var(--ink-muted)]">
                    Recommended: 200x200px, PNG or SVG
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Brand Color</Label>
                  <div className="flex gap-2">
                    {['#FF6B5B', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'].map(
                      (color) => (
                        <button
                          key={color}
                          className="w-8 h-8 rounded-lg border-2 border-transparent hover:border-[var(--ink)] transition"
                          style={{ backgroundColor: color }}
                        />
                      )
                    )}
                    <button className="w-8 h-8 rounded-lg border-2 border-dashed border-[var(--stone)] flex items-center justify-center">
                      <Palette className="w-4 h-4 text-[var(--ink-muted)]" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setBrandingDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[var(--coral)] hover:bg-[var(--coral-dark)]"
                  onClick={() => {
                    setBrandingDialogOpen(false)
                    toast.success('Branding updated')
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[var(--coral)] hover:bg-[var(--coral-dark)]">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your team
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    placeholder="colleague@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select
                    value={inviteRole}
                    onValueChange={(v) => setInviteRole(v as 'admin' | 'member')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Member
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Admin
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-[var(--ink-muted)]">
                    Admins can invite members and manage team settings
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setInviteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[var(--coral)] hover:bg-[var(--coral-dark)]"
                  onClick={handleInvite}
                >
                  Send Invitation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-[var(--stone)] p-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--coral)]/10 flex items-center justify-center">
              <UsersRound className="w-5 h-5 text-[var(--coral)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--ink)]">
                {activeMembers}
              </p>
              <p className="text-sm text-[var(--ink-muted)]">Active Members</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-[var(--stone)] p-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Mail className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--ink)]">
                {pendingInvites}
              </p>
              <p className="text-sm text-[var(--ink-muted)]">Pending Invites</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-[var(--stone)] p-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--ink)]">
                {totalCards}
              </p>
              <p className="text-sm text-[var(--ink-muted)]">Cards Assigned</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Team Members List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-[var(--stone)] overflow-hidden"
      >
        <div className="p-4 border-b border-[var(--stone)]">
          <h2 className="font-semibold text-[var(--ink)]">Team Members</h2>
        </div>
        <div className="divide-y divide-[var(--stone)]">
          {members.map((member) => (
            <div
              key={member.id}
              className="p-4 flex items-center justify-between hover:bg-[var(--cream)]/50 transition"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-11 w-11">
                  <AvatarImage src={member.avatar_url || ''} />
                  <AvatarFallback className="bg-[var(--coral)] text-white">
                    {member.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-[var(--ink)]">
                      {member.name}
                    </p>
                    {member.status === 'pending' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--ink-muted)]">
                    {member.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[var(--ink-muted)]" />
                  <span className="text-sm text-[var(--ink-muted)]">
                    {member.cards_assigned} cards
                  </span>
                </div>

                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${getRoleBadgeClass(
                    member.role
                  )}`}
                >
                  {getRoleIcon(member.role)}
                  <span className="capitalize">{member.role}</span>
                </div>

                {member.role !== 'owner' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          handleRoleChange(
                            member.id,
                            member.role === 'admin' ? 'member' : 'admin'
                          )
                        }
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        {member.role === 'admin'
                          ? 'Demote to Member'
                          : 'Promote to Admin'}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Assign Card
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Lock className="w-4 h-4 mr-2" />
                        Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Pro Feature Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-[var(--coral)]/10 to-amber-100/50 border border-[var(--coral)]/20"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--coral)] flex items-center justify-center flex-shrink-0">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-[var(--ink)]">Pro Team Features</h3>
            <p className="text-sm text-[var(--ink-muted)] mt-1">
              Upgrade to Pro for unlimited team members, SSO integration, custom branding, and advanced analytics.
            </p>
            <Button
              size="sm"
              className="mt-3 bg-[var(--coral)] hover:bg-[var(--coral-dark)]"
            >
              Upgrade to Pro
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
