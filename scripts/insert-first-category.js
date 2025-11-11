const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://rgqlncxrzwgjreggrjcq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncWxuY3hyendnanJlZ2dyamNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzI5MywiZXhwIjoyMDc0Nzk5MjkzfQ.bdkHUKuaDQ22lZqMmFMT_3P3L0VAK11mGlJ6YkU3d6s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function insertFirstCategory() {
  try {
    console.log('🔧 Inserindo categoria que aparecerá PRIMEIRO...\n');
    
    const brancaleoneId = '1511df09-1f4a-4e68-9f8c-05cd06be6269';
    
    // 1. DELETAR CATEGORIA AAA ANTERIOR
    console.log('🗑️  Deletando categoria AAA anterior...');
    await supabase
      .from('distribuidor_categories')
      .delete()
      .eq('distribuidor_id', brancaleoneId)
      .ilike('nome', '%AAA_HOMOLOGACAO%');
    
    // 2. INSERIR CATEGORIA QUE APARECERÁ PRIMEIRO (números vêm antes de letras)
    console.log('💾 Inserindo categoria que aparecerá PRIMEIRO...');
    const firstCategory = {
      distribuidor_id: brancaleoneId,
      mercos_id: 111111,
      nome: '000000_HOMOLOGACAO_MERCOS', // Números garantem primeira posição
      categoria_pai_id: null,
      ativo: true
    };
    
    const { data: insertResult, error: insertError } = await supabase
      .from('distribuidor_categories')
      .insert(firstCategory)
      .select();
    
    if (insertError) {
      console.error('❌ Erro ao inserir:', insertError.message);
      return;
    }
    
    console.log('✅ Categoria inserida!');
    console.log(`   Nome: "${insertResult[0].nome}"`);
    
    // 3. TESTAR ORDENAÇÃO IMEDIATAMENTE
    console.log('\n📡 Testando ordenação...');
    const { data: testOrder } = await supabase
      .from('distribuidor_categories')
      .select('nome')
      .eq('distribuidor_id', brancaleoneId)
      .order('nome', { ascending: true })
      .limit(5);
    
    console.log('Primeiras 5 categorias:');
    testOrder?.forEach((cat, index) => {
      const highlight = cat.nome.includes('000000_HOMOLOGACAO') ? ' ⭐ PRIMEIRA!' : '';
      console.log(`   ${index + 1}. "${cat.nome}"${highlight}`);
    });
    
    // 4. VERIFICAR SE ESTÁ REALMENTE PRIMEIRO
    if (testOrder && testOrder[0] && testOrder[0].nome.includes('000000_HOMOLOGACAO')) {
      console.log('\n🎉 SUCESSO! Categoria está na PRIMEIRA posição!');
      console.log('\n🎯 AGORA:');
      console.log('1. Recarregue a página com Ctrl+F5');
      console.log('2. A categoria "000000_HOMOLOGACAO_MERCOS" deve aparecer na primeira linha');
      console.log('3. Use esta categoria para a homologação Mercos');
    } else {
      console.log('\n❌ Ainda não está na primeira posição');
    }

  } catch (err) {
    console.error('❌ Erro geral:', err.message);
  }
}

// Executar
insertFirstCategory();
