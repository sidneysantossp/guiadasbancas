const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("Checking for duplicate mercos_id in products...");
  const { data, error } = await supabase.rpc('get_duplicate_mercos_ids'); // just a guess
  
  // Let's do a manual aggregation
  const { data: prods } = await supabase.from('products')
    .select('mercos_id')
    .eq('distribuidor_id', '1511df09-1f4a-4e68-9f8c-05cd06be6269')
    .not('mercos_id', 'is', null);
    
  if (prods) {
    const counts = {};
    let duplicates = 0;
    for (const p of prods) {
      counts[p.mercos_id] = (counts[p.mercos_id] || 0) + 1;
      if (counts[p.mercos_id] === 2) duplicates++;
    }
    console.log(`Total items with mercos_id: ${prods.length}`);
    console.log(`Unique mercos_ids: ${Object.keys(counts).length}`);
    console.log(`Duplicates: ${duplicates}`);
  }
}
check();
