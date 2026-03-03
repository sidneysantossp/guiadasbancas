const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function clean() {
  await supabase.from('products').delete().eq('name', 'Teste FK');
  console.log("Cleaned up dummy product.");
}
clean();
