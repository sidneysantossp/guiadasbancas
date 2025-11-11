const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://rgqlncxrzwgjreggrjcq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncWxuY3hyendnanJlZ2dyamNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzI5MywiZXhwIjoyMDc0Nzk5MjkzfQ.bdkHUKuaDQ22lZqMmFMT_3P3L0VAK11mGlJ6YkU3d6s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkCategoriesAndDistribuidores() {
  try {
    console.log('🔍 Verificando distribuidores e categorias...\n');
    
    // 1. Buscar todos os distribuidores
    const { data: distribuidores, error: distError } = await supabase
      .from('distribuidores')
      .select('*')
      .order('nome', { ascending: true });

    if (distError) {
      console.error('❌ Erro ao buscar distribuidores:', distError.message);
      return;
    }

    console.log(`📋 Distribuidores encontrados: ${distribuidores?.length || 0}`);
    if (distribuidores && distribuidores.length > 0) {
      distribuidores.forEach((dist, index) => {
        console.log(`${index + 1}. ID: ${dist.id} | Nome: ${dist.nome}`);
      });
    }

    // 2. Buscar todas as categorias
    const { data: allCategories, error: catError } = await supabase
      .from('distribuidor_categories')
      .select('*')
      .order('nome', { ascending: true });

    if (catError) {
      console.error('❌ Erro ao buscar categorias:', catError.message);
      return;
    }

    console.log(`\n📋 Total de categorias: ${allCategories?.length || 0}`);

    if (allCategories && allCategories.length > 0) {
      // Agrupar por distribuidor_id
      const categoriasPorDistribuidor = {};
      allCategories.forEach(cat => {
        const distId = cat.distribuidor_id;
        if (!categoriasPorDistribuidor[distId]) {
          categoriasPorDistribuidor[distId] = [];
        }
        categoriasPorDistribuidor[distId].push(cat);
      });

      console.log('\n📊 Categorias por distribuidor:');
      Object.keys(categoriasPorDistribuidor).forEach(distId => {
        const count = categoriasPorDistribuidor[distId].length;
        const distribuidor = distribuidores?.find(d => d.id === distId);
        const nomeDistribuidor = distribuidor ? distribuidor.nome : 'Distribuidor não encontrado';
        console.log(`• ${distId} (${nomeDistribuidor}): ${count} categorias`);
        
        // Mostrar algumas categorias de exemplo
        categoriasPorDistribuidor[distId].slice(0, 3).forEach((cat, index) => {
          console.log(`  ${index + 1}. "${cat.nome}" (Mercos ID: ${cat.mercos_id})`);
        });
        if (categoriasPorDistribuidor[distId].length > 3) {
          console.log(`  ... e mais ${categoriasPorDistribuidor[distId].length - 3} categorias`);
        }
      });

      // Verificar se existe alguma categoria com "20057313"
      const targetCategory = allCategories.find(cat => cat.nome && cat.nome.includes('20057313'));
      if (targetCategory) {
        console.log(`\n🎯 CATEGORIA "20057313" ENCONTRADA:`);
        console.log(`   Distribuidor ID: ${targetCategory.distribuidor_id}`);
        console.log(`   Nome completo: "${targetCategory.nome}"`);
        console.log(`   Mercos ID: ${targetCategory.mercos_id}`);
      } else {
        console.log(`\n❌ Categoria "20057313" NÃO encontrada`);
      }
    }

  } catch (err) {
    console.error('❌ Erro geral:', err.message);
  }
}

// Executar a verificação
checkCategoriesAndDistribuidores();
