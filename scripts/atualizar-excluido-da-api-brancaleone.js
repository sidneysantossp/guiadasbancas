const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function atualizarExcluidoDaAPI() {
  console.log('\n🔄 ATUALIZANDO CAMPO "excluido" DA API MERCOS - BRANCALEONE\n');
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
    
    // Buscar produtos da API Mercos
    console.log('🔍 Buscando produtos da API Mercos...\n');
    
    let produtosAPI = [];
    let afterId = null;
    let lote = 0;
    
    while (lote < 100) {
      const url = afterId 
        ? `${apiUrl}/produtos?limit=200&after_id=${afterId}`
        : `${apiUrl}/produtos?limit=200`;

      const response = await fetch(url, { headers });
      if (!response.ok) break;

      const batch = await response.json();
      if (!batch || batch.length === 0) break;

      produtosAPI.push(...batch);
      lote++;
      
      if (lote % 20 === 0) {
        console.log(`   Coletado: ${produtosAPI.length.toLocaleString('pt-BR')} produtos (lote ${lote})...`);
      }
      
      if (batch.length < 200) break;
      afterId = batch[batch.length - 1].id;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n📊 Total da API: ${produtosAPI.length.toLocaleString('pt-BR')} produtos\n`);
    console.log('='.repeat(80) + '\n');
    
    // Criar mapa de status por mercos_id
    const statusPorMercosId = new Map();
    let ativosNaoExcluidos = 0;
    
    produtosAPI.forEach(p => {
      statusPorMercosId.set(p.id, {
        ativo: p.ativo || false,
        excluido: p.excluido || false
      });
      
      if (p.ativo && !p.excluido) {
        ativosNaoExcluidos++;
      }
    });
    
    console.log('📊 STATUS NA API MERCOS:\n');
    console.log(`   Ativos não excluídos (ativo=true, excluido=false): ${ativosNaoExcluidos.toLocaleString('pt-BR')}\n`);
    console.log('='.repeat(80) + '\n');
    
    // Buscar TODOS os produtos no banco (paginado)
    let produtosBanco = [];
    let offset = 0;
    const pageSize = 1000;
    
    while (true) {
      const { data: batch, error } = await supabase
        .from('products')
        .select('id, mercos_id, name')
        .eq('distribuidor_id', dist.id)
        .range(offset, offset + pageSize - 1);
      
      if (error || !batch || batch.length === 0) break;
      
      produtosBanco.push(...batch);
      
      if (batch.length < pageSize) break;
      offset += pageSize;
    }
    
    console.log(`📦 Produtos no banco: ${produtosBanco.length.toLocaleString('pt-BR')}\n`);
    console.log('🔄 Atualizando status dos produtos...\n');
    
    let atualizados = 0;
    let naoEncontrados = 0;
    
    for (const produto of produtosBanco) {
      const status = statusPorMercosId.get(produto.mercos_id);
      
      if (!status) {
        naoEncontrados++;
        continue;
      }
      
      const active = status.ativo && !status.excluido;
      
      const { error } = await supabase
        .from('products')
        .update({
          ativo: status.ativo,
          excluido: status.excluido,
          active: active,
          updated_at: new Date().toISOString()
        })
        .eq('id', produto.id);
      
      if (!error) {
        atualizados++;
        if (atualizados % 500 === 0) {
          console.log(`   ✅ ${atualizados} produtos atualizados...`);
        }
      }
    }
    
    console.log(`\n   ✅ Total atualizado: ${atualizados.toLocaleString('pt-BR')}\n`);
    console.log(`   ⚠️  Não encontrados na API: ${naoEncontrados.toLocaleString('pt-BR')}\n`);
    console.log('='.repeat(80) + '\n');
    
    // Verificar resultado final
    const { count: ativosFinais } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('active', true);
    
    const { count: comAtivoTrue } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('ativo', true)
      .eq('excluido', false);
    
    console.log('📊 RESULTADO FINAL:\n');
    console.log(`   Produtos active=true: ${(ativosFinais || 0).toLocaleString('pt-BR')}`);
    console.log(`   Produtos ativo=true e excluido=false: ${(comAtivoTrue || 0).toLocaleString('pt-BR')}`);
    console.log(`   Esperado: 3.439\n`);
    
    if (ativosFinais >= 3400 && ativosFinais <= 3500) {
      console.log('   ✅ NÚMEROS CORRETOS! Sincronização bem-sucedida!\n');
    } else if (comAtivoTrue >= 3400 && comAtivoTrue <= 3500) {
      console.log('   ⚠️  Os campos ativo/excluido estão corretos, mas active não.\n');
      console.log('   Isso será corrigido na próxima sincronização.\n');
    } else {
      console.log(`   ⚠️  Diferença de ${Math.abs(3439 - (ativosFinais || 0))} produtos.\n`);
    }
    
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('💥 Erro:', error.message);
  }
}

atualizarExcluidoDaAPI().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro fatal:', err);
  process.exit(1);
});
