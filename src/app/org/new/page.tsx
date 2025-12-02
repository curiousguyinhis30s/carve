'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Building2,
  ArrowRight,
  ArrowLeft,
  Users,
  Globe,
  Upload,
  Check,
  CreditCard,
  Sparkles,
  Shield,
  Zap,
} from 'lucide-react'
import { toast } from 'sonner'

const steps = [
  { id: 1, title: 'Company Info', icon: Building2 },
  { id: 2, title: 'Branding', icon: Sparkles },
  { id: 3, title: 'Invite Team', icon: Users },
]

export default function CreateOrganizationPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    companyName: '',
    slug: '',
    industry: '',
    website: '',
    logo: null as File | null,
    primaryColor: '#FF5A5F',
    teamEmails: [''],
  })

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      // Submit and redirect
      toast.success('Organization created!', {
        description: 'Your company profile is ready.',
      })
      router.push('/admin')
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const addTeamEmail = () => {
    setFormData({
      ...formData,
      teamEmails: [...formData.teamEmails, ''],
    })
  }

  const updateTeamEmail = (index: number, value: string) => {
    const newEmails = [...formData.teamEmails]
    newEmails[index] = value
    setFormData({ ...formData, teamEmails: newEmails })
  }

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      {/* Header */}
      <header className="border-b border-[var(--stone)] bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--coral)] to-[var(--coral-dark)] flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[var(--ink)]">Carve</span>
          </Link>
          <div className="text-sm text-[var(--ink-muted)]">
            Setting up organization
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            {/* Progress line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-[var(--stone)]" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-[var(--coral)] transition-all duration-500"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            />

            {steps.map((step) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <motion.div
                  animate={{
                    scale: currentStep === step.id ? 1.1 : 1,
                    backgroundColor:
                      currentStep >= step.id
                        ? 'var(--coral)'
                        : 'var(--cream)',
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    currentStep >= step.id
                      ? 'border-[var(--coral)]'
                      : 'border-[var(--stone)]'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <step.icon
                      className={`w-5 h-5 ${
                        currentStep >= step.id
                          ? 'text-white'
                          : 'text-[var(--ink-muted)]'
                      }`}
                    />
                  )}
                </motion.div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    currentStep >= step.id
                      ? 'text-[var(--ink)]'
                      : 'text-[var(--ink-muted)]'
                  }`}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-2xl border border-[var(--stone)] p-8"
        >
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[var(--ink)] mb-2">
                  Tell us about your company
                </h2>
                <p className="text-[var(--ink-muted)]">
                  Basic information to set up your organization profile.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Acme Inc."
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        companyName: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                      })
                    }
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Company URL</Label>
                  <div className="flex mt-1.5">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-[var(--stone)] bg-[var(--cream)] text-sm text-[var(--ink-muted)]">
                      carve.app/company/
                    </span>
                    <Input
                      id="slug"
                      placeholder="acme-inc"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <select
                    id="industry"
                    value={formData.industry}
                    onChange={(e) =>
                      setFormData({ ...formData, industry: e.target.value })
                    }
                    className="mt-1.5 w-full h-10 px-3 rounded-lg border border-[var(--stone)] bg-white text-sm"
                  >
                    <option value="">Select industry</option>
                    <option value="technology">Technology</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="retail">Retail</option>
                    <option value="consulting">Consulting</option>
                    <option value="real-estate">Real Estate</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="website">Website (optional)</Label>
                  <div className="flex mt-1.5">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-[var(--stone)] bg-[var(--cream)]">
                      <Globe className="w-4 h-4 text-[var(--ink-muted)]" />
                    </span>
                    <Input
                      id="website"
                      placeholder="https://acme.com"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[var(--ink)] mb-2">
                  Brand your team&apos;s cards
                </h2>
                <p className="text-[var(--ink-muted)]">
                  Upload your logo and set brand colors for consistency.
                </p>
              </div>

              <div className="space-y-6">
                {/* Logo Upload */}
                <div>
                  <Label>Company Logo</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl border-2 border-dashed border-[var(--stone)] flex items-center justify-center bg-[var(--cream)] overflow-hidden">
                      {formData.logo ? (
                        <img
                          src={URL.createObjectURL(formData.logo)}
                          alt="Logo preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="w-8 h-8 text-[var(--ink-muted)]" />
                      )}
                    </div>
                    <div>
                      <Button variant="outline" size="sm" asChild>
                        <label className="cursor-pointer">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Logo
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                setFormData({
                                  ...formData,
                                  logo: e.target.files[0],
                                })
                              }
                            }}
                          />
                        </label>
                      </Button>
                      <p className="text-xs text-[var(--ink-muted)] mt-1">
                        PNG, JPG up to 2MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Brand Color */}
                <div>
                  <Label>Brand Color</Label>
                  <p className="text-sm text-[var(--ink-muted)] mb-2">
                    This color will be used on team member cards.
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) =>
                        setFormData({ ...formData, primaryColor: e.target.value })
                      }
                      className="w-12 h-12 rounded-lg border border-[var(--stone)] cursor-pointer"
                    />
                    <Input
                      value={formData.primaryColor}
                      onChange={(e) =>
                        setFormData({ ...formData, primaryColor: e.target.value })
                      }
                      className="w-32"
                    />
                    <div className="flex gap-2">
                      {['#FF5A5F', '#1E1E2F', '#10B981', '#6366F1', '#F59E0B'].map(
                        (color) => (
                          <button
                            key={color}
                            onClick={() =>
                              setFormData({ ...formData, primaryColor: color })
                            }
                            className={`w-8 h-8 rounded-lg border-2 transition-all ${
                              formData.primaryColor === color
                                ? 'border-[var(--ink)] scale-110'
                                : 'border-transparent'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Preview Card */}
                <div>
                  <Label>Preview</Label>
                  <div className="mt-2 max-w-xs">
                    <div className="bg-white rounded-xl shadow-lg border border-[var(--stone)] overflow-hidden">
                      <div
                        className="h-16"
                        style={{ backgroundColor: formData.primaryColor }}
                      />
                      <div className="p-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-[var(--cream)] border-4 border-white -mt-12 mx-auto flex items-center justify-center">
                          {formData.logo ? (
                            <img
                              src={URL.createObjectURL(formData.logo)}
                              alt="Logo"
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <Building2 className="w-6 h-6 text-[var(--ink-muted)]" />
                          )}
                        </div>
                        <p className="mt-2 font-semibold text-[var(--ink)]">
                          Team Member
                        </p>
                        <p className="text-sm text-[var(--ink-muted)]">
                          {formData.companyName || 'Your Company'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[var(--ink)] mb-2">
                  Invite your team
                </h2>
                <p className="text-[var(--ink-muted)]">
                  Add team members by email. You can always add more later.
                </p>
              </div>

              <div className="space-y-3">
                {formData.teamEmails.map((email, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="colleague@company.com"
                      value={email}
                      onChange={(e) => updateTeamEmail(index, e.target.value)}
                    />
                    {index > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newEmails = formData.teamEmails.filter(
                            (_, i) => i !== index
                          )
                          setFormData({ ...formData, teamEmails: newEmails })
                        }}
                      >
                        &times;
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addTeamEmail}>
                  + Add another
                </Button>
              </div>

              <div className="p-4 rounded-xl bg-[var(--cream)] border border-[var(--sand)]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--coral)]/10 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-[var(--coral)]" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--ink)]">
                      What happens next?
                    </p>
                    <p className="text-sm text-[var(--ink-muted)] mt-1">
                      Team members will receive an email invitation to create their
                      Carve profile using your company branding. They&apos;ll
                      automatically be linked to your organization.
                    </p>
                  </div>
                </div>
              </div>

              {/* Features Preview */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Users, label: 'Team Dashboard' },
                  { icon: Sparkles, label: 'Brand Templates' },
                  { icon: Shield, label: 'Admin Controls' },
                  { icon: Building2, label: 'Company Profile' },
                ].map((feature) => (
                  <div
                    key={feature.label}
                    className="flex items-center gap-2 p-3 rounded-lg bg-[var(--cream)]"
                  >
                    <feature.icon className="w-4 h-4 text-[var(--coral)]" />
                    <span className="text-sm font-medium text-[var(--ink)]">
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
            className={currentStep === 1 ? 'invisible' : ''}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            className="bg-[var(--coral)] hover:bg-[var(--coral-dark)]"
          >
            {currentStep === 3 ? 'Create Organization' : 'Continue'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
