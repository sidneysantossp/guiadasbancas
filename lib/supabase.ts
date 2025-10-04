import { createClient } from '@supabase/supabase-js'

// Supabase configuration - ATIVO
// Migrado de volta do MySQL para Supabase devido a problemas de conectividade

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rgqlncxrzwgjreggrjcq.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncWxuY3hyendnanJlZ2dyamNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMjMyOTMsImV4cCI6MjA3NDc5OTI5M30.72R42d1a6qchq1KMZLyncBzfiIH7T_yS6BJRCC72mLc'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para operações administrativas
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncWxuY3hyendnanJlZ2dyamNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzI5MywiZXhwIjoyMDc0Nzk5MjkzfQ.bdkHUKuaDQ22lZqMmFMT_3P3L0VAK11mGlJ6YkU3d6s'
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-my-custom-header': 'service-role-bypass'
    }
  }
})

export { supabase, supabaseAdmin }

// Tipos do banco de dados
export interface Database {
  public: {
    Tables: {
      bancas: {
        Row: {
          id: string
          name: string
          cep: string
          address: string
          lat: number
          lng: number
          rating: number | null
          categories: string[] | null
          cover_image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          cep: string
          address: string
          lat: number
          lng: number
          rating?: number | null
          categories?: string[] | null
          cover_image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          cep?: string
          address?: string
          lat?: number
          lng?: number
          rating?: number | null
          categories?: string[] | null
          cover_image?: string | null
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          description_full: string | null
          price: number
          price_original: number | null
          discount_percent: number | null
          category_id: string | null
          banca_id: string
          images: string[] | null
          gallery_images: string[] | null
          specifications: any | null
          rating_avg: number | null
          reviews_count: number | null
          stock_qty: number | null
          track_stock: boolean
          sob_encomenda: boolean
          pre_venda: boolean
          pronta_entrega: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          description_full?: string | null
          price: number
          price_original?: number | null
          discount_percent?: number | null
          category_id?: string | null
          banca_id: string
          images?: string[] | null
          gallery_images?: string[] | null
          specifications?: any | null
          rating_avg?: number | null
          reviews_count?: number | null
          stock_qty?: number | null
          track_stock?: boolean
          sob_encomenda?: boolean
          pre_venda?: boolean
          pronta_entrega?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          description_full?: string | null
          price?: number
          price_original?: number | null
          discount_percent?: number | null
          category_id?: string | null
          banca_id?: string
          images?: string[] | null
          gallery_images?: string[] | null
          specifications?: any | null
          rating_avg?: number | null
          reviews_count?: number | null
          stock_qty?: number | null
          track_stock?: boolean
          sob_encomenda?: boolean
          pre_venda?: boolean
          pronta_entrega?: boolean
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          image: string | null
          link: string
          active: boolean
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          image?: string | null
          link: string
          active?: boolean
          order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          image?: string | null
          link?: string
          active?: boolean
          order?: number
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string | null
          customer_name: string
          customer_phone: string
          customer_email: string | null
          customer_address: string | null
          items: any[]
          subtotal: number
          shipping_fee: number
          total: number
          payment_method: string
          status: string
          notes: string | null
          estimated_delivery: string | null
          banca_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number?: string | null
          customer_name: string
          customer_phone: string
          customer_email?: string | null
          customer_address?: string | null
          items: any[]
          subtotal: number
          shipping_fee: number
          total: number
          payment_method: string
          status?: string
          notes?: string | null
          estimated_delivery?: string | null
          banca_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string | null
          customer_name?: string
          customer_phone?: string
          customer_email?: string | null
          customer_address?: string | null
          items?: any[]
          subtotal?: number
          shipping_fee?: number
          total?: number
          payment_method?: string
          status?: string
          notes?: string | null
          estimated_delivery?: string | null
          banca_id?: string
          updated_at?: string
        }
      }
      branding: {
        Row: {
          id: string
          logo_url: string | null
          logo_alt: string
          site_name: string
          primary_color: string
          secondary_color: string
          favicon: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          logo_url?: string | null
          logo_alt?: string
          site_name?: string
          primary_color?: string
          secondary_color?: string
          favicon?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          logo_url?: string | null
          logo_alt?: string
          site_name?: string
          primary_color?: string
          secondary_color?: string
          favicon?: string | null
          updated_at?: string
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
