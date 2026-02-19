-- Tabela para persistir registros retornados durante a homologação Mercos
-- Independente de distribuidor — salva tudo que a API retornar no GET
CREATE TABLE IF NOT EXISTS mercos_homologacao_registros (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_token   text NOT NULL,
  mercos_id       integer NOT NULL,
  nome            text NOT NULL,
  categoria_pai_id integer,
  ultima_alteracao text,
  excluido        boolean DEFAULT false,
  alterado_apos   text,
  criado_em       timestamptz DEFAULT now()
);

-- Índice único: um registro por (company_token, mercos_id)
-- ON CONFLICT fará upsert sem duplicar
CREATE UNIQUE INDEX IF NOT EXISTS mercos_homologacao_registros_token_mercos_id
  ON mercos_homologacao_registros (company_token, mercos_id);

-- Índice para busca por token + data
CREATE INDEX IF NOT EXISTS mercos_homologacao_registros_token_criado
  ON mercos_homologacao_registros (company_token, criado_em DESC);

-- RLS
ALTER TABLE mercos_homologacao_registros ENABLE ROW LEVEL SECURITY;

-- Service role tem acesso total
CREATE POLICY "service_role full access"
  ON mercos_homologacao_registros
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
