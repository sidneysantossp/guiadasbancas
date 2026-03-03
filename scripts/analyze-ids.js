const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: dcats } = await supabase.from('distribuidor_categories').select('id');
  const { data: gcats } = await supabase.from('categories').select('id');
  
  const dcat_ids = new Set(dcats.map(d=>d.id));
  const gcat_ids = new Set(gcats.map(d=>d.id));
  
  let overlap = 0;
  for (const id of dcat_ids) {
    if (gcat_ids.has(id)) overlap++;
  }
  console.log("Overlap count:", overlap);
}
run();
