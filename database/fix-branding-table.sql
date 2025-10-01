-- Script para corrigir tabela branding no Supabase
-- Execute no SQL Editor do Supabase

-- 1. Verificar se a tabela branding tem RLS desabilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'branding';

-- 2. Desabilitar RLS na tabela branding (se necessário)
ALTER TABLE branding DISABLE ROW LEVEL SECURITY;

-- 3. Verificar dados existentes
SELECT * FROM branding;

-- 4. Limpar dados existentes (se houver)
DELETE FROM branding;

-- 5. Inserir registro inicial com ID fixo
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

-- 6. Verificar se o registro foi inserido
SELECT * FROM branding;

-- 7. Testar update manual
UPDATE branding 
SET logo_url = 'data:image/png;base64,test123', 
    updated_at = NOW() 
WHERE id = '00000000-0000-0000-0000-000000000001';

-- 8. Verificar se o update funcionou
SELECT * FROM branding;
