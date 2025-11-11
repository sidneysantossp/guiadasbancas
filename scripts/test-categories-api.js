const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://rgqlncxrzwgjreggrjcq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncWxuY3hyendnanJlZ2dyamNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzI5MywiZXhwIjoyMDc0Nzk5MjkzfQ.bdkHUKuaDQ22lZqMmFMT_3P3L0VAK11mGlJ6YkU3d6s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testCategoriesAPI() {
  try {
    console.log('🔍 Testando API de categorias da página...\n');
    
    const brancaleoneId = '1511df09-1f4a-4e68-9f8c-05cd06be6269';
    
    // Simular exatamente o que a página faz
    console.log('📡 Fazendo consulta igual à página...');
    const { data: categorias, error } = await supabase
      .from('distribuidor_categories')
      .select('*')
      .eq('distribuidor_id', brancaleoneId)
      .order('nome', { ascending: true });

    if (error) {
      console.error('❌ Erro na consulta:', error.message);
      return;
    }

    console.log(`✅ Total de categorias encontradas: ${categorias?.length || 0}\n`);
    
    if (categorias && categorias.length > 0) {
      console.log('📋 TODAS as categorias do Brancaleone:');
      console.log('='.repeat(80));
      
      categorias.forEach((cat, index) => {
        const highlight = cat.nome.includes('0855e8eb') ? ' ⭐ ESTA É A QUE VOCÊ PROCURA!' : '';
        console.log(`${index + 1}. "${cat.nome}" (Mercos ID: ${cat.mercos_id})${highlight}`);
      });
      
      console.log('='.repeat(80));
      
      // Procurar especificamente pela categoria
      const targetCategory = categorias.find(cat => cat.nome && cat.nome.includes('0855e8eb'));
      
      if (targetCategory) {
        console.log('\n🎯 CATEGORIA "0855e8eb" ENCONTRADA:');
        console.log('='.repeat(50));
        console.log(`   ID no banco: ${targetCategory.id}`);
        console.log(`   Mercos ID: ${targetCategory.mercos_id}`);
        console.log(`   Nome completo: "${targetCategory.nome}"`);
        console.log(`   Distribuidor ID: ${targetCategory.distribuidor_id}`);
        console.log(`   Categoria Pai: ${targetCategory.categoria_pai_id}`);
        console.log(`   Ativo: ${targetCategory.ativo}`);
        console.log(`   Criado em: ${targetCategory.created_at}`);
        console.log(`   Atualizado em: ${targetCategory.updated_at}`);
        console.log('='.repeat(50));
        
        console.log('\n✅ A categoria EXISTE no banco e DEVERIA aparecer na página!');
        console.log('\n🔧 Possíveis problemas:');
        console.log('1. Cache do navegador - tente Ctrl+F5');
        console.log('2. Página não atualizou - recarregue a página');
        console.log('3. JavaScript com erro - abra o console (F12)');
        console.log('4. Filtro ativo - verifique se há busca ativa');
        
      } else {
        console.log('\n❌ Categoria "0855e8eb" NÃO encontrada nas categorias do Brancaleone');
      }
      
    } else {
      console.log('❌ Nenhuma categoria encontrada para o distribuidor Brancaleone');
    }
    
    // Verificar também se há problemas de encoding ou caracteres especiais
    console.log('\n🔍 Verificando possíveis problemas de encoding...');
    const categoriasPorNome = await supabase
      .from('distribuidor_categories')
      .select('*')
      .eq('distribuidor_id', brancaleoneId)
      .ilike('nome', '%0855e8eb%');
    
    if (categoriasPorNome.data && categoriasPorNome.data.length > 0) {
      console.log('✅ Busca por ILIKE funcionou - categoria existe');
    } else {
      console.log('❌ Busca por ILIKE falhou - possível problema de encoding');
    }

  } catch (err) {
    console.error('❌ Erro geral:', err.message);
  }
}

// Executar o teste
testCategoriesAPI();
