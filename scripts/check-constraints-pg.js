const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabase.rpc('get_foreign_keys');
  if (error) {
     console.log("No RPC, trying to insert a bad category to see if PG blocks it...");
     const { error: insErr } = await supabase.from('products').insert({
        name: 'Teste FK 2',
        price: 10,
        distribuidor_id: '1511df09-1f4a-4e68-9f8c-05cd06be6269',
        mercos_id: 999999999,
        category_id: '22222222-2222-2222-2222-222222222222'
     });
     console.log("Insert error with fake category:", insErr);
     if (!insErr) {
       await supabase.from('products').delete().eq('mercos_id', 999999999);
     }
  }
}
check();
