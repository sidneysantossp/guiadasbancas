// Script para verificar se a Mercos retorna categorias
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkMercosCategories() {
  console.log('🔍 Verificando categorias na API da Mercos...\n');
  
  const { data: distribuidor } = await supabase
    .from('distribuidores')
    .select('*')
    .eq('nome', 'Brancaleone Publicações')
    .single();

  if (!distribuidor) {
    console.log('❌ Distribuidor não encontrado');
    return;
  }

  // Buscar 10 produtos para analisar
  const url = `${distribuidor.base_url}/produtos?limite=10`;
  
  console.log('📡 Buscando produtos da Mercos...\n');

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
    
    if (produtos && produtos.length > 0) {
      console.log(`✅ ${produtos.length} produtos recebidos\n`);
      
      // Mostrar TODOS os campos do primeiro produto
      console.log('📋 TODOS OS CAMPOS DO PRIMEIRO PRODUTO:\n');
      console.log(JSON.stringify(produtos[0], null, 2));
      console.log('\n' + '='.repeat(80) + '\n');
      
      // Verificar campos relacionados a categoria
      const produto = produtos[0];
      console.log('🔍 CAMPOS RELACIONADOS A CATEGORIA:\n');
      
      const camposCategoria = [
        'categoria',
        'categoria_id',
        'categoria_nome',
        'category',
        'category_id',
        'category_name',
        'grupo',
        'grupo_id',
        'tipo',
        'tipo_produto',
        'classificacao',
        'segmento',
        'linha',
        'familia'
      ];
      
      let encontrouCategoria = false;
      
      camposCategoria.forEach(campo => {
        if (produto.hasOwnProperty(campo)) {
          console.log(`   ✅ ${campo}: ${JSON.stringify(produto[campo])}`);
          encontrouCategoria = true;
        }
      });
      
      if (!encontrouCategoria) {
        console.log('   ❌ Nenhum campo de categoria encontrado nos campos conhecidos.');
        console.log('\n   📝 Campos disponíveis no produto:');
        Object.keys(produto).forEach(key => {
          console.log(`      - ${key}: ${typeof produto[key]}`);
        });
      }
      
      console.log('\n' + '='.repeat(80) + '\n');
      
      // Verificar se há endpoint de categorias
      console.log('🔍 TESTANDO ENDPOINT DE CATEGORIAS...\n');
      
      const categoriasUrl = `${distribuidor.base_url}/categorias`;
      const catResponse = await fetch(categoriasUrl, {
        headers: {
          'ApplicationToken': distribuidor.application_token,
          'CompanyToken': distribuidor.company_token,
          'Content-Type': 'application/json'
        }
      });
      
      if (catResponse.ok) {
        const categorias = await catResponse.json();
        console.log(`✅ Endpoint /categorias EXISTE!`);
        console.log(`   Total de categorias: ${categorias.length || 'N/A'}\n`);
        
        if (categorias && categorias.length > 0) {
          console.log('📋 PRIMEIRAS 5 CATEGORIAS:\n');
          categorias.slice(0, 5).forEach(cat => {
            console.log(`   ${JSON.stringify(cat)}`);
          });
        }
      } else {
        console.log(`❌ Endpoint /categorias não existe ou retornou erro: ${catResponse.status}`);
      }
      
    } else {
      console.log('❌ Nenhum produto retornado');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

checkMercosCategories().catch(console.error);
