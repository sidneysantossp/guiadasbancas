#!/usr/bin/env node

/**
 * Script para verificar produtos de bebidas do Bambino
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CODIGOS_BEBIDAS = [
  '1220', '1219', '1158', '1159', '1225', '1224', '1157', '1001',
  '1283', '1230', '18152', '19321', '18266', '18267', '1236', '1280',
  '1165', '1228', '1218', '1155', '1156', '1235'
];

async function main() {
  console.log('\n🔍 VERIFICANDO PRODUTOS DE BEBIDAS DO BAMBINO\n');

  // 1. Buscar categoria Bebidas
  const { data: catBebidas } = await supabase
    .from('categories')
    .select('id, name')
    .ilike('name', 'bebidas')
    .neq('name', 'Bebidas Alcoólicas')
    .limit(1);

  if (!catBebidas || catBebidas.length === 0) {
    console.error('❌ Categoria Bebidas não encontrada');
    return;
  }

  const categoriaBebidas = catBebidas[0];
  console.log(`✅ Categoria: ${categoriaBebidas.name} (ID: ${categoriaBebidas.id})\n`);

  // 2. Buscar distribuidor Bambino
  const { data: bambino } = await supabase
    .from('distribuidores')
    .select('id, nome')
    .ilike('nome', '%bambino%')
    .limit(1);

  if (!bambino || bambino.length === 0) {
    console.error('❌ Distribuidor Bambino não encontrado');
    return;
  }

  console.log(`✅ Distribuidor: ${bambino[0].nome} (ID: ${bambino[0].id})\n`);

  // 3. Buscar TODOS os produtos com esses códigos
  console.log('📦 Buscando produtos pelos códigos Mercos...\n');
  
  const { data: produtos, error } = await supabase
    .from('products')
    .select('id, name, codigo_mercos, distribuidor_id, category_id, active, categories(name)')
    .in('codigo_mercos', CODIGOS_BEBIDAS);

  if (error) {
    console.error('❌ Erro ao buscar produtos:', error.message);
    return;
  }

  console.log(`Total de produtos encontrados: ${produtos.length}\n`);

  if (produtos.length === 0) {
    console.error('❌ Nenhum produto encontrado com esses códigos!');
    return;
  }

  // 4. Analisar cada produto
  console.log('📋 STATUS DOS PRODUTOS:\n');
  
  let bambinoProdutos = 0;
  let emBebidas = 0;
  let ativos = 0;
  
  for (const codigo of CODIGOS_BEBIDAS) {
    const produto = produtos.find(p => p.codigo_mercos === codigo);
    
    if (!produto) {
      console.log(`❌ [${codigo}] NÃO ENCONTRADO NO BANCO`);
      continue;
    }

    const isBambino = produto.distribuidor_id === bambino[0].id;
    const isAtivo = produto.active;
    const catAtual = produto.categories?.name || 'Sem Categoria';
    const estaBebidas = produto.category_id === categoriaBebidas.id;
    
    if (isBambino) bambinoProdutos++;
    if (isAtivo) ativos++;
    if (estaBebidas) emBebidas++;
    
    const status = [];
    if (!isBambino) status.push('OUTRO DIST');
    if (!isAtivo) status.push('INATIVO');
    if (!estaBebidas) status.push(`CAT: ${catAtual}`);
    
    const icon = (isBambino && isAtivo && estaBebidas) ? '✅' : '⚠️';
    const statusStr = status.length > 0 ? ` [${status.join(', ')}]` : '';
    
    console.log(`${icon} [${codigo}] ${produto.name.slice(0, 45).padEnd(45)}${statusStr}`);
  }

  console.log('\n📊 RESUMO:');
  console.log(`   Total de produtos: ${produtos.length}/${CODIGOS_BEBIDAS.length}`);
  console.log(`   Do Bambino: ${bambinoProdutos}`);
  console.log(`   Ativos: ${ativos}`);
  console.log(`   Na categoria Bebidas: ${emBebidas}\n`);

  if (emBebidas < CODIGOS_BEBIDAS.length) {
    console.log(`⚠️  PROBLEMA: ${CODIGOS_BEBIDAS.length - emBebidas} produtos NÃO estão categorizados como Bebidas!\n`);
  }
}

main().catch(console.error);
