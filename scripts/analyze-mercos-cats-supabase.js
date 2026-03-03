const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: dcols } = await supabase.from('distribuidor_categories').select('id, mercos_id, nome, categoria_pai_id');
  const dcat_map = new Map(dcols.map(d=>[d.id, d.nome]));
  
  const { data: gcols } = await supabase.from('categories').select('id, name');
  const gcat_map = new Map(gcols.map(d=>[d.id, d.name]));

  const { data: prods } = await supabase.from('products').select('category_id');
  const cat_counts = {};
  prods.forEach(p => {
    if (p.category_id) {
      cat_counts[p.category_id] = (cat_counts[p.category_id] || 0) + 1;
    }
  });
  
  console.log("Categorias com mais produtos:");
  Object.entries(cat_counts).sort((a,b)=>b[1]-a[1]).slice(0, 10).forEach(([id, count]) => {
    const name = dcat_map.get(id) || gcat_map.get(id) || "Desconhecida";
    console.log(`- ${id}: ${count} produtos (${name})`);
  });
}
run();
