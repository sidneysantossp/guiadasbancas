// Script para executar a migração addressObj via API
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('🚀 Executando migração addressObj...');
    
    // Executar a migração SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Adicionar coluna addressObj à tabela bancas
        ALTER TABLE bancas 
        ADD COLUMN IF NOT EXISTS addressObj JSONB;

        -- Índice para busca no JSON se necessário
        CREATE INDEX IF NOT EXISTS idx_bancas_addressobj ON bancas USING gin (addressObj);

        -- Comentário para documentação
        COMMENT ON COLUMN bancas.addressObj IS 'Objeto JSON com campos estruturados do endereço: {cep, street, number, complement, neighborhood, city, uf}';
      `
    });

    if (error) {
      console.error('❌ Erro na migração:', error);
      return;
    }

    console.log('✅ Migração executada com sucesso!');
    console.log('📊 Resultado:', data);
    
  } catch (error) {
    console.error('❌ Erro ao executar migração:', error);
  }
}

runMigration();
