-- Script para corrigir tabela branding no Supabase
-- Execute no SQL Editor do Supabase

-- 1. Verificar se a tabela existe
SELECT table_name FROM information_schema.tables WHERE table_name = 'branding';

-- 2. Verificar dados existentes
SELECT * FROM branding;

-- 3. Inserir/atualizar registro padrão com ID fixo
INSERT INTO branding (
    id,
    logo_url, 
    logo_alt, 
    site_name, 
    primary_color, 
    secondary_color, 
    favicon,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    NULL,
    'Guia das Bancas',
    'Guia das Bancas',
    '#ff5c00',
    '#ff7a33',
    '/favicon.svg',
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    updated_at = NOW();

-- 4. Verificar políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'branding';

-- 5. Adicionar política mais permissiva para service_role (se necessário)
DROP POLICY IF EXISTS "Allow service role all access on branding" ON branding;
CREATE POLICY "Allow service role all access on branding" 
ON branding 
FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 6. Verificar se funcionou
SELECT * FROM branding;
