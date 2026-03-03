const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: cols, error } = await supabase.from('mercos_homologacao_registros').select('*');
  console.log(`Encontrados ${cols?.length || 0} registros de homologação`);
  
  if (cols && cols.length > 0) {
    const active = cols.filter(c => !c.excluido);
    console.log(`Ativos: ${active.length}`);
    active.slice(0, 10).forEach(c => console.log(`- ${c.mercos_id}: ${c.nome}`));
  }
}
run();
