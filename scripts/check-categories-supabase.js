const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const distribuidor_id = '1511df09-1f4a-4e68-9f8c-05cd06be6269'; // Brancaleone
  const { data: distCats } = await supabase.from('distribuidor_categories').select('*').eq('distribuidor_id', distribuidor_id).eq('ativo', true);
  
  console.log(`Encontradas ${distCats.length} categorias de distribuidor no banco`);
  
  const parentCats = distCats.filter(c => !c.categoria_pai_id);
  console.log(`Principais: ${parentCats.length}`);
  parentCats.forEach(c => console.log(`- ${c.mercos_id}: ${c.nome}`));
  
  const subCats = distCats.filter(c => c.categoria_pai_id);
  console.log(`Subcategorias: ${subCats.length}`);
  subCats.slice(0, 5).forEach(c => console.log(`- ${c.mercos_id}: ${c.nome} (Pai: ${c.categoria_pai_id})`));
}
run();
