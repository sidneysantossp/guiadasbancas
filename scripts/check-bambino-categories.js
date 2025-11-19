const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCategories() {
  try {
    const BAMBINO_ID = '3a989c56-bbd3-4769-b076-a83483e39542';
    
    console.log('🔍 Buscando produtos da Bambino...\n');

    // Buscar produtos da Bambino
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, category_id, active')
      .eq('distribuidor_id', BAMBINO_ID)
      .eq('active', true)
      .limit(50);

    if (error) {
      console.error('❌ Erro:', error.message);
      return;
    }

    if (!products || products.length === 0) {
      console.log('⚠️  Nenhum produto encontrado da Bambino');
      return;
    }

    console.log(`✅ Total de produtos: ${products.length}\n`);

    // Agrupar por categoria
    const categorias = {};
    products.forEach(p => {
      const catId = p.category_id || 'SEM_CATEGORIA_ID';
      
      const key = catId;
      if (!categorias[key]) {
        categorias[key] = [];
      }
      categorias[key].push(p.name);
    });

    console.log('📊 CATEGORIAS ENCONTRADAS:\n');
    Object.keys(categorias).sort().forEach(key => {
      const produtos = categorias[key];
      console.log(`\n🏷️  ${key}`);
      console.log(`   Produtos: ${produtos.length}`);
      console.log(`   Exemplos: ${produtos.slice(0, 3).join(', ')}`);
    });

    // Buscar especificamente por "Bebidas"
    console.log('\n\n🔍 PROCURANDO POR "BEBIDAS" (cat-1758882632653):\n');
    const bebidas = products.filter(p => {
      const catId = (p.category_id || '');
      return catId === 'cat-1758882632653';
    });

    if (bebidas.length > 0) {
      console.log(`✅ Encontradas ${bebidas.length} bebidas!`);
      bebidas.slice(0, 10).forEach(b => {
        console.log(`   - ${b.name} (${b.category_id})`);
      });
    } else {
      console.log('❌ Nenhuma bebida com category_id = cat-1758882632653');
      console.log('\n💡 SUGESTÃO: Use outra categoria que existe no banco');
      console.log('   Verifique as categorias acima para escolher a correta');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

checkCategories();
