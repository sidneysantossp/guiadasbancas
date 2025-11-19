const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDistribution() {
  try {
    console.log('🔍 Verificando distribuição de produtos por banca...\n');

    // Buscar bancas ativas
    const { data: bancas, error: bancasError } = await supabase
      .from('bancas')
      .select('id, name')
      .eq('active', true);

    if (bancasError) {
      console.error('❌ Erro ao buscar bancas:', bancasError.message);
      return;
    }

    console.log(`✅ Total de bancas ativas: ${bancas?.length || 0}\n`);

    if (!bancas || bancas.length === 0) {
      console.log('❌ Nenhuma banca ativa encontrada');
      return;
    }

    // IDs das categorias importantes
    const categories = {
      'Bebidas': 'c230ed83-b08a-4b7a-8f19-7c8230f36c86',
      'Bomboniere': '6337c11f-c5ab-4f4b-ab9c-73c754d6eaae',
      'HQs e Comics': '1e813114-e1bc-442d-96e4-2704910d157d'
    };

    console.log('📊 DISTRIBUIÇÃO POR CATEGORIA:\n');

    for (const [catName, catId] of Object.entries(categories)) {
      console.log(`\n📂 ${catName}:`);
      console.log('─'.repeat(50));

      const { data: products, error: prodError } = await supabase
        .from('products')
        .select('id, name, banca_id, images')
        .eq('category_id', catId)
        .eq('active', true);

      if (prodError) {
        console.error(`   ❌ Erro: ${prodError.message}`);
        continue;
      }

      if (!products || products.length === 0) {
        console.log('   ❌ Nenhum produto encontrado');
        continue;
      }

      // Agrupar por banca
      const byBanca = {};
      let withoutBanca = 0;
      let withoutImage = 0;

      products.forEach(p => {
        if (!p.banca_id) {
          withoutBanca++;
          return;
        }
        if (!p.images || p.images.length === 0) {
          withoutImage++;
        }
        if (!byBanca[p.banca_id]) {
          byBanca[p.banca_id] = [];
        }
        byBanca[p.banca_id].push(p);
      });

      console.log(`   Total de produtos: ${products.length}`);
      console.log(`   Sem banca_id: ${withoutBanca}`);
      console.log(`   Sem imagem: ${withoutImage}`);
      console.log('');

      // Mostrar distribuição por banca
      for (const banca of bancas) {
        const bancaProducts = byBanca[banca.id] || [];
        const withImages = bancaProducts.filter(p => p.images && p.images.length > 0);
        console.log(`   ${banca.name}:`);
        console.log(`      Total: ${bancaProducts.length} produtos`);
        console.log(`      Com imagem: ${withImages.length} produtos`);
      }

      // Produtos sem banca mas com imagem
      if (withoutBanca > 0) {
        const productsWithoutBanca = products.filter(p => !p.banca_id && p.images && p.images.length > 0);
        console.log(`\n   ⚠️  Produtos SEM banca mas COM imagem: ${productsWithoutBanca.length}`);
        if (productsWithoutBanca.length > 0) {
          console.log('      Estes produtos precisam ser associados a uma banca!');
        }
      }
    }

    // Verificar Turma da Mônica especificamente
    console.log('\n\n📚 TURMA DA MÔNICA (por nome):');
    console.log('─'.repeat(50));

    const { data: turmaProducts } = await supabase
      .from('products')
      .select('id, name, banca_id, images, category_id')
      .or('name.ilike.%turma%,name.ilike.%mônica%,name.ilike.%monica%,name.ilike.%cebolinha%,name.ilike.%magali%')
      .eq('active', true);

    if (turmaProducts && turmaProducts.length > 0) {
      const byBanca = {};
      let withoutBanca = 0;

      turmaProducts.forEach(p => {
        if (!p.banca_id) {
          withoutBanca++;
          return;
        }
        if (!byBanca[p.banca_id]) {
          byBanca[p.banca_id] = [];
        }
        byBanca[p.banca_id].push(p);
      });

      console.log(`Total: ${turmaProducts.length} produtos`);
      console.log(`Sem banca_id: ${withoutBanca}\n`);

      for (const banca of bancas) {
        const bancaProducts = byBanca[banca.id] || [];
        const withImages = bancaProducts.filter(p => p.images && p.images.length > 0);
        console.log(`${banca.name}:`);
        console.log(`   Total: ${bancaProducts.length}, Com imagem: ${withImages.length}`);
      }
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

checkDistribution();
