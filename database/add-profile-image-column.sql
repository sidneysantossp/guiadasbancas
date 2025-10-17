-- Adicionar coluna profile_image na tabela bancas
-- Esta coluna armazena a imagem de perfil redonda da banca (diferente da cover_image)

ALTER TABLE bancas 
ADD COLUMN IF NOT EXISTS profile_image TEXT;

-- Comentário explicativo
COMMENT ON COLUMN bancas.profile_image IS 'URL da imagem de perfil redonda da banca (avatar)';

-- Opcional: Copiar cover_image para profile_image nas bancas existentes que não têm profile_image
UPDATE bancas 
SET profile_image = cover_image 
WHERE profile_image IS NULL AND cover_image IS NOT NULL;
