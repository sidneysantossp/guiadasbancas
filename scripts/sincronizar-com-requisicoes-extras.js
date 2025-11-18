const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function sincronizarComRequisicoesExtras() {
  console.log('\n🔄 SINCRONIZAÇÃO USANDO REQUISIÇÕES EXTRAS - BRANCALEONE\n');
  console.log('='.repeat(80) + '\n');
  
  try {
    const { data: dist } = await supabase
      .from('distribuidores')
      .select('*')
      .ilike('nome', '%brancaleone%')
      .single();
    
    const apiUrl = dist.base_url || 'https://app.mercos.com/api/v1';
    const headers = {
      'ApplicationToken': dist.application_token,
      'CompanyToken': dist.company_token,
      'Content-Type': 'application/json'
    };
    
    console.log(`🏢 Distribuidor: ${dist.nome}\n`);
    console.log('='.repeat(80) + '\n');
    
    // Estratégia: fazer requisições com diferentes filtros para pegar produtos diferentes
    console.log('📊 Estratégia: Buscar produtos por diferentes datas de alteração\n');
    
    // Buscar produtos alterados em diferentes períodos
    const periodos = [
      { nome: '2024', data: '2024-01-01' },
      { nome: '2023', data: '2023-01-01' },
      { nome: '2022', data: '2022-01-01' },
      { nome: '2021', data: '2021-01-01' },
      { nome: '2020', data: '2020-01-01' },
      { nome: 'Antes 2020', data: '2000-01-01' },
    ];
    
    let todosProdutosUnicos = new Set();
    
    for (const periodo of periodos) {
      try {
        console.log(`   🔍 Buscando produtos alterados após ${periodo.nome}...`);
        
        const url = `${apiUrl}/produtos?alterado_apos=${periodo.data}&limit=200&order_by=ultima_alteracao&order_direction=asc`;
        const response = await fetch(url, { headers });
        
        if (!response.ok) {
          console.log(`      ❌ Erro ${response.status}\n`);
          continue;
        }
        
        const produtos = await response.json();
        const antesCount = todosProdutosUnicos.size;
        
        produtos.forEach(p => todosProdutosUnicos.add(p.id));
        
        const novos = todosProdutosUnicos.size - antesCount;
        console.log(`      ✅ ${produtos.length} produtos | ${novos} novos únicos | Total: ${todosProdutosUnicos.size}\n`);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.log(`      ❌ Erro: ${error.message}\n`);
      }
    }
    
    console.log('='.repeat(80) + '\n');
    console.log(`📊 Total de IDs únicos coletados: ${todosProdutosUnicos.size}\n`);
    
    // Comparar com o banco
    const { count: noBanco } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id);
    
    console.log(`📦 Produtos no banco: ${noBanco}\n`);
    console.log(`📊 Diferença: ${todosProdutosUnicos.size - noBanco} produtos\n`);
    
    if (todosProdutosUnicos.size > noBanco) {
      console.log('💡 HÁ PRODUTOS QUE AINDA NÃO FORAM SINCRONIZADOS!\n');
      console.log('   Vou criar uma estratégia para sincronizar por faixas de data.\n');
    } else {
      console.log('✅ Todos os produtos únicos já estão no banco.\n');
    }
    
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('💥 Erro:', error.message);
  }
}

sincronizarComRequisicoesExtras().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro fatal:', err);
  process.exit(1);
});
