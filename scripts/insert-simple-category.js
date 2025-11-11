const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://rgqlncxrzwgjreggrjcq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncWxuY3hyendnanJlZ2dyamNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzI5MywiZXhwIjoyMDc0Nzk5MjkzfQ.bdkHUKuaDQ22lZqMmFMT_3P3L0VAK11mGlJ6YkU3d6s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function insertSimpleCategory() {
  try {
    console.log('🔧 Inserindo categoria SUPER SIMPLES para homologação...\n');
    
    const brancaleoneId = '1511df09-1f4a-4e68-9f8c-05cd06be6269';
    
    // 1. DELETAR TODAS AS CATEGORIAS DE TESTE ANTERIORES
    console.log('🗑️  Limpando categorias de teste anteriores...');
    await supabase
      .from('distribuidor_categories')
      .delete()
      .eq('distribuidor_id', brancaleoneId)
      .or('nome.like.%0000_%,nome.like.%0001_%,nome.like.%TESTE%');
    
    // 2. INSERIR CATEGORIA SUPER SIMPLES
    console.log('💾 Inserindo categoria SUPER SIMPLES...');
    const simpleCategory = {
      distribuidor_id: brancaleoneId,
      mercos_id: 111111, // ID simples
      nome: 'AAA_HOMOLOGACAO_MERCOS', // Nome que aparecerá PRIMEIRO
      categoria_pai_id: null,
      ativo: true
    };
    
    const { data: insertResult, error: insertError } = await supabase
      .from('distribuidor_categories')
      .insert(simpleCategory)
      .select();
    
    if (insertError) {
      console.error('❌ Erro ao inserir:', insertError.message);
      return;
    }
    
    console.log('✅ Categoria SUPER SIMPLES inserida!');
    console.log(`   ID no banco: ${insertResult[0].id}`);
    console.log(`   Nome: "${insertResult[0].nome}"`);
    console.log(`   Mercos ID: ${insertResult[0].mercos_id}`);
    
    // 3. VERIFICAR SE APARECE NA CONSULTA DA API
    console.log('\n📡 Testando consulta da API...');
    const { data: apiTest, count } = await supabase
      .from('distribuidor_categories')
      .select('*', { count: 'exact' })
      .eq('distribuidor_id', brancaleoneId)
      .order('nome', { ascending: true })
      .limit(10); // Apenas as primeiras 10
    
    console.log(`✅ API retorna ${apiTest?.length} categorias (total: ${count})`);
    console.log('\n🔍 Primeiras 10 categorias:');
    apiTest?.forEach((cat, index) => {
      const highlight = cat.nome.includes('AAA_HOMOLOGACAO') ? ' ⭐ ESTA É A CATEGORIA!' : '';
      console.log(`   ${index + 1}. "${cat.nome}"${highlight}`);
    });
    
    // 4. VERIFICAR SE A CATEGORIA ESPECÍFICA EXISTE
    const foundCategory = apiTest?.find(cat => cat.nome.includes('AAA_HOMOLOGACAO'));
    
    if (foundCategory) {
      console.log('\n🎯 SUCESSO! Categoria encontrada na posição 1');
      console.log('✅ Esta categoria DEVE aparecer na página');
    } else {
      console.log('\n❌ PROBLEMA: Categoria não encontrada na consulta da API');
    }
    
    console.log('\n🎯 INSTRUÇÕES:');
    console.log('1. Recarregue a página de categorias com Ctrl+F5');
    console.log('2. Vá para a PRIMEIRA página (clique no "1")');
    console.log('3. A categoria "AAA_HOMOLOGACAO_MERCOS" DEVE estar na primeira linha');
    console.log('4. Use esta categoria para a homologação Mercos');
    console.log('5. Se ainda não aparecer, há um problema de cache no navegador');

  } catch (err) {
    console.error('❌ Erro geral:', err.message);
  }
}

// Executar a inserção
insertSimpleCategory();
