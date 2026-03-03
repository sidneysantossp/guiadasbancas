const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: cols, error } = await supabase.rpc('get_foreign_keys'); // if exists
  const { data: cats } = await supabase.from('categories').select('*').limit(5);
  const { data: dCats } = await supabase.from('distribuidor_categories').select('*').limit(5);
  console.log("categories:", cats);
  console.log("distribuidor_categories:", dCats);
}
check();
