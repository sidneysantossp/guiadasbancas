const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  try {
    console.log('🔄 Aplicando migration: add_mercos_fields_to_categories...\n');

    const migrationPath = path.join(__dirname, '../supabase/migrations/20260225_add_mercos_fields_to_categories.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Dividir em comandos individuais
    const commands = sql
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--') && !cmd.startsWith('COMMENT'));

    for (const command of commands) {
      console.log(`Executando: ${command.substring(0, 80)}...`);
      const { error } = await supabase.rpc('exec_sql', { sql_query: command });
      
      if (error) {
        // Ignorar erros de "já existe"
        if (error.message.includes('already exists') || error.message.includes('já existe')) {
          console.log('⚠️  Já existe, pulando...');
          continue;
        }
        throw error;
      }
      console.log('✅ OK\n');
    }

    // Verificar se os campos foram criados
    console.log('\n📊 Verificando estrutura da tabela categories...\n');
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Erro ao verificar tabela:', error.message);
    } else {
      const firstRow = data?.[0] || {};
      const hasFields = {
        mercos_id: 'mercos_id' in firstRow,
        parent_category_id: 'parent_category_id' in firstRow,
        ultima_sincronizacao: 'ultima_sincronizacao' in firstRow
      };

      console.log('Campos adicionados:');
      console.log('  mercos_id:', hasFields.mercos_id ? '✅' : '❌');
      console.log('  parent_category_id:', hasFields.parent_category_id ? '✅' : '❌');
      console.log('  ultima_sincronizacao:', hasFields.ultima_sincronizacao ? '✅' : '❌');
    }

    console.log('\n✅ Migration aplicada com sucesso!');

  } catch (error) {
    console.error('\n❌ Erro ao aplicar migration:', error.message);
    process.exit(1);
  }
}

applyMigration();
