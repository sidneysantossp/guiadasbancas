const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function diagnosticarFaltantes() {
  console.log('\n🔍 DIAGNÓSTICO: PRODUTOS FALTANTES - BRANCALEONE\n');
  console.log('='.repeat(80) + '\n');
  
  try {
    const { data: dist } = await supabase
      .from('distribuidores')
      .select('*')
      .ilike('nome', '%brancaleone%')
      .single();
    
    console.log(`🏢 Distribuidor: ${dist.nome}\n`);
    console.log('='.repeat(80) + '\n');
    
    // Verificar produtos no banco
    const { count: totalBanco } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id);
    
    const { count: ativosBanco } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('active', true);
    
    const { count: comEstoque } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .gt('stock_qty', 0);
    
    const { count: ativosComEstoque } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('active', true)
      .gt('stock_qty', 0);
    
    const { count: ativosSemEstoque } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('active', true)
      .eq('stock_qty', 0);
    
    console.log('📊 STATUS NO BANCO:\n');
    console.log(`   Total de produtos: ${(totalBanco || 0).toLocaleString('pt-BR')}`);
    console.log(`   Ativos (active=true): ${(ativosBanco || 0).toLocaleString('pt-BR')}`);
    console.log(`   Com estoque > 0: ${(comEstoque || 0).toLocaleString('pt-BR')}`);
    console.log(`   Ativos COM estoque: ${(ativosComEstoque || 0).toLocaleString('pt-BR')}`);
    console.log(`   Ativos SEM estoque: ${(ativosSemEstoque || 0).toLocaleString('pt-BR')}\n`);
    console.log('='.repeat(80) + '\n');
    
    // Buscar da API Mercos com filtros diferentes
    const apiUrl = dist.base_url || 'https://app.mercos.com/api/v1';
    const headers = {
      'ApplicationToken': dist.application_token,
      'CompanyToken': dist.company_token,
      'Content-Type': 'application/json'
    };
    
    console.log('🔍 Buscando da API Mercos com diferentes filtros...\n');
    
    // Testar diferentes combinações
    const testes = [
      { nome: 'Ativos (ativo=1)', url: `${apiUrl}/produtos?ativo=1&limit=10` },
      { nome: 'Não excluídos (excluido=0)', url: `${apiUrl}/produtos?excluido=0&limit=10` },
      { nome: 'Com estoque (saldo_estoque>0)', url: `${apiUrl}/produtos?limit=10` },
      { nome: 'Exibir no B2B (exibir_no_b2b=1)', url: `${apiUrl}/produtos?exibir_no_b2b=1&limit=10` },
    ];
    
    for (const teste of testes) {
      try {
        const response = await fetch(teste.url, { headers });
        if (response.ok) {
          const produtos = await response.json();
          if (produtos && produtos.length > 0) {
            console.log(`   ✅ ${teste.nome}: ${produtos.length} produtos retornados`);
            
            // Contar quantos são realmente ativos
            const realmenteAtivos = produtos.filter(p => p.ativo && !p.excluido).length;
            console.log(`      Desses, ${realmenteAtivos} têm ativo=true e excluido=false\n`);
          } else {
            console.log(`   ⚠️  ${teste.nome}: 0 produtos\n`);
          }
        } else {
          console.log(`   ❌ ${teste.nome}: Erro ${response.status}\n`);
        }
      } catch (error) {
        console.log(`   ❌ ${teste.nome}: ${error.message}\n`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log('='.repeat(80) + '\n');
    
    // Buscar contagem total da API
    console.log('📊 Buscando contagem total da API Mercos...\n');
    
    let totalAPI = 0;
    let ativosAPI = 0;
    let lote = 0;
    
    while (lote < 20) {
      const url = lote === 0 
        ? `${apiUrl}/produtos?limit=200`
        : `${apiUrl}/produtos?limit=200&after_id=${afterId}`;
      
      const response = await fetch(url, { headers });
      if (!response.ok) break;
      
      const produtos = await response.json();
      if (!produtos || produtos.length === 0) break;
      
      totalAPI += produtos.length;
      produtos.forEach(p => {
        if (p.ativo && !p.excluido) ativosAPI++;
      });
      
      if (produtos.length < 200) break;
      var afterId = produtos[produtos.length - 1].id;
      lote++;
    }
    
    console.log(`   Total buscado (primeiros ${lote * 200}): ${totalAPI.toLocaleString('pt-BR')}`);
    console.log(`   Ativos encontrados: ${ativosAPI.toLocaleString('pt-BR')}\n`);
    console.log('='.repeat(80) + '\n');
    
    console.log('💡 ANÁLISE:\n');
    console.log(`   Esperado: 3.439 produtos ativos`);
    console.log(`   No banco: ${ativosBanco} produtos ativos`);
    console.log(`   Diferença: ${3439 - (ativosBanco || 0)} produtos\n`);
    
    if (ativosAPI > 0 && ativosAPI !== ativosBanco) {
      console.log(`   ⚠️  A API retornou ${ativosAPI} ativos em uma amostra.`);
      console.log(`   Isso sugere que a sincronização não pegou todos os produtos.\n`);
    }
    
    console.log('🔧 RECOMENDAÇÕES:\n');
    console.log('   1. Verificar se há produtos com estoque=0 que deveriam estar ativos');
    console.log('   2. Conferir na interface Mercos se existem filtros específicos');
    console.log('   3. Tentar sincronização incremental sem filtro de data\n');
    
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('💥 Erro:', error.message);
  }
}

diagnosticarFaltantes().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro fatal:', err);
  process.exit(1);
});
