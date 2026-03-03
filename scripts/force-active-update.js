const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const distribuidor_id = '1511df09-1f4a-4e68-9f8c-05cd06be6269';
  const { data: dist } = await supabase.from('distribuidores').select('mercos_application_token, mercos_company_token').eq('id', distribuidor_id).single();
  
  let alteradoApos = '2020-01-01T00:00:00';
  let page = 1;
  const mercosActiveIds = new Set();
  
  console.log("Buscando dados da Mercos...");
  while (true) {
    const url = `https://app.mercos.com/api/v1/produtos?alterado_apos=${encodeURIComponent(alteradoApos)}&limit=500`;
    const res = await fetch(url, { headers: { 'ApplicationToken': dist.mercos_application_token, 'CompanyToken': dist.mercos_company_token } });
    if (!res.ok) break;
    
    const data = await res.json();
    if (data.length === 0) break;
    
    for (const p of data) {
      if (p.ativo !== false && p.excluido !== true) {
        mercosActiveIds.add(p.id);
      }
    }
    if (data.length < 500) break;
    alteradoApos = data[data.length - 1].ultima_alteracao;
    page++;
    if (page > 50) break;
  }
  
  console.log(`Encontrados ${mercosActiveIds.size} produtos ativos na Mercos.`);
  
  console.log("Buscando produtos inativos no banco...");
  const { data: inativosDB } = await supabase.from('products').select('id, mercos_id').eq('distribuidor_id', distribuidor_id).eq('active', false);
  
  console.log(`Inativos no banco: ${inativosDB.length}`);
  
  const toActivate = inativosDB.filter(p => mercosActiveIds.has(p.mercos_id));
  console.log(`Produtos inativos no banco que deveriam estar ativos (sem estoque mas ativos na Mercos): ${toActivate.length}`);
  
  if (toActivate.length > 0) {
    console.log("Atualizando no banco...");
    const ids = toActivate.map(p => p.id);
    // update in batches of 100
    for(let i=0; i<ids.length; i+=100) {
      const batch = ids.slice(i, i+100);
      await supabase.from('products').update({ active: true }).in('id', batch);
    }
    console.log("Atualizados com sucesso!");
  }
  
  // also check active in DB that should be inactive
  const { data: ativosDB } = await supabase.from('products').select('id, mercos_id').eq('distribuidor_id', distribuidor_id).eq('active', true);
  const toDeactivate = ativosDB.filter(p => !mercosActiveIds.has(p.mercos_id));
  console.log(`Produtos ativos no banco que deveriam estar inativos: ${toDeactivate.length}`);
  if (toDeactivate.length > 0) {
     const ids = toDeactivate.map(p => p.id);
     for(let i=0; i<ids.length; i+=100) {
      const batch = ids.slice(i, i+100);
      await supabase.from('products').update({ active: false }).in('id', batch);
    }
    console.log("Desativados com sucesso!");
  }
}
run();
