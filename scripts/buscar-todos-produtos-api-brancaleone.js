const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function buscarTodosProdutos() {
  console.log('\n🔍 BUSCANDO TODOS OS PRODUTOS DA API MERCOS - BRANCALEONE\n');
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
    
    console.log('🔍 Buscando TODOS os produtos...\n');
    let todosProducts = [];
    let afterId = null;
    let lote = 0;
    
    while (lote < 500) {
      const url = afterId 
        ? `${apiUrl}/produtos?limit=200&after_id=${afterId}`
        : `${apiUrl}/produtos?limit=200`;

      const response = await fetch(url, { headers });
      if (!response.ok) {
        console.log(`   ❌ Erro HTTP ${response.status} no lote ${lote}`);
        break;
      }

      const batch = await response.json();
      if (!batch || batch.length === 0) {
        console.log(`   ✅ API não retornou mais produtos (lote ${lote})`);
        break;
      }

      todosProducts.push(...batch);
      lote++;
      
      if (lote % 50 === 0) {
        console.log(`   Coletado: ${todosProducts.length.toLocaleString('pt-BR')} produtos (lote ${lote})...`);
      }
      
      if (batch.length < 200) {
        console.log(`   ✅ Último lote tinha menos de 200 produtos (${batch.length})`);
        break;
      }
      
      afterId = batch[batch.length - 1].id;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n📊 Total buscado: ${todosProducts.length.toLocaleString('pt-BR')} produtos\n`);
    console.log('='.repeat(80) + '\n');
    
    // Contar por status
    let ativosNaoExcluidos = 0;
    let inativosNaoExcluidos = 0;
    let excluidos = 0;
    
    todosProducts.forEach(p => {
      if (p.excluido) {
        excluidos++;
      } else if (p.ativo) {
        ativosNaoExcluidos++;
      } else {
        inativosNaoExcluidos++;
      }
    });
    
    console.log('📊 ANÁLISE DE STATUS:\n');
    console.log(`   ✅ Ativos (ativo=true, excluido=false): ${ativosNaoExcluidos.toLocaleString('pt-BR')}`);
    console.log(`   ⚠️  Inativos (ativo=false, excluido=false): ${inativosNaoExcluidos.toLocaleString('pt-BR')}`);
    console.log(`   🗑️  Excluídos (excluido=true): ${excluidos.toLocaleString('pt-BR')}`);
    console.log(`   📦 Total: ${todosProducts.length.toLocaleString('pt-BR')}\n`);
    console.log('='.repeat(80) + '\n');
    
    // Mostrar exemplos de ativos
    const ativos = todosProducts.filter(p => p.ativo && !p.excluido).slice(0, 10);
    
    if (ativos.length > 0) {
      console.log('📋 EXEMPLOS DE PRODUTOS ATIVOS (primeiros 10):\n');
      ativos.forEach((p, i) => {
        console.log(`   ${(i + 1).toString().padStart(2)}. ID: ${p.id} - ${p.codigo || 'SEM CÓD'}`);
        console.log(`       ${p.nome?.substring(0, 60)}`);
        console.log(`       R$ ${p.preco_tabela?.toFixed(2)} | Estoque: ${p.saldo_estoque || 0}\n`);
      });
    }
    
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('💥 Erro:', error.message);
  }
}

buscarTodosProdutos().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro fatal:', err);
  process.exit(1);
});
