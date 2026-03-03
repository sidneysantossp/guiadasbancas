const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: logs, error } = await supabase.from('sync_history').select('*').order('created_at', { ascending: false }).limit(5);
  console.log("History:", logs, error);
}
check();
