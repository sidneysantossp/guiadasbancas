const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProductCode() {
  try {
    console.log('🔍 Verificando campos de código dos produtos...\n');

    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, codigo_mercos, images')
      .limit(5);

    if (error) {
      console.error('❌ Erro:', error.message);
      return;
    }

    if (!products || products.length === 0) {
      console.log('❌ Nenhum produto encontrado');
      return;
    }

    console.log('✅ Produtos encontrados:\n');
    products.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      console.log(`   ID: ${p.id}`);
      console.log(`   codigo_mercos: ${p.codigo_mercos || 'NULL'}`);
      console.log(`   images: ${p.images ? JSON.stringify(p.images) : 'NULL'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

checkProductCode();
