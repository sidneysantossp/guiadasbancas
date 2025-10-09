-- Cria tabela para gerenciar vitrines/galerias de produtos curadas pelo admin
-- Execute no Supabase SQL Editor

-- Extensão necessária para UUID (geralmente já habilitada)
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.featured_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL,                 -- exemplo: 'topreviewed_ei'
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  label TEXT NULL,                           -- rótulo opcional a exibir no card
  order_index INT NOT NULL DEFAULT 0,        -- ordenação manual
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Evitar duplicidade do mesmo produto na mesma seção
CREATE UNIQUE INDEX IF NOT EXISTS uq_featured_products_section_product
  ON public.featured_products (section_key, product_id);

-- Índices úteis para consultas públicas
CREATE INDEX IF NOT EXISTS idx_featured_products_section_active_order
  ON public.featured_products (section_key, active, order_index);

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_featured_products_updated_at ON public.featured_products;
CREATE TRIGGER trg_featured_products_updated_at
BEFORE UPDATE ON public.featured_products
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
