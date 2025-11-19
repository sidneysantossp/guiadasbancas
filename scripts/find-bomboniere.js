const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function findBomboniere() {
  try {
    console.log('🔍 Buscando categoria "Bomboniere"...\n');

    // Buscar categoria com nome similar
    const { data: categories, error } = await supabase
      .from('categories')
      .select('id, name')
      .or('name.ilike.%bomboniere%,name.ilike.%doces%,name.ilike.%chocolates%');

    if (error) {
      console.error('❌ Erro:', error.message);
      return;
    }

    if (!categories || categories.length === 0) {
      console.log('❌ Nenhuma categoria encontrada');
      return;
    }

    console.log('✅ Categorias encontradas:');
    categories.forEach(cat => {
      console.log(`   - ${cat.name} (ID: ${cat.id})`);
    });

    // Para cada categoria, buscar produtos
    for (const cat of categories) {
      console.log(`\n🔍 Buscando produtos de "${cat.name}"...`);
      
      const { data: products } = await supabase
        .from('products')
        .select('id, name, active, distribuidor_id')
        .eq('category_id', cat.id)
        .eq('active', true)
        .limit(20);
      
      if (products && products.length > 0) {
        console.log(`   ✅ ${products.length} produtos ativos encontrados!`);
        console.log('   Exemplos:');
        products.slice(0, 5).forEach((p, i) => {
          console.log(`      ${i + 1}. ${p.name}`);
        });
      } else {
        console.log('   ❌ Nenhum produto ativo');
      }
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

findBomboniere();
