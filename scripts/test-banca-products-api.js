const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBancaProductsAPI() {
  try {
    console.log('🧪 Testando API de produtos por banca...\n');

    // Buscar uma banca ativa
    const { data: bancas, error: bancasError } = await supabase
      .from('bancas')
      .select('id, name')
      .eq('active', true)
      .limit(1)
      .single();

    if (bancasError || !bancas) {
      console.error('❌ Erro ao buscar banca:', bancasError?.message);
      return;
    }

    console.log(`📍 Testando com banca: ${bancas.name}`);
    console.log(`   ID: ${bancas.id}\n`);

    // Simular a chamada da API
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('banca_id', bancas.id)
      .eq('active', true)
      .limit(12);

    if (error) {
      console.error('❌ Erro ao buscar produtos:', error.message);
      return;
    }

    console.log(`✅ Total de produtos encontrados: ${products?.length || 0}\n`);

    if (products && products.length > 0) {
      console.log('📦 PRIMEIROS 5 PRODUTOS:\n');
      products.slice(0, 5).forEach((p, i) => {
        console.log(`${i + 1}. ${p.name}`);
        console.log(`   ID: ${p.id}`);
        console.log(`   Preço: R$ ${p.price}`);
        console.log(`   Imagens: ${p.images ? p.images.length : 0}`);
        console.log('');
      });

      // Contar produtos com imagem
      const withImages = products.filter(p => p.images && p.images.length > 0).length;
      console.log(`📊 ESTATÍSTICAS:`);
      console.log(`   Total: ${products.length} produtos`);
      console.log(`   Com imagem: ${withImages} produtos`);
      console.log(`   Sem imagem: ${products.length - withImages} produtos\n`);
    } else {
      console.log('⚠️  Nenhum produto encontrado para esta banca\n');
    }

    console.log('='.repeat(60));
    console.log('\n✅ A API deve retornar estes produtos na página do produto!');
    console.log('\nFORMATO DA RESPOSTA:');
    console.log('{ success: true, items: [...] }\n');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testBancaProductsAPI();
