const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: dcats } = await supabase.from('distribuidor_categories').select('id, nome');
  const { data: gcats } = await supabase.from('categories').select('id, name');
  
  const gcat_map = new Map(gcats.map(d=>[d.id, d.name]));
  
  console.log("Categorias sobrepostas (mesmo UUID em ambas tabelas):");
  for (const d of dcats) {
    if (gcat_map.has(d.id)) {
      console.log(`- ID: ${d.id}`);
      console.log(`  nome distribuidor: ${d.nome}`);
      console.log(`  nome admin: ${gcat_map.get(d.id)}`);
    }
  }
}
run();
