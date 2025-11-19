const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function findBebidasProducts() {
  try {
    console.log('🔍 Buscando categoria "Bebidas" no banco...\n');

    // 1. Buscar categoria Bebidas
    const { data: bebidasCat } = await supabase
      .from('categories')
      .select('id, name')
      .ilike('name', '%bebida%');
    
    if (!bebidasCat || bebidasCat.length === 0) {
      console.log('❌ Nenhuma categoria "Bebidas" encontrada');
      return;
    }

    console.log('✅ Categorias encontradas:');
    bebidasCat.forEach(cat => {
      console.log(`   - ${cat.name} (ID: ${cat.id})`);
    });

    // 2. Para cada categoria, buscar produtos
    for (const cat of bebidasCat) {
      console.log(`\n\n🔍 Buscando produtos com categoria "${cat.name}" (${cat.id})...\n`);
      
      const { data: products } = await supabase
        .from('products')
        .select('id, name, banca_id, distribuidor_id, category_id, active')
        .eq('category_id', cat.id)
        .eq('active', true)
        .limit(20);
      
      if (!products || products.length === 0) {
        console.log('   ❌ Nenhum produto encontrado com esta categoria');
        continue;
      }

      console.log(`   ✅ Encontrados ${products.length} produtos!`);
      console.log('\n   📦 EXEMPLOS:');
      products.slice(0, 10).forEach((p, i) => {
        console.log(`      ${i + 1}. ${p.name}`);
        console.log(`         Banca: ${p.banca_id || 'N/A'}`);
        console.log(`         Distribuidor: ${p.distribuidor_id || 'N/A'}`);
      });

      // Verificar se tem produtos da Bambino
      const bambinoProd = products.filter(p => p.distribuidor_id === '3a989c56-bbd3-4769-b076-a83483e39542');
      if (bambinoProd.length > 0) {
        console.log(`\n   🎯 BAMBINO: ${bambinoProd.length} produtos encontrados!`);
      }
    }

    // 3. Mostrar resumo
    console.log('\n\n📊 RESUMO:');
    console.log(`   Categorias "Bebidas" encontradas: ${bebidasCat.length}`);
    console.log(`   IDs: ${bebidasCat.map(c => c.id).join(', ')}`);

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

findBebidasProducts();
