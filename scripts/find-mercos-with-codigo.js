// Script para encontrar produtos na Mercos que TÊM código preenchido
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function findProdutosComCodigo() {
  console.log('🔍 Buscando produtos na Mercos com código preenchido...\n');
  
  const { data: distribuidor } = await supabase
    .from('distribuidores')
    .select('*')
    .eq('nome', 'Brancaleone Publicações')
    .single();

  if (!distribuidor) {
    console.log('❌ Distribuidor não encontrado');
    return;
  }

  // Buscar 100 produtos para analisar
  const url = `${distribuidor.base_url}/produtos?limite=100`;
  
  console.log('📡 Buscando 100 produtos da Mercos...\n');

  try {
    const response = await fetch(url, {
      headers: {
        'ApplicationToken': distribuidor.application_token,
        'CompanyToken': distribuidor.company_token,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.log(`❌ Erro: ${response.status} ${response.statusText}`);
      return;
    }

    const produtos = await response.json();
    
    console.log(`✅ ${produtos.length} produtos recebidos\n`);
    
    // Filtrar produtos COM código
    const comCodigo = produtos.filter(p => p.codigo && p.codigo.trim() !== '');
    const semCodigo = produtos.filter(p => !p.codigo || p.codigo.trim() === '');
    
    console.log('📊 ESTATÍSTICAS:');
    console.log(`   Total: ${produtos.length}`);
    console.log(`   COM código: ${comCodigo.length} (${((comCodigo.length/produtos.length)*100).toFixed(1)}%)`);
    console.log(`   SEM código: ${semCodigo.length} (${((semCodigo.length/produtos.length)*100).toFixed(1)}%)`);
    console.log('');
    
    if (comCodigo.length > 0) {
      console.log('✅ PRODUTOS COM CÓDIGO:');
      comCodigo.slice(0, 10).forEach(p => {
        console.log(`   ${p.codigo} - ${p.nome.substring(0, 50)}`);
      });
      console.log('');
      console.log('💡 SOLUÇÃO:');
      console.log('   Preencha o campo "codigo" na Mercos para TODOS os produtos.');
      console.log('   Depois execute a sincronização completa.');
    } else {
      console.log('❌ NENHUM produto tem código preenchido na Mercos!');
      console.log('');
      console.log('💡 SOLUÇÕES ALTERNATIVAS:');
      console.log('   1. Preencher o campo "codigo" na Mercos (RECOMENDADO)');
      console.log('   2. Usar mercos_id no nome do arquivo (ex: 179565812.jpg)');
      console.log('   3. Criar mapeamento manual código → mercos_id');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

findProdutosComCodigo().catch(console.error);
