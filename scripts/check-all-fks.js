const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabase.rpc('get_foreign_keys');
  if (error) {
     // fallback if rpc doesn't exist
     const { data: qData, error: qErr } = await supabase.from('products').select('*').limit(1);
     console.log("No RPC. Just running a dummy query.", qErr);
  } else {
     console.log(data);
  }
}
check();
