const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function addFields() {
  console.log('🔄 Adicionando campos à tabela categories via SQL direto...\n');

  // Usar a API REST do Supabase para executar SQL
  const queries = [
    'ALTER TABLE categories ADD COLUMN IF NOT EXISTS mercos_id INTEGER',
    'ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_category_id UUID',
    'ALTER TABLE categories ADD COLUMN IF NOT EXISTS ultima_sincronizacao TIMESTAMPTZ',
    'CREATE INDEX IF NOT EXISTS idx_categories_mercos_id ON categories(mercos_id)',
    'CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_category_id)',
    'CREATE INDEX IF NOT EXISTS idx_dist_categories_mercos ON distribuidor_categories(mercos_id)'
  ];

  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    console.log(`${i + 1}. ${query.substring(0, 60)}...`);
    
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        const error = await response.text();
        console.log(`   ⚠️  ${error.substring(0, 100)}`);
      } else {
        console.log('   ✅ OK');
      }
    } catch (error) {
      console.log(`   ⚠️  ${error.message}`);
    }
  }

  // Verificar resultado
  console.log('\n📊 Verificando campos...\n');
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .limit(1);

  if (data && data[0]) {
    const fields = Object.keys(data[0]);
    console.log('Campos na tabela:', fields.join(', '));
    console.log('\nNovos campos:');
    console.log('  mercos_id:', fields.includes('mercos_id') ? '✅' : '❌');
    console.log('  parent_category_id:', fields.includes('parent_category_id') ? '✅' : '❌');
    console.log('  ultima_sincronizacao:', fields.includes('ultima_sincronizacao') ? '✅' : '❌');
  }

  console.log('\n✅ Processo concluído!');
}

addFields();
