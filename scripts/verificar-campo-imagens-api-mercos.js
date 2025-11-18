const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verificarCampoImagens() {
  console.log('\n🔍 VERIFICANDO CAMPO DE IMAGENS NA API MERCOS\n');
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
    console.log('🔍 Buscando um produto da API...\n');
    
    const response = await fetch(`${apiUrl}/produtos?limit=10`, { headers });
    const produtos = await response.json();
    
    if (produtos && produtos.length > 0) {
      const produto = produtos[0];
      
      console.log('📋 TODOS OS CAMPOS DO PRODUTO:\n');
      const campos = Object.keys(produto).sort();
      campos.forEach(campo => {
        const valor = produto[campo];
        const tipo = typeof valor;
        let preview = '';
        
        if (tipo === 'object' && valor !== null) {
          if (Array.isArray(valor)) {
            preview = `Array(${valor.length}) - ${JSON.stringify(valor).substring(0, 100)}`;
          } else {
            preview = JSON.stringify(valor).substring(0, 100);
          }
        } else {
          preview = String(valor).substring(0, 100);
        }
        
        console.log(`   ${campo.padEnd(30)} (${tipo.padEnd(8)}): ${preview}`);
      });
      
      console.log('\n' + '='.repeat(80) + '\n');
      
      // Procurar campos que possam conter imagens
      console.log('🔍 CAMPOS QUE PODEM CONTER IMAGENS:\n');
      
      const camposImagem = campos.filter(campo => 
        campo.toLowerCase().includes('imag') ||
        campo.toLowerCase().includes('foto') ||
        campo.toLowerCase().includes('url') ||
        campo.toLowerCase().includes('pic')
      );
      
      if (camposImagem.length > 0) {
        camposImagem.forEach(campo => {
          const valor = produto[campo];
          console.log(`   ✅ ${campo}:`);
          console.log(`      Tipo: ${typeof valor}`);
          console.log(`      Valor: ${JSON.stringify(valor).substring(0, 200)}\n`);
        });
      } else {
        console.log('   ❌ Nenhum campo relacionado a imagens encontrado\n');
      }
      
      console.log('='.repeat(80) + '\n');
      
      console.log('📌 PRODUTO EXEMPLO:\n');
      console.log(`   ID: ${produto.id}`);
      console.log(`   Nome: ${produto.nome}`);
      console.log(`   Código: ${produto.codigo}\n`);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

verificarCampoImagens().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro:', err);
  process.exit(1);
});
