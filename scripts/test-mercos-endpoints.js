// Script para testar endpoints da Mercos relacionados a categorias
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testMercosEndpoints() {
  console.log('🔍 Testando endpoints da Mercos...\n');
  
  const { data: distribuidor } = await supabase
    .from('distribuidores')
    .select('*')
    .eq('nome', 'Brancaleone Publicações')
    .single();

  if (!distribuidor) {
    console.log('❌ Distribuidor não encontrado');
    return;
  }

  const headers = {
    'ApplicationToken': distribuidor.application_token,
    'CompanyToken': distribuidor.company_token,
    'Content-Type': 'application/json'
  };

  // Endpoints para testar
  const endpoints = [
    '/categorias',
    '/categorias_produtos',
    '/categoria_produto',
    '/produto_categorias',
    '/grupos',
    '/linhas',
    '/familias',
    '/segmentos',
    '/tipos_produto'
  ];

  console.log('📡 Testando endpoints...\n');

  for (const endpoint of endpoints) {
    const url = `${distribuidor.base_url}${endpoint}`;
    
    try {
      const response = await fetch(url, { headers });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${endpoint}`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Dados: ${Array.isArray(data) ? `Array com ${data.length} itens` : typeof data}`);
        
        if (Array.isArray(data) && data.length > 0) {
          console.log(`   Exemplo: ${JSON.stringify(data[0])}`);
        }
        console.log('');
      } else {
        console.log(`❌ ${endpoint} - Status: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Erro: ${error.message}`);
    }
  }
  
  // Testar produto específico com mais detalhes
  console.log('\n' + '='.repeat(80));
  console.log('\n🔍 TESTANDO PRODUTO ESPECÍFICO COM PARÂMETROS...\n');
  
  const produtoUrl = `${distribuidor.base_url}/produtos?limite=1&incluir_categorias=true`;
  
  try {
    const response = await fetch(produtoUrl, { headers });
    
    if (response.ok) {
      const produtos = await response.json();
      console.log('✅ Produto com parâmetro incluir_categorias:');
      console.log(JSON.stringify(produtos[0], null, 2));
    }
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
}

testMercosEndpoints().catch(console.error);
