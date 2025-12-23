const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAllBancasAPI() {
  console.log('🔍 Testando API pública de produtos para todas as bancas...\n');

  // Buscar todas as bancas
  const { data: bancas, error: bancasError } = await supabase
    .from('bancas')
    .select('id, name, is_cotista, cotista_id')
    .limit(10);

  if (bancasError) {
    console.error('❌ Erro ao buscar bancas:', bancasError);
    return;
  }

  console.log(`📊 Total de bancas: ${bancas.length}\n`);

  for (const banca of bancas) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🏪 ${banca.name}`);
    console.log(`   ID: ${banca.id}`);
    console.log(`   É cotista: ${banca.is_cotista ? 'SIM ✅' : 'NÃO ❌'}`);

    const isCotista = banca.is_cotista === true && !!banca.cotista_id;

    // Simular a query da API pública
    let query = supabase
      .from('products')
      .select('id, name, price, banca_id, distribuidor_id')
      .eq('active', true);

    if (isCotista) {
      query = query.or(`banca_id.eq.${banca.id},distribuidor_id.not.is.null`);
    } else {
      query = query.eq('banca_id', banca.id);
    }

    const { data: produtos } = await query.limit(10);

    const produtosProprios = produtos?.filter(p => p.banca_id === banca.id) || [];
    const produtosDistribuidor = produtos?.filter(p => p.distribuidor_id) || [];

    console.log(`\n   📦 Produtos próprios: ${produtosProprios.length}`);
    console.log(`   🏢 Produtos de distribuidores: ${produtosDistribuidor.length}`);

    // Verificar bug
    if (!isCotista && produtosDistribuidor.length > 0) {
      console.log(`\n   🚨 BUG CRÍTICO: Banca NÃO-COTISTA vendo ${produtosDistribuidor.length} produtos de distribuidores!`);
      produtosDistribuidor.slice(0, 3).forEach(p => {
        console.log(`      - ${p.name} (distribuidor: ${p.distribuidor_id})`);
      });
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('\n✅ Teste concluído!');
}

testAllBancasAPI().catch(console.error);
