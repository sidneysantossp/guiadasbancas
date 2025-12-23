const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testPaginacao() {
  console.log('🔍 Testando paginação em lotes...\n');

  const bancaId = '8b21cced-3953-4d56-b12d-ee3002294168'; // Estação Leitura (cotista)

  // Simular a lógica da API
  const BATCH_SIZE = 1000;
  const requestedLimit = 10000;
  let produtos = [];
  let totalCount = 0;
  let hasMore = true;
  let currentOffset = 0;

  console.log(`📊 Buscando produtos com paginação (limit=${requestedLimit}, batch=${BATCH_SIZE})...\n`);

  let batchNumber = 1;
  while (hasMore && produtos.length < requestedLimit) {
    const batchLimit = Math.min(BATCH_SIZE, requestedLimit - produtos.length);
    
    console.log(`   Lote ${batchNumber}: offset=${currentOffset}, limit=${batchLimit}`);
    
    const { data: batch, count, error } = await supabase
      .from('products')
      .select('id, name, banca_id, distribuidor_id', { count: 'exact' })
      .eq('active', true)
      .or(`banca_id.eq.${bancaId},distribuidor_id.not.is.null`)
      .order('name', { ascending: true })
      .range(currentOffset, currentOffset + batchLimit - 1);

    if (error) {
      console.error('❌ Erro:', error);
      break;
    }

    if (count && totalCount === 0) totalCount = count;

    if (batch && batch.length > 0) {
      produtos.push(...batch);
      console.log(`      → Retornou ${batch.length} produtos (total acumulado: ${produtos.length})`);
      currentOffset += batch.length;
      hasMore = batch.length === batchLimit;
    } else {
      console.log(`      → Nenhum produto retornado, finalizando`);
      hasMore = false;
    }

    batchNumber++;

    // Segurança: máximo 10 lotes
    if (batchNumber > 10) {
      console.log(`\n⚠️  Limite de segurança atingido (10 lotes)`);
      break;
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 Resultado final:`);
  console.log(`   Total no banco (count): ${totalCount}`);
  console.log(`   Total retornado: ${produtos.length}`);
  
  const produtosProprios = produtos.filter(p => p.banca_id === bancaId);
  const produtosDistribuidor = produtos.filter(p => p.distribuidor_id);
  
  console.log(`   - Produtos próprios: ${produtosProprios.length}`);
  console.log(`   - Produtos de distribuidores: ${produtosDistribuidor.length}`);

  if (produtos.length < totalCount) {
    console.log(`\n❌ PROBLEMA: Faltam ${totalCount - produtos.length} produtos`);
  } else {
    console.log(`\n✅ Todos os produtos foram retornados!`);
  }
}

testPaginacao().catch(console.error);
