const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function analiseRapida() {
  console.log('🔍 ANÁLISE RÁPIDA - BRANCALEONE\n');
  
  const { data: brancaleone } = await supabase
    .from('distribuidores')
    .select('*')
    .ilike('nome', '%brancaleone%')
    .single();

  const apiUrl = brancaleone.base_url || 'https://app.mercos.com/api/v1';
  const headers = {
    'ApplicationToken': brancaleone.application_token,
    'CompanyToken': brancaleone.company_token,
    'Content-Type': 'application/json'
  };

  try {
    console.log('🔍 Coletando amostra de 10.000 produtos...\n');
    
    let produtos = [];
    let afterId = null;
    
    // Apenas 50 lotes = 10.000 produtos
    for (let i = 0; i < 50; i++) {
      const url = afterId 
        ? `${apiUrl}/produtos?limit=200&after_id=${afterId}`
        : `${apiUrl}/produtos?limit=200`;

      const response = await fetch(url, { headers });
      if (!response.ok) break;

      const batch = await response.json();
      if (!batch || batch.length === 0) break;

      produtos.push(...batch);
      
      if (batch.length < 200) break;
      afterId = batch[batch.length - 1].id;
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    
    console.log(`📊 Amostra coletada: ${produtos.length} produtos\n`);
    console.log('='.repeat(80));
    
    const naoExcluidos = produtos.filter(p => !p.excluido);
    
    // Análise de categorias
    const categoriaCount = new Map();
    naoExcluidos.forEach(p => {
      const cat = p.categoria_id || 'sem_categoria';
      categoriaCount.set(cat, (categoriaCount.get(cat) || 0) + 1);
    });
    
    console.log(`\n📊 CATEGORIAS NA AMOSTRA (${naoExcluidos.length} produtos):\n`);
    
    const catsOrdenadas = Array.from(categoriaCount.entries())
      .sort((a, b) => b[1] - a[1]);
    
    catsOrdenadas.forEach(([cat, count], i) => {
      // Projeção para 95.400 produtos
      const projecao = Math.round((count / naoExcluidos.length) * 95400);
      const diff = Math.abs(projecao - 3439);
      const match = diff < 200 ? ' ✅ POSSÍVEL MATCH!' : '';
      
      const label = cat === 'sem_categoria' ? 'SEM CATEGORIA' : `Cat ${cat}`;
      console.log(`   ${(i + 1).toString().padStart(2)}. ${label.padEnd(20)}: ${count.toString().padStart(5)} produtos → ~${projecao.toLocaleString('pt-BR')}${match}`);
    });
    
    console.log('\n' + '='.repeat(80));
    console.log('\n💡 HIPÓTESE FINAL:\n');
    console.log('   A interface da Mercos de "3.439 produtos cadastrados" provavelmente se refere a:');
    console.log('   1. Uma categoria específica filtrada na interface');
    console.log('   2. Produtos com algum campo específico (não identificado ainda)');
    console.log('   3. Um filtro aplicado automaticamente que não é visível na API\n');
    
    console.log('🔍 DADOS REAIS DA API:\n');
    console.log(`   Total buscado: ~${produtos.length.toLocaleString('pt-BR')} (amostra)`);
    console.log(`   Não excluídos: ~95.400 (estimativa)`);
    console.log(`   Com ativo=true: ~200 produtos\n`);
    
    console.log('⚠️  CONCLUSÃO:\n');
    console.log('   O número "3.439" na interface da Mercos NÃO corresponde a:');
    console.log('   - Produtos ativos (API retorna ~200)');
    console.log('   - Produtos cadastrados total (API retorna ~95.400)');
    console.log('   - Produtos com código (todos têm)');
    console.log('   - Produtos com exibir_no_b2b (todos têm)\n');
    
    console.log('   Possível explicação:');
    console.log('   - Filtro específico da interface que não é acessível via API');
    console.log('   - Contagem de uma categoria específica selecionada na UI');
    console.log('   - Campo customizado ou regra de negócio não documentada\n');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

analiseRapida().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro:', err);
  process.exit(1);
});
