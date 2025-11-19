const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function findTurmaDaMonica() {
  try {
    console.log('🔍 Buscando categoria Turma da Mônica...\n');

    // Buscar categoria
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name')
      .ilike('name', '%turma%monica%');

    if (catError) {
      console.error('❌ Erro ao buscar categoria:', catError.message);
    }

    if (categories && categories.length > 0) {
      console.log('✅ Categorias encontradas:\n');
      categories.forEach(cat => {
        console.log(`   ${cat.name}: ${cat.id}`);
      });

      // Buscar produtos dessa categoria
      const categoryId = categories[0].id;
      const { data: products, error: prodError } = await supabase
        .from('products')
        .select('id, name, codigo_mercos, images, active')
        .eq('category_id', categoryId)
        .eq('active', true)
        .limit(10);

      if (prodError) {
        console.error('❌ Erro ao buscar produtos:', prodError.message);
      } else if (products && products.length > 0) {
        console.log(`\n📦 Total de produtos ativos: ${products.length}\n`);
        products.forEach((p, i) => {
          console.log(`${i + 1}. ${p.name}`);
          console.log(`   Código: ${p.codigo_mercos || 'NULL'}`);
          console.log(`   Imagens: ${p.images ? p.images.length : 0}`);
        });
      } else {
        console.log('\n❌ Nenhum produto ativo encontrado');
      }
    } else {
      console.log('❌ Categoria não encontrada. Buscando todas as categorias...\n');
      
      const { data: allCats } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

      if (allCats) {
        console.log('📂 Categorias disponíveis:\n');
        allCats.forEach(cat => {
          console.log(`   - ${cat.name} (${cat.id})`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

findTurmaDaMonica();
