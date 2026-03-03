const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function ajustarCategoriasBrancaleone() {
  try {
    console.log('🔧 Ajustando categorias para manter apenas as da Brancaleone...\n');

    // IDs Mercos das categorias da Brancaleone (15 categorias)
    const brancaleoneMercosIds = [
      -991000, // Colecionável (pai principal)
      -991001, // Panini (filho de Colecionável)
      -991002, // Panini Collections (filho de Colecionável)
      -991003, // Panini Comics (filho de Panini)
      3599981, // Colecionáveis (filho de Panini)
      3584480, // Conan
      3584473, // DC Comics (filho de Panini)
      3584474, // Disney Comics (filho de Panini)
      3584478, // Independentes
      3584481, // Planet Manga (filho de Panini)
      3584475, // Marvel Comics (filho de Panini)
      3584477, // Panini Books (filho de Panini)
      3584479, // Panini Magazines (filho de Panini)
      4362338, // Panini Partwork (filho de Panini)
      3584476, // Maurício de Sousa Produções (filho de Panini)
    ];

    console.log(`📋 Mantendo ${brancaleoneMercosIds.length} categorias da Brancaleone\n`);

    // 1. Buscar todas as categorias atuais
    const { data: todasCategorias, error: fetchError } = await supabase
      .from('categories')
      .select('id, name, mercos_id, active, visible')
      .not('mercos_id', 'is', null);

    if (fetchError) {
      console.error('❌ Erro ao buscar categorias:', fetchError);
      return;
    }

    console.log(`📊 Total de categorias com mercos_id: ${todasCategorias?.length || 0}\n`);

    // 2. Separar categorias para manter e remover
    const categoriasParaManter = todasCategorias?.filter(cat => 
      brancaleoneMercosIds.includes(cat.mercos_id)
    ) || [];

    const categoriasParaRemover = todasCategorias?.filter(cat => 
      !brancaleoneMercosIds.includes(cat.mercos_id)
    ) || [];

    console.log(`✅ Categorias para manter: ${categoriasParaManter.length}`);
    console.log(`❌ Categorias para remover: ${categoriasParaRemover.length}\n`);

    // 3. Remover categorias antigas
    if (categoriasParaRemover.length > 0) {
      console.log('🗑️  Removendo categorias antigas...\n');
      
      for (const cat of categoriasParaRemover) {
        const { error: deleteError } = await supabase
          .from('categories')
          .delete()
          .eq('id', cat.id);

        if (deleteError) {
          console.error(`   ❌ Erro ao remover "${cat.name}":`, deleteError.message);
        } else {
          console.log(`   ✅ Removida: ${cat.name} (Mercos ID: ${cat.mercos_id})`);
        }
      }
    }

    // 4. Ativar e tornar visíveis as categorias da Brancaleone
    console.log('\n🔄 Ativando categorias da Brancaleone...\n');
    
    for (const cat of categoriasParaManter) {
      const { error: updateError } = await supabase
        .from('categories')
        .update({
          active: true,
          visible: true
        })
        .eq('id', cat.id);

      if (updateError) {
        console.error(`   ❌ Erro ao ativar "${cat.name}":`, updateError.message);
      } else {
        console.log(`   ✅ Ativada: ${cat.name} (Mercos ID: ${cat.mercos_id})`);
      }
    }

    // 5. Verificar resultado final
    console.log('\n' + '═'.repeat(60));
    console.log('📊 RESULTADO FINAL');
    console.log('═'.repeat(60));

    const { data: categoriasFinais, error: finalError } = await supabase
      .from('categories')
      .select('id, name, mercos_id, active, visible, parent_category_id')
      .not('mercos_id', 'is', null)
      .order('name');

    if (!finalError && categoriasFinais) {
      console.log(`\n✅ Total de categorias: ${categoriasFinais.length}`);
      console.log(`✅ Ativas: ${categoriasFinais.filter(c => c.active).length}`);
      console.log(`✅ Visíveis: ${categoriasFinais.filter(c => c.visible).length}\n`);

      console.log('Categorias finais:');
      console.log('─'.repeat(60));
      categoriasFinais.forEach((cat, idx) => {
        const status = cat.active ? '✅' : '❌';
        const visibility = cat.visible ? '👁️' : '🚫';
        console.log(`${idx + 1}. ${status} ${visibility} ${cat.name} (Mercos ID: ${cat.mercos_id})`);
      });
    }

    console.log('\n✅ Ajuste concluído!\n');

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

ajustarCategoriasBrancaleone();
