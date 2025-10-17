-- Script completo para adicionar coluna profile_image e forçar refresh do schema
-- Execute este script COMPLETO no Supabase SQL Editor

-- 1. Adicionar coluna profile_image se não existir
ALTER TABLE bancas 
ADD COLUMN IF NOT EXISTS profile_image TEXT;

-- 2. Adicionar comentário
COMMENT ON COLUMN bancas.profile_image IS 'URL da imagem de perfil redonda da banca (avatar)';

-- 3. Copiar cover_image para profile_image nas bancas existentes
UPDATE bancas 
SET profile_image = cover_image 
WHERE profile_image IS NULL AND cover_image IS NOT NULL;

-- 4. Verificar se a coluna foi criada
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'bancas'
  AND column_name = 'profile_image';

-- 5. Forçar refresh do schema cache do PostgREST
-- Isso é necessário para que a API reconheça a nova coluna
NOTIFY pgrst, 'reload schema';

-- 6. Verificar dados de exemplo
SELECT 
    id, 
    name, 
    cover_image, 
    profile_image,
    updated_at
FROM bancas
LIMIT 5;
