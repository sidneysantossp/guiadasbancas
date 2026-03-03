const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function limparCategoriasOrfas() {
  try {
    console.log('🧹 Limpando categorias órfãs...\n');

    // IDs Mercos das categorias órfãs que precisam ser removidas
    const categoriasOrfas = [-586031, -586002, 2480579];

    for (const mercosId of categoriasOrfas) {
      // 1. Buscar a categoria
      const { data: categoria } = await supabase
        .from('categories')
        .select('id, name, mercos_id')
        .eq('mercos_id', mercosId)
        .single();

      if (!categoria) {
        console.log(`⚠️  Categoria ${mercosId} não encontrada\n`);
        continue;
      }

      console.log(`📋 Processando: ${categoria.name} (Mercos ID: ${mercosId})`);

      // 2. Remover parent_category_id de categorias que apontam para esta
      const { data: filhas } = await supabase
        .from('categories')
        .select('id, name')
        .eq('parent_category_id', categoria.id);

      if (filhas && filhas.length > 0) {
        console.log(`   🔗 ${filhas.length} categoria(s) filha(s) encontrada(s)`);
        
        for (const filha of filhas) {
          const { error: updateError } = await supabase
            .from('categories')
            .update({ parent_category_id: null })
            .eq('id', filha.id);

          if (updateError) {
            console.error(`   ❌ Erro ao remover parent de "${filha.name}":`, updateError.message);
          } else {
            console.log(`   ✅ Removido parent de: ${filha.name}`);
          }
        }
      }

      // 3. Remover a categoria órfã
      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoria.id);

      if (deleteError) {
        console.error(`   ❌ Erro ao remover categoria:`, deleteError.message);
      } else {
        console.log(`   ✅ Categoria removida: ${categoria.name}\n`);
      }
    }

    // 4. Verificar resultado final
    console.log('═'.repeat(60));
    console.log('📊 RESULTADO FINAL');
    console.log('═'.repeat(60));

    const { data: categoriasFinais } = await supabase
      .from('categories')
      .select('id, name, mercos_id, active, visible')
      .not('mercos_id', 'is', null)
      .order('name');

    if (categoriasFinais) {
      console.log(`\n✅ Total de categorias: ${categoriasFinais.length}`);
      console.log(`✅ Ativas: ${categoriasFinais.filter(c => c.active).length}`);
      console.log(`✅ Visíveis: ${categoriasFinais.filter(c => c.visible).length}\n`);

      console.log('Categorias finais (apenas Brancaleone):');
      console.log('─'.repeat(60));
      categoriasFinais.forEach((cat, idx) => {
        const status = cat.active ? '✅' : '❌';
        const visibility = cat.visible ? '👁️' : '🚫';
        console.log(`${idx + 1}. ${status} ${visibility} ${cat.name} (Mercos ID: ${cat.mercos_id})`);
      });
    }

    console.log('\n✅ Limpeza concluída!\n');

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

limparCategoriasOrfas();
