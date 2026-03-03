const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: cols, error } = await supabase.rpc('get_tables_names'); // using custom rpc if any
  const { data: q } = await supabase.from('categories').select('*').limit(1);
  console.log("Categories fields:", Object.keys(q[0] || {}));
  
  const { data: q2 } = await supabase.from('distribuidor_categories').select('*').limit(1);
  console.log("Distribuidor categories fields:", Object.keys(q2[0] || {}));
}
run();
