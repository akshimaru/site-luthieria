import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jqyoxoviyyrmfszrcmbv.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxeW94b3ZpeXlybWZzenJjbWJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0ODA5NzIsImV4cCI6MjA3MTA1Njk3Mn0.ZUYsOHHInaIrnDooZ5u9xAJcnObW1Ry-3yttQ3BQ7k0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Service {
  id: string
  title: string
  slug: string
  short_description: string
  full_description?: string
  price_from?: number
  price_to?: number
  price_text: string
  image_url?: string
  gallery_images: string[]
  is_featured: boolean
  is_active: boolean
  meta_title?: string
  meta_description?: string
  display_order: number
  created_at: string
  updated_at: string
}

export interface GalleryItem {
  id: string
  title: string
  description?: string
  media_url: string
  thumbnail_url?: string
  media_type: 'image' | 'video'
  category: 'violao' | 'guitarra' | 'baixo' | 'violino' | 'instrumentos_sopro' | 'outros'
  service_id?: string
  is_featured: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  client_name: string
  client_photo?: string
  testimonial_text: string
  rating: number
  service_id?: string
  is_featured: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface SiteConfig {
  id: string
  site_name: string
  phone: string
  email: string
  address: string
  business_hours: {
    seg_sex?: string
    sab?: string
    dom?: string
  }
  social_media?: {
    facebook?: string
    instagram?: string
    whatsapp?: string
  }
  logo_url?: string
  favicon_url?: string
  theme_colors?: {
    primary_color: string
    secondary_color: string
    accent_color: string
    text_color: string
    background_color: string
    border_color: string
  }
  created_at: string
  updated_at: string
}

export interface MetaTag {
  id: string
  page_slug: string
  page_title: string
  meta_description: string
  meta_keywords?: string
  og_title?: string
  og_description?: string
  og_image?: string
  og_type?: string
  schema_json?: any
  canonical_url?: string
  robots?: string
  created_at: string
  updated_at: string
}

export interface MediaFile {
  id: string
  filename: string
  original_name: string
  file_url: string
  file_size?: number
  mime_type?: string
  category: string
  alt_text?: string
  caption?: string
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface ContentSection {
  id: string
  section_key: string
  title: string
  content: string
  content_type: 'text' | 'html' | 'markdown'
  image_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AdminUser {
  id: string
  auth_user_id: string
  email: string
  full_name: string
  role: string
  is_active: boolean
  last_login?: string
  created_at: string
  updated_at: string
}