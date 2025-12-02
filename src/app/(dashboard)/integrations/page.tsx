'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Plug,
  Search,
  Check,
  ExternalLink,
  Settings,
  Zap,
  Crown,
  ArrowRight,
} from 'lucide-react'
import { toast } from 'sonner'

interface Integration {
  id: string
  name: string
  description: string
  category: 'crm' | 'calendar' | 'email' | 'automation' | 'analytics'
  logo: string
  connected: boolean
  popular: boolean
  proOnly: boolean
}

const integrations: Integration[] = [
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Sync leads directly to HubSpot CRM',
    category: 'crm',
    logo: 'https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png',
    connected: true,
    popular: true,
    proOnly: false,
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Push contacts to Salesforce automatically',
    category: 'crm',
    logo: 'https://c1.sfdcstatic.com/content/dam/sfdc-docs/www/logos/logo-salesforce.svg',
    connected: false,
    popular: true,
    proOnly: true,
  },
  {
    id: 'pipedrive',
    name: 'Pipedrive',
    description: 'Manage deals and contacts in Pipedrive',
    category: 'crm',
    logo: 'https://www.pipedrive.com/favicon.ico',
    connected: false,
    popular: false,
    proOnly: false,
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect to 5000+ apps with Zapier',
    category: 'automation',
    logo: 'https://cdn.zapier.com/zapier/images/favicon.ico',
    connected: true,
    popular: true,
    proOnly: false,
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Let contacts book meetings directly',
    category: 'calendar',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg',
    connected: true,
    popular: true,
    proOnly: false,
  },
  {
    id: 'calendly',
    name: 'Calendly',
    description: 'Embed Calendly scheduling on your profile',
    category: 'calendar',
    logo: 'https://assets.calendly.com/assets/favicon-32x32.png',
    connected: false,
    popular: true,
    proOnly: false,
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Add leads to Mailchimp email lists',
    category: 'email',
    logo: 'https://mailchimp.com/release/plums/cxp/images/favicon.ico',
    connected: false,
    popular: false,
    proOnly: false,
  },
  {
    id: 'convertkit',
    name: 'ConvertKit',
    description: 'Sync subscribers to ConvertKit',
    category: 'email',
    logo: 'https://convertkit.com/favicon.ico',
    connected: false,
    popular: false,
    proOnly: false,
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'Track profile views in GA4',
    category: 'analytics',
    logo: 'https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg',
    connected: false,
    popular: true,
    proOnly: false,
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Get notified in Slack for new leads',
    category: 'automation',
    logo: 'https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png',
    connected: false,
    popular: false,
    proOnly: true,
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Sync contacts to Notion database',
    category: 'automation',
    logo: 'https://www.notion.so/images/favicon.ico',
    connected: false,
    popular: false,
    proOnly: true,
  },
  {
    id: 'airtable',
    name: 'Airtable',
    description: 'Push leads to Airtable bases',
    category: 'automation',
    logo: 'https://airtable.com/images/favicon/favicon.ico',
    connected: false,
    popular: false,
    proOnly: false,
  },
]

const categories = [
  { id: 'all', label: 'All' },
  { id: 'crm', label: 'CRM' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'email', label: 'Email' },
  { id: 'automation', label: 'Automation' },
  { id: 'analytics', label: 'Analytics' },
]

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [integrationsList, setIntegrationsList] = useState(integrations)
  const [configDialogOpen, setConfigDialogOpen] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)

  const filteredIntegrations = integrationsList.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'all' || integration.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const connectedCount = integrationsList.filter((i) => i.connected).length

  const handleToggleConnection = (integrationId: string) => {
    setIntegrationsList(
      integrationsList.map((i) =>
        i.id === integrationId ? { ...i, connected: !i.connected } : i
      )
    )
    const integration = integrationsList.find((i) => i.id === integrationId)
    if (integration) {
      toast.success(
        integration.connected ? 'Disconnected' : 'Connected',
        {
          description: `${integration.name} has been ${
            integration.connected ? 'disconnected' : 'connected'
          }`,
        }
      )
    }
  }

  const handleConfigure = (integration: Integration) => {
    setSelectedIntegration(integration)
    setConfigDialogOpen(true)
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--ink)]">Integrations</h1>
          <p className="text-[var(--ink-muted)] mt-1">
            Connect your favorite tools and automate your workflow
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full font-medium">
            {connectedCount} Connected
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-muted)]" />
          <Input
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-[var(--stone)]"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                selectedCategory === category.id
                  ? 'bg-[var(--ink)] text-white'
                  : 'bg-white border border-[var(--stone)] text-[var(--ink-muted)] hover:border-[var(--ink)]'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Integrations */}
      {selectedCategory === 'all' && !searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-[var(--ink)] mb-4">
            Popular Integrations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {integrationsList
              .filter((i) => i.popular)
              .slice(0, 4)
              .map((integration) => (
                <div
                  key={integration.id}
                  className="bg-white rounded-2xl border border-[var(--stone)] p-5 hover:border-[var(--coral)] transition group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-[var(--cream)] flex items-center justify-center overflow-hidden">
                      <img
                        src={integration.logo}
                        alt={integration.name}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          e.currentTarget.src = ''
                          e.currentTarget.className = 'hidden'
                        }}
                      />
                    </div>
                    {integration.connected ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                        Connected
                      </span>
                    ) : integration.proOnly ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-[var(--coral)]/10 text-[var(--coral)] font-medium flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        Pro
                      </span>
                    ) : null}
                  </div>
                  <h3 className="font-semibold text-[var(--ink)]">
                    {integration.name}
                  </h3>
                  <p className="text-sm text-[var(--ink-muted)] mt-1 line-clamp-2">
                    {integration.description}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 text-[var(--coral)] p-0 h-auto hover:bg-transparent group-hover:gap-2 transition-all"
                    onClick={() =>
                      integration.connected
                        ? handleConfigure(integration)
                        : handleToggleConnection(integration.id)
                    }
                  >
                    {integration.connected ? 'Configure' : 'Connect'}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                  </Button>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {/* All Integrations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-semibold text-[var(--ink)] mb-4">
          {selectedCategory === 'all' ? 'All Integrations' : `${categories.find(c => c.id === selectedCategory)?.label} Integrations`}
        </h2>
        <div className="bg-white rounded-2xl border border-[var(--stone)] overflow-hidden">
          <div className="divide-y divide-[var(--stone)]">
            {filteredIntegrations.map((integration) => (
              <div
                key={integration.id}
                className="p-4 flex items-center justify-between hover:bg-[var(--cream)]/50 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[var(--cream)] flex items-center justify-center overflow-hidden">
                    <img
                      src={integration.logo}
                      alt={integration.name}
                      className="w-7 h-7 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = ''
                        e.currentTarget.className = 'hidden'
                      }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[var(--ink)]">
                        {integration.name}
                      </p>
                      {integration.proOnly && !integration.connected && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--coral)]/10 text-[var(--coral)] font-medium flex items-center gap-0.5">
                          <Crown className="w-3 h-3" />
                          Pro
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--ink-muted)]">
                      {integration.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {integration.connected && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleConfigure(integration)}
                    >
                      <Settings className="w-4 h-4 text-[var(--ink-muted)]" />
                    </Button>
                  )}
                  <Switch
                    checked={integration.connected}
                    onCheckedChange={() => handleToggleConnection(integration.id)}
                  />
                </div>
              </div>
            ))}

            {filteredIntegrations.length === 0 && (
              <div className="p-8 text-center">
                <Plug className="w-12 h-12 text-[var(--ink-muted)] mx-auto mb-3" />
                <p className="text-[var(--ink-muted)]">
                  No integrations found matching your search
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Webhook Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 bg-white rounded-2xl border border-[var(--stone)] p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ink)] flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[var(--ink)]">Custom Webhooks</h3>
            <p className="text-sm text-[var(--ink-muted)] mt-1">
              Send lead capture data to your own endpoints. Perfect for custom
              CRM integrations.
            </p>
            <div className="mt-4 flex gap-3">
              <Input
                placeholder="https://your-api.com/webhook"
                className="flex-1 bg-[var(--cream)] border-[var(--stone)]"
              />
              <Button className="bg-[var(--coral)] hover:bg-[var(--coral-dark)]">
                Add Webhook
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Configuration Dialog */}
      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Configure {selectedIntegration?.name}</DialogTitle>
            <DialogDescription>
              Manage your {selectedIntegration?.name} integration settings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                  Connected
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:bg-red-50"
                onClick={() => {
                  if (selectedIntegration) {
                    handleToggleConnection(selectedIntegration.id)
                    setConfigDialogOpen(false)
                  }
                }}
              >
                Disconnect
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--ink)]">
                    Sync new leads
                  </p>
                  <p className="text-xs text-[var(--ink-muted)]">
                    Automatically send new contacts
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--ink)]">
                    Include card taps
                  </p>
                  <p className="text-xs text-[var(--ink-muted)]">
                    Log NFC interactions
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--ink)]">
                    Real-time sync
                  </p>
                  <p className="text-xs text-[var(--ink-muted)]">
                    Instant updates (vs. hourly batch)
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <Button
              variant="ghost"
              className="text-[var(--ink-muted)]"
              onClick={() => window.open('https://docs.example.com', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Docs
            </Button>
            <Button
              className="bg-[var(--coral)] hover:bg-[var(--coral-dark)]"
              onClick={() => {
                setConfigDialogOpen(false)
                toast.success('Settings saved')
              }}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
