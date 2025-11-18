#!/usr/bin/env node

/**
 * Script para verificar e corrigir status de cotista da banca
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ID da banca de teste (Banca Interlagos)
const BANCA_ID = 'f96f1115-ece6-46d8-a948-20424a80ece0';

async function main() {
  console.log('\n🔍 VERIFICANDO STATUS DE COTISTA\n');

  // 1. Buscar status atual da banca
  const { data: banca, error: bancaError } = await supabase
    .from('bancas')
    .select('id, name, is_cotista, cotista_id')
    .eq('id', BANCA_ID)
    .single();

  if (bancaError) {
    console.error('❌ Erro ao buscar banca:', bancaError.message);
    return;
  }

  if (!banca) {
    console.error('❌ Banca não encontrada');
    return;
  }

  console.log('📊 STATUS ATUAL DA BANCA:\n');
  console.log(`   Nome: ${banca.name}`);
  console.log(`   ID: ${banca.id}`);
  console.log(`   is_cotista: ${banca.is_cotista}`);
  console.log(`   cotista_id: ${banca.cotista_id || '(não definido)'}`);

  const isCotista = banca.is_cotista === true && !!banca.cotista_id;
  console.log(`\n   Status final: ${isCotista ? '✅ É COTISTA' : '❌ NÃO É COTISTA'}`);

  if (!isCotista) {
    console.log('\n⚠️  PROBLEMA IDENTIFICADO:');
    console.log('   A banca NÃO é cotista, então produtos de distribuidores NÃO aparecem!');
    console.log('\n💡 SOLUÇÃO:');
    console.log('   Para que produtos do Bambino apareçam, a banca precisa:');
    console.log('   1. Ter is_cotista = true');
    console.log('   2. Ter um cotista_id válido');
    
    console.log('\n🔧 Deseja tornar esta banca COTISTA? (será necessário criar/vincular um cotista)');
    console.log('   Execute: node scripts/tornar-banca-cotista.js\n');
  } else {
    console.log('\n✅ A banca É cotista!');
    console.log('   Todos os produtos de distribuidores ativos devem aparecer automaticamente.');
    console.log('   Se não estão aparecendo, pode ser um problema de cache ou filtro no frontend.\n');
  }

  // 2. Buscar quantos produtos de distribuidor existem
  const { data: produtosDistribuidor, error: prodError } = await supabase
    .from('products')
    .select('id, name, distribuidor_id')
    .eq('active', true)
    .not('distribuidor_id', 'is', null);

  if (!prodError && produtosDistribuidor) {
    console.log(`\n📦 PRODUTOS DE DISTRIBUIDORES DISPONÍVEIS: ${produtosDistribuidor.length}`);
    
    // Contar por distribuidor
    const porDist = {};
    for (const p of produtosDistribuidor) {
      porDist[p.distribuidor_id] = (porDist[p.distribuidor_id] || 0) + 1;
    }

    const distIds = Object.keys(porDist);
    if (distIds.length > 0) {
      const { data: distribuidores } = await supabase
        .from('distribuidores')
        .select('id, nome')
        .in('id', distIds);

      if (distribuidores) {
        console.log('\n   Por distribuidor:');
        for (const dist of distribuidores) {
          console.log(`   - ${dist.nome}: ${porDist[dist.id]} produtos`);
        }
      }
    }
  }

  console.log('');
}

main().catch(console.error);
