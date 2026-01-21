require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugBancaMoema() {
  console.log('🔍 Buscando Banca Moema...\n');
  
  // Buscar por nome
  const { data: bancas, error } = await supabase
    .from('bancas')
    .select('*')
    .ilike('name', '%moema%');
  
  if (error) {
    console.error('❌ Erro ao buscar:', error.message);
    return;
  }
  
  if (!bancas || bancas.length === 0) {
    console.log('⚠️  Nenhuma banca encontrada com "moema" no nome');
    
    // Buscar pela URL do print (ID: e611b732-9801-412f-b064-35b8fa5b6351)
    const bancaId = 'e611b732-9801-412f-b064-35b8fa5b6351';
    const { data: bancaById } = await supabase
      .from('bancas')
      .select('*')
      .eq('id', bancaId)
      .single();
    
    if (bancaById) {
      console.log('✅ Banca encontrada pelo ID da URL:\n');
      console.log(JSON.stringify(bancaById, null, 2));
      return bancaById;
    }
    
    return;
  }
  
  console.log(`✅ ${bancas.length} banca(s) encontrada(s):\n`);
  
  bancas.forEach((banca, i) => {
    console.log(`--- BANCA ${i + 1} ---`);
    console.log('ID:', banca.id);
    console.log('Nome:', banca.name);
    console.log('Email:', banca.email);
    console.log('Endereço:', banca.address);
    console.log('Cidade:', banca.city);
    console.log('Estado:', banca.state);
    console.log('CEP:', banca.cep);
    console.log('Latitude:', banca.latitude);
    console.log('Longitude:', banca.longitude);
    console.log('É Cotista:', banca.is_cotista);
    console.log('Cotista ID:', banca.cotista_id);
    console.log('Cotista Razão Social:', banca.cotista_razao_social);
    console.log('Created At:', banca.created_at);
    console.log('');
  });
  
  return bancas[0];
}

debugBancaMoema().then(() => process.exit(0)).catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});
