import { createClient } from '@supabase/supabase-js'

// Supabase configuration - ATIVO
// Migrado de volta do MySQL para Supabase devido a problemas de conectividade

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para operações administrativas
const isBrowser = typeof window !== 'undefined'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!isBrowser && !supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
}

const supabaseAdminKey = !isBrowser && supabaseServiceKey ? supabaseServiceKey : supabaseAnonKey

const supabaseAdmin = createClient(supabaseUrl, supabaseAdminKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public',
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
