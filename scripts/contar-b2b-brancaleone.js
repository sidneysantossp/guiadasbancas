const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function contarB2B() {
  console.log('🔍 CONTAGEM DE PRODUTOS COM exibir_no_b2b - BRANCALEONE\n');
  
  const { data: brancaleone } = await supabase
    .from('distribuidores')
    .select('*')
    .ilike('nome', '%brancaleone%')
    .single();

  console.log(`📦 Distribuidor: ${brancaleone.nome}\n`);

  const apiUrl = brancaleone.base_url || 'https://app.mercos.com/api/v1';
  const headers = {
    'ApplicationToken': brancaleone.application_token,
    'CompanyToken': brancaleone.company_token,
    'Content-Type': 'application/json'
  };

  let totalBuscados = 0;
  let exibirB2B = 0;
  let exibirB2BAtivos = 0;
  let exibirB2BInativos = 0;
  let naoExibirB2B = 0;
  let excluidos = 0;
  let afterId = null;

  try {
    console.log('🔍 Analisando produtos...\n');
    
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

      for (const p of batch) {
        totalBuscados++;
        
        if (p.excluido === true || p.excluido === 1) {
          excluidos++;
        } else {
          // Produto não excluído
          if (p.exibir_no_b2b === 1 || p.exibir_no_b2b === true) {
            exibirB2B++;
            if (p.ativo === true || p.ativo === 1) {
              exibirB2BAtivos++;
            } else {
              exibirB2BInativos++;
            }
          } else {
            naoExibirB2B++;
          }
        }
      }
      
      if ((i + 1) % 20 === 0) {
        console.log(`   Lote ${i + 1}: ${totalBuscados} total, ${exibirB2B} com B2B (${exibirB2BAtivos} ativos)...`);
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

  console.log('\n' + '='.repeat(80));
  console.log('\n📊 RESULTADO FINAL:\n');
  console.log(`   📦 Produtos com exibir_no_b2b = 1 (não excluídos): ${exibirB2B}`);
  console.log(`      ├─ ✅ Ativos: ${exibirB2BAtivos}`);
  console.log(`      └─ ❌ Inativos: ${exibirB2BInativos}`);
  console.log(`   📦 Produtos com exibir_no_b2b = 0 (não excluídos): ${naoExibirB2B}`);
  console.log(`   🗑️  Excluídos: ${excluidos}`);
  console.log(`   📦 Total buscado: ${totalBuscados}\n`);

  console.log('='.repeat(80));
  console.log('\n🎯 COMPARAÇÃO COM A INTERFACE MERCOS:\n');
  console.log(`   Interface Mercos:         3.439 produtos cadastrados`);
  console.log(`   API - exibir_no_b2b = 1:  ${exibirB2B.toLocaleString('pt-BR')} produtos\n`);
  
  const diff = Math.abs(exibirB2B - 3439);
  const percentDiff = (diff / 3439 * 100).toFixed(1);
  
  if (diff === 0) {
    console.log('🎉 PERFEITO! OS NÚMEROS BATEM EXATAMENTE!\n');
  } else if (diff < 10) {
    console.log(`✅ MUITO BOM! Diferença de apenas ${diff} produtos (${percentDiff}%)\n`);
  } else if (diff < 100) {
    console.log(`✅ BOA APROXIMAÇÃO! Diferença de ${diff} produtos (${percentDiff}%)\n`);
  } else {
    console.log(`⚠️  Diferença: ${diff} produtos (${percentDiff}%)\n`);
  }

  console.log('='.repeat(80));
  console.log('\n📊 RESUMO COMPLETO:\n');
  console.log(`   Total de produtos na API: ${totalBuscados.toLocaleString('pt-BR')}`);
  console.log(`   └─ Não excluídos: ${(exibirB2B + naoExibirB2B).toLocaleString('pt-BR')}`);
  console.log(`      ├─ Exibir no B2B: ${exibirB2B.toLocaleString('pt-BR')} (${exibirB2BAtivos} ativos + ${exibirB2BInativos} inativos)`);
  console.log(`      └─ NÃO exibir no B2B: ${naoExibirB2B.toLocaleString('pt-BR')}`);
  console.log(`   └─ Excluídos: ${excluidos.toLocaleString('pt-BR')}\n`);

  console.log('='.repeat(80));

  // Conclusão
  if (diff < 10) {
    console.log('\n✅ CONCLUSÃO: A interface da Mercos mostra produtos com exibir_no_b2b = 1\n');
    console.log(`   Portanto, o Brancaleone tem ${exibirB2B} produtos ativos no catálogo B2B,`);
    console.log(`   sendo ${exibirB2BAtivos} marcados como "ativos" e ${exibirB2BInativos} como "inativos".\n`);
  }
}

contarB2B().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro:', err);
  process.exit(1);
});
