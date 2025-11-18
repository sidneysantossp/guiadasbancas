const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function investigarCampos() {
  console.log('\n🔍 INVESTIGANDO CAMPOS DE STATUS - BRANCALEONE\n');
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
    console.log('🔍 Buscando amostra de produtos...\n');
    
    let produtos = [];
    let afterId = null;
    
    // Buscar 10.000 produtos para análise
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
    
    // Mostrar TODOS os campos do primeiro produto não-excluído
    const primeiro = produtos.find(p => !p.excluido);
    
    console.log('📋 TODOS OS CAMPOS DO PRODUTO:\n');
    const campos = Object.keys(primeiro).sort();
    campos.forEach(campo => {
      const valor = primeiro[campo];
      const tipo = typeof valor;
      let preview = String(valor);
      if (preview.length > 60) {
        preview = preview.substring(0, 60) + '...';
      }
      console.log(`   ${campo.padEnd(30)} (${tipo.padEnd(8)}): ${preview}`);
    });
    
    console.log('\n' + '='.repeat(80) + '\n');
    
    // Analisar TODOS os campos booleanos e numéricos
    const naoExcluidos = produtos.filter(p => !p.excluido);
    
    console.log(`📊 ANÁLISE DE CAMPOS (${naoExcluidos.length} produtos não-excluídos):\n`);
    
    // Campos para analisar
    const camposParaAnalisar = [
      'ativo',
      'exibir_no_b2b',
      'st',
      'moeda',
      'multiplo',
      'peso_dimensoes_unitario',
      'precos_especificos',
    ];
    
    camposParaAnalisar.forEach(campo => {
      const valores = new Map();
      naoExcluidos.forEach(p => {
        const val = p[campo];
        const chave = String(val);
        valores.set(chave, (valores.get(chave) || 0) + 1);
      });
      
      console.log(`   Campo "${campo}":`);
      Array.from(valores.entries())
        .sort((a, b) => b[1] - a[1])
        .forEach(([val, count]) => {
          const percent = (count / naoExcluidos.length * 100).toFixed(1);
          const projecao = Math.round((count / naoExcluidos.length) * 95400);
          console.log(`      ${String(val).padEnd(20)}: ${count.toString().padStart(5)} (${percent.padStart(5)}%) → ~${projecao.toLocaleString('pt-BR')} no total`);
        });
      console.log('');
    });
    
    console.log('='.repeat(80) + '\n');
    
    // Tentar combinações que resultem em ~8062 produtos
    console.log('🎯 BUSCANDO COMBINAÇÕES QUE RESULTEM EM ~8.062 PRODUTOS:\n');
    
    const naoExcluidosCount = naoExcluidos.length;
    const projecaoTotal = Math.round((naoExcluidosCount / produtos.length) * 100000);
    
    console.log(`   Produtos não-excluídos na amostra: ${naoExcluidosCount}`);
    console.log(`   Projeção para total: ~${projecaoTotal.toLocaleString('pt-BR')}\n`);
    
    if (projecaoTotal >= 8000 && projecaoTotal <= 8100) {
      console.log(`   ✅ MATCH! Produtos não-excluídos = ~${projecaoTotal}\n`);
      console.log(`   Isso sugere que a interface mostra:`);
      console.log(`   - Total cadastrado: produtos onde excluido = false`);
      console.log(`   - Ativos: produtos onde excluido = false E algum outro campo = true`);
      console.log(`   - Inativos: o resto\n`);
    }
    
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

investigarCampos().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro:', err);
  process.exit(1);
});
