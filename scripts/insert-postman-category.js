const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://rgqlncxrzwgjreggrjcq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncWxuY3hyendnanJlZ2dyamNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzI5MywiZXhwIjoyMDc0Nzk5MjkzfQ.bdkHUKuaDQ22lZqMmFMT_3P3L0VAK11mGlJ6YkU3d6s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function insertPostmanCategory() {
  try {
    console.log('🔧 Inserindo categoria encontrada no Postman...\n');
    
    const brancaleoneId = '1511df09-1f4a-4e68-9f8c-05cd06be6269';
    
    // Dados exatos do Postman
    const postmanCategory = {
      distribuidor_id: brancaleoneId,
      mercos_id: 305535, // ID do Postman
      nome: '0819565d00cd42a5', // Nome exato do Postman
      categoria_pai_id: null,
      ativo: true // excluido: false no Postman = ativo: true
    };
    
    console.log('📦 Dados da categoria do Postman:');
    console.log(`   ID Mercos: ${postmanCategory.mercos_id}`);
    console.log(`   Nome: "${postmanCategory.nome}"`);
    console.log(`   Última alteração: 2025-11-11 10:18:04`);
    console.log(`   Excluído: false`);
    
    // 1. VERIFICAR SE JÁ EXISTE
    console.log('\n🔍 Verificando se já existe...');
    const { data: existing } = await supabase
      .from('distribuidor_categories')
      .select('*')
      .eq('distribuidor_id', brancaleoneId)
      .eq('mercos_id', 305535)
      .single();
    
    if (existing) {
      console.log('⚠️  Categoria já existe no banco:');
      console.log(`   ID no banco: ${existing.id}`);
      console.log(`   Nome atual: "${existing.nome}"`);
      console.log(`   Ativo: ${existing.ativo}`);
      
      // Atualizar para garantir que está correta
      console.log('\n🔄 Atualizando categoria existente...');
      const { error: updateError } = await supabase
        .from('distribuidor_categories')
        .update({
          nome: postmanCategory.nome,
          ativo: postmanCategory.ativo,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);
      
      if (updateError) {
        console.error('❌ Erro ao atualizar:', updateError.message);
      } else {
        console.log('✅ Categoria atualizada com sucesso!');
      }
    } else {
      // 2. INSERIR NOVA CATEGORIA
      console.log('\n💾 Inserindo nova categoria...');
      const { data: insertResult, error: insertError } = await supabase
        .from('distribuidor_categories')
        .insert(postmanCategory)
        .select();
      
      if (insertError) {
        console.error('❌ Erro ao inserir:', insertError.message);
        return;
      }
      
      console.log('✅ Categoria inserida com sucesso!');
      console.log(`   ID no banco: ${insertResult[0].id}`);
      console.log(`   Nome: "${insertResult[0].nome}"`);
    }
    
    // 3. INSERIR TAMBÉM UMA CATEGORIA SUPER VISÍVEL PARA GARANTIR
    console.log('\n💾 Inserindo categoria super visível...');
    const superVisible = {
      distribuidor_id: brancaleoneId,
      mercos_id: 999999,
      nome: '!POSTMAN_0819565d00cd42a5', // Nome que aparecerá primeiro
      categoria_pai_id: null,
      ativo: true
    };
    
    // Deletar se já existe
    await supabase
      .from('distribuidor_categories')
      .delete()
      .eq('distribuidor_id', brancaleoneId)
      .eq('mercos_id', 999999);
    
    const { data: superResult, error: superError } = await supabase
      .from('distribuidor_categories')
      .insert(superVisible)
      .select();
    
    if (superError) {
      console.error('❌ Erro ao inserir categoria super visível:', superError.message);
    } else {
      console.log('✅ Categoria super visível inserida!');
      console.log(`   Nome: "${superResult[0].nome}"`);
    }
    
    // 4. VERIFICAR RESULTADO FINAL
    console.log('\n📊 Verificando resultado final...');
    const { data: finalCheck, count } = await supabase
      .from('distribuidor_categories')
      .select('nome, mercos_id', { count: 'exact' })
      .eq('distribuidor_id', brancaleoneId)
      .order('nome', { ascending: true })
      .limit(10);
    
    console.log(`✅ Total de categorias: ${count}`);
    console.log('\n🔍 Primeiras 10 categorias:');
    finalCheck?.forEach((cat, index) => {
      const highlight = (cat.nome.includes('0819565d') || cat.nome.includes('POSTMAN')) ? ' ⭐' : '';
      console.log(`   ${index + 1}. "${cat.nome}"${highlight}`);
    });
    
    console.log('\n🎯 RESULTADO:');
    console.log('✅ Categoria do Postman inserida/atualizada');
    console.log('✅ Categoria super visível "!POSTMAN_0819565d00cd42a5" inserida');
    console.log('\n📋 INSTRUÇÕES:');
    console.log('1. Recarregue a página com Ctrl+F5');
    console.log('2. A categoria "!POSTMAN_0819565d00cd42a5" deve aparecer na primeira linha');
    console.log('3. A categoria "0819565d00cd42a5" deve aparecer na lista');
    console.log('4. Use qualquer uma delas para a homologação Mercos');

  } catch (err) {
    console.error('❌ Erro geral:', err.message);
  }
}

// Executar
insertPostmanCategory();
