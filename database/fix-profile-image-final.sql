-- Script DEFINITIVO para adicionar profile_image
-- Execute linha por linha ou todo de uma vez

-- 1. DROPAR a coluna se existir (para garantir limpeza)
ALTER TABLE bancas DROP COLUMN IF EXISTS profile_image;

-- 2. ADICIONAR a coluna novamente
ALTER TABLE bancas ADD COLUMN profile_image TEXT;

-- 3. Verificar que foi criada
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'bancas'
  AND column_name = 'profile_image';

-- 4. Copiar cover_image para profile_image
UPDATE bancas 
SET profile_image = cover_image 
WHERE cover_image IS NOT NULL;

-- 5. FORÇAR reload do schema cache
NOTIFY pgrst, 'reload schema';

-- 6. Verificar os dados com a nova coluna
SELECT 
    id, 
    name, 
    cover_image, 
    profile_image
FROM bancas
ORDER BY created_at DESC
LIMIT 5;
