#!/usr/bin/env node

/**
 * Script para buscar IDs dos distribuidores Bambino e Brancaleone
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  console.log('\n🔍 BUSCANDO IDS DOS DISTRIBUIDORES\n');

  const { data: distribuidores, error } = await supabase
    .from('distribuidores')
    .select('id, nome')
    .or('nome.ilike.%bambino%,nome.ilike.%brancaleone%');

  if (error) {
    console.error('❌ Erro:', error.message);
    return;
  }

  if (!distribuidores || distribuidores.length === 0) {
    console.log('❌ Distribuidores não encontrados');
    return;
  }

  console.log('✅ Distribuidores encontrados:\n');
  for (const dist of distribuidores) {
    console.log(`   ${dist.nome}`);
    console.log(`   ID: ${dist.id}\n`);
  }

  // Contar produtos
  for (const dist of distribuidores) {
    const { data: produtos } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('active', true);

    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('active', true);

    console.log(`   ${dist.nome}: ${count || 0} produtos ativos`);
  }

  console.log('');
}

main().catch(console.error);
