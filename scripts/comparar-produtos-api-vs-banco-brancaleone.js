const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function compararProdutos() {
  console.log('\n🔍 COMPARANDO PRODUTOS API vs BANCO - BRANCALEONE\n');
  console.log('='.repeat(80) + '\n');
  
  try {
    const { data: dist } = await supabase
      .from('distribuidores')
      .select('*')
      .ilike('nome', '%brancaleone%')
      .single();
    
    console.log(`🏢 Distribuidor: ${dist.nome}\n`);
    console.log('='.repeat(80) + '\n');
    
    const apiUrl = dist.base_url || 'https://app.mercos.com/api/v1';
    const headers = {
      'ApplicationToken': dist.application_token,
      'CompanyToken': dist.company_token,
      'Content-Type': 'application/json'
    };
    
    // Buscar TODOS os produtos da API Mercos
    console.log('🔍 Buscando produtos da API Mercos...\n');
    let produtosAPI = [];
    let afterId = null;
    
    for (let i = 0; i < 50; i++) {
      const url = afterId 
        ? `${apiUrl}/produtos?limit=200&after_id=${afterId}`
        : `${apiUrl}/produtos?limit=200`;

      const response = await fetch(url, { headers });
      if (!response.ok) break;

      const batch = await response.json();
      if (!batch || batch.length === 0) break;

      produtosAPI.push(...batch);
      
      if (i % 10 === 0 && i > 0) {
        console.log(`   Coletado: ${produtosAPI.length} produtos...`);
      }
      
      if (batch.length < 200) break;
      afterId = batch[batch.length - 1].id;
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    
    console.log(`\n📊 Total na API Mercos: ${produtosAPI.length.toLocaleString('pt-BR')} produtos\n`);
    console.log('='.repeat(80) + '\n');
    
    // Contar ativos e inativos na API
    let ativosAPI = 0;
    let inativosAPI = 0;
    
    produtosAPI.forEach(p => {
      if (p.ativo && !p.excluido) {
        ativosAPI++;
      } else {
        inativosAPI++;
      }
    });
    
    console.log('📊 PRODUTOS NA API MERCOS:\n');
    console.log(`   ✅ Ativos (ativo=true, excluido=false): ${ativosAPI.toLocaleString('pt-BR')}`);
    console.log(`   ❌ Inativos/Excluídos: ${inativosAPI.toLocaleString('pt-BR')}\n`);
    console.log('='.repeat(80) + '\n');
    
    // Buscar produtos no banco
    const { count: totalBanco } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id);
    
    const { count: ativosBanco } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('active', true);
    
    console.log('📊 PRODUTOS NO BANCO:\n');
    console.log(`   Total: ${(totalBanco || 0).toLocaleString('pt-BR')}`);
    console.log(`   Ativos: ${(ativosBanco || 0).toLocaleString('pt-BR')}\n`);
    console.log('='.repeat(80) + '\n');
    
    // Comparar
    const diferencaAtivos = ativosAPI - (ativosBanco || 0);
    
    console.log('📊 COMPARAÇÃO:\n');
    console.log(`   Ativos na API: ${ativosAPI.toLocaleString('pt-BR')}`);
    console.log(`   Ativos no banco: ${(ativosBanco || 0).toLocaleString('pt-BR')}`);
    console.log(`   Diferença: ${diferencaAtivos.toLocaleString('pt-BR')} produtos\n`);
    
    if (diferencaAtivos > 0) {
      console.log(`   ⚠️  FALTAM ${diferencaAtivos} produtos ativos no banco!\n`);
      
      // Buscar IDs dos produtos no banco
      const { data: produtosBanco } = await supabase
        .from('products')
        .select('mercos_id')
        .eq('distribuidor_id', dist.id);
      
      const mercosIdsBanco = new Set(produtosBanco.map(p => p.mercos_id));
      
      // Encontrar produtos que estão na API mas não no banco
      const faltando = produtosAPI
        .filter(p => p.ativo && !p.excluido && !mercosIdsBanco.has(p.id))
        .slice(0, 20);
      
      if (faltando.length > 0) {
        console.log('📋 EXEMPLOS DE PRODUTOS QUE FALTAM (primeiros 20):\n');
        faltando.forEach((p, i) => {
          console.log(`   ${(i + 1).toString().padStart(2)}. ID: ${p.id} - ${p.codigo || 'SEM CÓDIGO'}`);
          console.log(`       ${p.nome?.substring(0, 60)}`);
          console.log(`       Preço: R$ ${p.preco_tabela?.toFixed(2)} | Estoque: ${p.saldo_estoque || 0}\n`);
        });
      }
    } else if (diferencaAtivos < 0) {
      console.log(`   ⚠️  TEMOS ${Math.abs(diferencaAtivos)} produtos ATIVOS A MAIS no banco do que na API!\n`);
    } else {
      console.log(`   ✅ Números batem perfeitamente!\n`);
    }
    
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('💥 Erro:', error.message);
  }
}

compararProdutos().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro fatal:', err);
  process.exit(1);
});
