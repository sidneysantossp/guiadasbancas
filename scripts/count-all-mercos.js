const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function count() {
  const distribuidor_id = '1511df09-1f4a-4e68-9f8c-05cd06be6269'; // Brancaleone
  
  const { data: dist } = await supabase.from('distribuidores').select('mercos_application_token, mercos_company_token').eq('id', distribuidor_id).single();
  const appToken = dist.mercos_application_token;
  const compToken = dist.mercos_company_token;
  
  let totalMercos = 0;
  let page = 1;
  let alteradoApos = '2020-01-01T00:00:00';
  
  while (true) {
    const url = `https://app.mercos.com/api/v1/produtos?alterado_apos=${encodeURIComponent(alteradoApos)}&limit=500`;
    
    const res = await fetch(url, { headers: { 'ApplicationToken': appToken, 'CompanyToken': compToken } });
    if (!res.ok) break;
    
    const data = await res.json();
    totalMercos += data.length;
    
    if (data.length < 500) break;
    alteradoApos = data[data.length - 1].ultima_alteracao;
    page++;
    if (page > 50) break;
  }
  
  console.log(`Total absoluto de produtos na Mercos: ${totalMercos}`);
}
count();
