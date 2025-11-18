const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function buscarImagensProduto() {
  console.log('\n🔍 TESTANDO ENDPOINT DE IMAGENS - MERCOS\n');
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
    // Buscar um produto ativo
    console.log('🔍 Buscando produtos ativos...\n');
    
    const response = await fetch(`${apiUrl}/produtos?limit=50`, { headers });
    const produtos = await response.json();
    
    // Encontrar um produto ativo
    const produtoAtivo = produtos.find(p => p.ativo && !p.excluido);
    
    if (!produtoAtivo) {
      console.log('❌ Nenhum produto ativo encontrado\n');
      return;
    }
    
    console.log(`📦 Produto encontrado:`);
    console.log(`   ID: ${produtoAtivo.id}`);
    console.log(`   Nome: ${produtoAtivo.nome}`);
    console.log(`   Código: ${produtoAtivo.codigo}\n`);
    console.log('='.repeat(80) + '\n');
    
    // Testar diferentes endpoints de imagens
    const endpointsParaTestar = [
      `/produtos/${produtoAtivo.id}/imagens`,
      `/produtos/${produtoAtivo.id}/fotos`,
      `/produtos/${produtoAtivo.id}/images`,
      `/imagens_produtos/${produtoAtivo.id}`,
      `/produtos/${produtoAtivo.id}`,
    ];
    
    console.log('🧪 TESTANDO ENDPOINTS DE IMAGENS:\n');
    
    for (const endpoint of endpointsParaTestar) {
      try {
        console.log(`   Testando: ${endpoint}`);
        const imgResponse = await fetch(`${apiUrl}${endpoint}`, { headers });
        
        if (imgResponse.ok) {
          const data = await imgResponse.json();
          console.log(`   ✅ SUCESSO! Status: ${imgResponse.status}`);
          console.log(`   Dados: ${JSON.stringify(data).substring(0, 200)}...\n`);
          
          // Se encontrou imagens, mostrar a estrutura completa
          if (data && (Array.isArray(data) || data.imagens || data.fotos)) {
            console.log('='.repeat(80) + '\n');
            console.log('🎉 ENDPOINT DE IMAGENS ENCONTRADO!\n');
            console.log('   Estrutura completa:');
            console.log(JSON.stringify(data, null, 2).substring(0, 1000));
            console.log('\n' + '='.repeat(80));
            break;
          }
        } else {
          console.log(`   ❌ Erro: ${imgResponse.status} ${imgResponse.statusText}\n`);
        }
      } catch (error) {
        console.log(`   ❌ Erro: ${error.message}\n`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log('\n' + '='.repeat(80) + '\n');
    console.log('💡 CONCLUSÃO:\n');
    console.log('   Se nenhum endpoint retornou imagens, a API Mercos pode:');
    console.log('   1. Não fornecer imagens via API');
    console.log('   2. Requerer parâmetros específicos');
    console.log('   3. Ter as imagens em um campo não testado\n');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

buscarImagensProduto().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro:', err);
  process.exit(1);
});
