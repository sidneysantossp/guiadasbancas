// Script para testar quais campos a API da Mercos retorna
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testMercosFields() {
  console.log('🔍 Buscando distribuidor Brancaleone...\n');
  
  const { data: distribuidor } = await supabase
    .from('distribuidores')
    .select('*')
    .eq('nome', 'Brancaleone Publicações')
    .single();

  if (!distribuidor) {
    console.log('❌ Distribuidor não encontrado');
    return;
  }

  console.log('✅ Distribuidor encontrado');
  console.log(`   Nome: ${distribuidor.nome}`);
  console.log(`   Base URL: ${distribuidor.base_url}`);
  console.log('');

  // Fazer requisição para a API da Mercos
  const url = `${distribuidor.base_url}/produtos?limite=1`;
  
  console.log('📡 Fazendo requisição para Mercos...');
  console.log(`   URL: ${url}\n`);

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
      const text = await response.text();
      console.log(text);
      return;
    }

    const data = await response.json();
    
    if (data && data.length > 0) {
      const produto = data[0];
      
      console.log('✅ Produto recebido da Mercos:\n');
      console.log('📋 CAMPOS DISPONÍVEIS:');
      console.log(JSON.stringify(produto, null, 2));
      console.log('');
      
      console.log('🔑 CAMPOS PRINCIPAIS:');
      console.log(`   id: ${produto.id}`);
      console.log(`   nome: ${produto.nome}`);
      console.log(`   codigo: ${produto.codigo || '(não disponível)'}`);
      console.log(`   referencia: ${produto.referencia || '(não disponível)'}`);
      console.log(`   sku: ${produto.sku || '(não disponível)'}`);
      console.log(`   codigo_barras: ${produto.codigo_barras || '(não disponível)'}`);
      console.log(`   preco_tabela: ${produto.preco_tabela}`);
      console.log(`   saldo_estoque: ${produto.saldo_estoque}`);
      console.log(`   ativo: ${produto.ativo}`);
      console.log('');
      
      if (produto.codigo) {
        console.log('✅ CAMPO "codigo" DISPONÍVEL!');
        console.log('   Este é o campo que deve ser usado para vincular imagens.');
      } else if (produto.referencia) {
        console.log('✅ CAMPO "referencia" DISPONÍVEL!');
        console.log('   Este campo pode ser usado para vincular imagens.');
      } else {
        console.log('⚠️  Nenhum campo de código encontrado.');
        console.log('   Apenas o mercos_id pode ser usado.');
      }
      
    } else {
      console.log('❌ Nenhum produto retornado');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testMercosFields().catch(console.error);
