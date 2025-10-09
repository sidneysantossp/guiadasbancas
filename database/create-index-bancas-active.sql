-- Índices para acelerar listagens públicas de bancas
-- Execute no Supabase SQL Editor

-- Índice simples em active
CREATE INDEX IF NOT EXISTS idx_bancas_active
  ON public.bancas (active);

-- Índice composto para consultas do tipo: WHERE active = true ORDER BY name
CREATE INDEX IF NOT EXISTS idx_bancas_active_name
  ON public.bancas (active, name);
