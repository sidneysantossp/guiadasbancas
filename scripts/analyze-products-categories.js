const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  // Check products category_id references
  const { data: prods } = await supabase.from('products').select('category_id');
  const dcat_ids = new Set((await supabase.from('distribuidor_categories').select('id')).data.map(d=>d.id));
  const gcat_ids = new Set((await supabase.from('categories').select('id')).data.map(d=>d.id));
  
  let in_dcat = 0;
  let in_gcat = 0;
  let in_both = 0;
  let in_neither = 0;
  let no_cat = 0;
  
  prods.forEach(p => {
    if (!p.category_id) { no_cat++; return; }
    const isD = dcat_ids.has(p.category_id);
    const isG = gcat_ids.has(p.category_id);
    if (isD && isG) in_both++;
    else if (isD) in_dcat++;
    else if (isG) in_gcat++;
    else in_neither++;
  });
  
  console.log({ no_cat, in_dcat, in_gcat, in_both, in_neither });
}
run();
