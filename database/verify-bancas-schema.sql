-- Script para verificar e completar schema da tabela bancas
-- Execute este script no Supabase SQL Editor

-- 1. Verificar colunas existentes na tabela bancas
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'bancas'
ORDER BY ordinal_position;

-- 2. Adicionar campos que podem estar faltando (se não existirem)
ALTER TABLE bancas 
  ADD COLUMN IF NOT EXISTS whatsapp TEXT,
  ADD COLUMN IF NOT EXISTS instagram TEXT,
  ADD COLUMN IF NOT EXISTS facebook TEXT,
  ADD COLUMN IF NOT EXISTS gmb TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS hours JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS payments TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS cta_url TEXT,
  ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- 3. Verificar novamente as colunas
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'bancas'
ORDER BY ordinal_position;

-- 4. Atualizar bancas existentes com valores padrão
UPDATE bancas 
SET 
  active = COALESCE(active, true),
  featured = COALESCE(featured, false),
  order_index = COALESCE(order_index, 0)
WHERE active IS NULL OR featured IS NULL OR order_index IS NULL;

-- 5. Garantir unicidade por usuário (um jornaleiro -> uma banca)
-- Permite múltiplos NULLs em user_id, mas impede duplicatas quando definido
CREATE UNIQUE INDEX IF NOT EXISTS unique_bancas_user_id
  ON public.bancas (user_id)
  WHERE user_id IS NOT NULL;
