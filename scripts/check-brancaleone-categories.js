const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBrancaleone() {
  try {
    const BRANCALEONE_ID = '1511df09-1f4a-4e68-9f8c-05cd06be6269';
    
    console.log('🔍 Buscando produtos da Brancaleone...\n');

    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, category_id, active')
      .eq('distribuidor_id', BRANCALEONE_ID)
      .eq('active', true)
      .limit(100);

    if (error) {
      console.error('❌ Erro:', error.message);
      return;
    }

    if (!products || products.length === 0) {
      console.log('⚠️  Nenhum produto encontrado');
      return;
    }

    console.log(`✅ Total de produtos: ${products.length}\n`);

    // Agrupar por categoria
    const categorias = {};
    products.forEach(p => {
      const catId = p.category_id || 'SEM_CATEGORIA_ID';
      if (!categorias[catId]) {
        categorias[catId] = [];
      }
      categorias[catId].push(p.name);
    });

    console.log('📊 CATEGORIAS ENCONTRADAS:\n');
    
    for (const catId of Object.keys(categorias).sort()) {
      const produtos = categorias[catId];
      
      // Buscar nome da categoria
      let catInfo = null;
      if (catId !== 'SEM_CATEGORIA_ID') {
        const { data: pubCat } = await supabase
          .from('categories')
          .select('name')
          .eq('id', catId)
          .single();
        
        if (pubCat) {
          catInfo = pubCat;
        }
      }
      
      console.log(`\n🏷️  ${catId}`);
      if (catInfo) {
        console.log(`   ✅ Nome: ${catInfo.name}`);
      }
      console.log(`   Produtos: ${produtos.length}`);
      console.log(`   Exemplos: ${produtos.slice(0, 5).join(', ')}`);
    }

    // Escolher a categoria com mais produtos
    const sorted = Object.entries(categorias).sort((a, b) => b[1].length - a[1].length);
    console.log(`\n\n🎯 CATEGORIA COM MAIS PRODUTOS: ${sorted[0][0]} (${sorted[0][1].length} produtos)`);

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

checkBrancaleone();
