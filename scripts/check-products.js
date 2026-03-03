const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { count: totalCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { count: brancaleoneCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('distribuidor_id', '1511df09-1f4a-4e68-9f8c-05cd06be6269');
  
  console.log("Total products:", totalCount);
  console.log("Brancaleone products:", brancaleoneCount);
}
check();
