-- Tabela para gerenciar colaboradores e suas permissões por banca
CREATE TABLE IF NOT EXISTS banca_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  banca_id UUID NOT NULL REFERENCES bancas(id) ON DELETE CASCADE,
  access_level VARCHAR(20) DEFAULT 'collaborator',
  permissions JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, banca_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_banca_members_user ON banca_members(user_id);
CREATE INDEX IF NOT EXISTS idx_banca_members_banca ON banca_members(banca_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_banca_members_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_banca_members_updated_at ON banca_members;
CREATE TRIGGER trigger_banca_members_updated_at
  BEFORE UPDATE ON banca_members
  FOR EACH ROW
  EXECUTE FUNCTION update_banca_members_updated_at();

-- RLS (Row Level Security)
ALTER TABLE banca_members ENABLE ROW LEVEL SECURITY;

-- Política: usuários podem ver memberships das suas próprias bancas
DROP POLICY IF EXISTS "Users can view own banca members" ON banca_members;
CREATE POLICY "Users can view own banca members" ON banca_members
  FOR SELECT USING (
    banca_id IN (
      SELECT id FROM bancas WHERE user_id = auth.uid()
    )
    OR user_id = auth.uid()
  );

-- Política: apenas donos da banca podem inserir/atualizar/deletar
DROP POLICY IF EXISTS "Owners can manage banca members" ON banca_members;
CREATE POLICY "Owners can manage banca members" ON banca_members
  FOR ALL USING (
    banca_id IN (
      SELECT id FROM bancas WHERE user_id = auth.uid()
    )
  );

-- Permitir service_role (admin) fazer tudo
DROP POLICY IF EXISTS "Service role full access" ON banca_members;
CREATE POLICY "Service role full access" ON banca_members
  FOR ALL USING (auth.role() = 'service_role');

-- Adicionar coluna email em user_profiles se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user_profiles' AND column_name = 'email') THEN
    ALTER TABLE user_profiles ADD COLUMN email TEXT;
  END IF;
END $$;

-- Adicionar coluna whatsapp em user_profiles se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user_profiles' AND column_name = 'whatsapp') THEN
    ALTER TABLE user_profiles ADD COLUMN whatsapp TEXT;
  END IF;
END $$;

-- Comentários
COMMENT ON TABLE banca_members IS 'Gerencia colaboradores e suas permissões por banca';
COMMENT ON COLUMN banca_members.access_level IS 'Nível de acesso: admin ou collaborator';
COMMENT ON COLUMN banca_members.permissions IS 'Array de permissões: dashboard, pedidos, produtos, etc';
