const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function investigarPaginacao() {
  console.log('\n🔍 INVESTIGAÇÃO PROFUNDA: PAGINAÇÃO API MERCOS\n');
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
    
    console.log('🧪 TESTE 1: Buscar SEM filtros\n');
    
    const response1 = await fetch(`${apiUrl}/produtos?limit=5`, { headers });
    const produtos1 = await response1.json();
    
    console.log(`   Retornou: ${produtos1.length} produtos`);
    console.log(`   Primeiro ID: ${produtos1[0]?.id}`);
    console.log(`   Último ID: ${produtos1[produtos1.length - 1]?.id}\n`);
    
    console.log('='.repeat(80) + '\n');
    console.log('🧪 TESTE 2: Buscar com id_maior_que\n');
    
    const ultimoId = produtos1[produtos1.length - 1]?.id;
    const response2 = await fetch(`${apiUrl}/produtos?limit=5&id_maior_que=${ultimoId}`, { headers });
    const produtos2 = await response2.json();
    
    console.log(`   Retornou: ${produtos2.length} produtos`);
    console.log(`   Primeiro ID: ${produtos2[0]?.id}`);
    console.log(`   Último ID: ${produtos2[produtos2.length - 1]?.id}\n`);
    
    if (produtos2[0]?.id === produtos1[0]?.id) {
      console.log('   ❌ PROBLEMA CONFIRMADO: API retornou os MESMOS produtos!\n');
    } else {
      console.log('   ✅ API avançou corretamente!\n');
    }
    
    console.log('='.repeat(80) + '\n');
    console.log('🧪 TESTE 3: Testar diferentes parâmetros de paginação\n');
    
    const testes = [
      { nome: 'after_id', url: `${apiUrl}/produtos?limit=5&after_id=${ultimoId}` },
      { nome: 'id_after', url: `${apiUrl}/produtos?limit=5&id_after=${ultimoId}` },
      { nome: 'offset', url: `${apiUrl}/produtos?limit=5&offset=5` },
      { nome: 'page', url: `${apiUrl}/produtos?limit=5&page=2` },
      { nome: 'skip', url: `${apiUrl}/produtos?limit=5&skip=5` },
    ];
    
    for (const teste of testes) {
      try {
        const resp = await fetch(teste.url, { headers });
        const prods = await resp.json();
        
        if (Array.isArray(prods) && prods.length > 0) {
          const diferente = prods[0]?.id !== produtos1[0]?.id;
          console.log(`   ${diferente ? '✅' : '❌'} ${teste.nome.padEnd(15)}: ${prods.length} produtos | ID: ${prods[0]?.id}`);
        } else {
          console.log(`   ❌ ${teste.nome.padEnd(15)}: Sem produtos ou erro`);
        }
      } catch (error) {
        console.log(`   ❌ ${teste.nome.padEnd(15)}: Erro - ${error.message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log('\n' + '='.repeat(80) + '\n');
    console.log('🧪 TESTE 4: Verificar headers de paginação\n');
    
    const response4 = await fetch(`${apiUrl}/produtos?limit=5`, { headers });
    
    console.log('   Headers relevantes:');
    response4.headers.forEach((value, key) => {
      if (key.toLowerCase().includes('page') || 
          key.toLowerCase().includes('total') || 
          key.toLowerCase().includes('limit') ||
          key.toLowerCase().includes('meuspedidos')) {
        console.log(`      ${key}: ${value}`);
      }
    });
    
    console.log('\n' + '='.repeat(80) + '\n');
    console.log('🧪 TESTE 5: Buscar por diferentes ordenações\n');
    
    const ordens = [
      { nome: 'ID ASC', url: `${apiUrl}/produtos?limit=5&order_by=id&order_direction=asc` },
      { nome: 'ID DESC', url: `${apiUrl}/produtos?limit=5&order_by=id&order_direction=desc` },
      { nome: 'Nome ASC', url: `${apiUrl}/produtos?limit=5&order_by=nome&order_direction=asc` },
    ];
    
    for (const ordem of ordens) {
      try {
        const resp = await fetch(ordem.url, { headers });
        const prods = await resp.json();
        
        if (Array.isArray(prods) && prods.length > 0) {
          console.log(`   ✅ ${ordem.nome.padEnd(15)}: ${prods.length} produtos | IDs: ${prods[0]?.id} → ${prods[prods.length-1]?.id}`);
        }
      } catch (error) {
        console.log(`   ❌ ${ordem.nome.padEnd(15)}: Erro`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log('\n' + '='.repeat(80) + '\n');
    console.log('💡 PRÓXIMOS PASSOS:\n');
    console.log('   1. Se id_maior_que NÃO funciona, tentar outro método');
    console.log('   2. Verificar se há limite de produtos na API');
    console.log('   3. Contatar suporte Mercos sobre o bug de paginação\n');
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('💥 Erro:', error.message);
  }
}

investigarPaginacao().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro fatal:', err);
  process.exit(1);
});
