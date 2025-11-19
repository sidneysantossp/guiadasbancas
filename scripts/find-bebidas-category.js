const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function findBebidasCategory() {
  try {
    console.log('🔍 Procurando categoria "Bebidas"...\n');

    // Buscar em distribuidor_categories
    const { data: distCats, error: distError } = await supabase
      .from('distribuidor_categories')
      .select('*')
      .ilike('nome', '%bebida%');

    if (distError) {
      console.log('⚠️  distribuidor_categories:', distError.message);
    } else {
      console.log('📋 DISTRIBUIDOR_CATEGORIES:');
      if (distCats && distCats.length > 0) {
        distCats.forEach(cat => {
          console.log(`   ✅ ${cat.nome} (ID: ${cat.id}, Mercos: ${cat.mercos_id})`);
          console.log(`      Distribuidor: ${cat.distribuidor_id}`);
        });
      } else {
        console.log('   ❌ Nenhuma categoria encontrada');
      }
    }

    // Buscar em categories (categorias públicas)
    const { data: pubCats, error: pubError } = await supabase
      .from('categories')
      .select('*')
      .ilike('name', '%bebida%');

    if (pubError) {
      console.log('\n⚠️  categories:', pubError.message);
    } else {
      console.log('\n📋 CATEGORIES (públicas):');
      if (pubCats && pubCats.length > 0) {
        pubCats.forEach(cat => {
          console.log(`   ✅ ${cat.name} (ID: ${cat.id})`);
        });
      } else {
        console.log('   ❌ Nenhuma categoria encontrada');
      }
    }

    // Verificar as categorias que existem nos produtos Bambino
    const BAMBINO_ID = '3a989c56-bbd3-4769-b076-a83483e39542';
    const { data: products } = await supabase
      .from('products')
      .select('category_id, name')
      .eq('distribuidor_id', BAMBINO_ID)
      .eq('active', true)
      .limit(50);

    if (products) {
      const uniqueCats = [...new Set(products.map(p => p.category_id).filter(Boolean))];
      console.log(`\n📊 CATEGORIAS USADAS NOS PRODUTOS BAMBINO: ${uniqueCats.length}`);
      
      for (const catId of uniqueCats) {
        // Buscar nome da categoria
        const { data: catInfo } = await supabase
          .from('distribuidor_categories')
          .select('nome, mercos_id')
          .eq('id', catId)
          .single();
        
        const count = products.filter(p => p.category_id === catId).length;
        const examples = products.filter(p => p.category_id === catId).slice(0, 2).map(p => p.name);
        
        console.log(`\n   🏷️  ${catId}`);
        if (catInfo) {
          console.log(`      Nome: ${catInfo.nome}`);
          console.log(`      Mercos ID: ${catInfo.mercos_id}`);
        }
        console.log(`      Produtos: ${count}`);
        console.log(`      Exemplos: ${examples.join(', ')}`);
      }
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

findBebidasCategory();
