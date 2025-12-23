const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testBancaCotistaProdutos() {
  console.log('🔍 Testando produtos para bancas cotistas...\n');

  // Buscar uma banca cotista
  const { data: bancas } = await supabase
    .from('bancas')
    .select('id, name, is_cotista, cotista_id')
    .eq('is_cotista', true)
    .not('cotista_id', 'is', null)
    .limit(3);

  if (!bancas || bancas.length === 0) {
    console.log('❌ Nenhuma banca cotista encontrada');
    return;
  }

  console.log(`📊 Testando ${bancas.length} bancas cotistas:\n`);

  for (const banca of bancas) {
    console.log(`${'='.repeat(60)}`);
    console.log(`🏪 ${banca.name}`);
    console.log(`   ID: ${banca.id}`);
    console.log(`   É cotista: ✅ SIM`);

    // Contar produtos próprios
    const { count: countProprios } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('banca_id', banca.id)
      .eq('active', true);

    // Contar produtos de distribuidores
    const { count: countDistribuidores } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .not('distribuidor_id', 'is', null)
      .eq('active', true);

    console.log(`\n   📦 Produtos próprios: ${countProprios || 0}`);
    console.log(`   🏢 Produtos de distribuidores disponíveis: ${countDistribuidores || 0}`);
    console.log(`   📊 Total que deveria ver: ${(countProprios || 0) + (countDistribuidores || 0)}`);

    // Simular query da API com limite 10000
    const { data: produtos, count: totalQuery } = await supabase
      .from('products')
      .select('id, name, banca_id, distribuidor_id', { count: 'exact' })
      .eq('active', true)
      .or(`banca_id.eq.${banca.id},distribuidor_id.not.is.null`)
      .limit(10000);

    const produtosProprios = produtos?.filter(p => p.banca_id === banca.id) || [];
    const produtosDistribuidor = produtos?.filter(p => p.distribuidor_id) || [];

    console.log(`\n   ✅ Query com limit=10000:`);
    console.log(`      - Produtos próprios retornados: ${produtosProprios.length}`);
    console.log(`      - Produtos de distribuidores retornados: ${produtosDistribuidor.length}`);
    console.log(`      - Total retornado: ${produtos?.length || 0}`);
    console.log(`      - Count da query: ${totalQuery || 0}`);

    if (produtosDistribuidor.length < (countDistribuidores || 0)) {
      console.log(`\n   ⚠️  ATENÇÃO: Retornou ${produtosDistribuidor.length} de ${countDistribuidores} produtos de distribuidores`);
      console.log(`      Diferença: ${(countDistribuidores || 0) - produtosDistribuidor.length} produtos faltando`);
    } else {
      console.log(`\n   ✅ Todos os produtos de distribuidores foram retornados!`);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('\n✅ Teste concluído!');
}

testBancaCotistaProdutos().catch(console.error);
