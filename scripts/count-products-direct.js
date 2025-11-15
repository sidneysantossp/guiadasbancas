// Script para contar produtos diretamente no banco (sem cache)
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function countProducts() {
  console.log('🔍 Contando produtos diretamente no banco...\n');
  
  // Contar produtos ativos de distribuidores
  const { count: ativos } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .not('distribuidor_id', 'is', null)
    .eq('active', true);
  
  // Contar produtos inativos de distribuidores
  const { count: inativos } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .not('distribuidor_id', 'is', null)
    .eq('active', false);
  
  // Contar total de distribuidores
  const { count: total } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .not('distribuidor_id', 'is', null);
  
  console.log('📊 RESULTADO:');
  console.log(`   Produtos ATIVOS: ${ativos}`);
  console.log(`   Produtos INATIVOS: ${inativos}`);
  console.log(`   TOTAL: ${total}`);
  console.log('');
  
  if (ativos === 3440) {
    console.log('✅ PERFEITO! 100% sincronizado com a Mercos!');
  } else if (ativos === 3439) {
    console.log('⚠️  Faltando 1 produto (3440 esperado)');
  } else {
    console.log(`❌ Diferença: ${3440 - ativos} produtos`);
  }
}

countProducts().catch(console.error);
