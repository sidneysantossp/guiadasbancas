-- Adicionar campo 'visible' na tabela categories
-- Execute este SQL no Supabase SQL Editor

ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS visible BOOLEAN DEFAULT true;

-- Atualizar todas as categorias existentes para serem visíveis por padrão
UPDATE categories 
SET visible = true 
WHERE visible IS NULL;

-- Comentário: 
-- O campo 'visible' controla se a categoria aparece no frontend
-- true = visível no site
-- false = oculta no site (mas permanece no sistema)
