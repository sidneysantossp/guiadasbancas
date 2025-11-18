#!/usr/bin/env node

/**
 * Script para testar se o limit funciona no Supabase
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
  console.log('\n🔍 TESTANDO LIMIT DO SUPABASE\n');

  // Teste 1: Sem limit
  console.log('📦 Teste 1: SEM limit\n');
  const { data: semLimit, error: err1 } = await supabase
    .from('products')
    .select('id, name, distribuidor_id')
    .eq('active', true)
    .in('distribuidor_id', DISTRIBUIDORES_PUBLICOS);

  if (err1) console.error('Erro:', err1.message);
  console.log(`Resultado: ${semLimit?.length || 0} produtos\n`);

  // Teste 2: Com limit 5000
  console.log('📦 Teste 2: COM limit(5000)\n');
  const { data: comLimit, error: err2 } = await supabase
    .from('products')
    .select('id, name, distribuidor_id')
    .eq('active', true)
    .in('distribuidor_id', DISTRIBUIDORES_PUBLICOS)
    .limit(5000);

  if (err2) console.error('Erro:', err2.message);
  console.log(`Resultado: ${comLimit?.length || 0} produtos\n`);

  if (comLimit) {
    const bambino = comLimit.filter(p => p.distribuidor_id === DISTRIBUIDORES_PUBLICOS[0]);
    const brancaleone = comLimit.filter(p => p.distribuidor_id === DISTRIBUIDORES_PUBLICOS[1]);
    console.log(`   Bambino: ${bambino.length}`);
    console.log(`   Brancaleone: ${brancaleone.length}\n`);
  }

  // Teste 3: Buscar APENAS Bambino
  console.log('📦 Teste 3: APENAS Bambino (sem limit)\n');
  const { data: bambino, error: err3 } = await supabase
    .from('products')
    .select('id, name')
    .eq('active', true)
    .eq('distribuidor_id', DISTRIBUIDORES_PUBLICOS[0]);

  if (err3) console.error('Erro:', err3.message);
  console.log(`Resultado: ${bambino?.length || 0} produtos\n`);

  // Teste 4: Buscar Bambino + Brancaleone separadamente
  console.log('📦 Teste 4: Buscar separadamente e combinar\n');
  
  const { data: bambino2 } = await supabase
    .from('products')
    .select('id, name, distribuidor_id')
    .eq('active', true)
    .eq('distribuidor_id', DISTRIBUIDORES_PUBLICOS[0]);

  const { data: brancaleone2 } = await supabase
    .from('products')
    .select('id, name, distribuidor_id')
    .eq('active', true)
    .eq('distribuidor_id', DISTRIBUIDORES_PUBLICOS[1]);

  const total = (bambino2?.length || 0) + (brancaleone2?.length || 0);
  console.log(`   Bambino: ${bambino2?.length || 0}`);
  console.log(`   Brancaleone: ${brancaleone2?.length || 0}`);
  console.log(`   Total combinado: ${total}\n`);

  console.log('');
}

main().catch(console.error);
