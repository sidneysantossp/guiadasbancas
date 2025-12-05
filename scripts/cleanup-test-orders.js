// Script para deletar pedidos de teste
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function cleanupTestOrders() {
  console.log('🧹 Limpando pedidos de teste...\n');

  // Buscar todos os pedidos
  const { data: orders, error: fetchError } = await supabase
    .from('orders')
    .select('id, customer_name, total, created_at, banca_id');

  if (fetchError) {
    console.error('❌ Erro ao buscar pedidos:', fetchError.message);
    return;
  }

  console.log(`📋 Total de pedidos encontrados: ${orders?.length || 0}`);
  
  if (!orders || orders.length === 0) {
    console.log('✅ Nenhum pedido para deletar');
    return;
  }

  // Listar pedidos
  orders.forEach(order => {
    console.log(`  - ${order.id} | ${order.customer_name} | R$ ${order.total} | ${order.created_at}`);
  });

  // Deletar todos os pedidos
  const { error: deleteError } = await supabase
    .from('orders')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Deleta todos

  if (deleteError) {
    console.error('\n❌ Erro ao deletar pedidos:', deleteError.message);
    return;
  }

  console.log(`\n✅ ${orders.length} pedidos deletados com sucesso!`);
}

cleanupTestOrders();
