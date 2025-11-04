-- Adicionar campos para suportar produtos de distribuidores Mercos

-- 1. Criar tabela de distribuidores se ainda não existir
CREATE TABLE IF NOT EXISTS public.distribuidores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  application_token TEXT NOT NULL,
  company_token TEXT NOT NULL,
  base_url TEXT DEFAULT 'https://app.mercos.com/api/v1',
  ativo BOOLEAN DEFAULT TRUE,
  ultima_sincronizacao TIMESTAMPTZ,
  total_produtos INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Adicionar campos à tabela products
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS distribuidor_id UUID REFERENCES public.distribuidores(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS mercos_id INTEGER,
  ADD COLUMN IF NOT EXISTS origem VARCHAR(50) DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS sincronizado_em TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT TRUE;

-- 3. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_products_distribuidor_id ON public.products(distribuidor_id);
CREATE INDEX IF NOT EXISTS idx_products_mercos_id ON public.products(mercos_id);
CREATE INDEX IF NOT EXISTS idx_products_origem ON public.products(origem);
CREATE INDEX IF NOT EXISTS idx_products_ativo ON public.products(ativo);

-- 4. Criar índice único para evitar duplicatas
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_distribuidor_mercos_id 
  ON public.products(distribuidor_id, mercos_id) 
  WHERE mercos_id IS NOT NULL;

-- 5. Modificar banca_id para permitir NULL (produtos de distribuidor não têm banca)
ALTER TABLE public.products 
  ALTER COLUMN banca_id DROP NOT NULL;

-- 6. Adicionar comentários
COMMENT ON COLUMN public.products.distribuidor_id IS 'ID do distribuidor Mercos (se o produto vier de um distribuidor)';
COMMENT ON COLUMN public.products.mercos_id IS 'ID do produto na API Mercos';
COMMENT ON COLUMN public.products.origem IS 'Origem do produto: manual, mercos, etc';
COMMENT ON COLUMN public.products.sincronizado_em IS 'Data da última sincronização com Mercos';
COMMENT ON COLUMN public.products.ativo IS 'Se o produto está ativo (visível)';

-- 7. Atualizar trigger para distribuidores
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_distribuidores_updated_at ON distribuidores;
CREATE TRIGGER update_distribuidores_updated_at 
  BEFORE UPDATE ON distribuidores 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 8. Habilitar RLS na tabela distribuidores
ALTER TABLE public.distribuidores ENABLE ROW LEVEL SECURITY;

-- 9. Criar políticas RLS para distribuidores
DROP POLICY IF EXISTS "Allow service role all access on distribuidores" ON distribuidores;
CREATE POLICY "Allow service role all access on distribuidores" 
  ON distribuidores 
  USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow public read access on distribuidores" ON distribuidores;
CREATE POLICY "Allow public read access on distribuidores" 
  ON distribuidores 
  FOR SELECT 
  USING (ativo = true);

-- 10. Atualizar produtos existentes
UPDATE public.products 
SET origem = 'manual', ativo = TRUE 
WHERE origem IS NULL;
