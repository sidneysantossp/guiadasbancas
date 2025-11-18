const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testarEndpointImagens() {
  console.log('\n🧪 TESTANDO ENDPOINT DE IMAGENS - MERCOS\n');
  console.log('='.repeat(80) + '\n');
  
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
  
  // Buscar um produto ativo
  const { data: produtos } = await supabase
    .from('products')
    .select('id, mercos_id, name')
    .eq('distribuidor_id', dist.id)
    .eq('active', true)
    .limit(5);
  
  console.log(`📦 Produtos para teste: ${produtos.length}\n`);
  
  for (const produto of produtos) {
    console.log(`\n🔍 Testando produto:`);
    console.log(`   Nome: ${produto.name}`);
    console.log(`   Mercos ID: ${produto.mercos_id}\n`);
    
    // Testar diferentes formatos de endpoint
    const endpoints = [
      `/imagens_produto?produto_id=${produto.mercos_id}`,
      `/produtos/${produto.mercos_id}/imagens`,
      `/imagens_produto/${produto.mercos_id}`,
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`   Testando: ${endpoint}`);
        const response = await fetch(`${apiUrl}${endpoint}`, { headers });
        
        console.log(`   Status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`   ✅ SUCESSO!`);
          console.log(`   Dados: ${JSON.stringify(data).substring(0, 200)}\n`);
          
          if (Array.isArray(data) && data.length > 0) {
            console.log('='.repeat(80));
            console.log('\n🎉 ENDPOINT CORRETO ENCONTRADO!\n');
            console.log(`   URL: ${apiUrl}${endpoint}`);
            console.log(`   Imagens encontradas: ${data.length}`);
            console.log(`   Primeira imagem: ${JSON.stringify(data[0], null, 2)}\n`);
            console.log('='.repeat(80));
            return;
          }
        } else {
          const text = await response.text();
          console.log(`   ❌ Erro: ${text.substring(0, 100)}\n`);
        }
        
      } catch (error) {
        console.log(`   ❌ Exceção: ${error.message}\n`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('\n💡 CONCLUSÃO:\n');
  console.log('   Nenhum endpoint de imagens funcionou.');
  console.log('   Possíveis razões:');
  console.log('   1. A API Mercos não tem imagens cadastradas para esses produtos');
  console.log('   2. O endpoint não está disponível');
  console.log('   3. As credenciais não têm permissão para acessar imagens\n');
}

testarEndpointImagens().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro:', err);
  process.exit(1);
});
