const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBebidasVitoriaRegia() {
  try {
    const BANCA_ID = '5d3672ef-cd52-451b-bdb6-439e101f2b34';
    
    console.log('🔍 Buscando produtos da Banca Vitória Régia...\n');

    // Buscar produtos da banca
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, category_id, active')
      .eq('banca_id', BANCA_ID)
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
        // Tentar em categories (públicas)
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
        console.log(`   Nome: ${catInfo.name}`);
      }
      console.log(`   Produtos: ${produtos.length}`);
      console.log(`   Exemplos: ${produtos.slice(0, 3).join(', ')}`);
    }

    // Procurar especificamente por "Bebidas"
    console.log('\n\n🔍 PROCURANDO CATEGORIA "BEBIDAS":');
    
    const { data: bebidasCat } = await supabase
      .from('categories')
      .select('id, name')
      .ilike('name', '%bebida%');
    
    if (bebidasCat && bebidasCat.length > 0) {
      console.log('\n📋 Categorias com "Bebidas" no banco:');
      bebidasCat.forEach(cat => {
        console.log(`   ✅ ${cat.name} (ID: ${cat.id})`);
        
        // Ver se tem produtos com essa categoria
        const produtosCat = products.filter(p => p.category_id === cat.id);
        if (produtosCat.length > 0) {
          console.log(`      🎯 ESTA BANCA TEM ${produtosCat.length} PRODUTOS COM ESTA CATEGORIA!`);
          produtosCat.slice(0, 5).forEach(p => {
            console.log(`         - ${p.name}`);
          });
        }
      });
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

checkBebidasVitoriaRegia();
