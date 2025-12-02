'use client'

import { useState } from 'react'
import { motion, Reorder } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Plus,
  ExternalLink,
  Trash2,
  GripVertical,
  Image as ImageIcon,
  Link as LinkIcon,
  Eye,
  Settings,
  Sparkles,
  Globe,
  Edit2,
  Layout,
  Palette,
  Type,
} from 'lucide-react'
import { toast } from 'sonner'

interface Project {
  id: string
  title: string
  description: string
  image: string
  link: string
  tags: string[]
}

const initialProjects: Project[] = [
  {
    id: '1',
    title: 'E-commerce Redesign',
    description: 'Complete redesign of a major e-commerce platform improving conversion by 40%',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    link: 'https://example.com/project1',
    tags: ['UI/UX', 'E-commerce'],
  },
  {
    id: '2',
    title: 'Mobile Banking App',
    description: 'Award-winning mobile banking experience for a leading fintech startup',
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=600&h=400&fit=crop',
    link: 'https://example.com/project2',
    tags: ['Mobile', 'Fintech'],
  },
  {
    id: '3',
    title: 'SaaS Dashboard',
    description: 'Analytics dashboard for enterprise SaaS platform with real-time data visualization',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    link: 'https://example.com/project3',
    tags: ['Dashboard', 'SaaS'],
  },
]

const templates = [
  { id: 'minimal', name: 'Minimal', preview: 'Clean, simple grid layout' },
  { id: 'cards', name: 'Cards', preview: 'Elevated card-based design' },
  { id: 'masonry', name: 'Masonry', preview: 'Pinterest-style layout' },
  { id: 'timeline', name: 'Timeline', preview: 'Chronological showcase' },
]

export default function PortfolioBuilderPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [activeTab, setActiveTab] = useState<'projects' | 'settings'>('projects')
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState('cards')
  const [portfolioSettings, setPortfolioSettings] = useState({
    headline: 'Product Designer',
    bio: 'I create digital experiences that users love. With 5+ years of experience in product design, I specialize in creating intuitive interfaces for complex problems.',
    showContact: true,
    accentColor: '#FF5A5F',
  })

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: 'New Project',
      description: 'Add a description for your project',
      image: '',
      link: '',
      tags: [],
    }
    setProjects([...projects, newProject])
    setEditingProject(newProject)
  }

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(
      projects.map((p) => (p.id === id ? { ...p, ...updates } : p))
    )
  }

  const deleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id))
    toast.success('Project removed')
  }

  const handlePublish = () => {
    toast.success('Portfolio published!', {
      description: 'Your portfolio is now live at carve.app/p/sarahchen',
    })
  }

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      {/* Header */}
      <div className="bg-white border-b border-[var(--stone)] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-[var(--ink)]">
                Portfolio Builder
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[var(--coral)]/10 text-[var(--coral)] text-xs font-medium">
                Beta
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" asChild>
                <a href="/p/sarahchen" target="_blank">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </a>
              </Button>
              <Button
                className="bg-[var(--coral)] hover:bg-[var(--coral-dark)]"
                onClick={handlePublish}
              >
                <Globe className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-white rounded-xl border border-[var(--stone)] w-fit">
              {[
                { id: 'projects', label: 'Projects', icon: Layout },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'projects' | 'settings')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-[var(--ink)]">
                    Your Projects ({projects.length})
                  </h2>
                  <Button onClick={addProject} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                </div>

                <Reorder.Group
                  axis="y"
                  values={projects}
                  onReorder={setProjects}
                  className="space-y-3"
                >
                  {projects.map((project) => (
                    <Reorder.Item
                      key={project.id}
                      value={project}
                      className="bg-white rounded-xl border border-[var(--stone)] overflow-hidden cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex items-stretch">
                        {/* Drag Handle */}
                        <div className="flex items-center px-3 bg-[var(--cream)] border-r border-[var(--stone)]">
                          <GripVertical className="w-4 h-4 text-[var(--ink-muted)]" />
                        </div>

                        {/* Image */}
                        <div className="w-32 h-24 bg-[var(--cream)] shrink-0">
                          {project.image ? (
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-[var(--ink-muted)]" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-4">
                          <h3 className="font-medium text-[var(--ink)]">
                            {project.title}
                          </h3>
                          <p className="text-sm text-[var(--ink-muted)] line-clamp-1 mt-1">
                            {project.description}
                          </p>
                          <div className="flex gap-1 mt-2">
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded-full bg-[var(--cream)] text-xs text-[var(--ink-muted)]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 px-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setEditingProject(project)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          {project.link && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              asChild
                            >
                              <a href={project.link} target="_blank">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                            onClick={() => deleteProject(project.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>

                {projects.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-xl border border-dashed border-[var(--stone)]">
                    <ImageIcon className="w-12 h-12 text-[var(--ink-muted)] mx-auto mb-4" />
                    <h3 className="font-medium text-[var(--ink)] mb-2">
                      No projects yet
                    </h3>
                    <p className="text-sm text-[var(--ink-muted)] mb-4">
                      Add your first project to showcase your work
                    </p>
                    <Button onClick={addProject}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Profile Section */}
                <div className="bg-white rounded-xl border border-[var(--stone)] p-6">
                  <h3 className="font-semibold text-[var(--ink)] mb-4 flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Profile Info
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Headline</Label>
                      <Input
                        value={portfolioSettings.headline}
                        onChange={(e) =>
                          setPortfolioSettings({
                            ...portfolioSettings,
                            headline: e.target.value,
                          })
                        }
                        placeholder="e.g., Product Designer"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Bio</Label>
                      <textarea
                        value={portfolioSettings.bio}
                        onChange={(e) =>
                          setPortfolioSettings({
                            ...portfolioSettings,
                            bio: e.target.value,
                          })
                        }
                        rows={4}
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-[var(--stone)] text-sm resize-none"
                        placeholder="Tell visitors about yourself..."
                      />
                    </div>
                  </div>
                </div>

                {/* Template Selection */}
                <div className="bg-white rounded-xl border border-[var(--stone)] p-6">
                  <h3 className="font-semibold text-[var(--ink)] mb-4 flex items-center gap-2">
                    <Layout className="w-4 h-4" />
                    Template
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          selectedTemplate === template.id
                            ? 'border-[var(--coral)] bg-[var(--coral)]/5'
                            : 'border-[var(--stone)] hover:border-[var(--ink)]/20'
                        }`}
                      >
                        <p className="font-medium text-[var(--ink)]">
                          {template.name}
                        </p>
                        <p className="text-xs text-[var(--ink-muted)] mt-1">
                          {template.preview}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Appearance */}
                <div className="bg-white rounded-xl border border-[var(--stone)] p-6">
                  <h3 className="font-semibold text-[var(--ink)] mb-4 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Appearance
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Accent Color</Label>
                      <div className="flex items-center gap-3 mt-2">
                        <input
                          type="color"
                          value={portfolioSettings.accentColor}
                          onChange={(e) =>
                            setPortfolioSettings({
                              ...portfolioSettings,
                              accentColor: e.target.value,
                            })
                          }
                          className="w-10 h-10 rounded-lg border border-[var(--stone)] cursor-pointer"
                        />
                        <Input
                          value={portfolioSettings.accentColor}
                          onChange={(e) =>
                            setPortfolioSettings({
                              ...portfolioSettings,
                              accentColor: e.target.value,
                            })
                          }
                          className="w-32"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Contact Button</Label>
                        <p className="text-xs text-[var(--ink-muted)]">
                          Allow visitors to contact you
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setPortfolioSettings({
                            ...portfolioSettings,
                            showContact: !portfolioSettings.showContact,
                          })
                        }
                        className={`w-12 h-6 rounded-full transition-colors ${
                          portfolioSettings.showContact
                            ? 'bg-[var(--coral)]'
                            : 'bg-[var(--stone)]'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                            portfolioSettings.showContact
                              ? 'translate-x-6'
                              : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preview Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl border border-[var(--stone)] overflow-hidden">
                <div className="p-4 border-b border-[var(--stone)] flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--ink)]">
                    Live Preview
                  </span>
                  <Button variant="ghost" size="sm" asChild>
                    <a href="/p/sarahchen" target="_blank">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </Button>
                </div>
                <div className="p-4 bg-[var(--cream)] min-h-[500px]">
                  {/* Mini Preview */}
                  <div className="bg-white rounded-lg shadow-sm p-4 scale-90 origin-top">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-[var(--cream)] mx-auto mb-3" />
                      <h4 className="font-semibold text-[var(--ink)] text-sm">
                        Sarah Chen
                      </h4>
                      <p className="text-xs text-[var(--ink-muted)]">
                        {portfolioSettings.headline}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {projects.slice(0, 3).map((project) => (
                        <div
                          key={project.id}
                          className="h-16 rounded bg-[var(--cream)]"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="mt-4 p-4 rounded-xl bg-[var(--coral)]/5 border border-[var(--coral)]/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[var(--coral)] shrink-0" />
                  <div>
                    <p className="font-medium text-[var(--ink)] text-sm">
                      Pro Tips
                    </p>
                    <ul className="mt-2 space-y-1 text-xs text-[var(--ink-muted)]">
                      <li>• Add 3-6 projects for best results</li>
                      <li>• Use high-quality images</li>
                      <li>• Keep descriptions concise</li>
                      <li>• Add relevant tags for discoverability</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Project Modal */}
      {editingProject && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setEditingProject(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[var(--ink)] mb-4">
              Edit Project
            </h3>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={editingProject.title}
                  onChange={(e) =>
                    updateProject(editingProject.id, { title: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Description</Label>
                <textarea
                  value={editingProject.description}
                  onChange={(e) =>
                    updateProject(editingProject.id, {
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-[var(--stone)] text-sm resize-none"
                />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input
                  value={editingProject.image}
                  onChange={(e) =>
                    updateProject(editingProject.id, { image: e.target.value })
                  }
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Project Link</Label>
                <Input
                  value={editingProject.link}
                  onChange={(e) =>
                    updateProject(editingProject.id, { link: e.target.value })
                  }
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Tags (comma-separated)</Label>
                <Input
                  value={editingProject.tags.join(', ')}
                  onChange={(e) =>
                    updateProject(editingProject.id, {
                      tags: e.target.value.split(',').map((t) => t.trim()),
                    })
                  }
                  placeholder="Design, Mobile, SaaS"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setEditingProject(null)}>
                Cancel
              </Button>
              <Button
                className="bg-[var(--coral)] hover:bg-[var(--coral-dark)]"
                onClick={() => {
                  setEditingProject(null)
                  toast.success('Project updated')
                }}
              >
                Save Changes
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
