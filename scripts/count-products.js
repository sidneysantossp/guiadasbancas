import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function countProducts() {
  console.log('📊 Contando produtos...\n');
  
  // Total de produtos de distribuidores (ativos)
  const { count: totalDistribuidores, error: err1 } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .not('distribuidor_id', 'is', null)
    .eq('active', true);
  
  if (err1) {
    console.error('Erro:', err1);
    return;
  }
  
  // Total de produtos próprios (de bancas)
  const { count: totalProprios, error: err2 } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .is('distribuidor_id', null);
  
  if (err2) {
    console.error('Erro:', err2);
    return;
  }
  
  // Total geral
  const { count: totalGeral, error: err3 } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });
  
  if (err3) {
    console.error('Erro:', err3);
    return;
  }
  
  console.log('📦 RESUMO DE PRODUTOS:\n');
  console.log(`   Produtos de Distribuidores (ativos): ${totalDistribuidores}`);
  console.log(`   Produtos Próprios (bancas): ${totalProprios}`);
  console.log(`   Total Geral: ${totalGeral}`);
  console.log('\n✅ Cotistas têm acesso a:', totalDistribuidores, 'produtos');
}

countProducts();
