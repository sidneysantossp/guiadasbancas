const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BRANCALEONE_ID = '1511df09-1f4a-4e68-9f8c-05cd06be6269';

async function verificarCount() {
  console.log('\n🔍 VERIFICANDO CONTAGEM REAL DE PRODUTOS - BRANCALEONE\n');
  console.log('='.repeat(60));
  
  // 1. Count TOTAL (ativos + inativos)
  const { count: totalProdutos, error: totalError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('distribuidor_id', BRANCALEONE_ID);
  
  if (totalError) {
    console.error('❌ Erro ao contar total:', totalError);
    return;
  }
  
  // 2. Count apenas ATIVOS
  const { count: produtosAtivos, error: ativosError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('distribuidor_id', BRANCALEONE_ID)
    .eq('active', true);
  
  if (ativosError) {
    console.error('❌ Erro ao contar ativos:', ativosError);
    return;
  }
  
  // 3. Count apenas INATIVOS
  const { count: produtosInativos, error: inativosError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('distribuidor_id', BRANCALEONE_ID)
    .eq('active', false);
  
  if (inativosError) {
    console.error('❌ Erro ao contar inativos:', inativosError);
    return;
  }
  
  // 4. Buscar campo total_produtos da tabela distribuidores
  const { data: dist, error: distError } = await supabase
    .from('distribuidores')
    .select('total_produtos, ultima_sincronizacao, nome')
    .eq('id', BRANCALEONE_ID)
    .single();
  
  if (distError) {
    console.error('❌ Erro ao buscar distribuidor:', distError);
    return;
  }
  
  console.log('\n📊 RESULTADO DA VERIFICAÇÃO:\n');
  console.log(`Distribuidor: ${dist.nome}`);
  console.log(`ID: ${BRANCALEONE_ID}\n`);
  
  console.log('📦 CONTAGEM REAL NO BANCO:');
  console.log(`   Total de produtos: ${totalProdutos}`);
  console.log(`   ├─ Ativos: ${produtosAtivos}`);
  console.log(`   └─ Inativos: ${produtosInativos}\n`);
  
  console.log('💾 CAMPO NA TABELA DISTRIBUIDORES:');
  console.log(`   total_produtos: ${dist.total_produtos}`);
  console.log(`   Última sincronização: ${dist.ultima_sincronizacao || 'Nunca'}\n`);
  
  console.log('✅ VERIFICAÇÃO:');
  if (totalProdutos === dist.total_produtos) {
    console.log(`   ✅ NÚMEROS BATEM! (${totalProdutos} = ${dist.total_produtos})`);
  } else {
    console.log(`   ❌ NÚMEROS NÃO BATEM!`);
    console.log(`      - Banco: ${totalProdutos}`);
    console.log(`      - Campo: ${dist.total_produtos}`);
    console.log(`      - Diferença: ${Math.abs(totalProdutos - dist.total_produtos)} produtos`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n💡 NOTA:');
  console.log('   Após o fix, as APIs agora retornam o count REAL do banco,');
  console.log('   mesmo que o campo total_produtos esteja desatualizado.');
  console.log('   Execute uma sincronização para atualizar o campo.\n');
}

verificarCount().catch(console.error);
