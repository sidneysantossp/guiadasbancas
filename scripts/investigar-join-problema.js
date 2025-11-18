#!/usr/bin/env node

/**
 * Script para investigar por que o JOIN limita os resultados
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BAMBINO_ID = '3a989c56-bbd3-4769-b076-a83483e39542';
const BRANCALEONE_ID = '1511df09-1f4a-4e68-9f8c-05cd06be6269';
const DISTRIBUIDORES_PUBLICOS = [BAMBINO_ID, BRANCALEONE_ID];

async function main() {
  console.log('\n🔍 INVESTIGANDO PROBLEMA DO JOIN\n');

  // 1. Produtos dos DOIS distribuidores SEM join
  const { data: semJoin } = await supabase
    .from('products')
    .select('id, name, category_id, active, distribuidor_id')
    .eq('active', true)
    .in('distribuidor_id', DISTRIBUIDORES_PUBLICOS);

  console.log(`📦 Produtos de Bambino+Brancaleone (sem join): ${semJoin?.length || 0}`);
  if (semJoin) {
    const bambino = semJoin.filter(p => p.distribuidor_id === BAMBINO_ID);
    const brancaleone = semJoin.filter(p => p.distribuidor_id === BRANCALEONE_ID);
    console.log(`   Bambino: ${bambino.length}`);
    console.log(`   Brancaleone: ${brancaleone.length}\n`);
  }

  // 2. Produtos dos DOIS distribuidores COM join
  const { data: comJoin, error } = await supabase
    .from('products')
    .select(`
      *,
      categories!category_id(name)
    `)
    .eq('active', true)
    .in('distribuidor_id', DISTRIBUIDORES_PUBLICOS)
    .order('name', { ascending: true });

  if (error) {
    console.error('❌ Erro no JOIN:', error.message);
    console.error('Detalhes:', error);
  }

  console.log(`📦 Produtos de Bambino+Brancaleone (com join): ${comJoin?.length || 0}`);
  if (comJoin) {
    const bambino = comJoin.filter(p => p.distribuidor_id === BAMBINO_ID);
    const brancaleone = comJoin.filter(p => p.distribuidor_id === BRANCALEONE_ID);
    console.log(`   Bambino: ${bambino.length}`);
    console.log(`   Brancaleone: ${brancaleone.length}\n`);
  }

  if (semJoin) {
    // Verificar quantos têm category_id NULL
    const semCategoria = semJoin.filter(p => !p.category_id);
    const comCategoria = semJoin.filter(p => p.category_id);

    console.log(`   Sem category_id: ${semCategoria.length}`);
    console.log(`   Com category_id: ${comCategoria.length}\n`);

    if (semCategoria.length > 0) {
      console.log(`⚠️  ${semCategoria.length} produtos SEM category_id não aparecem com JOIN!`);
      console.log('\nPrimeiros 10 produtos sem categoria:');
      semCategoria.slice(0, 10).forEach(p => {
        console.log(`  - ${p.name.slice(0, 60)}`);
      });
    }
  }

  // 3. Tentar com left join
  console.log('\n\n📦 Tentando com sintaxe diferente...\n');
  
  const { data: teste, error: err2 } = await supabase
    .from('products')
    .select('id, name, category_id, active')
    .eq('active', true)
    .eq('distribuidor_id', BAMBINO_ID)
    .limit(1000);

  console.log(`Sem join, limit 1000: ${teste?.length || 0}`);
  if (err2) console.error('Erro:', err2.message);

  console.log('');
}

main().catch(console.error);
