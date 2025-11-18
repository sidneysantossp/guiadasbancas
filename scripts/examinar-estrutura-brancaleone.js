const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function examinarEstrutura() {
  console.log('🔍 EXAMINANDO ESTRUTURA COMPLETA DOS PRODUTOS\n');
  
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
    // Buscar apenas 3 produtos
    const response = await fetch(`${apiUrl}/produtos?limit=3`, { headers });
    const produtos = await response.json();
    
    console.log('📋 CAMPOS DISPONÍVEIS NO PRIMEIRO PRODUTO:\n');
    const produto = produtos[0];
    
    // Listar TODOS os campos
    const campos = Object.keys(produto).sort();
    campos.forEach(campo => {
      const valor = produto[campo];
      const tipo = typeof valor;
      const preview = tipo === 'object' && valor !== null 
        ? JSON.stringify(valor).substring(0, 50) + '...'
        : String(valor).substring(0, 50);
      
      console.log(`   ${campo.padEnd(30)} (${tipo.padEnd(8)}): ${preview}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('\n🔍 ANALISANDO CAMPOS BOOLEANOS E DE STATUS:\n');
    
    // Buscar 1000 produtos para análise estatística
    let produtos1000 = [];
    let afterId = null;
    
    for (let i = 0; i < 5; i++) {
      const url = afterId 
        ? `${apiUrl}/produtos?limit=200&after_id=${afterId}`
        : `${apiUrl}/produtos?limit=200`;
      
      const resp = await fetch(url, { headers });
      const batch = await resp.json();
      
      produtos1000.push(...batch);
      if (batch.length < 200) break;
      afterId = batch[batch.length - 1].id;
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log(`   Analisando ${produtos1000.length} produtos...\n`);
    
    // Estatísticas de campos booleanos
    const stats = {
      ativo_true: 0,
      excluido_true: 0,
      disponivel_ecommerce: 0,
      visivel: 0,
      publicado: 0,
    };
    
    produtos1000.forEach(p => {
      if (p.ativo === true || p.ativo === 1) stats.ativo_true++;
      if (p.excluido === true || p.excluido === 1) stats.excluido_true++;
      if (p.disponivel_ecommerce === true || p.disponivel_ecommerce === 1) stats.disponivel_ecommerce++;
      if (p.visivel === true || p.visivel === 1) stats.visivel++;
      if (p.publicado === true || p.publicado === 1) stats.publicado++;
    });
    
    console.log(`   ativo = true:              ${stats.ativo_true} (${(stats.ativo_true / produtos1000.length * 100).toFixed(1)}%)`);
    console.log(`   excluido = true:           ${stats.excluido_true} (${(stats.excluido_true / produtos1000.length * 100).toFixed(1)}%)`);
    console.log(`   disponivel_ecommerce = true: ${stats.disponivel_ecommerce} (${(stats.disponivel_ecommerce / produtos1000.length * 100).toFixed(1)}%)`);
    console.log(`   visivel = true:            ${stats.visivel} (${(stats.visivel / produtos1000.length * 100).toFixed(1)}%)`);
    console.log(`   publicado = true:          ${stats.publicado} (${(stats.publicado / produtos1000.length * 100).toFixed(1)}%)`);
    
    console.log('\n' + '='.repeat(80));
    console.log('\n💡 TENTANDO ENCONTRAR OS 3.439 PRODUTOS:\n');
    
    // Testar várias combinações
    const combos = [
      { nome: 'ativo + não excluído', count: produtos1000.filter(p => !p.excluido && p.ativo).length },
      { nome: 'disponivel_ecommerce', count: produtos1000.filter(p => p.disponivel_ecommerce).length },
      { nome: 'visivel', count: produtos1000.filter(p => p.visivel).length },
      { nome: 'publicado', count: produtos1000.filter(p => p.publicado).length },
      { nome: 'não excluído', count: produtos1000.filter(p => !p.excluido).length },
    ];
    
    combos.forEach(c => {
      const projecao = Math.round(c.count / produtos1000.length * 100000);
      const diff = Math.abs(projecao - 3439);
      const match = diff < 500 ? ' ✅ POSSÍVEL MATCH!' : '';
      console.log(`   ${c.nome.padEnd(30)}: ${c.count.toString().padStart(4)}/${produtos1000.length} → ~${projecao.toString().padStart(6)} total${match}`);
    });

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

examinarEstrutura().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro:', err);
  process.exit(1);
});
