const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listarCategoriasBrancaleone() {
  try {
    console.log('🔍 Buscando distribuidor Brancaleone...\n');
    
    // Buscar distribuidor Brancaleone
    const { data: distribuidores, error: distError } = await supabase
      .from('distribuidores')
      .select('id, nome')
      .ilike('nome', '%brancaleone%');

    if (distError) {
      console.error('❌ Erro ao buscar distribuidor:', distError);
      return;
    }

    if (!distribuidores || distribuidores.length === 0) {
      console.log('❌ Distribuidor Brancaleone não encontrado');
      return;
    }

    const distribuidor = distribuidores[0];
    console.log(`✅ Distribuidor encontrado: ${distribuidor.nome}`);
    console.log(`   ID: ${distribuidor.id}\n`);

    // Buscar categorias do distribuidor na tabela distribuidor_categories
    console.log('📋 Buscando categorias em distribuidor_categories...\n');
    const { data: distCategorias, error: distCatError } = await supabase
      .from('distribuidor_categories')
      .select('id, mercos_id, nome, categoria_pai_id, ativo, created_at')
      .eq('distribuidor_id', distribuidor.id)
      .order('nome', { ascending: true });

    if (distCatError) {
      console.error('❌ Erro ao buscar categorias do distribuidor:', distCatError);
    } else {
      console.log(`📊 Total de categorias em distribuidor_categories: ${distCategorias?.length || 0}\n`);
      
      if (distCategorias && distCategorias.length > 0) {
        console.log('Categorias (distribuidor_categories):');
        console.log('─'.repeat(100));
        distCategorias.slice(0, 20).forEach((cat, idx) => {
          console.log(`${idx + 1}. ${cat.nome}`);
          console.log(`   Mercos ID: ${cat.mercos_id || 'N/A'}`);
          console.log(`   Ativo: ${cat.ativo ? '✅' : '❌'}`);
          console.log(`   Categoria Pai: ${cat.categoria_pai_id || 'Nenhuma'}`);
          console.log('');
        });
        
        if (distCategorias.length > 20) {
          console.log(`... e mais ${distCategorias.length - 20} categorias\n`);
        }
      }
    }

    // Buscar categorias na tabela global categories (com mercos_id)
    console.log('\n📋 Buscando categorias na tabela global (categories)...\n');
    const { data: globalCategorias, error: globalError } = await supabase
      .from('categories')
      .select('id, name, mercos_id, parent_category_id, active, visible, ultima_sincronizacao')
      .not('mercos_id', 'is', null)
      .order('name', { ascending: true });

    if (globalError) {
      console.error('❌ Erro ao buscar categorias globais:', globalError);
    } else {
      console.log(`📊 Total de categorias sincronizadas (com mercos_id): ${globalCategorias?.length || 0}\n`);
      
      if (globalCategorias && globalCategorias.length > 0) {
        console.log('Categorias Sincronizadas (categories):');
        console.log('─'.repeat(100));
        globalCategorias.slice(0, 20).forEach((cat, idx) => {
          console.log(`${idx + 1}. ${cat.name}`);
          console.log(`   Mercos ID: ${cat.mercos_id}`);
          console.log(`   Ativo: ${cat.active ? '✅' : '❌'}`);
          console.log(`   Visível: ${cat.visible ? '✅' : '❌'}`);
          console.log(`   Última Sync: ${cat.ultima_sincronizacao ? new Date(cat.ultima_sincronizacao).toLocaleString('pt-BR') : 'Nunca'}`);
          console.log('');
        });
        
        if (globalCategorias.length > 20) {
          console.log(`... e mais ${globalCategorias.length - 20} categorias\n`);
        }
      }
    }

    // Estatísticas
    console.log('\n📊 ESTATÍSTICAS:\n');
    console.log(`Categorias em distribuidor_categories: ${distCategorias?.length || 0}`);
    console.log(`Categorias ativas: ${distCategorias?.filter(c => c.ativo).length || 0}`);
    console.log(`Categorias inativas: ${distCategorias?.filter(c => !c.ativo).length || 0}`);
    console.log(`\nCategorias sincronizadas (global): ${globalCategorias?.length || 0}`);
    console.log(`Categorias visíveis no frontend: ${globalCategorias?.filter(c => c.visible).length || 0}`);

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

listarCategoriasBrancaleone();
