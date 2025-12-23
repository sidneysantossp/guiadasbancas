const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testBancaPublicAPI() {
  console.log('🔍 Testando API pública de produtos da banca...\n');

  // Buscar banca Sidney Santos
  const { data: banca } = await supabase
    .from('bancas')
    .select('id, name, is_cotista, cotista_id')
    .ilike('name', '%sidney%')
    .single();

  if (!banca) {
    console.log('❌ Banca não encontrada');
    return;
  }

  console.log(`✅ Banca: ${banca.name}`);
  console.log(`   ID: ${banca.id}`);
  console.log(`   É cotista: ${banca.is_cotista ? 'SIM ✅' : 'NÃO ❌'}\n`);

  // Simular a query da API pública (linha 50-61 do route.ts)
  const isCotista = banca.is_cotista === true && !!banca.cotista_id;
  
  console.log('📊 Simulando query da API pública...\n');

  let query = supabase
    .from('products')
    .select('id, name, price, banca_id, distribuidor_id')
    .eq('active', true);

  if (isCotista) {
    console.log('🔹 Cotista: buscando produtos próprios + distribuidores');
    query = query.or(`banca_id.eq.${banca.id},distribuidor_id.not.is.null`);
  } else {
    console.log('🔹 Não-cotista: buscando APENAS produtos próprios');
    query = query.eq('banca_id', banca.id);
  }

  const { data: produtos, error } = await query.limit(10);

  if (error) {
    console.error('❌ Erro:', error);
    return;
  }

  console.log(`\n📦 Produtos retornados: ${produtos?.length || 0}\n`);

  if (produtos && produtos.length > 0) {
    produtos.forEach(p => {
      const tipo = p.distribuidor_id ? '🏢 DISTRIBUIDOR' : '🏪 PRÓPRIO';
      console.log(`${tipo} - ${p.name}: R$ ${p.price}`);
      if (p.distribuidor_id) {
        console.log(`   ⚠️  Distribuidor ID: ${p.distribuidor_id}`);
      }
    });
  }

  // Verificar se há produtos de distribuidores sendo retornados incorretamente
  const produtosDistribuidor = produtos?.filter(p => p.distribuidor_id) || [];
  
  if (!isCotista && produtosDistribuidor.length > 0) {
    console.log(`\n🚨 BUG CRÍTICO DETECTADO!`);
    console.log(`   Banca NÃO é cotista mas está vendo ${produtosDistribuidor.length} produtos de distribuidores!`);
  } else if (!isCotista && produtosDistribuidor.length === 0) {
    console.log(`\n✅ API funcionando corretamente: não-cotista não vê produtos de distribuidores`);
  }

  console.log('\n✅ Teste concluído!');
}

testBancaPublicAPI().catch(console.error);
