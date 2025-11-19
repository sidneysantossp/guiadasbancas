const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBomboniereProducts() {
  try {
    const BOMBONIERE_ID = '6337c11f-c5ab-4f4b-ab9c-73c754d6eaae';
    
    console.log('🔍 Buscando produtos da categoria Bomboniere...\n');
    console.log(`Categoria ID: ${BOMBONIERE_ID}\n`);

    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, codigo_mercos, images, active, category_id')
      .eq('category_id', BOMBONIERE_ID)
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(12);

    if (error) {
      console.error('❌ Erro:', error.message);
      return;
    }

    if (!products || products.length === 0) {
      console.log('❌ Nenhum produto encontrado');
      return;
    }

    console.log(`✅ Total de produtos: ${products.length}\n`);
    console.log('📦 PRODUTOS RETORNADOS PELA API:\n');
    
    products.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      console.log(`   ID: ${p.id}`);
      console.log(`   Código: ${p.codigo_mercos || 'NULL'}`);
      console.log(`   Imagens: ${p.images ? p.images.length : 0}`);
      if (p.images && p.images[0]) {
        console.log(`   Primeira imagem: ${p.images[0]}`);
      }
      console.log('');
    });

    // Buscar especificamente o chicle 20809-1
    console.log('\n🔍 BUSCANDO CHICLE 20809-1:\n');
    const { data: chicle } = await supabase
      .from('products')
      .select('id, name, codigo_mercos, images, active, category_id')
      .eq('codigo_mercos', '20809-1')
      .single();

    if (chicle) {
      console.log('✅ Chicle encontrado:');
      console.log(`   Nome: ${chicle.name}`);
      console.log(`   ID: ${chicle.id}`);
      console.log(`   Código: ${chicle.codigo_mercos}`);
      console.log(`   Ativo: ${chicle.active}`);
      console.log(`   Categoria: ${chicle.category_id}`);
      console.log(`   Categoria Bomboniere?: ${chicle.category_id === BOMBONIERE_ID ? 'SIM ✅' : 'NÃO ❌'}`);
      console.log(`   Imagens: ${chicle.images ? JSON.stringify(chicle.images) : 'NULL'}`);
    } else {
      console.log('❌ Chicle 20809-1 NÃO encontrado no banco!');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

checkBomboniereProducts();
