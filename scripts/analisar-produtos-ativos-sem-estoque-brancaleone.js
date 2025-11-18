const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function analisarProdutos() {
  console.log('\n🔍 ANALISANDO PRODUTOS ATIVOS - BRANCALEONE\n');
  console.log('='.repeat(80) + '\n');
  
  try {
    const { data: dist } = await supabase
      .from('distribuidores')
      .select('*')
      .ilike('nome', '%brancaleone%')
      .single();
    
    console.log(`🏢 Distribuidor: ${dist.nome}\n`);
    console.log('='.repeat(80) + '\n');
    
    // Produtos ativos com estoque > 0
    const { count: ativosComEstoque } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('active', true)
      .gt('stock_qty', 0);
    
    // Produtos ativos com estoque = 0
    const { count: ativosSemEstoque } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('active', true)
      .eq('stock_qty', 0);
    
    // Total de ativos
    const { count: totalAtivos } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('active', true);
    
    console.log('📊 PRODUTOS ATIVOS (active=true):\n');
    console.log(`   ✅ Com estoque > 0: ${(ativosComEstoque || 0).toLocaleString('pt-BR')}`);
    console.log(`   ⚠️  Com estoque = 0: ${(ativosSemEstoque || 0).toLocaleString('pt-BR')}`);
    console.log(`   📦 Total: ${(totalAtivos || 0).toLocaleString('pt-BR')}\n`);
    console.log('='.repeat(80) + '\n');
    
    // Produtos com ativo=true (campo da Mercos) com estoque > 0
    const { count: mercosAtivosComEstoque } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('ativo', true)
      .gt('stock_qty', 0);
    
    // Produtos com ativo=true (campo da Mercos) com estoque = 0
    const { count: mercosAtivosSemEstoque } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('ativo', true)
      .eq('stock_qty', 0);
    
    console.log('📊 PRODUTOS COM ativo=true (campo Mercos):\n');
    console.log(`   ✅ Com estoque > 0: ${(mercosAtivosComEstoque || 0).toLocaleString('pt-BR')}`);
    console.log(`   ⚠️  Com estoque = 0: ${(mercosAtivosSemEstoque || 0).toLocaleString('pt-BR')}`);
    console.log(`   📦 Total: ${((mercosAtivosComEstoque || 0) + (mercosAtivosSemEstoque || 0)).toLocaleString('pt-BR')}\n`);
    console.log('='.repeat(80) + '\n');
    
    // Produtos com ativo=true e excluido=false (sem importar estoque)
    const { count: mercosAtivosNaoExcluidos } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('ativo', true)
      .eq('excluido', false);
    
    console.log('📊 PRODUTOS COM ativo=true E excluido=false:\n');
    console.log(`   Total: ${(mercosAtivosNaoExcluidos || 0).toLocaleString('pt-BR')}\n`);
    console.log('='.repeat(80) + '\n');
    
    console.log('💡 ANÁLISE:\n');
    console.log(`   Esperado na interface: 3.439 produtos`);
    console.log(`   No banco (active=true): ${totalAtivos} produtos`);
    console.log(`   No banco (ativo=true, excluido=false): ${mercosAtivosNaoExcluidos} produtos`);
    console.log(`   Diferença: ${3439 - (totalAtivos || 0)} produtos\n`);
    
    if (mercosAtivosNaoExcluidos >= 3400 && mercosAtivosNaoExcluidos <= 3500) {
      console.log(`   ✅ O campo "ativo=true, excluido=false" bate!`);
      console.log(`   Mas o campo "active" está com valor diferente.\n`);
    }
    
    // Verificar produtos com ativo=true mas active=false
    const { count: descasados } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('ativo', true)
      .eq('excluido', false)
      .eq('active', false);
    
    if (descasados > 0) {
      console.log(`   ⚠️  ${descasados} produtos têm ativo=true e excluido=false MAS active=false!\n`);
      
      const { data: exemplos } = await supabase
        .from('products')
        .select('id, name, codigo_mercos, ativo, excluido, active, stock_qty')
        .eq('distribuidor_id', dist.id)
        .eq('ativo', true)
        .eq('excluido', false)
        .eq('active', false)
        .limit(10);
      
      if (exemplos && exemplos.length > 0) {
        console.log('   📋 EXEMPLOS:\n');
        exemplos.forEach((p, i) => {
          console.log(`      ${i + 1}. ${p.codigo_mercos || 'SEM CÓD'} - ${p.name?.substring(0, 45)}`);
          console.log(`         ativo: ${p.ativo} | excluido: ${p.excluido} | active: ${p.active} | estoque: ${p.stock_qty}\n`);
        });
      }
    }
    
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('💥 Erro:', error.message);
  }
}

analisarProdutos().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro fatal:', err);
  process.exit(1);
});
