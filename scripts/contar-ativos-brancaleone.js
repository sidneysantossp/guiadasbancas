const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function contarAtivos() {
  console.log('🔍 CONTAGEM DE PRODUTOS ATIVOS - BRANCALEONE\n');
  
  // Buscar Brancaleone
  const { data: brancaleone } = await supabase
    .from('distribuidores')
    .select('*')
    .ilike('nome', '%brancaleone%')
    .single();

  console.log(`📦 Distribuidor: ${brancaleone.nome}\n`);

  // Contar no banco
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

  console.log('📊 NO NOSSO BANCO:');
  console.log(`   ✅ Ativos: ${ativosBanco}`);
  console.log(`   ❌ Inativos: ${inativosBanco}`);
  console.log(`   📦 Total: ${ativosBanco + inativosBanco}\n`);

  // Buscar da API Mercos
  console.log('🔍 Buscando TODOS os produtos da API Mercos...\n');
  
  const apiUrl = brancaleone.base_url || 'https://app.mercos.com/api/v1';
  const headers = {
    'ApplicationToken': brancaleone.application_token,
    'CompanyToken': brancaleone.company_token,
    'Content-Type': 'application/json'
  };

  let produtos = [];
  let afterId = null;
  let ativosNaMercos = 0;
  let inativosNaMercos = 0;
  let excluidosNaMercos = 0;

  try {
    // Buscar até 200 lotes (40.000 produtos) ou até terminar
    for (let i = 0; i < 200; i++) {
      const url = afterId 
        ? `${apiUrl}/produtos?limit=200&after_id=${afterId}`
        : `${apiUrl}/produtos?limit=200`;

      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        console.error(`❌ Erro: ${response.status}`);
        break;
      }

      const batch = await response.json();
      
      if (!batch || batch.length === 0) {
        console.log(`   ✅ Fim dos produtos (lote ${i + 1})\n`);
        break;
      }

      // Contar status
      for (const p of batch) {
        if (p.excluido) {
          excluidosNaMercos++;
        } else if (p.ativo) {
          ativosNaMercos++;
        } else {
          inativosNaMercos++;
        }
      }

      produtos.push(...batch);
      
      // Mostrar progresso a cada 5 lotes
      if ((i + 1) % 5 === 0) {
        console.log(`   Lote ${i + 1}: ${produtos.length} produtos, ${ativosNaMercos} ativos...`);
      }

      if (batch.length < 200) {
        console.log(`   ✅ Fim dos produtos (lote ${i + 1})\n`);
        break;
      }
      
      afterId = batch[batch.length - 1].id;
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
  }

  console.log(`\n📊 NA API MERCOS (total: ${produtos.length} produtos):`);
  console.log(`   ✅ Ativos: ${ativosNaMercos}`);
  console.log(`   ❌ Inativos: ${inativosNaMercos}`);
  console.log(`   🗑️  Excluídos: ${excluidosNaMercos}`);
  console.log(`   📦 Total: ${produtos.length}\n`);

  console.log('=' .repeat(80));
  console.log('\n📊 COMPARAÇÃO:\n');
  console.log(`   BANCO:  ${ativosBanco} ativos`);
  console.log(`   MERCOS: ${ativosNaMercos} ativos\n`);

  const diferenca = ativosBanco - ativosNaMercos;

  if (diferenca > 10) {
    console.log(`⚠️  PROBLEMA: ${diferenca} produtos a mais ativos no banco!`);
    console.log('   Produtos inativos na Mercos continuam ativos no banco.\n');
  } else if (diferenca < -10) {
    console.log(`⚠️  PROBLEMA: ${Math.abs(diferenca)} produtos a menos ativos no banco!`);
    console.log('   Produtos ativos na Mercos estão inativos no banco.\n');
  } else {
    console.log('✅ Números estão sincronizados!\n');
  }

  // Buscar última sincronização
  const { data: ultimaSync } = await supabase
    .from('products')
    .select('sincronizado_em')
    .eq('distribuidor_id', brancaleone.id)
    .order('sincronizado_em', { ascending: false })
    .limit(1)
    .single();

  if (ultimaSync?.sincronizado_em) {
    const data = new Date(ultimaSync.sincronizado_em);
    const agora = new Date();
    const diff = Math.floor((agora - data) / 1000 / 60); // minutos
    console.log(`🕐 Última sincronização: ${data.toLocaleString('pt-BR')} (${diff} minutos atrás)\n`);
  }

  console.log('=' .repeat(80));
}

contarAtivos().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro:', err);
  process.exit(1);
});
