-- Adiciona nível de acesso do jornaleiro (admin/colaborador) e tabela de vínculos usuário <-> banca

-- 1) Campo de nível de acesso no profile
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS jornaleiro_access_level TEXT DEFAULT 'admin';

UPDATE public.user_profiles
SET jornaleiro_access_level = 'admin'
WHERE jornaleiro_access_level IS NULL;

-- 2) Tabela de membros/colaboradores por banca
CREATE TABLE IF NOT EXISTS public.banca_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  banca_id UUID NOT NULL REFERENCES public.bancas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  access_level TEXT NOT NULL DEFAULT 'collaborator',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (banca_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_banca_members_user_id ON public.banca_members(user_id);
CREATE INDEX IF NOT EXISTS idx_banca_members_banca_id ON public.banca_members(banca_id);

-- Trigger de updated_at (reaproveita função existente)
DROP TRIGGER IF EXISTS update_banca_members_updated_at ON public.banca_members;
CREATE TRIGGER update_banca_members_updated_at
  BEFORE UPDATE ON public.banca_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 3) RLS (somente service_role por padrão; leitura do próprio usuário opcional)
ALTER TABLE public.banca_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow service role all access on banca_members" ON public.banca_members;
CREATE POLICY "Allow service role all access on banca_members"
  ON public.banca_members
  USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow user read own banca_members" ON public.banca_members;
CREATE POLICY "Allow user read own banca_members"
  ON public.banca_members
  FOR SELECT
  USING (auth.uid() = user_id);
