const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://rgqlncxrzwgjreggrjcq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncWxuY3hyendnanJlZ2dyamNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzI5MywiZXhwIjoyMDc0Nzk5MjkzfQ.bdkHUKuaDQ22lZqMmFMT_3P3L0VAK11mGlJ6YkU3d6s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugMissingCategory() {
  try {
    console.log('🔍 Debugando categoria "0819565d" ausente...\n');
    
    const brancaleoneId = '1511df09-1f4a-4e68-9f8c-05cd06be6269';
    
    // 1. VERIFICAR SE A CATEGORIA EXISTE NO BANCO
    console.log('📊 1. VERIFICANDO EXISTÊNCIA NO BANCO:');
    const { data: targetCategory } = await supabase
      .from('distribuidor_categories')
      .select('*')
      .eq('distribuidor_id', brancaleoneId)
      .ilike('nome', '%0819565d%')
      .single();
    
    if (targetCategory) {
      console.log('✅ Categoria encontrada no banco:');
      console.log(`   ID: ${targetCategory.id}`);
      console.log(`   Mercos ID: ${targetCategory.mercos_id}`);
      console.log(`   Nome: "${targetCategory.nome}"`);
      console.log(`   Ativo: ${targetCategory.ativo}`);
      console.log(`   Created: ${targetCategory.created_at}`);
      console.log(`   Updated: ${targetCategory.updated_at}`);
    } else {
      console.log('❌ Categoria NÃO encontrada no banco');
      return;
    }
    
    // 2. SIMULAR CONSULTA DA API (exatamente igual)
    console.log('\n📡 2. SIMULANDO CONSULTA DA API:');
    const { data: allCategories, error, count } = await supabase
      .from('distribuidor_categories')
      .select('*', { count: 'exact' })
      .eq('distribuidor_id', brancaleoneId)
      .order('nome', { ascending: true })
      .limit(1000);
    
    if (error) {
      console.error('❌ Erro na consulta da API:', error.message);
      return;
    }
    
    console.log(`✅ Total de categorias retornadas: ${allCategories?.length || 0} (count: ${count})`);
    
    // 3. VERIFICAR SE A CATEGORIA ESTÁ NA LISTA
    const foundInList = allCategories?.find(cat => cat.nome && cat.nome.includes('0819565d'));
    
    if (foundInList) {
      console.log('✅ Categoria ENCONTRADA na lista da API:');
      const position = allCategories?.findIndex(cat => cat.nome && cat.nome.includes('0819565d'));
      console.log(`   Posição: ${position + 1} de ${allCategories.length}`);
      console.log(`   Nome: "${foundInList.nome}"`);
    } else {
      console.log('❌ Categoria NÃO encontrada na lista da API');
      
      // Mostrar as primeiras e últimas categorias para debug
      console.log('\n🔍 Primeiras 10 categorias da lista:');
      allCategories?.slice(0, 10).forEach((cat, index) => {
        console.log(`   ${index + 1}. "${cat.nome}" (ID: ${cat.mercos_id})`);
      });
      
      console.log('\n🔍 Últimas 10 categorias da lista:');
      const lastCategories = allCategories?.slice(-10) || [];
      lastCategories.forEach((cat, index) => {
        const position = allCategories.length - 10 + index + 1;
        console.log(`   ${position}. "${cat.nome}" (ID: ${cat.mercos_id})`);
      });
    }
    
    // 4. VERIFICAR SE HÁ PROBLEMA DE ORDENAÇÃO
    console.log('\n📋 3. ANÁLISE DE ORDENAÇÃO:');
    const categoryWithTarget = allCategories?.find(cat => cat.id === targetCategory.id);
    
    if (categoryWithTarget) {
      console.log('✅ Categoria encontrada por ID na lista');
      const position = allCategories?.findIndex(cat => cat.id === targetCategory.id);
      console.log(`   Posição por ID: ${position + 1}`);
    } else {
      console.log('❌ Categoria NÃO encontrada por ID na lista');
      
      // Verificar se há problema de filtro
      console.log('\n🔍 Verificando filtros adicionais...');
      const { data: unfilteredCategories } = await supabase
        .from('distribuidor_categories')
        .select('*')
        .eq('distribuidor_id', brancaleoneId);
      
      console.log(`   Total sem ordenação: ${unfilteredCategories?.length || 0}`);
      
      const foundUnfiltered = unfilteredCategories?.find(cat => cat.nome && cat.nome.includes('0819565d'));
      if (foundUnfiltered) {
        console.log('✅ Categoria encontrada sem ordenação');
        console.log(`   Nome: "${foundUnfiltered.nome}"`);
        console.log(`   Ativo: ${foundUnfiltered.ativo}`);
      } else {
        console.log('❌ Categoria não encontrada nem sem ordenação');
      }
    }
    
    // 5. TENTAR INSERIR NOVAMENTE SE NECESSÁRIO
    if (!foundInList && targetCategory) {
      console.log('\n💾 4. TENTANDO REINSERIR A CATEGORIA:');
      
      // Deletar a categoria existente
      const { error: deleteError } = await supabase
        .from('distribuidor_categories')
        .delete()
        .eq('id', targetCategory.id);
      
      if (deleteError) {
        console.error('❌ Erro ao deletar categoria:', deleteError.message);
      } else {
        console.log('✅ Categoria deletada');
        
        // Reinserir
        const { data: insertResult, error: insertError } = await supabase
          .from('distribuidor_categories')
          .insert({
            distribuidor_id: brancaleoneId,
            mercos_id: targetCategory.mercos_id,
            nome: targetCategory.nome,
            categoria_pai_id: targetCategory.categoria_pai_id,
            ativo: targetCategory.ativo
          })
          .select();
        
        if (insertError) {
          console.error('❌ Erro ao reinserir:', insertError.message);
        } else {
          console.log('✅ Categoria reinserida com sucesso!');
          console.log(`   Novo ID: ${insertResult[0].id}`);
        }
      }
    }

  } catch (err) {
    console.error('❌ Erro geral:', err.message);
  }
}

// Executar o debug
debugMissingCategory();
