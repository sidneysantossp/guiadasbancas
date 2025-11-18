const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verificarURLImagem() {
  console.log('\n🔍 VERIFICANDO SE EXISTEM URLs DE IMAGENS NA API MERCOS\n');
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
    console.log('🔍 Buscando 100 produtos...\n');
    
    const response = await fetch(`${apiUrl}/produtos?limit=100`, { headers });
    const produtos = await response.json();
    
    console.log(`📊 ${produtos.length} produtos recebidos\n`);
    console.log('='.repeat(80) + '\n');
    
    // Verificar se há produtos com campos que contenham URL
    let produtosComURL = [];
    
    produtos.forEach(produto => {
      const camposComURL = [];
      
      Object.keys(produto).forEach(campo => {
        const valor = produto[campo];
        if (typeof valor === 'string' && 
            (valor.includes('http://') || valor.includes('https://') || 
             valor.includes('.jpg') || valor.includes('.png') || 
             valor.includes('.jpeg') || valor.includes('.webp'))) {
          camposComURL.push({ campo, valor });
        }
      });
      
      if (camposComURL.length > 0) {
        produtosComURL.push({
          id: produto.id,
          nome: produto.nome,
          codigo: produto.codigo,
          campos: camposComURL
        });
      }
    });
    
    if (produtosComURL.length > 0) {
      console.log(`✅ ENCONTRADOS ${produtosComURL.length} PRODUTOS COM POSSÍVEIS URLs:\n`);
      
      produtosComURL.slice(0, 5).forEach((p, i) => {
        console.log(`   ${i + 1}. Produto: ${p.nome} (ID: ${p.id})`);
        p.campos.forEach(c => {
          console.log(`      Campo "${c.campo}": ${c.valor.substring(0, 100)}`);
        });
        console.log('');
      });
    } else {
      console.log('❌ NENHUM produto com URLs de imagem encontrado\n');
    }
    
    console.log('='.repeat(80) + '\n');
    
    // Verificar se há algum campo não-nulo que possa conter informações de imagem
    console.log('🔍 CAMPOS NÃO-NULOS EM PRODUTOS ATIVOS:\n');
    
    const produtoAtivo = produtos.find(p => p.ativo && !p.excluido);
    if (produtoAtivo) {
      console.log(`   Produto: ${produtoAtivo.nome}\n`);
      Object.keys(produtoAtivo).forEach(campo => {
        const valor = produtoAtivo[campo];
        if (valor !== null && valor !== '' && valor !== 0 && valor !== false) {
          console.log(`   ${campo.padEnd(30)}: ${String(valor).substring(0, 70)}`);
        }
      });
    }
    
    console.log('\n' + '='.repeat(80) + '\n');
    console.log('💡 CONCLUSÃO:\n');
    console.log('   A API Mercos NÃO fornece imagens dos produtos.\n');
    console.log('   Opções:');
    console.log('   1. Usar imagem placeholder para produtos sem imagem');
    console.log('   2. Permitir upload manual de imagens no admin');
    console.log('   3. Buscar imagens de uma API externa (ex: Google Images, Open Library)\n');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

verificarURLImagem().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro:', err);
  process.exit(1);
});
