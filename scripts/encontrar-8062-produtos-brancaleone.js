const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function encontrar8062() {
  console.log('\n🔍 BUSCANDO FILTRO QUE RESULTE EM ~8.062 PRODUTOS\n');
  console.log('='.repeat(80) + '\n');
  
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
    console.log('🔍 Buscando produtos...\n');
    
    let produtos = [];
    let afterId = null;
    
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
    
    console.log(`📊 Amostra: ${produtos.length.toLocaleString('pt-BR')} produtos\n`);
    console.log('='.repeat(80) + '\n');
    
    const naoExcluidos = produtos.filter(p => !p.excluido);
    
    // Testar diferentes filtros
    const testes = [
      {
        nome: 'Com estoque > 0',
        filtro: p => !p.excluido && p.saldo_estoque > 0
      },
      {
        nome: 'Com preço > 0',
        filtro: p => !p.excluido && p.preco_tabela > 0
      },
      {
        nome: 'Com estoque OU preço',
        filtro: p => !p.excluido && (p.saldo_estoque > 0 || p.preco_tabela > 0)
      },
      {
        nome: 'Atualizados em 2024',
        filtro: p => !p.excluido && p.ultima_alteracao && p.ultima_alteracao.startsWith('2024')
      },
      {
        nome: 'Atualizados após nov/2024',
        filtro: p => !p.excluido && p.ultima_alteracao && p.ultima_alteracao >= '2024-11-01'
      },
      {
        nome: 'Com código não vazio',
        filtro: p => !p.excluido && p.codigo && p.codigo.trim() !== ''
      },
    ];
    
    console.log('🧪 TESTANDO DIFERENTES FILTROS:\n');
    
    testes.forEach(teste => {
      const filtrados = produtos.filter(teste.filtro);
      const projecao = Math.round((filtrados.length / produtos.length) * 100000);
      const diff = Math.abs(projecao - 8062);
      const match = diff < 500 ? ' ✅ POSSÍVEL MATCH!' : '';
      
      console.log(`   ${teste.nome.padEnd(35)}: ${filtrados.length.toString().padStart(5)} na amostra → ~${projecao.toLocaleString('pt-BR').padStart(7)} total${match}`);
    });
    
    console.log('\n' + '='.repeat(80) + '\n');
    
    // Análise por categoria
    console.log('📊 CONTAGEM POR CATEGORIA (Top 15):\n');
    
    const categorias = new Map();
    naoExcluidos.forEach(p => {
      const catId = p.categoria_id || 'sem_categoria';
      categorias.set(catId, (categorias.get(catId) || 0) + 1);
    });
    
    Array.from(categorias.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .forEach(([catId, count], i) => {
        const projecao = Math.round((count / naoExcluidos.length) * 95400);
        const diff = Math.abs(projecao - 8062);
        const match = diff < 500 ? ' ✅ MATCH!' : '';
        
        console.log(`   ${(i + 1).toString().padStart(2)}. Categoria ${String(catId).padEnd(15)}: ${count.toString().padStart(5)} → ~${projecao.toLocaleString('pt-BR').padStart(7)}${match}`);
      });
    
    console.log('\n' + '='.repeat(80) + '\n');
    
    console.log('💡 SUGESTÃO:\n');
    console.log('   Verifique na interface da Mercos se há:');
    console.log('   1. Filtro de categoria ativo');
    console.log('   2. Filtro de fornecedor');
    console.log('   3. Filtro de data de atualização');
    console.log('   4. Algum filtro de "Disponível para venda" ou similar\n');
    console.log('   O mais provável é que a interface esteja mostrando uma CATEGORIA específica');
    console.log('   com ~8.062 produtos, não o catálogo completo.\n');
    
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

encontrar8062().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro:', err);
  process.exit(1);
});
