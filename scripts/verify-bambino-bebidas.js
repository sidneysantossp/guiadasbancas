const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyBambinoBebidas() {
  try {
    const BAMBINO_ID = '3a989c56-bbd3-4769-b076-a83483e39542';
    const BEBIDAS_ID = 'c230ed83-b08a-4b7a-8f19-7c8230f36c86';
    
    console.log('🔍 Verificando produtos da Bambino...\n');
    console.log(`Distribuidor ID: ${BAMBINO_ID}`);
    console.log(`Categoria Bebidas ID: ${BEBIDAS_ID}\n`);

    // 1. Buscar TODOS os produtos da Bambino
    const { data: allProducts, error } = await supabase
      .from('products')
      .select('id, name, category_id, active, distribuidor_id')
      .eq('distribuidor_id', BAMBINO_ID)
      .eq('active', true)
      .limit(50);

    if (error) {
      console.error('❌ Erro ao buscar produtos:', error.message);
      return;
    }

    if (!allProducts || allProducts.length === 0) {
      console.log('❌ NENHUM produto ativo da Bambino encontrado!');
      return;
    }

    console.log(`✅ Total de produtos ATIVOS da Bambino: ${allProducts.length}\n`);

    // 2. Verificar quantos têm category_id
    const comCategoria = allProducts.filter(p => p.category_id);
    const semCategoria = allProducts.filter(p => !p.category_id);

    console.log(`📊 COM category_id: ${comCategoria.length}`);
    console.log(`📊 SEM category_id: ${semCategoria.length}\n`);

    // 3. Agrupar por categoria
    const categorias = {};
    allProducts.forEach(p => {
      const catId = p.category_id || 'NULL';
      if (!categorias[catId]) {
        categorias[catId] = [];
      }
      categorias[catId].push(p.name);
    });

    console.log('🏷️  CATEGORIAS ENCONTRADAS:\n');
    for (const [catId, produtos] of Object.entries(categorias)) {
      console.log(`   ${catId}: ${produtos.length} produtos`);
      console.log(`      Exemplos: ${produtos.slice(0, 3).join(', ')}`);
    }

    // 4. Verificar especificamente a categoria Bebidas
    const bebidas = allProducts.filter(p => p.category_id === BEBIDAS_ID);
    
    console.log(`\n\n🍹 FILTRO POR BEBIDAS (${BEBIDAS_ID}):\n`);
    if (bebidas.length > 0) {
      console.log(`✅ ${bebidas.length} produtos encontrados!`);
      bebidas.forEach((b, i) => {
        console.log(`   ${i + 1}. ${b.name} (${b.category_id})`);
      });
    } else {
      console.log(`❌ NENHUM produto com category_id = ${BEBIDAS_ID}`);
      console.log('\n⚠️  PROBLEMA: Os produtos não têm a categoria correta!');
      console.log('   Solução: Atualizar os produtos no banco com o category_id correto');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

verifyBambinoBebidas();
