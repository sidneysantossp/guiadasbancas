const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data } = await supabase.from('distribuidores').select('id, nome');
  console.log(data);
  
  for (const d of data) {
    const { count: total } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('distribuidor_id', d.id);
    const { count: active } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('distribuidor_id', d.id).eq('active', true);
    console.log(`${d.nome} (${d.id}): ${total} total, ${active} active`);
  }
}
check();
