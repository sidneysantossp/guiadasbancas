const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const distribuidor_id = '1511df09-1f4a-4e68-9f8c-05cd06be6269'; // Brancaleone
  
  const { count: total } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('distribuidor_id', distribuidor_id);
  const { count: active } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('distribuidor_id', distribuidor_id).eq('active', true);
  const { count: activeStock0 } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('distribuidor_id', distribuidor_id).eq('active', true).eq('stock_qty', 0);
  const { count: inactiveStockGt0 } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('distribuidor_id', distribuidor_id).eq('active', false).gt('stock_qty', 0);
  const { count: inactiveStock0 } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('distribuidor_id', distribuidor_id).eq('active', false).eq('stock_qty', 0);

  console.log(`Total Brancaleone: ${total}`);
  console.log(`Ativos no sistema: ${active}`);
  console.log(`Ativos com estoque zero: ${activeStock0}`);
  console.log(`Inativos com estoque > 0: ${inactiveStockGt0} (Estes provavelmente estão inativos na própria Mercos)`);
  console.log(`Inativos com estoque 0: ${inactiveStock0} (Muitos destes podem estar "Ativos" na Mercos, mas foram inativados no sistema por falta de estoque)`);
}
check();
