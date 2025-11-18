#!/usr/bin/env node

/**
 * Script para debugar a query de produtos públicos
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const DISTRIBUIDORES_PUBLICOS = [
  '3a989c56-bbd3-4769-b076-a83483e39542', // Bambino
  '1511df09-1f4a-4e68-9f8c-05cd06be6269'  // Brancaleone
];

async function main() {
  console.log('\n🔍 DEBUGANDO QUERY DE PRODUTOS PÚBLICOS\n');

  // Buscar categoria Bebidas
  const { data: catBebidas } = await supabase
    .from('products')
    .select('category_id, categories(name)')
    .ilike('categories.name', 'bebidas')
    .limit(1);

  console.log('Categoria Bebidas lookup:', catBebidas);

  // Query 1: Apenas Bambino
  console.log('\n📦 Query 1: Produtos do Bambino (active=true):\n');
  const { data: bambino, error: err1 } = await supabase
    .from('products')
    .select('id, name, codigo_mercos, category_id, categories(name)')
    .eq('active', true)
    .eq('distribuidor_id', DISTRIBUIDORES_PUBLICOS[0]);

  if (err1) console.error('Erro:', err1.message);
  console.log(`Total: ${bambino?.length || 0}`);

  if (bambino) {
    // Buscar categoria Bebidas corretamente
    const { data: catBebidasCorreto } = await supabase
      .from('categories')
      .select('id, name')
      .ilike('name', 'bebidas')
      .neq('name', 'Bebidas Alcoólicas')
      .limit(1);

    if (catBebidasCorreto && catBebidasCorreto.length > 0) {
      const bebidas = bambino.filter(p => p.category_id === catBebidasCorreto[0].id);
      console.log(`Bebidas do Bambino: ${bebidas.length}`);
      
      if (bebidas.length > 0) {
        console.log('\nPrimeiros 10:');
        bebidas.slice(0, 10).forEach(p => {
          console.log(`  - [${p.codigo_mercos}] ${p.name.slice(0, 50)}`);
        });
      }
    }
  }

  // Query 2: Query da API (com join de categories)
  console.log('\n\n📦 Query 2: Como está na API (com join):\n');
  const { data: comJoin, error: err2 } = await supabase
    .from('products')
    .select(`
      *,
      categories!category_id(name)
    `)
    .eq('active', true)
    .in('distribuidor_id', DISTRIBUIDORES_PUBLICOS)
    .order('name', { ascending: true });

  if (err2) {
    console.error('❌ Erro:', err2.message);
  } else {
    console.log(`✅ Total: ${comJoin?.length || 0}`);
    
    if (comJoin) {
      // Contar por distribuidor
      const porDist = {};
      for (const p of comJoin) {
        porDist[p.distribuidor_id] = (porDist[p.distribuidor_id] || 0) + 1;
      }
      
      console.log('\nPor distribuidor:');
      for (const [dist, count] of Object.entries(porDist)) {
        const distNome = dist === DISTRIBUIDORES_PUBLICOS[0] ? 'Bambino' : 'Brancaleone';
        console.log(`  ${distNome}: ${count}`);
      }
      
      // Buscar categoria Bebidas
      const { data: catBebidasCorreto } = await supabase
        .from('categories')
        .select('id, name')
        .ilike('name', 'bebidas')
        .neq('name', 'Bebidas Alcoólicas')
        .limit(1);

      if (catBebidasCorreto && catBebidasCorreto.length > 0) {
        const bebidas = comJoin.filter(p => p.category_id === catBebidasCorreto[0].id);
        console.log(`\n🥤 Bebidas TOTAL: ${bebidas.length}`);
        
        const bebidasBambino = bebidas.filter(p => p.distribuidor_id === DISTRIBUIDORES_PUBLICOS[0]);
        const bebidasBrancaleone = bebidas.filter(p => p.distribuidor_id === DISTRIBUIDORES_PUBLICOS[1]);
        
        console.log(`  Bambino: ${bebidasBambino.length}`);
        console.log(`  Brancaleone: ${bebidasBrancaleone.length}`);
        
        if (bebidasBambino.length > 0) {
          console.log('\n  Bebidas do Bambino:');
          bebidasBambino.forEach(p => {
            console.log(`    - [${p.codigo_mercos}] ${p.name.slice(0, 50)}`);
          });
        }
      }
    }
  }

  console.log('');
}

main().catch(console.error);
