const fetch = require('node-fetch');

async function testSync() {
  console.log('🔄 Testando sincronização...');

  const payload = {
    companyToken: '4b866744-a086-11f0-ada6-5e65486a6283',
    distribuidorId: '1511df09-1f4a-4e68-9f8c-05cd06be6269',
    alteradoApos: '2025-11-01T02:50:00'
  };

  try {
    const response = await fetch('https://www.guiadasbancas.com.br/api/mercos/sync-sandbox-categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log('📡 Status:', response.status);
    console.log('📦 Resultado:', JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

testSync();
