export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          username: string
          name: string
          title: string | null
          company: string | null
          bio: string | null
          email: string | null
          phone: string | null
          website: string | null
          avatar_url: string | null
          cover_url: string | null
          theme: string
          is_primary: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          username: string
          name: string
          title?: string | null
          company?: string | null
          bio?: string | null
          email?: string | null
          phone?: string | null
          website?: string | null
          avatar_url?: string | null
          cover_url?: string | null
          theme?: string
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string
          name?: string
          title?: string | null
          company?: string | null
          bio?: string | null
          email?: string | null
          phone?: string | null
          website?: string | null
          avatar_url?: string | null
          cover_url?: string | null
          theme?: string
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      profile_links: {
        Row: {
          id: string
          profile_id: string
          type: string
          url: string
          label: string
          icon: string | null
          order: number
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          type: string
          url: string
          label: string
          icon?: string | null
          order?: number
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          type?: string
          url?: string
          label?: string
          icon?: string | null
          order?: number
          created_at?: string
        }
      }
      cards: {
        Row: {
          id: string
          profile_id: string
          nfc_uid: string | null
          qr_code_url: string | null
          design_id: string | null
          shipping_address: Json | null
          status: 'active' | 'inactive' | 'shipped' | 'pending' | 'printed' | 'delivered'
          shipped_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          nfc_uid?: string | null
          qr_code_url?: string | null
          design_id?: string | null
          shipping_address?: Json | null
          status?: 'active' | 'inactive' | 'shipped' | 'pending' | 'printed' | 'delivered'
          shipped_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          nfc_uid?: string | null
          qr_code_url?: string | null
          design_id?: string | null
          shipping_address?: Json | null
          status?: 'active' | 'inactive' | 'shipped' | 'pending' | 'printed' | 'delivered'
          shipped_at?: string | null
          created_at?: string
        }
      }
      profile_views: {
        Row: {
          id: string
          profile_id: string
          visitor_ip_hash: string | null
          device: string | null
          browser: string | null
          referrer: string | null
          country: string | null
          city: string | null
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          visitor_ip_hash?: string | null
          device?: string | null
          browser?: string | null
          referrer?: string | null
          country?: string | null
          city?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          visitor_ip_hash?: string | null
          device?: string | null
          browser?: string | null
          referrer?: string | null
          country?: string | null
          city?: string | null
          created_at?: string
        }
      }
      lead_captures: {
        Row: {
          id: string
          profile_id: string
          name: string
          email: string | null
          phone: string | null
          company: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          name: string
          email?: string | null
          phone?: string | null
          company?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          company?: string | null
          notes?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type ProfileLink = Database['public']['Tables']['profile_links']['Row']
export type ProfileLinkInsert = Database['public']['Tables']['profile_links']['Insert']

export type Card = Database['public']['Tables']['cards']['Row']
export type ProfileView = Database['public']['Tables']['profile_views']['Row']
export type LeadCapture = Database['public']['Tables']['lead_captures']['Row']

// Link types enum
export const LINK_TYPES = {
  WEBSITE: 'website',
  EMAIL: 'email',
  PHONE: 'phone',
  WHATSAPP: 'whatsapp',
  LINKEDIN: 'linkedin',
  TWITTER: 'twitter',
  INSTAGRAM: 'instagram',
  FACEBOOK: 'facebook',
  TIKTOK: 'tiktok',
  YOUTUBE: 'youtube',
  GITHUB: 'github',
  CALENDLY: 'calendly',
  CUSTOM: 'custom',
} as const

export type LinkType = typeof LINK_TYPES[keyof typeof LINK_TYPES]
