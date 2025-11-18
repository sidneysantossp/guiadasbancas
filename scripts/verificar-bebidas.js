#!/usr/bin/env node

/**
 * Script para verificar se os produtos de bebidas estão corretamente categorizados
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Códigos dos produtos de bebidas
const CODIGOS_BEBIDAS = [
  '1220', '1219', '1158', '1159', '1225', '1224', '1157', '1001',
  '1283', '1230', '18152', '19321', '18266', '18267', '1236', '1280',
  '1165', '1228', '1218', '1155', '1156', '1235'
];

async function main() {
  console.log('\n🔍 VERIFICANDO STATUS DOS PRODUTOS DE BEBIDAS\n');

  // Buscar categoria Bebidas
  const { data: categorias } = await supabase
    .from('categories')
    .select('id, name')
    .ilike('name', '%bebidas%')
    .neq('name', 'Bebidas Alcoólicas');

  if (!categorias || categorias.length === 0) {
    console.error('❌ Categoria Bebidas não encontrada');
    return;
  }

  const categoriaBebidas = categorias[0];
  console.log(`✅ Categoria: ${categoriaBebidas.name} (ID: ${categoriaBebidas.id})\n`);

  // Buscar produtos
  const { data: produtos, error } = await supabase
    .from('products')
    .select('id, name, codigo_mercos, category_id, categories(name), active')
    .in('codigo_mercos', CODIGOS_BEBIDAS);

  if (error) {
    console.error('❌ Erro ao buscar produtos:', error.message);
    return;
  }

  console.log(`📦 Total de produtos encontrados: ${produtos.length}\n`);

  let corretos = 0;
  let incorretos = 0;
  let inativos = 0;

  console.log('STATUS DOS PRODUTOS:\n');
  
  for (const codigo of CODIGOS_BEBIDAS) {
    const produto = produtos.find(p => p.codigo_mercos === codigo);
    
    if (!produto) {
      console.log(`❌ [${codigo}] NÃO ENCONTRADO no banco`);
      continue;
    }

    if (!produto.active) {
      console.log(`⚠️  [${codigo}] ${produto.name.slice(0, 50)} - INATIVO`);
      inativos++;
      continue;
    }

    const catAtual = produto.categories?.name || 'Sem Categoria';
    const emBebidas = produto.category_id === categoriaBebidas.id;
    
    if (emBebidas) {
      console.log(`✅ [${codigo}] ${produto.name.slice(0, 50)} - OK`);
      corretos++;
    } else {
      console.log(`❌ [${codigo}] ${produto.name.slice(0, 50)} - ${catAtual}`);
      incorretos++;
    }
  }

  console.log('\n📊 RESUMO:');
  console.log(`   ✅ Corretos (em Bebidas): ${corretos}`);
  console.log(`   ❌ Incorretos (outra categoria): ${incorretos}`);
  console.log(`   ⚠️  Inativos: ${inativos}`);
  console.log(`   Total: ${corretos + incorretos + inativos}/${CODIGOS_BEBIDAS.length}\n`);

  if (incorretos > 0) {
    console.log('⚠️  Alguns produtos precisam ser recategorizados!\n');
  } else {
    console.log('🎉 Todos os produtos estão corretamente categorizados!\n');
  }
}

main().catch(console.error);
