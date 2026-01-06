-- Adiciona coluna de permissões na tabela banca_members
-- Permite definir permissões específicas para cada colaborador em cada banca

ALTER TABLE public.banca_members
ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '[]'::jsonb;

-- Comentário explicativo
COMMENT ON COLUMN public.banca_members.permissions IS 'Array de permissões do colaborador. Ex: ["dashboard", "pedidos", "produtos"]';

-- Índice para busca por permissões (opcional, para queries futuras)
CREATE INDEX IF NOT EXISTS idx_banca_members_permissions ON public.banca_members USING GIN (permissions);
