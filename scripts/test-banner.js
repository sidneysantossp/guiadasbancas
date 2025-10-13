// Script para testar o banner do jornaleiro
// Execute: node scripts/test-banner.js

const testBanner = async () => {
  console.log('🧪 Testando API do banner...');
  
  try {
    // Teste 1: GET - Buscar banner atual
    console.log('\n1️⃣ Testando GET /api/admin/vendor-banner');
    const getResponse = await fetch('http://localhost:3000/api/admin/vendor-banner');
    const getData = await getResponse.json();
    console.log('📖 GET Response:', JSON.stringify(getData, null, 2));
    
    // Teste 2: PUT - Salvar novo banner
    console.log('\n2️⃣ Testando PUT /api/admin/vendor-banner');
    const testData = {
      title: "TESTE - É jornaleiro?",
      subtitle: "TESTE - Registre sua banca agora",
      description: "TESTE - Banner configurado via admin panel",
      button_text: "TESTE - Quero me cadastrar",
      button_link: "/jornaleiro/registrar",
      image_url: "https://via.placeholder.com/800x400/FF5C00/FFFFFF?text=TESTE+BANNER",
      background_color: "#FF5C00",
      text_color: "#FFFFFF",
      button_color: "#000000",
      button_text_color: "#FFFFFF",
      overlay_opacity: 0.6,
      text_position: "center",
      active: true
    };
    
    const putResponse = await fetch('http://localhost:3000/api/admin/vendor-banner', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const putData = await putResponse.json();
    console.log('💾 PUT Response:', JSON.stringify(putData, null, 2));
    
    // Teste 3: GET novamente para verificar se foi salvo
    console.log('\n3️⃣ Verificando se foi salvo - GET novamente');
    const getResponse2 = await fetch('http://localhost:3000/api/admin/vendor-banner');
    const getData2 = await getResponse2.json();
    console.log('📖 GET Response (após PUT):', JSON.stringify(getData2, null, 2));
    
    // Verificar se os dados batem
    if (getData2.data && getData2.data.title === testData.title) {
      console.log('\n✅ SUCESSO! Banner foi salvo e recuperado corretamente');
    } else {
      console.log('\n❌ ERRO! Banner não foi salvo corretamente');
      console.log('Esperado:', testData.title);
      console.log('Recebido:', getData2.data?.title);
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
};

// Executar teste
testBanner();
