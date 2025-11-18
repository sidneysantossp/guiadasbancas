const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function contarInativosMercos() {
  console.log('\n📊 CONTANDO PRODUTOS INATIVOS NA API MERCOS - BRANCALEONE\n');
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
    console.log('🔍 Buscando produtos da API Mercos...\n');
    
    let produtos = [];
    let afterId = null;
    let lote = 0;
    
    // Buscar até encontrar todos os produtos
    while (lote < 200) {
      const url = afterId 
        ? `${apiUrl}/produtos?limit=200&after_id=${afterId}`
        : `${apiUrl}/produtos?limit=200`;

      const response = await fetch(url, { headers });
      if (!response.ok) break;

      const batch = await response.json();
      if (!batch || batch.length === 0) break;

      produtos.push(...batch);
      
      lote++;
      if (lote % 20 === 0) {
        console.log(`   Coletado: ${produtos.length} produtos...`);
      }
      
      if (batch.length < 200) break;
      
      afterId = batch[batch.length - 1].id;
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    
    console.log(`\n📊 Total coletado: ${produtos.length.toLocaleString('pt-BR')} produtos\n`);
    console.log('='.repeat(80) + '\n');
    
    // Contar por status
    let excluidos = 0;
    let naoExcluidosAtivos = 0;
    let naoExcluidosInativos = 0;
    
    produtos.forEach(p => {
      if (p.excluido === true || p.excluido === 1) {
        excluidos++;
      } else {
        if (p.ativo === true || p.ativo === 1) {
          naoExcluidosAtivos++;
        } else {
          naoExcluidosInativos++;
        }
      }
    });
    
    console.log('📦 RESULTADO NA API MERCOS:\n');
    console.log(`   🗑️  Excluídos:                    ${excluidos.toLocaleString('pt-BR')} produtos`);
    console.log(`   ✅ Não-excluídos ATIVOS:          ${naoExcluidosAtivos.toLocaleString('pt-BR')} produtos`);
    console.log(`   ❌ Não-excluídos INATIVOS:        ${naoExcluidosInativos.toLocaleString('pt-BR')} produtos\n`);
    console.log('='.repeat(80) + '\n');
    
    const totalNaoExcluidos = naoExcluidosAtivos + naoExcluidosInativos;
    const percentAtivos = (naoExcluidosAtivos / totalNaoExcluidos * 100).toFixed(1);
    const percentInativos = (naoExcluidosInativos / totalNaoExcluidos * 100).toFixed(1);
    
    console.log('📊 PERCENTUAIS (Apenas produtos não-excluídos):\n');
    console.log(`   Ativos:    ${percentAtivos}% (${naoExcluidosAtivos} de ${totalNaoExcluidos})`);
    console.log(`   Inativos:  ${percentInativos}% (${naoExcluidosInativos} de ${totalNaoExcluidos})\n`);
    console.log('='.repeat(80) + '\n');
    
    // Mostrar alguns exemplos de inativos
    const exemplosInativos = produtos
      .filter(p => !p.excluido && p.ativo === false)
      .slice(0, 10);
    
    if (exemplosInativos.length > 0) {
      console.log('📋 EXEMPLOS DE PRODUTOS INATIVOS (primeiros 10):\n');
      exemplosInativos.forEach((p, i) => {
        console.log(`   ${(i + 1).toString().padStart(2)}. ${p.codigo || 'SEM CÓDIGO'} - ${p.nome?.substring(0, 50)}`);
        console.log(`       Preço: R$ ${p.preco_tabela?.toFixed(2) || '0.00'} | Estoque: ${p.saldo_estoque || 0}\n`);
      });
    }
    
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

contarInativosMercos().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro:', err);
  process.exit(1);
});
