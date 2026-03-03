const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const distribuidor_id = '1511df09-1f4a-4e68-9f8c-05cd06be6269';
  console.log("Chamando a API de sync em produção para testar (ou podemos testar via fetch se a URL de prod estiver disponível)...");
  
  // Como não temos a URL de produção fácil, vamos buscar os últimos produtos que deram erro e tentar atualizá-los manualmente para ver se passa.
  // "A SAGA DO BATMAN N.39", "HELLBLAZER VOL. 2"
  const { data: prods } = await supabase.from('products').select('*').in('name', ['A SAGA DO BATMAN N.39', 'HELLBLAZER VOL. 2 - EDICAO DE LUXO']);
  console.log("Encontrados no banco:", prods.length);
  
  if (prods.length > 0) {
     const p = prods[0];
     console.log("Tentando atualizar categoria do produto", p.name);
     const { error } = await supabase.from('products').update({ category_id: '1511df09-1f4a-4e68-9f8c-05cd06be6269' }).eq('id', p.id); // just a dummy category id
     console.log("Update error:", error);
  }
}
run();
