#!/usr/bin/env node

/**
 * Script para testar a API real (HTTP) ao invés de acessar o banco direto
 */

const BANCA_ID = 'f96f1115-ece6-46d8-a948-20424a80ece0';
const API_URL = `http://localhost:3000/api/banca/${BANCA_ID}/products`;

async function main() {
  console.log('\n🔍 TESTANDO API REAL (HTTP)\n');
  console.log(`URL: ${API_URL}\n`);

  try {
    const response = await fetch(API_URL, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      }
    });

    if (!response.ok) {
      console.error(`❌ Erro HTTP: ${response.status} ${response.statusText}`);
      return;
    }

    const data = await response.json();

    console.log('✅ Resposta recebida!\n');
    console.log(`Total de produtos: ${data.total || 0}`);
    console.log(`Produtos próprios: ${data.stats?.proprios || 0}`);
    console.log(`Produtos distribuidores: ${data.stats?.distribuidores || 0}`);
    console.log(`É cotista: ${data.is_cotista}\n`);

    if (data.products && Array.isArray(data.products)) {
      // Filtrar produtos do Bambino
      const bambino = data.products.filter(p => 
        p.distribuidor_nome && p.distribuidor_nome.toLowerCase().includes('bambino')
      );

      console.log(`📦 Produtos do Bambino na resposta: ${bambino.length}\n`);

      // Filtrar produtos de bebidas
      const bebidas = data.products.filter(p => {
        const catName = p.category_name || p.category || '';
        return catName.toLowerCase().includes('bebidas') && 
               !catName.toLowerCase().includes('alcoólicas') &&
               !catName.toLowerCase().includes('alcoolicas');
      });

      console.log(`🥤 Produtos de Bebidas na resposta: ${bebidas.length}\n`);

      if (bebidas.length > 0) {
        console.log('   Produtos de bebidas encontrados:');
        bebidas.forEach(p => {
          const codigo = p.codigo_mercos || 'sem código';
          const dist = p.distribuidor_nome || 'sem dist';
          console.log(`   - [${codigo}] ${p.name?.slice(0, 50)} | ${dist}`);
        });
      }

      // Verificar se os 22 códigos específicos estão na resposta
      const CODIGOS_ESPERADOS = [
        '1220', '1219', '1158', '1159', '1225', '1224', '1157', '1001',
        '1283', '1230', '18152', '19321', '18266', '18267', '1236', '1280',
        '1165', '1228', '1218', '1155', '1156', '1235'
      ];

      console.log(`\n\n📋 Verificando os 22 códigos esperados:\n`);
      
      let encontrados = 0;
      for (const codigo of CODIGOS_ESPERADOS) {
        const produto = data.products.find(p => p.codigo_mercos === codigo);
        if (produto) {
          encontrados++;
          console.log(`✅ [${codigo}] ${produto.name?.slice(0, 50)}`);
        } else {
          console.log(`❌ [${codigo}] NÃO ENCONTRADO na resposta da API`);
        }
      }

      console.log(`\n📊 Produtos esperados encontrados: ${encontrados}/${CODIGOS_ESPERADOS.length}`);
    }

    console.log('');

  } catch (error) {
    console.error('❌ Erro ao chamar API:', error.message);
    console.log('\n⚠️  A aplicação está rodando? Tente:');
    console.log('   npm run dev');
    console.log('');
  }
}

main().catch(console.error);
