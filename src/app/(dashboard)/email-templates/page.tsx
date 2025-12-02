'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
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
  Mail,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Eye,
  Send,
  FileText,
  UserPlus,
  Calendar,
  Check,
} from 'lucide-react'
import { toast } from 'sonner'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  type: 'follow_up' | 'welcome' | 'meeting_invite' | 'custom'
  variables: string[]
  isActive: boolean
  lastUsed: string | null
}

const defaultTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Welcome Email',
    subject: 'Great meeting you, {{name}}!',
    body: `Hi {{name}},

It was wonderful meeting you at {{event}}! I wanted to follow up and share my digital business card with you.

You can save my contact info directly from my profile: {{profile_url}}

Looking forward to staying in touch!

Best regards,
{{my_name}}`,
    type: 'welcome',
    variables: ['name', 'event', 'profile_url', 'my_name'],
    isActive: true,
    lastUsed: '2024-01-15',
  },
  {
    id: '2',
    name: 'Follow Up',
    subject: 'Following up on our conversation',
    body: `Hi {{name}},

I hope this email finds you well. I wanted to follow up on our conversation about {{topic}}.

Let me know if you have any questions or if there's anything I can help with.

Best,
{{my_name}}`,
    type: 'follow_up',
    variables: ['name', 'topic', 'my_name'],
    isActive: true,
    lastUsed: '2024-01-18',
  },
  {
    id: '3',
    name: 'Meeting Invite',
    subject: "Let's schedule a call",
    body: `Hi {{name}},

I'd love to continue our conversation. Would you be available for a {{duration}} minute call?

You can book directly on my calendar: {{booking_url}}

Looking forward to speaking with you!

{{my_name}}`,
    type: 'meeting_invite',
    variables: ['name', 'duration', 'booking_url', 'my_name'],
    isActive: true,
    lastUsed: null,
  },
]

const templateTypeIcons = {
  follow_up: FileText,
  welcome: UserPlus,
  meeting_invite: Calendar,
  custom: Mail,
}

const templateTypeLabels = {
  follow_up: 'Follow Up',
  welcome: 'Welcome',
  meeting_invite: 'Meeting Invite',
  custom: 'Custom',
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(defaultTemplates)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const [editForm, setEditForm] = useState({
    name: '',
    subject: '',
    body: '',
    type: 'custom' as EmailTemplate['type'],
  })

  const handleEdit = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setEditForm({
      name: template.name,
      subject: template.subject,
      body: template.body,
      type: template.type,
    })
    setIsEditing(true)
  }

  const handleSave = () => {
    if (selectedTemplate) {
      setTemplates(templates.map(t =>
        t.id === selectedTemplate.id
          ? { ...t, ...editForm, variables: extractVariables(editForm.body + editForm.subject) }
          : t
      ))
      toast.success('Template saved')
    } else {
      const newTemplate: EmailTemplate = {
        id: Date.now().toString(),
        ...editForm,
        variables: extractVariables(editForm.body + editForm.subject),
        isActive: true,
        lastUsed: null,
      }
      setTemplates([...templates, newTemplate])
      toast.success('Template created')
    }
    setIsEditing(false)
    setSelectedTemplate(null)
  }

  const handleDelete = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id))
    toast.success('Template deleted')
  }

  const handleDuplicate = (template: EmailTemplate) => {
    const newTemplate: EmailTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      lastUsed: null,
    }
    setTemplates([...templates, newTemplate])
    toast.success('Template duplicated')
  }

  const extractVariables = (text: string): string[] => {
    const matches = text.match(/\{\{(\w+)\}\}/g) || []
    return [...new Set(matches.map(m => m.replace(/\{\{|\}\}/g, '')))]
  }

  const replaceVariables = (text: string) => {
    return text
      .replace(/\{\{name\}\}/g, 'John Smith')
      .replace(/\{\{event\}\}/g, 'Tech Conference 2024')
      .replace(/\{\{topic\}\}/g, 'the partnership opportunity')
      .replace(/\{\{profile_url\}\}/g, 'https://carve.app/sarahchen')
      .replace(/\{\{booking_url\}\}/g, 'https://carve.app/book/sarahchen')
      .replace(/\{\{duration\}\}/g, '30')
      .replace(/\{\{my_name\}\}/g, 'Sarah Chen')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-gray-500">Create and manage email templates for follow-ups</p>
        </div>
        <Dialog open={isEditing && !selectedTemplate} onOpenChange={(open) => {
          if (!open) setIsEditing(false)
        }}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setSelectedTemplate(null)
                setEditForm({ name: '', subject: '', body: '', type: 'custom' })
                setIsEditing(true)
              }}
              className="bg-gray-900 hover:bg-gray-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => {
          const Icon = templateTypeIcons[template.type]
          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Icon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <CardTitle className="text-base text-gray-900">{template.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1 text-xs bg-gray-100 text-gray-600">
                          {templateTypeLabels[template.type]}
                        </Badge>
                      </div>
                    </div>
                    {template.isActive && (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <Check className="h-3 w-3" />
                        Active
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {template.subject}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.variables.slice(0, 3).map((v) => (
                      <span key={v} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {`{{${v}}}`}
                      </span>
                    ))}
                    {template.variables.length > 3 && (
                      <span className="text-xs text-gray-400">+{template.variables.length - 3} more</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400">
                      {template.lastUsed ? `Used ${template.lastUsed}` : 'Never used'}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-gray-900"
                        onClick={() => {
                          setSelectedTemplate(template)
                          setShowPreview(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-gray-900"
                        onClick={() => handleDuplicate(template)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-gray-900"
                        onClick={() => handleEdit(template)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-red-600"
                        onClick={() => handleDelete(template.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={(open) => {
        if (!open) {
          setIsEditing(false)
          setSelectedTemplate(null)
        }
      }}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              {selectedTemplate ? 'Edit Template' : 'Create Template'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Template Name</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="e.g., Follow Up Email"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Type</label>
                <Select
                  value={editForm.type}
                  onValueChange={(v) => setEditForm({ ...editForm, type: v as EmailTemplate['type'] })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">Welcome</SelectItem>
                    <SelectItem value="follow_up">Follow Up</SelectItem>
                    <SelectItem value="meeting_invite">Meeting Invite</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Subject Line</label>
              <Input
                value={editForm.subject}
                onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                placeholder="e.g., Great meeting you, {{name}}!"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email Body</label>
              <Textarea
                value={editForm.body}
                onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                placeholder="Write your email template here. Use {{variable}} for dynamic content."
                className="mt-1 min-h-[200px] font-mono text-sm"
              />
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-2">Available variables:</p>
              <div className="flex flex-wrap gap-1">
                {['name', 'event', 'topic', 'profile_url', 'booking_url', 'duration', 'my_name'].map((v) => (
                  <button
                    key={v}
                    onClick={() => setEditForm({ ...editForm, body: editForm.body + `{{${v}}}` })}
                    className="text-xs px-2 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                  >
                    {`{{${v}}}`}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => {
                setIsEditing(false)
                setSelectedTemplate(null)
              }}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-gray-900 hover:bg-gray-800">
                {selectedTemplate ? 'Save Changes' : 'Create Template'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Email Preview</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="mt-4 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Subject</p>
                <p className="text-gray-900 font-medium">
                  {replaceVariables(selectedTemplate.subject)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-2">Body</p>
                <div className="text-gray-700 whitespace-pre-wrap text-sm">
                  {replaceVariables(selectedTemplate.body)}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Close
                </Button>
                <Button className="bg-gray-900 hover:bg-gray-800">
                  <Send className="mr-2 h-4 w-4" />
                  Use Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
