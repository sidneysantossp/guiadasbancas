const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function analyze() {
  const distribuidor_id = '1511df09-1f4a-4e68-9f8c-05cd06be6269';
  const { data: dist } = await supabase.from('distribuidores').select('mercos_application_token, mercos_company_token').eq('id', distribuidor_id).single();
  
  let total = 0;
  let activeTrue = 0;
  let activeFalse = 0;
  let excludedTrue = 0;
  let stockGt0 = 0;
  let activeAndStock = 0;
  
  let alteradoApos = '2020-01-01T00:00:00';
  let page = 1;
  
  while (true) {
    const url = `https://app.mercos.com/api/v1/produtos?alterado_apos=${encodeURIComponent(alteradoApos)}&limit=500`;
    const res = await fetch(url, { headers: { 'ApplicationToken': dist.mercos_application_token, 'CompanyToken': dist.mercos_company_token } });
    if (!res.ok) break;
    
    const data = await res.json();
    if (data.length === 0) break;
    
    for (const p of data) {
      total++;
      if (p.ativo === true) activeTrue++;
      if (p.ativo === false) activeFalse++;
      if (p.excluido === true) excludedTrue++;
      if (p.saldo_estoque > 0) stockGt0++;
      if (p.ativo === true && p.saldo_estoque > 0) activeAndStock++;
    }
    
    if (data.length < 500) break;
    alteradoApos = data[data.length - 1].ultima_alteracao;
    page++;
    if (page > 50) break;
  }
  
  console.log(`Total baixado da API Mercos: ${total}`);
  console.log(`ativo=true: ${activeTrue}`);
  console.log(`ativo=false: ${activeFalse}`);
  console.log(`excluido=true: ${excludedTrue}`);
  console.log(`saldo_estoque > 0: ${stockGt0}`);
  console.log(`ativo=true E saldo_estoque > 0: ${activeAndStock}`);
}
analyze();
