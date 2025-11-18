const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verificarProdutos() {
  console.log('\n🔍 VERIFICANDO PRODUTOS COM ESTOQUE - BRANCALEONE\n');
  console.log('='.repeat(80) + '\n');
  
  try {
    const { data: dist } = await supabase
      .from('distribuidores')
      .select('*')
      .ilike('nome', '%brancaleone%')
      .single();
    
    console.log(`🏢 Distribuidor: ${dist.nome}\n`);
    console.log('='.repeat(80) + '\n');
    
    // Produtos com estoque > 0 (independente do status active)
    const { count: comEstoque } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .gt('stock_qty', 0);
    
    // Produtos com estoque > 0 e active = true
    const { count: ativosComEstoque } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('active', true)
      .gt('stock_qty', 0);
    
    // Produtos com estoque > 0 mas active = false
    const { count: inativosComEstoque } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('active', false)
      .gt('stock_qty', 0);
    
    // Total de produtos ativos
    const { count: totalAtivos } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('active', true);
    
    // Total de produtos inativos
    const { count: totalInativos } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('active', false);
    
    console.log('📊 ANÁLISE DE PRODUTOS:\n');
    console.log(`   Total de produtos ativos (active=true): ${(totalAtivos || 0).toLocaleString('pt-BR')}`);
    console.log(`   Total de produtos inativos (active=false): ${(totalInativos || 0).toLocaleString('pt-BR')}\n`);
    console.log('='.repeat(80) + '\n');
    
    console.log('📦 PRODUTOS COM ESTOQUE:\n');
    console.log(`   Com estoque > 0 (total): ${(comEstoque || 0).toLocaleString('pt-BR')}`);
    console.log(`   ✅ Com estoque > 0 E active=true: ${(ativosComEstoque || 0).toLocaleString('pt-BR')}`);
    console.log(`   ⚠️  Com estoque > 0 MAS active=false: ${(inativosComEstoque || 0).toLocaleString('pt-BR')}\n`);
    
    if (inativosComEstoque > 0) {
      console.log('='.repeat(80) + '\n');
      console.log(`⚠️  ENCONTRADOS ${inativosComEstoque} PRODUTOS COM ESTOQUE MAS MARCADOS COMO INATIVOS!\n`);
      
      // Buscar exemplos
      const { data: exemplos } = await supabase
        .from('products')
        .select('id, name, codigo_mercos, stock_qty, price, active, ativo')
        .eq('distribuidor_id', dist.id)
        .eq('active', false)
        .gt('stock_qty', 0)
        .limit(10);
      
      if (exemplos && exemplos.length > 0) {
        console.log('📋 EXEMPLOS (primeiros 10):\n');
        exemplos.forEach((p, i) => {
          console.log(`   ${(i + 1).toString().padStart(2)}. ${p.codigo_mercos || 'SEM CÓD'} - ${p.name?.substring(0, 50)}`);
          console.log(`       Estoque: ${p.stock_qty} | Preço: R$ ${p.price?.toFixed(2)}`);
          console.log(`       active: ${p.active} | ativo (Mercos): ${p.ativo}\n`);
        });
      }
    }
    
    console.log('='.repeat(80) + '\n');
    console.log('💡 CONCLUSÃO:\n');
    
    const possiveisProdutosAtivos = ativosComEstoque + inativosComEstoque;
    console.log(`   Se considerarmos produtos com estoque > 0 como "ativos":`);
    console.log(`   Teríamos: ${possiveisProdutosAtivos.toLocaleString('pt-BR')} produtos\n`);
    
    if (possiveisProdutosAtivos >= 3400 && possiveisProdutosAtivos <= 3500) {
      console.log(`   ✅ ISSO BATE com os 3.439 produtos que você vê na interface!\n`);
      console.log(`   O problema é que ${inativosComEstoque} produtos estão marcados`);
      console.log(`   como active=false mas TÊM ESTOQUE!\n`);
    }
    
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('💥 Erro:', error.message);
  }
}

verificarProdutos().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro fatal:', err);
  process.exit(1);
});
