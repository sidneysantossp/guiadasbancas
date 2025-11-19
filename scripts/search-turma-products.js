const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function searchTurmaProducts() {
  try {
    console.log('🔍 Buscando produtos da Turma da Mônica...\n');

    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, codigo_mercos, images, active, category_id')
      .or('name.ilike.%turma%,name.ilike.%mônica%,name.ilike.%monica%,name.ilike.%cebolinha%,name.ilike.%cascão%,name.ilike.%magali%')
      .eq('active', true)
      .limit(20);

    if (error) {
      console.error('❌ Erro:', error.message);
      return;
    }

    if (!products || products.length === 0) {
      console.log('❌ Nenhum produto encontrado');
      return;
    }

    console.log(`✅ Total de produtos encontrados: ${products.length}\n`);
    
    // Agrupar por categoria
    const byCategory = {};
    products.forEach(p => {
      if (!byCategory[p.category_id]) {
        byCategory[p.category_id] = [];
      }
      byCategory[p.category_id].push(p);
    });

    console.log('📦 PRODUTOS DA TURMA DA MÔNICA:\n');
    
    products.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      console.log(`   ID: ${p.id}`);
      console.log(`   Código: ${p.codigo_mercos || 'NULL'}`);
      console.log(`   Categoria ID: ${p.category_id}`);
      console.log(`   Imagens: ${p.images ? p.images.length : 0}`);
      console.log('');
    });

    console.log('\n📊 POR CATEGORIA:\n');
    for (const catId in byCategory) {
      console.log(`Categoria ${catId}: ${byCategory[catId].length} produtos`);
    }

    // Buscar nomes das categorias
    const catIds = Object.keys(byCategory);
    if (catIds.length > 0) {
      const { data: categories } = await supabase
        .from('categories')
        .select('id, name')
        .in('id', catIds);

      if (categories) {
        console.log('\n📂 NOMES DAS CATEGORIAS:\n');
        categories.forEach(cat => {
          console.log(`   ${cat.name} (${cat.id}): ${byCategory[cat.id].length} produtos`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

searchTurmaProducts();
