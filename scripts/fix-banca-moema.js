require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixBancaMoema() {
  const bancaId = 'e611b732-9801-412f-b064-35b8fa5b6351';
  
  console.log('🔧 Corrigindo dados da Banca Moema...\n');
  
  // 1. Buscar dados atuais
  const { data: banca, error: fetchError } = await supabase
    .from('bancas')
    .select('*')
    .eq('id', bancaId)
    .single();
  
  if (fetchError || !banca) {
    console.error('❌ Erro ao buscar banca:', fetchError?.message);
    return;
  }
  
  console.log('📍 Endereço atual:', banca.address);
  console.log('📍 CEP:', banca.cep);
  console.log('📍 Latitude:', banca.lat);
  console.log('📍 Longitude:', banca.lng);
  console.log('');
  
  // 2. Geocodificar endereço usando API do Google Maps
  const address = 'Avenida Ibirapuera, 2248 - Indianópolis, São Paulo - SP, 04028-001';
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
  
  console.log('🌍 Geocodificando endereço...');
  
  const response = await fetch(geocodeUrl);
  const geocodeData = await response.json();
  
  if (geocodeData.status !== 'OK' || !geocodeData.results[0]) {
    console.error('❌ Erro ao geocodificar:', geocodeData.status);
    console.log('Tentando com coordenadas fixas conhecidas...\n');
    
    // Coordenadas aproximadas da Av. Ibirapuera, 2248 (via Google Maps)
    const lat = -23.6063;
    const lng = -46.6631;
    
    console.log('📍 Usando coordenadas fixas:');
    console.log('Latitude:', lat);
    console.log('Longitude:', lng);
    console.log('');
    
    // Atualizar no banco
    const { error: updateError } = await supabase
      .from('bancas')
      .update({
        lat,
        lng
      })
      .eq('id', bancaId);
    
    if (updateError) {
      console.error('❌ Erro ao atualizar:', updateError.message);
      return;
    }
    
    console.log('✅ Banca Moema atualizada com sucesso!');
    console.log('');
    console.log('🔗 URL correta da banca:');
    console.log(`https://guiadasbancas.com.br/banca/sp/banca-moema-${bancaId}`);
    console.log('');
    console.log('✅ Agora a banca deve aparecer na busca com KM calculado!');
    
    return;
  }
  
  // 3. Extrair coordenadas do resultado
  const location = geocodeData.results[0].geometry.location;
  
  console.log('✅ Geocodificação bem-sucedida!');
  console.log('Latitude:', location.lat);
  console.log('Longitude:', location.lng);
  console.log('');
  
  // 4. Atualizar no banco
  const { error: updateError } = await supabase
    .from('bancas')
    .update({
      lat: location.lat,
      lng: location.lng
    })
    .eq('id', bancaId);
  
  if (updateError) {
    console.error('❌ Erro ao atualizar:', updateError.message);
    return;
  }
  
  console.log('✅ Banca Moema atualizada com sucesso!');
  console.log('');
  console.log('🔗 URL correta da banca:');
  console.log(`https://guiadasbancas.com.br/banca/sp/banca-moema-${bancaId}`);
  console.log('');
  console.log('✅ Agora a banca deve aparecer na busca com KM calculado!');
}

fixBancaMoema().then(() => process.exit(0)).catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});
