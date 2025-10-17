#!/usr/bin/env node

/**
 * Importa produtos direto no Supabase via API
 * 
 * CONFIGURAÇÃO:
 * Crie um arquivo .env.local com:
 * NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
 * NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
 * SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
 * 
 * USO:
 * node scripts/import-to-supabase.js brancaleone-products-1760723254011.json
 */

const fs = require('fs');
const path = require('path');

// Carregar variáveis de ambiente
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Erro: Configure SUPABASE_URL e SUPABASE_KEY no .env.local');
  process.exit(1);
}

const jsonFile = process.argv[2];

if (!jsonFile) {
  console.error('❌ Erro: Especifique o arquivo JSON');
  console.log('Uso: node scripts/import-to-supabase.js arquivo.json');
  process.exit(1);
}

console.log('🚀 Importando produtos no Supabase...\n');

const jsonPath = path.resolve(jsonFile);
const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`✅ ${products.length} produtos carregados\n`);

async function importProducts() {
  try {
    // 1. Criar distribuidor
    console.log('📦 Criando distribuidor...');
    const distributorResponse = await fetch(`${SUPABASE_URL}/rest/v1/distribuidores`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        name: 'Brancaleone Publicações',
        active: true
      })
    });

    if (!distributorResponse.ok && distributorResponse.status !== 409) {
      throw new Error(`Erro ao criar distribuidor: ${distributorResponse.status}`);
    }

    // Buscar ID do distribuidor
    const distributorsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/distribuidores?name=eq.Brancaleone Publicações&select=id`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const distributors = await distributorsResponse.json();
    const distributorId = distributors[0]?.id;

    if (!distributorId) {
      throw new Error('Distribuidor não encontrado');
    }

    console.log(`✅ Distribuidor ID: ${distributorId}\n`);

    // 2. Importar produtos em lotes
    const batchSize = 50;
    const batches = [];
    
    for (let i = 0; i < products.length; i += batchSize) {
      batches.push(products.slice(i, i + batchSize));
    }

    console.log(`📊 Importando ${batches.length} lotes de ${batchSize} produtos...\n`);

    let imported = 0;
    let errors = 0;

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const batchNumber = i + 1;

      process.stdout.write(`[${batchNumber}/${batches.length}] Importando produtos ${imported + 1}-${imported + batch.length}...`);

      const productsToInsert = batch.map((p, index) => ({
        code: p.code || `BRANC-${String(imported + index + 1).padStart(5, '0')}`,
        name: p.title || 'Sem título',
        description: p.description || '',
        price: 0,
        images: [p.image],
        distribuidor_id: distributorId,
        active: true,
        stock: 999
      }));

      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify(productsToInsert)
        });

        if (response.ok) {
          imported += batch.length;
          process.stdout.write(` ✅\n`);
        } else {
          const error = await response.text();
          errors += batch.length;
          process.stdout.write(` ❌ (${response.status})\n`);
          console.error(`   Erro: ${error.substring(0, 100)}...`);
        }
      } catch (error) {
        errors += batch.length;
        process.stdout.write(` ❌\n`);
        console.error(`   Erro: ${error.message}`);
      }

      // Pequeno delay entre lotes
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`\n✅ Importação concluída!`);
    console.log(`   Importados: ${imported}`);
    console.log(`   Erros: ${errors}\n`);

  } catch (error) {
    console.error('\n❌ Erro na importação:', error.message);
    process.exit(1);
  }
}

importProducts();
