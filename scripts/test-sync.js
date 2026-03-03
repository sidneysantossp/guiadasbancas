const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function run() {
  // Call the sync API directly locally
  const res = await fetch('http://localhost:3000/api/admin/distribuidores/1511df09-1f4a-4e68-9f8c-05cd06be6269/sync', {
    method: 'POST'
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
run();
