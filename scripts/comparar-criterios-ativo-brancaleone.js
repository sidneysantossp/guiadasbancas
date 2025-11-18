const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function compararCriterios() {
  console.log('\n🔍 COMPARANDO DIFERENTES CRITÉRIOS DE "ATIVO"\n');
  console.log('='.repeat(80) + '\n');
  
  try {
    const { data: dist } = await supabase
      .from('distribuidores')
      .select('*')
      .ilike('nome', '%brancaleone%')
      .single();
    
    console.log(`🏢 Distribuidor: ${dist.nome}\n`);
    console.log('='.repeat(80) + '\n');
    
    // Testar diferentes critérios
    const criterios = [
      { 
        nome: 'Active = true (critério atual)', 
        filtro: { active: true } 
      },
      { 
        nome: 'Ativo = true (campo Mercos)', 
        filtro: { ativo: true } 
      },
      { 
        nome: 'Ativo = true E Excluido = false', 
        filtros: [
          { field: 'ativo', value: true },
          { field: 'excluido', value: false }
        ]
      },
      { 
        nome: 'Stock > 0 (com estoque)', 
        filtro: { gt: { stock_qty: 0 } } 
      },
      { 
        nome: 'Ativo = true OU Stock > 0', 
        or: true
      },
    ];
    
    console.log('📊 TESTANDO DIFERENTES CRITÉRIOS:\n');
    
    // Critério 1: active = true
    const { count: c1 } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('active', true);
    
    console.log(`   1. Active = true: ${(c1 || 0).toLocaleString('pt-BR')}`);
    
    // Critério 2: ativo = true
    const { count: c2 } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('ativo', true);
    
    console.log(`   2. Ativo = true (Mercos): ${(c2 || 0).toLocaleString('pt-BR')}`);
    
    // Critério 3: ativo = true E excluido = false
    const { count: c3 } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('ativo', true)
      .eq('excluido', false);
    
    console.log(`   3. Ativo = true E Excluido = false: ${(c3 || 0).toLocaleString('pt-BR')}`);
    
    // Critério 4: stock > 0
    const { count: c4 } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .gt('stock_qty', 0);
    
    console.log(`   4. Stock > 0: ${(c4 || 0).toLocaleString('pt-BR')}`);
    
    // Critério 5: ativo = true OU stock > 0
    const { count: c5 } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .or('ativo.eq.true,stock_qty.gt.0');
    
    console.log(`   5. Ativo = true OU Stock > 0: ${(c5 || 0).toLocaleString('pt-BR')}`);
    
    // Critério 6: exibir_no_b2b (se existir)
    const { count: c6 } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('active', true)
      .eq('exibir_no_b2b', true);
    
    console.log(`   6. Active = true E exibir_no_b2b = true: ${(c6 || 0).toLocaleString('pt-BR')}\n`);
    
    console.log('='.repeat(80) + '\n');
    
    console.log('💡 ANÁLISE:\n');
    console.log(`   Esperado na interface Mercos: 3.439\n`);
    
    const diferencas = [
      { criterio: 'Active = true', valor: c1, diff: Math.abs(3439 - (c1 || 0)) },
      { criterio: 'Ativo = true', valor: c2, diff: Math.abs(3439 - (c2 || 0)) },
      { criterio: 'Ativo E !Excluido', valor: c3, diff: Math.abs(3439 - (c3 || 0)) },
      { criterio: 'Stock > 0', valor: c4, diff: Math.abs(3439 - (c4 || 0)) },
      { criterio: 'Ativo OU Stock', valor: c5, diff: Math.abs(3439 - (c5 || 0)) },
    ];
    
    diferencas.sort((a, b) => a.diff - b.diff);
    
    console.log('   📊 Critérios ordenados por proximidade:\n');
    diferencas.forEach((d, i) => {
      const emoji = d.diff < 50 ? '✅' : d.diff < 500 ? '⚠️' : '❌';
      console.log(`   ${emoji} ${(i + 1)}. ${d.criterio.padEnd(25)}: ${(d.valor || 0).toLocaleString('pt-BR').padStart(6)} (diff: ${d.diff})`);
    });
    
    console.log('\n' + '='.repeat(80) + '\n');
    
    const melhorCriterio = diferencas[0];
    
    if (melhorCriterio.diff < 50) {
      console.log(`✅ O critério "${melhorCriterio.criterio}" está MUITO próximo!\n`);
      console.log(`   Diferença de apenas ${melhorCriterio.diff} produtos.\n`);
    } else {
      console.log(`⚠️  Nenhum critério está próximo dos 3.439 esperados.\n`);
      console.log(`   A interface da Mercos pode estar usando filtros adicionais ou\n`);
      console.log(`   o número 3.439 pode incluir produtos não retornados pela API.\n`);
    }
    
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('💥 Erro:', error.message);
  }
}

compararCriterios().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro fatal:', err);
  process.exit(1);
});
