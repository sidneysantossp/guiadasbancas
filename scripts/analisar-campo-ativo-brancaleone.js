const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function analisarCampoAtivo() {
  console.log('🔍 ANÁLISE DETALHADA DO CAMPO "ativo" - BRANCALEONE\n');
  
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
    // Buscar 1000 produtos
    console.log('🔍 Buscando primeiros 5000 produtos para análise...\n');
    
    let produtos = [];
    let afterId = null;
    
    for (let i = 0; i < 25; i++) {
      const url = afterId 
        ? `${apiUrl}/produtos?limit=200&after_id=${afterId}`
        : `${apiUrl}/produtos?limit=200`;

      const response = await fetch(url, { headers });
      if (!response.ok) break;

      const batch = await response.json();
      if (!batch || batch.length === 0) break;

      produtos.push(...batch);
      
      if ((i + 1) % 5 === 0) {
        console.log(`   Coletado: ${produtos.length} produtos...`);
      }
      
      if (batch.length < 200) break;
      afterId = batch[batch.length - 1].id;
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log(`\n📊 Total coletado: ${produtos.length} produtos\n`);
    console.log('='.repeat(80));
    
    // Analisar valores únicos do campo "ativo"
    const valoresAtivo = new Map();
    
    produtos.forEach(p => {
      const valor = p.ativo;
      const chave = `${typeof valor}:${JSON.stringify(valor)}`;
      valoresAtivo.set(chave, (valoresAtivo.get(chave) || 0) + 1);
    });
    
    console.log('\n📋 VALORES ÚNICOS DO CAMPO "ativo":\n');
    
    const valoresOrdenados = Array.from(valoresAtivo.entries())
      .sort((a, b) => b[1] - a[1]);
    
    valoresOrdenados.forEach(([chave, count]) => {
      const percent = (count / produtos.length * 100).toFixed(2);
      console.log(`   ${chave.padEnd(25)}: ${count.toString().padStart(6)} (${percent}%)`);
    });
    
    console.log('\n' + '='.repeat(80));
    
    // Contar com diferentes filtros
    console.log('\n🔍 TESTANDO DIFERENTES FILTROS:\n');
    
    const naoExcluidos = produtos.filter(p => !p.excluido);
    const ativoTrue = naoExcluidos.filter(p => p.ativo === true);
    const ativoOne = naoExcluidos.filter(p => p.ativo === 1);
    const ativoString1 = naoExcluidos.filter(p => p.ativo === '1');
    const ativoTruthy = naoExcluidos.filter(p => p.ativo);
    
    console.log(`   Não excluídos:              ${naoExcluidos.length}`);
    console.log(`   └─ ativo === true:          ${ativoTrue.length}`);
    console.log(`   └─ ativo === 1:             ${ativoOne.length}`);
    console.log(`   └─ ativo === '1':           ${ativoString1.length}`);
    console.log(`   └─ ativo (truthy):          ${ativoTruthy.length}`);
    
    // Projeção para total
    const projecao = Math.round((ativoTrue.length / produtos.length) * 100000);
    const projecaoNaoExcluidos = Math.round((ativoTrue.length / naoExcluidos.length) * 95400);
    
    console.log('\n📊 PROJEÇÃO PARA O TOTAL:\n');
    console.log(`   Produtos com ativo === true nos não-excluídos:`);
    console.log(`   ${ativoTrue.length} / ${naoExcluidos.length} = ${(ativoTrue.length / naoExcluidos.length * 100).toFixed(2)}%`);
    console.log(`   Projeção: ~${projecaoNaoExcluidos} produtos ativos em 95.400 não-excluídos\n`);
    
    if (projecaoNaoExcluidos > 3300 && projecaoNaoExcluidos < 3600) {
      console.log(`🎉 BINGO! Isso dá aproximadamente ${projecaoNaoExcluidos} produtos!\n`);
      console.log(`   Diferença com interface (3.439): ${Math.abs(projecaoNaoExcluidos - 3439)} produtos\n`);
    }
    
    console.log('='.repeat(80));
    
    // Mostrar alguns exemplos de produtos ativos
    console.log('\n📋 EXEMPLOS DE PRODUTOS COM ativo === true:\n');
    
    const exemplosAtivos = naoExcluidos.filter(p => p.ativo === true).slice(0, 5);
    
    exemplosAtivos.forEach((p, i) => {
      console.log(`   ${i + 1}. ID: ${p.id} | Código: ${p.codigo || 'N/A'} | Nome: ${p.nome?.substring(0, 40) || 'N/A'}`);
      console.log(`      ativo: ${p.ativo} | excluido: ${p.excluido} | exibir_no_b2b: ${p.exibir_no_b2b}\n`);
    });

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

analisarCampoAtivo().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro:', err);
  process.exit(1);
});
