const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function diagnose() {
  const distribuidor_id = '1511df09-1f4a-4e68-9f8c-05cd06be6269';
  
  // 1. Get tokens
  const { data: dist } = await supabase.from('distribuidores').select('mercos_application_token, mercos_company_token').eq('id', distribuidor_id).single();
  
  // 2. Fetch 1 page from Mercos
  console.log("Buscando 1 página da Mercos...");
  const res = await fetch(`https://app.mercos.com/api/v1/produtos?alterado_apos=2020-01-01T00:00:00&limit=50`, {
    headers: { 'ApplicationToken': dist.mercos_application_token, 'CompanyToken': dist.mercos_company_token }
  });
  const produtos = await res.json();
  console.log(`Recebidos ${produtos.length} produtos.`);
  
  // 3. Check existing
  const mercosIds = produtos.map(p => p.id);
  const { data: existentes } = await supabase.from('products').select('id, mercos_id').eq('distribuidor_id', distribuidor_id).in('mercos_id', mercosIds);
  const existentesMap = new Map((existentes || []).map(e => [e.mercos_id, e.id]));
  
  // 4. Try updating one
  let updated = 0;
  let errors = 0;
  for (const p of produtos) {
    const existingId = existentesMap.get(p.id);
    if (existingId) {
      const updateData = { name: p.nome, price: p.preco_tabela };
      const { error } = await supabase.from('products').update(updateData).eq('id', existingId);
      if (error) {
        console.error(`Erro ao atualizar ${p.nome}:`, error);
        errors++;
      } else {
        updated++;
      }
    }
  }
  
  console.log(`Diagnóstico: ${updated} atualizados com sucesso, ${errors} erros.`);
}
diagnose();
