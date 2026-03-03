const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const distribuidor_id = '1511df09-1f4a-4e68-9f8c-05cd06be6269'; // Brancaleone
  const { data: dist } = await supabase.from('distribuidores').select('mercos_application_token, mercos_company_token, base_url').eq('id', distribuidor_id).single();
  
  const baseUrl = dist.base_url || 'https://app.mercos.com/api/v1';
  console.log("Using URL:", baseUrl);
  const url = `${baseUrl}/categorias`;
  
  const res = await fetch(url, { headers: { 'ApplicationToken': dist.mercos_application_token, 'CompanyToken': dist.mercos_company_token } });
  
  if (!res.ok) {
     console.error(`Erro na API Mercos: ${res.status} ${res.statusText}`);
     return;
  }
  
  const data = await res.json();
  console.log(`Encontradas ${data.length} categorias na Mercos`);
  const tops = data.filter(c => !c.categoria_pai_id);
  console.log("Categorias Principais:", tops.map(c => ({ id: c.id, nome: c.nome, excluido: c.excluido })));
  
  const sub = data.filter(c => c.categoria_pai_id);
  console.log(`Existem ${sub.length} subcategorias`);
}
run();
