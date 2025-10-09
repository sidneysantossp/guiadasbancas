-- Adiciona campos de redes sociais à tabela branding
-- Execute este script no Supabase SQL Editor

ALTER TABLE branding
  ADD COLUMN IF NOT EXISTS social_instagram TEXT,
  ADD COLUMN IF NOT EXISTS social_facebook TEXT,
  ADD COLUMN IF NOT EXISTS social_youtube TEXT,
  ADD COLUMN IF NOT EXISTS social_linkedin TEXT;

-- Mantém valores em branco como NULL para facilitar validações
UPDATE branding
SET
  social_instagram = NULLIF(social_instagram, ''),
  social_facebook = NULLIF(social_facebook, ''),
  social_youtube = NULLIF(social_youtube, ''),
  social_linkedin = NULLIF(social_linkedin, '');
