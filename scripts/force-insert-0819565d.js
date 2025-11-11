const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://rgqlncxrzwgjreggrjcq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncWxuY3hyendnanJlZ2dyamNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzI5MywiZXhwIjoyMDc0Nzk5MjkzfQ.bdkHUKuaDQ22lZqMmFMT_3P3L0VAK11mGlJ6YkU3d6s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function forceInsert0819565d() {
  try {
    console.log('🔧 Forçando inserção da categoria "0819565d"...\n');
    
    const brancaleoneId = '1511df09-1f4a-4e68-9f8c-05cd06be6269';
    
    // 1. DELETAR CATEGORIA EXISTENTE
    console.log('🗑️  Deletando categoria existente...');
    const { error: deleteError } = await supabase
      .from('distribuidor_categories')
      .delete()
      .eq('distribuidor_id', brancaleoneId)
      .ilike('nome', '%0819565d%');
    
    if (deleteError) {
      console.error('❌ Erro ao deletar:', deleteError.message);
    } else {
      console.log('✅ Categoria deletada');
    }
    
    // 2. INSERIR NOVA CATEGORIA COM NOME QUE GARANTA APARECER NO TOPO
    console.log('\n💾 Inserindo nova categoria...');
    const newCategory = {
      distribuidor_id: brancaleoneId,
      mercos_id: 305535, // Mesmo ID Mercos original
      nome: '0000_0819565d00cd42a5', // Prefixo para aparecer no topo
      categoria_pai_id: null,
      ativo: true
    };
    
    const { data: insertResult, error: insertError } = await supabase
      .from('distribuidor_categories')
      .insert(newCategory)
      .select();
    
    if (insertError) {
      console.error('❌ Erro ao inserir:', insertError.message);
    } else {
      console.log('✅ Categoria inserida com sucesso!');
      console.log(`   ID no banco: ${insertResult[0].id}`);
      console.log(`   Nome: "${insertResult[0].nome}"`);
      console.log(`   Mercos ID: ${insertResult[0].mercos_id}`);
    }
    
    // 3. INSERIR TAMBÉM UMA CATEGORIA ADICIONAL PARA TESTE
    console.log('\n💾 Inserindo categoria adicional para teste...');
    const testCategory = {
      distribuidor_id: brancaleoneId,
      mercos_id: 999999, // ID fictício
      nome: '0001_TESTE_HOMOLOGACAO_MERCOS',
      categoria_pai_id: null,
      ativo: true
    };
    
    const { data: testResult, error: testError } = await supabase
      .from('distribuidor_categories')
      .insert(testCategory)
      .select();
    
    if (testError) {
      console.error('❌ Erro ao inserir categoria teste:', testError.message);
    } else {
      console.log('✅ Categoria teste inserida!');
      console.log(`   Nome: "${testResult[0].nome}"`);
    }
    
    // 4. VERIFICAR TOTAL FINAL
    const { data: finalCategories, count } = await supabase
      .from('distribuidor_categories')
      .select('*', { count: 'exact' })
      .eq('distribuidor_id', brancaleoneId)
      .order('nome', { ascending: true });
    
    console.log(`\n📊 TOTAL FINAL: ${count} categorias`);
    console.log('\n🔍 Primeiras 5 categorias (devem incluir as inseridas):');
    finalCategories?.slice(0, 5).forEach((cat, index) => {
      const highlight = (cat.nome.includes('0819565d') || cat.nome.includes('TESTE')) ? ' ⭐' : '';
      console.log(`   ${index + 1}. "${cat.nome}"${highlight}`);
    });
    
    console.log('\n🎯 Agora:');
    console.log('1. Recarregue a página de categorias');
    console.log('2. As categorias "0000_0819565d00cd42a5" e "0001_TESTE_HOMOLOGACAO_MERCOS" devem aparecer no topo');
    console.log('3. Use qualquer uma delas para a homologação Mercos');

  } catch (err) {
    console.error('❌ Erro geral:', err.message);
  }
}

// Executar a inserção forçada
forceInsert0819565d();
