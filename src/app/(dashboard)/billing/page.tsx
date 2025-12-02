'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Wallet,
  CreditCard,
  Check,
  Zap,
  Building2,
  Users,
  BarChart3,
  Shield,
  Sparkles,
  Receipt,
  Download,
  Calendar,
  ArrowUpRight,
} from 'lucide-react'
import { toast } from 'sonner'

interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  description: string
}

const invoices: Invoice[] = [
  {
    id: 'INV-001',
    date: '2024-03-01',
    amount: 9,
    status: 'paid',
    description: 'Pro Plan - March 2024',
  },
  {
    id: 'INV-002',
    date: '2024-02-01',
    amount: 9,
    status: 'paid',
    description: 'Pro Plan - February 2024',
  },
  {
    id: 'INV-003',
    date: '2024-01-01',
    amount: 9,
    status: 'paid',
    description: 'Pro Plan - January 2024',
  },
]

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'For individuals getting started',
    features: [
      '1 digital profile',
      'QR code sharing',
      'Basic analytics',
      'vCard download',
    ],
    icon: Zap,
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9,
    description: 'For professionals and freelancers',
    features: [
      '3 digital profiles',
      'NFC card support',
      'Lead capture forms',
      'Advanced analytics',
      'CRM integrations',
      'Priority support',
    ],
    icon: Sparkles,
    popular: true,
  },
  {
    id: 'team',
    name: 'Team',
    price: 29,
    priceNote: 'per user',
    description: 'For growing teams and businesses',
    features: [
      'Everything in Pro',
      'Team management',
      'Custom branding',
      'SSO integration',
      'Bulk card ordering',
      'Admin dashboard',
      'API access',
    ],
    icon: Users,
    popular: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: null,
    description: 'For large organizations',
    features: [
      'Everything in Team',
      'Unlimited users',
      'White-label solution',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
      'On-premise option',
    ],
    icon: Building2,
    popular: false,
  },
]

export default function BillingPage() {
  const [currentPlan] = useState('pro')
  const [billingDialogOpen, setBillingDialogOpen] = useState(false)

  const handleUpgrade = (planId: string) => {
    if (planId === 'enterprise') {
      toast.info('Contact our sales team', {
        description: 'We\'ll reach out to discuss your enterprise needs.',
      })
    } else {
      toast.success('Plan changed', {
        description: `You've been upgraded to the ${planId} plan.`,
      })
    }
    setBillingDialogOpen(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-100 text-emerald-700'
      case 'pending':
        return 'bg-amber-100 text-amber-700'
      case 'failed':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--ink)]">Billing</h1>
        <p className="text-[var(--ink-muted)] mt-1">
          Manage your subscription and payment methods
        </p>
      </div>

      {/* Current Plan Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-[var(--stone)] p-6 mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--coral)] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[var(--ink)]">Pro Plan</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--coral)]/10 text-[var(--coral)] font-medium">
                  Current
                </span>
              </div>
              <p className="text-sm text-[var(--ink-muted)]">
                $9/month, billed monthly
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Dialog open={billingDialogOpen} onOpenChange={setBillingDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-[var(--stone)]">
                  Change Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Choose Your Plan</DialogTitle>
                  <DialogDescription>
                    Select the plan that best fits your needs
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative rounded-xl border p-5 ${
                        plan.popular
                          ? 'border-[var(--coral)] bg-[var(--coral)]/5'
                          : 'border-[var(--stone)]'
                      } ${
                        currentPlan === plan.id ? 'ring-2 ring-[var(--coral)]' : ''
                      }`}
                    >
                      {plan.popular && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full bg-[var(--coral)] text-white font-medium">
                          Popular
                        </span>
                      )}
                      <div className="w-10 h-10 rounded-xl bg-[var(--cream)] flex items-center justify-center mb-3">
                        <plan.icon className="w-5 h-5 text-[var(--ink)]" />
                      </div>
                      <h3 className="font-semibold text-[var(--ink)]">
                        {plan.name}
                      </h3>
                      <div className="mt-2 mb-3">
                        {plan.price !== null ? (
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-[var(--ink)]">
                              ${plan.price}
                            </span>
                            <span className="text-sm text-[var(--ink-muted)]">
                              /mo {plan.priceNote && `(${plan.priceNote})`}
                            </span>
                          </div>
                        ) : (
                          <span className="text-2xl font-bold text-[var(--ink)]">
                            Custom
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--ink-muted)] mb-4">
                        {plan.description}
                      </p>
                      <ul className="space-y-2 mb-4">
                        {plan.features.slice(0, 4).map((feature, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-xs text-[var(--ink)]"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            {feature}
                          </li>
                        ))}
                        {plan.features.length > 4 && (
                          <li className="text-xs text-[var(--ink-muted)]">
                            +{plan.features.length - 4} more features
                          </li>
                        )}
                      </ul>
                      <Button
                        className={`w-full ${
                          currentPlan === plan.id
                            ? 'bg-[var(--ink)] hover:bg-[var(--ink)]/90'
                            : 'bg-[var(--coral)] hover:bg-[var(--coral-dark)]'
                        }`}
                        size="sm"
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={currentPlan === plan.id}
                      >
                        {currentPlan === plan.id
                          ? 'Current Plan'
                          : plan.price === null
                          ? 'Contact Sales'
                          : 'Upgrade'}
                      </Button>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Cancel Plan
            </Button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-[var(--stone)] grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[var(--ink-muted)]" />
            <div>
              <p className="text-sm font-medium text-[var(--ink)]">
                Next billing date
              </p>
              <p className="text-sm text-[var(--ink-muted)]">April 1, 2024</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-[var(--ink-muted)]" />
            <div>
              <p className="text-sm font-medium text-[var(--ink)]">
                Payment method
              </p>
              <p className="text-sm text-[var(--ink-muted)]">Visa ending 4242</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Wallet className="w-5 h-5 text-[var(--ink-muted)]" />
            <div>
              <p className="text-sm font-medium text-[var(--ink)]">
                Monthly spend
              </p>
              <p className="text-sm text-[var(--ink-muted)]">$9.00</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Usage Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
      >
        <div className="bg-white rounded-2xl border border-[var(--stone)] p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[var(--ink-muted)]">Profiles</span>
            <Users className="w-4 h-4 text-[var(--ink-muted)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--ink)]">2 / 3</p>
          <div className="mt-2 h-2 bg-[var(--cream)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--coral)] rounded-full"
              style={{ width: '66%' }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--stone)] p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[var(--ink-muted)]">Lead Captures</span>
            <BarChart3 className="w-4 h-4 text-[var(--ink-muted)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--ink)]">127</p>
          <p className="text-xs text-emerald-600 mt-1">Unlimited on Pro</p>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--stone)] p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[var(--ink-muted)]">Integrations</span>
            <Shield className="w-4 h-4 text-[var(--ink-muted)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--ink)]">3 / 5</p>
          <div className="mt-2 h-2 bg-[var(--cream)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--coral)] rounded-full"
              style={{ width: '60%' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Invoices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-[var(--stone)] overflow-hidden"
      >
        <div className="p-4 border-b border-[var(--stone)] flex items-center justify-between">
          <h2 className="font-semibold text-[var(--ink)]">Invoices</h2>
          <Button variant="ghost" size="sm" className="text-[var(--coral)]">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
        <div className="divide-y divide-[var(--stone)]">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="p-4 flex items-center justify-between hover:bg-[var(--cream)]/50 transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--cream)] flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-[var(--ink-muted)]" />
                </div>
                <div>
                  <p className="font-medium text-[var(--ink)]">
                    {invoice.description}
                  </p>
                  <p className="text-sm text-[var(--ink-muted)]">{invoice.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getStatusBadge(
                    invoice.status
                  )}`}
                >
                  {invoice.status}
                </span>
                <span className="font-medium text-[var(--ink)]">
                  ${invoice.amount}.00
                </span>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Upgrade CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-6 rounded-2xl bg-[var(--ink)] text-white"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Need more features?</h3>
            <p className="text-white/70 text-sm mt-1">
              Upgrade to Team for custom branding, SSO, and unlimited team members.
            </p>
          </div>
          <Button className="bg-[var(--coral)] hover:bg-[var(--coral-dark)] whitespace-nowrap">
            Upgrade to Team
            <ArrowUpRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
