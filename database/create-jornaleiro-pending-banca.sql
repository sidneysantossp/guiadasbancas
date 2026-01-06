-- Tabela para armazenar dados da banca pendente durante o cadastro do jornaleiro
-- Substitui o uso de localStorage para evitar problemas de cache

CREATE TABLE IF NOT EXISTS jornaleiro_pending_banca (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    banca_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca rápida por user_id
CREATE INDEX IF NOT EXISTS idx_jornaleiro_pending_banca_user_id ON jornaleiro_pending_banca(user_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_jornaleiro_pending_banca_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_jornaleiro_pending_banca_updated_at ON jornaleiro_pending_banca;
CREATE TRIGGER update_jornaleiro_pending_banca_updated_at
    BEFORE UPDATE ON jornaleiro_pending_banca
    FOR EACH ROW
    EXECUTE FUNCTION update_jornaleiro_pending_banca_updated_at();

-- RLS
ALTER TABLE jornaleiro_pending_banca ENABLE ROW LEVEL SECURITY;

-- Política: usuário só pode ver/editar seus próprios dados
DROP POLICY IF EXISTS "Users can manage own pending banca" ON jornaleiro_pending_banca;
CREATE POLICY "Users can manage own pending banca"
ON jornaleiro_pending_banca FOR ALL
USING (auth.uid() = user_id);

-- Service role pode gerenciar tudo
DROP POLICY IF EXISTS "Service role can manage all pending bancas" ON jornaleiro_pending_banca;
CREATE POLICY "Service role can manage all pending bancas"
ON jornaleiro_pending_banca FOR ALL
USING (auth.role() = 'service_role');

COMMENT ON TABLE jornaleiro_pending_banca IS 'Armazena dados da banca durante o processo de cadastro do jornaleiro, substituindo localStorage';
