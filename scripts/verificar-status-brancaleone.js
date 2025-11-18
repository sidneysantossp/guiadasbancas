const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verificarStatus() {
  console.log('🔍 VERIFICAÇÃO DE STATUS - BRANCALEONE\n');
  
  // Buscar Brancaleone
  const { data: brancaleone } = await supabase
    .from('distribuidores')
    .select('*')
    .ilike('nome', '%brancaleone%')
    .single();

  if (!brancaleone) {
    console.log('❌ Brancaleone não encontrada');
    return;
  }

  console.log(`📦 Distribuidor: ${brancaleone.nome}`);
  console.log(`🆔 ID: ${brancaleone.id}\n`);

  // Estatísticas do banco
  const { count: totalBanco } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('distribuidor_id', brancaleone.id);

  const { count: ativosBanco } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('distribuidor_id', brancaleone.id)
    .eq('active', true);

  const { count: inativosBanco } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('distribuidor_id', brancaleone.id)
    .eq('active', false);

  console.log('📊 ESTATÍSTICAS NO NOSSO BANCO:');
  console.log(`   📦 Total: ${totalBanco}`);
  console.log(`   ✅ Ativos: ${ativosBanco}`);
  console.log(`   ❌ Inativos: ${inativosBanco}\n`);

  // Buscar produtos na API Mercos
  console.log('🔍 Buscando produtos na API Mercos...\n');
  
  const apiUrl = brancaleone.base_url || 'https://app.mercos.com/api/v1';
  const headers = {
    'ApplicationToken': brancaleone.application_token,
    'CompanyToken': brancaleone.company_token,
    'Content-Type': 'application/json'
  };

  let todosProdutosMercos = [];
  let afterId = null;
  let tentativa = 0;
  const maxTentativas = 50; // ~10.000 produtos

  try {
    while (tentativa < maxTentativas) {
      const url = afterId 
        ? `${apiUrl}/produtos?limit=200&after_id=${afterId}`
        : `${apiUrl}/produtos?limit=200`;

      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        console.error(`❌ Erro na API: ${response.status}`);
        break;
      }

      const batch = await response.json();
      
      if (!batch || batch.length === 0) break;

      todosProdutosMercos.push(...batch);
      
      if (tentativa % 5 === 0) {
        console.log(`   Buscados ${todosProdutosMercos.length} produtos...`);
      }

      if (batch.length < 200) break;
      
      afterId = batch[batch.length - 1].id;
      tentativa++;

      await new Promise(resolve => setTimeout(resolve, 100));
    }
  } catch (apiError) {
    console.error('\n❌ Erro ao buscar da API Mercos:', apiError.message);
  }

  console.log(`\n✅ Total de produtos na API Mercos: ${todosProdutosMercos.length}\n`);

  // Analisar status na API Mercos
  let ativosNaMercos = 0;
  let inativosNaMercos = 0;
  let excluidosNaMercos = 0;

  for (const produto of todosProdutosMercos) {
    if (produto.excluido) {
      excluidosNaMercos++;
    } else if (produto.ativo) {
      ativosNaMercos++;
    } else {
      inativosNaMercos++;
    }
  }

  console.log('📊 ESTATÍSTICAS NA API MERCOS:');
  console.log(`   📦 Total: ${todosProdutosMercos.length}`);
  console.log(`   ✅ Ativos: ${ativosNaMercos}`);
  console.log(`   ❌ Inativos: ${inativosNaMercos}`);
  console.log(`   🗑️  Excluídos: ${excluidosNaMercos}\n`);

  console.log('=' .repeat(80));
  console.log('\n📊 COMPARAÇÃO:\n');
  console.log(`   BANCO:  ${ativosBanco} ativos / ${inativosBanco} inativos`);
  console.log(`   MERCOS: ${ativosNaMercos} ativos / ${inativosNaMercos} inativos\n`);

  const diferencaAtivos = ativosBanco - ativosNaMercos;
  const diferencaInativos = inativosBanco - inativosNaMercos;

  if (diferencaAtivos !== 0 || diferencaInativos !== 0) {
    console.log('⚠️  DIVERGÊNCIA ENCONTRADA!\n');
    console.log(`   Diferença de ativos: ${diferencaAtivos > 0 ? '+' : ''}${diferencaAtivos}`);
    console.log(`   Diferença de inativos: ${diferencaInativos > 0 ? '+' : ''}${diferencaInativos}\n`);
  } else {
    console.log('✅ TUDO SINCRONIZADO!\n');
  }

  // Buscar exemplos de produtos com status divergente
  console.log('🔍 BUSCANDO EXEMPLOS DE DIVERGÊNCIAS...\n');

  // Pegar alguns produtos inativos na Mercos
  const inativosNaMercosIds = todosProdutosMercos
    .filter(p => !p.ativo || p.excluido)
    .slice(0, 20)
    .map(p => p.id);

  if (inativosNaMercosIds.length > 0) {
    const { data: divergentes } = await supabase
      .from('products')
      .select('id, name, mercos_id, active')
      .eq('distribuidor_id', brancaleone.id)
      .eq('active', true)
      .in('mercos_id', inativosNaMercosIds)
      .limit(10);

    if (divergentes && divergentes.length > 0) {
      console.log(`❌ PRODUTOS ATIVOS NO BANCO MAS INATIVOS NA MERCOS (${divergentes.length}):\n`);
      divergentes.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.name}`);
        console.log(`      Mercos ID: ${p.mercos_id}`);
        console.log(`      Status no banco: ${p.active ? 'ATIVO' : 'INATIVO'}`);
        
        const produtoNaMercos = todosProdutosMercos.find(pm => pm.id === p.mercos_id);
        if (produtoNaMercos) {
          console.log(`      Status na Mercos: ${produtoNaMercos.ativo ? 'ATIVO' : 'INATIVO'} (excluído: ${produtoNaMercos.excluido})`);
        }
        console.log('');
      });
    } else {
      console.log('✅ Nenhuma divergência encontrada nos primeiros produtos testados\n');
    }
  }

  // Verificar data da última sincronização
  const { data: ultimaSync } = await supabase
    .from('products')
    .select('sincronizado_em')
    .eq('distribuidor_id', brancaleone.id)
    .order('sincronizado_em', { ascending: false })
    .limit(1)
    .single();

  if (ultimaSync?.sincronizado_em) {
    const data = new Date(ultimaSync.sincronizado_em);
    console.log(`🕐 ÚLTIMA SINCRONIZAÇÃO: ${data.toLocaleString('pt-BR')}\n`);
  }

  console.log('=' .repeat(80));
}

verificarStatus().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro:', err);
  process.exit(1);
});
