'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  GripVertical,
  Trash2,
  Plus,
  Check,
  X,
  ExternalLink,
  Linkedin,
  Twitter,
  Instagram,
  Github,
  Youtube,
  Facebook,
  Globe,
  Mail,
  Phone,
} from 'lucide-react'
import { toast } from 'sonner'
import { LINK_TYPES } from '@/types/database'

interface EditableLink {
  id: string
  type: string
  url: string
  label: string
  order: number
}

interface SortableLinksProps {
  links: EditableLink[]
  onLinksChange: (links: EditableLink[]) => void
}

const LINK_ICONS: Record<string, React.ElementType> = {
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  github: Github,
  youtube: Youtube,
  facebook: Facebook,
  website: Globe,
  email: Mail,
  phone: Phone,
}

function SortableLinkItem({
  link,
  onUpdate,
  onRemove,
}: {
  link: EditableLink
  onUpdate: (field: keyof EditableLink, value: string) => void
  onRemove: () => void
}) {
  const [isEditing, setIsEditing] = useState(!link.url)
  const [urlError, setUrlError] = useState<string | null>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  }

  const Icon = LINK_ICONS[link.type] || ExternalLink

  const validateUrl = (url: string) => {
    if (!url) {
      setUrlError(null)
      return
    }
    try {
      new URL(url)
      setUrlError(null)
    } catch {
      setUrlError('Invalid URL format')
    }
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`group flex items-center gap-3 p-3 rounded-xl bg-white/5 border transition-all ${
        isDragging
          ? 'border-[var(--coral)] shadow-lg shadow-[var(--coral)]/20'
          : urlError
          ? 'border-red-500/50'
          : 'border-white/10 hover:border-white/20'
      }`}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="touch-none cursor-grab active:cursor-grabbing p-1 rounded hover:bg-white/10"
      >
        <GripVertical className="h-5 w-5 text-white/40" />
      </button>

      {/* Link Type Icon */}
      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-white/70" />
      </div>

      {isEditing ? (
        <>
          {/* Type Selector */}
          <Select
            value={link.type}
            onValueChange={(value) => onUpdate('type', value)}
          >
            <SelectTrigger className="w-[120px] bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-white/10">
              {Object.entries(LINK_TYPES).map(([key, value]) => (
                <SelectItem key={key} value={key} className="text-white">
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Label Input */}
          <Input
            placeholder="Label (optional)"
            value={link.label}
            onChange={(e) => onUpdate('label', e.target.value)}
            className="w-[120px] bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />

          {/* URL Input */}
          <div className="flex-1 relative">
            <Input
              placeholder="https://..."
              value={link.url}
              onChange={(e) => {
                onUpdate('url', e.target.value)
                validateUrl(e.target.value)
              }}
              onBlur={() => validateUrl(link.url)}
              className={`bg-white/5 border-white/10 text-white placeholder:text-white/40 ${
                urlError ? 'border-red-500' : ''
              }`}
            />
            {urlError && (
              <p className="absolute -bottom-5 left-0 text-xs text-red-400">{urlError}</p>
            )}
          </div>

          {/* Confirm Button */}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              if (link.url && !urlError) {
                setIsEditing(false)
                toast.success('Link saved')
              } else if (!link.url) {
                toast.error('Please enter a URL')
              }
            }}
            className="text-green-400 hover:text-green-300 hover:bg-green-400/10"
          >
            <Check className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          {/* Display Mode */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white truncate">
              {link.label || LINK_TYPES[link.type as keyof typeof LINK_TYPES] || link.type}
            </p>
            <p className="text-sm text-white/50 truncate">{link.url}</p>
          </div>

          {/* Preview Link */}
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/70 transition"
          >
            <ExternalLink className="h-4 w-4" />
          </a>

          {/* Edit Button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditing(true)}
            className="text-white/40 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition"
          >
            Edit
          </Button>
        </>
      )}

      {/* Remove Button */}
      <Button
        size="icon"
        variant="ghost"
        onClick={onRemove}
        className="text-white/40 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </motion.div>
  )
}

export function SortableLinks({ links, onLinksChange }: SortableLinksProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((link) => link.id === active.id)
      const newIndex = links.findIndex((link) => link.id === over.id)
      const newLinks = arrayMove(links, oldIndex, newIndex).map((link, index) => ({
        ...link,
        order: index,
      }))
      onLinksChange(newLinks)
      toast.success('Links reordered')
    }
  }

  const addLink = () => {
    const newLink: EditableLink = {
      id: `link-${Date.now()}`,
      type: 'website',
      url: '',
      label: '',
      order: links.length,
    }
    onLinksChange([...links, newLink])
  }

  const updateLink = (id: string, field: keyof EditableLink, value: string) => {
    const newLinks = links.map((link) =>
      link.id === id ? { ...link, [field]: value } : link
    )
    onLinksChange(newLinks)
  }

  const removeLink = (id: string) => {
    const newLinks = links
      .filter((link) => link.id !== id)
      .map((link, index) => ({ ...link, order: index }))
    onLinksChange(newLinks)
    toast.success('Link removed')
  }

  return (
    <div className="space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {links.map((link) => (
              <SortableLinkItem
                key={link.id}
                link={link}
                onUpdate={(field, value) => updateLink(link.id, field, value)}
                onRemove={() => removeLink(link.id)}
              />
            ))}
          </AnimatePresence>
        </SortableContext>
      </DndContext>

      {links.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-white/40"
        >
          <Globe className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">No links added yet</p>
          <p className="text-sm">Add your social profiles and websites</p>
        </motion.div>
      )}

      <Button
        onClick={addLink}
        variant="outline"
        className="w-full border-dashed border-white/20 text-white hover:bg-white/10 hover:border-white/30"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Link
      </Button>
    </div>
  )
}
