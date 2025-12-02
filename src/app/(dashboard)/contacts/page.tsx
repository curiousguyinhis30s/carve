'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Loader2,
  Search,
  Users,
  Mail,
  Phone,
  Building2,
  Calendar,
  Download,
  Trash2,
  ExternalLink,
  User,
  FileText,
  Filter,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Profile, LeadCapture } from '@/types/database'

export default function ContactsPage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [contacts, setContacts] = useState<LeadCapture[]>([])
  const [filteredContacts, setFilteredContacts] = useState<LeadCapture[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedContact, setSelectedContact] = useState<LeadCapture | null>(null)
  const [deleting, setDeleting] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    loadContacts()
  }, [])

  useEffect(() => {
    filterAndSortContacts()
  }, [contacts, searchQuery, sortBy])

  const loadContacts = async () => {
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: contactsData } = await (supabase as any)
          .from('lead_captures')
          .select('*')
          .eq('profile_id', p.id)
          .order('created_at', { ascending: false })

        if (contactsData) {
          setContacts(contactsData as LeadCapture[])
        }
      }
    } catch (error) {
      console.error('Error loading contacts:', error)
      toast.error('Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortContacts = () => {
    let filtered = [...contacts]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.email?.toLowerCase().includes(query) ||
          c.company?.toLowerCase().includes(query)
      )
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    setFilteredContacts(filtered)
  }

  const handleDelete = async (id: string) => {
    setDeleting(true)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('lead_captures')
        .delete()
        .eq('id', id)

      if (error) throw error

      setContacts(contacts.filter((c) => c.id !== id))
      setSelectedContact(null)
      toast.success('Contact deleted')
    } catch (error) {
      console.error('Error deleting contact:', error)
      toast.error('Failed to delete contact')
    } finally {
      setDeleting(false)
    }
  }

  const exportContacts = () => {
    if (contacts.length === 0) {
      toast.error('No contacts to export')
      return
    }

    // Create CSV
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Notes', 'Date']
    const rows = contacts.map((c) => [
      c.name,
      c.email || '',
      c.phone || '',
      c.company || '',
      c.notes || '',
      new Date(c.created_at).toLocaleDateString(),
    ])

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `carve-contacts-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)

    toast.success('Contacts exported!')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--coral)]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Contacts</h1>
          <p className="text-white/60">People who saved your contact or submitted a form</p>
        </div>
        <Button
          onClick={exportContacts}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
          disabled={contacts.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Total Contacts</p>
                <p className="text-3xl font-bold text-white">{contacts.length}</p>
              </div>
              <div className="p-3 bg-[var(--coral)]/20 rounded-xl">
                <Users className="h-6 w-6 text-[var(--coral)]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">With Email</p>
                <p className="text-3xl font-bold text-white">
                  {contacts.filter((c) => c.email).length}
                </p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Mail className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">With Company</p>
                <p className="text-3xl font-bold text-white">
                  {contacts.filter((c) => c.company).length}
                </p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Building2 className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px] bg-white/5 border-white/10 text-white">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-white/10">
                <SelectItem value="newest" className="text-white">Newest First</SelectItem>
                <SelectItem value="oldest" className="text-white">Oldest First</SelectItem>
                <SelectItem value="name" className="text-white">By Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      {filteredContacts.length > 0 ? (
        <div className="grid gap-3">
          {filteredContacts.map((contact) => (
            <Card
              key={contact.id}
              className="bg-white/5 border-white/10 hover:bg-white/[0.07] transition-colors cursor-pointer"
              onClick={() => setSelectedContact(contact)}
            >
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-[var(--coral)]/20 flex items-center justify-center text-[var(--coral)] font-semibold">
                    {getInitials(contact.name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-white truncate">{contact.name}</h3>
                      {contact.company && (
                        <Badge variant="secondary" className="bg-white/10 text-white/60 text-xs">
                          {contact.company}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-white/50">
                      {contact.email && (
                        <span className="flex items-center gap-1 truncate">
                          <Mail className="h-3 w-3" />
                          {contact.email}
                        </span>
                      )}
                      {contact.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {contact.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="hidden sm:flex items-center gap-1 text-sm text-white/40">
                    <Calendar className="h-3 w-3" />
                    {new Date(contact.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-16 text-center">
            <Users className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              {searchQuery ? 'No contacts found' : 'No contacts yet'}
            </h3>
            <p className="text-white/60 max-w-sm mx-auto">
              {searchQuery
                ? 'Try a different search term'
                : 'When people save your contact or submit a lead form, they\'ll appear here'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Contact Detail Dialog */}
      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="bg-[#0A0A0A] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Contact Details</DialogTitle>
            <DialogDescription className="text-white/60">
              View and manage this contact
            </DialogDescription>
          </DialogHeader>

          {selectedContact && (
            <div className="space-y-6">
              {/* Contact Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[var(--coral)]/20 flex items-center justify-center text-[var(--coral)] text-xl font-semibold">
                  {getInitials(selectedContact.name)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{selectedContact.name}</h3>
                  {selectedContact.company && (
                    <p className="text-white/60">{selectedContact.company}</p>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                {selectedContact.email && (
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <Mail className="h-5 w-5 text-white/40" />
                    <div className="flex-1">
                      <p className="text-xs text-white/40">Email</p>
                      <p className="text-white">{selectedContact.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/60 hover:text-white"
                      onClick={() => window.open(`mailto:${selectedContact.email}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {selectedContact.phone && (
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <Phone className="h-5 w-5 text-white/40" />
                    <div className="flex-1">
                      <p className="text-xs text-white/40">Phone</p>
                      <p className="text-white">{selectedContact.phone}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/60 hover:text-white"
                      onClick={() => window.open(`tel:${selectedContact.phone}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {selectedContact.company && (
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <Building2 className="h-5 w-5 text-white/40" />
                    <div className="flex-1">
                      <p className="text-xs text-white/40">Company</p>
                      <p className="text-white">{selectedContact.company}</p>
                    </div>
                  </div>
                )}

                {selectedContact.notes && (
                  <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                    <FileText className="h-5 w-5 text-white/40 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-white/40">Notes</p>
                      <p className="text-white">{selectedContact.notes}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <Calendar className="h-5 w-5 text-white/40" />
                  <div className="flex-1">
                    <p className="text-xs text-white/40">Captured On</p>
                    <p className="text-white">
                      {new Date(selectedContact.created_at).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <Button
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  onClick={() => handleDelete(selectedContact.id)}
                  disabled={deleting}
                >
                  {deleting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete
                </Button>
                <Button
                  className="bg-[var(--coral)] hover:bg-[var(--coral-dark)]"
                  onClick={() => {
                    if (selectedContact.email) {
                      window.open(`mailto:${selectedContact.email}`, '_blank')
                    } else if (selectedContact.phone) {
                      window.open(`tel:${selectedContact.phone}`, '_blank')
                    }
                  }}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Contact
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
