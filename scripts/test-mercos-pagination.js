const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const distribuidor_id = '1511df09-1f4a-4e68-9f8c-05cd06be6269'; // Brancaleone
  
  // get tokens
  const { data: dist } = await supabase.from('distribuidores').select('mercos_application_token, mercos_company_token').eq('id', distribuidor_id).single();
  
  const appToken = dist.mercos_application_token;
  const compToken = dist.mercos_company_token;
  
  console.log("Tokens found:", { appToken: appToken.substring(0, 5) + '...', compToken: compToken.substring(0, 5) + '...' });
  
  let total = 0;
  let page = 1;
  let alteradoApos = '2020-01-01T00:00:00';
  
  while (true) {
    const url = `https://app.mercos.com/api/v1/produtos?alterado_apos=${encodeURIComponent(alteradoApos)}&limit=500`;
    console.log(`Buscando página ${page}...`);
    
    const res = await fetch(url, {
      headers: {
        'ApplicationToken': appToken,
        'CompanyToken': compToken
      }
    });
    
    if (!res.ok) {
      console.error("Erro na API:", res.status, await res.text());
      break;
    }
    
    const data = await res.json();
    total += data.length;
    console.log(`Página ${page} retornou ${data.length} produtos. Total acumulado: ${total}`);
    
    if (data.length < 500) {
      break; // Last page
    }
    
    // update alteradoApos for next page (Mercos pagination logic)
    // Actually, mercos pagination usually requires checking headers or using the last 'ultima_alteracao'
    const lastItem = data[data.length - 1];
    if (lastItem && lastItem.ultima_alteracao) {
        // We need to add 1 second to avoid infinite loops if multiple items have the exact same timestamp, 
        // OR we need to use a proper pagination token if Mercos provides one.
        // Let's see what Mercos API documentation says or what the current code does.
        alteradoApos = lastItem.ultima_alteracao;
        console.log(`Próximo alterado_apos: ${alteradoApos}`);
    } else {
        break;
    }
    page++;
    
    // safety break
    if (page > 10) break;
  }
}
test();
