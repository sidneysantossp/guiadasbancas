const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data, error } = await supabase.from('products').select('category_id').limit(10).not('category_id', 'is', null);
  console.log(data);
  
  // also get one from distribuidor_categories to compare UUID format
  const { data: dCats } = await supabase.from('distribuidor_categories').select('id, nome').limit(2);
  console.log(dCats);
  
  // also get global categories
  const { data: gCats } = await supabase.from('categories').select('id, name').limit(2);
  console.log(gCats);
}
run();
