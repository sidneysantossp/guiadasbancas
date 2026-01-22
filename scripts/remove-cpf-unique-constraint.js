const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function removeUniqueConstraint() {
  console.log('🔧 Removendo constraint de unicidade do CPF/CNPJ...');
  console.log('');
  
  try {
    // Executar SQL para remover a constraint
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Remover a constraint de unicidade do CPF/CNPJ
        ALTER TABLE cotistas DROP CONSTRAINT IF EXISTS cotista_cnpj_cpf_key;
        
        -- Adicionar índice para performance (sem unicidade)
        CREATE INDEX IF NOT EXISTS idx_cotistas_cnpj_cpf ON cotistas(cnpj_cpf);
      `
    });
    
    if (error) {
      console.error('❌ Erro ao executar SQL:', error.message);
      console.log('');
      console.log('⚠️  A função exec_sql não existe. Vou tentar método alternativo...');
      console.log('');
      
      // Método alternativo: usar a API diretamente
      console.log('📝 Execute este SQL manualmente no Supabase Dashboard:');
      console.log('');
      console.log('ALTER TABLE cotistas DROP CONSTRAINT IF EXISTS cotista_cnpj_cpf_key;');
      console.log('CREATE INDEX IF NOT EXISTS idx_cotistas_cnpj_cpf ON cotistas(cnpj_cpf);');
      console.log('');
      console.log('🔗 Acesse: https://supabase.com/dashboard/project/[seu-projeto]/editor');
      
      return;
    }
    
    console.log('✅ Constraint removida com sucesso!');
    console.log('');
    console.log('Agora você pode cadastrar múltiplas cotas com o mesmo CPF.');
    
  } catch (err) {
    console.error('❌ Erro:', err.message);
  }
}

removeUniqueConstraint();
