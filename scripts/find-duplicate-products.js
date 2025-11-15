import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.development' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function findDuplicates() {
  console.log('🔍 Buscando produtos duplicados...\n');
  
  // Buscar todos os produtos de distribuidores
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, distribuidor_id, sku, created_at')
    .not('distribuidor_id', 'is', null)
    .order('name');
  
  if (error) {
    console.error('❌ Erro:', error);
    return;
  }
  
  console.log(`📊 Total de produtos: ${products.length}\n`);
  
  // Agrupar por nome + distribuidor_id
  const groups = {};
  products.forEach(p => {
    const key = `${p.name}|||${p.distribuidor_id}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(p);
  });
  
  // Encontrar duplicatas
  const duplicates = Object.entries(groups).filter(([_, items]) => items.length > 1);
  
  console.log(`🔄 Produtos duplicados: ${duplicates.length}\n`);
  
  let totalDuplicates = 0;
  duplicates.forEach(([key, items]) => {
    const [name, distribuidorId] = key.split('|||');
    console.log(`\n📦 "${name}" (${items.length} cópias)`);
    console.log(`   Distribuidor: ${distribuidorId}`);
    
    items.forEach((item, index) => {
      console.log(`   ${index + 1}. ID: ${item.id} | SKU: ${item.sku || 'N/A'} | Criado: ${item.created_at}`);
    });
    
    totalDuplicates += items.length - 1; // -1 porque vamos manter 1
  });
  
  console.log(`\n\n📊 RESUMO:`);
  console.log(`   Total de produtos: ${products.length}`);
  console.log(`   Grupos duplicados: ${duplicates.length}`);
  console.log(`   Produtos a remover: ${totalDuplicates}`);
  console.log(`   Produtos após limpeza: ${products.length - totalDuplicates}`);
}

findDuplicates();
