'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  Upload,
  Palette,
  Type,
  Layout,
  CreditCard,
  Download,
  Eye,
  RotateCcw,
  Sparkles,
  Check,
} from 'lucide-react'
import { toast } from 'sonner'

interface CardDesign {
  template: 'minimal' | 'modern' | 'bold' | 'classic'
  material: 'pvc' | 'metal' | 'wood' | 'recycled'
  primaryColor: string
  secondaryColor: string
  textColor: string
  logoUrl: string | null
  logoPosition: 'left' | 'center' | 'right'
  showQR: boolean
  qrPosition: 'front' | 'back'
  fontSize: number
  borderRadius: number
}

const defaultDesign: CardDesign = {
  template: 'modern',
  material: 'pvc',
  primaryColor: '#0A0A0A',
  secondaryColor: '#FF6B5B',
  textColor: '#FFFFFF',
  logoUrl: null,
  logoPosition: 'left',
  showQR: true,
  qrPosition: 'back',
  fontSize: 16,
  borderRadius: 16,
}

const templates = [
  { id: 'minimal', name: 'Minimal', description: 'Clean and simple' },
  { id: 'modern', name: 'Modern', description: 'Bold with accent colors' },
  { id: 'bold', name: 'Bold', description: 'Eye-catching gradients' },
  { id: 'classic', name: 'Classic', description: 'Traditional business card' },
]

const materials = [
  { id: 'pvc', name: 'PVC', price: 15, description: 'Standard plastic card' },
  { id: 'metal', name: 'Metal', price: 45, description: 'Premium metal finish' },
  { id: 'wood', name: 'Wood', price: 35, description: 'Eco-friendly bamboo' },
  { id: 'recycled', name: 'Recycled', price: 20, description: 'Recycled materials' },
]

const colorPresets = [
  '#0A0A0A', // Ink
  '#FF6B5B', // Coral
  '#3B82F6', // Blue
  '#10B981', // Green
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#FFFFFF', // White
]

export default function CardDesignerPage() {
  const [design, setDesign] = useState<CardDesign>(defaultDesign)
  const [activeTab, setActiveTab] = useState<'template' | 'colors' | 'layout'>('template')
  const [isFlipped, setIsFlipped] = useState(false)

  const updateDesign = (updates: Partial<CardDesign>) => {
    setDesign((prev) => ({ ...prev, ...updates }))
  }

  const handleReset = () => {
    setDesign(defaultDesign)
    toast.success('Design reset to defaults')
  }

  const handleSave = () => {
    toast.success('Design saved!', {
      description: 'Your card design has been saved.',
    })
  }

  const handleOrder = () => {
    const material = materials.find((m) => m.id === design.material)
    toast.success('Added to cart', {
      description: `1x ${material?.name} card - $${material?.price}`,
    })
  }

  const selectedMaterial = materials.find((m) => m.id === design.material)

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[var(--stone)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/cards"
                className="p-2 rounded-lg hover:bg-[var(--cream)] transition"
              >
                <ArrowLeft className="w-5 h-5 text-[var(--ink)]" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-[var(--ink)]">Card Designer</h1>
                <p className="text-sm text-[var(--ink-muted)]">
                  Customize your NFC business card
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" onClick={handleSave}>
                <Download className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                className="bg-[var(--coral)] hover:bg-[var(--coral-dark)]"
                onClick={handleOrder}
              >
                Order Card - ${selectedMaterial?.price}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Preview */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="bg-white rounded-3xl border border-[var(--stone)] p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-[var(--ink)]">Preview</h2>
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="flex items-center gap-2 text-sm text-[var(--ink-muted)] hover:text-[var(--ink)] transition"
                >
                  <Eye className="w-4 h-4" />
                  {isFlipped ? 'View Front' : 'View Back'}
                </button>
              </div>

              {/* Card Preview */}
              <div className="perspective-1000">
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  className="relative w-full aspect-[1.586/1] preserve-3d"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Front */}
                  <div
                    className="absolute inset-0 backface-hidden"
                    style={{
                      backgroundColor: design.primaryColor,
                      borderRadius: `${design.borderRadius}px`,
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      {/* Logo area */}
                      <div
                        className={`flex ${
                          design.logoPosition === 'center'
                            ? 'justify-center'
                            : design.logoPosition === 'right'
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        {design.logoUrl ? (
                          <img
                            src={design.logoUrl}
                            alt="Logo"
                            className="h-8 w-auto object-contain"
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: design.secondaryColor }}
                          >
                            <CreditCard className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div>
                        <h3
                          className="font-bold mb-1"
                          style={{
                            color: design.textColor,
                            fontSize: `${design.fontSize + 4}px`,
                          }}
                        >
                          Sarah Chen
                        </h3>
                        <p
                          style={{
                            color: design.textColor,
                            opacity: 0.7,
                            fontSize: `${design.fontSize - 2}px`,
                          }}
                        >
                          Product Designer
                        </p>
                        <p
                          style={{
                            color: design.secondaryColor,
                            fontSize: `${design.fontSize - 4}px`,
                          }}
                          className="mt-1 font-medium"
                        >
                          Acme Inc.
                        </p>
                      </div>
                    </div>

                    {/* NFC indicator */}
                    <div
                      className="absolute bottom-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: design.secondaryColor + '30' }}
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: design.secondaryColor }}
                      />
                    </div>
                  </div>

                  {/* Back */}
                  <div
                    className="absolute inset-0 backface-hidden"
                    style={{
                      backgroundColor: design.primaryColor,
                      borderRadius: `${design.borderRadius}px`,
                      transform: 'rotateY(180deg)',
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <div className="absolute inset-0 p-6 flex items-center justify-center">
                      {design.showQR && (
                        <div className="text-center">
                          <div
                            className="w-24 h-24 mx-auto mb-3 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: design.textColor }}
                          >
                            <div className="w-20 h-20 bg-black/10 rounded grid grid-cols-3 gap-1 p-2">
                              {[...Array(9)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`rounded-sm ${
                                    Math.random() > 0.3 ? 'bg-black/80' : 'bg-transparent'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p
                            style={{
                              color: design.textColor,
                              opacity: 0.7,
                              fontSize: '12px',
                            }}
                          >
                            Scan to connect
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Material & Price Info */}
              <div className="mt-6 p-4 rounded-xl bg-[var(--cream)] flex items-center justify-between">
                <div>
                  <p className="font-medium text-[var(--ink)]">{selectedMaterial?.name} Card</p>
                  <p className="text-sm text-[var(--ink-muted)]">{selectedMaterial?.description}</p>
                </div>
                <p className="text-2xl font-bold text-[var(--ink)]">${selectedMaterial?.price}</p>
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-[var(--stone)] p-1.5 flex">
              {[
                { id: 'template', icon: Layout, label: 'Template' },
                { id: 'colors', icon: Palette, label: 'Colors' },
                { id: 'layout', icon: Type, label: 'Layout' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition ${
                    activeTab === tab.id
                      ? 'bg-[var(--ink)] text-white'
                      : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Template Tab */}
            {activeTab === 'template' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Templates */}
                <div className="bg-white rounded-2xl border border-[var(--stone)] p-6">
                  <h3 className="font-semibold text-[var(--ink)] mb-4">Choose Template</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => updateDesign({ template: template.id as CardDesign['template'] })}
                        className={`p-4 rounded-xl border-2 text-left transition ${
                          design.template === template.id
                            ? 'border-[var(--coral)] bg-[var(--coral)]/5'
                            : 'border-[var(--stone)] hover:border-[var(--ink)]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-[var(--ink)]">{template.name}</span>
                          {design.template === template.id && (
                            <Check className="w-4 h-4 text-[var(--coral)]" />
                          )}
                        </div>
                        <p className="text-sm text-[var(--ink-muted)]">{template.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Materials */}
                <div className="bg-white rounded-2xl border border-[var(--stone)] p-6">
                  <h3 className="font-semibold text-[var(--ink)] mb-4">Card Material</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {materials.map((material) => (
                      <button
                        key={material.id}
                        onClick={() => updateDesign({ material: material.id as CardDesign['material'] })}
                        className={`p-4 rounded-xl border-2 text-left transition ${
                          design.material === material.id
                            ? 'border-[var(--coral)] bg-[var(--coral)]/5'
                            : 'border-[var(--stone)] hover:border-[var(--ink)]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-[var(--ink)]">{material.name}</span>
                          <span className="font-bold text-[var(--coral)]">${material.price}</span>
                        </div>
                        <p className="text-sm text-[var(--ink-muted)]">{material.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Colors Tab */}
            {activeTab === 'colors' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl border border-[var(--stone)] p-6">
                  <h3 className="font-semibold text-[var(--ink)] mb-4">Primary Color</h3>
                  <div className="flex gap-2 mb-4">
                    {colorPresets.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateDesign({ primaryColor: color })}
                        className={`w-10 h-10 rounded-xl border-2 transition ${
                          design.primaryColor === color
                            ? 'border-[var(--coral)] scale-110'
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <Input
                      type="color"
                      value={design.primaryColor}
                      onChange={(e) => updateDesign({ primaryColor: e.target.value })}
                      className="w-12 h-12 p-1 rounded-xl"
                    />
                    <Input
                      value={design.primaryColor}
                      onChange={(e) => updateDesign({ primaryColor: e.target.value })}
                      className="flex-1"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[var(--stone)] p-6">
                  <h3 className="font-semibold text-[var(--ink)] mb-4">Accent Color</h3>
                  <div className="flex gap-2 mb-4">
                    {colorPresets.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateDesign({ secondaryColor: color })}
                        className={`w-10 h-10 rounded-xl border-2 transition ${
                          design.secondaryColor === color
                            ? 'border-[var(--coral)] scale-110'
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <Input
                      type="color"
                      value={design.secondaryColor}
                      onChange={(e) => updateDesign({ secondaryColor: e.target.value })}
                      className="w-12 h-12 p-1 rounded-xl"
                    />
                    <Input
                      value={design.secondaryColor}
                      onChange={(e) => updateDesign({ secondaryColor: e.target.value })}
                      className="flex-1"
                      placeholder="#FF6B5B"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[var(--stone)] p-6">
                  <h3 className="font-semibold text-[var(--ink)] mb-4">Text Color</h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => updateDesign({ textColor: '#FFFFFF' })}
                      className={`flex-1 py-3 rounded-xl border-2 font-medium transition ${
                        design.textColor === '#FFFFFF'
                          ? 'border-[var(--coral)] bg-[var(--ink)] text-white'
                          : 'border-[var(--stone)] bg-[var(--ink)] text-white opacity-50'
                      }`}
                    >
                      White Text
                    </button>
                    <button
                      onClick={() => updateDesign({ textColor: '#0A0A0A' })}
                      className={`flex-1 py-3 rounded-xl border-2 font-medium transition ${
                        design.textColor === '#0A0A0A'
                          ? 'border-[var(--coral)] bg-white text-[var(--ink)]'
                          : 'border-[var(--stone)] bg-white text-[var(--ink)] opacity-50'
                      }`}
                    >
                      Dark Text
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Layout Tab */}
            {activeTab === 'layout' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl border border-[var(--stone)] p-6">
                  <h3 className="font-semibold text-[var(--ink)] mb-4">Logo</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 rounded-xl border-2 border-dashed border-[var(--stone)] flex items-center justify-center bg-[var(--cream)]">
                      {design.logoUrl ? (
                        <img src={design.logoUrl} alt="Logo" className="w-16 h-16 object-contain" />
                      ) : (
                        <Upload className="w-6 h-6 text-[var(--ink-muted)]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Button variant="outline" className="mb-2">
                        Upload Logo
                      </Button>
                      <p className="text-xs text-[var(--ink-muted)]">PNG, SVG. Max 2MB.</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-[var(--ink-muted)]">Logo Position</Label>
                    <Select
                      value={design.logoPosition}
                      onValueChange={(v) => updateDesign({ logoPosition: v as CardDesign['logoPosition'] })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[var(--stone)] p-6">
                  <h3 className="font-semibold text-[var(--ink)] mb-4">Typography</h3>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm text-[var(--ink-muted)]">Font Size</Label>
                      <span className="text-sm font-medium text-[var(--ink)]">{design.fontSize}px</span>
                    </div>
                    <Slider
                      value={[design.fontSize]}
                      onValueChange={([v]) => updateDesign({ fontSize: v })}
                      min={12}
                      max={24}
                      step={1}
                      className="my-4"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[var(--stone)] p-6">
                  <h3 className="font-semibold text-[var(--ink)] mb-4">Card Style</h3>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm text-[var(--ink-muted)]">Corner Radius</Label>
                      <span className="text-sm font-medium text-[var(--ink)]">{design.borderRadius}px</span>
                    </div>
                    <Slider
                      value={[design.borderRadius]}
                      onValueChange={([v]) => updateDesign({ borderRadius: v })}
                      min={0}
                      max={32}
                      step={2}
                      className="my-4"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[var(--stone)] p-6">
                  <h3 className="font-semibold text-[var(--ink)] mb-4">QR Code</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[var(--ink)]">Show QR Code</p>
                      <p className="text-sm text-[var(--ink-muted)]">Display on card back</p>
                    </div>
                    <button
                      onClick={() => updateDesign({ showQR: !design.showQR })}
                      className={`w-12 h-7 rounded-full transition ${
                        design.showQR ? 'bg-[var(--coral)]' : 'bg-[var(--stone)]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                          design.showQR ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
