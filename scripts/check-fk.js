const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.rpc('get_foreign_keys'); // Might not exist
  // Let's just try to insert a dummy product with a fake category_id
  const { error: insertError } = await supabase.from('products').insert({
    name: 'Teste FK',
    price: 10,
    category_id: '11111111-1111-1111-1111-111111111111'
  });
  console.log("Insert error with fake category:", insertError);
}
check();
