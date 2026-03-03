const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function applyMigration() {
  try {
    console.log('🔄 Aplicando migration: add_mercos_fields_to_categories...\n');

    // Adicionar campo mercos_id
    console.log('1. Adicionando campo mercos_id...');
    const { error: e1 } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE categories ADD COLUMN IF NOT EXISTS mercos_id INTEGER'
    });
    if (e1 && !e1.message.includes('already exists')) {
      console.error('Erro:', e1.message);
    } else {
      console.log('✅ mercos_id adicionado\n');
    }

    // Adicionar campo parent_category_id
    console.log('2. Adicionando campo parent_category_id...');
    const { error: e2 } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_category_id UUID REFERENCES categories(id)'
    });
    if (e2 && !e2.message.includes('already exists')) {
      console.error('Erro:', e2.message);
    } else {
      console.log('✅ parent_category_id adicionado\n');
    }

    // Adicionar campo ultima_sincronizacao
    console.log('3. Adicionando campo ultima_sincronizacao...');
    const { error: e3 } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE categories ADD COLUMN IF NOT EXISTS ultima_sincronizacao TIMESTAMP WITH TIME ZONE'
    });
    if (e3 && !e3.message.includes('already exists')) {
      console.error('Erro:', e3.message);
    } else {
      console.log('✅ ultima_sincronizacao adicionado\n');
    }

    // Criar índices
    console.log('4. Criando índices...');
    
    const indices = [
      'CREATE INDEX IF NOT EXISTS idx_categories_mercos_id ON categories(mercos_id)',
      'CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_category_id)',
      'CREATE INDEX IF NOT EXISTS idx_dist_categories_mercos ON distribuidor_categories(mercos_id)'
    ];

    for (const idx of indices) {
      const { error } = await supabase.rpc('exec_sql', { sql: idx });
      if (error && !error.message.includes('already exists')) {
        console.error('Erro ao criar índice:', error.message);
      }
    }
    console.log('✅ Índices criados\n');

    // Verificar estrutura final
    console.log('📊 Verificando estrutura da tabela categories...\n');
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Erro ao verificar tabela:', error.message);
    } else {
      const sample = data?.[0] || {};
      console.log('Campos disponíveis:', Object.keys(sample).join(', '));
      
      const hasFields = {
        mercos_id: 'mercos_id' in sample,
        parent_category_id: 'parent_category_id' in sample,
        ultima_sincronizacao: 'ultima_sincronizacao' in sample
      };

      console.log('\nNovos campos:');
      console.log('  mercos_id:', hasFields.mercos_id ? '✅' : '❌');
      console.log('  parent_category_id:', hasFields.parent_category_id ? '✅' : '❌');
      console.log('  ultima_sincronizacao:', hasFields.ultima_sincronizacao ? '✅' : '❌');
    }

    console.log('\n✅ Migration concluída!');

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    process.exit(1);
  }
}

applyMigration();
