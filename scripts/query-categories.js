const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://rgqlncxrzwgjreggrjcq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncWxuY3hyendnanJlZ2dyamNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzI5MywiZXhwIjoyMDc0Nzk5MjkzfQ.bdkHUKuaDQ22lZqMmFMT_3P3L0VAK11mGlJ6YkU3d6s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function queryAllCategories() {
  try {
    console.log('🔍 Buscando TODAS as categorias de distribuidores...\n');
    
    // Buscar todas as categorias
    const { data: allCategories, error } = await supabase
      .from('distribuidor_categories')
      .select('*')
      .order('nome', { ascending: true });

    if (error) {
      console.error('❌ Erro na consulta:', error.message);
      return;
    }

    if (!allCategories || allCategories.length === 0) {
      console.log('❌ Nenhuma categoria encontrada na tabela distribuidor_categories');
      return;
    }

    console.log(`📋 Total de categorias encontradas: ${allCategories.length}\n`);

    // Buscar especificamente a que começa com "20057313"
    const targetCategory = allCategories.find(cat => cat.nome && cat.nome.startsWith('20057313'));

    if (targetCategory) {
      console.log('🎯 CATEGORIA ENCONTRADA QUE COMEÇA COM "20057313":');
      console.log('='.repeat(60));
      console.log(`ID: ${targetCategory.id}`);
      console.log(`Mercos ID: ${targetCategory.mercos_id}`);
      console.log(`NOME COMPLETO: "${targetCategory.nome}"`);
      console.log(`Distribuidor ID: ${targetCategory.distribuidor_id}`);
      console.log(`Ativo: ${targetCategory.ativo}`);
      console.log(`Criado em: ${targetCategory.created_at}`);
      console.log('='.repeat(60));
      console.log(`\n✅ RESPOSTA FINAL: "${targetCategory.nome}"`);
    } else {
      console.log('❌ Nenhuma categoria encontrada que comece com "20057313"');
      
      // Mostrar todas as categorias para debug
      console.log('\n📋 Todas as categorias encontradas:');
      console.log('-'.repeat(80));
      allCategories.forEach((cat, index) => {
        console.log(`${index + 1}. "${cat.nome}" (Mercos ID: ${cat.mercos_id})`);
      });
    }

    // Buscar também categorias que contenham "20057313" em qualquer lugar
    const containsTarget = allCategories.filter(cat => cat.nome && cat.nome.includes('20057313'));
    if (containsTarget.length > 0) {
      console.log('\n🔍 Categorias que CONTÊM "20057313":');
      containsTarget.forEach((cat, index) => {
        console.log(`${index + 1}. "${cat.nome}"`);
      });
    }

  } catch (err) {
    console.error('❌ Erro geral:', err.message);
  }
}

// Executar a consulta
queryAllCategories();
