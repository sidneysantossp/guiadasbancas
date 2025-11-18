require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function moverSedaParaTabacaria() {
  try {
    console.log('🔍 Buscando categoria "Tabacaria"...\n');
    
    // 1. Buscar categoria Tabacaria
    const { data: categorias, error: errorCat } = await supabase
      .from('categories')
      .select('id, name')
      .ilike('name', 'tabacaria');
    
    if (errorCat) {
      console.error('❌ Erro ao buscar categoria:', errorCat.message);
      return;
    }
    
    if (!categorias || categorias.length === 0) {
      console.error('❌ Categoria "Tabacaria" não encontrada!');
      console.log('\n💡 Categorias disponíveis:');
      const { data: todasCats } = await supabase
        .from('categories')
        .select('name')
        .order('name');
      todasCats?.forEach(c => console.log(`   - ${c.name}`));
      return;
    }
    
    const categoriaTabacaria = categorias[0];
    console.log(`✅ Categoria encontrada: "${categoriaTabacaria.name}" (ID: ${categoriaTabacaria.id})\n`);
    
    // 2. Buscar todos os produtos que começam com "seda"
    console.log('🔍 Buscando produtos que começam com "seda"...\n');
    
    const { data: produtos, error: errorProd } = await supabase
      .from('products')
      .select('id, name, category_id, codigo_mercos, categories!category_id(name)')
      .ilike('name', 'seda%')
      .eq('active', true);
    
    if (errorProd) {
      console.error('❌ Erro ao buscar produtos:', errorProd.message);
      return;
    }
    
    if (!produtos || produtos.length === 0) {
      console.log('ℹ️  Nenhum produto encontrado que comece com "seda"');
      return;
    }
    
    console.log(`📦 ${produtos.length} produto(s) encontrado(s):\n`);
    
    // Listar produtos encontrados
    produtos.forEach((p, index) => {
      const catAtual = p.categories?.name || 'Sem categoria';
      console.log(`${index + 1}. ${p.name}`);
      console.log(`   Código: ${p.codigo_mercos || 'N/A'}`);
      console.log(`   Categoria atual: ${catAtual}`);
      console.log(`   ID: ${p.id}\n`);
    });
    
    // 3. Confirmar mudança
    console.log('─────────────────────────────────────────────────────');
    console.log(`🔄 Movendo ${produtos.length} produto(s) para "Tabacaria"...\n`);
    
    let sucessos = 0;
    let erros = 0;
    
    for (const produto of produtos) {
      const { error: updateError } = await supabase
        .from('products')
        .update({ category_id: categoriaTabacaria.id })
        .eq('id', produto.id);
      
      if (updateError) {
        console.error(`❌ Erro ao atualizar "${produto.name}": ${updateError.message}`);
        erros++;
      } else {
        console.log(`✅ "${produto.name}" → Tabacaria`);
        sucessos++;
      }
    }
    
    // 4. Resumo
    console.log('\n─────────────────────────────────────────────────────');
    console.log('📊 RESUMO:');
    console.log(`   ✅ Sucesso: ${sucessos}`);
    console.log(`   ❌ Erros: ${erros}`);
    console.log(`   📦 Total: ${produtos.length}`);
    console.log('─────────────────────────────────────────────────────\n');
    
    if (sucessos > 0) {
      console.log('✨ Produtos "seda" movidos para "Tabacaria" com sucesso!\n');
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar
console.log('═════════════════════════════════════════════════════');
console.log('  MOVER PRODUTOS "SEDA" PARA TABACARIA');
console.log('═════════════════════════════════════════════════════\n');

moverSedaParaTabacaria()
  .then(() => {
    console.log('🏁 Script finalizado!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  });
