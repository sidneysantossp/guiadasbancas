-- Índices para acelerar consultas públicas de produtos
-- Execute no Supabase SQL Editor

-- Índice simples em active
CREATE INDEX IF NOT EXISTS idx_products_active
  ON public.products (active);

-- Índice composto para ordenar por recentes em endpoints públicos
CREATE INDEX IF NOT EXISTS idx_products_active_created_at
  ON public.products (active, created_at DESC);
