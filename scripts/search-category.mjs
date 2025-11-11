import { createClient } from '@supabase/supabase-js';

async function searchCategory() {
  // Usando as credenciais do projeto (substitua se necessário)
  const supabaseUrl = 'https://eyhgqmcfqxpqvgmjgqpz.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5aGdxbWNmcXhwcXZnbWpncXB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3MDMxOTQsImV4cCI6MjA0NTI3OTE5NH0.lJNm_7VbVKJ7R5ykjXKGOJmBQVJQYQJQYQJQYQJQYQJQ';
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('🔍 Buscando categoria que começa com "20057313"...');
    
    // Buscar na tabela distribuidor_categories
    const { data, error } = await supabase
      .from('distribuidor_categories')
      .select('*')
      .ilike('nome', '20057313%');
    
    if (error) {
      console.error('❌ Erro:', error.message);
      return;
    }
    
    if (!data || data.length === 0) {
      console.log('❌ Nenhuma categoria encontrada com esse prefixo');
      
      // Tentar buscar todas as categorias para debug
      console.log('\n🔍 Buscando todas as categorias para debug...');
      const { data: allData, error: allError } = await supabase
        .from('distribuidor_categories')
        .select('nome')
        .limit(10);
        
      if (allData) {
        console.log('📋 Primeiras 10 categorias encontradas:');
        allData.forEach((cat, i) => {
          console.log(`${i + 1}. "${cat.nome}"`);
        });
      }
      return;
    }
    
    console.log(`✅ Encontrada(s) ${data.length} categoria(s):`);
    
    data.forEach((categoria, index) => {
      console.log(`\n📋 Categoria ${index + 1}:`);
      console.log(`   Nome completo: "${categoria.nome}"`);
      console.log(`   Mercos ID: ${categoria.mercos_id}`);
      console.log(`   Distribuidor ID: ${categoria.distribuidor_id}`);
      console.log(`   Ativo: ${categoria.ativo}`);
    });
    
    if (data.length > 0) {
      console.log(`\n🎯 RESPOSTA FINAL:`);
      console.log(`O valor completo do campo nome que se inicia com "20057313" é:`);
      console.log(`"${data[0].nome}"`);
    }
    
  } catch (err) {
    console.error('❌ Erro geral:', err.message);
  }
}

searchCategory();
