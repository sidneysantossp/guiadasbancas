const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: cols } = await supabase.from('categories').select('id, name, parent_id');
  console.log("Global categories count:", cols.length);
  
  const { data: dcols } = await supabase.from('distribuidor_categories').select('id, nome, categoria_pai_id');
  console.log("Distribuidor categories count:", dcols.length);
}
run();
