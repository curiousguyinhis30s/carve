'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Webhook,
  Plus,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Code,
  Send,
  Activity,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'

interface WebhookEndpoint {
  id: string
  name: string
  url: string
  secret: string
  events: string[]
  isActive: boolean
  createdAt: string
  lastTriggered: string | null
  successCount: number
  failureCount: number
}

interface WebhookLog {
  id: string
  webhookId: string
  event: string
  status: 'success' | 'failed' | 'pending'
  responseCode: number | null
  timestamp: string
  payload: object
}

const eventTypes = [
  { id: 'profile.viewed', label: 'Profile Viewed', description: 'When someone views your profile' },
  { id: 'card.tapped', label: 'Card Tapped', description: 'When your NFC card is tapped' },
  { id: 'contact.saved', label: 'Contact Saved', description: 'When someone saves your contact' },
  { id: 'lead.captured', label: 'Lead Captured', description: 'When a lead submits a form' },
  { id: 'meeting.booked', label: 'Meeting Booked', description: 'When someone books a meeting' },
]

const sampleWebhooks: WebhookEndpoint[] = [
  {
    id: '1',
    name: 'CRM Integration',
    url: 'https://api.hubspot.com/webhooks/v1/receive',
    secret: 'whsec_1234567890abcdef',
    events: ['lead.captured', 'contact.saved'],
    isActive: true,
    createdAt: '2024-01-10',
    lastTriggered: '2024-01-20T14:30:00Z',
    successCount: 47,
    failureCount: 2,
  },
  {
    id: '2',
    name: 'Slack Notifications',
    url: 'https://hooks.slack.com/services/T00/B00/XXX',
    secret: 'whsec_abcdef1234567890',
    events: ['profile.viewed', 'card.tapped'],
    isActive: true,
    createdAt: '2024-01-15',
    lastTriggered: '2024-01-20T10:15:00Z',
    successCount: 124,
    failureCount: 0,
  },
]

const sampleLogs: WebhookLog[] = [
  {
    id: '1',
    webhookId: '1',
    event: 'lead.captured',
    status: 'success',
    responseCode: 200,
    timestamp: '2024-01-20T14:30:00Z',
    payload: { name: 'John Doe', email: 'john@example.com' },
  },
  {
    id: '2',
    webhookId: '2',
    event: 'card.tapped',
    status: 'success',
    responseCode: 200,
    timestamp: '2024-01-20T10:15:00Z',
    payload: { device: 'iPhone 15', location: 'San Francisco' },
  },
  {
    id: '3',
    webhookId: '1',
    event: 'contact.saved',
    status: 'failed',
    responseCode: 500,
    timestamp: '2024-01-19T16:45:00Z',
    payload: { error: 'Server timeout' },
  },
]

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>(sampleWebhooks)
  const [logs] = useState<WebhookLog[]>(sampleLogs)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookEndpoint | null>(null)
  const [showLogs, setShowLogs] = useState(false)

  const [form, setForm] = useState({
    name: '',
    url: '',
    events: [] as string[],
  })

  const handleToggleActive = (id: string) => {
    setWebhooks(webhooks.map(w =>
      w.id === id ? { ...w, isActive: !w.isActive } : w
    ))
    toast.success('Webhook updated')
  }

  const handleDelete = (id: string) => {
    setWebhooks(webhooks.filter(w => w.id !== id))
    toast.success('Webhook deleted')
  }

  const handleCreate = () => {
    if (!form.name || !form.url || form.events.length === 0) {
      toast.error('Please fill in all fields')
      return
    }

    const newWebhook: WebhookEndpoint = {
      id: Date.now().toString(),
      name: form.name,
      url: form.url,
      secret: `whsec_${Math.random().toString(36).substring(2, 18)}`,
      events: form.events,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      lastTriggered: null,
      successCount: 0,
      failureCount: 0,
    }

    setWebhooks([...webhooks, newWebhook])
    setForm({ name: '', url: '', events: [] })
    setIsCreating(false)
    toast.success('Webhook created')
  }

  const copySecret = (secret: string) => {
    navigator.clipboard.writeText(secret)
    toast.success('Secret copied to clipboard')
  }

  const toggleEvent = (eventId: string) => {
    setForm(prev => ({
      ...prev,
      events: prev.events.includes(eventId)
        ? prev.events.filter(e => e !== eventId)
        : [...prev.events, eventId]
    }))
  }

  const getStatusIcon = (status: WebhookLog['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Webhooks</h1>
          <p className="text-gray-500">Send real-time data to your external services</p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="bg-gray-900 hover:bg-gray-800">
              <Plus className="mr-2 h-4 w-4" />
              Add Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Create Webhook</DialogTitle>
              <DialogDescription className="text-gray-500">
                Configure a webhook endpoint to receive events
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., CRM Integration"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Endpoint URL</label>
                <Input
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://api.example.com/webhook"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Events to Subscribe</label>
                <div className="space-y-2">
                  {eventTypes.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => toggleEvent(event.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        form.events.includes(event.id)
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{event.label}</p>
                          <p className="text-xs text-gray-500">{event.description}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          form.events.includes(event.id)
                            ? 'border-gray-900 bg-gray-900'
                            : 'border-gray-300'
                        }`}>
                          {form.events.includes(event.id) && (
                            <CheckCircle className="h-3 w-3 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} className="bg-gray-900 hover:bg-gray-800">
                  Create Webhook
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Banner */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm text-gray-700">
                Webhooks allow you to receive real-time notifications when events happen on your Carve profile.
                We&apos;ll send a POST request to your endpoint with event data.
              </p>
              <a href="#" className="text-sm text-gray-900 font-medium hover:underline mt-1 inline-block">
                View Documentation →
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Webhooks List */}
      <div className="space-y-4">
        {webhooks.length > 0 ? (
          webhooks.map((webhook) => (
            <motion.div
              key={webhook.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-white border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gray-100 rounded-xl">
                        <Webhook className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{webhook.name}</h3>
                          {webhook.isActive ? (
                            <Badge className="bg-green-100 text-green-700 text-xs">Active</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Inactive</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {webhook.url}
                          </code>
                          <button
                            onClick={() => navigator.clipboard.writeText(webhook.url)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {webhook.events.map((event) => (
                            <Badge key={event} variant="outline" className="text-xs">
                              {event}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={webhook.isActive}
                      onCheckedChange={() => handleToggleActive(webhook.id)}
                    />
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Activity className="h-4 w-4" />
                        <span>{webhook.successCount} delivered</span>
                      </div>
                      {webhook.failureCount > 0 && (
                        <div className="flex items-center gap-2 text-red-500">
                          <XCircle className="h-4 w-4" />
                          <span>{webhook.failureCount} failed</span>
                        </div>
                      )}
                      {webhook.lastTriggered && (
                        <span className="text-gray-400">
                          Last triggered: {new Date(webhook.lastTriggered).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedWebhook(webhook)
                          setShowLogs(true)
                        }}
                        className="text-gray-500 hover:text-gray-900"
                      >
                        <Code className="h-4 w-4 mr-1" />
                        Logs
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copySecret(webhook.secret)}
                        className="text-gray-500 hover:text-gray-900"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Secret
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast.success('Test webhook sent')}
                        className="text-gray-500 hover:text-gray-900"
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Test
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(webhook.id)}
                        className="h-8 w-8 text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="bg-white border-gray-200">
            <CardContent className="py-12 text-center">
              <Webhook className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No webhooks configured</h3>
              <p className="text-gray-500 mb-4">
                Create your first webhook to start receiving real-time events
              </p>
              <Button onClick={() => setIsCreating(true)} className="bg-gray-900 hover:bg-gray-800">
                <Plus className="mr-2 h-4 w-4" />
                Add Webhook
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Logs Dialog */}
      <Dialog open={showLogs} onOpenChange={setShowLogs}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              Webhook Logs - {selectedWebhook?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
            {logs.filter(l => l.webhookId === selectedWebhook?.id).map((log) => (
              <div key={log.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(log.status)}
                    <Badge variant="outline" className="text-xs">{log.event}</Badge>
                    {log.responseCode && (
                      <span className={`text-xs ${log.responseCode === 200 ? 'text-green-600' : 'text-red-600'}`}>
                        HTTP {log.responseCode}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                  {JSON.stringify(log.payload, null, 2)}
                </pre>
              </div>
            ))}
            {logs.filter(l => l.webhookId === selectedWebhook?.id).length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No logs available for this webhook
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
